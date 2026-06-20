import time
from fastapi import HTTPException
from app.models.db import supabase
from app.services.gemini_service import (
    detect_answer_layout,
    extract_single_answer_text
)
from app.services.openai_service import grade_question
from app.utils.db_helpers import (
    fetch_exam_questions_with_labels,
    update_submission_status
)
from app.utils.sanitize import sanitize_extracted_text
from app.utils.optional_questions_rules import apply_optional_question_rules
from app.utils.score_aggregator import aggregate_scores
from app.utils.logger import logger

def normalize_label(label: str) -> str:
    if not label:
        return ""
    # "Q.1 A", "Q1 A", "Q1a", "Q1A", "Q1-a", "Q01a" -> "q1a"
    cleaned = label.lower()
    cleaned = ''.join(c for c in cleaned if c.isalnum())
    # replace q01 with q1
    import re
    cleaned = re.sub(r'q0+(\d)', r'q\1', cleaned)
    return cleaned

def extract_answers(submission_id: str, assignment_id: str, pages: list, mime_type: str = 'image/jpeg') -> dict:
    if not submission_id or not assignment_id or not pages:
        raise HTTPException(status_code=400, detail="Missing submissionId, assignmentId, or pages array")

    # Split PDF into pages if it's sent as a single base64 string
    if mime_type == 'application/pdf' and len(pages) == 1:
        try:
            from io import BytesIO
            from pypdf import PdfReader, PdfWriter
            import base64
            
            pdf_bytes = base64.b64decode(pages[0])
            reader = PdfReader(BytesIO(pdf_bytes))
            split_pages = []
            for page_num in range(len(reader.pages)):
                writer = PdfWriter()
                writer.add_page(reader.pages[page_num])
                output_stream = BytesIO()
                writer.write(output_stream)
                page_bytes = output_stream.getvalue()
                split_pages.append(base64.b64encode(page_bytes).decode('utf-8'))
            
            if split_pages:
                pages = split_pages
                logger.info(f"[extract-answers] Successfully split PDF into {len(pages)} pages")
        except Exception as split_err:
            logger.error(f"[extract-answers] Failed to split PDF: {split_err}")

    # Fetch questions
    questions = fetch_exam_questions_with_labels(assignment_id)
    if not questions:
        raise HTTPException(
            status_code=400,
            detail="No questions found for this assignment. Run /api/parse-question-paper first."
        )

    # Set status
    update_submission_status(submission_id, 'extracting')

    # Pass 2A: Layout Analysis
    layout = detect_answer_layout(pages, questions, mime_type)
    raw_map = layout.get("answer_map", [])

    # Map labels to canonical DB labels
    answer_map = []
    for entry in raw_map:
        lbl = entry.get("question_label")
        matched = None
        for q in questions:
            if normalize_label(q.get("question_label")) == normalize_label(lbl):
                matched = q
                break
        
        if matched:
            entry["question_label"] = matched["question_label"]
        answer_map.append(entry)

    # Update submission record with answer map
    supabase.table('submissions').update({"answer_map": answer_map}).eq('id', submission_id).execute()

    # Pass 2B: Targeted Extractions
    extracted_answers = []
    for map_entry in answer_map:
        if not map_entry.get("attempted"):
            continue

        question = None
        for q in questions:
            if q.get("question_label") == map_entry.get("question_label"):
                question = q
                break

        if not question:
            logger.warning(f"[extract-answers] No DB question found for label {map_entry.get('question_label')} — skipping")
            continue

        # Collect relevant pages
        page_refs = map_entry.get("page_refs", [])
        relevant_pages = []
        for ref in page_refs:
            idx = ref.get("page", 1) - 1
            if 0 <= idx < len(pages):
                relevant_pages.append(pages[idx])

        pages_to_use = relevant_pages if relevant_pages else pages

        try:
            extracted_text = extract_single_answer_text(
                pages_to_use,
                question.get("question_text"),
                map_entry.get("question_label"),
                mime_type
            )
            extracted_text = sanitize_extracted_text(extracted_text)

            extracted_answers.append({
                "submission_id": submission_id,
                "question_id": question.get("id"),
                "question_label": map_entry.get("question_label"),
                "extracted_text": extracted_text,
                "page_numbers": [ref.get("page") for ref in page_refs],
                "confidence": 0.6 if "[ILLEGIBLE]" in extracted_text else 0.9
            })

            time.sleep(4.0)
        except Exception as e:
            logger.error(f"[extract-answers] Failed Pass 2B for {map_entry.get('question_label')}: {e}")
            extracted_answers.append({
                "submission_id": submission_id,
                "question_id": question.get("id"),
                "question_label": map_entry.get("question_label"),
                "extracted_text": "[EXTRACTION FAILED — MANUAL REVIEW REQUIRED]",
                "page_numbers": [ref.get("page") for ref in page_refs],
                "confidence": 0.0
            })

    # Fallback Pass 2B for missed questions
    mapped_norms = {normalize_label(e.get("question_label")) for e in answer_map}
    orphans = [q for q in questions if normalize_label(q.get("question_label")) not in mapped_norms]

    if orphans:
        logger.warning(f"[extract-answers] Pass 2A missed {len(orphans)} questions. Recovering...")
        fallback_pages = pages[:4]

        for question in orphans:
            try:
                extracted_text = extract_single_answer_text(
                    fallback_pages,
                    question.get("question_text"),
                    question.get("question_label"),
                    mime_type
                )
                extracted_text = sanitize_extracted_text(extracted_text)

                if not extracted_text or extracted_text.strip() == '[NO ANSWER FOUND]':
                    continue

                extracted_answers.append({
                    "submission_id": submission_id,
                    "question_id": question.get("id"),
                    "question_label": question.get("question_label"),
                    "extracted_text": extracted_text,
                    "page_numbers": list(range(1, len(fallback_pages) + 1)),
                    "confidence": 0.5 if "[ILLEGIBLE]" in extracted_text else 0.7
                })

                time.sleep(4.0)
            except Exception as e:
                logger.error(f"[extract-answers] Fallback failed for {question.get('question_label')}: {e}")

    # Delete stale data
    supabase.table('submission_answers').delete().eq('submission_id', submission_id).execute()
    supabase.table('question_grades').delete().eq('submission_id', submission_id).execute()

    # Save answers (deduplicated by question_id to avoid unique constraint violations)
    seen_question_ids = set()
    unique_extracted_answers = []
    for ans in extracted_answers:
        q_id = ans.get("question_id")
        if q_id not in seen_question_ids:
            seen_question_ids.add(q_id)
            unique_extracted_answers.append(ans)

    for ans in unique_extracted_answers:
        supabase.table('submission_answers').insert(ans).execute()

    # Reset status
    update_submission_status(submission_id, 'pending')

    return {
        "answer_map": answer_map,
        "submission_answers_count": len(unique_extracted_answers),
        "extracted_answers": [
            {
                "question_label": a.get("question_label"),
                "has_text": bool(a.get("extracted_text") and "[NO ANSWER FOUND]" not in a.get("extracted_text")),
                "confidence": a.get("confidence"),
                "text_preview": (a.get("extracted_text") or "")[:100] + ("..." if len(a.get("extracted_text") or "") > 100 else "")
            }
            for a in unique_extracted_answers
        ]
    }

def grade_submission(submission_id: str, assignment_id: str) -> dict:
    if not submission_id or not assignment_id:
        raise HTTPException(status_code=400, detail="Missing submissionId or assignmentId")

    # Fetch assignment
    a_res = supabase.table('assignments').select('id, title, description, max_score, optional_question_policy').eq('id', assignment_id).execute()
    if not a_res.data:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assignment = a_res.data[0]

    # Fetch questions
    q_res = supabase.table('exam_questions').select('id, question_text, points, question_order, optional_group').eq('assignment_id', assignment_id).order('question_order', desc=False).execute()
    questions = q_res.data or []

    # Fetch rubrics
    r_res = supabase.table('exam_rubrics').select('rubric_content').eq('assignment_id', assignment_id).execute()
    rubrics = r_res.data or []
    rubric_text = "\n".join([r.get("rubric_content") for r in rubrics]) if rubrics else None

    # Fetch model answers
    ma_res = supabase.table('model_answers').select('question_id, answer_text').eq('assignment_id', assignment_id).execute()
    model_answer_map = {row["question_id"]: row["answer_text"] for row in (ma_res.data or [])}

    # Fetch submission answers
    sa_res = supabase.table('submission_answers').select('*').eq('submission_id', submission_id).execute()
    submission_answers = sa_res.data or []

    if not submission_answers or not questions:
        raise HTTPException(
            status_code=400,
            detail="No extracted answers found for this submission. Run extract-answers first."
        )

    # Set status to grading
    update_submission_status(submission_id, 'grading')

    raw_grades = []
    # Grade questions
    for sa in submission_answers:
        question = next((q for q in questions if q.get("id") == sa.get("question_id")), None)
        if not question:
            continue

        model_answer = model_answer_map.get(question.get("id"))

        try:
            grade = grade_question(
                question_label=sa.get("question_label"),
                question_text=question.get("question_text"),
                max_marks=question.get("points"),
                student_answer=sa.get("extracted_text") or "[NO ANSWER FOUND]",
                rubric_criteria=rubric_text,
                model_answer=model_answer,
                assignment_context=assignment.get("title", "")
            )

            raw_grades.append({
                "submission_id": submission_id,
                "question_id": question.get("id"),
                "question_label": sa.get("question_label"),
                "ai_score": grade.get("score"),
                "max_score": question.get("points"),
                "ai_feedback": grade.get("feedback"),
                "rubric_breakdown": grade.get("rubric_breakdown") or [],
                "confidence": grade.get("confidence"),
                "optional_group": question.get("optional_group"),
                "attempted": True,
                "is_counted": True
            })
        except Exception as err:
            logger.error(f"[grade-submission] Failed grading {sa.get('question_label')}: {err}")
            raw_grades.append({
                "submission_id": submission_id,
                "question_id": question.get("id"),
                "question_label": sa.get("question_label"),
                "ai_score": 0.0,
                "max_score": question.get("points"),
                "ai_feedback": "Grading failed — requires manual review",
                "confidence": "low",
                "optional_group": question.get("optional_group"),
                "is_counted": True
            })

        # Tiny delay between OpenAI requests
        time.sleep(0.2)

    # Apply optional question rules
    policy = assignment.get("optional_question_policy") or 'educator_choice'
    processed_grades = apply_optional_question_rules(raw_grades, policy)

    # Upsert question_grades
    for g in processed_grades:
        upsert_data = {
            "submission_id": g.get("submission_id"),
            "question_id": g.get("question_id"),
            "question_label": g.get("question_label"),
            "ai_score": round(g.get("ai_score")),
            "max_score": g.get("max_score"),
            "ai_feedback": g.get("ai_feedback"),
            "rubric_breakdown": g.get("rubric_breakdown") or [],
            "confidence": g.get("confidence"),
            "is_counted": g.get("is_counted")
        }
        supabase.table('question_grades').upsert(
            upsert_data,
            on_conflict='submission_id,question_id'
        ).execute()

    # Aggregate scores
    agg = aggregate_scores(processed_grades)
    final_score = agg["finalScore"]
    max_possible = agg["maxPossible"]
    needs_educator_choice = agg["needsEducatorChoice"]
    low_confidence_count = agg["lowConfidenceCount"]

    # Build feedback summary
    feedback_summary = "\n\n".join(
        [f"{g.get('question_label')} [{g.get('ai_score')}/{g.get('max_score')}]: {g.get('ai_feedback')}"
         for g in processed_grades if g.get("is_counted")]
    )

    # Update submission
    status = 'grading' if needs_educator_choice else 'aggregated'
    supabase.table('submissions').update({
        "ai_score": round(final_score),
        "ai_feedback": feedback_summary,
        "grading_status": status
    }).eq('id', submission_id).execute()

    return {
        "ai_score": final_score,
        "ai_feedback": feedback_summary,
        "max_possible": max_possible,
        "question_grades": processed_grades,
        "needs_educator_choice": needs_educator_choice,
        "low_confidence_count": low_confidence_count,
        "grading_method": "question_centric"
    }

def grade_question_endpoint(submission_id: str, question_id: str, assignment_id: str) -> dict:
    if not submission_id or not question_id or not assignment_id:
        raise HTTPException(status_code=400, detail="Missing submissionId, questionId, or assignmentId")

    # Fetch answer
    sa_res = supabase.table('submission_answers').select('*').eq('submission_id', submission_id).eq('question_id', question_id).execute()
    if not sa_res.data:
        raise HTTPException(status_code=404, detail="Submission answer not found for this question")
    sa = sa_res.data[0]

    # Fetch question
    q_res = supabase.table('exam_questions').select('*').eq('id', question_id).execute()
    if not q_res.data:
        raise HTTPException(status_code=404, detail="Question not found")
    question = q_res.data[0]

    # Fetch assignment
    a_res = supabase.table('assignments').select('title').eq('id', assignment_id).execute()
    assignment_title = a_res.data[0].get("title", "") if a_res.data else ""

    # Fetch rubric
    r_res = supabase.table('exam_rubrics').select('rubric_content').eq('assignment_id', assignment_id).execute()
    rubric_text = "\n".join([r.get("rubric_content") for r in r_res.data]) if r_res.data else None

    # Fetch model answer
    ma_res = supabase.table('model_answers').select('answer_text').eq('question_id', question_id).eq('assignment_id', assignment_id).execute()
    model_answer = ma_res.data[0].get("answer_text") if ma_res.data else None

    grade = grade_question(
        question_label=sa.get("question_label"),
        question_text=question.get("question_text"),
        max_marks=question.get("points"),
        student_answer=sa.get("extracted_text") or "[NO ANSWER FOUND]",
        rubric_criteria=rubric_text,
        model_answer=model_answer,
        assignment_context=assignment_title
    )

    upsert_data = {
        "submission_id": submission_id,
        "question_id": question_id,
        "question_label": sa.get("question_label"),
        "ai_score": grade.get("score"),
        "max_score": question.get("points"),
        "ai_feedback": grade.get("feedback"),
        "rubric_breakdown": grade.get("rubric_breakdown") or [],
        "confidence": grade.get("confidence"),
        "is_counted": True
    }
    res = supabase.table('question_grades').upsert(
        upsert_data,
        on_conflict='submission_id,question_id'
    ).execute()

    return {"question_grade": res.data[0] if res.data else {}}

def aggregate_scores_endpoint(submission_id: str, assignment_id: str) -> dict:
    if not submission_id or not assignment_id:
        raise HTTPException(status_code=400, detail="Missing submissionId or assignmentId")

    # Fetch assignment policy
    a_res = supabase.table('assignments').select('max_score, optional_question_policy').eq('id', assignment_id).execute()
    assignment = a_res.data[0] if a_res.data else {}

    # Fetch grades
    g_res = supabase.table('question_grades').select('*, exam_questions(optional_group)').eq('submission_id', submission_id).execute()
    grades = g_res.data or []

    if not grades:
        raise HTTPException(status_code=404, detail="No question grades found for this submission. Run grading first.")

    # Attach optional group
    grades_with_group = []
    for g in grades:
        g_copy = dict(g)
        eq = g.get("exam_questions") or {}
        g_copy["optional_group"] = eq.get("optional_group")
        grades_with_group.append(g_copy)

    policy = assignment.get("optional_question_policy") or 'educator_choice'
    processed = apply_optional_question_rules(grades_with_group, policy)
    agg = aggregate_scores(processed)

    # Update submissions record
    status = 'grading' if agg["needsEducatorChoice"] else 'aggregated'
    supabase.table('submissions').update({
        "ai_score": agg["finalScore"],
        "grading_status": status
    }).eq('id', submission_id).execute()

    return {
        "final_score": agg["finalScore"],
        "max_possible": agg["maxPossible"],
        "breakdown": agg["breakdown"],
        "needs_educator_choice": agg["needsEducatorChoice"],
        "low_confidence_count": agg["lowConfidenceCount"]
    }

def get_question_grades(submission_id: str) -> list:
    res = supabase.table('question_grades').select('*').eq('submission_id', submission_id).order('question_label', desc=False).execute()
    return res.data or []

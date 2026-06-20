import json
from fastapi import HTTPException, UploadFile
from app.models.db import supabase
from app.services.gemini_service import (
    parse_question_paper_structure,
    parse_model_answers_structure,
    extract_questions_from_pdf_text,
    extract_model_answers_from_pdf_text
)
from app.utils.db_helpers import fetch_exam_questions_with_labels
from app.utils.pdf_parser import parse_pdf_buffer
from app.utils.logger import logger

def parse_question_paper(assignment_id: str, images: list, mime_type: str = 'image/jpeg') -> dict:
    if not assignment_id or not images:
        raise HTTPException(status_code=400, detail="Missing assignmentId or images array")

    parsed = parse_question_paper_structure(images, mime_type)
    questions = parsed.get("questions", [])
    total_marks = parsed.get("total_marks")

    # Clear old questions
    delete_res = supabase.table('exam_questions').delete().eq('assignment_id', assignment_id).execute()

    question_order = 0
    inserted_questions = []

    for q in questions:
        question_order += 1
        insert_data = {
            "assignment_id": assignment_id,
            "question_text": q.get("question_text"),
            "points": q.get("marks") or q.get("total_marks") or 0,
            "question_order": question_order,
            "optional_group": q.get("optional_group") or None,
            "question_label": q.get("question_label") or None
        }
        res = supabase.table('exam_questions').insert(insert_data).execute()
        if res.data:
            inserted_questions.append({**res.data[0], "question_label": q.get("question_label")})

    if total_marks:
        supabase.table('assignments').update({"max_score": total_marks}).eq('id', assignment_id).execute()

    return {
        "questions": inserted_questions,
        "total_marks": total_marks,
        "raw_structure": parsed
    }

def parse_model_answers(assignment_id: str, images: list, mime_type: str = 'image/jpeg') -> dict:
    if not assignment_id or not images:
        raise HTTPException(status_code=400, detail="Missing assignmentId or images array")

    questions_with_labels = fetch_exam_questions_with_labels(assignment_id)
    if not questions_with_labels:
        raise HTTPException(status_code=400, detail="No questions found for this assignment.")

    parsed = parse_model_answers_structure(images, questions_with_labels, mime_type)
    inserted_answers = []

    for ans in parsed.get("model_answers", []):
        upsert_data = {
            "assignment_id": assignment_id,
            "question_id": ans.get("question_id"),
            "answer_text": ans.get("answer_text"),
            "key_concepts": ans.get("key_concepts") or []
        }
        res = supabase.table('model_answers').upsert(
            upsert_data,
            on_conflict='assignment_id,question_id'
        ).execute()
        if res.data:
            inserted_answers.append(res.data[0])

    return {
        "model_answers": inserted_answers,
        "raw_structure": parsed
    }

async def extract_questions_pdf(file: UploadFile) -> dict:
    pdf_bytes = await file.read()
    pdf_text = None
    try:
        pdf_text = parse_pdf_buffer(pdf_bytes)
    except HTTPException as e:
        if "empty or unreadable" not in e.detail:
            raise e
        logger.info("[extract-questions-pdf] Text extraction empty — falling back to Gemini Vision")

    questions_array = []
    if pdf_text:
        questions_array = extract_questions_from_pdf_text(pdf_text)
    else:
        # Scanned PDF path
        import base64
        base64_pdf = base64.b64encode(pdf_bytes).decode('utf-8')
        parsed = parse_question_paper_structure([base64_pdf], 'application/pdf')

        for q in parsed.get("questions", []):
            questions_array.append({
                "question_label": q.get("question_label") or None,
                "text": q.get("question_text") or "",
                "points": q.get("marks") or q.get("total_marks") or 10
            })

    # Strip modelAnswer field
    for q in questions_array:
        q.pop("modelAnswer", None)

    return {
        "success": True,
        "questions": questions_array
    }

async def extract_model_answers_pdf(file: UploadFile, questions_str: str) -> dict:
    if not questions_str:
        raise HTTPException(status_code=400, detail="No questions provided mapping")

    try:
        questions = json.loads(questions_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid questions JSON")

    pdf_bytes = await file.read()
    pdf_text = parse_pdf_buffer(pdf_bytes)

    model_answers = extract_model_answers_from_pdf_text(pdf_text, questions)

    return {
        "success": True,
        "model_answers": model_answers
    }

async def parse_rubric_pdf(file: UploadFile) -> dict:
    pdf_bytes = await file.read()
    pdf_text = parse_pdf_buffer(pdf_bytes)

    return {
        "success": True,
        "extractedText": pdf_text.strip()
    }

from app.models.db import supabase

def fetch_exam_questions(assignment_id: str) -> list:
    """
    Fetch all exam questions for an assignment, ordered by question_order.
    """
    res = supabase.table('exam_questions') \
                  .select('id, question_text, points, question_order, optional_group, question_label') \
                  .eq('assignment_id', assignment_id) \
                  .order('question_order', desc=False) \
                  .execute()
    return res.data or []

def fetch_exam_questions_with_labels(assignment_id: str) -> list:
    """
    Fetch exam questions for an assignment, requiring that every row has a question_label.
    """
    questions = fetch_exam_questions(assignment_id)
    missing = [q for q in questions if not q.get('question_label')]
    if missing:
        raise ValueError(
            f"{len(missing)} question(s) for assignment {assignment_id} have no question_label. "
            f"Run /api/parse-question-paper first so labels are stored from the question paper."
        )
    return questions

def update_submission_status(submission_id: str, status: str):
    """
    Update the grading_status column for a single submission.
    """
    supabase.table('submissions') \
            .update({'grading_status': status}) \
            .eq('id', submission_id) \
            .execute()

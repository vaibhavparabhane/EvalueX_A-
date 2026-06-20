import json
import time
from openai import OpenAI
from app.config.config import settings
from app.utils.logger import logger

# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)

def call_openai_with_retry(fn, max_retries: int = 3):
    for attempt in range(1, max_retries + 1):
        try:
            return fn()
        except Exception as err:
            err_msg = str(err).lower()
            is_retryable = any(code in err_msg for code in ['rate_limit', 'rate limit', '429', '503', '500', '502', 'connection', 'timeout', 'overloaded'])
            
            if is_retryable and attempt < max_retries:
                wait_time = 5 + (attempt * 5)
                logger.warning(f"[OpenAI API] Transient error ({err}). Waiting {wait_time}s before retry {attempt}/{max_retries}")
                time.sleep(wait_time)
            else:
                raise err

def grade_question(
    question_label: str,
    question_text: str,
    max_marks: float,
    student_answer: str,
    rubric_criteria: str = None,
    model_answer: str = None,
    assignment_context: str = ""
) -> dict:
    """
    Grade a single question using GPT-4o with rubric-guided reasoning.
    """
    system_prompt = """You are an experienced university examiner grading a student's answer.

CRITICAL RULES:
1. Award marks based on conceptual understanding, NOT word-for-word similarity to the model answer
2. A student using different but correct terminology deserves full credit
3. Apply partial marks where the rubric permits — do not give 0 if the student showed partial understanding
4. If the student answer is [NO ANSWER FOUND] or blank, award 0 with feedback "No answer provided"
5. Be specific in your feedback — mention what was correct, what was missing, and what would earn more marks. 
6. If an answer is somewhat related you can award some marks but be clear in feedback about what was correct and what was missing. Do NOT give full marks for an answer that is only partially correct or off-topic.
7. You MUST return valid JSON only, no extra text outside the JSON block"""

    user_message = f"""QUESTION ({question_label}):
{question_text}

MAXIMUM MARKS: {max_marks}
{f"SUBJECT/COURSE: {assignment_context}" if assignment_context else ""}"""

    if rubric_criteria:
        user_message += f"\n\nGRADING RUBRIC (apply these criteria strictly):\n{rubric_criteria}"

    if model_answer:
        user_message += f"\n\nMODEL ANSWER:\n{model_answer}"

    user_message += f"""\n\nSTUDENT'S ANSWER:
{student_answer or '[NO ANSWER FOUND]'}

Respond with ONLY this JSON (no markdown, no code blocks, raw JSON only):
{{
  "score": <number between 0 and {max_marks}, can be decimal like 3.5>,
  "max_score": {max_marks},
  "confidence": "<high|medium|low>",
  "feedback": "<specific constructive feedback string, 2-4 sentences>",
  "rubric_breakdown": [
    {{ "criterion": "<criterion name or description>", "awarded": <number>, "max": <number> }}
  ]
}}"""

    response = call_openai_with_retry(lambda: client.chat.completions.create(
        model='gpt-4o',
        temperature=0.2,
        response_format={'type': 'json_object'},
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_message},
        ]
    ))

    raw_text = response.choices[0].message.content

    try:
        parsed = json.loads(raw_text)
        # Clamp score to valid range
        score = float(parsed.get("score") or 0.0)
        parsed["score"] = max(0.0, min(float(max_marks), score))
        parsed["max_score"] = max_marks
        return parsed
    except Exception as e:
        logger.error(f"[grade_question] Failed to parse OpenAI output: {raw_text}")
        raise ValueError(f"GPT-4o returned invalid JSON for {question_label}: {str(e)}")

import base64
import time
import json
import re
from google import genai
from google.genai import types
from app.config.config import settings
from app.utils.logger import logger

# Initialize Google GenAI client
client = genai.Client(api_key=settings.gemini_api_key)

def strip_base64_prefix(b64_str: str) -> str:
    if not isinstance(b64_str, str):
        return b64_str
    # Remove prefix like "data:image/jpeg;base64," if present
    if "," in b64_str:
        return b64_str.split(",")[-1]
    return b64_str

def get_inline_part(b64_str: str, mime_type: str = 'image/jpeg') -> types.Part:
    clean_b64 = strip_base64_prefix(b64_str)
    return types.Part.from_bytes(
        data=base64.b64decode(clean_b64),
        mime_type=mime_type
    )

def call_gemini_with_retry(fn, max_retries: int = 3):
    for attempt in range(1, max_retries + 1):
        try:
            return fn()
        except Exception as err:
            err_msg = str(err).lower()
            is_retryable = any(code in err_msg for code in ['429', '503', '500', '502', 'connection', 'rate limit', 'overloaded', 'quota'])
            
            if is_retryable and attempt < max_retries:
                if any(code in err_msg for code in ['429', 'rate limit', 'quota']):
                    wait_time = 35 + (attempt * 15)  # 50s on first retry, 65s on second
                else:
                    wait_time = attempt * 8
                logger.warning(f"[Gemini API] Transient error ({err}). Waiting {wait_time}s before retry {attempt}/{max_retries}")
                time.sleep(wait_time)
            else:
                raise err

def parse_question_paper_structure(base64_images: list, mime_type: str = 'image/jpeg') -> dict:
    """
    Extract structured question paper schema from images.
    Returns parsed JSON dictionary with a flat list of questions.
    """
    parts = [get_inline_part(b64, mime_type) for b64 in base64_images]

    prompt = """You are an academic document parser. Analyze this exam question paper and extract a FLAT list of every gradeable question/sub-question as JSON.

RULES:
- Return each gradeable item (sub-question or standalone question) as a separate entry in the flat "questions" array
- Copy the question_label EXACTLY as printed on the paper — preserve dots, spaces, and capitalisation
  Examples: if the paper says "Q.1 A" use "Q.1 A", if it says "Q1(a)" use "Q1(a)", if it says "1a" use "1a"
  DO NOT normalise or reformat: never convert "Q.1 A" to "Q1a" or vice versa
- If Q.1 has parts A and B, return TWO separate entries: one with label "Q.1 A" and one with "Q.1 B"
  (NOT a parent Q.1 entry with nested sub_questions)
- Identify optional question groups (e.g. "Answer Q.7 OR Q.8" → optional_group = "OPT_G")
- Assign the SAME optional_group string to both questions in an optional pair
- Preserve the exact question text including any formulas or special notation
- Each entry has its own marks value (the marks for that specific part)

Return ONLY this JSON structure, no explanation:
{
  "total_marks": <number>,
  "instructions": "<any general exam instructions>",
  "questions": [
    {
      "question_label": "Q.1 A",
      "question_text": "<full text of this sub-question or question>",
      "marks": <number>,
      "optional_group": null
    }
  ]
}"""

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt] + parts,
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type='application/json'
            )
        )
    )
    text = result.text.strip()

    try:
        return json.loads(text)
    except Exception:
        # Regex fallback for JSON structure in text
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            return json.loads(match.group(0))
        raise ValueError('Gemini did not return valid JSON for question paper structure')

def detect_answer_layout(base64_pages: list, questions: list, mime_type: str = 'image/jpeg') -> dict:
    """
    Pass 2A: Layout analysis — which pages contain answers to which questions.
    """
    parts = []
    for idx, b64 in enumerate(base64_pages):
        parts.append(f"[PAGE {idx + 1}]")
        parts.append(get_inline_part(b64, mime_type))

    question_list = "\n".join(
        [f"- {q.get('question_label')}: \"{q.get('question_text', '')[:250]}\"" for q in questions]
    )

    prompt = f"""You are analyzing a university student's handwritten exam answer sheet.

The exam has these questions (these are the CANONICAL labels — use them EXACTLY in your output):
{question_list}

Examine ALL pages carefully. For EACH question listed above, identify:
1. Which page numbers contain the student's answer (an answer may span multiple pages)
2. The approximate region on each page (top_third / middle_third / bottom_third / full_page / top_half / bottom_half)
3. Whether the student attempted this question
4. IMPORTANT: If the student wrote answers for BOTH questions in an optional pair, set optional_also_attempted = true for BOTH

CRITICAL — DEFAULT TO ATTEMPTED:
If there is ANY written content on the pages that could plausibly be for a question, mark attempted = true.
Only mark attempted = false if the section is completely blank or the student explicitly wrote "Not attempted".
When in doubt, mark attempted = true.

CRITICAL — LABEL MATCHING AND CONTINUATION:
Students write labels in many ways. Your job is to match what the student wrote to the canonical label from the list above.

Step 1 — Direct match (ignore dots, spaces, capitalisation, brackets):
  Student writes    →  Canonical label (from the list)
  "Q.1 A"           →  whatever the list has for Q1 part A  (e.g. "Q.1 A")
  "Q1 A", "Q1a"     →  same
  "Q.2 B"           →  whatever the list has for Q2 part B  (e.g. "Q.2 B")

Step 2 — Bare-letter continuation (VERY COMMON):
  A student often writes the full label for the FIRST part and then writes ONLY the letter for subsequent parts on the same or next page.
  Example: student writes "Q.1 A" then later writes just "B" or "(b)" or "Ans B" — this means Q.1 B.
  Rule: if you see a lone letter (A, B, C, ...) with no question number, inherit the last seen question number to form the full label, then match that to the canonical list.

Step 3 — Output rule:
  ALWAYS use the EXACT canonical label from the question list in your JSON output.
  NEVER output the student's written version. If the list has "Q.1 B" and the student wrote "B", output "Q.1 B".

Roman numerals (i, ii, iii) within an answer block are part of that answer, not separate questions.

IMPORTANT: Your answer_map MUST contain an entry for EVERY question in the list above, even if attempted = false.

Return ONLY this JSON structure:
{{
  "total_pages_analyzed": {len(base64_pages)},
  "answer_map": [
    {{
      "question_label": "Q.1 A",
      "attempted": true,
      "optional_also_attempted": false,
      "page_refs": [
        {{ "page": 1, "region": "top_half" }},
        {{ "page": 2, "region": "top_third" }}
      ]
    }}
  ]
}}"""

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt] + parts,
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type='application/json'
            )
        )
    )
    text = result.text.strip()

    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            return json.loads(match.group(0))
        raise ValueError('Gemini did not return valid JSON for answer layout detection')

def extract_single_answer_text(relevant_page_images: list, question_text: str, question_label: str, mime_type: str = 'image/jpeg') -> str:
    """
    Pass 2B: Extract text for a SINGLE question using only the relevant page images.
    """
    parts = [get_inline_part(b64, mime_type) for b64 in relevant_page_images]

    prompt = f"""You are transcribing a student's handwritten exam answer from scanned images.

THE QUESTION BEING ANSWERED: {question_label}
"{question_text}"

INSTRUCTIONS:
- Extract and transcribe ONLY the text that is the student's answer to the above question.
- Transcribe the student's handwritten answer EXACTLY word-for-word as written on the page.
- Do NOT rewrite, clean up, summarize, or correct any spelling or grammatical errors.
- CRITICAL: Do NOT complete the student's answer, do NOT correct the student's mistakes, and do NOT add any details or information that are not explicitly written by the student. You are a transcription tool, not an answering tool. If the student wrote a partial, incorrect, or short answer, transcribe ONLY that exact partial, incorrect, or short answer. Never invent or hallucinate any content.
- If the answer spans across multiple pages, stitch it together in precise reading order.
- Preserve all structural layouts, mathematical notation, equations, variables, calculation steps, numbered points, lists, and paragraph breaks.
- Mark any completely illegible word as [ILLEGIBLE].
- If no answer is found for this question in these images, return exactly: [NO ANSWER FOUND].
- Do NOT include text that belongs to other questions.
- Do NOT include the question text itself, only the student's answer.
- Ignore page borders, pre-printed page numbers, sheet margins, and printed university header text.

HOW TO FIND AND MAP THIS ANSWER:
The question label is "{question_label}". Look for these written by the student:
  • The full label exactly: "{question_label}"
  • Variants ignoring dots/spaces/brackets: e.g. if label is "Q.1 A" also look for "Q1 A", "Q1a", "Q.1A", "1(a)", "1.a", "Ans 1a", "a."
  • BARE LETTER/SUB-CHARACTER CONTINUATION: If the label ends in a letter like "A" or "B", the student may write the parent number ("Q.1") once at the top of the section/page, and then write ONLY the letter ("B", "b)", "Ans B") to start this answer. Treat any such bare letter that follows a previous sub-question as this answer.
  • The answer content begins immediately after the student writes the label (or bare letter).

Return the transcribed text directly — no JSON, no explanation, no markdown wrapper, just the exact transcribed student answer."""

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt] + parts,
            config=types.GenerateContentConfig(
                temperature=0.0
            )
        )
    )
    return result.text.strip()

def extract_text_from_image(base64_image: str, mime_type: str = 'image/jpeg') -> str:
    """
    Simple single-image OCR for backward compatibility with /api/extract-text
    """
    part = get_inline_part(base64_image, mime_type)
    prompt = "Extract ALL text from this image exactly as written. Preserve paragraph breaks and line structure. Transcribe handwritten text accurately. Return only the extracted text, no commentary."

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, part],
            config=types.GenerateContentConfig(
                temperature=0.0
            )
        )
    )
    return result.text.strip()

def extract_questions_from_pdf_text(pdf_text: str) -> list:
    """
    Extract questions structure from PDF text content.
    """
    prompt = f"""You are an academic document parser. Extract all questions from the following exam paper text.

RULES:
- Extract every gradeable question/sub-question as a separate entry
- Copy question_label EXACTLY as printed (e.g. "Q.1 A", "Q.1 B", "Q.2", "1a") — do NOT reformat or normalise
- If a question has no explicit label, infer one from its position (e.g. "Q.1", "Q.2")
- Return ONLY JSON matching this exact structure:
[
  {{
    "question_label": "<exact label as on paper, e.g. Q.1 A>",
    "text": "<full text of the question>",
    "points": <number>
  }}
]

EXAM TEXT:
{pdf_text}"""

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type='application/json'
            )
        )
    )
    text = result.text.strip()

    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\[[\s\S]*\]', text)
        if match:
            return json.loads(match.group(0))
        raise ValueError('Gemini did not return valid JSON array for pdf questions')

def extract_model_answers_from_pdf_text(pdf_text: str, questions: list) -> list:
    """
    Extract model answers mapped to questions from model answers PDF text.
    """
    question_list = "\n".join([f"- {q.get('text', '')}" for q in questions])

    prompt = f"""You are an academic document parser. Extract model answers for the following exam questions from the provided model answer sheet text.

QUESTIONS:
{question_list}

RULES:
- Map each question to its corresponding model answer found in the text.
- If an exact answer is not found, leave that model answer blank.
- Return ONLY JSON matching this exact structure:
[
  {{
    "question_text": "<text of the question>",
    "model_answer": "<extracted model answer>"
  }}
]

MODEL ANSWER SHEET TEXT:
{pdf_text}"""

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type='application/json'
            )
        )
    )
    text = result.text.strip()

    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\[[\s\S]*\]', text)
        if match:
            return json.loads(match.group(0))
        raise ValueError('Gemini did not return valid JSON array for model answers')

def parse_model_answers_structure(base64_images: list, questions: list, mime_type: str = 'image/jpeg') -> dict:
    """
    Extract model answers structure from images (mapping to questions).
    """
    parts = [get_inline_part(b64, mime_type) for b64 in base64_images]
    question_list = "\n".join([f"- {q.get('id')}: label={q.get('question_label')}, text={q.get('question_text')}" for q in questions])

    prompt = f"""You are an academic document parser. Extract model answers matching these questions from the provided images:

QUESTIONS:
{question_list}

RULES:
- Extract the answer text and key concepts for each question
- Map each answer to the correct question_id from the list above
- Return ONLY JSON matching this exact structure:
{{
  "model_answers": [
    {{
      "question_id": "<id from the list above>",
      "answer_text": "<extracted model answer text>",
      "key_concepts": ["<key concept 1>", "<key concept 2>"]
    }}
  ]
}}"""

    result = call_gemini_with_retry(
        lambda: client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt] + parts,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type='application/json'
            )
        )
    )
    text = result.text.strip()

    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            return json.loads(match.group(0))
        raise ValueError('Gemini did not return valid JSON for model answers structure')

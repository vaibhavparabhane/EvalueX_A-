from io import BytesIO
from pypdf import PdfReader
from fastapi import HTTPException

def parse_pdf_buffer(pdf_bytes: bytes) -> str:
    """
    Parse a PDF buffer and return the extracted text.
    Raises HTTPException status 400 on parsing failure or empty PDF.
    """
    try:
        reader = PdfReader(BytesIO(pdf_bytes))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Failed to parse PDF content. Ensure it is a valid PDF."
        )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Appears to be an empty or unreadable PDF"
        )

    return text

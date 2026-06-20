import base64
from fastapi import HTTPException
from app.models.db import supabase
from app.utils.logger import logger

def upload_feedback_pdf(submission_id: str, pdf_base64: str) -> dict:
    """
    Accepts base64 PDF, decodes it, uploads it to Supabase Storage (feedback-reports bucket),
    and stores the public URL in submissions.feedback_pdf_url.
    """
    if not submission_id or not pdf_base64:
        raise HTTPException(status_code=400, detail="Missing submissionId or pdfBase64")

    try:
        # Decode base64 PDF to binary bytes
        pdf_bytes = base64.b64decode(pdf_base64)
        file_path = f"{submission_id}/feedback.pdf"

        # Upload to Supabase Storage (upsert = True)
        # Note: in supabase-py, file_options uses a dictionary
        supabase.storage.from_('feedback-reports').upload(
            path=file_path,
            file=pdf_bytes,
            file_options={"content-type": "application/pdf", "upsert": "true"}
        )

        # Get the public URL (returns a string)
        public_url = supabase.storage.from_('feedback-reports').get_public_url(file_path)

        # Update submissions table feedback_pdf_url
        db_res = supabase.table('submissions').update({"feedback_pdf_url": public_url}).eq('id', submission_id).execute()
        if not db_res.data:
            raise Exception("No rows updated in submissions table")

        logger.info(f"[upload-feedback-pdf] Uploaded feedback PDF for submission {submission_id}")
        return {"url": public_url}

    except Exception as e:
        logger.error(f"[upload-feedback-pdf] Fatal error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF upload failed: {str(e)}")

from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.controllers import feedback_controller

router = APIRouter()

class UploadFeedbackRequest(BaseModel):
    submissionId: str = Field(..., alias="submissionId")
    pdfBase64: str = Field(..., alias="pdfBase64")

    model_config = {
        "populate_by_name": True
    }

@router.post("/upload-feedback-pdf")
def upload_feedback_pdf_route(req: UploadFeedbackRequest):
    return feedback_controller.upload_feedback_pdf(
        submission_id=req.submissionId,
        pdf_base64=req.pdfBase64
    )

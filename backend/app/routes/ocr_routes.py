from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services import gemini_service
from app.utils.sanitize import sanitize_extracted_text

router = APIRouter()

class ExtractTextRequest(BaseModel):
    image: str = None
    imageBase64: str = Field(None, alias="imageBase64")
    mimeType: str = Field("image/jpeg", alias="mimeType")

    model_config = {
        "populate_by_name": True
    }

@router.post("/extract-text")
def extract_text_route(req: ExtractTextRequest):
    """
    POST /api/extract-text
    Accepts: { image: base64string, mimeType?: string }
    Returns: { text: string, extractedText: string }
    """
    base64_data = req.image or req.imageBase64
    if not base64_data:
        raise HTTPException(
            status_code=400,
            detail="Missing required field: image or imageBase64 (base64 string)"
        )

    text = gemini_service.extract_text_from_image(base64_data, req.mimeType)
    text = sanitize_extracted_text(text)
    return {
        "text": text,
        "extractedText": text
    }

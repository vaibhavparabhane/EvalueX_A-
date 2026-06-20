from fastapi import APIRouter
from app.config.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    """
    Simple health check route reporting availability of external APIs.
    """
    return {
        "status": "ok",
        "services": {
            "gemini": bool(settings.gemini_api_key),
            "openai": bool(settings.openai_api_key),
            "supabase": bool(settings.supabase_url)
        }
    }

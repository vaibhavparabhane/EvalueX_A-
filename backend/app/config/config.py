import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")
    supabase_url: str = Field(..., alias="SUPABASE_URL")
    supabase_service_key: str = Field(..., alias="SUPABASE_SERVICE_KEY")
    frontend_url: str = Field("http://localhost:5173", alias="FRONTEND_URL")
    port: int = Field(3001, alias="PORT")

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

try:
    settings = Settings()
except Exception as e:
    import sys
    print("\n❌ [STARTUP ERROR] Missing or invalid required environment variables!")
    print("Ensure .env contains: GEMINI_API_KEY, OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY")
    print(f"Details: {e}\n")
    sys.exit(1)

import uvicorn
from app.config.config import settings

if __name__ == "__main__":
    print(f"\n[SUCCESS] EvalueX backend running on http://localhost:{settings.port}")
    print("   Endpoints:")
    print("   POST /api/extract-text          (OCR — backward compat)")
    print("   POST /api/grade-submission       (Grading — QCP Pipeline)")
    print("   POST /api/parse-question-paper   (structure exam paper)")
    print("   POST /api/extract-answers        (2-pass answer mapping)")
    print("   POST /api/grade-question         (single question re-grade)")
    print("   POST /api/aggregate-scores       (compute final score)")
    print("   GET  /api/aggregate-scores/{id}  (fetch grade breakdown)")
    print("   GET  /api/health")
    print("\n   NOTE: Feedback PDFs are generated client-side and stored in Supabase Storage (feedback-reports bucket)\n")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)

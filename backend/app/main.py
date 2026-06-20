from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import settings
from app.utils.logger import logger
from app.routes import health_routes, exam_routes, grading_routes, feedback_routes, ocr_routes

app = FastAPI(title="EvalueX Backend API")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080"
]
if settings.frontend_url:
    origins.append(settings.frontend_url)

# Deduplicate and remove empty
origins = list(set(filter(None, origins)))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logger middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    return response

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"[UNHANDLED ERROR] {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal server error", "details": str(exc)}
    )

# Include Routers
app.include_router(health_routes.router, prefix="/api")
app.include_router(ocr_routes.router, prefix="/api")
app.include_router(feedback_routes.router, prefix="/api")
app.include_router(exam_routes.router, prefix="/api")
app.include_router(grading_routes.router, prefix="/api")

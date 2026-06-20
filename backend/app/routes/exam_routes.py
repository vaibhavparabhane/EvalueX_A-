from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel, Field
from app.controllers import exam_controller

router = APIRouter()

class ParseQuestionPaperRequest(BaseModel):
    assignmentId: str = Field(..., alias="assignmentId")
    images: list
    mimeType: str = Field("image/jpeg", alias="mimeType")

    model_config = {
        "populate_by_name": True
    }

@router.post("/parse-question-paper")
def parse_question_paper_route(req: ParseQuestionPaperRequest):
    return exam_controller.parse_question_paper(
        assignment_id=req.assignmentId,
        images=req.images,
        mime_type=req.mimeType
    )

class ParseModelAnswersRequest(BaseModel):
    assignmentId: str = Field(..., alias="assignmentId")
    images: list
    mimeType: str = Field("image/jpeg", alias="mimeType")

    model_config = {
        "populate_by_name": True
    }

@router.post("/parse-model-answers")
def parse_model_answers_route(req: ParseModelAnswersRequest):
    return exam_controller.parse_model_answers(
        assignment_id=req.assignmentId,
        images=req.images,
        mime_type=req.mimeType
    )

@router.post("/extract-questions-pdf")
async def extract_questions_pdf_route(file: UploadFile = File(...)):
    return await exam_controller.extract_questions_pdf(file)

@router.post("/extract-model-answers-pdf")
async def extract_model_answers_pdf_route(
    file: UploadFile = File(...),
    questions: str = Form(...)
):
    return await exam_controller.extract_model_answers_pdf(file, questions)

@router.post("/parse-rubric-pdf")
async def parse_rubric_pdf_route(file: UploadFile = File(...)):
    return await exam_controller.parse_rubric_pdf(file)

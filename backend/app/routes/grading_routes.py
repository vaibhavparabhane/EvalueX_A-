from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.controllers import grading_controller

router = APIRouter()

class ExtractAnswersRequest(BaseModel):
    submissionId: str = Field(..., alias="submissionId")
    assignmentId: str = Field(..., alias="assignmentId")
    pages: list
    mimeType: str = Field("image/jpeg", alias="mimeType")

    model_config = {
        "populate_by_name": True
    }

@router.post("/extract-answers")
def extract_answers_route(req: ExtractAnswersRequest):
    return grading_controller.extract_answers(
        submission_id=req.submissionId,
        assignment_id=req.assignmentId,
        pages=req.pages,
        mime_type=req.mimeType
    )

class GradeSubmissionRequest(BaseModel):
    submissionId: str = Field(..., alias="submissionId")
    assignmentId: str = Field(..., alias="assignmentId")

    model_config = {
        "populate_by_name": True
    }

@router.post("/grade-submission")
def grade_submission_route(req: GradeSubmissionRequest):
    return grading_controller.grade_submission(
        submission_id=req.submissionId,
        assignment_id=req.assignmentId
    )

class GradeQuestionRequest(BaseModel):
    submissionId: str = Field(..., alias="submissionId")
    questionId: str = Field(..., alias="questionId")
    assignmentId: str = Field(..., alias="assignmentId")

    model_config = {
        "populate_by_name": True
    }

@router.post("/grade-question")
def grade_question_route(req: GradeQuestionRequest):
    return grading_controller.grade_question_endpoint(
        submission_id=req.submissionId,
        question_id=req.questionId,
        assignment_id=req.assignmentId
    )

class AggregateScoresRequest(BaseModel):
    submissionId: str = Field(..., alias="submissionId")
    assignmentId: str = Field(..., alias="assignmentId")

    model_config = {
        "populate_by_name": True
    }

@router.post("/aggregate-scores")
def aggregate_scores_route(req: AggregateScoresRequest):
    return grading_controller.aggregate_scores_endpoint(
        submission_id=req.submissionId,
        assignment_id=req.assignmentId
    )

@router.get("/aggregate-scores/{submissionId}")
def get_question_grades_route(submissionId: str):
    return {
        "question_grades": grading_controller.get_question_grades(submissionId)
    }

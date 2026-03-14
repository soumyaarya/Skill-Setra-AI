from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.gemini_service import mock_interview

router = APIRouter(prefix="/api/interview", tags=["Mock Interview"])


class StartInterviewRequest(BaseModel):
    role: str


class AnswerRequest(BaseModel):
    role: str
    question_num: int
    answer: str


@router.post("/start")
async def start_interview(request: StartInterviewRequest):
    """Start a mock interview session."""
    try:
        result = await mock_interview(request.role)
        return {
            "role": request.role,
            "question_num": 1,
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")


@router.post("/answer")
async def submit_answer(request: AnswerRequest):
    """Submit an answer and get feedback + next question."""
    try:
        result = await mock_interview(
            role=request.role,
            question_num=request.question_num,
            previous_answer=request.answer,
        )
        return {
            "question_num": request.question_num + 1,
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate: {str(e)}")

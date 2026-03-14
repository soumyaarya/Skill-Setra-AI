from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.gemini_service import career_chat

router = APIRouter(prefix="/api/career", tags=["Career Guidance"])


class ChatRequest(BaseModel):
    message: str
    skills: List[str] = []
    education: Optional[str] = None
    location: Optional[str] = None
    experience_years: int = 0


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """AI career guidance chat powered by Gemini 1.5 Flash + LangChain."""
    try:
        user_context = {
            "skills": request.skills,
            "education": request.education,
            "location": request.location,
            "experience_years": request.experience_years,
        }
        response = await career_chat(request.message, user_context)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

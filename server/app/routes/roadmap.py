from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.gemini_service import generate_roadmap

router = APIRouter(prefix="/api/roadmap", tags=["Learning Roadmap"])


class RoadmapRequest(BaseModel):
    skills: List[str]
    target_role: str
    current_level: str = "beginner"


@router.post("/generate")
async def create_roadmap(request: RoadmapRequest):
    """Generate a personalized learning roadmap using AI."""
    try:
        result = await generate_roadmap(
            skills=request.skills,
            target_role=request.target_role,
            current_level=request.current_level,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap: {str(e)}")

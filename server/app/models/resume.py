from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ResumeAnalysisRequest(BaseModel):
    target_role: Optional[str] = None


class ResumeEntity(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    education: List[Dict] = []
    experience: List[Dict] = []
    certifications: List[str] = []
    summary: Optional[str] = None


class ResumeAnalysisResult(BaseModel):
    id: str
    user_id: str
    filename: str
    extracted_entities: ResumeEntity
    overall_score: float  # 0-100
    target_role: Optional[str] = None
    match_percentage: Optional[float] = None
    strengths: List[str] = []
    improvements: List[str] = []
    missing_skills: List[str] = []
    suggestions: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

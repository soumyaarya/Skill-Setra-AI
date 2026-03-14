from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class AssessmentQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str


class AssessmentRequest(BaseModel):
    domain: str  # e.g., "IT", "Healthcare", "Manufacturing"
    sub_domain: Optional[str] = None
    difficulty: str = "intermediate"  # beginner, intermediate, advanced


class AssessmentSubmission(BaseModel):
    assessment_id: str
    answers: List[int]


class SkillScore(BaseModel):
    skill_name: str
    score: float  # 0-100
    industry_avg: float


class AssessmentResult(BaseModel):
    id: str
    user_id: str
    domain: str
    questions: List[AssessmentQuestion]
    user_answers: List[int] = []
    skill_scores: List[SkillScore] = []
    overall_score: float = 0.0
    skill_gaps: List[str] = []
    recommendations: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

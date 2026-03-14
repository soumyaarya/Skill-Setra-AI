from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    WORKER = "worker"
    ADMIN = "admin"


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.STUDENT
    location: Optional[str] = None
    education: Optional[str] = None
    skills: List[str] = []
    experience_years: Optional[int] = 0


class UserLogin(BaseModel):
    email: str
    password: str


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    location: Optional[str] = None
    education: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    skill_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

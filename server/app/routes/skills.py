from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.gemini_service import generate_assessment
from app.database import assessments_collection
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/skills", tags=["Skill Assessment"])


class AssessmentRequest(BaseModel):
    domain: str
    difficulty: str = "intermediate"


class SubmitRequest(BaseModel):
    assessment_id: str
    answers: List[int]


@router.post("/assess")
async def create_assessment(request: AssessmentRequest):
    """Generate AI-powered skill assessment questions."""
    try:
        result = await generate_assessment(request.domain, request.difficulty)
        assessment_id = str(uuid.uuid4())
        
        # Store in DB
        assessment_doc = {
            "_id": assessment_id,
            "domain": request.domain,
            "difficulty": request.difficulty,
            "questions": result.get("questions", []),
            "created_at": datetime.utcnow(),
        }
        await assessments_collection.insert_one(assessment_doc)
        
        # Return questions without answers for the frontend
        questions_for_user = []
        for q in result.get("questions", []):
            questions_for_user.append({
                "question": q["question"],
                "options": q["options"],
            })
        
        return {
            "assessment_id": assessment_id,
            "domain": request.domain,
            "questions": questions_for_user,
            "total_questions": len(questions_for_user),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate assessment: {str(e)}")


@router.post("/submit")
async def submit_assessment(request: SubmitRequest):
    """Submit answers and get skill gap report."""
    try:
        # Fetch assessment from DB
        assessment = await assessments_collection.find_one({"_id": request.assessment_id})
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")

        questions = assessment["questions"]
        correct = 0
        skill_scores = {}
        
        for i, q in enumerate(questions):
            skill_area = q.get("skill_area", assessment["domain"])
            if skill_area not in skill_scores:
                skill_scores[skill_area] = {"correct": 0, "total": 0}
            skill_scores[skill_area]["total"] += 1
            
            if i < len(request.answers) and request.answers[i] == q.get("correct_answer", -1):
                correct += 1
                skill_scores[skill_area]["correct"] += 1

        overall_score = (correct / len(questions)) * 100 if questions else 0
        
        # Build skill breakdown
        skill_breakdown = []
        skill_gaps = []
        for skill, data in skill_scores.items():
            score = (data["correct"] / data["total"]) * 100
            skill_breakdown.append({
                "skill_name": skill,
                "score": round(score, 1),
                "industry_avg": 65.0,  # Simulated industry average
            })
            if score < 60:
                skill_gaps.append(skill)

        return {
            "assessment_id": request.assessment_id,
            "domain": assessment["domain"],
            "overall_score": round(overall_score, 1),
            "correct_answers": correct,
            "total_questions": len(questions),
            "skill_breakdown": skill_breakdown,
            "skill_gaps": skill_gaps,
            "recommendations": [
                f"Focus on improving: {', '.join(skill_gaps)}" if skill_gaps else "Great job! Keep practicing.",
                "Consider taking online courses on platforms like NPTEL or Coursera",
                "Practice with real-world projects to solidify your skills",
            ],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate: {str(e)}")

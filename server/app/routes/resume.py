from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.services.resume_parser import extract_text_from_file
from app.services.gemini_service import analyze_resume
from app.database import resumes_collection
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/resume", tags=["Resume Analyzer"])


@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
):
    """Upload and analyze a resume using AI."""
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.txt')):
            raise HTTPException(
                status_code=400,
                detail="Only PDF and TXT files are supported"
            )

        # Read file content
        content = await file.read()
        if len(content) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

        # Extract text
        text = await extract_text_from_file(content, file.filename)
        if not text or len(text) < 50:
            raise HTTPException(status_code=400, detail="Could not extract enough text from the file")

        # Analyze with Gemini AI
        analysis = await analyze_resume(text, target_role)

        # Store result
        result_id = str(uuid.uuid4())
        result_doc = {
            "_id": result_id,
            "filename": file.filename,
            "target_role": target_role,
            "analysis": analysis,
            "created_at": datetime.utcnow(),
        }
        await resumes_collection.insert_one(result_doc)

        return {
            "id": result_id,
            "filename": file.filename,
            "target_role": target_role,
            **analysis,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

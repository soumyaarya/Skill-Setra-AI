from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.pinecone_service import search_jobs_pinecone, search_jobs_local
from app.services.job_fetcher import search_jobs

router = APIRouter(prefix="/api/jobs", tags=["Job Explorer"])


class JobSearchRequest(BaseModel):
    query: str
    location: str = "India"
    page: int = 1
    remote_only: bool = False


@router.post("/search")
async def search(request: JobSearchRequest):
    """Search for jobs using Pinecone semantic search + JSearch API fallback."""
    try:
        # Try Pinecone first for semantic search
        pinecone_results = await search_jobs_pinecone(
            query=request.query,
            location=request.location,
            top_k=10,
        )

        if pinecone_results:
            return {"jobs": pinecone_results, "total": len(pinecone_results), "source": "pinecone"}

        # Fallback to JSearch API
        result = await search_jobs(
            query=request.query,
            location=request.location,
            page=request.page,
            remote_only=request.remote_only,
        )
        return {**result, "source": "jsearch"}
    except Exception as e:
        # Final fallback: local sample data
        local_results = search_jobs_local(request.query, request.location)
        return {"jobs": local_results, "total": len(local_results), "source": "local"}


@router.get("/search")
async def search_get(
    query: str = "software developer",
    location: str = "India",
    page: int = 1,
):
    """Search jobs (GET endpoint for easy testing)."""
    pinecone_results = await search_jobs_pinecone(query=query, location=location)
    if pinecone_results:
        return {"jobs": pinecone_results, "total": len(pinecone_results), "source": "pinecone"}

    result = await search_jobs(query=query, location=location, page=page)
    return {**result, "source": "jsearch"}

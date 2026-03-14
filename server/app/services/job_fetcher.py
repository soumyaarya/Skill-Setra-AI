"""
Job Fetcher Service - Fetches real-time job listings from JSearch API (RapidAPI)
"""

import httpx
from typing import Optional, List
from app.config import get_settings

settings = get_settings()

JSEARCH_BASE_URL = "https://jsearch.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key": settings.jsearch_api_key,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}


async def search_jobs(
    query: str,
    location: str = "India",
    page: int = 1,
    num_pages: int = 1,
    remote_only: bool = False,
) -> dict:
    """Search for jobs using JSearch API."""
    params = {
        "query": f"{query} in {location}",
        "page": str(page),
        "num_pages": str(num_pages),
    }
    if remote_only:
        params["remote_jobs_only"] = "true"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{JSEARCH_BASE_URL}/search",
                headers=HEADERS,
                params=params,
                timeout=10.0,
            )
            if response.status_code == 200:
                data = response.json()
                jobs = []
                for job in data.get("data", []):
                    jobs.append({
                        "id": job.get("job_id", ""),
                        "title": job.get("job_title", ""),
                        "company": job.get("employer_name", ""),
                        "location": job.get("job_city", "") + ", " + job.get("job_country", ""),
                        "description": job.get("job_description", "")[:300] + "...",
                        "apply_link": job.get("job_apply_link", ""),
                        "posted_date": job.get("job_posted_at_datetime_utc", ""),
                        "employment_type": job.get("job_employment_type", ""),
                        "salary": job.get("job_salary_period", "Not disclosed"),
                        "logo": job.get("employer_logo", ""),
                        "required_skills": job.get("job_required_skills") or [],
                    })
                return {"jobs": jobs, "total": len(jobs)}
            else:
                return {"jobs": [], "total": 0, "error": "API request failed"}
    except Exception as e:
        # Return sample jobs if API fails (for demo)
        return get_sample_jobs(query, location)


def get_sample_jobs(query: str, location: str) -> dict:
    """Return sample jobs for demo when API is unavailable."""
    sample_jobs = [
        {
            "id": "1",
            "title": f"Junior {query} Developer",
            "company": "TCS",
            "location": f"{location}, India",
            "description": f"Looking for a passionate {query} developer to join our team. Fresher-friendly role with training provided.",
            "apply_link": "https://www.tcs.com/careers",
            "posted_date": "2026-03-10",
            "employment_type": "FULLTIME",
            "salary": "₹3.5 - 5 LPA",
            "logo": "",
            "required_skills": [query, "Communication", "Problem Solving"],
        },
        {
            "id": "2",
            "title": f"Senior {query} Engineer",
            "company": "Infosys",
            "location": f"Bangalore, India",
            "description": f"Seeking experienced {query} engineers for enterprise projects. 3+ years experience required.",
            "apply_link": "https://www.infosys.com/careers",
            "posted_date": "2026-03-09",
            "employment_type": "FULLTIME",
            "salary": "₹8 - 14 LPA",
            "logo": "",
            "required_skills": [query, "Team Leadership", "Agile"],
        },
        {
            "id": "3",
            "title": f"{query} Intern",
            "company": "Wipro",
            "location": f"{location}, India",
            "description": f"6-month internship program for {query}. Stipend + PPO opportunity.",
            "apply_link": "https://www.wipro.com/careers",
            "posted_date": "2026-03-11",
            "employment_type": "INTERN",
            "salary": "₹15,000/month",
            "logo": "",
            "required_skills": [query, "Eagerness to Learn"],
        },
        {
            "id": "4",
            "title": f"{query} Team Lead",
            "company": "HCL Technologies",
            "location": f"Noida, India",
            "description": f"Lead a team of {query} professionals. 5+ years experience needed.",
            "apply_link": "https://www.hcltech.com/careers",
            "posted_date": "2026-03-08",
            "employment_type": "FULLTIME",
            "salary": "₹15 - 22 LPA",
            "logo": "",
            "required_skills": [query, "Leadership", "Project Management"],
        },
        {
            "id": "5",
            "title": f"Freelance {query} Expert",
            "company": "Remote (Multiple Clients)",
            "location": "Remote, India",
            "description": f"Freelance {query} opportunity. Work from home with flexible hours.",
            "apply_link": "https://www.freelancer.in",
            "posted_date": "2026-03-12",
            "employment_type": "CONTRACT",
            "salary": "₹500 - 2000/hour",
            "logo": "",
            "required_skills": [query, "Self-Management", "Client Communication"],
        },
    ]
    return {"jobs": sample_jobs, "total": len(sample_jobs)}

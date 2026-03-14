"""
Pinecone Vector Database Service
Stores job listings and skill profiles as vector embeddings
for semantic search and skill-to-job matching.
"""

from pinecone import Pinecone, ServerlessSpec
from app.config import get_settings
import hashlib

settings = get_settings()

# Initialize Pinecone
pc = None
index = None

# Dimension for our embeddings (768 for sentence-transformers/all-MiniLM-L6-v2 style)
EMBEDDING_DIM = 768


def get_pinecone_index():
    """Initialize and return Pinecone index."""
    global pc, index
    if index is not None:
        return index

    if not settings.pinecone_api_key:
        return None

    try:
        pc = Pinecone(api_key=settings.pinecone_api_key)

        # Create index if it doesn't exist
        existing_indexes = [idx.name for idx in pc.list_indexes()]
        if settings.pinecone_index_name not in existing_indexes:
            pc.create_index(
                name=settings.pinecone_index_name,
                dimension=EMBEDDING_DIM,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )

        index = pc.Index(settings.pinecone_index_name)
        print(f"✅ Connected to Pinecone index: {settings.pinecone_index_name}")
        return index
    except Exception as e:
        print(f"⚠️ Pinecone connection failed: {e}")
        return None


def text_to_simple_embedding(text: str) -> list:
    """
    Create a simple embedding from text using character-level hashing.
    In production, use sentence-transformers or Gemini embeddings.
    This is a lightweight fallback that doesn't need PyTorch.
    """
    import math
    # Normalize text
    text = text.lower().strip()
    # Create a deterministic embedding using hash-based approach
    embedding = []
    for i in range(EMBEDDING_DIM):
        hash_input = f"{text}_{i}".encode()
        hash_val = int(hashlib.md5(hash_input).hexdigest(), 16)
        # Normalize to [-1, 1]
        val = (hash_val % 10000) / 5000.0 - 1.0
        embedding.append(val)
    # Normalize the vector
    magnitude = math.sqrt(sum(x * x for x in embedding))
    if magnitude > 0:
        embedding = [x / magnitude for x in embedding]
    return embedding


# Sample Indian job data to seed Pinecone
SAMPLE_JOBS = [
    {
        "id": "job_1",
        "title": "Junior Python Developer",
        "company": "TCS",
        "location": "Bangalore, India",
        "salary": "₹3.5 - 5 LPA",
        "employment_type": "FULLTIME",
        "description": "Looking for a passionate Python developer. Fresher-friendly role with training. Knowledge of Django, Flask, REST APIs preferred.",
        "required_skills": ["Python", "Django", "REST APIs", "SQL", "Git"],
        "apply_link": "https://www.tcs.com/careers",
    },
    {
        "id": "job_2",
        "title": "Full Stack Web Developer",
        "company": "Infosys",
        "location": "Hyderabad, India",
        "salary": "₹5 - 8 LPA",
        "employment_type": "FULLTIME",
        "description": "Full stack developer needed for enterprise web applications. React, Node.js, MongoDB experience required.",
        "required_skills": ["React", "Node.js", "MongoDB", "JavaScript", "HTML/CSS"],
        "apply_link": "https://www.infosys.com/careers",
    },
    {
        "id": "job_3",
        "title": "Data Analyst",
        "company": "Wipro",
        "location": "Pune, India",
        "salary": "₹4 - 7 LPA",
        "employment_type": "FULLTIME",
        "description": "Analyze business data, create dashboards, generate reports. SQL, Excel, Power BI skills required.",
        "required_skills": ["SQL", "Excel", "Power BI", "Python", "Statistics"],
        "apply_link": "https://www.wipro.com/careers",
    },
    {
        "id": "job_4",
        "title": "Digital Marketing Executive",
        "company": "Flipkart",
        "location": "Bangalore, India",
        "salary": "₹3 - 5 LPA",
        "employment_type": "FULLTIME",
        "description": "Manage social media campaigns, SEO/SEM, content marketing. Experience with Google Ads and analytics preferred.",
        "required_skills": ["SEO", "Google Ads", "Social Media", "Content Marketing", "Analytics"],
        "apply_link": "https://www.flipkart.com/careers",
    },
    {
        "id": "job_5",
        "title": "DevOps Engineer",
        "company": "Razorpay",
        "location": "Bangalore, India",
        "salary": "₹10 - 18 LPA",
        "employment_type": "FULLTIME",
        "description": "Build and maintain CI/CD pipelines, manage cloud infrastructure on AWS. Docker, Kubernetes experience essential.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
        "apply_link": "https://razorpay.com/careers",
    },
    {
        "id": "job_6",
        "title": "Machine Learning Engineer",
        "company": "Jio",
        "location": "Mumbai, India",
        "salary": "₹12 - 20 LPA",
        "employment_type": "FULLTIME",
        "description": "Build ML models for recommendation systems, NLP tasks. PyTorch, TensorFlow, Python expertise needed.",
        "required_skills": ["Python", "PyTorch", "TensorFlow", "NLP", "Machine Learning", "Deep Learning"],
        "apply_link": "https://www.jio.com/careers",
    },
    {
        "id": "job_7",
        "title": "Graphic Designer",
        "company": "Zomato",
        "location": "Delhi NCR, India",
        "salary": "₹3 - 6 LPA",
        "employment_type": "FULLTIME",
        "description": "Create visual content for marketing campaigns, app UI, and social media. Figma, Photoshop, Illustrator skills needed.",
        "required_skills": ["Figma", "Photoshop", "Illustrator", "UI Design", "Branding"],
        "apply_link": "https://www.zomato.com/careers",
    },
    {
        "id": "job_8",
        "title": "Customer Support Executive",
        "company": "Swiggy",
        "location": "Chennai, India",
        "salary": "₹2.5 - 4 LPA",
        "employment_type": "FULLTIME",
        "description": "Handle customer queries, resolve complaints, maintain customer satisfaction. Hindi and English fluency required.",
        "required_skills": ["Communication", "Hindi", "English", "Problem Solving", "Customer Service"],
        "apply_link": "https://www.swiggy.com/careers",
    },
    {
        "id": "job_9",
        "title": "Electrician / Maintenance Technician",
        "company": "Tata Projects",
        "location": "Multiple Cities, India",
        "salary": "₹2 - 3.5 LPA",
        "employment_type": "FULLTIME",
        "description": "Electrical installation, maintenance, and troubleshooting in industrial settings. ITI certification preferred.",
        "required_skills": ["Electrical Wiring", "Troubleshooting", "Safety Protocols", "ITI Certified", "PLC"],
        "apply_link": "https://www.tataprojects.com/careers",
    },
    {
        "id": "job_10",
        "title": "Nursing Staff",
        "company": "Apollo Hospitals",
        "location": "Hyderabad, India",
        "salary": "₹3 - 5 LPA",
        "employment_type": "FULLTIME",
        "description": "Registered nurse for patient care, medication management, and health monitoring. B.Sc Nursing or GNM qualified.",
        "required_skills": ["Patient Care", "Medication Management", "B.Sc Nursing", "Health Monitoring", "Emergency Care"],
        "apply_link": "https://www.apollohospitals.com/careers",
    },
    {
        "id": "job_11",
        "title": "Freelance Content Writer",
        "company": "Remote (Various Clients)",
        "location": "Remote, India",
        "salary": "₹500 - 2000/article",
        "employment_type": "FREELANCE",
        "description": "Write blogs, articles, and web copy for various clients. SEO knowledge and English proficiency essential.",
        "required_skills": ["Content Writing", "SEO", "English", "Research", "WordPress"],
        "apply_link": "https://www.freelancer.in",
    },
    {
        "id": "job_12",
        "title": "Mobile App Developer (React Native)",
        "company": "PhonePe",
        "location": "Bangalore, India",
        "salary": "₹8 - 15 LPA",
        "employment_type": "FULLTIME",
        "description": "Build cross-platform mobile apps using React Native. Experience with fintech apps is a plus.",
        "required_skills": ["React Native", "JavaScript", "TypeScript", "Mobile Development", "Redux"],
        "apply_link": "https://www.phonepe.com/careers",
    },
    {
        "id": "job_13",
        "title": "Accounts Executive",
        "company": "Deloitte India",
        "location": "Mumbai, India",
        "salary": "₹4 - 7 LPA",
        "employment_type": "FULLTIME",
        "description": "Handle financial reporting, GST filing, and audit preparation. CA/CMA inter or M.Com preferred.",
        "required_skills": ["Accounting", "Tally", "GST", "Financial Reporting", "Excel"],
        "apply_link": "https://www.deloitte.com/careers",
    },
    {
        "id": "job_14",
        "title": "Delivery Partner / Logistics",
        "company": "Amazon India",
        "location": "Multiple Cities, India",
        "salary": "₹15,000 - 25,000/month",
        "employment_type": "CONTRACT",
        "description": "Last-mile delivery of packages. Two-wheeler and valid DL required. Flexible hours.",
        "required_skills": ["Driving License", "Navigation", "Physical Fitness", "Time Management", "Customer Handling"],
        "apply_link": "https://www.amazon.jobs",
    },
    {
        "id": "job_15",
        "title": "Cybersecurity Analyst",
        "company": "HCL Technologies",
        "location": "Noida, India",
        "salary": "₹6 - 12 LPA",
        "employment_type": "FULLTIME",
        "description": "Monitor network security, perform vulnerability assessments, incident response. CEH/CCNA certification preferred.",
        "required_skills": ["Network Security", "Penetration Testing", "SIEM", "Firewall", "Linux", "CEH"],
        "apply_link": "https://www.hcltech.com/careers",
    },
]


async def seed_pinecone():
    """Seed Pinecone with sample job data."""
    idx = get_pinecone_index()
    if not idx:
        print("⚠️ Pinecone not configured, using local data only")
        return False

    try:
        vectors = []
        for job in SAMPLE_JOBS:
            # Create embedding from job title + skills + description
            text = f"{job['title']} {' '.join(job['required_skills'])} {job['description']}"
            embedding = text_to_simple_embedding(text)
            vectors.append({
                "id": job["id"],
                "values": embedding,
                "metadata": {
                    "title": job["title"],
                    "company": job["company"],
                    "location": job["location"],
                    "salary": job["salary"],
                    "employment_type": job["employment_type"],
                    "description": job["description"][:200],
                    "required_skills": ",".join(job["required_skills"]),
                    "apply_link": job["apply_link"],
                },
            })

        # Upsert in batches
        idx.upsert(vectors=vectors)
        print(f"✅ Seeded Pinecone with {len(vectors)} job listings")
        return True
    except Exception as e:
        print(f"❌ Failed to seed Pinecone: {e}")
        return False


async def search_jobs_pinecone(query: str, location: str = "", top_k: int = 10) -> list:
    """Search for jobs using Pinecone semantic search."""
    idx = get_pinecone_index()

    if not idx:
        # Fallback: simple keyword search on local data
        return search_jobs_local(query, location)

    try:
        query_embedding = text_to_simple_embedding(query)

        # Build filter
        filter_dict = {}
        if location and location != "India":
            filter_dict["location"] = {"$eq": location}

        results = idx.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict if filter_dict else None,
        )

        jobs = []
        for match in results.get("matches", []):
            meta = match.get("metadata", {})
            jobs.append({
                "id": match["id"],
                "title": meta.get("title", ""),
                "company": meta.get("company", ""),
                "location": meta.get("location", ""),
                "salary": meta.get("salary", "Not disclosed"),
                "employment_type": meta.get("employment_type", ""),
                "description": meta.get("description", ""),
                "required_skills": meta.get("required_skills", "").split(","),
                "apply_link": meta.get("apply_link", ""),
                "match_score": round(match["score"] * 100, 1),
                "posted_date": "2026-03-12",
            })
        return jobs
    except Exception as e:
        print(f"Pinecone search failed: {e}")
        return search_jobs_local(query, location)


def search_jobs_local(query: str, location: str = "") -> list:
    """Fallback: search local sample data when Pinecone is unavailable."""
    query_lower = query.lower()
    results = []
    for job in SAMPLE_JOBS:
        # Simple relevance scoring
        score = 0
        searchable = f"{job['title']} {' '.join(job['required_skills'])} {job['description']}".lower()
        for word in query_lower.split():
            if word in searchable:
                score += 1

        if location and location != "India":
            if location.lower() in job["location"].lower():
                score += 2

        if score > 0:
            results.append({
                **job,
                "match_score": min(score * 20, 95),
                "posted_date": "2026-03-12",
            })

    # Sort by score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results if results else [
        {**job, "match_score": 50, "posted_date": "2026-03-12"}
        for job in SAMPLE_JOBS[:5]
    ]

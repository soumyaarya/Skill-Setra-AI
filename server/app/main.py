from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_db, close_db
from app.routes import auth, career, skills, resume, jobs, interview, roadmap

app = FastAPI(
    title="SkillSetra AI API",
    description="AI-powered Career GPS for India's workforce — Bridging the Bharat Skill Gap. Powered by LangChain + Groq (LLaMA 3) + Pinecone.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(career.router)
app.include_router(skills.router)
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(interview.router)
app.include_router(roadmap.router)


@app.on_event("startup")
async def startup():
    await connect_db()
    # Seed Pinecone with sample job data
    try:
        from app.services.pinecone_service import seed_pinecone
        await seed_pinecone()
    except Exception as e:
        print(f"⚠️ Pinecone seeding skipped: {e}")


@app.on_event("shutdown")
async def shutdown():
    await close_db()


@app.get("/")
async def root():
    return {
        "name": "SkillSetra AI API",
        "version": "1.0.0",
        "description": "Bridging the Bharat Skill Gap",
        "tech": "LangChain + Groq (LLaMA 3) + Pinecone + FastAPI",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}

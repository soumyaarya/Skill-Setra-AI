# SkillSetra AI — Bridging the Bharat Skill Gap

> Empowering India's workforce with data-driven career intelligence. SkillSetra AI is a privacy-focused "Career GPS" that aligns youth and informal-sector workers with local industry demand using real-time data, embeddings-based matching, and human-centred design.

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **AI/LLM** | Gemini 1.5 Flash |
| **AI Orchestration** | LangChain (RAG workflows) |
| **ML Models** | PyTorch (entity extraction) |
| **Vector Search** | Pinecone (skill-job matching) |
| **Database** | MongoDB Atlas |
| **Job Data** | JSearch API (RapidAPI) |

## 🚀 Features

- 🤖 **AI Career Chatbot** — Personalized career guidance powered by Gemini 1.5 Flash + LangChain RAG
- 🧠 **Skill Gap Assessment** — AI-generated MCQ assessments with skill radar visualization
- 📄 **Resume Analyzer** — PDF upload, entity extraction, AI scoring & improvement suggestions
- 💼 **Job Explorer** — Real-time job listings with semantic skill-match ranking
- 🗺️ **Learning Roadmap** — AI-generated personalized learning paths with free resources
- 🎤 **Mock Interview** — AI-powered interview practice with real-time feedback
- 📊 **Dashboard** — Personalized overview of skills, career matches, and progress

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Google Gemini API key

### 1. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

### 2. Backend Setup
```bash
cd server
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Edit `server/.env` with your API keys:
```
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

### 4. Run Backend
```bash
cd server
uvicorn app.main:app --reload --port 8000
```
Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

## 🌍 Societal Impact

| Mission | How We Address It |
|---|---|
| **Skill India** | Skill gap analysis, personalized training roadmaps |
| **Digital India** | AI-powered digital platform accessible on any device |
| **Employment** | Real-time job matching, resume improvement, mock interviews |
| **Blue-collar support** | Business skills guidance, vocational training paths |
| **Data-driven decisions** | Analytics dashboards for tracking outcomes |

## 📁 Project Structure

```
skillsetra/
├── client/              # Next.js Frontend
│   ├── src/app/         # App Router pages
│   ├── src/components/  # Reusable components
│   └── src/lib/         # API helpers
│
└── server/              # FastAPI Backend
    └── app/
        ├── routes/      # API endpoints
        ├── services/    # AI & business logic
        ├── models/      # Pydantic schemas
        └── middleware/   # JWT auth
```

## 📄 License

MIT

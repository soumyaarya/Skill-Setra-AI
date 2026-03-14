"""
AI Service - LangChain + Groq (LLaMA 3) integration
Handles all AI-powered features: career chat, skill assessment, resume analysis,
mock interviews, and learning roadmap generation.
Uses Groq API for free, fast inference.
"""

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.config import get_settings
import json

settings = get_settings()

# Initialize Groq LLM (LLaMA 3 70B) via LangChain
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=settings.groq_api_key,
    temperature=0.7,
)


async def career_chat(message: str, user_context: dict = None) -> str:
    """RAG-powered career guidance chat."""
    context = ""
    if user_context:
        context = f"""
User Profile:
- Skills: {', '.join(user_context.get('skills', []))}
- Education: {user_context.get('education', 'Not specified')}
- Location: {user_context.get('location', 'India')}
- Experience: {user_context.get('experience_years', 0)} years
"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are SkillSetra AI, an expert career guidance counselor for India's workforce.
You help youth, students, and informal-sector workers find the right career path.
You are knowledgeable about:
- India's job market (IT, manufacturing, healthcare, retail, agriculture, gig economy)
- Skill India and Digital India initiatives
- Government schemes (PMKVY, NCS, DDU-GKY)
- Both white-collar and blue-collar career paths
- Regional job markets across Indian states
- Vocational training, ITI, polytechnic courses
- Digital skills, business skills, and customer management

Always provide actionable, specific advice. Mention real courses, certifications, and platforms.
Be encouraging and supportive. Use simple language.

{context}"""),
        ("human", "{message}")
    ])

    chain = prompt | llm
    response = await chain.ainvoke({"message": message, "context": context})
    return response.content


async def generate_assessment(domain: str, difficulty: str = "intermediate") -> dict:
    """Generate skill assessment questions using Groq LLaMA 3."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a skill assessment expert. Generate exactly 10 multiple-choice questions 
to assess someone's skills in the given domain. 

Return ONLY a valid JSON object with this exact structure:
{{
    "domain": "{domain}",
    "questions": [
        {{
            "question": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "Brief explanation",
            "skill_area": "Specific skill being tested"
        }}
    ]
}}

Make questions practical and relevant to Indian industry. 
Difficulty level: {difficulty}
Mix theoretical and scenario-based questions."""),
        ("human", "Generate a {difficulty} level assessment for: {domain}")
    ])

    chain = prompt | llm
    response = await chain.ainvoke({
        "domain": domain,
        "difficulty": difficulty,
    })

    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        return json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        return {
            "domain": domain,
            "questions": [
                {
                    "question": f"Sample question about {domain}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": 0,
                    "explanation": "This is a sample question.",
                    "skill_area": domain
                }
            ]
        }


async def analyze_resume(resume_text: str, target_role: str = None) -> dict:
    """Analyze resume using Groq LLaMA 3 for scoring and suggestions."""
    role_context = f"Target Role: {target_role}" if target_role else "General analysis"

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert resume analyzer and career consultant for India's job market.
Analyze the given resume and provide a detailed assessment.

Return ONLY a valid JSON object with this exact structure:
{{
    "overall_score": 75,
    "extracted_entities": {{
        "name": "Candidate name",
        "skills": ["skill1", "skill2"],
        "education": [{{"degree": "BTech", "institution": "IIT Delhi", "year": "2023"}}],
        "experience": [{{"role": "Developer", "company": "TCS", "duration": "2 years"}}],
        "certifications": ["AWS Certified"]
    }},
    "strengths": ["Good technical skills", "Relevant experience"],
    "improvements": ["Add quantifiable achievements", "Include more keywords"],
    "missing_skills": ["Docker", "Cloud Computing"],
    "suggestions": ["Add a professional summary", "Quantify your achievements with numbers"],
    "match_percentage": 70
}}

{role_context}"""),
        ("human", "Analyze this resume:\n\n{resume_text}")
    ])

    chain = prompt | llm
    response = await chain.ainvoke({
        "resume_text": resume_text,
        "role_context": role_context,
    })

    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        return json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        return {"overall_score": 0, "error": "Failed to analyze resume"}


async def generate_roadmap(skills: list, target_role: str, current_level: str = "beginner") -> dict:
    """Generate a personalized learning roadmap using LangChain RAG."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are SkillSetra AI's learning roadmap generator for Indian professionals.
Create a detailed, step-by-step learning roadmap.

Return ONLY a valid JSON object:
{{
    "target_role": "{target_role}",
    "estimated_duration": "6 months",
    "phases": [
        {{
            "phase": 1,
            "title": "Foundation",
            "duration": "4 weeks",
            "skills": ["HTML", "CSS", "JavaScript"],
            "resources": [
                {{
                    "name": "Course name",
                    "platform": "YouTube/Coursera/NPTEL",
                    "url": "https://...",
                    "type": "free",
                    "duration": "20 hours"
                }}
            ],
            "milestones": ["Build a portfolio website", "Complete 5 coding challenges"]
        }}
    ],
    "career_prospects": {{
        "avg_salary": "4-6 LPA",
        "demand": "High",
        "top_companies": ["TCS", "Infosys", "Wipro"]
    }}
}}

Focus on FREE resources: YouTube, NPTEL, Coursera (audit), Skill India portal, freeCodeCamp.
Include government schemes like PMKVY courses where relevant."""),
        ("human", """Create a roadmap for:
- Current skills: {skills}
- Target role: {target_role}  
- Current level: {current_level}""")
    ])

    chain = prompt | llm
    response = await chain.ainvoke({
        "skills": ", ".join(skills),
        "target_role": target_role,
        "current_level": current_level,
    })

    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        return json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        return {"error": "Failed to generate roadmap"}


async def mock_interview(role: str, question_num: int = 1, previous_answer: str = None) -> dict:
    """Generate mock interview questions and evaluate answers."""
    if previous_answer:
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert interviewer for {role} positions in Indian companies.
Evaluate the candidate's answer and provide feedback.

Return ONLY a valid JSON object:
{{
    "score": 7,
    "feedback": "Good answer but could be more specific...",
    "ideal_answer": "An ideal answer would include...",
    "next_question": "Next interview question?",
    "tips": ["Be more specific", "Use STAR method"]
}}"""),
            ("human", """Role: {role}
Question #{question_num}
Candidate's answer: {answer}

Evaluate and give the next question.""")
        ])

        chain = prompt | llm
        response = await chain.ainvoke({
            "role": role,
            "question_num": str(question_num),
            "answer": previous_answer,
        })
    else:
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert interviewer for {role} positions in Indian companies.
Generate an opening interview question.

Return ONLY a valid JSON object:
{{
    "question": "Tell me about yourself and why you're interested in this role?",
    "tips": ["Keep it under 2 minutes", "Focus on relevant experience"],
    "difficulty": "easy"
}}"""),
            ("human", "Start a mock interview for: {role}")
        ])

        chain = prompt | llm
        response = await chain.ainvoke({"role": role})

    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        return json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        return {"question": f"Tell me about your experience relevant to {role}?", "tips": []}

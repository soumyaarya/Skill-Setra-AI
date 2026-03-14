import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-purple-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl float-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-indigo-300">Powered by Groq LLaMA 3 + LangChain + Pinecone</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in" style={{ animationDelay: "0.2s" }}>
            <span className="gradient-text">SkillSetra AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 fade-in" style={{ animationDelay: "0.3s" }}>
            Bridging the <span className="text-indigo-400 font-semibold">Bharat Skill Gap</span>
          </p>

          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 fade-in" style={{ animationDelay: "0.4s" }}>
            Empowering India&apos;s workforce with data-driven career intelligence. Your personal
            <span className="text-purple-400"> Career GPS</span> — aligning youth and informal-sector workers
            with local industry demand using real-time data and AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: "0.5s" }}>
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              🚀 Get Started Free
            </Link>
            <Link href="/career-chat" className="btn-secondary text-lg px-8 py-4">
              🤖 Try AI Career Chat
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 stagger-children">
            <StatCard number="10+" label="Career Domains" />
            <StatCard number="AI" label="Powered Guidance" />
            <StatCard number="Live" label="Job Matching" />
            <StatCard number="Free" label="Learning Paths" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Upskill & Succeed</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From skill assessment to job placement — SkillSetra AI covers your entire career journey.
            </p>
          </div>

          <div className="feature-grid">
            <FeatureCard
              icon="🤖"
              title="AI Career Chatbot"
              description="Get personalized career guidance powered by Groq LLaMA 3. Ask anything about careers, skills, and opportunities in India."
              href="/career-chat"
            />
            <FeatureCard
              icon="🧠"
              title="Skill Gap Analysis"
              description="Take AI-generated assessments, visualize your skill scores, and identify exactly where you need to improve."
              href="/skill-assessment"
            />
            <FeatureCard
              icon="📄"
              title="Resume Analyzer"
              description="Upload your resume for AI-powered scoring, entity extraction, and actionable improvement suggestions."
              href="/resume-analyzer"
            />
            <FeatureCard
              icon="💼"
              title="Job Explorer"
              description="Browse real-time job listings matched to your skills. See match percentages and apply directly."
              href="/job-explorer"
            />
            <FeatureCard
              icon="🗺️"
              title="Learning Roadmap"
              description="Get a personalized learning path with free courses from NPTEL, Coursera, YouTube, and Skill India."
              href="/learning-roadmap"
            />
            <FeatureCard
              icon="🎤"
              title="Mock Interview"
              description="Practice interviews with AI. Get real-time feedback on your answers and tips to improve."
              href="/mock-interview"
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Aligned with <span className="gradient-text">India&apos;s Missions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MissionCard
              icon="🇮🇳"
              title="Skill India"
              description="Mapping skills to industry demand, personalized training roadmaps, vocational support"
            />
            <MissionCard
              icon="💻"
              title="Digital India"
              description="AI-powered digital tools accessible to everyone, anywhere in India"
            />
            <MissionCard
              icon="📈"
              title="Employment Mission"
              description="Real-time job matching, resume enhancement, interview preparation"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Built With <span className="gradient-text">Cutting-Edge Tech</span></h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Next.js", "FastAPI", "Groq LLaMA 3", "LangChain", "Pinecone", "MongoDB"].map((tech) => (
              <span key={tech} className="px-5 py-2.5 rounded-xl bg-[#1a1f36] border border-[#1e293b] text-sm text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-all duration-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-semibold gradient-text">SkillSetra AI</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 SkillSetra AI — Bridging the Bharat Skill Gap
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="glass-card text-center p-6">
      <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{number}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="glass-card group cursor-pointer">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 text-indigo-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
        Explore →
      </div>
    </Link>
  );
}

function MissionCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass-card text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

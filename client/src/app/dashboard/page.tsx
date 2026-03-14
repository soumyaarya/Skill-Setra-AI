"use client";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="pt-20 pb-10 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10 fade-in">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome to <span className="gradient-text">SkillSetra AI</span>
                </h1>
                <p className="text-gray-400">Your personal Career GPS — track your progress and explore opportunities</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger-children">
                <QuickStat icon="🧠" label="Skill Score" value="--" subtext="Take assessment" color="indigo" />
                <QuickStat icon="📄" label="Resume Score" value="--" subtext="Upload resume" color="purple" />
                <QuickStat icon="💼" label="Job Matches" value="--" subtext="Explore jobs" color="blue" />
                <QuickStat icon="🗺️" label="Roadmap Progress" value="0%" subtext="Start learning" color="green" />
            </div>

            {/* Feature Shortcuts */}
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="feature-grid mb-10">
                <ActionCard
                    icon="🤖"
                    title="AI Career Chat"
                    description="Get personalized career guidance from our AI counselor"
                    href="/career-chat"
                    gradient="from-indigo-600 to-blue-600"
                />
                <ActionCard
                    icon="🧠"
                    title="Skill Assessment"
                    description="Test your skills and find your gaps"
                    href="/skill-assessment"
                    gradient="from-purple-600 to-pink-600"
                />
                <ActionCard
                    icon="📄"
                    title="Resume Analyzer"
                    description="Get your resume scored and improved by AI"
                    href="/resume-analyzer"
                    gradient="from-blue-600 to-cyan-600"
                />
                <ActionCard
                    icon="💼"
                    title="Job Explorer"
                    description="Find jobs that match your skills"
                    href="/job-explorer"
                    gradient="from-emerald-600 to-teal-600"
                />
                <ActionCard
                    icon="🗺️"
                    title="Learning Roadmap"
                    description="AI-generated learning path to your dream career"
                    href="/learning-roadmap"
                    gradient="from-amber-600 to-orange-600"
                />
                <ActionCard
                    icon="🎤"
                    title="Mock Interview"
                    description="Practice interviews with AI and get feedback"
                    href="/mock-interview"
                    gradient="from-red-600 to-rose-600"
                />
            </div>

            {/* India's Workforce Stats */}
            <div className="glass-card">
                <h2 className="text-xl font-semibold mb-4">🇮🇳 India Workforce Insights</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InsightStat label="Youth (15-29)" value="27%" description="of India's population" />
                    <InsightStat label="Formal Training" value="2.3%" description="workforce with formal training" />
                    <InsightStat label="Digital Jobs" value="65M+" description="digital jobs by 2025" />
                    <InsightStat label="Skill Gap" value="48%" description="employers report skill shortage" />
                </div>
            </div>
        </div>
    );
}

function QuickStat({ icon, label, value, subtext, color }: any) {
    return (
        <div className="glass-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center text-2xl`}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-gray-400">{label}</div>
                <div className="text-xs text-gray-500">{subtext}</div>
            </div>
        </div>
    );
}

function ActionCard({ icon, title, description, href, gradient }: any) {
    return (
        <Link href={href} className="glass-card group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
            <div className="relative">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-400 transition-colors">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
                <div className="mt-3 text-indigo-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open →
                </div>
            </div>
        </Link>
    );
}

function InsightStat({ label, value, description }: any) {
    return (
        <div className="text-center p-4 rounded-xl bg-[#111827]">
            <div className="text-2xl font-bold gradient-text">{value}</div>
            <div className="text-sm font-medium text-gray-300 mt-1">{label}</div>
            <div className="text-xs text-gray-500">{description}</div>
        </div>
    );
}

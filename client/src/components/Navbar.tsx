"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isLanding = pathname === "/";

    if (isLanding) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-[#1e293b]">
            <div className="flex items-center justify-between px-6 h-16">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        S
                    </div>
                    <span className="text-lg font-bold gradient-text hidden sm:block">
                        SkillSetra AI
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-2">
                    <NavLink href="/dashboard" label="Dashboard" active={pathname === "/dashboard"} />
                    <NavLink href="/career-chat" label="AI Chat" active={pathname === "/career-chat"} />
                    <NavLink href="/skill-assessment" label="Assessment" active={pathname === "/skill-assessment"} />
                    <NavLink href="/resume-analyzer" label="Resume" active={pathname === "/resume-analyzer"} />
                    <NavLink href="/job-explorer" label="Jobs" active={pathname === "/job-explorer"} />
                    <NavLink href="/learning-roadmap" label="Roadmap" active={pathname === "/learning-roadmap"} />
                    <NavLink href="/mock-interview" label="Interview" active={pathname === "/mock-interview"} />
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#111827] border-t border-[#1e293b] px-4 py-4 flex flex-col gap-2 slide-in-left">
                    <NavLink href="/dashboard" label="📊 Dashboard" active={pathname === "/dashboard"} onClick={() => setMobileOpen(false)} />
                    <NavLink href="/career-chat" label="🤖 AI Career Chat" active={pathname === "/career-chat"} onClick={() => setMobileOpen(false)} />
                    <NavLink href="/skill-assessment" label="🧠 Skill Assessment" active={pathname === "/skill-assessment"} onClick={() => setMobileOpen(false)} />
                    <NavLink href="/resume-analyzer" label="📄 Resume Analyzer" active={pathname === "/resume-analyzer"} onClick={() => setMobileOpen(false)} />
                    <NavLink href="/job-explorer" label="💼 Job Explorer" active={pathname === "/job-explorer"} onClick={() => setMobileOpen(false)} />
                    <NavLink href="/learning-roadmap" label="🗺️ Learning Roadmap" active={pathname === "/learning-roadmap"} onClick={() => setMobileOpen(false)} />
                    <NavLink href="/mock-interview" label="🎤 Mock Interview" active={pathname === "/mock-interview"} onClick={() => setMobileOpen(false)} />
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${active
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
        >
            {label}
        </Link>
    );
}

"use client";
import { useState } from "react";
import { roadmapAPI } from "@/lib/api";

export default function LearningRoadmap() {
    const [skills, setSkills] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [level, setLevel] = useState("beginner");
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<any>(null);

    const generateRoadmap = async () => {
        if (!targetRole.trim()) return;
        setLoading(true);
        try {
            const data = await roadmapAPI.generate({
                skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
                target_role: targetRole,
                current_level: level,
            });
            setRoadmap(data);
        } catch (error: any) {
            alert("Failed to generate: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const quickRoles = [
        "Full Stack Developer", "Data Scientist", "Digital Marketer",
        "UI/UX Designer", "DevOps Engineer", "Mobile App Developer",
        "Business Analyst", "Cyber Security Analyst",
    ];

    return (
        <div className="pt-20 pb-10 px-6 max-w-5xl mx-auto">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                    🗺️ <span className="gradient-text">Learning Roadmap</span>
                </h1>
                <p className="text-gray-400 mt-1">AI-generated personalized learning path with free resources</p>
            </div>

            {!roadmap ? (
                <div className="fade-in">
                    <div className="glass-card mb-6">
                        <div className="mb-4">
                            <label className="text-sm text-gray-400 mb-2 block">Your Current Skills (comma-separated)</label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="e.g., HTML, CSS, Basic Python"
                                className="input-field"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-400 mb-2 block">Target Career Role</label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Full Stack Developer"
                                className="input-field"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {quickRoles.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setTargetRole(role)}
                                        className={`text-xs px-3 py-1.5 rounded-lg transition-all ${targetRole === role
                                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                                : "bg-[#111827] text-gray-400 hover:text-indigo-300"
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-gray-400 mb-2 block">Current Level</label>
                            <div className="flex gap-3">
                                {["beginner", "intermediate", "advanced"].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${level === l
                                                ? "bg-indigo-500 text-white"
                                                : "bg-[#1a1f36] text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={generateRoadmap} disabled={!targetRole.trim() || loading} className="btn-primary">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                    Generating Roadmap...
                                </span>
                            ) : (
                                "🗺️ Generate My Roadmap"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="fade-in">
                    {/* Header */}
                    <div className="glass-card mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold gradient-text">{roadmap.target_role}</h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Estimated Duration: {roadmap.estimated_duration || "6 months"}
                                </p>
                            </div>
                            {roadmap.career_prospects && (
                                <div className="flex gap-4 text-sm">
                                    <div className="text-center px-4 py-2 rounded-xl bg-green-500/10">
                                        <div className="text-green-400 font-semibold">{roadmap.career_prospects.avg_salary}</div>
                                        <div className="text-gray-500 text-xs">Avg Salary</div>
                                    </div>
                                    <div className="text-center px-4 py-2 rounded-xl bg-blue-500/10">
                                        <div className="text-blue-400 font-semibold">{roadmap.career_prospects.demand}</div>
                                        <div className="text-gray-500 text-xs">Demand</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Phases */}
                    <div className="space-y-6">
                        {roadmap.phases?.map((phase: any, i: number) => (
                            <div key={i} className="relative">
                                {/* Timeline connector */}
                                {i < (roadmap.phases?.length || 0) - 1 && (
                                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-transparent" />
                                )}
                                <div className="glass-card ml-0 md:ml-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {phase.phase || i + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{phase.title}</h3>
                                            <p className="text-sm text-gray-400">{phase.duration}</p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {phase.skills && (
                                        <div className="mb-4">
                                            <h4 className="text-sm text-gray-400 mb-2">Skills to Learn</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {phase.skills.map((skill: string, j: number) => (
                                                    <span key={j} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resources */}
                                    {phase.resources && (
                                        <div className="mb-4">
                                            <h4 className="text-sm text-gray-400 mb-2">📚 Resources</h4>
                                            <div className="space-y-2">
                                                {phase.resources.map((res: any, j: number) => (
                                                    <div key={j} className="flex items-center justify-between p-3 rounded-xl bg-[#111827]">
                                                        <div>
                                                            <p className="text-sm font-medium">{res.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {res.platform} · {res.duration} · {res.type}
                                                            </p>
                                                        </div>
                                                        {res.url && (
                                                            <a
                                                                href={res.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-400 text-sm hover:underline"
                                                            >
                                                                Open →
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Milestones */}
                                    {phase.milestones && (
                                        <div>
                                            <h4 className="text-sm text-gray-400 mb-2">🎯 Milestones</h4>
                                            <ul className="space-y-1">
                                                {phase.milestones.map((m: string, j: number) => (
                                                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                                                        <span className="w-4 h-4 rounded border border-gray-600 flex-shrink-0" />
                                                        {m}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setRoadmap(null)} className="btn-secondary mt-8">
                        Generate Another Roadmap
                    </button>
                </div>
            )}
        </div>
    );
}

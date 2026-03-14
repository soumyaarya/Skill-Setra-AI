"use client";
import { useState } from "react";
import { resumeAPI } from "@/lib/api";

export default function ResumeAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [targetRole, setTargetRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (targetRole) formData.append("target_role", targetRole);
            const data = await resumeAPI.analyze(formData);
            setResult(data);
        } catch (error: any) {
            alert("Analysis failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith(".pdf") || droppedFile.name.endsWith(".txt"))) {
            setFile(droppedFile);
        }
    };

    return (
        <div className="pt-20 pb-10 px-6 max-w-4xl mx-auto">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                    📄 <span className="gradient-text">Resume Analyzer</span>
                </h1>
                <p className="text-gray-400 mt-1">AI-powered resume scoring with PyTorch entity extraction & Gemini analysis</p>
            </div>

            {!result ? (
                <div className="fade-in">
                    {/* Upload Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`glass-card text-center py-16 mb-6 cursor-pointer transition-all ${dragOver ? "border-indigo-500 bg-indigo-500/5" : ""
                            }`}
                        onClick={() => document.getElementById("file-input")?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept=".pdf,.txt"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <div className="text-5xl mb-4">📤</div>
                        {file ? (
                            <div>
                                <p className="text-lg font-semibold text-indigo-400">{file.name}</p>
                                <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-lg font-semibold mb-2">Drop your resume here</p>
                                <p className="text-gray-400 text-sm">or click to browse · PDF or TXT · Max 5MB</p>
                            </div>
                        )}
                    </div>

                    {/* Target Role */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-2 block">Target Role (optional)</label>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g., Full Stack Developer, Data Analyst, Marketing Manager"
                            className="input-field"
                        />
                    </div>

                    <button onClick={handleUpload} disabled={!file || loading} className="btn-primary">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                Analyzing Resume...
                            </span>
                        ) : (
                            "Analyze Resume →"
                        )}
                    </button>
                </div>
            ) : (
                <div className="fade-in space-y-6">
                    {/* Overall Score */}
                    <div className="glass-card text-center">
                        <h2 className="text-xl font-semibold mb-4">Resume Analysis Complete! 📊</h2>
                        <div className="score-circle mx-auto mb-4" style={{ "--score": result.overall_score } as any}>
                            <span className="gradient-text">{result.overall_score}</span>
                        </div>
                        <p className="text-gray-400">
                            {result.overall_score >= 70
                                ? "Great resume! A few tweaks could make it perfect."
                                : result.overall_score >= 50
                                    ? "Good start. See suggestions below to improve."
                                    : "Your resume needs significant improvements. Follow the tips below."}
                        </p>
                        {result.match_percentage && (
                            <p className="text-indigo-400 text-sm mt-2">
                                {result.match_percentage}% match for {targetRole}
                            </p>
                        )}
                    </div>

                    {/* Extracted Skills */}
                    {result.extracted_entities?.skills && (
                        <div className="glass-card">
                            <h3 className="text-lg font-semibold mb-3">🔍 Extracted Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.extracted_entities.skills.map((skill: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strengths */}
                    {result.strengths?.length > 0 && (
                        <div className="glass-card">
                            <h3 className="text-lg font-semibold mb-3 text-green-400">✅ Strengths</h3>
                            <ul className="space-y-2">
                                {result.strengths.map((s: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-green-400">✓</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Improvements */}
                    {result.improvements?.length > 0 && (
                        <div className="glass-card">
                            <h3 className="text-lg font-semibold mb-3 text-amber-400">⚠️ Areas to Improve</h3>
                            <ul className="space-y-2">
                                {result.improvements.map((s: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-amber-400">!</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {result.missing_skills?.length > 0 && (
                        <div className="glass-card">
                            <h3 className="text-lg font-semibold mb-3 text-red-400">❌ Missing Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills.map((skill: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {result.suggestions?.length > 0 && (
                        <div className="glass-card">
                            <h3 className="text-lg font-semibold mb-3 text-blue-400">💡 Suggestions</h3>
                            <ul className="space-y-2">
                                {result.suggestions.map((s: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-blue-400">→</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button onClick={() => { setResult(null); setFile(null); }} className="btn-secondary">
                        Analyze Another Resume
                    </button>
                </div>
            )}
        </div>
    );
}

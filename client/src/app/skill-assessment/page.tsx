"use client";
import { useState } from "react";
import { skillsAPI } from "@/lib/api";

export default function SkillAssessment() {
    const [step, setStep] = useState<"select" | "quiz" | "result">("select");
    const [domain, setDomain] = useState("");
    const [difficulty, setDifficulty] = useState("intermediate");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [assessmentId, setAssessmentId] = useState("");
    const [answers, setAnswers] = useState<number[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [result, setResult] = useState<any>(null);

    const domains = [
        { name: "Information Technology", icon: "💻", color: "indigo" },
        { name: "Data Science", icon: "📊", color: "blue" },
        { name: "Web Development", icon: "🌐", color: "cyan" },
        { name: "Digital Marketing", icon: "📱", color: "pink" },
        { name: "Healthcare", icon: "🏥", color: "green" },
        { name: "Manufacturing", icon: "🏭", color: "amber" },
        { name: "Retail & Sales", icon: "🛒", color: "orange" },
        { name: "Finance & Accounting", icon: "💰", color: "emerald" },
        { name: "Graphic Design", icon: "🎨", color: "purple" },
        { name: "Communication Skills", icon: "🗣️", color: "rose" },
        { name: "Business Management", icon: "📋", color: "teal" },
        { name: "Customer Service", icon: "🤝", color: "violet" },
    ];

    const startAssessment = async () => {
        if (!domain) return;
        setLoading(true);
        try {
            const data = await skillsAPI.assess({ domain, difficulty });
            setQuestions(data.questions);
            setAssessmentId(data.assessment_id);
            setAnswers(new Array(data.questions.length).fill(-1));
            setStep("quiz");
        } catch (error: any) {
            alert("Failed to generate assessment: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (index: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = index;
        setAnswers(newAnswers);
    };

    const submitAssessment = async () => {
        setLoading(true);
        try {
            const data = await skillsAPI.submit({
                assessment_id: assessmentId,
                answers: answers,
            });
            setResult(data);
            setStep("result");
        } catch (error: any) {
            alert("Failed to submit: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 pb-10 px-6 max-w-5xl mx-auto">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                    🧠 <span className="gradient-text">Skill Assessment</span>
                </h1>
                <p className="text-gray-400 mt-1">AI-powered assessment to identify your skill gaps</p>
            </div>

            {/* Step: Domain Selection */}
            {step === "select" && (
                <div className="fade-in">
                    <h2 className="text-xl font-semibold mb-4">Choose Your Domain</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {domains.map((d) => (
                            <button
                                key={d.name}
                                onClick={() => setDomain(d.name)}
                                className={`glass-card text-center cursor-pointer transition-all ${domain === d.name
                                        ? "border-indigo-500 bg-indigo-500/10"
                                        : ""
                                    }`}
                            >
                                <div className="text-3xl mb-2">{d.icon}</div>
                                <div className="text-sm font-medium">{d.name}</div>
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-2 block">Difficulty Level</label>
                        <div className="flex gap-3">
                            {["beginner", "intermediate", "advanced"].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${difficulty === level
                                            ? "bg-indigo-500 text-white"
                                            : "bg-[#1a1f36] text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={startAssessment}
                        disabled={!domain || loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                Generating Questions...
                            </span>
                        ) : (
                            "Start Assessment →"
                        )}
                    </button>
                </div>
            )}

            {/* Step: Quiz */}
            {step === "quiz" && questions.length > 0 && (
                <div className="fade-in">
                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Question {currentQ + 1} of {questions.length}</span>
                            <span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#1a1f36]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question */}
                    <div className="glass-card mb-6">
                        <h3 className="text-lg font-semibold mb-6">
                            {questions[currentQ].question}
                        </h3>
                        <div className="space-y-3">
                            {questions[currentQ].options.map((opt: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => selectAnswer(i)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQ] === i
                                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                                            : "border-[#1e293b] bg-[#111827] hover:border-gray-500 text-gray-300"
                                        }`}
                                >
                                    <span className="font-medium mr-3 text-gray-500">
                                        {String.fromCharCode(65 + i)}.
                                    </span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                            disabled={currentQ === 0}
                            className="btn-secondary"
                        >
                            ← Previous
                        </button>
                        {currentQ < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQ(currentQ + 1)}
                                disabled={answers[currentQ] === -1}
                                className="btn-primary"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={submitAssessment}
                                disabled={answers.includes(-1) || loading}
                                className="btn-primary"
                            >
                                {loading ? "Evaluating..." : "Submit & Get Report"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Step: Result */}
            {step === "result" && result && (
                <div className="fade-in">
                    <div className="glass-card mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Assessment Complete! 🎉</h2>
                        <div
                            className="score-circle mx-auto mb-4"
                            style={{ "--score": result.overall_score } as any}
                        >
                            <span className="gradient-text">{result.overall_score}%</span>
                        </div>
                        <p className="text-gray-400">
                            You scored {result.correct_answers} out of {result.total_questions} in{" "}
                            <span className="text-indigo-400">{result.domain}</span>
                        </p>
                    </div>

                    {/* Skill Breakdown */}
                    {result.skill_breakdown && (
                        <div className="glass-card mb-6">
                            <h3 className="text-lg font-semibold mb-4">📊 Skill Breakdown</h3>
                            <div className="space-y-4">
                                {result.skill_breakdown.map((skill: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{skill.skill_name}</span>
                                            <span className={skill.score >= 60 ? "text-green-400" : "text-red-400"}>
                                                {skill.score}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-[#111827]">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${skill.score >= 60
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                                        : "bg-gradient-to-r from-red-500 to-orange-500"
                                                    }`}
                                                style={{ width: `${skill.score}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Industry Average: {skill.industry_avg}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    <div className="glass-card mb-6">
                        <h3 className="text-lg font-semibold mb-3">💡 Recommendations</h3>
                        <ul className="space-y-2">
                            {result.recommendations?.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-indigo-400 mt-0.5">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={() => { setStep("select"); setResult(null); setDomain(""); }} className="btn-primary">
                        Take Another Assessment
                    </button>
                </div>
            )}
        </div>
    );
}

"use client";
import { useState } from "react";
import { interviewAPI } from "@/lib/api";

export default function MockInterview() {
    const [role, setRole] = useState("");
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [questionNum, setQuestionNum] = useState(1);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    const roles = [
        "Software Developer", "Data Analyst", "Web Developer",
        "Marketing Executive", "Sales Manager", "HR Executive",
        "Accountant", "Teacher", "Graphic Designer",
        "Nurse", "Electrician", "Customer Service",
    ];

    const startInterview = async () => {
        if (!role.trim()) return;
        setLoading(true);
        try {
            const data = await interviewAPI.start({ role });
            setCurrentQuestion(data);
            setStarted(true);
            setQuestionNum(1);
        } catch (error: any) {
            alert("Failed to start: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        setFeedback(null);
        try {
            const data = await interviewAPI.answer({
                role,
                question_num: questionNum,
                answer: answer,
            });

            setFeedback(data);
            setHistory((prev) => [
                ...prev,
                {
                    question: currentQuestion?.question || currentQuestion?.next_question,
                    answer: answer,
                    score: data.score,
                    feedback: data.feedback,
                },
            ]);

            if (data.next_question) {
                setCurrentQuestion({ question: data.next_question });
                setQuestionNum(questionNum + 1);
            }
            setAnswer("");
        } catch (error: any) {
            alert("Failed to evaluate: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const avgScore = history.length
        ? (history.reduce((acc, h) => acc + (h.score || 0), 0) / history.length).toFixed(1)
        : 0;

    return (
        <div className="pt-20 pb-10 px-6 max-w-4xl mx-auto">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                    🎤 <span className="gradient-text">Mock Interview</span>
                </h1>
                <p className="text-gray-400 mt-1">Practice interviews with AI and get real-time feedback</p>
            </div>

            {!started ? (
                <div className="fade-in">
                    <div className="glass-card">
                        <h2 className="text-xl font-semibold mb-4">Select Your Target Role</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            {roles.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all ${role === r
                                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                            : "bg-[#111827] text-gray-400 hover:text-white border border-transparent"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-gray-400 mb-2 block">Or type a custom role</label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g., Machine Learning Engineer"
                                className="input-field"
                            />
                        </div>

                        <button onClick={startInterview} disabled={!role.trim() || loading} className="btn-primary">
                            {loading ? "Setting up interview..." : "🎤 Start Interview"}
                        </button>
                    </div>

                    <div className="glass-card mt-6">
                        <h3 className="text-lg font-semibold mb-3">💡 Interview Tips</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Use the STAR method (Situation, Task, Action, Result)</li>
                            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Keep answers concise — 2-3 minutes max</li>
                            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Give specific examples from your experience</li>
                            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Show enthusiasm and curiosity about the role</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="fade-in">
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                Q{questionNum}
                            </div>
                            <div>
                                <p className="font-semibold">{role} Interview</p>
                                <p className="text-sm text-gray-400">Question {questionNum}</p>
                            </div>
                        </div>
                        {history.length > 0 && (
                            <div className="text-center px-4 py-2 rounded-xl bg-indigo-500/10">
                                <div className="text-lg font-bold gradient-text">{avgScore}/10</div>
                                <div className="text-xs text-gray-400">Avg Score</div>
                            </div>
                        )}
                    </div>

                    {/* Current Question */}
                    <div className="glass-card mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">🤖</div>
                            <span className="text-sm text-indigo-400 font-medium">Interviewer</span>
                        </div>
                        <p className="text-lg leading-relaxed">
                            {currentQuestion?.question || currentQuestion?.next_question}
                        </p>
                        {currentQuestion?.tips && (
                            <div className="mt-3 p-3 rounded-xl bg-[#111827]">
                                <p className="text-xs text-gray-400 mb-1">💡 Tips:</p>
                                <ul className="space-y-1">
                                    {currentQuestion.tips.map((tip: string, i: number) => (
                                        <li key={i} className="text-xs text-gray-500">• {tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <div className="glass-card mb-6 border-l-4 border-indigo-500">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-indigo-400">Feedback</h3>
                                <span className={`text-lg font-bold ${(feedback.score || 0) >= 7 ? "text-green-400" : (feedback.score || 0) >= 5 ? "text-amber-400" : "text-red-400"
                                    }`}>
                                    {feedback.score}/10
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">{feedback.feedback}</p>
                            {feedback.ideal_answer && (
                                <div className="p-3 rounded-xl bg-[#111827]">
                                    <p className="text-xs text-gray-400 mb-1">Ideal Answer:</p>
                                    <p className="text-sm text-gray-300">{feedback.ideal_answer}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Answer Input */}
                    <div className="glass-card">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={4}
                            className="input-field mb-4 resize-none"
                        />
                        <div className="flex gap-3">
                            <button onClick={submitAnswer} disabled={!answer.trim() || loading} className="btn-primary">
                                {loading ? "Evaluating..." : "Submit Answer"}
                            </button>
                            <button onClick={() => { setStarted(false); setHistory([]); setFeedback(null); }} className="btn-secondary">
                                End Interview
                            </button>
                        </div>
                    </div>

                    {/* History */}
                    {history.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">📋 Interview History</h3>
                            <div className="space-y-3">
                                {history.map((h, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b]">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm font-medium text-gray-300">Q{i + 1}: {h.question}</p>
                                            <span className={`text-sm font-bold ${h.score >= 7 ? "text-green-400" : h.score >= 5 ? "text-amber-400" : "text-red-400"
                                                }`}>
                                                {h.score}/10
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Your answer: {h.answer.substring(0, 100)}...</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { careerAPI } from "@/lib/api";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function CareerChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            content:
                "Namaste! 🙏 I'm SkillSetra AI, your personal career guidance counselor. I can help you with:\n\n• **Career path recommendations** based on your skills\n• **Industry trends** in India's job market\n• **Government schemes** like PMKVY, NCS\n• **Skill development** advice\n• **Blue-collar & white-collar** career guidance\n\nTell me about yourself — what are your skills, education, and career goals?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const data = await careerAPI.chat({
                message: userMsg,
                skills: [],
                location: "India",
                experience_years: 0,
            });
            setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
        } catch (error: any) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: `Sorry, I encountered an error: ${error.message}. Please make sure the backend server is running.`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQueries = [
        "What are the best career options after 12th Commerce?",
        "How can I transition from manual labor to digital skills?",
        "What ITI courses are in demand in India?",
        "Top freelancing skills for Indian youth",
    ];

    return (
        <div className="pt-20 pb-4 px-4 md:px-6 max-w-4xl mx-auto h-screen flex flex-col">
            {/* Header */}
            <div className="mb-4 fade-in">
                <h1 className="text-2xl font-bold">
                    🤖 <span className="gradient-text">AI Career Chat</span>
                </h1>
                <p className="text-gray-400 text-sm">Powered by Groq LLaMA 3 + LangChain RAG</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`chat-message ${msg.role === "user" ? "chat-user" : "chat-ai"}`}>
                            {msg.role === "ai" && (
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold">
                                        S
                                    </div>
                                    <span className="text-xs text-indigo-400 font-medium">SkillSetra AI</span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="chat-message chat-ai">
                            <div className="flex items-center gap-2">
                                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                <span className="text-sm text-gray-400">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Suggested Queries */}
            {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {suggestedQueries.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setInput(q);
                            }}
                            className="text-xs px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask me anything about careers, skills, or jobs..."
                    className="input-field flex-1"
                    disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary">
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}

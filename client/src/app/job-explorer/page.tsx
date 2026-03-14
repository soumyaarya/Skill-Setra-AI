"use client";
import { useState } from "react";
import { jobsAPI } from "@/lib/api";

export default function JobExplorer() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("India");
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);

    const searchJobs = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const data = await jobsAPI.search({ query, location });
            setJobs(data.jobs || []);
        } catch (error: any) {
            alert("Search failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const popularSearches = [
        "Python Developer", "Data Analyst", "Web Developer",
        "Digital Marketing", "Graphic Designer", "Customer Support",
        "Electrician", "Nursing", "Accounting",
    ];

    return (
        <div className="pt-20 pb-10 px-6 max-w-6xl mx-auto">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl font-bold">
                    💼 <span className="gradient-text">Job Explorer</span>
                </h1>
                <p className="text-gray-400 mt-1">Real-time job listings with Pinecone skill-match ranking</p>
            </div>

            {/* Search */}
            <div className="glass-card mb-8 fade-in">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-sm text-gray-400 mb-1 block">Job Role / Skills</label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchJobs()}
                            placeholder="e.g., Python Developer, Data Analyst..."
                            className="input-field"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-sm text-gray-400 mb-1 block">Location</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input-field"
                        >
                            <option value="India">All India</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi NCR</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Pune">Pune</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={searchJobs} disabled={loading || !query.trim()} className="btn-primary w-full md:w-auto">
                            {loading ? "Searching..." : "🔍 Search"}
                        </button>
                    </div>
                </div>

                {/* Popular searches */}
                {!searched && (
                    <div className="mt-4">
                        <span className="text-xs text-gray-500 mr-2">Popular:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {popularSearches.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setQuery(s); }}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-[#111827] text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            )}

            {/* Results */}
            {!loading && searched && (
                <div>
                    <p className="text-sm text-gray-400 mb-4">{jobs.length} jobs found for &ldquo;{query}&rdquo; in {location}</p>
                    <div className="space-y-4 stagger-children">
                        {jobs.map((job, i) => (
                            <div key={i} className="glass-card flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-lg">
                                            💼
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <p className="text-sm text-gray-400">{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                                        <span>📍 {job.location}</span>
                                        <span>💰 {job.salary}</span>
                                        <span>📋 {job.employment_type}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
                                    {job.required_skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {job.required_skills.slice(0, 5).map((skill: string, j: number) => (
                                                <span key={j} className="px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-300">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 md:items-end">
                                    <a
                                        href={job.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary text-sm px-5 py-2.5"
                                    >
                                        Apply →
                                    </a>
                                    <span className="text-xs text-gray-500">{job.posted_date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && searched && jobs.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-xl font-semibold mb-2">No jobs found</p>
                    <p className="text-gray-400">Try a different search term or location</p>
                </div>
            )}
        </div>
    );
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || "Something went wrong");
    }

    return response.json();
}

// Auth APIs
export const authAPI = {
    register: (data: any) =>
        apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: any) =>
        apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    profile: () => apiRequest("/api/auth/profile"),
};

// Career Chat API
export const careerAPI = {
    chat: (data: any) =>
        apiRequest("/api/career/chat", { method: "POST", body: JSON.stringify(data) }),
};

// Skills Assessment API
export const skillsAPI = {
    assess: (data: any) =>
        apiRequest("/api/skills/assess", { method: "POST", body: JSON.stringify(data) }),
    submit: (data: any) =>
        apiRequest("/api/skills/submit", { method: "POST", body: JSON.stringify(data) }),
};

// Resume API
export const resumeAPI = {
    analyze: (formData: FormData) =>
        apiRequest("/api/resume/analyze", { method: "POST", body: formData }),
};

// Jobs API
export const jobsAPI = {
    search: (data: any) =>
        apiRequest("/api/jobs/search", { method: "POST", body: JSON.stringify(data) }),
};

// Interview API
export const interviewAPI = {
    start: (data: any) =>
        apiRequest("/api/interview/start", { method: "POST", body: JSON.stringify(data) }),
    answer: (data: any) =>
        apiRequest("/api/interview/answer", { method: "POST", body: JSON.stringify(data) }),
};

// Roadmap API
export const roadmapAPI = {
    generate: (data: any) =>
        apiRequest("/api/roadmap/generate", { method: "POST", body: JSON.stringify(data) }),
};

const API_URL = import.meta.env.VITE_API_URL;

async function request(
    endpoint,
    options = {}
) {
    const token = localStorage.getItem("access_token");

    const headers = {
        ...(options.headers || {})
    };

    // JSON request ke liye
    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {
        headers["Content-Type"] =
            "application/json";
    }

    // JWT
    if (token) {
        headers["Authorization"] =
            `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    const data = await response.json()
        .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "Something went wrong"
        );
    }

    return data;
}


// ----------------------
// Auth
// ----------------------

export async function registerUser(
    name,
    email,
    password
) {
    return request(
        "/auth/register",
        {
            method: "POST",

            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );
}


export async function loginUser(
    email,
    password
) {
    return request(
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                email,
                password
            })
        }
    );
}


// ----------------------
// Current User
// ----------------------

export async function getCurrentUser() {
    return request(
        "/users/me"
    );
}


// ----------------------
// Resume
// ----------------------

export async function uploadResume(
    file
) {
    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    return request(
        "/resume/upload",
        {
            method: "POST",
            body: formData
        }
    );
}


export async function getResumeHistory() {
    return request(
        "/resume/history"
    );
}


export async function deleteResume(
    resumeId
) {
    return request(
        `/resume/${resumeId}`,
        {
            method: "DELETE"
        }
    );
}


// ----------------------
// ATS
// ----------------------

export async function analyzeResume(
    resumeId,
    jobDescription
) {
    return request(
        `/ats/analyze/${resumeId}`,
        {
            method: "POST",

            body: JSON.stringify({
                job_description:
                    jobDescription
            })
        }
    );
}


export async function getATSHistory() {
    return request(
        "/ats/history"
    );
}


export async function getAnalysis(
    analysisId
) {
    return request(
        `/ats/${analysisId}`
    );
}


export async function getAIFeedback(
    analysisId
) {
    return request(
        `/ats/ai-feedback/${analysisId}`,
        {
            method: "POST"
        }
    );
}
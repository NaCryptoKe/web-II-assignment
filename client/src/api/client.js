const API_BASE = "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
    const headers = {
        ...(options.headers || {}),
    };

    // 🔥 CRITICAL FIX
    if (options.body instanceof FormData) {
        // Let the browser set Content-Type with boundary
        delete headers["Content-Type"];
    } else if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        ...options,
        headers,
    });

    const json = await res.json();
    return json;
}

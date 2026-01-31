import { apiRequest } from "../api/client";

export async function checkAdminStatus() {
    return apiRequest("/admin/authenticate", { method: "GET" });
}

export async function fetchAllGames() {
    return apiRequest("/admin/games", { method: "GET" });
}

export async function acceptGame(id) {
    return apiRequest(`/admin/games/accept/${id}`, { method: "POST" });
}

export async function rejectGame(id) {
    return apiRequest(`/admin/games/reject/${id}`, { method: "POST" });
}

export async function fetchAllUsers() {
    return apiRequest("/admin/users", { method: "GET" });
}

export async function fetchRevenueData() {
    return apiRequest("/admin/revenue", { method: "GET" });
}
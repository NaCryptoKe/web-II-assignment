// src/services/gameService.js
import { apiRequest } from "../api/client";

/**
 * Uploads a new game. 
 * Note: If you are sending files (game binary/image), keep using formData.
 * If you are sending only text, use JSON.stringify as shown below.
 */
export async function uploadGame(gameData) {
    return apiRequest("/game", { 
        method: "POST", 
        body: gameData
    });
}

/**
 * Updates game details (Title, Description, Price)
 * Matches the new EditGamePage requirements.
 */
export async function updateGame(id, data) {
    return apiRequest(`/game/${id}`, { 
        method: "PUT", 
        body: JSON.stringify(data) 
    });
}

export async function getGameById(id) {
    return apiRequest(`/game/${id}`, { 
        method: "GET" 
    });
}

export async function getMyUploadedGames() {
    return apiRequest("/game/my-games", { 
        method: "GET" 
    });
}

export async function getLibrary() {
    return apiRequest("/game/library", { 
        method: "GET" 
    });
}

export async function searchGames(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/game/search?${query}`, { 
        method: "GET" 
    });
}

export async function downloadGame(id) {
    return apiRequest(`/game/download/${id}`, { 
        method: "GET" 
    });
}
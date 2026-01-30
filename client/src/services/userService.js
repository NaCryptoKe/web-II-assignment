// src/services/userService.js
import { apiRequest } from "../api/client";

/**
 * Interacts with userController.js via userRoutes.js
 */

export async function updateProfile(data) {
    return apiRequest("/user/profile", { 
        method: "PUT", 
        body: JSON.stringify(data) 
    });
}

export const getUserById = (id) => {
    return apiRequest(`/users/${id}`, { 
        method: "GET" 
    });
};

export async function updatePassword(data) {
    return apiRequest("/user/password", { 
        method: "PUT", 
        body: JSON.stringify(data) // expects { oldPassword, newPassword }
    });
}

export async function deleteAccount() {
    return apiRequest("/user/", { 
        method: "DELETE" 
    });
}

import { apiRequest } from "../api/client";



export async function updateProfile(data) {
    return apiRequest("/users/profile", { 
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
    return apiRequest("/users/password", { 
        method: "PUT", 
        body: JSON.stringify(data) 
    });
}

export async function deleteAccount() {
    return apiRequest("/user/", { 
        method: "DELETE" 
    });
}
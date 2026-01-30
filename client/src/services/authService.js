// src/services/authService.js
import { apiRequest } from "../api/client";

/**
 * Authentication Service
 * Base Route: /auth
 * Interacts with authController.js
 */

export async function register(data) {
    return apiRequest("/auth/register", { 
        method: "POST", 
        body: JSON.stringify(data) 
    });
}

export async function login(credentials) {
    return apiRequest("/auth/login", { 
        method: "POST", 
        body: JSON.stringify(credentials) 
    });
}

export async function logout() {
    return apiRequest("/auth/logout", { 
        method: "POST",
        credentials: 'include' // Important for clearing httpOnly cookies
    });
}

/**
 * Calls the /authenticate route which uses the 'auth' middleware 
 * to return the user data from the JWT token.
 */
export async function checkAuthStatus() {
    return apiRequest("/auth/authenticate", {
        method: "GET"
    });
}

/**
 * OTP Management
 */

// backend: otpGenerator controller
export async function generateOtp(data) {
    return apiRequest("/auth/generate-otp", { 
        method: "POST", 
        body: JSON.stringify(data) // expects { email }
    });
}

// backend: verifyOtp controller
export async function verifyOtp(credentials) {
    return apiRequest("/auth/verify-otp", { 
        method: "POST", 
        body: JSON.stringify(credentials) // expects { email, otp }
    });
}

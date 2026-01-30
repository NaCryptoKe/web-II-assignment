import { createContext, useState, useEffect, useContext } from 'react';
import { checkAuthStatus, logout as logoutService } from '../services/authService';

export const AuthContext = createContext(); // Creates a global auth container

export const AuthProvider = ({ children }) => {     // This is a wrapper component
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Check if user is already logged in when app starts
    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await checkAuthStatus();
                // Matches your controller response { success: true, data: { user } }
                if (response.success || response.status === "success") {
                    setUser(response.data);
                }
            } catch (_) {
                setUser(null);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };
        initAuth();
    }, []);

    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext easily in components
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
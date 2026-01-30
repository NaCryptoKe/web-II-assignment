import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    login as loginService, 
    register as registerService, 
    generateOtp as generateOtpService,
    verifyOtp as verifyOtpService
} from '../services/authService';

export const useAuth = () => {
    const context = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const login = async (credentials) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await loginService(credentials);

            if (response.success === false || response.status === "error") {
                const errorMessage = response.message || "An error occurred during login";
                setError(errorMessage);

                // implement a toast here if error exists
                if (error) console.log(errorMessage);
                return response;
            }

            if (response.data?.user) {
                context.setUser(response.data.user);
            }
            
            return response;

        } catch (err) {
            const msg = err.message || "Login failed";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const register = async (userData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await registerService(userData);
            console.log(response);
            
            if (response.success === false || response.status === "error") {
                const errorMessage = response.message || "An error occurred during registration";
                setError(errorMessage);
                console.error("Registration Error Profile:", response.message);
            }

            return response;
        } catch (err) {
            const msg = err.message || "Registration failed";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateOtp = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await generateOtpService(data);

            if (response.success === false || response.status === 'error') {
                const errorMessage = response.message || "An error occurred generating OTP";
                setError(errorMessage);
            }
            return response;
        } catch (err) {
            const msg = err.message || "OTP Generation failed";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOtp = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await verifyOtpService(data);

            if (response.success === false || response.status === 'error') {
                const errorMessage = response.message || "An error occurred during verification";
                setError(errorMessage);
                return response;
            }

            // Since verifyOtp also logs the user in on the backend
            if (response.data?.user) {
                context.setUser(response.data.user);
            }

            return response;
        } catch (err) {
            const msg = err.message || "Verification failed";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        ...context,
        login,
        register,
        isSubmitting,
        error,
        verifyOtp,
        generateOtp
    };
};
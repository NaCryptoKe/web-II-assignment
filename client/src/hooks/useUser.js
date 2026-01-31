
import { useState, useCallback } from 'react'; 
import { useAuthContext } from '../context/AuthContext';
import * as userService from '../services/userService';

export const useUser = () => {
    const { setUser, logout } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await userService.getUserById(id);
            return res;
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.updateProfile(data);
            console.log('HELLO', response)
            if (response.success) {
                setUser(prev => ({ ...prev, ...response.data }));
            } else {
                setError(response.message);
            }
            return response;
        } catch (err) {
            setError(err.message || "Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (passwords) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.updatePassword(passwords);
            if (!response.success) setError(response.message);
            return response;
        } catch (err) {
            setError(err.message || "Failed to update password");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        if (!window.confirm("Are you sure? This action is permanent.")) return;
        
        setLoading(true);
        try {
            const response = await userService.deleteAccount();
            if (response.success) {
                logout(); 
            }
            return response;
        } catch (err) {
            setError(err.message || "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, fetchUser, updatePassword, deleteAccount, loading, error };
};
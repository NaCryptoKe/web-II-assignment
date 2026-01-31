// src/hooks/useGame.js
import { useState, useCallback } from 'react';
import * as gameService from '../services/gameService';

export const useGame = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHomeData = useCallback(async () => {
        setLoading(true);
        try {
            const [newest, popular, rated] = await Promise.all([
                gameService.searchGames({ sortBy: 'created_at', order: 'desc' }),
                gameService.searchGames({ sortBy: 'downloads_count', order: 'desc' }),
                gameService.searchGames({ sortBy: 'rating', order: 'desc' })
            ]);
            return {
                newest: newest.data?.slice(0, 10) || [],
                popular: popular.data?.slice(0, 10) || [],
                rated: rated.data?.slice(0, 10) || []
            };
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGameDetails = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await gameService.getGameById(id);
            if (!response.success) {
                setError(response.message);
            }
            return response; // Should return { success: true, data: { ...gameData } }
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadGame = useCallback(async (gameData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await gameService.uploadGame(gameData);
            if (!response.success) {
                setError(response.message);
            }
            return response;
        } catch (err) {
            const errorMessage = err.message || "Failed to upload game";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        ...gameService, 
        fetchHomeData, 
        fetchGameDetails,
        uploadGame,
        loading, 
        error 
    };
};
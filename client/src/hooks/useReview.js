import { useState, useCallback } from 'react';
import * as reviewService from '../services/reviewService';

export const useReview = () => {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    /**
     * Fetches and stores reviews for a specific game.
     */
    const fetchReviews = useCallback(async (gameId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await reviewService.getGameReviews(gameId);
            if (res.success) {
                setReviews(res.data);
            } else {
                setError(res.message);
            }
            return res;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Posts a new review and refreshes the review list.
     * Triggers the backend addRating logic.
     */
    const addReview = async (reviewData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await reviewService.createReview(reviewData);
            if (res.success) {
                // Refresh list so the new review and updated rating appear
                await fetchReviews(reviewData.gameId);
            } else {
                setError(res.message);
            }
            return res;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Removes a review if the user is the owner or an admin.
     */
    const removeReview = async (reviewId, gameId) => {
        setLoading(true);
        try {
            const res = await reviewService.deleteReview(reviewId);
            if (res.success) {
                await fetchReviews(gameId);
            }
            return res;
        } finally {
            setLoading(false);
        }
    };

    return { 
        reviews, 
        fetchReviews, 
        addReview, 
        removeReview, 
        loading, 
        error 
    };
};
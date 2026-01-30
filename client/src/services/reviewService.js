import { apiRequest } from "../api/client";

/**
 * Creates a new review for a game.
 * Hits: POST /review
 * @param {Object} reviewData - { gameId, rating, review }
 */
export const createReview = (reviewData) => {
    return apiRequest("/review", {
        method: "POST",
        body: JSON.stringify(reviewData),
    });
};

/**
 * Retrieves all reviews for a specific game.
 * Hits: GET /review/game/:gameId
 */
export const getGameReviews = (gameId) => {
    return apiRequest(`/review/game/${gameId}`, { 
        method: "GET" 
    });
};

/**
 * Deletes a specific review by ID.
 * Hits: DELETE /review/:id
 */
export const deleteReview = (reviewId) => {
    return apiRequest(`/review/${reviewId}`, { 
        method: "DELETE" 
    });
};
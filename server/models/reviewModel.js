const pool = require('../config/db');

const reviewModel = {
    createReview: async (gameId, userId, rating, review) => {
        const query = `
            INSERT INTO public.reviews (game_id, user_id, rating, review)
            VALUES ($1, $2, $3, $4)
            RETURNING id, game_id AS "gameId", user_id AS "userId", rating, review, created_at AS "createdAt"
        `;
        const values = [gameId, userId, rating, review];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getReviewsByGameId: async (gameId) => {
        const query = `
            SELECT id, game_id AS "gameId", user_id AS "userId", rating, review, created_at AS "createdAt"
            FROM public.reviews
            WHERE game_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [gameId]);
        return result.rows;
    },

    getReviewById: async (id) => {
        const query = `
            SELECT id, game_id AS "gameId", user_id AS "userId", rating, review, created_at AS "createdAt"
            FROM public.reviews
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    deleteReview: async (id) => {
        const query = `
            DELETE FROM public.reviews
            WHERE id = $1
            RETURNING id
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = reviewModel;
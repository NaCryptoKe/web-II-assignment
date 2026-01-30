const pool = require('../config/db');

const gameModel = {
    // Helper string for standard game columns to keep code DRY
    gameColumns: `
        id, 
        title, 
        description, 
        price, 
        owner_id AS "ownerId", 
        status, 
        file_path AS "filePath", 
        image_path AS "imagePath", 
        downloads_count AS "downloadsCount", 
        rating_count AS "ratingCount", 
        review_count AS "reviewCount",
        created_at AS "createdAt"
    `,

    createGame: async (title, description, price, ownerId, filePath, imagePath) => {
        const query = `
            INSERT INTO games (title, description, price, owner_id, file_path, image_path, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING ${gameModel.gameColumns}
        `;
        const values = [title, description, price, ownerId, filePath, imagePath];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getGameById: async (id) => {
        const query = `SELECT ${gameModel.gameColumns} FROM games WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getGamesByOwner: async (ownerId) => {
        const query = `
            SELECT ${gameModel.gameColumns} 
            FROM games 
            WHERE owner_id = $1 
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [ownerId]);
        return result.rows;
    },

    getGamesByStatus: async (status) => {
        const query = `
            SELECT ${gameModel.gameColumns}
            FROM games
            WHERE status = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [status]);
        return result.rows;
    },

    updateGameStatus: async (gameId, newStatus) => {
        const query = `
            UPDATE games
            SET status = $1
            WHERE id = $2
            RETURNING ${gameModel.gameColumns}
        `;
        const result = await pool.query(query, [newStatus, gameId]);
        return result.rows[0];
    },

    increaseDownloadsCount: async (gameId) => {
        const query = `
            UPDATE games
            SET downloads_count = downloads_count + 1
            WHERE id = $1
            RETURNING ${gameModel.gameColumns}
        `;
        const result = await pool.query(query, [gameId]);
        return result.rows[0];
    },

    getGamesInUserLibrary: async (userId) => {
        const query = `
            SELECT 
                g.id, 
                g.title, 
                g.description, 
                g.price, 
                g.owner_id AS "ownerId", 
                g.status, 
                g.file_path AS "filePath", 
                g.image_path AS "image_path", 
                g.downloads_count AS "downloadsCount", 
                g.rating_count AS "ratingCount", 
                g.review_count AS "reviewCount",
                g.created_at AS "createdAt"
            FROM games g
            JOIN order_items oi ON g.id = oi.game_id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    checkLibraryAccess: async (userId, gameId) => {
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                WHERE o.user_id = $1 AND oi.game_id = $2
            ) AS hasAccess;
        `;
        const values = [userId, gameId];
        const result = await pool.query(query, values);
        return result.rows[0].hasaccess;
    },

    updateGame: async (gameId, title, description, price) => {
        const query = `
            UPDATE games 
            SET title = $1, description = $2, price = $3
            WHERE id = $4
            RETURNING ${gameModel.gameColumns}
        `;
        
        const result = await pool.query(query, [title, description, price, gameId]);
        return result.rows[0];
    },
    
    getAllGames: async () => {
        const query = `SELECT ${gameModel.gameColumns} FROM games ORDER BY created_at DESC`;
        const result = await pool.query(query);
        return result.rows;
    },

    // Inside your gameModel.js
    searchGames: async ({ searchTerm, minPrice, maxPrice, sortBy, order }) => {
        let query = `
            SELECT 
                g.*,
                COALESCE(r.avg_rating, 0) AS avg_rating
            FROM games g
            LEFT JOIN (
                SELECT game_id, AVG(rating) AS avg_rating
                FROM reviews
                GROUP BY game_id
            ) r ON r.game_id = g.id
            WHERE g.status = 'active'
        `;

        const values = [];
        let paramCount = 1;

        // 1. Search
        if (searchTerm) {
            query += `
                AND (g.title ILIKE $${paramCount}
                OR g.description ILIKE $${paramCount})
            `;
            values.push(`%${searchTerm}%`);
            paramCount++;
        }

        // 2. Price range
        if (minPrice !== undefined) {
            query += ` AND g.price >= $${paramCount}`;
            values.push(minPrice);
            paramCount++;
        }

        if (maxPrice !== undefined) {
            query += ` AND g.price <= $${paramCount}`;
            values.push(maxPrice);
            paramCount++;
        }

        // 3. Sorting
        const sortFieldMap = {
            created_at: "g.created_at",
            downloads_count: "g.downloads_count",
            price: "g.price",
            rating: "avg_rating",
        };

        const sortColumn = sortFieldMap[sortBy] || "g.created_at";
        const sortOrder = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const result = await pool.query(query, values);
        return result.rows;
    },

    addRating: async (gameId, rating) => {
        const query = `
            UPDATE games
            SET
                rating_count = rating_count + $1,
                review_count = review_count + 1
            WHERE id = $2
            RETURNING ${gameModel.gameColumns}
        `;
        const values = [rating, gameId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = gameModel;
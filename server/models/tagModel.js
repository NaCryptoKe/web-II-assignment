const pool = require('../config/db');

const tagModel = {
    createTag: async (name) => {
        const query = `
            INSERT INTO tags (name)
            VALUES ($1)
            RETURNING id, name
        `;
        const values = [name];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    deleteTag: async (tagId) => {
        const query = `DELETE FROM tags WHERE id = $1 RETURNING id, name`;
        const values = [tagId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getAllTags: async () => {
        const query = `
            SELECT id, name FROM tags ORDER BY name ASC
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (err) {
            throw err;
        }
    },
    
    getTagByName: async (name) => {
        const query = `SELECT id, name FROM tags WHERE name = $1`;
        const values = [name];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    // ----------------------
    // Game Associations (game_tags table)
    // ----------------------
    
    addTagToGame: async (gameId, tagId) => {
        const query = `
            INSERT INTO game_tags (game_id, tag_id)
            VALUES ($1, $2)
            RETURNING game_id AS "gameId", tag_id AS "tagId"
        `;
        const values = [gameId, tagId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new Error('This tag is already associated with this game.');
            }
            throw err;
        }
    },

    removeTagFromGame: async (gameId, tagId) => {
        const query = `
            DELETE FROM game_tags 
            WHERE game_id = $1 AND tag_id = $2
            RETURNING game_id AS "gameId", tag_id AS "tagId"
        `;
        const values = [gameId, tagId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getAllGameTags: async (gameId) => {
        const query = `
            SELECT game_id AS "gameId", tag_id AS "tagId" FROM game_tags
            WHERE game_id = $1
        `;
        const values = [gameId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        } 
    }
};

module.exports = tagModel;
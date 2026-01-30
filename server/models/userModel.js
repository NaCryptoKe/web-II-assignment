const pool = require('../config/db');

const userModel = {
    register: async (username, email, passwordHash) => {
        const query = `
            INSERT INTO public.users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, role, is_verified as "isVerified"
        `;
        const values = [username, email, passwordHash];
        
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    login: async (identifier) => {
        const query = `SELECT id, username, email, role, is_verified as "isVerified", password_hash as "passwordHash" FROM public.users WHERE email = $1 OR username = $1`;
        const values = [identifier];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },
    updateProfile: async (userId, username, email) => {
        const query = `
            UPDATE public.users 
            SET username = $1, email = $2 
            WHERE id = $3 
            RETURNING id, username, email, role, is_verified as "isVerified"
        `;
        const values = [username, email, userId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },
    verifyUser: async (email) => {
        const query = `
            UPDATE public.users 
            SET is_verified = TRUE 
            WHERE email = $1 
            RETURNING id, username, email, role, is_verified as "isVerified"
        `;
        const values = [email];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    updatePassword: async (userId, newPasswordHash) => {
        const query = `
            UPDATE public.users 
            SET password_hash = $1 
            WHERE id = $2
            RETURNING id
        `;
        const values = [newPasswordHash, userId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    deleteUser: async (userId) => {
        const query = `DELETE FROM public.users WHERE id = $1 RETURNING id`;
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getAllUsers: async () => {
        const query = `
            SELECT id, username, email, role, is_verified AS "isVerified", created_at AS "createdAt"
            FROM public.users
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (err) {
            throw err;
        }
    },

    getUserById: async (userId) => {
        const query = `
            SELECT id, username, email, role, is_verified AS "isVerified"
            FROM public.users
            WHERE id = $1
        `;
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }
};

module.exports = userModel;
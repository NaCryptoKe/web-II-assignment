const pool = require('../config/db');

const otpModel = {
    createOTP: async (email, code, expiresAt) => {
        const query = `
            INSERT INTO otp (email, code, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, email, code, expires_at AS "expiresAt", created_at AS "createdAt"
        `;
        const values = [email, code, expiresAt];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getOTPByEmail: async (email) => {
        const query = `
            SELECT id, email, code, expires_at AS "expiresAt", created_at AS "createdAt" FROM otp 
            WHERE email = $1 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const values = [email];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    deleteOTPByEmail: async (email) => {
        const query = `DELETE FROM otp WHERE email = $1 RETURNING id, email, code, expires_at AS "expiresAt", created_at AS "createdAt"`;
        const values = [email];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = otpModel;
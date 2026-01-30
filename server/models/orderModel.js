const pool = require('../config/db');

const orderModel = {
    createOrder: async (userId, totalPrice, client = pool) => {
        const query = `
            INSERT INTO public.orders (user_id, total_price)
            VALUES ($1, $2)
            RETURNING id, user_id AS "userId", total_price AS "totalPrice", created_at AS "createdAt"
        `;
        const values = [userId, totalPrice];

        try {
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getOrderById: async (orderId) => {
        const query = `
            SELECT id, user_id AS "userId", total_price AS "totalPrice", created_at AS "createdAt"
            FROM public.orders
            WHERE id = $1
        `;
        const values = [orderId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getOrdersByUserId: async (userId) => {
        const query = `
            SELECT id, user_id AS "userId", total_price AS "totalPrice", created_at AS "createdAt"
            FROM public.orders
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        const values = [userId];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (err) {
            throw err;
        }
    },

    getTotalSalesByDay: async () => {
        const query = `
            SELECT 
                DATE(created_at) as "saleDate", 
                SUM(total_price) as "dailyTotal"
            FROM public.orders
            GROUP BY DATE(created_at)
            ORDER BY "saleDate" DESC
        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = orderModel;
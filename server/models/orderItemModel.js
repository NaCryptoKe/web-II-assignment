const pool = require('../config/db');
const gameModel = require('./gameModel');

const orderItemModel = {
    createOrderItem: async (orderId, gameId, priceAtPurchase, client = pool) => {
        const query = `
            INSERT INTO public.order_items (order_id, game_id, price_at_purchase)
            VALUES ($1, $2, $3)
            RETURNING id, order_id AS "orderId", game_id AS "gameId", price_at_purchase AS "priceAtPurchase"
        `;
        const values = [orderId, gameId, priceAtPurchase];

        try {
            const result = await client.query(query, values);
            if (result.rows[0]) {
                await gameModel.increaseDownloadsCount(gameId);
            }
            return result.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new Error('This game is already included in this order.');
            }
            throw err;
        }
    },

    getOrderItemById: async (orderItemId) => {
        const query = `
            SELECT 
                id, 
                order_id AS "orderId", 
                game_id AS "gameId", 
                price_at_purchase AS "priceAtPurchase"
            FROM public.order_items
            WHERE id = $1
        `;
        const values = [orderItemId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    getOrderItemsByOrderId: async (orderId) => {
        const query = `
            SELECT 
                oi.id AS "id", 
                oi.game_id AS "gameId", 
                oi.price_at_purchase AS "priceAtPurchase", 
                g.title 
            FROM public.order_items oi
            JOIN public.games g ON oi.game_id = g.id
            WHERE oi.order_id = $1
        `;
        const values = [orderId];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (err) {
            throw err;
        }
    },

    deleteOrderItem: async (orderItemId) => {
        const query = `
            DELETE FROM public.order_items
            WHERE id = $1
            RETURNING id
        `;
        const values = [orderItemId];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }
};

module.exports = orderItemModel;
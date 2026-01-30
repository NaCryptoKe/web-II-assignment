const orderModel = require('../models/orderModel');
const orderItemModel = require('../models/orderItemModel');
const gameModel = require('../models/gameModel');
const pool = require('../config/db');

const createOrder = async (req, res) => {
    const { items } = req.body; // items is an array of game_ids
    console.log(items)
    const userId = req.user.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Order items cannot be empty.",
            errors: []
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let totalPrice = 0;
        const orderItems = [];

        for (const gameId of items) {
            const game = await gameModel.getGameById(gameId);
            console.log(game)
            if (!game) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: `Game with id ${gameId} not found.`
                });
            }
            totalPrice += parseFloat(game.price);
            orderItems.push({ gameId, price: game.price });
        }

        const newOrder = await orderModel.createOrder(userId, totalPrice, client);

        for (const item of orderItems) {
            await orderItemModel.createOrderItem(newOrder.id, item.gameId, item.price, client);
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: newOrder
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Create Order Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the order.",
            errors: [error.message]
        });
    } finally {
        client.release();
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const order = await orderModel.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        if (order.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this order."
            });
        }

        const items = await orderItemModel.getOrderItemsByOrderId(id);

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully.",
            data: { ...order, items }
        });
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the order.",
            errors: [error.message]
        });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.user.userId;

    try {
        const orders = await orderModel.getOrdersByUserId(userId);
        res.status(200).json({
            success: true,
            message: "User orders retrieved successfully.",
            data: orders
        });
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving user orders.",
            errors: [error.message]
        });
    }
};

module.exports = {
    createOrder,
    getOrder,
    getUserOrders
};

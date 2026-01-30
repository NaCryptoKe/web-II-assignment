const orderItemModel = require('../models/orderItemModel');
const orderModel = require('../models/orderModel'); // Needed for authorization checks

const getOrderItemById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const orderItem = await orderItemModel.getOrderItemById(id);

        if (!orderItem) {
            return res.status(404).json({
                success: false,
                message: "Order item not found."
            });
        }

        // Check if the user owns the order item or is an admin
        const order = await orderModel.getOrderById(orderItem.orderId);
        if (!order || (order.userId !== userId && userRole !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this order item."
            });
        }

        res.status(200).json({
            success: true,
            message: "Order item retrieved successfully.",
            data: orderItem
        });

    } catch (error) {
        console.error("Get Order Item By Id Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the order item.",
            errors: [error.message]
        });
    }
};

const getOrderItemsByOrderId = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const order = await orderModel.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        if (order.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view order items for this order."
            });
        }

        const orderItems = await orderItemModel.getOrderItemsByOrderId(orderId);

        res.status(200).json({
            success: true,
            message: "Order items retrieved successfully.",
            data: orderItems
        });

    } catch (error) {
        console.error("Get Order Items By Order Id Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving order items.",
            errors: [error.message]
        });
    }
};

const deleteOrderItem = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const orderItem = await orderItemModel.getOrderItemById(id);

        if (!orderItem) {
            return res.status(404).json({
                success: false,
                message: "Order item not found."
            });
        }

        // Check if the user owns the order item or is an admin
        const order = await orderModel.getOrderById(orderItem.orderId);
        if (!order || (order.userId !== userId && userRole !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this order item."
            });
        }

        await orderItemModel.deleteOrderItem(id);

        res.status(200).json({
            success: true,
            message: "Order item deleted successfully."
        });

    } catch (error) {
        console.error("Delete Order Item Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the order item.",
            errors: [error.message]
        });
    }
};

module.exports = {
    getOrderItemById,
    getOrderItemsByOrderId,
    deleteOrderItem
};

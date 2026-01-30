import { apiRequest } from "../api/client";

/**
 * Creates a new order with multiple games.
 * Hits: POST /order
 * @param {Array} gameIds - Array of IDs (e.g., [1, 2, 3])
 */
// src/services/orderService.js
export const createOrder = (orderData) => {
    // orderData MUST look like { items: [1, 2, 3] }
    return apiRequest('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    });
};

/**
 * Retrieves all orders for the logged-in user.
 * Hits: GET /order/my-orders
 */
export const getUserOrders = () => {
    return apiRequest("/order/my-orders", { 
        method: "GET" 
    });
};

/**
 * Retrieves a specific order and its associated items.
 * Hits: GET /order/:id
 */
export const getOrderById = (id) => {
    return apiRequest(`/order/${id}`, { 
        method: "GET" 
    });
};

/**
 * Retrieves a specific order item by its ID.
 * Hits: GET /order-item/:id
 */
export const getOrderItemById = (id) => {
    return apiRequest(`/order-item/${id}`, { 
        method: "GET" 
    });
};

/**
 * Retrieves all items belonging to a specific order.
 * Hits: GET /order-item/order/:orderId
 */
export const getOrderItemsByOrderId = (orderId) => {
    return apiRequest(`/order-item/order/${orderId}`, { 
        method: "GET" 
    });
};

/**
 * Deletes an item from an order.
 * Hits: DELETE /order-item/:id
 */
export const deleteOrderItem = (id) => {
    return apiRequest(`/order-item/${id}`, { 
        method: "DELETE" 
    });
};
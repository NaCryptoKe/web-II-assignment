import { useState, useCallback } from 'react';
import * as orderService from '../services/orderService';

// Ensure this has 'export' before the 'const'
export const useOrder = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [error, setError] = useState(null);

    const placeOrder = async (gameIds) => {
        setLoading(true);
        setError(null);
        try {
            const res = await orderService.createOrder(gameIds);
            return res;
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await orderService.getUserOrders();
            if (res.success) {
                setOrders(res.data);
            }
            return res;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrderDetails = useCallback(async (orderId) => {
        setLoading(true);
        try {
            const res = await orderService.getOrderById(orderId);
            if (res.success) setCurrentOrder(res.data);
            return res;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        orders,
        currentOrder,
        loading,
        error,
        placeOrder,
        fetchMyOrders,
        fetchOrderDetails
    };
};
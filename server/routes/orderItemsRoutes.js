const express = require('express');
const router = express.Router();
const { getOrderItemById, getOrderItemsByOrderId, deleteOrderItem } = require('../controllers/orderItemsController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/:id', getOrderItemById);
router.get('/order/:orderId', getOrderItemsByOrderId);
router.delete('/:id', deleteOrderItem);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getUserOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrder);

module.exports = router;

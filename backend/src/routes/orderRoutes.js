const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, orderController.createOrder);
router.get('/', optionalAuth, orderController.getOrders);
router.get('/all', auth, orderController.getAllOrders);
router.get('/:id', optionalAuth, orderController.getOrderById);
router.put('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
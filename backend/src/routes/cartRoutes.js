const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, cartController.getCart);
router.post('/', optionalAuth, cartController.addToCart);
router.put('/:id', optionalAuth, cartController.updateCartItem);
router.delete('/:id', optionalAuth, cartController.removeFromCart);
router.delete('/', optionalAuth, cartController.clearCart);

module.exports = router;
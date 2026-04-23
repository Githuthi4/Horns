const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/sale', productController.getSaleProducts);
router.get('/:id', optionalAuth, productController.getProductById);

router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
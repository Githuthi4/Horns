const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { auth } = require('../middleware/auth');

router.get('/active', testimonialController.getActiveTestimonials);
router.get('/', testimonialController.getAllTestimonials);
router.post('/', auth, testimonialController.createTestimonial);

module.exports = router;
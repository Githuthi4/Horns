const { pool } = require('../config/database');

const getActiveTestimonials = async (req, res, next) => {
  try {
    const [testimonials] = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTestimonials = async (req, res, next) => {
  try {
    const [testimonials] = await pool.query(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const { quote, name, location, initials } = req.body;
    const { v4: uuidv4 } = require('uuid');

    const id = uuidv4();
    await pool.query(
      'INSERT INTO testimonials (id, quote, name, location, initials) VALUES (?, ?, ?, ?, ?)',
      [id, quote, name, location, initials]
    );

    const [testimonial] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      data: testimonial[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveTestimonials,
  getAllTestimonials,
  createTestimonial,
};
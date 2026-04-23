const { pool } = require('../config/database');

const getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY c.display_order ASC'
    );

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.query(
      'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id WHERE c.id = ? GROUP BY c.id',
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?',
      [id, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, display_order } = req.body;
    const { v4: uuidv4 } = require('uuid');

    const id = uuidv4();
    await pool.query(
      'INSERT INTO categories (id, name, description, image, display_order) VALUES (?, ?, ?, ?, ?)',
      [id, name, description, image, display_order || 0]
    );

    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      data: category[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, display_order } = req.body;

    await pool.query(
      'UPDATE categories SET name = ?, description = ?, image = ?, display_order = ? WHERE id = ?',
      [name, description, image, display_order, id]
    );

    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      data: category[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
};

const { pool } = require('../config/database');

const getAllProducts = async (req, res, next) => {
  try {
    const { category, featured, onSale, search, limit = 50, page = 1 } = req.query;
    
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }
    if (featured === 'true') {
      query += ' AND p.is_featured = TRUE';
    }
    if (onSale === 'true') {
      query += ' AND p.is_on_sale = TRUE';
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
    
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = TRUE ORDER BY p.created_at DESC LIMIT 10'
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getSaleProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_on_sale = TRUE ORDER BY p.created_at DESC'
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, original_price, category_id, image, stock, is_featured, is_on_sale } = req.body;
    const { v4: uuidv4 } = require('uuid');
    
    const id = uuidv4();
    await pool.query(
      'INSERT INTO products (id, name, description, price, original_price, category_id, image, stock, is_featured, is_on_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, price, original_price, category_id, image, stock || 100, is_featured || false, is_on_sale || false]
    );

    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    
    res.status(201).json({
      success: true,
      data: product[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];

    const updates = ['name', 'description', 'price', 'original_price', 'category_id', 'image', 'stock', 'is_featured', 'is_on_sale'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    values.push(id);
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);

    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    
    res.json({
      success: true,
      data: product[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
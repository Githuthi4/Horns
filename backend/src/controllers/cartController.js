const { pool } = require('../config/database');

const getCart = async (req, res, next) => {
  try {
    const { user_id, session_id } = req.query;

    let query = `
      SELECT ci.*, p.name, p.price, p.original_price, p.image, p.is_on_sale, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (user_id) {
      query += ' AND ci.user_id = ?';
      params.push(user_id);
    } else if (session_id) {
      query += ' AND ci.session_id = ?';
      params.push(session_id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'user_id or session_id required',
      });
    }

    const [items] = await pool.query(query, params);

    let subtotal = 0;
    let discount = 0;
    
    items.forEach(item => {
      const itemPrice = item.is_on_sale && item.original_price ? item.original_price : item.price;
      subtotal += itemPrice * item.quantity;
      if (item.is_on_sale && item.original_price) {
        discount += (item.original_price - item.price) * item.quantity;
      }
    });

    res.json({
      success: true,
      data: {
        items,
        item_count: items.length,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        total: (subtotal - discount).toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1, user_id, session_id } = req.body;

    if (!product_id || (!user_id && !session_id)) {
      return res.status(400).json({
        success: false,
        message: 'product_id and user_id or session_id required',
      });
    }

    const [existing] = await pool.query(
      'SELECT * FROM cart_items WHERE product_id = ? AND (user_id = ? OR session_id = ?)',
      [product_id, user_id || null, session_id || null]
    );

    const { v4: uuidv4 } = require('uuid');

    if (existing.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (id, product_id, quantity, user_id, session_id) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), product_id, quantity, user_id || null, session_id || null]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity required',
      });
    }

    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated',
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const { user_id, session_id } = req.body;

    if (!user_id && !session_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id or session_id required',
      });
    }

    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? OR session_id = ?',
      [user_id || null, session_id || null]
    );

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

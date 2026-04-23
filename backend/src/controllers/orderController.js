const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res, next) => {
  try {
    const { user_id, session_id, delivery_address, delivery_phone, notes } = req.body;

    if (!delivery_address || !delivery_phone) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address and phone required',
      });
    }

    let cartQuery = `
      SELECT ci.*, p.name, p.price, p.original_price, p.is_on_sale
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE 1=1
    `;
    const cartParams = [];

    if (user_id) {
      cartQuery += ' AND ci.user_id = ?';
      cartParams.push(user_id);
    } else if (session_id) {
      cartQuery += ' AND ci.session_id = ?';
      cartParams.push(session_id);
    }

    const [cartItems] = await pool.query(cartQuery, cartParams);

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    let totalAmount = 0;
    cartItems.forEach(item => {
      const itemPrice = item.is_on_sale && item.original_price ? item.price : item.price;
      totalAmount += itemPrice * item.quantity;
    });

    const orderId = uuidv4();
    
    await pool.query(
      'INSERT INTO orders (id, user_id, session_id, total_amount, delivery_address, delivery_phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orderId, user_id || null, session_id || null, totalAmount.toFixed(2), delivery_address, delivery_phone, notes]
    );

    for (const item of cartItems) {
      const itemPrice = item.is_on_sale && item.original_price ? item.price : item.price;
      const orderItemId = uuidv4();
      
      await pool.query(
        'INSERT INTO order_items (id, order_id, product_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
        [orderItemId, orderId, item.product_id, item.name, itemPrice.toFixed(2), item.quantity]
      );

      await pool.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? OR session_id = ?',
      [user_id || null, session_id || null]
    );

    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.status(201).json({
      success: true,
      data: {
        ...order[0],
        items: orderItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { user_id, session_id } = req.query;

    if (!user_id && !session_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id or session_id required',
      });
    }

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    } else if (session_id) {
      query += ' AND session_id = ?';
      params.push(session_id);
    }

    query += ' ORDER BY created_at DESC';

    const [orders] = await pool.query(query, params);

    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, session_id } = req.query;

    let query = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];

    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    } else if (session_id) {
      query += ' AND session_id = ?';
      params.push(session_id);
    }

    const [orders] = await pool.query(query, params);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);

    res.json({
      success: true,
      data: {
        ...orders[0],
        items,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [orders] = await pool.query(query, params);

    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);

    res.json({
      success: true,
      data: order[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};

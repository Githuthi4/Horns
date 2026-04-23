require('dotenv').config();
const { pool } = require('../src/config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedData = async () => {
  const connection = await pool.getConnection();
  
  try {
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM cart_items');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM testimonials');
    await connection.query('DELETE FROM users');

    const categories = [
      { id: uuidv4(), name: 'Whisky', description: 'Smoky reserves, smooth bourbons, and aged single malts.', display_order: 1 },
      { id: uuidv4(), name: 'Gin', description: 'Botanical pours built for tonic nights and bright cocktails.', display_order: 2 },
      { id: uuidv4(), name: 'Wine', description: 'Dinner reds, crisp whites, and bottles for slower evenings.', display_order: 3 },
      { id: uuidv4(), name: 'Vodka', description: 'Clean premium bottles for chilled serves and party mixes.', display_order: 4 },
      { id: uuidv4(), name: 'Tequila', description: 'Bold agave picks for shots, citrus mixes, and warmer nights.', display_order: 5 },
      { id: uuidv4(), name: 'Mixers', description: 'Tonics, sodas, and pairings that finish the bottle run properly.', display_order: 6 },
    ];

    for (const cat of categories) {
      await connection.query(
        'INSERT INTO categories (id, name, description, display_order) VALUES (?, ?, ?, ?)',
        [cat.id, cat.name, cat.description, cat.display_order]
      );
    }

    const whiskyId = categories[0].id;
    const ginId = categories[1].id;
    const wineId = categories[2].id;
    const vodkaId = categories[3].id;

    const products = [
      { id: uuidv4(), name: 'Midnight Barrel', description: 'Aged 12 years in oak casks', price: 4800, category_id: whiskyId, is_featured: true },
      { id: uuidv4(), name: 'Citrus Bloom Gin', description: 'Fresh citrus botanical blend', price: 3600, category_id: ginId, is_featured: true },
      { id: uuidv4(), name: 'Velvet Cellar Red', description: 'Full-bodied red wine from Napa', price: 2950, category_id: wineId, is_featured: true },
      { id: uuidv4(), name: 'Reserve 12 Whisky', description: 'Premium 12-year single malt', price: 5200, category_id: whiskyId, is_featured: true, is_on_sale: true, original_price: 5200 },
      { id: uuidv4(), name: 'Golden Coast Gin', description: 'Coastal botanical gin', price: 3900, category_id: ginId, is_featured: true, is_on_sale: true, original_price: 3900 },
      { id: uuidv4(), name: 'Rosso Night Blend', description: 'Italian red blend', price: 3250, category_id: wineId, is_featured: true },
      { id: uuidv4(), name: 'Smoked Oak Cask', description: 'Smoky bourbon finish', price: 5850, category_id: whiskyId, is_featured: true },
      { id: uuidv4(), name: 'Garden Mist Gin', description: 'Cucumber and mint gin', price: 3400, category_id: ginId, is_featured: true },
      { id: uuidv4(), name: 'Snow Peak Vodka', description: 'Triple distilled premium', price: 2800, category_id: vodkaId, is_featured: false },
      { id: uuidv4(), name: 'Arctic Grey Vodka', description: 'Smooth filtered vodka', price: 3100, category_id: vodkaId, is_featured: false },
    ];

    for (const prod of products) {
      await connection.query(
        'INSERT INTO products (id, name, description, price, original_price, category_id, is_featured, is_on_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [prod.id, prod.name, prod.description, prod.price, prod.original_price || null, prod.category_id, prod.is_featured, prod.is_on_sale || false]
      );
    }

    const testimonials = [
      { id: uuidv4(), quote: 'The checkout is clean, the bottle arrived fast, and the whole order felt way more premium than the usual delivery apps.', name: 'Nadia K.', location: 'Westlands, Nairobi', initials: 'NK' },
      { id: uuidv4(), quote: 'I found what I wanted quickly and the discounts actually felt worth it. This now feels like a proper premium store.', name: 'Brian M.', location: 'Kilimani, Nairobi', initials: 'BM' },
      { id: uuidv4(), quote: 'The interface is easy, the offers are clear, and the delivery speed makes it easy to trust for last-minute plans.', name: 'Aisha T.', location: 'Riverside, Nairobi', initials: 'AT' },
    ];

    for (const test of testimonials) {
      await connection.query(
        'INSERT INTO testimonials (id, quote, name, location, initials) VALUES (?, ?, ?, ?, ?)',
        [test.id, test.quote, test.name, test.location, test.initials]
      );
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), 'Admin User', 'admin@tipsy.co.ke', hashedPassword, 'admin']
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    connection.release();
    await pool.end();
  }
};

seedData();

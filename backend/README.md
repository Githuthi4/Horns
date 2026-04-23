# Tipsy Backend API

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment:
   - Copy `.env` file and update MySQL credentials
   - Ensure MySQL is running

3. Initialize database:
   ```bash
   npm run db:init
   ```

4. Seed sample data:
   ```bash
   npm run db:seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/featured` - Featured products
- `GET /api/products/sale` - Sale products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:id/products` - Products in category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/all` - All orders (admin)
- `PUT /api/orders/:id/status` - Update status (admin)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Testimonials
- `GET /api/testimonials/active` - Active testimonials
- `GET /api/testimonials` - All testimonials
- `POST /api/testimonials` - Create testimonial (admin)

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tipsy
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

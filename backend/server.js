const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

// Connect to MongoDB Atlas
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend should be running on http://localhost:3000`);
  console.log(`Backend API available at http://localhost:${PORT}/api`);
  console.log('\nDefault Admin Credentials:');
  console.log('Email: admin@admin.com');
  console.log('Password: admin123');
  console.log('\nAdmin Restaurant Management:');
  console.log('POST /api/restaurants - Add restaurant');
  console.log('PUT /api/restaurants/:id - Update restaurant');
  console.log('DELETE /api/restaurants/:id - Delete restaurant');
});
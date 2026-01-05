const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
    await createDefaultUsers();
  } catch (error) {
    console.log('⚠️ MongoDB Atlas not available, using in-memory authentication');
    global.useInMemoryAuth = true;
  }
};

async function createDefaultUsers() {
  try {
    const User = require('../models/User');
    
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        phone: '1234567890',
        address: 'Admin Address',
        isAdmin: true
      });
      await admin.save();
      console.log('👤 Admin created: admin@gmail.com / admin123');
    }
    
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      const user = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: 'user123',
        phone: '9876543210',
        address: 'Test Address',
        isAdmin: false
      });
      await user.save();
      console.log('👤 User created: user@example.com / user123');
    }
  } catch (error) {
    console.log('⚠️ Could not create users:', error.message);
  }
}

module.exports = connectDB;
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please check:');
    console.error('1. Your MongoDB Atlas credentials');
    console.error('2. Network Access (IP whitelist)');
    console.error('3. Database user permissions');
    process.exit(1);
  }
};

module.exports = connectDB;
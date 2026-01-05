const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (will be replaced by MongoDB when connected)
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', // admin123
    phone: '1234567890',
    address: 'Admin Address',
    isAdmin: true
  },
  {
    _id: '2',
    name: 'Test User',
    email: 'user@example.com',
    password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // user123
    phone: '9876543210',
    address: 'Test Address',
    isAdmin: false
  }
];

// MongoDB connection attempt
let mongoConnected = false;
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB Atlas connected');
    mongoConnected = true;
  } catch (error) {
    console.log('⚠️  MongoDB Atlas not available, using in-memory storage');
    mongoConnected = false;
  }
};

// User Schema (for when MongoDB is available)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check if user exists
    const existingUser = mongoConnected 
      ? await User.findOne({ email })
      : users.find(u => u.email === email);
      
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin: false
    };

    if (mongoConnected) {
      const user = new User(newUser);
      await user.save();
    } else {
      users.push(newUser);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { _id: newUser._id, name, email, isAdmin: false }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = mongoConnected 
      ? await User.findOne({ email })
      : users.find(u => u.email === email);
      
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = mongoConnected 
      ? await User.findOne({ email, isAdmin: true })
      : users.find(u => u.email === email && u.isAdmin);
      
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔗 Backend API: http://localhost:${PORT}/api`);
  console.log('\\n👤 Default Credentials:');
  console.log('Admin: admin@gmail.com / admin123');
  console.log('User: user@example.com / user123');
  
  await connectMongo();
});
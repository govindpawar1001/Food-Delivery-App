const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

async function setupDatabase() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Create admin user
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
      console.log('✅ Admin user created: admin@gmail.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample user
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
      console.log('✅ Sample user created: user@example.com / user123');
    } else {
      console.log('✅ Sample user already exists');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('You can now use these credentials:');
    console.log('Admin: admin@gmail.com / admin123');
    console.log('User: user@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
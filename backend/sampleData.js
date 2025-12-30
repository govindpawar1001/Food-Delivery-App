const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const sampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      phone: '1234567890',
      address: '123 Admin Street',
      isAdmin: true
    });

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      phone: '9876543210',
      address: '456 User Avenue'
    });

    // Create sample restaurants
    const restaurants = await Restaurant.create([
      {
        name: 'McDonald',
        cuisine: 'Italian',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        deliveryTime: '30-45 mins',
        address: 'Kalyani Nagar, Pune',
        phone: '555-0101'
      },
      {
        name: 'Irani Cafe',
        cuisine: 'Iranian',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        deliveryTime: '25-35 mins',
        address: 'Ground Floor, Nucleus Mall, Near Mewar, 1st Church Road, Camp Area, Pune',
        phone: '555-0102'
      },
      {
        name: 'Subway',
        cuisine: 'American',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
        deliveryTime: '40-50 mins',
        address: '789 FC Road,Pune',
        phone: '555-0103'
      }
    ]);

    // Create sample menu items
    const menuItems = await MenuItem.create([
      // McDonald's items
      {
        name: 'Big Mac',
        description: 'Iconic double beef burger with special sauce, lettuce, cheese, pickles, and onions',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=300',
        category: 'Burger',
        restaurant: restaurants[0]._id
      },
      {
        name: 'McChicken',
        description: 'Crispy chicken patty with lettuce and creamy mayo in a soft bun',
        price: 4.49,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=300',
        category: 'Burger',
        restaurant: restaurants[0]._id
      },
      {
        name: 'French Fries',
        description: 'Golden crispy fries lightly salted',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300',
        category: 'Sides',
        restaurant: restaurants[0]._id
      },
      {
        name: 'Chicken Nuggets',
        description: 'Crispy bite-sized chicken nuggets served with dipping sauce',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1619881589316-56c7f9cbd9aa?w=300',
        category: 'Snacks',
        restaurant: restaurants[0]._id
      },
      {
        name: 'McFlurry Oreo',
        description: 'Vanilla soft serve mixed with Oreo cookie pieces',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1629385701021-b9c54f9e62cb?w=300',
        category: 'Dessert',
        restaurant: restaurants[0]._id
      },

      // Irani Cafe items
      {
        name: 'Bun Maska',
        description: 'Soft bun served with generous butter and lightly toasted',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1631452180519-2b6f09c06c84?w=300',
        category: 'Bakery',
        restaurant: restaurants[1]._id
      },
      {
        name: 'Irani Chai',
        description: 'Traditional strong milk tea brewed in Irani style',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1578926288207-4f38e60f0b7b?w=300',
        category: 'Beverage',
        restaurant: restaurants[1]._id
      },
      {
        name: 'Keema Pav',
        description: 'Spicy minced meat curry served with soft pav bread',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
        category: 'Main Course',
        restaurant: restaurants[1]._id
      },
      {
        name: 'Chicken Puff',
        description: 'Flaky pastry filled with spiced chicken stuffing',
        price: 4.49,
        image: 'https://images.unsplash.com/photo-1625937325192-3f19c38b5f2f?w=300',
        category: 'Snacks',
        restaurant: restaurants[1]._id
      },
      {
        name: 'Caramel Custard',
        description: 'Classic Irani-style baked caramel custard dessert',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1608219959301-8a4f1baf9a50?w=300',
        category: 'Dessert',
        restaurant: restaurants[1]._id
      },

      // Subway items
      {
        name: 'Veggie Delite Sub',
        description: 'Fresh vegetables with lettuce, tomatoes, cucumbers, olives, and sauces',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1604908177225-4a1b1c1c5e8d?w=300',
        category: 'Sandwich',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Chicken Teriyaki Sub',
        description: 'Grilled chicken glazed with sweet teriyaki sauce and fresh veggies',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300',
        category: 'Sandwich',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Italian BMT Sub',
        description: 'Pepperoni, salami, ham with cheese and fresh vegetables',
        price: 9.49,
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300',
        category: 'Sandwich',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Subway Cookies',
        description: 'Soft baked cookies available in chocolate chip and double chocolate',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=300',
        category: 'Dessert',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Subway Salad Bowl',
        description: 'Fresh salad with choice of veggies, protein, and dressing',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
        category: 'Salad',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Chicken Sandwich',
        description: 'Grilled chicken breast with lettuce, tomato, and mayo',
        price: 7.49,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=300',
        category: 'Sandwich',
        restaurant: restaurants[0]._id
      },
      {
        name: 'Veggie Pizza',
        description: 'Fresh vegetables on crispy crust with mozzarella cheese',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
        category: 'Pizza',
        restaurant: restaurants[1]._id
      },

      // 3 additional items for McDonald's
      {
        name: 'Quarter Pounder',
        description: 'Quarter pound beef patty with cheese, onions, pickles, and ketchup',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
        category: 'Burger',
        restaurant: restaurants[0]._id
      },
      {
        name: 'Apple Pie',
        description: 'Warm apple pie with flaky crust and cinnamon filling',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300',
        category: 'Dessert',
        restaurant: restaurants[0]._id
      },
      {
        name: 'Coca Cola',
        description: 'Refreshing cold Coca Cola soft drink',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300',
        category: 'Beverage',
        restaurant: restaurants[0]._id
      },

      // 3 additional items for Irani Cafe
      {
        name: 'Mutton Biryani',
        description: 'Aromatic basmati rice with tender mutton pieces and spices',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300',
        category: 'Main Course',
        restaurant: restaurants[1]._id
      },
      {
        name: 'Mawa Cake',
        description: 'Traditional Irani mawa cake with rich milk solids',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
        category: 'Dessert',
        restaurant: restaurants[1]._id
      },
      {
        name: 'Lassi',
        description: 'Creamy yogurt-based drink with cardamom and rose',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1571197119282-7c4e99e6e2e6?w=300',
        category: 'Beverage',
        restaurant: restaurants[1]._id
      },

      // 3 additional items for Subway
      {
        name: 'Tuna Sub',
        description: 'Tuna salad with fresh vegetables and choice of sauce',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=300',
        category: 'Sandwich',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Potato Chips',
        description: 'Crispy seasoned potato chips',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300',
        category: 'Snacks',
        restaurant: restaurants[2]._id
      },
      {
        name: 'Iced Tea',
        description: 'Refreshing iced tea with lemon',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300',
        category: 'Beverage',
        restaurant: restaurants[2]._id
      }
    ]);

    console.log('Sample data created successfully!');
    console.log('Admin credentials: admin@gmail.com / admin123');
    console.log('User credentials: user@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

sampleData();
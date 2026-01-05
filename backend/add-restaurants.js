require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

const restaurants = [
  {
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    deliveryTime: "25-35 min",
    address: "123 Main St, Downtown",
    phone: "+1-555-0101"
  },
  {
    name: "Burger Barn",
    cuisine: "American",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    deliveryTime: "20-30 min",
    address: "456 Oak Ave, City Center",
    phone: "+1-555-0102"
  },
  {
    name: "Sushi Zen",
    cuisine: "Japanese",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    deliveryTime: "30-40 min",
    address: "789 Pine Rd, Uptown",
    phone: "+1-555-0103"
  },
  {
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1565299585323-38174c4a6c7b?w=400",
    deliveryTime: "15-25 min",
    address: "321 Elm St, Southside",
    phone: "+1-555-0104"
  },
  {
    name: "Dragon Garden",
    cuisine: "Chinese",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    deliveryTime: "25-35 min",
    address: "654 Maple Dr, Eastside",
    phone: "+1-555-0105"
  },
  {
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    deliveryTime: "30-45 min",
    address: "987 Cedar Ln, Westside",
    phone: "+1-555-0106"
  },
  {
    name: "Mediterranean Delight",
    cuisine: "Mediterranean",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    deliveryTime: "25-35 min",
    address: "147 Birch St, Midtown",
    phone: "+1-555-0107"
  },
  {
    name: "BBQ Smokehouse",
    cuisine: "BBQ",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    deliveryTime: "35-45 min",
    address: "258 Walnut Ave, Northside",
    phone: "+1-555-0108"
  },
  {
    name: "Fresh Salad Co",
    cuisine: "Healthy",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    deliveryTime: "15-20 min",
    address: "369 Spruce Rd, Downtown",
    phone: "+1-555-0109"
  },
  {
    name: "Pasta Corner",
    cuisine: "Italian",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    deliveryTime: "20-30 min",
    address: "741 Ash Blvd, City Center",
    phone: "+1-555-0110"
  }
];

async function addRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');
    
    // Add new restaurants
    await Restaurant.insertMany(restaurants);
    console.log('Added 10 restaurants successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addRestaurants();
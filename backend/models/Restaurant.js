const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  image: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
const express = require('express');
const MenuItem = require('../models/MenuItem');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get menu items for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId, available: true });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create menu item (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update menu item (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete menu item (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
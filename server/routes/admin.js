const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const { auth, isAdmin } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.use(auth, isAdmin);

// List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete any item
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.imagePath) {
      const imgPath = path.join(__dirname, '..', item.imagePath);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted by admin' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

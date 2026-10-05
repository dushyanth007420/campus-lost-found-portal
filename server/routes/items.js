const express = require('express');
const Item = require('../models/Item');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get all items with filters
router.get('/', async (req, res) => {
  try {
    const { type, category, status, search, date } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (date) filter.date = { $gte: new Date(date) }; // simple date filter

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter).populate('postedBy', 'name email phone').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email phone');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;
    
    const itemData = {
      title,
      description,
      category,
      type,
      location,
      date,
      postedBy: req.user.userId
    };

    if (req.file) {
      itemData.imagePath = `/uploads/${req.file.filename}`;
    }

    const item = new Item(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item (owner or admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = { ...req.body };
    if (req.file) {
      // Optional: Delete old image
      if (item.imagePath) {
        const oldPath = path.join(__dirname, '..', item.imagePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (item.imagePath) {
      const imgPath = path.join(__dirname, '..', item.imagePath);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark item as resolved
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    item.status = 'resolved';
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

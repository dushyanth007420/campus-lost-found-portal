const express = require('express');
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const { sendClaimNotificationEmail, sendClaimDecisionEmail } = require('../utils/mailer');

const router = express.Router();

// Submit a claim on an item
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const ownerId = item.postedBy._id ? item.postedBy._id.toString() : item.postedBy.toString();
    if (ownerId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot claim your own item' });
    }

    const existingClaim = await Claim.findOne({ item: itemId, claimant: req.user.userId });
    if (existingClaim) {
      return res.status(400).json({ error: 'You have already claimed this item' });
    }

    const claim = new Claim({
      item: itemId,
      claimant: req.user.userId,
      message
    });

    await claim.save();

    // In-app Notification for item owner
    const notification = new Notification({
      user: ownerId,
      message: `Someone has submitted a claim on your item: ${item.title}`
    });
    await notification.save();

    // Nodemailer Email Notification for item owner
    if (item.postedBy && item.postedBy.email) {
      const claimant = await User.findById(req.user.userId).select('name email');
      sendClaimNotificationEmail({
        ownerEmail: item.postedBy.email,
        ownerName: item.postedBy.name || 'Student',
        itemTitle: item.title,
        claimantName: claimant?.name || 'A Student',
        message
      }).catch(err => {
        console.error('Claim notification email dispatch error:', err.message);
      });
    }

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List claims for items I posted
router.get('/my-items', auth, async (req, res) => {
  try {
    const myItems = await Item.find({ postedBy: req.user.userId }).select('_id');
    const itemIds = myItems.map(item => item._id);

    const claims = await Claim.find({ item: { $in: itemIds } })
      .populate('item', 'title type imagePath status')
      .populate('claimant', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List my submitted claims
router.get('/my-claims', auth, async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user.userId })
      .populate('item', 'title type location date status')
      .sort({ createdAt: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve a claim
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email');

    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    if (claim.item.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    claim.status = 'approved';
    await claim.save();

    // Update item status
    await Item.findByIdAndUpdate(claim.item._id, { status: 'claimed' });

    // Reject other pending claims for this item
    await Claim.updateMany(
      { item: claim.item._id, _id: { $ne: claim._id }, status: 'pending' },
      { status: 'rejected' }
    );

    // In-app Notification for claimant
    const notification = new Notification({
      user: claim.claimant._id || claim.claimant,
      message: `Your claim for "${claim.item.title}" has been approved!`
    });
    await notification.save();

    // Nodemailer Email for claimant
    if (claim.claimant && claim.claimant.email) {
      const owner = await User.findById(req.user.userId).select('name phone');
      sendClaimDecisionEmail({
        claimantEmail: claim.claimant.email,
        claimantName: claim.claimant.name || 'Student',
        itemTitle: claim.item.title,
        decision: 'approved',
        ownerName: owner?.name || 'Item Reporter',
        ownerPhone: owner?.phone || ''
      }).catch(err => {
        console.error('Claim approval email dispatch error:', err.message);
      });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject a claim
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email');

    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    if (claim.item.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    claim.status = 'rejected';
    await claim.save();

    // In-app Notification for claimant
    const notification = new Notification({
      user: claim.claimant._id || claim.claimant,
      message: `Your claim for "${claim.item.title}" has been rejected.`
    });
    await notification.save();

    // Nodemailer Email for claimant
    if (claim.claimant && claim.claimant.email) {
      sendClaimDecisionEmail({
        claimantEmail: claim.claimant.email,
        claimantName: claim.claimant.name || 'Student',
        itemTitle: claim.item.title,
        decision: 'rejected',
        ownerName: 'Item Reporter'
      }).catch(err => {
        console.error('Claim rejection email dispatch error:', err.message);
      });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

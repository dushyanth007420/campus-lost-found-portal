const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['ID Card', 'Phone', 'Books', 'Keys', 'Wallet', 'Bag', 'Electronics', 'Other'],
    required: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  imagePath: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'claimed', 'resolved'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);

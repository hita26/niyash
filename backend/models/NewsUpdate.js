const mongoose = require('mongoose');

const newsUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Scheme', 'Price Update', 'New Launch', 'Market News', 'Notice'],
      default: 'Scheme',
    },
    company: {
      type: String,
      default: 'General',
      trim: true,
    },
    isTickerActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 1,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('NewsUpdate', newsUpdateSchema);

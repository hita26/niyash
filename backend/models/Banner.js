const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Niyansh Pharma Wholesale Distribution'
    },
    subtitle: {
      type: String,
      trim: true,
      default: 'Genuine Healthcare Formulations Across Saurashtra & Gujarat'
    },
    badge: {
      type: String,
      trim: true,
      default: 'WHO-GMP CERTIFIED'
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    link: {
      type: String,
      trim: true,
      default: '/quick-order'
    },
    ctaText: {
      type: String,
      trim: true,
      default: 'Fast Quick Order ⚡'
    },
    order: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    aspectRatio: {
      type: String,
      enum: ['landscape', 'square', 'portrait', 'auto'],
      default: 'auto'
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient ordered public querying
bannerSchema.index({ active: 1, order: 1 });

module.exports = mongoose.model('Banner', bannerSchema);

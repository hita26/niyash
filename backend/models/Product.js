const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      // e.g., 'Pharma Products', 'OTC Products', 'Surgical & Medical Supplies', 'Injectables'
    },
    sku: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    packing: {
      type: String,
      trim: true, // e.g. "10 x 10 Tablets"
    },
    composition: {
      type: String,
      trim: true, // e.g. "Paracetamol IP 500mg"
    },
    form: {
      type: String,
      trim: true, // e.g. "Tablet", "Capsule", "Injection", "Syrup"
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text search index for name, brand, composition, and description
productSchema.index({ name: 'text', brand: 'text', composition: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

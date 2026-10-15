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
    company: {
      type: String,
      required: true,
      trim: true,
      default: 'DAXIA',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      // e.g., 'Pharma Products', 'OTC Products', 'Surgical & Medical Supplies', 'Injectables', 'Ayurvedic Products', 'Dermatology & Topicals'
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
    mrp: {
      type: Number,
      default: 0.0,
    },
    gstRate: {
      type: Number,
      default: 12,
    },
    minReorderQty: {
      type: Number,
      default: 1,
    },
    unitsPerBox: {
      type: Number,
      default: 10,
    },
    qualitySpecs: {
      type: String,
      default: 'WHO-GMP Certified',
      trim: true,
    },
    scheme: {
      type: String,
      default: '',
      trim: true,
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
      enum: [
        'Tablet',
        'Capsule',
        'Cream',
        'Drops',
        'Lotion',
        'Soap',
        'Spray',
        'Oil',
        'Ayurvedic',
        'Injection',
        'Syrup',
        'IV Fluid',
        'Surgical',
        'Ointment',
        'Powder',
        'Gel',
        'Suspension',
        'Sachet',
        'Inhaler',
      ],
      trim: true,
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

// Add text search index for name, brand, company, composition, form, and description
productSchema.index({
  name: 'text',
  brand: 'text',
  company: 'text',
  composition: 'text',
  form: 'text',
  description: 'text',
});

module.exports = mongoose.model('Product', productSchema);


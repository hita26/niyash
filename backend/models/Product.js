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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
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
    images: {
      type: [String],
      default: [],
    },
    stockQuantity: {
      type: Number,
      default: 100,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subCategory: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    specifications: {
      type: String,
      default: '',
      trim: true,
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Needs Review', 'Pending'],
      default: 'Verified',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save synchronization for main image and stock
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0 && (!this.imageUrl || this.imageUrl.trim() === '')) {
    this.imageUrl = this.images[0];
  }
  if (this.imageUrl && this.imageUrl.trim() !== '' && (!this.images || this.images.length === 0)) {
    this.images = [this.imageUrl];
  }
  if (this.stockQuantity !== undefined && this.stockQuantity <= 0) {
    this.inStock = false;
  }
  if (typeof next === 'function') next();
});

// Add text search index for name, brand, company, composition, form, sku, and description
productSchema.index({
  name: 'text',
  brand: 'text',
  company: 'text',
  composition: 'text',
  form: 'text',
  sku: 'text',
  description: 'text',
});

module.exports = mongoose.model('Product', productSchema);


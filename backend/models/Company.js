const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    logoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    coverImageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Pharmaceutical Formulations',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: 'India',
      trim: true,
    },
    websiteUrl: {
      type: String,
      default: '',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    orderPriority: {
      type: Number,
      default: 100,
    },
    divisionCodes: {
      type: [String],
      default: [],
    },
    specialties: {
      type: [String],
      default: [],
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before save if not present
companySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

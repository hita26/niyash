const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  companyName: { 
    type: String, 
    default: '' 
  },
  gstin: { 
    type: String, 
    default: '',
    uppercase: true,
    trim: true
  },
  pan: {
    type: String,
    default: '',
    uppercase: true,
    trim: true
  },
  drugLicense: { 
    type: String, 
    default: '' 
  },
  drugLicense1: { 
    type: String, 
    default: '' 
  },
  drugLicense2: { 
    type: String, 
    default: '' 
  },
  gstinDoc: {
    type: String,
    default: ''
  },
  panDoc: {
    type: String,
    default: ''
  },
  drugLicense1Doc: {
    type: String,
    default: ''
  },
  drugLicense2Doc: {
    type: String,
    default: ''
  },
  phone: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  role: { 
    type: String, 
    default: 'user' 
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  permissions: {
    canManageProducts: { type: Boolean, default: true },
    canDeleteProducts: { type: Boolean, default: false },
    canBulkImport: { type: Boolean, default: true },
    canManageOrders: { type: Boolean, default: true },
    canManageLedgers: { type: Boolean, default: false },
    canManageCompanies: { type: Boolean, default: true },
    canManageNews: { type: Boolean, default: true },
    canManageEnquiries: { type: Boolean, default: true },
    canClearDatabase: { type: Boolean, default: false }
  },
  resetPasswordOtp: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords (supports bcrypt hashes and auto-migrates legacy unhashed entries)
userSchema.methods.comparePassword = async function(enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  
  // 1. Direct plain text match (legacy unhashed accounts in DB)
  if (this.password === enteredPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(enteredPassword, salt);
      await this.save();
    } catch (_) {}
    return true;
  }

  // 2. Standard Bcrypt comparison
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$')) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (e) {
      return false;
    }
  }

  return false;
};

module.exports = mongoose.model('User', userSchema);

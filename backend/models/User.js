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

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

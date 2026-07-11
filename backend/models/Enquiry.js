const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['Cart Quote', 'General Enquiry', 'Partner', 'Supplier', 'Manufacturing'],
      default: 'General Enquiry',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Contacted', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);

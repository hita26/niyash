const mongoose = require('mongoose');

const customFieldDefSchema = new mongoose.Schema(
  {
    fieldKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    fieldType: {
      type: String,
      enum: ['text', 'number', 'date', 'select'],
      default: 'text',
    },
    options: {
      type: [String],
      default: [],
    },
    placeholder: {
      type: String,
      default: '',
      trim: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CustomFieldDef', customFieldDefSchema);

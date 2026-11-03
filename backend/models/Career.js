const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
      }
    },
    position: {
      type: String,
      required: true,
      trim: true, // e.g. "Sales Executive", "Delivery Partner", "Office Assistant"
    },
    experience: {
      type: String,
      required: true,
      trim: true, // e.g. "Freshers", "1-2 Years", "3+ Years"
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    resumePath: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Career', careerSchema);

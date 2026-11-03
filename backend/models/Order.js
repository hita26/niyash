const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  form: {
    type: String,
  },
  boxes: {
    type: Number,
    required: true,
    default: 1,
  },
  unitsPerBox: {
    type: Number,
    required: true,
    default: 10,
  },
  totalUnits: {
    type: Number,
    required: true,
    default: 10,
  },
  unitPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  gstRate: {
    type: Number,
    default: 12,
  },
  itemTotal: {
    type: Number,
    required: true,
    default: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    retailerMobile: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit mobile number!`
      }
    },
    retailerEmail: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    destinationWhatsApp: {
      type: String,
      default: '9316566894',
      trim: true,
    },
    items: [orderItemSchema],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    gstAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Partially Paid', 'Paid'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Booked', 'Confirmed', 'Dispatched', 'Delivered'],
      default: 'Booked',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);

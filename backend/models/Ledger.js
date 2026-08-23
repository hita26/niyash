const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending', 'Overdue'],
    default: 'Pending',
  },
});

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  method: {
    type: String,
    enum: ['UPI', 'Card', 'NetBanking', 'Cheque', 'Cash'],
    default: 'UPI',
  },
  transactionRef: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const ledgerSchema = new mongoose.Schema(
  {
    retailerMobile: {
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
    email: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    totalBilled: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    outstandingBalance: {
      type: Number,
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: 100000,
    },
    invoices: [invoiceSchema],
    payments: [paymentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ledger', ledgerSchema);

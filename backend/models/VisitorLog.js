const mongoose = require('mongoose');

const visitorLogSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true,
    default: '127.0.0.1'
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
    default: ''
  },
  path: {
    type: String,
    required: true,
    index: true,
    default: '/'
  },
  pageTitle: {
    type: String,
    default: 'Home'
  },
  referrer: {
    type: String,
    default: 'Direct'
  },
  referrerSource: {
    type: String,
    default: 'Direct',
    index: true
  },
  device: {
    type: String,
    default: 'Desktop'
  },
  deviceType: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet', 'Bot', 'Other'],
    default: 'Desktop',
    index: true
  },
  browser: {
    type: String,
    default: 'Chrome'
  },
  os: {
    type: String,
    default: 'Windows'
  },
  city: {
    type: String,
    default: 'Rajkot'
  },
  region: {
    type: String,
    default: 'Gujarat'
  },
  country: {
    type: String,
    default: 'IN'
  },
  isBot: {
    type: Boolean,
    default: false,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for rapid high-volume analytics queries
visitorLogSchema.index({ timestamp: -1, isBot: 1 });
visitorLogSchema.index({ sessionId: 1, timestamp: -1 });
visitorLogSchema.index({ path: 1, timestamp: -1 });

// TTL index to automatically purge logs older than 60 days and protect DB storage
visitorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 3600 });

module.exports = mongoose.model('VisitorLog', visitorLogSchema);

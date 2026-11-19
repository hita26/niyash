const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: String,
    default: ''
  },
  adminName: {
    type: String,
    required: true,
    default: 'Admin User'
  },
  adminEmail: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'staff', 'chemist', 'system'],
    default: 'admin'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN', 
      'LOGOUT', 
      'LOGIN_FAILED', 
      'CREATE', 
      'UPDATE', 
      'DELETE', 
      'STATUS_CHANGE', 
      'BULK_IMPORT', 
      'EXPORT',
      'STOCK_TOGGLE',
      'PASSWORD_CHANGE'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      'AUTH', 
      'PRODUCT', 
      'ORDER', 
      'COMPANY', 
      'LEDGER', 
      'NEWS', 
      'CAREER', 
      'ADMIN_USER', 
      'SETTINGS', 
      'SYSTEM'
    ]
  },
  targetId: {
    type: String,
    default: ''
  },
  targetName: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  diff: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: ''
  },
  device: {
    type: String,
    default: 'Desktop'
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'BLOCKED'],
    default: 'SUCCESS'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ category: 1, action: 1 });
auditLogSchema.index({ adminEmail: 1 });
auditLogSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);

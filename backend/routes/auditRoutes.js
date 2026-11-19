const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

// @desc    Get paginated audit logs with search, category/action filters, and stats
// @route   GET /api/audit
// @access  Private / SuperAdmin & Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category = 'All',
      action = 'All',
      search = '',
      admin = '',
      startDate,
      endDate
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (action && action !== 'All') {
      query.action = action;
    }

    if (admin && admin.trim() !== '') {
      const escapedAdmin = admin.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { adminName: { $regex: escapedAdmin, $options: 'i' } },
        { adminEmail: { $regex: escapedAdmin, $options: 'i' } }
      ];
    }

    if (search && search.trim() !== '') {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = { $regex: escapedSearch, $options: 'i' };
      query.$or = [
        { targetName: searchRegex },
        { details: searchRegex },
        { adminName: searchRegex },
        { adminEmail: searchRegex },
        { ipAddress: searchRegex },
        { action: searchRegex }
      ];
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        const endD = new Date(endDate);
        endD.setHours(23, 59, 59, 999);
        query.timestamp.$lte = endD;
      }
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [logs, total, totalAllTime, todayCount, loginCount, deleteCount, uniqueAdmins] = await Promise.all([
      AuditLog.find(query)
        .sort({ timestamp: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AuditLog.countDocuments(query),
      AuditLog.countDocuments(),
      AuditLog.countDocuments({ timestamp: { $gte: todayStart } }),
      AuditLog.countDocuments({ action: 'LOGIN', timestamp: { $gte: todayStart } }),
      AuditLog.countDocuments({ action: 'DELETE' }),
      AuditLog.distinct('adminEmail')
    ]);

    res.json({
      success: true,
      logs,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      stats: {
        totalAllTime,
        todayCount,
        todayLogins: loginCount,
        totalDeletions: deleteCount,
        activeAdminCount: uniqueAdmins.length
      }
    });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving audit logs', error: error.message });
  }
});

// @desc    Export audit logs as CSV
// @route   GET /api/audit/export
// @access  Private / SuperAdmin
router.get('/export', protect, superAdminOnly, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(2000).lean();

    const headers = [
      'Timestamp (ISO)',
      'Date & Time (IST)',
      'Admin Name',
      'Admin Email',
      'Role',
      'Action',
      'Category',
      'Target Name',
      'Target ID',
      'Details',
      'IP Address',
      'Device / Browser',
      'Status'
    ];

    const rows = logs.map(l => {
      const d = new Date(l.timestamp || l.createdAt);
      const istString = d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

      return [
        `"${d.toISOString()}"`,
        `"${istString}"`,
        `"${(l.adminName || '').replace(/"/g, '""')}"`,
        `"${(l.adminEmail || '').replace(/"/g, '""')}"`,
        `"${l.role || ''}"`,
        `"${l.action || ''}"`,
        `"${l.category || ''}"`,
        `"${(l.targetName || '').replace(/"/g, '""')}"`,
        `"${l.targetId || ''}"`,
        `"${(l.details || '').replace(/"/g, '""')}"`,
        `"${l.ipAddress || ''}"`,
        `"${(l.device || '').replace(/"/g, '""')}"`,
        `"${l.status || 'SUCCESS'}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=Niyansh_Pharma_Audit_Logs_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Audit logs export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export audit logs', error: error.message });
  }
});

// @desc    Clear older audit logs (SuperAdmin only retention policy)
// @route   DELETE /api/audit/cleanup
// @access  Private / SuperAdmin
router.delete('/cleanup', protect, superAdminOnly, async (req, res) => {
  try {
    const { days = 90 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days, 10));

    const result = await AuditLog.deleteMany({ timestamp: { $lt: cutoffDate } });

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} audit logs older than ${days} days.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Audit logs cleanup error:', error);
    res.status(500).json({ success: false, message: 'Failed to cleanup audit logs', error: error.message });
  }
});

module.exports = router;

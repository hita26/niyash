const express = require('express');
const router = express.Router();
const VisitorLog = require('../models/VisitorLog');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');
const { getClientIp } = require('../utils/auditLogger');

/**
 * Classify traffic referral origin
 */
function parseReferrerSource(referrer = '') {
  if (!referrer || referrer === 'Direct' || referrer.trim() === '') return 'Direct';
  const ref = referrer.toLowerCase();
  if (ref.includes('google.')) return 'Google Search';
  if (ref.includes('bing.')) return 'Bing Search';
  if (ref.includes('yahoo.')) return 'Yahoo Search';
  if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'WhatsApp';
  if (ref.includes('facebook') || ref.includes('fb.com')) return 'Facebook';
  if (ref.includes('instagram')) return 'Instagram';
  if (ref.includes('linkedin')) return 'LinkedIn';
  if (ref.includes('t.co') || ref.includes('twitter') || ref.includes('x.com')) return 'X / Twitter';
  if (ref.includes('indiamart')) return 'IndiaMART';
  if (ref.includes('tradeindia')) return 'TradeIndia';
  if (ref.includes('niyanshpharma.com') || ref.includes('localhost')) return 'Internal';
  return 'Other Referral';
}

/**
 * Extract human-readable device and browser metrics
 */
function parseUserAgentDetails(ua = '') {
  if (!ua) {
    return {
      device: 'Desktop (Windows)',
      deviceType: 'Desktop',
      browser: 'Chrome',
      os: 'Windows',
      isBot: false
    };
  }

  const isBot = /bot|crawler|spider|slurp|facebookexternalhit|bingbot|googlebot|lighthouse|mediapartners/i.test(ua);

  let os = 'Unknown OS';
  if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone/i.test(ua)) os = 'iOS (iPhone)';
  else if (/ipad/i.test(ua)) os = 'iOS (iPad)';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  let deviceType = 'Desktop';
  if (isBot) deviceType = 'Bot';
  else if (/ipad|tablet/i.test(ua)) deviceType = 'Tablet';
  else if (/mobile|android|iphone/i.test(ua)) deviceType = 'Mobile';

  return {
    device: `${deviceType} (${os}) • ${browser}`,
    deviceType,
    browser,
    os,
    isBot
  };
}

// @desc    Track public visitor page-view in real-time
// @route   POST /api/analytics/track
// @access  Public (Called non-blocking from client)
router.post('/track', async (req, res) => {
  // Respond immediately so client never waits
  res.status(200).json({ ok: true });

  try {
    const {
      path = '/',
      pageTitle = 'Home',
      referrer = 'Direct',
      sessionId = ''
    } = req.body || {};

    // Exclude admin pages from public visitor metrics
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return;
    }

    const ip = getClientIp(req);
    const ua = req.headers['user-agent'] || '';
    const { device, deviceType, browser, os, isBot } = parseUserAgentDetails(ua);
    const referrerSource = parseReferrerSource(referrer);

    const city = req.headers['cf-ipcity'] || 'Rajkot';
    const region = req.headers['cf-region'] || 'Gujarat';
    const country = req.headers['cf-ipcountry'] || 'IN';

    // Store in background
    await VisitorLog.create({
      ip,
      sessionId: sessionId || `sid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      path: path.substring(0, 300),
      pageTitle: pageTitle.substring(0, 200),
      referrer: referrer.substring(0, 500),
      referrerSource,
      device,
      deviceType,
      browser,
      os,
      city,
      region,
      country,
      isBot,
      timestamp: new Date()
    });
  } catch (err) {
    // Non-fatal telemetry error
  }
});

// @desc    Get live real-time visitor statistics and stream
// @route   GET /api/analytics/live
// @access  Private / Admin
router.get('/live', protect, adminOnly, async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Live active visitors right now (last 5 minutes distinct sessions)
    const activeSessions = await VisitorLog.distinct('sessionId', {
      timestamp: { $gte: fiveMinutesAgo },
      isBot: false
    });
    const onlineNow = activeSessions.length;

    // 2. Today's total page views & unique visitors
    const [todayVisits, todayUniqueSessions, totalVisits] = await Promise.all([
      VisitorLog.countDocuments({ timestamp: { $gte: startOfToday }, isBot: false }),
      VisitorLog.distinct('sessionId', { timestamp: { $gte: startOfToday }, isBot: false }),
      VisitorLog.countDocuments({ isBot: false })
    ]);

    // 3. Top pages visited today
    const topPages = await VisitorLog.aggregate([
      { $match: { timestamp: { $gte: startOfToday }, isBot: false } },
      { $group: { _id: '$path', count: { $sum: 1 }, title: { $last: '$pageTitle' } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // 4. Traffic sources today
    const referrerSources = await VisitorLog.aggregate([
      { $match: { timestamp: { $gte: startOfToday }, isBot: false } },
      { $group: { _id: '$referrerSource', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // 5. Device distribution today
    const deviceTypes = await VisitorLog.aggregate([
      { $match: { timestamp: { $gte: startOfToday }, isBot: false } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 6. Recent 50 visitor transactions
    const recentLogs = await VisitorLog.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      stats: {
        onlineNow,
        todayVisits,
        todayUniques: todayUniqueSessions.length,
        totalVisits
      },
      topPages,
      referrerSources,
      deviceTypes,
      recentLogs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch live visitor data', error: err.message });
  }
});

// @desc    Export visitor analytics logs as CSV
// @route   GET /api/analytics/export
// @access  Private / Admin
router.get('/export', protect, adminOnly, async (req, res) => {
  try {
    const logs = await VisitorLog.find()
      .sort({ timestamp: -1 })
      .limit(2000)
      .lean();

    const headers = [
      'Timestamp (IST)',
      'Client IP',
      'Session ID',
      'Visited Path',
      'Page Title',
      'Traffic Source',
      'Device Summary',
      'Device Type',
      'Browser',
      'OS',
      'City / State',
      'Is Bot'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = logs.map(log => {
      const dateStr = log.timestamp
        ? new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : '';
      const location = `${log.city || 'Rajkot'}, ${log.region || 'Gujarat'}`;
      return [
        escapeCsv(dateStr),
        escapeCsv(log.ip),
        escapeCsv(log.sessionId),
        escapeCsv(log.path),
        escapeCsv(log.pageTitle),
        escapeCsv(log.referrerSource || log.referrer),
        escapeCsv(log.device),
        escapeCsv(log.deviceType),
        escapeCsv(log.browser),
        escapeCsv(log.os),
        escapeCsv(location),
        escapeCsv(log.isBot ? 'Yes' : 'No')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\r\n');

    const filename = `niyansh_visitors_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to export CSV', error: err.message });
  }
});

module.exports = router;

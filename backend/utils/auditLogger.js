const AuditLog = require('../models/AuditLog');

/**
 * Cleanly extracts real client IP address even behind proxies, Cloudflare, load balancers, or Nginx
 */
function getClientIp(req) {
  if (!req) return '127.0.0.1';
  
  const cfIp = req.headers ? req.headers['cf-connecting-ip'] : null;
  if (cfIp) return cfIp.trim();

  const realIp = req.headers ? req.headers['x-real-ip'] : null;
  if (realIp) return realIp.trim();

  const forwarded = req.headers ? req.headers['x-forwarded-for'] : null;
  if (forwarded) {
    const list = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return list.split(',')[0].trim();
  }

  let ip = req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip || '127.0.0.1';
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  if (ip === '::1' || ip === '127.0.0.1') {
    return '127.0.0.1 (Local)';
  }
  return ip;
}

/**
 * Extracts friendly human-readable Device & Browser name from user-agent header
 */
function getDeviceSummary(req) {
  if (!req || !req.headers) return 'Desktop';
  const ua = req.headers['user-agent'] || '';
  if (!ua) return 'Desktop';

  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/postman/i.test(ua)) browser = 'Postman API';

  const isMobile = /mobile|android|iphone/i.test(ua);
  return `${isMobile ? 'Mobile' : 'Desktop'} (${os}) • ${browser}`;
}

let lastAutoPruneTime = 0;
async function autoPruneOldLogs() {
  const now = Date.now();
  // Throttle to run at most once per hour
  if (now - lastAutoPruneTime < 60 * 60 * 1000) return;
  lastAutoPruneTime = now;
  try {
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const res = await AuditLog.deleteMany({
      $or: [
        { timestamp: { $lt: sevenDaysAgo } },
        { createdAt: { $lt: sevenDaysAgo } }
      ]
    });
    if (res && res.deletedCount > 0) {
      console.log(`[AutoPrune] Cleaned up ${res.deletedCount} audit logs older than 7 days`);
    }
  } catch (e) {
    // Non-fatal background task
  }
}

/**
 * Non-blocking Audit Logger
 * @param {Object} params
 * @param {Object} params.req - Express request object
 * @param {Object} [params.user] - Explicit user object if req.user is not yet attached (e.g. login)
 * @param {string} params.action - LOGIN, LOGOUT, CREATE, UPDATE, DELETE, STATUS_CHANGE, etc.
 * @param {string} params.category - AUTH, PRODUCT, ORDER, COMPANY, LEDGER, NEWS, CAREER, ADMIN_USER
 * @param {string} [params.targetId] - ID of affected entity
 * @param {string} [params.targetName] - Title/Name of affected entity
 * @param {string} params.details - Detailed summary of action performed
 * @param {Object} [params.diff] - Optional before/after change details
 * @param {string} [params.status] - 'SUCCESS' | 'FAILED' | 'BLOCKED'
 */
async function logAuditEvent({
  req,
  user,
  action,
  category,
  targetId = '',
  targetName = '',
  details = '',
  diff = null,
  status = 'SUCCESS'
}) {
  try {
    const actor = user || (req && req.user) || {};
    const adminId = actor._id ? String(actor._id) : (actor.id ? String(actor.id) : '');
    const adminName = actor.name || actor.fullName || 'Admin User';
    const adminEmail = actor.email || '';
    const role = actor.role || (actor.isSuperAdmin ? 'superadmin' : 'admin');

    const ipAddress = getClientIp(req);
    const userAgent = req && req.headers ? (req.headers['user-agent'] || '') : '';
    const device = getDeviceSummary(req);

    // Save asynchronously to DB without holding up main request thread
    AuditLog.create({
      adminId,
      adminName,
      adminEmail,
      role,
      action,
      category,
      targetId: String(targetId || ''),
      targetName: String(targetName || ''),
      details: String(details || ''),
      diff,
      ipAddress,
      userAgent,
      device,
      status,
      timestamp: new Date()
    }).then(() => {
      autoPruneOldLogs().catch(() => {});
    }).catch(err => {
      console.warn('Non-fatal: failed to write audit log to DB:', err.message);
    });
  } catch (err) {
    console.warn('Audit logger caught error:', err.message);
  }
}

module.exports = {
  logAuditEvent,
  getClientIp,
  getDeviceSummary
};

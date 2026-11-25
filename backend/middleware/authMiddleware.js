const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'niyansh_pharma_jwt_secret_key_2026');

      // Get user from the token, exclude password
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found', isTerminated: true });
      }

      // Root SuperAdmin account is always active
      if (req.user.email === 'info@niyanshpharma.com') {
        req.user.isActive = true;
      }

      if (req.user.isActive === false) {
        return res.status(403).json({ success: false, message: 'Account deactivated. Please contact Super Admin.', isTerminated: true });
      }

      return next();
    } catch (error) {
      console.error('JWT validation error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Super Admin access required for this action' });
  }
};

const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    // SuperAdmin always has all permissions across the platform
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (req.user.role === 'admin') {
      // Check if this specific permission is granted
      if (req.user.permissions && req.user.permissions[permissionKey] === true) {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: `Action denied. Your admin account lacks the "${permissionKey}" permission. Please contact Super Admin.`
      });
    }

    return res.status(403).json({ message: 'Not authorized: Admin privileges required' });
  };
};

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'niyansh_pharma_jwt_secret_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user && req.user.email === 'info@niyanshpharma.com') {
        req.user.isActive = true;
      }
    } catch (_) {
      // Invalid/expired token, proceed as guest without req.user
    }
  }
  return next();
};

module.exports = { protect, optionalProtect, adminOnly, superAdminOnly, checkPermission };

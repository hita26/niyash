const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'niyansh_pharma_jwt_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyName, gstin, drugLicense, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let sanitizedPhone = '';
    if (phone) {
      sanitizedPhone = phone.toString().replace(/\D/g, '');
      if (sanitizedPhone.length !== 10) {
        return res.status(400).json({ message: 'Phone number must contain exactly 10 numeric digits' });
      }
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      companyName: companyName || '',
      gstin: gstin || '',
      drugLicense: drugLicense || '',
      phone: sanitizedPhone,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        gstin: user.gstin,
        drugLicense: user.drugLicense,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.comparePassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        gstin: user.gstin,
        drugLicense: user.drugLicense,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Request password reset code (via email or preview fallback)
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const identifier = (email || req.body.identifier || '').toString().trim();

    if (!identifier) {
      return res.status(400).json({ message: 'Please provide your registered email or phone number' });
    }

    let user;
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier.toLowerCase().trim() });
    } else {
      const cleanPhone = identifier.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return res.status(400).json({ message: 'Phone number must contain exactly 10 numeric digits' });
      }

      // 1. Check direct User match
      user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase().trim() },
          { phone: identifier },
          { phone: cleanPhone },
          { phone: { $regex: cleanPhone } },
        ],
      });

      // 2. If not found by direct phone in User, check related Enquiry, Order, and Ledger records
      if (!user && cleanPhone.length >= 7) {
        try {
          const Enquiry = require('../models/Enquiry');
          const enquiry = await Enquiry.findOne({ phone: { $regex: cleanPhone } }).sort({ createdAt: -1 });
          if (enquiry) {
            if (enquiry.user) user = await User.findById(enquiry.user);
            if (!user && enquiry.email) user = await User.findOne({ email: enquiry.email.toLowerCase().trim() });
          }
        } catch (e) {}

        if (!user) {
          try {
            const Order = require('../models/Order');
            const order = await Order.findOne({ retailerMobile: { $regex: cleanPhone } }).sort({ createdAt: -1 });
            if (order && order.retailerEmail) {
              user = await User.findOne({ email: order.retailerEmail.toLowerCase().trim() });
            }
          } catch (e) {}
        }

        if (!user) {
          try {
            const Ledger = require('../models/Ledger');
            const ledger = await Ledger.findOne({ retailerMobile: { $regex: cleanPhone } });
            if (ledger && ledger.email) {
              user = await User.findOne({ email: ledger.email.toLowerCase().trim() });
            }
          } catch (e) {}
        }

        // Direct user fallback for known store number
        if (!user && cleanPhone === '8668139528') {
          user = await User.findOne({ email: 'shihorahita863@gmail.com' });
        }

        // Auto-save the phone number on user document so future lookups are instant
        if (user && (!user.phone || user.phone !== cleanPhone)) {
          user.phone = cleanPhone;
          await user.save();
        }
      }
    }

    if (!user) {
      return res.status(404).json({
        message: 'No registered B2B account found with this email or phone. Please verify your details or register a new store.',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save();

    let emailSent = false;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

    if (nodemailer && smtpUser && smtpPass) {
      try {
        const transporterConfig = smtpHost
          ? {
              host: smtpHost,
              port: Number(process.env.SMTP_PORT) || 587,
              secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
              auth: { user: smtpUser, pass: smtpPass },
            }
          : {
              service: 'gmail',
              auth: { user: smtpUser, pass: smtpPass },
            };

        const transporter = nodemailer.createTransport(transporterConfig);
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"Niyansh Pharma Wholesale" <${smtpUser}>`,
          to: user.email,
          subject: `Password Reset Verification Code: ${otp} - Niyansh Pharma`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #0c3d6c; margin: 0; font-size: 22px; font-weight: 800;">NIYANSH PHARMA</h2>
                <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Wholesale Pharmaceutical Distributor</p>
              </div>
              <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
                <p style="color: #1e293b; font-size: 15px; margin-bottom: 12px;">Hello <strong>${user.name || 'Valued Retailer'}</strong>,</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                  We received a request to reset your password for your Niyansh Pharma B2B Wholesale account (<strong>${user.email}</strong>).
                </p>
                <div style="background-color: #f0f7ff; border: 1px dashed #0c3d6c; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
                  <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">Your 6-Digit Verification Code</div>
                  <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0c3d6c;">${otp}</div>
                  <div style="color: #dc2626; font-size: 12px; margin-top: 8px;">Valid for 15 minutes only</div>
                </div>
                <p style="color: #475569; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
                  Enter this code on the password reset screen to set your new password. If you did not make this request, please ignore this email or contact support.
                </p>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                  Need urgent help? Wholesale Support Desk:<br />
                  <strong>Call / WhatsApp:</strong> +91 9316566894 | <strong>Email:</strong> accounts@niyanshpharma.com
                </div>
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error('Failed to send reset email:', mailErr.message);
      }
    }

    console.log(`[Forgot Password] OTP for ${user.email} (${user.phone || 'no phone'}): ${otp} (Email sent: ${emailSent})`);

    return res.json({
      success: true,
      message: emailSent
        ? `A 6-digit verification code has been sent to ${user.email}. Please check your inbox or spam folder.`
        : `Verification code generated. Please enter code ${otp} to reset your password.`,
      email: user.email,
      otp: emailSent ? undefined : otp,
      emailSent,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error generating password reset code' });
  }
});

// @desc    Verify reset OTP code
// @route   POST /api/users/verify-reset-code
// @access  Public
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and verification code' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'No active reset request found. Please request a new code.' });
    }

    if (new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
    }

    if (user.resetPasswordOtp.trim() !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
    }

    return res.json({ success: true, message: 'Verification code is valid' });
  } catch (error) {
    console.error('Verify reset code error:', error);
    return res.status(500).json({ message: 'Server error verifying reset code' });
  }
});

// @desc    Reset password with verified OTP
// @route   POST /api/users/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, verification code, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'No active reset request found. Please request a new code.' });
    }

    if (new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
    }

    if (user.resetPasswordOtp.trim() !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      companyName: updatedUser.companyName,
      gstin: updatedUser.gstin,
      drugLicense: updatedUser.drugLicense,
      phone: updatedUser.phone,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error resetting password' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        gstin: user.gstin,
        drugLicense: user.drugLicense,
        phone: user.phone,
        role: user.role,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.companyName = req.body.companyName !== undefined ? req.body.companyName : user.companyName;
      user.gstin = req.body.gstin !== undefined ? req.body.gstin : user.gstin;
      user.drugLicense = req.body.drugLicense !== undefined ? req.body.drugLicense : user.drugLicense;
      if (req.body.phone !== undefined) {
        const cleanP = req.body.phone ? req.body.phone.toString().replace(/\D/g, '') : '';
        if (cleanP && cleanP.length !== 10) {
          return res.status(400).json({ message: 'Phone number must contain exactly 10 numeric digits' });
        }
        user.phone = cleanP;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        companyName: updatedUser.companyName,
        gstin: updatedUser.gstin,
        drugLicense: updatedUser.drugLicense,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;

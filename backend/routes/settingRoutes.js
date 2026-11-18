const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const SiteSetting = require('../models/SiteSetting');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const SETTINGS_FILE = path.join(__dirname, '../data/siteSettings.json');

const DEFAULT_CONTACT_SETTINGS = {
  hubAddress: 'Block no. 52B, Panchayat Nagar-3, Ram Park Main Road, University Rd, Rajkot, Gujarat - 360005.',
  primaryPhone: '+91 99099 23130',
  secondaryPhone: '+91 93165 66894',
  email: 'info@niyanshpharma.com',
  workingHours: '9:00 AM – 9:00 PM',
  workingDays: 'Monday – Saturday',
  sundayStatus: 'Sunday: Holiday',
  lunchBreak: '2:00 PM – 4:00 PM',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.4650393043817!2d70.76194731589283!3d22.287219093721385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb33b44fc73f%3A0x3c79432bfa8b8b1d!2sNiyansh%20pharma!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
};

// Helper: Read local fallback settings
const readLocalSettings = () => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading local siteSettings.json:', err.message);
  }
  return { contact: DEFAULT_CONTACT_SETTINGS };
};

// Helper: Write local fallback settings
const writeLocalSettings = (data) => {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error saving local siteSettings.json:', err.message);
  }
};

// @route   GET /api/settings/contact
// @desc    Get dynamic contact & hub details
// @access  Public
router.get('/contact', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'contact' });
    if (setting && setting.value) {
      return res.json({
        success: true,
        contact: { ...DEFAULT_CONTACT_SETTINGS, ...setting.value }
      });
    }

    // Fallback to local settings file
    const local = readLocalSettings();
    if (local && local.contact) {
      return res.json({
        success: true,
        contact: { ...DEFAULT_CONTACT_SETTINGS, ...local.contact }
      });
    }

    return res.json({
      success: true,
      contact: DEFAULT_CONTACT_SETTINGS
    });
  } catch (err) {
    console.warn('DB error fetching contact settings, using fallback:', err.message);
    const local = readLocalSettings();
    return res.json({
      success: true,
      contact: (local && local.contact) ? { ...DEFAULT_CONTACT_SETTINGS, ...local.contact } : DEFAULT_CONTACT_SETTINGS
    });
  }
});

// @route   PUT /api/settings/contact
// @desc    Update dynamic contact & hub details
// @access  Private / Admin
router.put('/contact', protect, adminOnly, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const updatedContact = {
      hubAddress: payload.hubAddress || DEFAULT_CONTACT_SETTINGS.hubAddress,
      primaryPhone: payload.primaryPhone || DEFAULT_CONTACT_SETTINGS.primaryPhone,
      secondaryPhone: payload.secondaryPhone || DEFAULT_CONTACT_SETTINGS.secondaryPhone,
      email: payload.email || DEFAULT_CONTACT_SETTINGS.email,
      workingHours: payload.workingHours || DEFAULT_CONTACT_SETTINGS.workingHours,
      workingDays: payload.workingDays || DEFAULT_CONTACT_SETTINGS.workingDays,
      sundayStatus: payload.sundayStatus || DEFAULT_CONTACT_SETTINGS.sundayStatus,
      lunchBreak: payload.lunchBreak || DEFAULT_CONTACT_SETTINGS.lunchBreak,
      mapEmbedUrl: payload.mapEmbedUrl || DEFAULT_CONTACT_SETTINGS.mapEmbedUrl
    };

    // Update or insert in MongoDB
    let dbUpdated = null;
    try {
      dbUpdated = await SiteSetting.findOneAndUpdate(
        { key: 'contact' },
        { value: updatedContact },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('Could not save to MongoDB, saving locally:', dbErr.message);
    }

    // Update local JSON cache
    const currentLocal = readLocalSettings();
    currentLocal.contact = updatedContact;
    writeLocalSettings(currentLocal);

    return res.json({
      success: true,
      message: 'Contact details updated successfully',
      contact: updatedContact
    });
  } catch (err) {
    console.error('Error updating contact settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update contact settings' });
  }
});

module.exports = router;

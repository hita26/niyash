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

const DEFAULT_PAYMENT_SETTINGS = {
  merchantUpiId: '9316566894@okbizaxis',
  accountNumber: '924020012345678',
  ifscCode: 'UTIB0000123',
  accountName: 'Niyansh Pharma Wholesale',
  bankName: 'Axis Bank Ltd, University Road Branch',
  paymentNotes: 'Please mention your Chemist / Pharmacy Name & Order ID in UPI or NEFT transaction remarks.'
};

const DEFAULT_BANNER_SETTINGS = {
  homeHeroImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80',
  aboutHeroImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80',
  quickOrderBannerImage: ''
};

const DEFAULT_NEW_LAUNCH_SETTINGS = {
  enabled: true,
  badgeText: 'NEW LAUNCH SPOTLIGHT • RAJKOT DEPOT',
  heading: 'Advanced Cardiovascular Formulation',
  productName: 'NAP STAR A75',
  formula: 'Aspirin Gastro-resistant & Atorvastatin Capsules I.P.',
  description: 'Dual-action cardiovascular protection combining anti-platelet therapy with potent lipid regulation for cardiac defense and secondary stroke prevention.',
  image: '/banners/hero-banner-2.jpg',
  mrp: 60,
  scheme: '10 + 1 FREE',
  depotText: 'LIVE IN RAJKOT',
  dispatchText: 'Same-Day Dispatch',
  phone: '+919909923130'
};

const DEFAULT_BRANDS = [
  'Abbott', 'Alkem', 'Biochem', 'Cipla', 'Dr. Morepen', 'Daxia',
  'Glenmark', 'Intas', 'Mankind', 'Sun Pharma', 'Torrent', 'Zydus Cadila',
  'Lupin', 'Aristo', 'Macleods', 'Ipca'
];

const DEFAULT_CATEGORIES = [
  {
    title: 'Pharma Products',
    desc: 'Extensive range of generic and branded prescription drugs and formulations.',
    image: '/pharma-products.jpg',
    link: '/products?category=Pharma Products'
  },
  {
    title: 'Injectables & Critical Care',
    desc: 'Critical care and emergency hospital injectables in sterile ampoules.',
    image: '/injectables.jpg',
    link: '/products?category=Injectables'
  },
  {
    title: 'OTC Products',
    desc: 'Over-the-counter wellness essentials, supplements, and vitamins.',
    image: '/otc-products.jpg',
    link: '/products?category=OTC Products'
  },
  {
    title: 'Surgical & Medical Supplies',
    desc: 'Clinical disposables, diagnostic kits, and medical surgical equipment.',
    image: '/surgical-supplies.jpg',
    link: '/products?category=Surgical %26 Medical Supplies'
  }
];

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
  return {
    contact: DEFAULT_CONTACT_SETTINGS,
    payment: DEFAULT_PAYMENT_SETTINGS,
    banners: DEFAULT_BANNER_SETTINGS,
    brands: DEFAULT_BRANDS,
    categories: DEFAULT_CATEGORIES
  };
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

// ==========================================
// 1. CONTACT SETTINGS
// ==========================================
router.get('/contact', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'contact' });
    if (setting && setting.value) {
      return res.json({ success: true, contact: { ...DEFAULT_CONTACT_SETTINGS, ...setting.value } });
    }
    const local = readLocalSettings();
    return res.json({ success: true, contact: { ...DEFAULT_CONTACT_SETTINGS, ...(local?.contact || {}) } });
  } catch (err) {
    console.warn('DB error fetching contact settings, using fallback:', err.message);
    const local = readLocalSettings();
    return res.json({ success: true, contact: { ...DEFAULT_CONTACT_SETTINGS, ...(local?.contact || {}) } });
  }
});

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

    try {
      await SiteSetting.findOneAndUpdate(
        { key: 'contact' },
        { value: updatedContact },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('Could not save contact to MongoDB, saving locally:', dbErr.message);
    }

    const currentLocal = readLocalSettings();
    currentLocal.contact = updatedContact;
    writeLocalSettings(currentLocal);

    return res.json({ success: true, message: 'Contact details updated successfully', contact: updatedContact });
  } catch (err) {
    console.error('Error updating contact settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update contact settings' });
  }
});

// ==========================================
// 2. PAYMENT & BANKING SETTINGS
// ==========================================
router.get('/payment', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'payment' });
    if (setting && setting.value) {
      return res.json({ success: true, payment: { ...DEFAULT_PAYMENT_SETTINGS, ...setting.value } });
    }
    const local = readLocalSettings();
    return res.json({ success: true, payment: { ...DEFAULT_PAYMENT_SETTINGS, ...(local?.payment || {}) } });
  } catch (err) {
    console.warn('DB error fetching payment settings, using fallback:', err.message);
    const local = readLocalSettings();
    return res.json({ success: true, payment: { ...DEFAULT_PAYMENT_SETTINGS, ...(local?.payment || {}) } });
  }
});

router.put('/payment', protect, adminOnly, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const updatedPayment = {
      merchantUpiId: payload.merchantUpiId || DEFAULT_PAYMENT_SETTINGS.merchantUpiId,
      accountNumber: payload.accountNumber || DEFAULT_PAYMENT_SETTINGS.accountNumber,
      ifscCode: payload.ifscCode || DEFAULT_PAYMENT_SETTINGS.ifscCode,
      accountName: payload.accountName || DEFAULT_PAYMENT_SETTINGS.accountName,
      bankName: payload.bankName || DEFAULT_PAYMENT_SETTINGS.bankName,
      paymentNotes: payload.paymentNotes || DEFAULT_PAYMENT_SETTINGS.paymentNotes
    };

    try {
      await SiteSetting.findOneAndUpdate(
        { key: 'payment' },
        { value: updatedPayment },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('Could not save payment to MongoDB, saving locally:', dbErr.message);
    }

    const currentLocal = readLocalSettings();
    currentLocal.payment = updatedPayment;
    writeLocalSettings(currentLocal);

    return res.json({ success: true, message: 'Payment settings updated successfully', payment: updatedPayment });
  } catch (err) {
    console.error('Error updating payment settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update payment settings' });
  }
});

// ==========================================
// 3. BANNER & MEDIA ASSETS SETTINGS
// ==========================================
router.get('/banners', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'banners' });
    if (setting && setting.value) {
      return res.json({ success: true, banners: { ...DEFAULT_BANNER_SETTINGS, ...setting.value } });
    }
    const local = readLocalSettings();
    return res.json({ success: true, banners: { ...DEFAULT_BANNER_SETTINGS, ...(local?.banners || {}) } });
  } catch (err) {
    console.warn('DB error fetching banner settings, using fallback:', err.message);
    const local = readLocalSettings();
    return res.json({ success: true, banners: { ...DEFAULT_BANNER_SETTINGS, ...(local?.banners || {}) } });
  }
});

router.put('/banners', protect, adminOnly, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const updatedBanners = {
      homeHeroImage: payload.homeHeroImage || DEFAULT_BANNER_SETTINGS.homeHeroImage,
      aboutHeroImage: payload.aboutHeroImage || DEFAULT_BANNER_SETTINGS.aboutHeroImage,
      quickOrderBannerImage: payload.quickOrderBannerImage || ''
    };

    try {
      await SiteSetting.findOneAndUpdate(
        { key: 'banners' },
        { value: updatedBanners },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('Could not save banners to MongoDB, saving locally:', dbErr.message);
    }

    const currentLocal = readLocalSettings();
    currentLocal.banners = updatedBanners;
    writeLocalSettings(currentLocal);

    return res.json({ success: true, message: 'Banner images updated successfully', banners: updatedBanners });
  } catch (err) {
    console.error('Error updating banner settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update banner settings' });
  }
});

// ==========================================
// 4. BRANDS & CATEGORIES (HOME CONTENT)
// ==========================================
router.get('/home-content', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'home_content' });
    if (setting && setting.value) {
      return res.json({
        success: true,
        brands: setting.value.brands || DEFAULT_BRANDS,
        categories: setting.value.categories || DEFAULT_CATEGORIES
      });
    }
    const local = readLocalSettings();
    return res.json({
      success: true,
      brands: local?.brands || DEFAULT_BRANDS,
      categories: local?.categories || DEFAULT_CATEGORIES
    });
  } catch (err) {
    console.warn('DB error fetching home content, using fallback:', err.message);
    const local = readLocalSettings();
    return res.json({
      success: true,
      brands: local?.brands || DEFAULT_BRANDS,
      categories: local?.categories || DEFAULT_CATEGORIES
    });
  }
});

router.put('/home-content', protect, adminOnly, async (req, res) => {
  try {
    const { brands, categories } = req.body;

    const updatedContent = {
      brands: Array.isArray(brands) && brands.length > 0 ? brands : DEFAULT_BRANDS,
      categories: Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES
    };

    try {
      await SiteSetting.findOneAndUpdate(
        { key: 'home_content' },
        { value: updatedContent },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('Could not save home content to MongoDB, saving locally:', dbErr.message);
    }

    const currentLocal = readLocalSettings();
    currentLocal.brands = updatedContent.brands;
    currentLocal.categories = updatedContent.categories;
    writeLocalSettings(currentLocal);

    return res.json({ success: true, message: 'Home content updated successfully', ...updatedContent });
  } catch (err) {
    console.error('Error updating home content:', err);
    return res.status(500).json({ success: false, message: 'Failed to update home content' });
  }
});

// ==========================================
// 5. NEW LAUNCH SPOTLIGHT SETTINGS
// ==========================================
router.get('/new-launch', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'new_launch' });
    if (setting && setting.value) {
      return res.json({ success: true, data: { ...DEFAULT_NEW_LAUNCH_SETTINGS, ...setting.value } });
    }
    const local = readLocalSettings();
    return res.json({ success: true, data: { ...DEFAULT_NEW_LAUNCH_SETTINGS, ...(local?.newLaunch || {}) } });
  } catch (err) {
    console.warn('DB error fetching new launch settings, using fallback:', err.message);
    const local = readLocalSettings();
    return res.json({ success: true, data: { ...DEFAULT_NEW_LAUNCH_SETTINGS, ...(local?.newLaunch || {}) } });
  }
});

router.put('/new-launch', protect, adminOnly, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const updated = {
      ...DEFAULT_NEW_LAUNCH_SETTINGS,
      ...payload
    };

    try {
      await SiteSetting.findOneAndUpdate(
        { key: 'new_launch' },
        { value: updated },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('Could not save new launch settings to MongoDB, saving locally:', dbErr.message);
    }

    const currentLocal = readLocalSettings();
    currentLocal.newLaunch = updated;
    writeLocalSettings(currentLocal);

    return res.json({ success: true, message: 'New Launch settings updated successfully', data: updated });
  } catch (err) {
    console.error('Error updating new launch settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update new launch settings' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const BANNERS_FILE = path.join(__dirname, '../data/banners.json');

// Master Default Banners representing b1-b7 product catalog posters
const DEFAULT_BANNERS = [
  {
    _id: "seed-b1",
    title: "NAP STAR A75 Capsules",
    subtitle: "Aspirin Gastro-resistant & Atorvastatin Capsules I.P. • MRP ₹60 • Niyansh Pharma Rajkot",
    badge: "NEWLY LAUNCHED",
    image: "/banners/b1.jpeg",
    link: "/products?search=NAP%20STAR",
    ctaText: "Order NAP STAR A75 ⚡",
    order: 1,
    active: true,
    aspectRatio: "landscape"
  },
  {
    _id: "seed-b2",
    title: "NIYACOF-DX Cough Syrup",
    subtitle: "Dextromethorphan HBr, Chlorpheniramine & Phenylephrine • Triple Relief from Cough, Cold & Congestion",
    badge: "NEW LAUNCH",
    image: "/banners/b2.jpeg",
    link: "/products?search=NIYACOF",
    ctaText: "Order NIYACOF-DX ⚡",
    order: 2,
    active: true,
    aspectRatio: "square"
  },
  {
    _id: "seed-b3",
    title: "Niyamet-G1 SR Tablets",
    subtitle: "Metformin Hydrochloride PR & Glimepiride Tablets I.P. • MRP ₹135/- • For Better Control of Diabetes",
    badge: "DIABETES CARE",
    image: "/banners/b3.jpeg",
    link: "/products?search=Niyamet",
    ctaText: "Order Niyamet-G1 ⚡",
    order: 3,
    active: true,
    aspectRatio: "square"
  },
  {
    _id: "seed-b4",
    title: "Niyamet-G2 SR Tablets",
    subtitle: "Metformin Hydrochloride PR & Glimepiride Tablets I.P. • MRP ₹176/- • Better Control for Healthier Tomorrow",
    badge: "DIABETES CARE",
    image: "/banners/b4.jpeg",
    link: "/products?search=Niyamet",
    ctaText: "Order Niyamet-G2 ⚡",
    order: 4,
    active: true,
    aspectRatio: "square"
  },
  {
    _id: "seed-b5",
    title: "Niyarose 10 Tablets",
    subtitle: "Rosuvastatin Calcium Tablets I.P. • MRP ₹185/- • Effective Control of Cholesterol & Heart Health",
    badge: "CARDIAC CARE",
    image: "/banners/b5.jpeg",
    link: "/products?search=Niyarose",
    ctaText: "Order Niyarose 10 ⚡",
    order: 5,
    active: true,
    aspectRatio: "square"
  },
  {
    _id: "seed-b6",
    title: "Niyastat-Gold 10 Capsules",
    subtitle: "Atorvastatin, Aspirin & Clopidogrel Capsules • MRP ₹107/Strip • Triple Action for Healthier Heart",
    badge: "TRIPLE ACTION CARDIAC",
    image: "/banners/b6.jpeg",
    link: "/products?search=Niyastat",
    ctaText: "Order Niyastat-Gold 10 ⚡",
    order: 6,
    active: true,
    aspectRatio: "portrait"
  },
  {
    _id: "seed-b7",
    title: "Niyastat-Gold 20 Capsules",
    subtitle: "Atorvastatin, Aspirin & Clopidogrel Capsules • MRP ₹139/Strip • Advanced Triple Action Heart Care",
    badge: "TRIPLE ACTION CARDIAC",
    image: "/banners/b7.jpeg",
    link: "/products?search=Niyastat",
    ctaText: "Order Niyastat-Gold 20 ⚡",
    order: 7,
    active: true,
    aspectRatio: "portrait"
  }
];

// Read local fallback banners with hard fallback to DEFAULT_BANNERS
const readLocalBanners = () => {
  try {
    if (fs.existsSync(BANNERS_FILE)) {
      const raw = fs.readFileSync(BANNERS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading local banners.json:', err.message);
  }
  return DEFAULT_BANNERS;
};

// Write local fallback banners
const writeLocalBanners = (banners) => {
  try {
    const dir = path.dirname(BANNERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BANNERS_FILE, JSON.stringify(banners, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error saving local banners.json:', err.message);
  }
};

// Seed MongoDB if empty
const seedDatabaseIfEmpty = async () => {
  try {
    const count = await Banner.countDocuments();
    if (count === 0) {
      const local = readLocalBanners();
      const toInsert = (local.length > 0 ? local : DEFAULT_BANNERS).map(({ _id, ...rest }) => rest);
      await Banner.insertMany(toInsert);
      console.log('Successfully seeded MongoDB with 7 initial Niyansh hero banners');
    }
  } catch (err) {
    console.warn('Seed banners notice:', err.message);
  }
};

/**
 * GET /api/banners
 * Public: Get active banners for homepage slider
 */
router.get('/', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
    if (banners && banners.length > 0) {
      return res.json({ success: true, banners });
    }

    // Fallback to local
    const local = readLocalBanners().filter(b => b.active !== false);
    return res.json({ success: true, banners: local.length > 0 ? local : DEFAULT_BANNERS });
  } catch (err) {
    console.warn('DB error fetching banners, using fallback:', err.message);
    const local = readLocalBanners().filter(b => b.active !== false);
    return res.json({ success: true, banners: local.length > 0 ? local : DEFAULT_BANNERS });
  }
});

/**
 * GET /api/banners/all
 * Admin: Get all banners (active + inactive)
 */
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
    if (banners && banners.length > 0) {
      return res.json({ success: true, banners });
    }

    const local = readLocalBanners();
    return res.json({ success: true, banners: local.length > 0 ? local : DEFAULT_BANNERS });
  } catch (err) {
    console.warn('DB error in /api/banners/all, using fallback:', err.message);
    const local = readLocalBanners();
    return res.json({ success: true, banners: local.length > 0 ? local : DEFAULT_BANNERS });
  }
});

/**
 * POST /api/banners
 * Admin: Create a new banner
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, badge, image, link, ctaText, order, active, aspectRatio } = req.body;

    if (!image || !image.trim()) {
      return res.status(400).json({ success: false, message: 'Banner image is required' });
    }

    const newBannerData = {
      title: title?.trim() || 'Niyansh Pharma Formulation',
      subtitle: subtitle?.trim() || 'Genuine Formulations & Supplies Across Gujarat',
      badge: badge?.trim() || 'NEW LAUNCH',
      image: image.trim(),
      link: link?.trim() || '/quick-order',
      ctaText: ctaText?.trim() || 'Fast Quick Order ⚡',
      order: typeof order === 'number' ? order : 99,
      active: active !== undefined ? Boolean(active) : true,
      aspectRatio: aspectRatio || 'auto'
    };

    let createdBanner;
    try {
      createdBanner = await Banner.create(newBannerData);
    } catch (dbErr) {
      console.warn('MongoDB banner create error, saving locally:', dbErr.message);
      createdBanner = {
        _id: 'banner_' + Date.now(),
        ...newBannerData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Update local JSON cache
    const local = readLocalBanners();
    local.push(createdBanner);
    writeLocalBanners(local);

    return res.status(201).json({
      success: true,
      message: 'Banner added successfully',
      banner: createdBanner
    });
  } catch (err) {
    console.error('Error creating banner:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to create banner' });
  }
});

/**
 * PUT /api/banners/:id
 * Admin: Update banner
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, badge, image, link, ctaText, order, active, aspectRatio } = req.body;

    let updatedBanner;
    try {
      updatedBanner = await Banner.findByIdAndUpdate(
        id,
        {
          ...(title !== undefined && { title: title.trim() }),
          ...(subtitle !== undefined && { subtitle: subtitle.trim() }),
          ...(badge !== undefined && { badge: badge.trim() }),
          ...(image !== undefined && { image: image.trim() }),
          ...(link !== undefined && { link: link.trim() }),
          ...(ctaText !== undefined && { ctaText: ctaText.trim() }),
          ...(order !== undefined && { order: Number(order) }),
          ...(active !== undefined && { active: Boolean(active) }),
          ...(aspectRatio !== undefined && { aspectRatio })
        },
        { new: true }
      );
    } catch (dbErr) {
      console.warn('MongoDB banner update error:', dbErr.message);
    }

    // Sync local
    const local = readLocalBanners();
    const idx = local.findIndex(b => String(b._id) === String(id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...req.body, updatedAt: new Date() };
      writeLocalBanners(local);
      if (!updatedBanner) updatedBanner = local[idx];
    }

    return res.json({
      success: true,
      message: 'Banner updated successfully',
      banner: updatedBanner
    });
  } catch (err) {
    console.error('Error updating banner:', err);
    return res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
});

/**
 * PATCH /api/banners/:id/toggle
 * Admin: Toggle active state
 */
router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    let newStatus = true;

    try {
      const banner = await Banner.findById(id);
      if (banner) {
        banner.active = !banner.active;
        await banner.save();
        newStatus = banner.active;
      }
    } catch (dbErr) {
      console.warn('MongoDB toggle error:', dbErr.message);
    }

    // Sync local
    const local = readLocalBanners();
    const item = local.find(b => String(b._id) === String(id));
    if (item) {
      item.active = !item.active;
      newStatus = item.active;
      writeLocalBanners(local);
    }

    return res.json({
      success: true,
      message: `Banner ${newStatus ? 'activated' : 'deactivated'}`,
      active: newStatus
    });
  } catch (err) {
    console.error('Error toggling banner:', err);
    return res.status(500).json({ success: false, message: 'Failed to toggle banner' });
  }
});

/**
 * DELETE /api/banners/:id
 * Admin: Delete banner
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await Banner.findByIdAndDelete(id);
    } catch (dbErr) {
      console.warn('MongoDB delete error:', dbErr.message);
    }

    // Sync local
    const local = readLocalBanners().filter(b => String(b._id) !== String(id));
    writeLocalBanners(local);

    return res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting banner:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
});

/**
 * POST /api/banners/reorder
 * Admin: Batch reorder banners
 */
router.post('/reorder', protect, adminOnly, async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Invalid orders array' });
    }

    for (const item of orders) {
      try {
        await Banner.findByIdAndUpdate(item.id, { order: item.order });
      } catch (e) {
        // continue
      }
    }

    // Sync local
    const local = readLocalBanners();
    orders.forEach(o => {
      const b = local.find(x => String(x._id) === String(o.id));
      if (b) b.order = o.order;
    });
    local.sort((a, b) => a.order - b.order);
    writeLocalBanners(local);

    return res.json({ success: true, message: 'Banners reordered successfully' });
  } catch (err) {
    console.error('Error reordering banners:', err);
    return res.status(500).json({ success: false, message: 'Failed to reorder banners' });
  }
});

module.exports = router;

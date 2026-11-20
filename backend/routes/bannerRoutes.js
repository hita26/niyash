const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const BANNERS_FILE = path.join(__dirname, '../data/banners.json');

// Read local fallback banners
const readLocalBanners = () => {
  try {
    if (fs.existsSync(BANNERS_FILE)) {
      const raw = fs.readFileSync(BANNERS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading local banners.json:', err.message);
  }
  return [];
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
      if (local.length > 0) {
        const toInsert = local.map(({ _id, ...rest }) => rest);
        await Banner.insertMany(toInsert);
      }
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
    return res.json({ success: true, banners: local });
  } catch (err) {
    console.warn('DB error fetching banners, using local fallback:', err.message);
    const local = readLocalBanners().filter(b => b.active !== false);
    return res.json({ success: true, banners: local });
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
    return res.json({ success: true, banners: local });
  } catch (err) {
    console.warn('DB error in /api/banners/all, using local fallback:', err.message);
    const local = readLocalBanners();
    return res.json({ success: true, banners: local });
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
      title: title?.trim() || 'Niyansh Pharma B2B Wholesale',
      subtitle: subtitle?.trim() || 'Genuine Formulations & Supplies Across Gujarat',
      badge: badge?.trim() || 'WHO-GMP CERTIFIED',
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

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ========================================================
// GET /api/companies
// List all public companies with product counts and filtering
// ========================================================
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 24, sort = 'nameAsc', admin } = req.query;

    const query = {};
    if (!admin) {
      query.isPublished = true;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOptions = { orderPriority: 1, name: 1 };
    if (sort === 'nameAsc') sortOptions = { name: 1 };
    if (sort === 'nameDesc') sortOptions = { name: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Aggregate product counts for these companies
    const companyNames = companies.map(c => c.name);
    const companyIds = companies.map(c => c._id);

    const counts = await Product.aggregate([
      {
        $match: {
          $or: [
            { companyId: { $in: companyIds } },
            { company: { $in: companyNames } },
          ],
        },
      },
      {
        $group: {
          _id: { $ifNull: ['$companyId', '$company'] },
          count: { $sum: 1 },
          inStockCount: {
            $sum: { $cond: [{ $eq: ['$inStock', true] }, 1, 0] },
          },
        },
      },
    ]);

    const countMap = {};
    counts.forEach(item => {
      countMap[String(item._id)] = {
        total: item.count,
        inStock: item.inStockCount,
      };
    });

    const enrichedCompanies = companies.map(c => {
      const byId = countMap[String(c._id)];
      const byName = countMap[c.name];
      const prodInfo = byId || byName || { total: 0, inStock: 0 };
      return {
        ...c,
        productCount: prodInfo.total,
        inStockCount: prodInfo.inStock,
      };
    });

    // If sorting by products count
    if (sort === 'productsDesc') {
      enrichedCompanies.sort((a, b) => b.productCount - a.productCount);
    }

    res.json({
      success: true,
      companies: enrichedCompanies,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ success: false, message: 'Server error fetching companies', error: err.message });
  }
});

// ========================================================
// GET /api/companies/categories
// Get unique list of company categories
// ========================================================
router.get('/categories', async (req, res) => {
  try {
    const categories = await Company.distinct('category', { isPublished: true });
    res.json({ success: true, categories: categories.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error getting categories', error: err.message });
  }
});

// ========================================================
// GET /api/companies/:id
// Get single company profile + list of its catalog products
// ========================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let company;

    if (mongoose.Types.ObjectId.isValid(id)) {
      company = await Company.findById(id).lean();
    }
    if (!company) {
      company = await Company.findOne({ slug: id.toLowerCase() }).lean();
    }
    if (!company) {
      company = await Company.findOne({ name: { $regex: new RegExp(`^${id}$`, 'i') } }).lean();
    }

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Fetch products belonging to this company
    const products = await Product.find({
      $or: [
        { companyId: company._id },
        { company: company.name },
      ],
      isActive: { $ne: false },
    }).sort({ name: 1 }).lean();

    res.json({
      success: true,
      company: {
        ...company,
        productCount: products.length,
      },
      products,
    });
  } catch (err) {
    console.error('Error fetching company details:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ========================================================
// POST /api/companies
// Create a new company (Admin only)
// ========================================================
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      logoUrl,
      coverImageUrl,
      category,
      description,
      location,
      websiteUrl,
      isVerified = true,
      isPublished = true,
      orderPriority = 100,
      specialties = [],
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Company with this name already exists' });
    }

    const company = await Company.create({
      name: name.trim(),
      logoUrl: logoUrl ? logoUrl.trim() : '',
      coverImageUrl: coverImageUrl ? coverImageUrl.trim() : '',
      category: category ? category.trim() : 'Pharmaceutical Formulations',
      description: description ? description.trim() : '',
      location: location ? location.trim() : 'India',
      websiteUrl: websiteUrl ? websiteUrl.trim() : '',
      isVerified,
      isPublished,
      orderPriority: Number(orderPriority) || 100,
      specialties: Array.isArray(specialties) ? specialties : [],
    });

    res.status(201).json({ success: true, company });
  } catch (err) {
    console.error('Error creating company:', err);
    res.status(500).json({ success: false, message: 'Failed to create company', error: err.message });
  }
});

// ========================================================
// PUT /api/companies/:id
// Update an existing company (Admin only)
// ========================================================
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const allowedFields = [
      'name', 'logoUrl', 'coverImageUrl', 'category', 'description',
      'location', 'websiteUrl', 'isVerified', 'isPublished', 'orderPriority',
      'specialties', 'divisionCodes'
    ];

    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) {
        company[f] = req.body[f];
      }
    });

    await company.save();
    res.json({ success: true, company });
  } catch (err) {
    console.error('Error updating company:', err);
    res.status(500).json({ success: false, message: 'Failed to update company', error: err.message });
  }
});

// ========================================================
// DELETE /api/companies/:id
// Delete a company (Admin only)
// ========================================================
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    await Company.findByIdAndDelete(id);
    res.json({ success: true, message: 'Company removed successfully' });
  } catch (err) {
    console.error('Error deleting company:', err);
    res.status(500).json({ success: false, message: 'Failed to delete company', error: err.message });
  }
});

module.exports = router;

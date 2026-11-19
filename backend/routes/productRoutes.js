const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const https = require('https');
const multer = require('multer');
const Product = require('../models/Product');
const Company = require('../models/Company');
const User = require('../models/User');
const CustomFieldDef = require('../models/CustomFieldDef');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const { protect, adminOnly, superAdminOnly, checkPermission } = require('../middleware/authMiddleware');

// Upload directory setup
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  // Ignore in read-only environment
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `prod-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file format. Supported formats: JPG, JPEG, PNG, WEBP, GIF'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter,
});

// Helper to escape special regex characters to prevent syntax crashes and ReDoS
const escapeRegex = (str) => {
  if (!str) return '';
  return str.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get metadata filters (distinct companies, forms, categories)
// @route   GET /api/products/meta/filters
// @access  Public
router.get('/meta/filters', async (req, res) => {
  try {
    const [companiesRaw, brandsRaw, formsRaw, categoriesRaw] = await Promise.all([
      Product.distinct('company'),
      Product.distinct('brand'),
      Product.distinct('form'),
      Product.distinct('category'),
    ]);

    const cleanList = (arr) =>
      [...new Set(
        arr
          .filter((item) => item !== null && item !== undefined && item.toString().trim() !== '')
          .map((item) => item.toString().trim())
      )].sort((a, b) => a.localeCompare(b));

    const companies = cleanList(companiesRaw);
    const brands = cleanList(brandsRaw);
    const forms = cleanList(formsRaw);
    const categories = cleanList(categoriesRaw);

    res.json({
      success: true,
      companies,
      brands,
      forms,
      categories,
    });
  } catch (error) {
    console.error('Filter meta error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching filter options', error: error.message });
  }
});

// Helper function to search medicine images on the web
const searchWebMedicineImages = (query) => {
  return new Promise((resolve) => {
    try {
      const clean = (query || '')
        .replace(/\(\s*\d+\s*[\*xX]\s*\d+.*?\)/gi, '')
        .replace(/\b\d+\s*[\*xX]\s*\d+\b/gi, '')
        .replace(/\(\s*(GREEN|WHITE|RED|BLUE|YELLOW)\s*\)/gi, '')
        .replace(/[()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const searchQuery = `${clean} medicine packaging`;
      const url = `https://www.bing.com/images/search?q=${encodeURIComponent(searchQuery)}&form=HDRSC2&first=1`;

      https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (resp) => {
        let body = '';
        resp.on('data', chunk => body += chunk);
        resp.on('end', () => {
          const murlMatches = [...body.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+)&quot;/g)].map(m => m[1]);
          const cleanImgs = murlMatches.filter(u =>
            !u.includes('vector') &&
            !u.includes('icon') &&
            !u.includes('logo') &&
            (u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.png') || u.endsWith('.webp') || u.includes('gumlet.io') || u.includes('imimg.com') || u.includes('daxia') || u.includes('zeelab'))
          );
          resolve(cleanImgs.slice(0, 8));
        });
      }).on('error', () => resolve([]));
    } catch {
      resolve([]);
    }
  });
};

// @desc    Auto-search web for authentic medicine packaging photos
// @route   GET /api/products/search-medicine-images
// @access  Private/Admin
router.get('/search-medicine-images', protect, adminOnly, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    const images = await searchWebMedicineImages(query.trim());
    res.json({
      success: true,
      query,
      images,
    });
  } catch (error) {
    console.error('Image search error:', error);
    res.status(500).json({ success: false, message: 'Error searching medicine photos', error: error.message });
  }
});

// @desc    Admin: Get all products with full filters and summary statistics
// @route   GET /api/products/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { search, category, inStock, isActive, sort, page = 1, limit = 50 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const escaped = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { brand: { $regex: escaped, $options: 'i' } },
        { company: { $regex: escaped, $options: 'i' } },
        { sku: { $regex: escaped, $options: 'i' } },
        { composition: { $regex: escaped, $options: 'i' } },
        { category: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (category && category !== 'All' && category.trim() !== '') {
      query.category = { $regex: `^${escapeRegex(category.trim())}$`, $options: 'i' };
    }

    if (inStock !== undefined && inStock !== 'All' && inStock !== '') {
      query.inStock = inStock === 'true' || inStock === true;
    }

    if (isActive !== undefined && isActive !== 'All' && isActive !== '') {
      query.isActive = isActive === 'true' || isActive === true;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'priceAsc') sortOptions = { price: 1 };
    else if (sort === 'priceDesc') sortOptions = { price: -1 };
    else if (sort === 'nameAsc') sortOptions = { name: 1 };
    else if (sort === 'nameDesc') sortOptions = { name: -1 };
    else if (sort === 'stockAsc') sortOptions = { stockQuantity: 1 };
    else if (sort === 'stockDesc') sortOptions = { stockQuantity: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [products, total, totalProductsCount, activeCount, outOfStockCount, categoriesList, featuredCount, recentProducts] =
      await Promise.all([
        Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
        Product.countDocuments(query),
        Product.estimatedDocumentCount ? Product.estimatedDocumentCount() : Product.countDocuments(),
        Product.countDocuments({ isActive: { $ne: false } }),
        Product.countDocuments({ $or: [{ inStock: false }, { stockQuantity: { $lte: 0 } }] }),
        Product.distinct('category'),
        Product.countDocuments({ featured: true }),
        Product.find().sort({ createdAt: -1 }).limit(5).select('name brand sku price mrp inStock stockQuantity createdAt').lean(),
      ]);

    res.json({
      success: true,
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      stats: {
        totalProducts: totalProductsCount,
        activeProducts: activeCount,
        outOfStock: outOfStockCount,
        totalCategories: categoriesList.length,
        featuredProducts: featuredCount,
      },
      categories: categoriesList,
      recentProducts,
    });
  } catch (error) {
    console.error('Admin all products error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching admin products', error: error.message });
  }
});

// @desc    Upload multiple product photos (Stored securely on Cloudinary Cloud Storage)
// @route   POST /api/products/upload
// @access  Private/Admin
router.post('/upload', protect, adminOnly, (req, res) => {
  upload.array('photos', 10)(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }

    try {
      const urls = [];
      for (const file of req.files) {
        try {
          // Upload to Cloudinary with auto-compression, auto WebP format, and 1200px limit
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'niyansh_pharma/products',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          });

          urls.push(result.secure_url);

          // Delete temporary local file immediately to free server disk space
          if (fs.existsSync(file.path)) {
            try { fs.unlinkSync(file.path); } catch (e) {}
          }
        } catch (cloudErr) {
          console.warn('Cloudinary upload warning, using local file as fallback:', cloudErr.message);
          urls.push(`/uploads/${file.filename}`);
        }
      }

      res.json({ success: true, urls, count: urls.length, storage: 'cloudinary' });
    } catch (uploadError) {
      console.error('Upload processing error:', uploadError);
      const fallbackUrls = req.files.map((file) => `/uploads/${file.filename}`);
      res.json({ success: true, urls: fallbackUrls, count: fallbackUrls.length, storage: 'local_fallback' });
    }
  });
});

// @desc    Get all public products with filtering, search, sorting and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      company,
      form,
      inStock,
      sort,
      page = 1,
      limit = 12,
      maxPrice,
      minPrice,
      featured,
      isOurProduct,
      includeInactive,
    } = req.query;

    const query = {};

    // By default, only show active products on public pages
    if (includeInactive !== 'true') {
      query.isActive = { $ne: false };
    }

    // Featured filter
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }

    // Our Products filter
    if (isOurProduct === 'true' || isOurProduct === true) {
      query.isOurProduct = true;
    }

    // Search filter across text fields
    if (search && search.trim() !== '') {
      const escapedSearch = escapeRegex(search.trim());
      const searchRegex = { $regex: escapedSearch, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { company: searchRegex },
        { composition: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
        { form: searchRegex },
      ];
    }

    // Company filter (supports comma-separated list)
    if (company && company.trim() !== '') {
      if (company.includes(',')) {
        query.company = { $in: company.split(',').map((c) => new RegExp(`^${escapeRegex(c.trim())}$`, 'i')) };
      } else {
        query.company = { $regex: `^${escapeRegex(company.trim())}$`, $options: 'i' };
      }
    }

    // Category filter (supports comma-separated list)
    if (category && category.trim() !== '') {
      if (category.includes(',')) {
        query.category = { $in: category.split(',').map((c) => new RegExp(`^${escapeRegex(c.trim())}$`, 'i')) };
      } else {
        query.category = { $regex: `^${escapeRegex(category.trim())}$`, $options: 'i' };
      }
    }

    // Brand filter (supports comma-separated list)
    if (brand && brand.trim() !== '') {
      if (brand.includes(',')) {
        query.brand = { $in: brand.split(',').map((b) => new RegExp(`^${escapeRegex(b.trim())}$`, 'i')) };
      } else {
        query.brand = { $regex: `^${escapeRegex(brand.trim())}$`, $options: 'i' };
      }
    }

    // Form filter (supports comma-separated list)
    if (form && form.trim() !== '') {
      if (form.includes(',')) {
        query.form = { $in: form.split(',').map((f) => new RegExp(`^${escapeRegex(f.trim())}$`, 'i')) };
      } else {
        query.form = { $regex: `^${escapeRegex(form.trim())}$`, $options: 'i' };
      }
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock !== undefined && inStock !== '') {
      query.inStock = inStock === 'true' || inStock === true;
    }

    // Sorting options
    let sortOptions = {};
    if (sort === 'priceAsc') {
      sortOptions.price = 1;
    } else if (sort === 'priceDesc') {
      sortOptions.price = -1;
    } else if (sort === 'nameAsc') {
      sortOptions.name = 1;
    } else if (sort === 'nameDesc') {
      sortOptions.name = -1;
    } else if (sort === 'popular') {
      sortOptions.minReorderQty = -1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ========================================================
// CUSTOM FIELD DEFINITIONS (ADMIN DYNAMIC FIELDS)
// ========================================================

// @desc    Get all custom field definitions
// @route   GET /api/products/custom-fields
// @access  Public / Admin
router.get('/custom-fields', async (req, res) => {
  try {
    const fields = await CustomFieldDef.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, fields });
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add or update a custom field definition
// @route   POST /api/products/custom-fields
// @access  Private / Admin
router.post('/custom-fields', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
  try {
    const { fieldName, fieldType = 'text', isRequired = false, placeholder = '', options = [] } = req.body;
    if (!fieldName || !fieldName.trim()) {
      return res.status(400).json({ success: false, message: 'Field name is required' });
    }
    const cleanKey = fieldName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const count = await CustomFieldDef.countDocuments();
    const field = await CustomFieldDef.findOneAndUpdate(
      { fieldKey: cleanKey },
      {
        fieldKey: cleanKey,
        fieldName: fieldName.trim(),
        fieldType,
        isRequired: Boolean(isRequired),
        placeholder: placeholder ? placeholder.trim() : '',
        options: Array.isArray(options) ? options : [],
        order: count,
      },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, field });
  } catch (error) {
    console.error('Error creating custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a custom field definition
// @route   DELETE /api/products/custom-fields/:key
// @access  Private / Admin
router.delete('/custom-fields/:key', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
  try {
    await CustomFieldDef.deleteOne({ fieldKey: req.params.key });
    res.json({ success: true, message: `Field ${req.params.key} deleted successfully` });
  } catch (error) {
    console.error('Error deleting custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete ALL products from catalog (SuperAdmin / canClearDatabase permission only)
// @route   DELETE /api/products/clear-all or POST /api/products/clear-all
// @access  Private / Admin
router.all('/clear-all', protect, adminOnly, checkPermission('canClearDatabase'), async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    console.log(`[ADMIN ACTION] Cleared all products from database by ${req.user.name} (${req.user.email}). Count: ${result.deletedCount}`);
    res.json({
      success: true,
      message: `All ${result.deletedCount} products have been deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Clear all products error:', error);
    res.status(500).json({ success: false, message: 'Server error clearing products', error: error.message });
  }
});

// @route   POST /api/products/sync-batch
// @desc    High-speed chunked upsert for live catalog sync
// @access  Private / SuperAdmin Only
router.post('/sync-batch', protect, superAdminOnly, async (req, res) => {
  try {
    const { companies, products, secret, clearProducts } = req.body;
    if (secret !== 'niyansh_sync_2026') {
      return res.status(401).json({ success: false, message: 'Invalid sync secret' });
    }

    if (clearProducts) {
      await Product.deleteMany({});
      console.log('Cleared existing products for exact catalog sync');
    }

    let compCount = 0;
    if (Array.isArray(companies) && companies.length > 0) {
      try {
        const compOps = companies.map(c => {
          const compData = { ...c };
          const compId = compData._id;
          delete compData._id;
          return {
            updateOne: {
              filter: compId ? { _id: compId } : { name: c.name },
              update: { $set: { ...compData, isPublished: true, isVerified: true } },
              upsert: true
            }
          };
        });
        await Company.bulkWrite(compOps, { ordered: false });
        compCount = companies.length;
      } catch (cErr) {
        console.warn('Sync batch companies error:', cErr.message);
      }
    }

    let prodCount = 0;
    if (Array.isArray(products) && products.length > 0) {
      try {
        const prodOps = products.map(p => {
          const prodData = { ...p };
          const prodId = prodData._id;
          delete prodData._id;
          return {
            updateOne: {
              filter: prodId ? { _id: prodId } : { name: p.name, company: p.company },
              update: { $set: prodData },
              upsert: true
            }
          };
        });
        await Product.bulkWrite(prodOps, { ordered: false });
        prodCount = products.length;
      } catch (pErr) {
        console.warn('Sync batch products error:', pErr.message);
      }
    }

    const totalInDb = await Product.countDocuments();
    res.json({
      success: true,
      companiesSynced: compCount,
      productsSynced: prodCount,
      totalInDatabase: totalInDb
    });
  } catch (error) {
    console.error('Sync batch endpoint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   ALL /api/products/sync-catalog
// @desc    Synchronize full 9,560+ catalog into MongoDB
// @access  Private / Admin with canBulkImport
router.all('/sync-catalog', protect, adminOnly, checkPermission('canBulkImport'), async (req, res) => {
  try {
    let productsData = [];
    let companiesData = [];
    let errorDetails = null;

    try {
      const catalog = require('../data/catalogData');
      productsData = catalog.products || [];
      companiesData = catalog.companies || [];
    } catch (e) {
      errorDetails = {
        message: e.message,
        stack: e.stack
      };
      console.warn('Could not load catalogData.js:', e.message);
    }

    if (!productsData || productsData.length === 0) {
      let debugInfo = {};
      try { debugInfo.cwd = process.cwd(); } catch(e){}
      try { debugInfo.dirname = __dirname; } catch(e){}
      try { debugInfo.dirContents = fs.readdirSync(path.join(__dirname, '../data')); } catch(e){ debugInfo.dirErr = e.message; }
      return res.status(404).json({
        success: false,
        message: 'catalogData.js could not be loaded on server',
        loadError: errorDetails,
        debug: debugInfo
      });
    }

    let compCount = 0;
    if (companiesData && companiesData.length > 0) {
      try {
        const compOps = companiesData.map(c => ({
          updateOne: {
            filter: { name: c.name },
            update: { $set: { ...c, isPublished: true, isVerified: true } },
            upsert: true
          }
        }));
        await Company.bulkWrite(compOps, { ordered: false });
        compCount = companiesData.length;
      } catch (cErr) {
        console.warn('Sync companies notice:', cErr.message);
      }
    }

    const BATCH_SIZE = 1500;
    for (let i = 0; i < productsData.length; i += BATCH_SIZE) {
      const chunk = productsData.slice(i, i + BATCH_SIZE);
      const bulkOps = chunk.map(p => ({
        updateOne: {
          filter: { sku: p.sku },
          update: { $set: p },
          upsert: true
        }
      }));
      await Product.bulkWrite(bulkOps, { ordered: false });
    }

    const totalCount = await Product.countDocuments();
    res.json({
      success: true,
      message: `Full catalog synced: ${productsData.length} records processed. Current database total: ${totalCount} products.`,
      companiesSynced: compCount,
      totalProducts: totalCount
    });
  } catch (error) {
    console.error('Catalog sync error:', error);
    res.status(500).json({ success: false, message: 'Server error during catalog sync', error: error.message });
  }
});

// @desc    Get single product by ID or SKU
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const rawId = (req.params.id || '').trim();
    let product = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      product = await Product.findById(rawId);
    }

    // Fallback: look up by SKU or exact name
    if (!product && rawId) {
      product = await Product.findOne({
        $or: [
          { sku: rawId },
          { name: new RegExp(`^${escapeRegex(rawId)}$`, 'i') }
        ]
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products (same category, excluding current product)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: { $ne: false },
    }).limit(4);

    res.json({ success: true, product, related });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
  try {
    const {
      name,
      brand,
      company,
      category,
      subCategory,
      sku,
      price,
      mrp,
      stockQuantity,
      inStock,
      packing,
      composition,
      form,
      manufacturer,
      imageUrl,
      images,
      description,
      featured,
      isOurProduct,
      isActive,
      qualitySpecs,
      gstRate,
      purchaseGst,
      salesGst,
      hsnCode,
      rackId,
      batchNumber,
      expiryDate,
      customFields,
      scheme,
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product category is required' });
    }

    // Check duplicate product name (case-insensitive) - DUPLICATION PREVENTION (Indexed lean query)
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingName = await Product.findOne({ name: { $regex: new RegExp(`^${escapedName}$`, 'i') } }).select('_id').lean();
    if (existingName) {
      return res.status(400).json({ success: false, message: `Product "${name.trim()}" already exists in catalog. Duplicates are not allowed.` });
    }

    // Check unique SKU if provided (Indexed lean query)
    if (sku && sku.trim() !== '') {
      const existingSku = await Product.findOne({ sku: sku.trim() }).select('_id').lean();
      if (existingSku) {
        return res.status(400).json({ success: false, message: `A product with SKU "${sku.trim()}" already exists` });
      }
    }

    // Auto-ensure Company exists in Company collection so it shows up in public website directory
    const targetComp = (company && company.trim()) || 'DAXIA';
    try {
      const escapedComp = targetComp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const compExists = await Company.findOne({ name: { $regex: new RegExp(`^${escapedComp}$`, 'i') } }).select('_id').lean();
      if (!compExists) {
        await Company.create({
          name: targetComp,
          category: (category && category.trim()) || 'Pharmaceutical Formulations',
          status: 'Published',
          isVerified: true
        });
      }
    } catch (cErr) {
      console.warn('Auto-create company info:', cErr.message);
    }

    // Prepare images array
    let imagesArr = Array.isArray(images) ? images.filter((img) => img && img.trim() !== '') : [];
    let mainImage = imageUrl || (imagesArr.length > 0 ? imagesArr[0] : '');
    if (mainImage && !imagesArr.includes(mainImage)) {
      imagesArr.unshift(mainImage);
    }

    const qty = parseInt(stockQuantity, 10);
    const computedStock = !isNaN(qty) ? qty : 100;
    const computedInStock = inStock !== undefined ? Boolean(inStock) : computedStock > 0;

    const product = new Product({
      name: name.trim(),
      brand: (brand && brand.trim()) || 'Daxia Healthcare',
      company: (company && company.trim()) || 'DAXIA',
      category: category.trim(),
      subCategory: (subCategory && subCategory.trim()) || '',
      sku: (sku && sku.trim()) || '',
      price: parseFloat(price) || 0,
      mrp: parseFloat(mrp) || parseFloat(price) || 0,
      stockQuantity: computedStock,
      inStock: computedInStock,
      packing: (packing && packing.trim()) || '',
      composition: (composition && composition.trim()) || '',
      form: (form && form.trim()) || 'Tablet',
      manufacturer: (manufacturer && manufacturer.trim()) || 'Daxia Healthcare Pvt. Ltd.',
      imageUrl: mainImage,
      images: imagesArr,
      description: (description && description.trim()) || '',
      featured: Boolean(featured),
      isOurProduct: Boolean(isOurProduct),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      qualitySpecs: (qualitySpecs && qualitySpecs.trim()) || 'WHO-GMP Certified',
      gstRate: parseFloat(salesGst || gstRate) || 12,
      purchaseGst: parseFloat(purchaseGst) || 12,
      salesGst: parseFloat(salesGst || gstRate) || 12,
      hsnCode: (hsnCode && hsnCode.trim()) || '3004',
      rackId: (rackId && rackId.trim()) || '',
      batchNumber: (batchNumber && batchNumber.trim()) || '',
      expiryDate: (expiryDate && expiryDate.trim()) || '',
      customFields: Array.isArray(customFields) ? customFields : [],
      scheme: (scheme && scheme.trim()) || '',
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ success: false, message: error.message || 'Invalid product data' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check SKU collision if SKU changed (Indexed lean query)
    if (req.body.sku && req.body.sku.trim() !== '' && req.body.sku.trim() !== product.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku.trim(), _id: { $ne: product._id } }).select('_id').lean();
      if (existingSku) {
        return res.status(400).json({ success: false, message: `SKU "${req.body.sku.trim()}" is already assigned to another product` });
      }
    }

    // Check duplicate product name if changed (DUPLICATION PREVENTION - Indexed lean query)
    if (req.body.name && req.body.name.trim() !== '' && req.body.name.trim().toLowerCase() !== product.name.toLowerCase()) {
      const escapedName = req.body.name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingName = await Product.findOne({
        _id: { $ne: product._id },
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') }
      }).select('_id').lean();
      if (existingName) {
        return res.status(400).json({ success: false, message: `Another product with name "${req.body.name.trim()}" already exists` });
      }
    }

    // Auto-ensure Company exists in Company collection so it shows up in public website directory
    if (req.body.company && req.body.company.trim()) {
      const targetComp = req.body.company.trim();
      try {
        const escapedComp = targetComp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const compExists = await Company.findOne({ name: { $regex: new RegExp(`^${escapedComp}$`, 'i') } }).select('_id').lean();
        if (!compExists) {
          await Company.create({
            name: targetComp,
            category: (req.body.category && req.body.category.trim()) || 'Pharmaceutical Formulations',
            status: 'Published',
            isVerified: true
          });
        }
      } catch (cErr) {
        console.warn('Auto-create company info:', cErr.message);
      }
    }

    // Process images
    if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter((img) => img && img.trim() !== '');
      if (req.body.imageUrl && !req.body.images.includes(req.body.imageUrl)) {
        req.body.images.unshift(req.body.imageUrl);
      } else if (!req.body.imageUrl && req.body.images.length > 0) {
        req.body.imageUrl = req.body.images[0];
      }
    }

    if (req.body.stockQuantity !== undefined) {
      req.body.stockQuantity = parseInt(req.body.stockQuantity, 10) || 0;
      if (req.body.stockQuantity <= 0 && req.body.inStock === undefined) {
        req.body.inStock = false;
      }
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ success: false, message: error.message || 'Invalid product update data' });
  }
});

// @desc    Delete a product and cleanup uploaded files
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, checkPermission('canDeleteProducts'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Safely cleanup uploaded files belonging exclusively to this product
    const allImages = [...new Set([product.imageUrl, ...(product.images || [])])].filter(
      (img) => img && img.startsWith('/uploads/')
    );

    for (const imgPath of allImages) {
      const filename = path.basename(imgPath);
      const fullPath = path.join(uploadDir, filename);

      // Verify no other product uses this exact file before unlinking
      const sharedCount = await Product.countDocuments({
        _id: { $ne: product._id },
        $or: [{ imageUrl: imgPath }, { images: imgPath }],
      });

      if (sharedCount === 0 && fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (unlinkErr) {
          console.warn('Could not remove file:', fullPath, unlinkErr.message);
        }
      }
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product', error: error.message });
  }
});

// @desc    Bulk import products (from CSV or JSON)
// @route   POST /api/products/bulk
// @access  Private/Admin
router.post('/bulk', protect, adminOnly, checkPermission('canBulkImport'), async (req, res) => {
  try {
    const { products, skipDuplicates = true } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of products to import' });
    }

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const seenNamesInBatch = new Set();
    const seenSkusInBatch = new Set();

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        if (!p.name || p.name.trim() === '') {
          throw new Error(`Row ${i + 1}: Product name is required`);
        }

        const trimmedName = p.name.trim();
        const normalizedName = trimmedName.toLowerCase();
        const sku = p.sku && p.sku.trim() ? p.sku.trim() : `NP-${Date.now().toString().slice(-6)}-${i + 1}`;
        const normalizedSku = sku.toLowerCase();

        // Duplication prevention: Check against batch itself
        if (seenNamesInBatch.has(normalizedName)) {
          if (skipDuplicates) {
            skippedCount++;
            continue;
          }
        }
        if (seenSkusInBatch.has(normalizedSku)) {
          if (skipDuplicates) {
            skippedCount++;
            continue;
          }
        }

        // Duplication prevention: Check against existing MongoDB collection
        if (skipDuplicates) {
          const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const existingProduct = await Product.findOne({
            $or: [
              { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
              { sku: { $regex: new RegExp(`^${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
            ]
          });
          if (existingProduct) {
            skippedCount++;
            continue; // Skip duplicate without throwing an error
          }
        }

        seenNamesInBatch.add(normalizedName);
        seenSkusInBatch.add(normalizedSku);

        const assignedCompany = (p.company && p.company.trim()) || 'Daxia Healthcare';

        // Auto-ensure Company exists in Company collection so it shows up on public website
        try {
          const escapedComp = assignedCompany.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const compExists = await Company.findOne({ name: { $regex: new RegExp(`^${escapedComp}$`, 'i') } });
          if (!compExists) {
            const initials = assignedCompany.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'PH';
            const newComp = new Company({
              name: assignedCompany,
              category: p.category || 'Pharmaceutical Formulations',
              location: 'Gujarat, India',
              isPartner: true,
              isPublished: true,
              logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0c3d6c&color=ffffff&bold=true&size=128`,
              description: `Authorized pharmaceutical manufacturer for ${assignedCompany} formulations.`
            });
            await newComp.save();
          }
        } catch (cErr) {
          console.warn('Auto-create company info in bulk import:', cErr.message);
        }

        const images = Array.isArray(p.images) ? p.images : p.imageUrl ? [p.imageUrl] : [];
        const mainImage = p.imageUrl || (images.length > 0 ? images[0] : '');
        const salesGstVal = parseFloat(p.salesGst) || parseFloat(p.gstRate) || 12;

        const productData = {
          name: trimmedName,
          brand: (p.brand && p.brand.trim()) || trimmedName,
          company: assignedCompany,
          category: (p.category && p.category.trim()) || 'Pharma Products',
          subCategory: (p.subCategory && p.subCategory.trim()) || '',
          sku,
          price: parseFloat(p.price) || 0,
          mrp: parseFloat(p.mrp) || parseFloat(p.price) || 0,
          stockQuantity: parseInt(p.stockQuantity, 10) || 100,
          inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
          packing: (p.packing && p.packing.trim()) || '10 x 10 Tablets',
          composition: (p.composition && p.composition.trim()) || '',
          form: (p.form && p.form.trim()) || 'Tablet',
          manufacturer: (p.manufacturer && p.manufacturer.trim()) || assignedCompany,
          rackId: (p.rackId && p.rackId.trim()) || '',
          batchNumber: (p.batchNumber && p.batchNumber.trim()) || (p.batchNo && p.batchNo.trim()) || '',
          hsnCode: (p.hsnCode && p.hsnCode.trim()) || '3004',
          purchaseGst: parseFloat(p.purchaseGst) || 12,
          salesGst: salesGstVal,
          gstRate: salesGstVal,
          expiryDate: (p.expiryDate && p.expiryDate.trim()) || '',
          imageUrl: mainImage,
          images,
          description: (p.description && p.description.trim()) || '',
          featured: Boolean(p.featured),
          isOurProduct: Boolean(p.isOurProduct),
          isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
        };

        // If product with matching SKU exists and not skipping, update; otherwise insert
        await Product.findOneAndUpdate({ sku }, { $set: productData }, { upsert: true, new: true });
        successCount++;
      } catch (rowErr) {
        errorCount++;
        errors.push({ row: i + 1, error: rowErr.message });
      }
    }

    res.json({
      success: true,
      message: `Bulk import completed: ${successCount} products imported, ${skippedCount} duplicates skipped.`,
      successCount,
      skippedCount,
      errorCount,
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, message: 'Server error during bulk import', error: error.message });
  }
});

module.exports = router;

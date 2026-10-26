const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

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
        Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
        Product.countDocuments(query),
        Product.countDocuments(),
        Product.countDocuments({ isActive: { $ne: false } }),
        Product.countDocuments({ $or: [{ inStock: false }, { stockQuantity: { $lte: 0 } }] }),
        Product.distinct('category'),
        Product.countDocuments({ featured: true }),
        Product.find().sort({ createdAt: -1 }).limit(5),
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

// @desc    Upload multiple product photos
// @route   POST /api/products/upload
// @access  Private/Admin
router.post('/upload', protect, adminOnly, (req, res) => {
  upload.array('photos', 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }

    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ success: true, urls, count: urls.length });
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
      .limit(limitNum);

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

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
router.post('/', protect, adminOnly, async (req, res) => {
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
      isActive,
      qualitySpecs,
      gstRate,
      scheme,
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product category is required' });
    }

    // Check unique SKU if provided
    if (sku && sku.trim() !== '') {
      const existingSku = await Product.findOne({ sku: sku.trim() });
      if (existingSku) {
        return res.status(400).json({ success: false, message: `A product with SKU "${sku.trim()}" already exists` });
      }
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
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      qualitySpecs: (qualitySpecs && qualitySpecs.trim()) || 'WHO-GMP Certified',
      gstRate: parseFloat(gstRate) || 12,
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
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check SKU collision if SKU changed
    if (req.body.sku && req.body.sku.trim() !== '' && req.body.sku.trim() !== product.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku.trim(), _id: { $ne: product._id } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: `SKU "${req.body.sku.trim()}" is already assigned to another product` });
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
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
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
router.post('/bulk', protect, adminOnly, async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of products to import' });
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        if (!p.name || p.name.trim() === '') {
          throw new Error(`Row ${i + 1}: Product name is required`);
        }

        const sku = p.sku && p.sku.trim() ? p.sku.trim() : `NP-${Date.now()}-${i}`;
        const images = Array.isArray(p.images) ? p.images : p.imageUrl ? [p.imageUrl] : [];
        const mainImage = p.imageUrl || (images.length > 0 ? images[0] : '');

        const productData = {
          name: p.name.trim(),
          brand: (p.brand && p.brand.trim()) || 'Daxia Healthcare',
          company: (p.company && p.company.trim()) || 'DAXIA',
          category: (p.category && p.category.trim()) || 'Pharma Products',
          subCategory: (p.subCategory && p.subCategory.trim()) || '',
          sku,
          price: parseFloat(p.price) || 0,
          mrp: parseFloat(p.mrp) || parseFloat(p.price) || 0,
          stockQuantity: parseInt(p.stockQuantity, 10) || 100,
          inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
          packing: (p.packing && p.packing.trim()) || '',
          composition: (p.composition && p.composition.trim()) || '',
          form: (p.form && p.form.trim()) || 'Tablet',
          manufacturer: (p.manufacturer && p.manufacturer.trim()) || 'Daxia Healthcare Pvt. Ltd.',
          imageUrl: mainImage,
          images,
          description: (p.description && p.description.trim()) || '',
          featured: Boolean(p.featured),
          isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
        };

        // If product with matching SKU exists, update it; otherwise insert
        await Product.findOneAndUpdate({ sku }, { $set: productData }, { upsert: true, new: true });
        successCount++;
      } catch (rowErr) {
        errorCount++;
        errors.push({ row: i + 1, error: rowErr.message });
      }
    }

    res.json({
      success: true,
      message: `Bulk import completed: ${successCount} products imported successfully`,
      successCount,
      errorCount,
      errors: errors.slice(0, 10), // return first 10 errors if any
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, message: 'Server error during bulk import', error: error.message });
  }
});

module.exports = router;

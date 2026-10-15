const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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
    const [companiesRaw, formsRaw, categoriesRaw] = await Promise.all([
      Product.distinct('company'),
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
    const forms = cleanList(formsRaw);
    const categories = cleanList(categoriesRaw);

    res.json({
      success: true,
      companies,
      forms,
      categories,
    });
  } catch (error) {
    console.error('Filter meta error:', error);
    res.status(500).json({ message: 'Server error fetching filter options', error: error.message });
  }
});

// @desc    Get all products with filtering, search, sorting and pagination
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
    } = req.query;

    const query = {};

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get related products (same category, excluding current product)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({ success: true, product, related });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Public
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: 'Invalid product data or update error', error: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Get all products with filtering, search, sorting and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, brand, form, inStock, sort, page = 1, limit = 12, maxPrice } = req.query;
    
    const query = {};

    // Text search or regex search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { composition: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter (supports comma-separated list)
    if (category) {
      if (category.includes(',')) {
        query.category = { $in: category.split(',') };
      } else {
        query.category = category;
      }
    }

    // Brand filter (supports comma-separated list)
    if (brand) {
      if (brand.includes(',')) {
        query.brand = { $in: brand.split(',') };
      } else {
        query.brand = brand;
      }
    }

    // Form filter (supports comma-separated list)
    if (form) {
      if (form.includes(',')) {
        query.form = { $in: form.split(',') };
      } else {
        query.form = form;
      }
    }

    // Price filter
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    // Stock filter
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'priceAsc') {
      sortOptions.price = 1;
    } else if (sort === 'priceDesc') {
      sortOptions.price = -1;
    } else if (sort === 'nameAsc') {
      sortOptions.name = 1;
    } else if (sort === 'nameDesc') {
      sortOptions.name = -1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
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

    res.json({ product, related });
  } catch (error) {
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
    res.status(201).json(createdProduct);
  } catch (error) {
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
    res.json(updatedProduct);
  } catch (error) {
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
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

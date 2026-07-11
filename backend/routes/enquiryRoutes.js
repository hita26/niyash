const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// @desc    Submit a new enquiry (general message, partner, supplier, or quote cart)
// @route   POST /api/enquiries
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { type, name, phone, email, address, message, items } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone number are required' });
    }

    const enquiryData = {
      type,
      name,
      phone,
      email,
      address,
      message,
    };

    // If type is Cart Quote, we expect an array of items [{ product: id, quantity: number }]
    if (type === 'Cart Quote') {
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Quote items are required for Cart Quote' });
      }
      enquiryData.items = items;
    }

    const enquiry = new Enquiry(enquiryData);
    const createdEnquiry = await enquiry.save();
    
    // We populate the products in the response for verification
    const populatedEnquiry = await Enquiry.findById(createdEnquiry._id).populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiry: populatedEnquiry,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get all enquiries (admin dashboard view)
// @route   GET /api/enquiries
// @access  Public (simplified, can be authenticated in production)
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

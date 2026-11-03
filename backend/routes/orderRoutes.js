const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Helper to escape special regex characters
const escapeRegex = (str) => {
  if (!str) return '';
  return str.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper to generate WhatsApp B2B order text payload
const generateWhatsAppOrderMessage = (order) => {
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedItems = order.items
    .map((item, idx) => {
      const companyStr = item.company ? ` (${item.company})` : '';
      const unitPriceStr = item.unitPrice ? `₹${item.unitPrice.toFixed(2)}` : '₹0.00';
      const itemTotalStr = item.itemTotal ? `₹${item.itemTotal.toFixed(2)}` : '₹0.00';
      return `${idx + 1}. *${item.productName}*${companyStr}\n   • Qty: ${item.boxes} Box${item.boxes > 1 ? 'es' : ''} (${item.totalUnits} Units)\n   • Rate: ${unitPriceStr} | Total: ${itemTotalStr}`;
    })
    .join('\n\n');

  const gstinLine = order.gstin ? `\n*GSTIN:* ${order.gstin}` : '';
  const discountLine =
    order.discountAmount && order.discountAmount > 0
      ? `\n*Scheme Discount:* -₹${order.discountAmount.toFixed(2)}`
      : '';

  const msg = `📦 *NEW B2B ORDER - NIYANSH PHARMA*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${order.orderNumber}
*Store Name:* ${order.shopName}
*Retailer Mobile:* ${order.retailerMobile}${gstinLine}
*Order Date:* ${dateStr}

*ORDERED ITEMS:*
${formattedItems}

━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ₹${order.subTotal.toFixed(2)}
*GST Amount:* ₹${order.gstAmount.toFixed(2)}${discountLine}
*Grand Total:* ₹${order.grandTotal.toFixed(2)}
*Payment Status:* ${order.paymentStatus || 'Pending'}
*Order Status:* ${order.orderStatus || 'Booked'}
━━━━━━━━━━━━━━━━━━━━
_Niyansh Pharma B2B Ordering Portal_
_Support: +91 9316566894_`;

  return msg;
};

// Helper to build WhatsApp direct link
const buildWhatsAppUrl = (destinationWhatsApp, message) => {
  const cleanPhone = (destinationWhatsApp || '9316566894')
    .toString()
    .replace(/\D/g, '')
    .replace(/^91/, '');
  const targetPhone = '91' + (cleanPhone || '9316566894');
  return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`;
};

// @desc    Create a new B2B Order & generate WhatsApp dispatch payload
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      shopName,
      retailerMobile,
      retailerEmail,
      gstin,
      destinationWhatsApp = '9316566894',
      items,
      discountAmount = 0,
      paymentStatus = 'Pending',
      orderStatus = 'Booked',
    } = req.body;

    if (!shopName || !retailerMobile) {
      return res.status(400).json({ message: 'Shop name and retailer mobile are required' });
    }

    const cleanMobile = retailerMobile.toString().replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      return res.status(400).json({ message: 'Retailer mobile number must contain exactly 10 numeric digits' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Process and calculate items
    let calculatedSubTotal = 0;
    let calculatedGstAmount = 0;

    const processedItems = items.map((item) => {
      const boxes = Math.max(1, parseInt(item.boxes, 10) || 1);
      const unitsPerBox = Math.max(1, parseInt(item.unitsPerBox, 10) || 10);
      const totalUnits = item.totalUnits ? parseInt(item.totalUnits, 10) : boxes * unitsPerBox;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const gstRate = item.gstRate !== undefined ? parseFloat(item.gstRate) : 12;

      // itemTotal can be supplied or computed as totalUnits * unitPrice (or boxes * unitPrice if unitPrice is per box)
      let itemTotal = 0;
      if (item.itemTotal !== undefined && !isNaN(parseFloat(item.itemTotal))) {
        itemTotal = parseFloat(item.itemTotal);
      } else {
        itemTotal = Math.round(totalUnits * unitPrice * 100) / 100;
      }

      const itemGst = Math.round(((itemTotal * gstRate) / 100) * 100) / 100;

      calculatedSubTotal += itemTotal;
      calculatedGstAmount += itemGst;

      return {
        product: item.product || null,
        productName: item.productName || 'Pharma Product',
        company: item.company || 'DAXIA',
        form: item.form || 'Tablet',
        boxes,
        unitsPerBox,
        totalUnits,
        unitPrice,
        gstRate,
        itemTotal,
      };
    });

    const finalDiscount = parseFloat(discountAmount) || 0;
    const finalSubTotal = Math.round(calculatedSubTotal * 100) / 100;
    const finalGstAmount = Math.round(calculatedGstAmount * 100) / 100;
    const finalGrandTotal = Math.max(
      0,
      Math.round((finalSubTotal + finalGstAmount - finalDiscount) * 100) / 100
    );

    const generatedOrderNumber =
      req.body.orderNumber ||
      `NP-ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = new Order({
      orderNumber: generatedOrderNumber,
      shopName,
      retailerMobile: cleanMobile,
      retailerEmail: retailerEmail ? retailerEmail.trim() : '',
      gstin: gstin ? gstin.trim() : '',
      destinationWhatsApp: destinationWhatsApp.trim(),
      items: processedItems,
      subTotal: finalSubTotal,
      gstAmount: finalGstAmount,
      discountAmount: finalDiscount,
      grandTotal: finalGrandTotal,
      paymentStatus,
      orderStatus,
    });

    const createdOrder = await order.save();

    const whatsappMessage = generateWhatsAppOrderMessage(createdOrder);
    const whatsappUrl = buildWhatsAppUrl(destinationWhatsApp, whatsappMessage);

    res.status(201).json({
      success: true,
      order: createdOrder,
      whatsappMessage,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// @desc    Get all orders with optional filtering by retailerMobile and sorting
// @route   GET /api/orders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      retailerMobile,
      orderStatus,
      paymentStatus,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (retailerMobile && retailerMobile.trim()) {
      const rawMobile = retailerMobile.trim();
      const cleanDigits = rawMobile.replace(/\D/g, '').replace(/^91/, '').slice(-10);
      query.$or = [
        { retailerMobile: rawMobile },
        { retailerMobile: cleanDigits }
      ];
    }

    if (orderStatus && orderStatus !== 'All') {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    if (search && search.trim()) {
      const escaped = escapeRegex(search.trim());
      const searchOr = [
        { orderNumber: { $regex: escaped, $options: 'i' } },
        { shopName: { $regex: escaped, $options: 'i' } },
        { retailerMobile: { $regex: escaped, $options: 'i' } },
        { 'items.productName': { $regex: escaped, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }


    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('items.product', 'name brand company price imageUrl');

    res.json({
      success: true,
      orders,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name brand company price imageUrl'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const whatsappMessage = generateWhatsAppOrderMessage(order);
    const whatsappUrl = buildWhatsAppUrl(order.destinationWhatsApp, whatsappMessage);

    res.json({
      success: true,
      order,
      whatsappMessage,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({ message: 'Server error fetching order', error: error.message });
  }
});

// @desc    Update order status (Booked, Confirmed, Dispatched, Delivered)
// @route   PUT /api/orders/:id/status
// @access  Public
router.put('/:id/status', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = ['Booked', 'Confirmed', 'Dispatched', 'Delivered'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid order status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['Pending', 'Partially Paid', 'Paid'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          message: `Invalid payment status. Allowed values: ${validPaymentStatuses.join(', ')}`,
        });
      }
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order status', error: error.message });
  }
});

module.exports = router;

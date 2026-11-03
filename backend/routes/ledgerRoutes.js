const express = require('express');
const router = express.Router();
const Ledger = require('../models/Ledger');

// Helper to escape special regex characters
const escapeRegex = (str) => {
  if (!str) return '';
  return str.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper to normalize phone numbers to standard 10-digit format
const cleanMobileDigits = (num) => {
  if (!num) return '';
  return num.toString().replace(/\D/g, '').replace(/^91/, '').slice(-10);
};

// Helper to find ledger matching raw or normalized 10-digit mobile
const findLedgerByMobile = async (mobileInput) => {
  const raw = (mobileInput || '').toString().trim();
  const clean = cleanMobileDigits(raw);
  return await Ledger.findOne({
    $or: [
      { retailerMobile: raw },
      { retailerMobile: clean },
    ],
  });
};

// Helper to format currency in Indian format
const formatINR = (val) => {
  const num = Number(val) || 0;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper to build statement string and WhatsApp link
const buildStatementText = (ledger) => {
  const statementDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const now = new Date();
  const overdueInvoices = (ledger.invoices || []).filter(
    (inv) =>
      inv.balance > 0 &&
      (inv.status === 'Overdue' || (inv.dueDate && new Date(inv.dueDate) < now))
  );

  let overdueWarning = '';
  if (overdueInvoices.length > 0) {
    const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
    overdueWarning = `\n\n⚠️ *OVERDUE NOTICE:* You have ${overdueInvoices.length} overdue invoice(s) totaling ₹${formatINR(overdueTotal)}. Kindly clear dues to prevent supply hold.`;
  }

  const recentInvoices = (ledger.invoices || [])
    .slice(-3)
    .map(
      (inv) =>
        `• *${inv.invoiceNumber}*: ₹${formatINR(inv.amount)} | Balance: ₹${formatINR(inv.balance)} [${inv.status}]`
    )
    .join('\n');

  const upiLink = `upi://pay?pa=9316566894@okbizaxis&pn=Niyansh%20Pharma&am=${ledger.outstandingBalance || 0}&cu=INR&tn=Ledger%20Settlement`;

  const text = `📊 *STATEMENT OF ACCOUNT - NIYANSH PHARMA*
━━━━━━━━━━━━━━━━━━━━
*Retailer:* ${ledger.shopName}
*Mobile:* ${ledger.retailerMobile}${ledger.gstin ? `\n*GSTIN:* ${ledger.gstin}` : ''}
*Statement Date:* ${statementDate}

*ACCOUNT SUMMARY:*
• Total Invoices: ${(ledger.invoices || []).length} (₹${formatINR(ledger.totalBilled)})
• Total Paid: ₹${formatINR(ledger.totalPaid)}
• *Outstanding Balance: ₹${formatINR(ledger.outstandingBalance)}*
• Credit Limit: ₹${formatINR(ledger.creditLimit)}
• Available Credit: ₹${formatINR(Math.max(0, (ledger.creditLimit || 100000) - (ledger.outstandingBalance || 0)))}${overdueWarning}

*RECENT INVOICES:*
${recentInvoices || '• No invoices recorded'}

*INSTANT PAYMENT VIA UPI:*
UPI ID: 9316566894@okbizaxis
Pay Link: ${upiLink}
━━━━━━━━━━━━━━━━━━━━
_Niyansh Pharma Wholesale & Distribution_
_Support / Accounts: +91 9316566894_`;

  return text;
};

// Helper for WhatsApp link
const buildWhatsAppUrl = (mobile, message) => {
  const cleanPhone = cleanMobileDigits(mobile) || '9316566894';
  const targetPhone = '91' + cleanPhone;
  return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`;
};

// @desc    Get all retailer ledgers (for Admin dashboard)
// @route   GET /api/ledger
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'updatedAt', order = 'desc', page = 1, limit = 50 } = req.query;

    const query = {};
    if (search && search.trim()) {
      const escaped = escapeRegex(search.trim());
      query.$or = [
        { shopName: { $regex: escaped, $options: 'i' } },
        { retailerMobile: { $regex: escaped, $options: 'i' } },
        { gstin: { $regex: escaped, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Ledger.countDocuments(query);
    const ledgers = await Ledger.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      ledgers,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    console.error('Get all ledgers error:', error);
    res.status(500).json({ message: 'Server error fetching ledgers', error: error.message });
  }
});

// @desc    Record payment transaction and deduct from oldest unpaid/partial invoices
// @route   POST /api/ledger/payment
// @access  Public
router.post('/payment', async (req, res) => {
  try {
    const {
      retailerMobile,
      mobile,
      paymentId,
      amount,
      method = 'UPI',
      transactionRef = '',
      notes = '',
      date,
    } = req.body;

    const targetMobile = (retailerMobile || mobile || '').toString().replace(/\D/g, '');
    if (!targetMobile || targetMobile.length !== 10) {
      return res.status(400).json({ message: 'Retailer mobile number must contain exactly 10 numeric digits' });
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ message: 'Valid positive payment amount is required' });
    }

    let ledger = await findLedgerByMobile(targetMobile);
    if (!ledger) {
      return res.status(404).json({ message: `Ledger not found for retailer mobile: ${targetMobile}` });
    }

    const newPaymentId =
      paymentId || `PMT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newPayment = {
      paymentId: newPaymentId,
      date: date ? new Date(date) : new Date(),
      amount: payAmount,
      method,
      transactionRef,
      notes,
    };

    // FIFO Invoice Deduction: Sort unpaid invoices by date ascending
    ledger.invoices.sort((a, b) => new Date(a.date) - new Date(b.date));

    let remainingPayment = payAmount;
    for (const inv of ledger.invoices) {
      if (inv.balance > 0 && remainingPayment > 0) {
        const unpaid = inv.balance;
        if (remainingPayment >= unpaid) {
          inv.paidAmount = Math.round(((inv.paidAmount || 0) + unpaid) * 100) / 100;
          inv.balance = 0;
          inv.status = 'Paid';
          remainingPayment = Math.round((remainingPayment - unpaid) * 100) / 100;
        } else {
          inv.paidAmount = Math.round(((inv.paidAmount || 0) + remainingPayment) * 100) / 100;
          inv.balance = Math.round((inv.balance - remainingPayment) * 100) / 100;
          inv.status = 'Partial';
          remainingPayment = 0;
          break;
        }
      }
    }

    // Update totals
    ledger.totalPaid = Math.round(((ledger.totalPaid || 0) + payAmount) * 100) / 100;

    // Recalculate outstanding balance from invoices if invoices exist, else deduct from balance
    if (ledger.invoices && ledger.invoices.length > 0) {
      const sumInvoiceBalances = ledger.invoices.reduce(
        (acc, inv) => acc + (inv.balance || 0),
        0
      );
      ledger.outstandingBalance = Math.round(sumInvoiceBalances * 100) / 100;
    } else {
      ledger.outstandingBalance = Math.max(0, Math.round(((ledger.outstandingBalance || 0) - payAmount) * 100) / 100);
    }

    ledger.payments.push(newPayment);
    const updatedLedger = await ledger.save();

    res.json({
      success: true,
      message: 'Payment recorded and applied successfully',
      receipt: {
        paymentId: newPayment.paymentId,
        amount: newPayment.amount,
        method: newPayment.method,
        transactionRef: newPayment.transactionRef,
        date: newPayment.date,
        remainingBalance: updatedLedger.outstandingBalance,
        retailerMobile: updatedLedger.retailerMobile,
        shopName: updatedLedger.shopName,
      },
      ledger: updatedLedger,
    });
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({ message: 'Server error recording payment', error: error.message });
  }
});

// @desc    Generate and send formatted ledger statement via WhatsApp/Email
// @route   POST /api/ledger/send-statement
// @access  Public
router.post('/send-statement', async (req, res) => {
  try {
    const { retailerMobile, mobile, channel = 'whatsapp' } = req.body;

    const targetMobile = (retailerMobile || mobile || '').toString().replace(/\D/g, '');
    if (!targetMobile || targetMobile.length !== 10) {
      return res.status(400).json({ message: 'Retailer mobile number must contain exactly 10 numeric digits' });
    }

    const ledger = await findLedgerByMobile(targetMobile);
    if (!ledger) {
      return res.status(404).json({ message: `Ledger not found for retailer mobile: ${targetMobile}` });
    }

    const statementText = buildStatementText(ledger);
    const whatsappUrl = buildWhatsAppUrl(ledger.retailerMobile, statementText);

    res.json({
      success: true,
      channel,
      statementText,
      whatsappUrl,
      retailer: {
        shopName: ledger.shopName,
        retailerMobile: ledger.retailerMobile,
        outstandingBalance: ledger.outstandingBalance,
        totalBilled: ledger.totalBilled,
        totalPaid: ledger.totalPaid,
      },
    });
  } catch (error) {
    console.error('Send statement error:', error);
    res.status(500).json({ message: 'Server error generating statement', error: error.message });
  }
});

// @desc    Get retailer ledger by mobile number (creates initial if not found)
// @route   GET /api/ledger/:mobile
// @access  Public
router.get('/:mobile', async (req, res) => {
  try {
    const rawMobile = req.params.mobile.trim();
    const cleanMobile = rawMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      return res.status(400).json({ message: 'Retailer mobile number must contain exactly 10 numeric digits' });
    }

    let ledger = await findLedgerByMobile(rawMobile);

    if (!ledger) {
      // If mobile matches standard demo accounts, provide rich fixtures
      if (cleanMobile === '9825012345') {
        ledger = new Ledger({
          retailerMobile: '9825012345',
          shopName: 'Shanti Medico',
          email: 'shanti.medico@gmail.com',
          gstin: '24AAACS1234F1Z5',
          totalBilled: 145200,
          totalPaid: 98000,
          outstandingBalance: 47200,
          creditLimit: 150000,
          invoices: [
            {
              invoiceNumber: 'INV-2026-0801',
              date: new Date('2026-07-15'),
              dueDate: new Date('2026-08-05'),
              amount: 32000,
              paidAmount: 32000,
              balance: 0,
              status: 'Paid',
            },
            {
              invoiceNumber: 'INV-2026-0824',
              date: new Date('2026-07-28'),
              dueDate: new Date('2026-08-18'),
              amount: 66000,
              paidAmount: 66000,
              balance: 0,
              status: 'Paid',
            },
            {
              invoiceNumber: 'INV-2026-0872',
              date: new Date('2026-08-05'),
              dueDate: new Date('2026-08-26'),
              amount: 28500,
              paidAmount: 0,
              balance: 28500,
              status: 'Pending',
            },
            {
              invoiceNumber: 'INV-2026-0899',
              date: new Date('2026-08-14'),
              dueDate: new Date('2026-09-04'),
              amount: 18700,
              paidAmount: 0,
              balance: 18700,
              status: 'Pending',
            },
          ],
          payments: [
            {
              paymentId: 'PMT-1001',
              date: new Date('2026-07-25T14:30:00Z'),
              amount: 32000,
              method: 'UPI',
              transactionRef: 'UPI/260725183921',
              notes: 'Cleared against INV-2026-0801',
            },
            {
              paymentId: 'PMT-1002',
              date: new Date('2026-08-10T11:15:00Z'),
              amount: 66000,
              method: 'NetBanking',
              transactionRef: 'NEFT/HDFC26081029',
              notes: 'Full payment INV-2026-0824',
            },
          ],
        });
      } else {
        // Auto-create initial ledger for this retailer
        const shopName = req.query.shopName || `Retailer ${cleanMobile}`;
        const email = req.query.email || '';
        const gstin = req.query.gstin || '';
        const creditLimit = parseFloat(req.query.creditLimit) || 100000;

        ledger = new Ledger({
          retailerMobile: cleanMobile,
          shopName,
          email,
          gstin,
          totalBilled: 0,
          totalPaid: 0,
          outstandingBalance: 0,
          creditLimit,
          invoices: [],
          payments: [],
        });
      }

      await ledger.save();
    }

    // Sort invoices and payments by date descending for UI clarity
    const sortedInvoices = [...(ledger.invoices || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const sortedPayments = [...(ledger.payments || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json({
      success: true,
      ledger: {
        ...ledger.toObject(),
        invoices: sortedInvoices,
        payments: sortedPayments,
      },
    });
  } catch (error) {
    console.error('Get ledger by mobile error:', error);
    res.status(500).json({ message: 'Server error fetching retailer ledger', error: error.message });
  }
});

module.exports = router;

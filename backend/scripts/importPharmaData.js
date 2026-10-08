const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');
const Ledger = require('../models/Ledger');
const Order = require('../models/Order');

// Load environment variables (from backend/.env or root .env if present)
dotenv.config();

const DATA_JSON_PATH = path.join(__dirname, 'extractedData.json');

async function importData() {
  try {
    if (!fs.existsSync(DATA_JSON_PATH)) {
      console.error(`Error: Extracted data file not found at ${DATA_JSON_PATH}`);
      console.error(`Please run: python3 backend/scripts/extractMdbData.py first.`);
      process.exit(1);
    }

    console.log(`Connecting to database...`);
    await connectDB();

    console.log(`Reading extracted data from ${DATA_JSON_PATH}...`);
    const rawData = fs.readFileSync(DATA_JSON_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`\n=== Source Data Summary ===`);
    console.log(`Extracted At: ${data.metadata.extractedAt}`);
    console.log(`Products in source: ${data.products.length}`);
    console.log(`Customer Accounts: ${data.accounts.length}`);
    console.log(`Sales Orders: ${data.orders.length}`);

    // Pre-import counts
    const prevProductCount = await Product.countDocuments();
    const prevUserCount = await User.countDocuments();
    const prevLedgerCount = await Ledger.countDocuments();
    const prevOrderCount = await Order.countDocuments();

    console.log(`\n=== Existing Database State ===`);
    console.log(`Products: ${prevProductCount}`);
    console.log(`Users:    ${prevUserCount}`);
    console.log(`Ledgers:  ${prevLedgerCount}`);
    console.log(`Orders:   ${prevOrderCount}`);

    // 1. Batch Upsert Products
    console.log(`\n--- 1. Importing Products ---`);
    const BATCH_SIZE = 1000;
    let productUpsertCount = 0;

    for (let i = 0; i < data.products.length; i += BATCH_SIZE) {
      const chunk = data.products.slice(i, i + BATCH_SIZE);
      const ops = chunk.map((p) => ({
        updateOne: {
          filter: { sku: p.sku },
          update: {
            $set: {
              name: p.name,
              brand: p.brand || 'DAXIA',
              company: p.company || 'DAXIA',
              category: p.category,
              sku: p.sku,
              price: p.price,
              mrp: p.mrp,
              gstRate: p.gstRate,
              minReorderQty: p.minReorderQty,
              unitsPerBox: p.unitsPerBox,
              qualitySpecs: p.qualitySpecs,
              scheme: p.scheme,
              inStock: p.inStock,
              packing: p.packing,
              composition: p.composition,
              form: p.form,
              manufacturer: p.manufacturer,
              description: p.description,
            },
          },
          upsert: true,
        },
      }));

      const res = await Product.bulkWrite(ops, { ordered: false });
      productUpsertCount += (res.upsertedCount || 0) + (res.modifiedCount || 0);
      console.log(`  Processed ${Math.min(i + BATCH_SIZE, data.products.length)} / ${data.products.length} products...`);
    }

    // Build product lookup map (sku -> full product info) for orders
    const allDbProducts = await Product.find({}, '_id sku name company form').lean();
    const productSkuMap = new Map(allDbProducts.map((p) => [p.sku, p]));

    // 2. Upsert Users & Ledgers
    console.log(`\n--- 2. Importing Customers (Users & Ledgers) ---`);
    let usersImported = 0;
    let ledgersImported = 0;

    for (const acc of data.accounts) {
      // Upsert User
      const userDoc = {
        name: acc.name || acc.shopName,
        email: acc.email.toLowerCase(),
        companyName: acc.shopName,
        gstin: acc.gstin || '',
        drugLicense: acc.drugLicense || '',
        phone: acc.mobile,
        role: 'user',
      };

      const existingUser = await User.findOne({ email: userDoc.email });
      if (!existingUser) {
        userDoc.password = 'Niyansh@2026'; // Pre-save hook will hash this cleanly
        await User.create(userDoc);
        usersImported++;
      } else {
        await User.updateOne({ email: userDoc.email }, { $set: userDoc });
        usersImported++;
      }

      // Upsert Ledger
      const ledgerDoc = {
        retailerMobile: acc.mobile,
        shopName: acc.shopName,
        email: acc.email,
        gstin: acc.gstin,
        totalBilled: acc.totalBilled || 0,
        totalPaid: acc.totalPaid || 0,
        outstandingBalance: acc.outstandingBalance || 0,
        creditLimit: acc.creditLimit || 100000,
        invoices: acc.invoices.map((inv) => ({
          invoiceNumber: inv.invoiceNumber,
          date: new Date(inv.date),
          amount: inv.amount,
          paidAmount: inv.paidAmount,
          balance: inv.balance,
          status: inv.status,
        })),
        payments: acc.payments.map((pmt) => ({
          paymentId: pmt.paymentId,
          date: new Date(pmt.date),
          amount: pmt.amount,
          method: pmt.method,
          transactionRef: pmt.transactionRef,
          notes: pmt.notes,
        })),
      };

      await Ledger.findOneAndUpdate(
        { retailerMobile: acc.mobile },
        { $set: ledgerDoc },
        { upsert: true, new: true }
      );
      ledgersImported++;
    }

    // 3. Upsert Sales Orders
    console.log(`\n--- 3. Importing Sales Orders ---`);
    let ordersImported = 0;

    for (const ord of data.orders) {
      const orderItems = ord.items.map((item) => {
        const pSku = `NP-${item.productCode}`;
        const pDoc = productSkuMap.get(pSku);
        return {
          product: pDoc ? pDoc._id : undefined,
          productName: pDoc ? pDoc.name : `Product NP-${item.productCode}`,
          company: pDoc ? pDoc.company : 'Prompt / Niyansh',
          form: pDoc ? pDoc.form : 'Tablet',
          boxes: item.boxes,
          unitsPerBox: item.unitsPerBox,
          totalUnits: item.totalUnits,
          unitPrice: item.unitPrice,
          gstRate: item.gstRate,
          itemTotal: item.itemTotal,
        };
      });

      const orderDoc = {
        orderNumber: ord.orderNumber,
        shopName: ord.shopName,
        retailerMobile: ord.retailerMobile,
        destinationWhatsApp: '9316566894',
        items: orderItems,
        subTotal: ord.subTotal,
        gstAmount: ord.gstAmount,
        discountAmount: 0,
        grandTotal: ord.grandTotal,
        paymentStatus: 'Pending',
        orderStatus: 'Delivered',
        createdAt: new Date(ord.orderDate),
      };

      await Order.findOneAndUpdate(
        { orderNumber: ord.orderNumber },
        { $set: orderDoc },
        { upsert: true, new: true }
      );
      ordersImported++;
    }

    // Post-import verification
    const newProductCount = await Product.countDocuments();
    const newUserCount = await User.countDocuments();
    const newLedgerCount = await Ledger.countDocuments();
    const newOrderCount = await Order.countDocuments();

    console.log(`\n========================================`);
    console.log(`       IMPORT COMPLETED SUCCESSFULLY     `);
    console.log(`========================================`);
    console.log(`Metric           | Before | After | Added/Updated`);
    console.log(`-----------------+--------+-------+--------------`);
    console.log(`Products         | ${String(prevProductCount).padStart(6)} | ${String(newProductCount).padStart(5)} | +${newProductCount - prevProductCount}`);
    console.log(`Users (Chemists) | ${String(prevUserCount).padStart(6)} | ${String(newUserCount).padStart(5)} | +${newUserCount - prevUserCount}`);
    console.log(`Ledgers          | ${String(prevLedgerCount).padStart(6)} | ${String(newLedgerCount).padStart(5)} | +${newLedgerCount - prevLedgerCount}`);
    console.log(`Orders           | ${String(prevOrderCount).padStart(6)} | ${String(newOrderCount).padStart(5)} | +${newOrderCount - prevOrderCount}`);
    console.log(`========================================`);

    // Disconnect
    await mongoose.disconnect();
    console.log(`Database connection closed cleanly.`);
  } catch (err) {
    console.error(`Migration error:`, err);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  importData();
}

module.exports = importData;

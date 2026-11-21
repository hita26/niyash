/**
 * Script: clearAllProducts.js
 * Purpose: Delete ALL products from MongoDB (niyanshPharma DB)
 * Usage: node scripts/clearAllProducts.js
 */

const mongoose = require('mongoose');
const path = require('path');

// Load .env from parent directory if exists
try { require('dotenv').config({ path: path.join(__dirname, '../../.env') }); } catch(e){}
try { require('dotenv').config({ path: path.join(__dirname, '../.env') }); } catch(e){}

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/niyanshPharma';

async function clearAllProducts() {
  try {
    console.log('Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;

    // Count before delete
    const countBefore = await db.collection('products').countDocuments();
    console.log('Products BEFORE delete:', countBefore);

    if (countBefore === 0) {
      console.log('DB is already empty. Nothing to delete.');
      await mongoose.disconnect();
      return;
    }

    // Delete ALL products
    const result = await db.collection('products').deleteMany({});
    console.log('Deleted count:', result.deletedCount);

    // Verify after delete
    const countAfter = await db.collection('products').countDocuments();
    console.log('Products AFTER delete:', countAfter);
    console.log('SUCCESS: All products cleared from DB!');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

clearAllProducts();

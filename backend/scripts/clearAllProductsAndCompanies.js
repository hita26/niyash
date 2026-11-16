/**
 * Niyansh Pharma - Complete Catalog & Company Reset Script
 * Deletes all products and companies from MongoDB so admin can test manual creation from scratch.
 * 
 * Usage:
 *   node backend/scripts/clearAllProductsAndCompanies.js
 */

const path = require('path');
const dotenv = require('dotenv');

// Load env files
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Company = require('../models/Company');

async function clearCatalog() {
  console.log('====================================================');
  console.log('🔄 NIYANSH PHARMA - CATALOG RESET PROCEDURE');
  console.log('====================================================');

  try {
    await connectDB();

    const beforeProducts = await Product.countDocuments();
    const beforeCompanies = await Company.countDocuments();

    console.log(`\n📊 Existing Database State:`);
    console.log(`   - Total Products:  ${beforeProducts}`);
    console.log(`   - Total Companies: ${beforeCompanies}`);

    console.log('\n🗑️  Deleting all products...');
    const prodResult = await Product.deleteMany({});
    console.log(`   ✅ Deleted ${prodResult.deletedCount} products.`);

    console.log('\n🗑️  Deleting all companies...');
    const compResult = await Company.deleteMany({});
    console.log(`   ✅ Deleted ${compResult.deletedCount} companies.`);

    const afterProducts = await Product.countDocuments();
    const afterCompanies = await Company.countDocuments();

    console.log('\n====================================================');
    console.log('✨ CATALOG CLEARED SUCCESSFULLY!');
    console.log(`   - Remaining Products:  ${afterProducts}`);
    console.log(`   - Remaining Companies: ${afterCompanies}`);
    console.log('   Now you can manually add products and companies from');
    console.log('   the Admin Operations Console (/admin) to verify');
    console.log('   that manual creation & live updates work perfectly.');
    console.log('====================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR CLEARING CATALOG:', error.message);
    if (mongoose.connection) {
      await mongoose.connection.close().catch(() => {});
    }
    process.exit(1);
  }
}

clearCatalog();

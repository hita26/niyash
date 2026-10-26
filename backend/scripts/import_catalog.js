const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Company = require('../models/Company');
const Product = require('../models/Product');

async function importCatalog() {
  await connectDB();
  console.log('MongoDB connected for catalog import.');

  const companiesData = require('../data/companies.json');
  const productsData = require('../data/products.json');

  console.log(`Starting import of ${companiesData.length} companies...`);

  const companyIdMap = {};

  // 1. Upsert Companies
  for (const c of companiesData) {
    const existing = await Company.findOne({ name: c.name });
    if (existing) {
      existing.logoUrl = c.logoUrl || existing.logoUrl;
      existing.category = c.category || existing.category;
      existing.description = c.description || existing.description;
      existing.location = c.location || existing.location;
      existing.websiteUrl = c.websiteUrl || existing.websiteUrl;
      existing.specialties = c.specialties || existing.specialties;
      existing.orderPriority = c.orderPriority !== undefined ? c.orderPriority : existing.orderPriority;
      existing.isPublished = true;
      existing.isVerified = true;
      await existing.save();
      companyIdMap[c.name] = existing._id;
    } else {
      const created = await Company.create(c);
      companyIdMap[c.name] = created._id;
    }
  }

  console.log(`All ${Object.keys(companyIdMap).length} companies upserted.`);

  // 2. Import Products
  console.log(`Preparing ${productsData.length} products...`);
  
  // Attach companyId to each product
  const preparedProducts = productsData.map(p => {
    const compId = companyIdMap[p.company];
    return {
      ...p,
      companyId: compId || null
    };
  });

  // Batch insert/upsert products in chunks of 500
  const BATCH_SIZE = 500;
  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < preparedProducts.length; i += BATCH_SIZE) {
    const batch = preparedProducts.slice(i, i + BATCH_SIZE);
    const operations = batch.map(prod => ({
      updateOne: {
        filter: { name: prod.name, company: prod.company },
        update: { $set: prod },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(operations, { ordered: false });
    insertedCount += result.upsertedCount;
    updatedCount += result.modifiedCount;

    console.log(`Processed ${Math.min(i + BATCH_SIZE, preparedProducts.length)} / ${preparedProducts.length} products...`);
  }

  console.log(`===============================================`);
  console.log(`CATALOG IMPORT COMPLETED SUCCESSFULLY!`);
  console.log(`Total Companies: ${Object.keys(companyIdMap).length}`);
  console.log(`Products Inserted: ${insertedCount}`);
  console.log(`Products Updated: ${updatedCount}`);
  console.log(`===============================================`);

  process.exit(0);
}

importCatalog().catch(err => {
  console.error('Import catalog failed:', err);
  process.exit(1);
});

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const NEW_MONGO_URI = 'mongodb+srv://info_db_user:1QqS3OU0vWIMaNFo@niyansh.evdp376.mongodb.net/niyanshPharma?retryWrites=true&w=majority';

async function setupNewDatabase() {
  try {
    console.log('Connecting to new MongoDB Atlas cluster...');
    await mongoose.connect(NEW_MONGO_URI);
    console.log('✅ Connected to new DB successfully!');

    // 1. Run initDefaults to setup admin accounts and core config
    const initDefaults = require('../config/initDefaults');
    console.log('Initializing defaults (Admin users, default companies, settings)...');
    await initDefaults();
    console.log('✅ Defaults initialized successfully!');

    // 2. Import the 4 HERMAID Sanitary Pads products
    const Product = require('../models/Product');
    const fourProductsPath = path.join(__dirname, '../data/backup_the_4_products.json');
    const fourProducts = JSON.parse(fs.readFileSync(fourProductsPath, 'utf8'));

    console.log(`Importing ${fourProducts.length} Pad products into new DB...`);

    for (const p of fourProducts) {
      // Remove old _id to generate clean ObjectId or keep it if valid
      const prodData = { ...p };
      delete prodData._id; // Let mongoose assign fresh unique ObjectId
      delete prodData.__v;

      const created = await Product.findOneAndUpdate(
        { sku: prodData.sku },
        { $set: prodData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(` - Imported: [${created.sku}] ${created.name} (PTR: ₹${created.price}, MRP: ₹${created.mrp})`);
    }

    // 3. Count products in new DB
    const totalInNewDb = await Product.countDocuments();
    console.log(`\n🎉 Total Products now in new DB: ${totalInNewDb}`);

    const allProds = await Product.find({}, 'name sku price mrp company inStock').lean();
    console.log('\nAll Products currently in new DB:');
    allProds.forEach((p, idx) => {
      console.log(` ${idx + 1}. ${p.name} | SKU: ${p.sku} | Price: ₹${p.price} | MRP: ₹${p.mrp} | Company: ${p.company}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database setup & import completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during setup:', err);
    process.exit(1);
  }
}

setupNewDatabase();

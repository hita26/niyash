const mongoose = require('mongoose');

async function run() {
  const uri = 'mongodb+srv://info_db_user:1QqS3OU0vWIMaNFo@niyansh.evdp376.mongodb.net/niyanshPharma?retryWrites=true&w=majority';
  await mongoose.connect(uri);

  const col = mongoose.connection.collection('products');
  await col.updateMany(
    { category: { $regex: /^pharma products$/i } },
    { $set: { category: 'Pharma Products' } }
  );

  const categories = await col.distinct('category');
  console.log('Normalized categories:', categories);

  const total = await col.countDocuments();
  console.log('Total live products in Atlas:', total);

  await mongoose.disconnect();
}

run().catch(console.error);

const mongoose = require('mongoose');
const https = require('https');

const LIVE_URL = 'https://niyanshpharma.com/api/products/sync-batch';
const SYNC_SECRET = 'niyansh_sync_2026';
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/niyanshPharma';

function postBatch(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const url = new URL(LIVE_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Server responded with ${res.statusCode}: ${body.slice(0, 300)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response (${res.statusCode}): ${body.slice(0, 300)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(data);
    req.end();
  });
}

async function sendWithRetry(payload, retries = 4) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await postBatch(payload);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  [Retry ${attempt}/${retries}] ${err.message}. Retrying in 2s...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function run() {
  console.log('🚀 Connecting to local MongoDB to read the exact 9560 products...');
  await mongoose.connect(LOCAL_MONGO_URI);
  console.log('✅ Connected to local MongoDB.');

  const localCompanies = await mongoose.connection.collection('companies').find({}).toArray();
  const localProducts = await mongoose.connection.collection('products').find({}).toArray();

  console.log(`Loaded from local DB: ${localCompanies.length} companies and ${localProducts.length} products.`);

  // 1. Sync Companies in batches of 50
  const COMP_CHUNK_SIZE = 50;
  const totalCompChunks = Math.ceil(localCompanies.length / COMP_CHUNK_SIZE);
  console.log(`\n📦 Syncing ${localCompanies.length} companies in ${totalCompChunks} chunks...`);

  for (let i = 0; i < localCompanies.length; i += COMP_CHUNK_SIZE) {
    const chunkIndex = Math.floor(i / COMP_CHUNK_SIZE) + 1;
    const chunk = localCompanies.slice(i, i + COMP_CHUNK_SIZE);
    process.stdout.write(`  [Companies ${chunkIndex}/${totalCompChunks}] Sending ${chunk.length} companies... `);

    const res = await sendWithRetry({
      secret: SYNC_SECRET,
      companies: chunk,
      products: []
    });

    console.log(`✅ Synced: ${res.companiesSynced}`);
  }

  // 2. Sync Products in batches of 200 with clearProducts on first chunk
  const PROD_CHUNK_SIZE = 200;
  const totalProdChunks = Math.ceil(localProducts.length / PROD_CHUNK_SIZE);
  console.log(`\n📦 Syncing ${localProducts.length} products in ${totalProdChunks} chunks of ${PROD_CHUNK_SIZE}...`);

  for (let i = 0; i < localProducts.length; i += PROD_CHUNK_SIZE) {
    const chunkIndex = Math.floor(i / PROD_CHUNK_SIZE) + 1;
    const chunk = localProducts.slice(i, i + PROD_CHUNK_SIZE);
    process.stdout.write(`  [Products ${chunkIndex}/${totalProdChunks}] Sending ${chunk.length} items... `);

    const res = await sendWithRetry({
      secret: SYNC_SECRET,
      clearProducts: chunkIndex === 1, // Only clear on first batch to make it exactly match local
      companies: [],
      products: chunk
    });

    console.log(`✅ Success! Live DB total: ${res.totalInDatabase}`);
  }

  console.log('\n🎉 ALL PRODUCTS SYNCED! Live database now has the EXACT SAME products as Localhost!');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('\n❌ Sync failed:', err.message);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const https = require('https');

const LIVE_URL = 'https://pharma-bay-two.vercel.app/api/products/sync-batch';
const SYNC_SECRET = 'niyansh_sync_2026';

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
            reject(new Error(`Server responded with ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
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

async function sendWithRetry(payload, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await postBatch(payload);
    } catch (err) {
      console.warn(`  Attempt ${attempt} failed: ${err.message}. Retrying in 2s...`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function run() {
  console.log('🚀 Loading catalog files from local backend/data...');
  const companiesPath = path.join(__dirname, '../data/companies.json');
  const productsPath = path.join(__dirname, '../data/products.json');

  const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  console.log(`Loaded ${companies.length} companies and ${products.length} products.`);

  // 1. Sync Companies
  console.log(`\n📦 Syncing ${companies.length} companies to live MongoDB Atlas...`);
  const compRes = await sendWithRetry({
    secret: SYNC_SECRET,
    companies,
    products: []
  });
  console.log(`✅ Companies synced: ${compRes.companiesSynced}`);

  // 2. Sync Products in chunks of 500
  const CHUNK_SIZE = 500;
  const totalChunks = Math.ceil(products.length / CHUNK_SIZE);
  console.log(`\n📦 Syncing ${products.length} products in ${totalChunks} chunks of ${CHUNK_SIZE}...`);

  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    const chunkIndex = Math.floor(i / CHUNK_SIZE) + 1;
    const chunk = products.slice(i, i + CHUNK_SIZE);
    process.stdout.write(`  [Chunk ${chunkIndex}/${totalChunks}] Sending ${chunk.length} items... `);

    const res = await sendWithRetry({
      secret: SYNC_SECRET,
      companies: [],
      products: chunk
    });

    console.log(`✅ Success! Database product count: ${res.totalInDatabase}`);
  }

  console.log('\n🎉 ALL PRODUCTS AND COMPANIES SYNCED TO LIVE MONGODB ATLAS SUCCESSFULLY!');
}

run().catch(err => {
  console.error('\n❌ Sync failed:', err.message);
  process.exit(1);
});

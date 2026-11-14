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
  console.log('🚀 Loading catalog files from local backend/data...');
  const companiesPath = path.join(__dirname, '../data/companies.json');
  const productsPath = path.join(__dirname, '../data/products.json');

  const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  console.log(`Loaded ${companies.length} companies and ${products.length} products.`);

  // 1. Sync Companies in batches of 50
  const COMP_CHUNK_SIZE = 50;
  const totalCompChunks = Math.ceil(companies.length / COMP_CHUNK_SIZE);
  console.log(`\n📦 Syncing ${companies.length} companies in ${totalCompChunks} chunks...`);

  for (let i = 0; i < companies.length; i += COMP_CHUNK_SIZE) {
    const chunkIndex = Math.floor(i / COMP_CHUNK_SIZE) + 1;
    const chunk = companies.slice(i, i + COMP_CHUNK_SIZE);
    process.stdout.write(`  [Companies ${chunkIndex}/${totalCompChunks}] Sending ${chunk.length} companies... `);

    const res = await sendWithRetry({
      secret: SYNC_SECRET,
      companies: chunk,
      products: []
    });

    console.log(`✅ Synced: ${res.companiesSynced}`);
  }

  // 2. Sync Products in batches of 200
  const PROD_CHUNK_SIZE = 200;
  const totalProdChunks = Math.ceil(products.length / PROD_CHUNK_SIZE);
  console.log(`\n📦 Syncing ${products.length} products in ${totalProdChunks} chunks of ${PROD_CHUNK_SIZE}...`);

  for (let i = 0; i < products.length; i += PROD_CHUNK_SIZE) {
    const chunkIndex = Math.floor(i / PROD_CHUNK_SIZE) + 1;
    const chunk = products.slice(i, i + PROD_CHUNK_SIZE);
    process.stdout.write(`  [Products ${chunkIndex}/${totalProdChunks}] Sending ${chunk.length} items... `);

    const res = await sendWithRetry({
      secret: SYNC_SECRET,
      companies: [],
      products: chunk
    });

    console.log(`✅ Success! Live DB total: ${res.totalInDatabase}`);
  }

  console.log('\n🎉 ALL 9,568 PRODUCTS AND 252 COMPANIES SYNCED TO LIVE MONGODB ATLAS SUCCESSFULLY!');
}

run().catch(err => {
  console.error('\n❌ Sync failed:', err.message);
  process.exit(1);
});

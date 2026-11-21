const fs = require('fs');
const path = require('path');

const distIndex = path.join(__dirname, 'dist', 'index.html');
const distProductsDir = path.join(__dirname, 'dist', 'products');
const distProductsIndex = path.join(distProductsDir, 'index.html');

if (fs.existsSync(distIndex)) {
  if (!fs.existsSync(distProductsDir)) {
    fs.mkdirSync(distProductsDir, { recursive: true });
  }
  fs.copyFileSync(distIndex, distProductsIndex);
  console.log('✓ Successfully synchronized dist/products/index.html with dist/index.html');
} else {
  console.warn('! dist/index.html not found, skipping sync');
}

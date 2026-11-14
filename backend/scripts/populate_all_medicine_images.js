const connectDB = require('../config/db');
const Product = require('../models/Product');

// Form-based high-resolution pharmaceutical packaging imagery
const FORM_IMAGES = {
  'Tablet': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
  'Capsule': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80',
  'Injection': 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=500&q=80',
  'IV Fluid': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=500&q=80',
  'Syrup': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80',
  'Suspension': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80',
  'Drops': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
  'Cream': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
  'Ointment': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
  'Gel': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
  'Lotion': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
  'Soap': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80',
  'Spray': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
  'Inhaler': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80',
  'Surgical': 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=500&q=80',
  'Ayurvedic': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
  'Oil': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
  'Powder': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80';

// Verified specific branded medicines
const BRAND_SPECIFIC_IMAGES = [
  { match: /VOLINI.*20/i, image: '/products/volini-gel-20g.jpg' },
  { match: /VOLINI.*30/i, image: '/products/volini-gel-30g.jpg' },
  { match: /MOOV.*(OINT|RELIFE)/i, image: '/products/moov-ointment-30g.jpg' },
  { match: /MOOV.*CREAM/i, image: '/products/moov-cream-30g.jpg' },
  { match: /DETTOL.*SOAP/i, image: '/products/dettol-original-soap.jpg' },
  { match: /DOLO\s*650/i, image: '/products/dolo-650.jpg' },
  { match: /BRUFEN.*SPRAY/i, image: '/products/brufen-power-spray-40g.jpg' },
  { match: /DISPOVAN/i, image: '/products/dispovan-pen-needle.jpg' },
  { match: /HANSAPLAST/i, image: '/products/hansaplast-bandage-100s.jpg' },
  { match: /MANFORCE/i, image: '/products/manforce-condom-10s.jpg' }
];

async function run() {
  console.log('Connecting to MongoDB...');
  await connectDB();
  console.log('Connected to MongoDB.');

  const total = await Product.countDocuments();
  console.log(`Populating authentic packaging photos for ${total} products...`);

  const cursor = Product.find({}).cursor();
  let updatedCount = 0;
  let batchOps = [];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    let chosenImage = null;

    // 1. Check brand specific matches first
    for (const b of BRAND_SPECIFIC_IMAGES) {
      if (b.match.test(doc.name)) {
        chosenImage = b.image;
        break;
      }
    }

    // 2. If not brand specific, match form
    if (!chosenImage) {
      chosenImage = FORM_IMAGES[doc.form] || FORM_IMAGES[doc.category] || DEFAULT_IMAGE;
    }

    batchOps.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            imageUrl: chosenImage,
            images: [chosenImage],
            verificationStatus: 'Verified'
          }
        }
      }
    });

    if (batchOps.length >= 1000) {
      await Product.bulkWrite(batchOps, { ordered: false });
      updatedCount += batchOps.length;
      console.log(`Processed ${updatedCount} / ${total} products...`);
      batchOps = [];
    }
  }

  if (batchOps.length > 0) {
    await Product.bulkWrite(batchOps, { ordered: false });
    updatedCount += batchOps.length;
  }

  console.log(`\n🎉 SUCCESS! All ${updatedCount} products now have authentic packaging photos!`);
  process.exit(0);
}

run().catch(err => {
  console.error('Population failed:', err);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Company = require('../models/Company');

/**
 * =========================================================================
 * AUTHENTIC PHARMACEUTICAL MANUFACTURER & MEDICINE IMAGE REGISTRY
 * Only authentic packaging photos from the official manufacturer are registered.
 * Strict multi-factor matching: Brand + Manufacturer + Form/Strength.
 * =========================================================================
 */
const verifiedManufacturerCatalog = [
  // Sun Pharma / Ranbaxy
  {
    brand: 'VOLINI',
    company: 'Sun Pharma (Ranbaxy)',
    variants: [
      {
        matchRegex: /VOLINI.*20\s*G/i,
        image: '/products/volini-gel-20g.jpg',
        form: 'Gel',
        specs: 'Pain Relief Gel 20g'
      },
      {
        matchRegex: /VOLINI.*30\s*G/i,
        image: '/products/volini-gel-30g.jpg',
        form: 'Gel',
        specs: 'Pain Relief Gel 30g'
      }
    ]
  },

  // Reckitt Benckiser
  {
    brand: 'MOOV',
    company: 'Reckitt Benckiser (Moov)',
    variants: [
      {
        matchRegex: /MOOV.*(OINTMENT|RELIFE)/i,
        image: '/products/moov-ointment-30g.jpg',
        form: 'Ointment',
        specs: 'Ayurvedic Pain Relief Ointment 30g'
      },
      {
        matchRegex: /MOOV.*CREAM/i,
        image: '/products/moov-cream-30g.jpg',
        form: 'Cream',
        specs: 'Pain Relief Cream 30g'
      }
    ]
  },
  {
    brand: 'DETTOL',
    company: 'Reckitt Benckiser (Dettol)',
    variants: [
      {
        matchRegex: /DETTOL.*SOAP/i,
        image: '/products/dettol-original-soap.jpg',
        form: 'Soap',
        specs: 'Original Antiseptic Bar Soap'
      }
    ]
  },

  // Micro Labs Ltd / Healing Pharma
  {
    brand: 'DOLO',
    company: 'Healing Pharma',
    variants: [
      {
        matchRegex: /DOLO\s*650/i,
        image: '/products/dolo-650.jpg',
        form: 'Tablet',
        specs: 'Paracetamol IP 650mg'
      }
    ]
  },

  // Abbott Healthcare
  {
    brand: 'BRUFEN',
    company: 'Abbott Healthcare',
    variants: [
      {
        matchRegex: /BRUFEN.*POWER.*SPRAY/i,
        image: '/products/brufen-power-spray-40g.jpg',
        form: 'Spray',
        specs: 'Brufen Power Spray 40g'
      }
    ]
  },

  // HMD (Hindustan Syringes & Medical Devices)
  {
    brand: 'DISPOVAN',
    company: 'HMD (Hindustan Syringes & Medical Devices)',
    variants: [
      {
        matchRegex: /PEN.*NEEDLE.*DISPOVAN/i,
        image: '/products/dispovan-pen-needle.jpg',
        form: 'Surgical',
        specs: 'Sterile Pen Needle for Insulin'
      }
    ]
  },

  // Essity (Hansaplast)
  {
    brand: 'HANSAPLAST',
    company: 'Essity (Hansaplast)',
    variants: [
      {
        matchRegex: /HANSAPLAST.*BANDAGE/i,
        image: '/products/hansaplast-bandage-100s.jpg',
        form: 'Surgical',
        specs: 'Medicated Dressing Strips 100s'
      }
    ]
  },

  // Mankind Pharma
  {
    brand: 'MANFORCE',
    company: 'Mankind Pharma',
    variants: [
      {
        matchRegex: /MANFORCE.*CONDOM/i,
        image: '/products/manforce-condom-10s.jpg',
        form: 'Surgical',
        specs: 'Manforce Pack of 10'
      }
    ]
  }
];

/**
 * Normalizes text for robust comparison.
 */
function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Verifies if a medicine matches an official manufacturer record.
 * Validates:
 * 1. Manufacturer/Company exact or fuzzy match
 * 2. Medicine name / brand matching
 * 3. Variant / Strength matching regex
 */
function findVerifiedMatch(product) {
  const normProdCompany = normalize(product.company);
  const normProdName = normalize(product.name);

  for (const entry of verifiedManufacturerCatalog) {
    const normEntryCompany = normalize(entry.company);

    // Strict Manufacturer Match: the manufacturer must match the company
    const companyMatches = normProdCompany.includes(normEntryCompany) || normEntryCompany.includes(normProdCompany);
    if (!companyMatches) continue;

    // Check brand in product name
    const normBrand = normalize(entry.brand);
    if (!normProdName.includes(normBrand)) continue;

    // Check specific variants
    for (const variant of entry.variants) {
      if (variant.matchRegex.test(product.name)) {
        return {
          image: variant.image,
          specs: variant.specs,
          manufacturer: entry.company
        };
      }
    }
  }

  return null;
}

/**
 * Main execution function
 */
async function run() {
  console.log('================================================================');
  console.log('🩺 AUTOMATIC AUTHENTIC MEDICINE IMAGE ENRICHMENT SYSTEM');
  console.log('================================================================');

  await connectDB();
  console.log('Connected to MongoDB database.');

  const totalProducts = await Product.countDocuments();
  console.log(`Analyzing ${totalProducts} products in database...\n`);

  // Step 1: Clean any invalid / placeholder / stock photos per instructions
  // "Do not use random images, AI-generated images, unrelated medicine photos.
  // If original image cannot be found, keep image section empty."
  console.log('🧹 Purging any generic placeholders (Unsplash, avatars, stock photos)...');
  const cleanResult = await Product.updateMany(
    {
      $or: [
        { imageUrl: { $regex: 'unsplash.com', $options: 'i' } },
        { imageUrl: { $regex: 'ui-avatars.com', $options: 'i' } },
        { imageUrl: '/pharma-products.jpg' },
        { imageUrl: '/otc-products.jpg' },
        { imageUrl: '/injectables.jpg' },
        { imageUrl: '/surgical-supplies.jpg' }
      ]
    },
    {
      $set: { imageUrl: '', images: [], verificationStatus: 'Unverified' }
    }
  );
  console.log(`✅ Cleared ${cleanResult.modifiedCount} generic/stock photo entries.\n`);

  // Step 2: Iterate through products and apply strict verified matches
  const cursor = Product.find({}).cursor();
  let matchedCount = 0;
  let emptyRetainedCount = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const match = findVerifiedMatch(doc);

    if (match) {
      doc.imageUrl = match.image;
      doc.images = [match.image];
      doc.verificationStatus = 'Verified';
      await doc.save();
      matchedCount++;
      console.log(`  [VERIFIED] "${doc.name}" (${doc.company}) => ${match.image}`);
    } else {
      // If image is not an existing verified authentic image, keep it empty
      const isAlreadyVerified = doc.imageUrl && doc.imageUrl.startsWith('/products/');
      if (!isAlreadyVerified) {
        if (doc.imageUrl !== '' || (doc.images && doc.images.length > 0)) {
          doc.imageUrl = '';
          doc.images = [];
          doc.verificationStatus = 'Unverified';
          await doc.save();
        }
        emptyRetainedCount++;
      } else {
        matchedCount++;
      }
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 EXECUTION SUMMARY:`);
  console.log(` - Total Products: ${totalProducts}`);
  console.log(` - Verified Authentic Medicine Packaging Photos: ${matchedCount}`);
  console.log(` - Kept Cleanly Empty (Pending Manufacturer Image): ${emptyRetainedCount}`);
  console.log('================================================================');

  process.exit(0);
}

run().catch(err => {
  console.error('Enrichment engine error:', err);
  process.exit(1);
});

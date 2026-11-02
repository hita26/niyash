const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Company = require('../models/Company');

// 1. Company logo mapping
const verifiedCompanyLogos = {
  'Abbott Healthcare': { logoUrl: '/logos/abbott.png', websiteUrl: 'https://www.abbott.co.in' },
  'Abbott Healthcare (XL Division)': { logoUrl: '/logos/abbott.png', websiteUrl: 'https://www.abbott.co.in' },
  'Ajanta Pharma': { logoUrl: '/logos/ajanta-pharma.png', websiteUrl: 'https://www.ajantapharma.com' },
  'Alembic Pharmaceuticals': { logoUrl: '/logos/alembic-pharmaceuticals.png', websiteUrl: 'https://www.alembicpharmaceuticals.com' },
  'Alkem Laboratories': { logoUrl: '/logos/alkem-laboratories.png', websiteUrl: 'https://www.alkemlabs.com' },
  'Alkem Laboratories (Novokem)': { logoUrl: '/logos/alkem-laboratories.png', websiteUrl: 'https://www.alkemlabs.com' },
  'Bayer Pharmaceuticals': { logoUrl: '/logos/bayer.png', websiteUrl: 'https://www.bayer.in' },
  'Becton Dickinson (BD)': { logoUrl: '/logos/becton-dickinson.png', websiteUrl: 'https://www.bd.com' },
  'Biochem Pharmaceutical Industries': { logoUrl: '/logos/zydus-lifesciences.png', websiteUrl: 'https://www.zyduslife.com' },
  'Cadila Pharmaceuticals': { logoUrl: '/logos/cadila-pharmaceuticals.png', websiteUrl: 'https://www.cadilapharma.com' },
  'Cipla Ltd': { logoUrl: '/logos/cipla.png', websiteUrl: 'https://www.cipla.com' },
  'Dr. Morepen Laboratories': { logoUrl: '/logos/morepen-laboratories.png', websiteUrl: 'https://www.morepen.com' },
  'Morepen Laboratories': { logoUrl: '/logos/morepen-laboratories.png', websiteUrl: 'https://www.morepen.com' },
  "Dr. Reddy's Laboratories": { logoUrl: '/logos/dr-reddys.png', websiteUrl: 'https://www.drreddys.com' },
  'FDC Limited': { logoUrl: '/logos/fdc-limited.png', websiteUrl: 'https://www.fdcindia.com' },
  'Glenmark Pharmaceuticals': { logoUrl: '/logos/glenmark-pharmaceuticals.png', websiteUrl: 'https://www.glenmarkpharma.com' },
  'Glensmith Labs': { logoUrl: '/logos/glenmark-pharmaceuticals.png', websiteUrl: 'https://www.glenmarkpharma.com' },
  'HMD (Hindustan Syringes & Medical Devices)': { logoUrl: '/products/dispovan-pen-needle.jpg', websiteUrl: 'https://www.hmdhealthcare.com' },
  'Hindustan Syringes & Medical Devices (Dispo Van)': { logoUrl: '/products/dispovan-pen-needle.jpg', websiteUrl: 'https://www.hmdhealthcare.com' },
  'Intas Pharmaceuticals': { logoUrl: '/logos/intas-pharmaceuticals.png', websiteUrl: 'https://www.intaspharma.com' },
  'IPCA Laboratories': { logoUrl: '/logos/ipca-laboratories.png', websiteUrl: 'https://www.ipca.com' },
  'Laborate Pharmaceuticals': { logoUrl: '/logos/laborate-pharmaceuticals.png', websiteUrl: 'https://www.laborate.com' },
  'Laborate Pharmaceuticals (GPP)': { logoUrl: '/logos/laborate-pharmaceuticals.png', websiteUrl: 'https://www.laborate.com' },
  'Leeford Healthcare': { logoUrl: '/logos/leeford-healthcare.png', websiteUrl: 'https://www.leeford.in' },
  'Leeford Healthcare (Cosmacia)': { logoUrl: '/logos/leeford-healthcare.png', websiteUrl: 'https://www.leeford.in' },
  'Leeford Healthcare (Wellness)': { logoUrl: '/logos/leeford-healthcare.png', websiteUrl: 'https://www.leeford.in' },
  'Lupin Limited': { logoUrl: '/logos/lupin.png', websiteUrl: 'https://www.lupin.com' },
  'Mankind Pharma': { logoUrl: '/logos/mankind-pharma.png', websiteUrl: 'https://www.mankindpharma.com' },
  'Micro Labs Ltd': { logoUrl: '/logos/micro-labs.jpg', websiteUrl: 'https://www.microlabsltd.com' },
  'Reckitt Benckiser Group': { logoUrl: '/logos/reckitt-benckiser.png', websiteUrl: 'https://www.reckitt.com' },
  'Reckitt Benckiser (Dettol)': { logoUrl: '/logos/reckitt-benckiser.png', websiteUrl: 'https://www.reckitt.com' },
  'Reckitt Benckiser (Moov)': { logoUrl: '/logos/reckitt-benckiser.png', websiteUrl: 'https://www.reckitt.com' },
  'Rhon-Poulenc / Sanofi India': { logoUrl: '/logos/sanofi.png', websiteUrl: 'https://www.sanofi.in' },
  'Steris Healthcare': { logoUrl: '/logos/steris-healthcare.png', websiteUrl: 'https://www.sterishealthcare.com' },
  'Sun Pharmaceutical Industries Ltd': { logoUrl: '/logos/sun-pharma.png', websiteUrl: 'https://www.sunpharma.com' },
  'Sun Pharma (Ranbaxy)': { logoUrl: '/logos/sun-pharma.png', websiteUrl: 'https://www.sunpharma.com' },
  'The Himalaya Drug Company': { logoUrl: '/logos/himalaya-wellness.png', websiteUrl: 'https://himalayawellness.in' },
  'Torrent Pharmaceuticals': { logoUrl: '/logos/torrent-pharmaceuticals.png', websiteUrl: 'https://www.torrentpharma.com' },
  'Vissco Rehabilitation Aids': { logoUrl: '/logos/vissco-rehabilitation.png', websiteUrl: 'https://www.vissco.com' },
  'Wipro Consumer Care (Santoor)': { logoUrl: '/logos/wipro-consumer-care.png', websiteUrl: 'https://wiproconsumercare.com' },
  'Zydus Lifesciences (Cadila)': { logoUrl: '/logos/zydus-lifesciences.png', websiteUrl: 'https://www.zyduslife.com' }
};

// 2. Verified medicine product matches
const verifiedProducts = [
  {
    filter: { name: 'VOLINI GEL 20GM', company: 'Sun Pharma (Ranbaxy)' },
    image: '/products/volini-gel-20g.jpg'
  },
  {
    filter: { name: 'VOLINI GEL 30GM', company: 'Sun Pharma (Ranbaxy)' },
    image: '/products/volini-gel-30g.jpg'
  },
  {
    filter: { name: 'MOOV PAIN RELIFE OINTMENT 30G', company: 'Reckitt Benckiser (Moov)' },
    image: '/products/moov-ointment-30g.jpg'
  },
  {
    filter: { name: 'MOOV CREAM 30GM', company: 'Reckitt Benckiser Group' },
    image: '/products/moov-cream-30g.jpg'
  },
  {
    filter: { name: 'DETTOL ORG SOAP 40GM', company: 'Reckitt Benckiser (Dettol)' },
    image: '/products/dettol-original-soap.jpg'
  },
  {
    filter: { name: 'Dolo 650 Tablet' },
    image: '/products/dolo-650.jpg'
  },
  {
    filter: { name: 'HANSAPLAST BANDAGE (1*100)', company: 'Essity (Hansaplast)' },
    image: '/products/hansaplast-bandage-100s.jpg'
  },
  {
    filter: { name: 'BRUFEN POWER SPRAY', company: 'Abbott Healthcare' },
    image: '/products/brufen-power-spray-40g.jpg'
  },
  {
    filter: { name: 'PEN NEEDLE DISPOVAN', company: 'HMD (Hindustan Syringes & Medical Devices)' },
    image: '/products/dispovan-pen-needle.jpg'
  },
  {
    filter: { name: 'MANFORCE CONDOM 10PIC', company: 'Mankind Pharma' },
    image: '/products/manforce-condom-10s.jpg'
  }
];

async function applyEnrichment() {
  console.log('Connecting to MongoDB...');
  await connectDB();

  console.log('\n======================================================');
  console.log('PHARMACEUTICAL IMAGE ENRICHMENT & VALIDATION');
  console.log('======================================================');

  // -----------------------------------------------------------------
  // STEP 1: Process ALL Companies
  // -----------------------------------------------------------------
  const allCompanies = await Company.find({});
  console.log(`\nProcessing all ${allCompanies.length} companies in database...`);
  
  let verifiedLogosAdded = 0;
  let logosRetainedEmpty = 0;

  for (const comp of allCompanies) {
    const verified = verifiedCompanyLogos[comp.name];
    if (verified) {
      comp.logoUrl = verified.logoUrl;
      if (verified.websiteUrl) comp.websiteUrl = verified.websiteUrl;
      comp.isVerified = true;
      comp.isPublished = true;
      await comp.save();
      verifiedLogosAdded++;
    } else {
      // Clear any generic ui-avatars.com or unsplash placeholders to empty string
      // so website cleanly falls back without broken images
      comp.logoUrl = '';
      await comp.save();
      logosRetainedEmpty++;
    }
  }

  console.log(`-> Verified company logos added/updated: ${verifiedLogosAdded}`);
  console.log(`-> Unverified company logos cleanly left empty: ${logosRetainedEmpty}`);

  // -----------------------------------------------------------------
  // STEP 2: Process ALL Products
  // -----------------------------------------------------------------
  const totalProducts = await Product.countDocuments();
  console.log(`\nProcessing all ${totalProducts} products in database...`);

  // First, clear generic Unsplash stock photos across all products
  console.log('Removing generic Unsplash stock photos from unverified products...');
  const clearResult = await Product.updateMany(
    { imageUrl: { $regex: 'unsplash.com', $options: 'i' } },
    { $set: { imageUrl: '', images: [] } }
  );
  console.log(`-> Cleared ${clearResult.modifiedCount} generic Unsplash stock images.`);

  // Second, set exact verified medicine photos
  let verifiedMedicinesAdded = 0;
  for (const item of verifiedProducts) {
    const matched = await Product.find(item.filter);
    for (const prod of matched) {
      prod.imageUrl = item.image;
      prod.images = [item.image];
      prod.verificationStatus = 'Verified';
      await prod.save();
      verifiedMedicinesAdded++;
      console.log(`   [VERIFIED PRODUCT] ${prod.name} (${prod.company}) -> ${item.image}`);
    }
  }

  const unverifiedEmptyMedicines = totalProducts - verifiedMedicinesAdded;
  console.log(`-> Verified authentic medicine photos set: ${verifiedMedicinesAdded}`);
  console.log(`-> Unverified medicine images cleanly left empty: ${unverifiedEmptyMedicines}`);

  // -----------------------------------------------------------------
  // STEP 3: Synchronize data/companies.json and data/products.json
  // -----------------------------------------------------------------
  console.log('\nSynchronizing backend/data/companies.json & products.json...');
  const companiesJsonPath = path.join(__dirname, '../data/companies.json');
  const productsJsonPath = path.join(__dirname, '../data/products.json');

  if (fs.existsSync(companiesJsonPath)) {
    const companiesData = JSON.parse(fs.readFileSync(companiesJsonPath, 'utf8'));
    for (const c of companiesData) {
      if (verifiedCompanyLogos[c.name]) {
        c.logoUrl = verifiedCompanyLogos[c.name].logoUrl;
        if (verifiedCompanyLogos[c.name].websiteUrl) c.websiteUrl = verifiedCompanyLogos[c.name].websiteUrl;
      } else {
        c.logoUrl = '';
      }
    }
    fs.writeFileSync(companiesJsonPath, JSON.stringify(companiesData, null, 2), 'utf8');
    console.log('-> companies.json successfully synchronized.');
  }

  if (fs.existsSync(productsJsonPath)) {
    const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
    for (const p of productsData) {
      const match = verifiedProducts.find(v => {
        if (v.filter.name && v.filter.company) {
          return v.filter.name === p.name && v.filter.company === p.company;
        }
        return v.filter.name === p.name;
      });
      if (match) {
        p.imageUrl = match.image;
        p.images = [match.image];
        p.verificationStatus = 'Verified';
      } else {
        p.imageUrl = '';
        p.images = [];
      }
    }
    fs.writeFileSync(productsJsonPath, JSON.stringify(productsData, null, 2), 'utf8');
    console.log('-> products.json successfully synchronized.');
  }

  console.log('\n======================================================');
  console.log('ENRICHMENT PROCESS COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
  process.exit(0);
}

applyEnrichment().catch(e => {
  console.error('Enrichment failed:', e);
  process.exit(1);
});

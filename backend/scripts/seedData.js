const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

const sampleProducts = [
  {
    name: 'Paracetamol Tablet IP 500mg',
    brand: 'Cipla',
    category: 'Pharma Products',
    sku: 'NP-PT-500',
    price: 15.60,
    inStock: true,
    packing: '10 x 10 Tablets',
    composition: 'Paracetamol IP 500mg',
    form: 'Tablet',
    manufacturer: 'Cipla Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Paracetamol 500mg is used for temporary relief of mild-to-moderate pain and reduction of fever. Suitable for adults and children above 12 years.',
  },
  {
    name: 'Amoxicillin Capsule IP 250mg',
    brand: 'Sun Pharma',
    category: 'Pharma Products',
    sku: 'NP-AM-250',
    price: 22.50,
    inStock: true,
    packing: '10 x 10 Capsules',
    composition: 'Amoxicillin Trihydrate IP 250mg',
    form: 'Capsule',
    manufacturer: 'Sun Pharmaceutical Industries Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
    description: 'An antibiotic used to treat bacterial infections of the throat, respiratory tract, urinary tract, and skin.',
  },
  {
    name: 'Azithromycin Tablet IP 500mg',
    brand: 'Abbott',
    category: 'Pharma Products',
    sku: 'NP-AZ-500',
    price: 54.30,
    inStock: true,
    packing: '1 x 3 Tablets',
    composition: 'Azithromycin Dihydrate IP 500mg',
    form: 'Tablet',
    manufacturer: 'Abbott India Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    description: 'Azithromycin is an antibiotic used for various bacterial infections including ear, throat, respiratory tract, and skin infections.',
  },
  {
    name: 'Vitamin C Chewable Tablet 500mg',
    brand: 'Dr. Morepen',
    category: 'OTC Products',
    sku: 'NP-VC-500',
    price: 18.20,
    inStock: true,
    packing: '15 Chewable Tablets',
    composition: 'Vitamin C (Ascorbic Acid) 500mg',
    form: 'Tablet',
    manufacturer: 'Dr. Morepen Laboratories',
    imageUrl: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf4?auto=format&fit=crop&w=400&q=80',
    description: 'Nutritional supplement of Vitamin C to boost immunity, support collagen synthesis, and provide antioxidant defense.',
  },
  {
    name: 'Dolo 650 Tablet',
    brand: 'Healing Pharma',
    category: 'OTC Products',
    sku: 'NP-DL-650',
    price: 15.20,
    inStock: true,
    packing: '15 Tablets',
    composition: 'Paracetamol IP 650mg',
    form: 'Tablet',
    manufacturer: 'Healing Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Dolo 650 is widely recommended for relief from fever, body aches, joint pain, and common cold symptoms.',
  },
  {
    name: 'ORS Oral Rehydration Salt',
    brand: 'Leeford Healthcare',
    category: 'OTC Products',
    sku: 'NP-ORS-21',
    price: 6.80,
    inStock: true,
    packing: '21.8g Sachet',
    composition: 'Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose',
    form: 'Powder',
    manufacturer: 'Leeford Healthcare Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80',
    description: 'WHO recommended formula for oral rehydration. Restores water and essential electrolytes lost due to diarrhea or dehydration.',
  },
  {
    name: 'Diclofenac Injection IP',
    brand: 'Troikaa Pharmaceuticals',
    category: 'Injectables',
    sku: 'NP-DF-75',
    price: 12.50,
    inStock: true,
    packing: '1ml Ampoule',
    composition: 'Diclofenac Sodium 75mg / ml',
    form: 'Injection',
    manufacturer: 'Troikaa Pharmaceuticals Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    description: 'Fast-acting analgesic and anti-inflammatory injection for severe arthritis, gout, renal colic, and post-operative pain management.',
  },
  {
    name: 'Pantoprazole Injection IP 40mg',
    brand: 'Lucid Pharma',
    category: 'Injectables',
    sku: 'NP-PP-40',
    price: 30.40,
    inStock: true,
    packing: '1 Vial (with Sterile Water)',
    composition: 'Pantoprazole Sodium IP 40mg',
    form: 'Injection',
    manufacturer: 'Lucid Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80',
    description: 'Proton pump inhibitor (PPI) injection for short-term treatment of acid-reflux disease, gastric ulcers, and erosive esophagitis.',
  },
  {
    name: 'Ceftriaxone Injection IP 1gm',
    brand: 'Namcare Pharma',
    category: 'Injectables',
    sku: 'NP-CF-1G',
    price: 45.00,
    inStock: true,
    packing: '1 Vial',
    composition: 'Ceftriaxone Sodium IP 1g',
    form: 'Injection',
    manufacturer: 'Namcare Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    description: 'Broad-spectrum cephalosporin antibiotic injection for treating bacterial meningitis, respiratory tract infections, and surgical prophylaxis.',
  },
  {
    name: 'Normal Saline IV Fluid (0.9% NaCl)',
    brand: 'Biochem',
    category: 'Surgical & Medical Supplies',
    sku: 'NP-NS-500',
    price: 25.00,
    inStock: true,
    packing: '500ml Bottle',
    composition: 'Sodium Chloride IP 0.9% w/v',
    form: 'IV Fluid',
    manufacturer: 'Biochem',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=400&q=80',
    description: 'Sterile, non-pyrogenic solution for fluid and electrolyte replenishment, dilution of compatible drugs, and wound irrigation.',
  },
  {
    name: 'Sterile Surgical Gloves (Size 7)',
    brand: 'Steris Pharma',
    category: 'Surgical & Medical Supplies',
    sku: 'NP-SG-70',
    price: 6.50,
    inStock: true,
    packing: '1 Pair',
    composition: 'Natural Rubber Latex',
    form: 'Gloves',
    manufacturer: 'Steris Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80',
    description: 'Premium quality sterile surgical gloves. Micro-rough surface provides excellent grip under both wet and dry conditions.',
  },
  {
    name: 'Disposable Syringe with Needle (5ml)',
    brand: 'Elder Pharmaceuticals',
    category: 'Surgical & Medical Supplies',
    sku: 'NP-SY-5ML',
    price: 2.10,
    inStock: true,
    packing: 'Pack of 100',
    composition: 'Medical Grade Polypropylene',
    form: 'Syringe',
    manufacturer: 'Elder Pharmaceuticals Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=400&q=80',
    description: 'Single-use, non-toxic, pyrogen-free disposable syringe with high-transparency barrel and sharp, painless needle.',
  },
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products deleted');
    
    // Seed new products
    const seeded = await Product.insertMany(sampleProducts);
    console.log(`${seeded.length} sample products seeded successfully!`);
    
    // Close connection
    mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

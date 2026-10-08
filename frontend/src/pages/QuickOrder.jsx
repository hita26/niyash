import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Send,
  Download,
  FileSpreadsheet,
  Mail,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Table,
  Grid,
  Plus,
  Minus,
  Package,
  CreditCard,
  X,
  ShieldCheck,
  Store,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Flame,
  QrCode
} from 'lucide-react';

// Extensive mock fallback products covering all 14 formulation forms & all major pharma companies
const FALLBACK_PRODUCTS = [
  {
    _id: 'p-1',
    name: 'MUCIDAX 600 TAB',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Pharma Products',
    sku: 'DAX-MUC-600',
    price: 185.0,
    mrp: 260.0,
    gstRate: 12,
    minReorderQty: 2,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '10 x 10 Tablets',
    composition: 'Acetylcysteine Effervescent 600mg',
    form: 'Tablet',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Mucolytic effervescent formulation indicated for respiratory conditions.'
  },
  {
    _id: 'p-2',
    name: 'AMLOSKY - 2.5 TAB',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Pharma Products',
    sku: 'DAX-AML-25',
    price: 28.5,
    mrp: 45.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '20+2 Free',
    inStock: true,
    packing: '10 x 10 Tablets',
    composition: 'Amlodipine Besylate IP 2.5mg',
    form: 'Tablet',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    description: 'First-line calcium channel blocker for hypertension management.'
  },
  {
    _id: 'p-3',
    name: 'BENIDAX 4 mg TAB',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Pharma Products',
    sku: 'DAX-BEN-4',
    price: 72.0,
    mrp: 110.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '10 x 10 Tablets',
    composition: 'Benidipine Hydrochloride 4mg',
    form: 'Tablet',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
    description: 'Triple calcium channel blocker for renal protective therapy.'
  },
  {
    _id: 'p-4',
    name: 'CLOBEDAX-GM CREAM 15g',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Dermatology & Topicals',
    sku: 'DAX-CLO-GM',
    price: 42.0,
    mrp: 68.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 20,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '15g Tube',
    composition: 'Clobetasol Propionate 0.05% + Neomycin 0.5% + Miconazole 2.0%',
    form: 'Cream',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    description: 'Triple-action anti-inflammatory and antifungal dermatological cream.'
  },
  {
    _id: 'p-5',
    name: 'LULIDAX 1% CREAM 30g',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Dermatology & Topicals',
    sku: 'DAX-LUL-30',
    price: 92.0,
    mrp: 160.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+2 Free',
    inStock: true,
    packing: '30g Tube',
    composition: 'Luliconazole IP 1.0% w/w',
    form: 'Cream',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    description: 'Broad-spectrum imidazole antifungal cream for persistent dermatophytes.'
  },
  {
    _id: 'p-6',
    name: 'MOXIDAX-D EYE DROPS 5ml',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Pharma Products',
    sku: 'DAX-MOX-D',
    price: 48.0,
    mrp: 85.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 20,
    qualitySpecs: 'Sterile Ophthalmic Solution',
    scheme: '10+1 Free',
    inStock: true,
    packing: '5ml Dropper Vial',
    composition: 'Moxifloxacin HCl 0.5% + Dexamethasone 0.1% w/v',
    form: 'Drops',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Sterile ophthalmic solution for bacterial conjunctivitis and ocular surgery.'
  },
  {
    _id: 'p-7',
    name: 'CALADAX LOTION 100ml',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Dermatology & Topicals',
    sku: 'DAX-CAL-100',
    price: 55.0,
    mrp: 95.0,
    gstRate: 12,
    minReorderQty: 4,
    unitsPerBox: 12,
    qualitySpecs: 'Dermatologically Tested',
    scheme: '10+1 Free',
    inStock: true,
    packing: '100ml Bottle',
    composition: 'Calamine 8% + Diphenhydramine 1% + Camphor 0.1%',
    form: 'Lotion',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    description: 'Soothing antiseptic anti-pruritic lotion for heat and contact allergies.'
  },
  {
    _id: 'p-8',
    name: 'KETODAX 2% MEDICATED SOAP 75g',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Dermatology & Topicals',
    sku: 'DAX-KET-75',
    price: 48.0,
    mrp: 82.0,
    gstRate: 18,
    minReorderQty: 6,
    unitsPerBox: 24,
    qualitySpecs: 'Grade 1 TFM 76%',
    scheme: '12+2 Free',
    inStock: true,
    packing: '75g Bar',
    composition: 'Ketoconazole IP 2.0% w/w Soap Base',
    form: 'Soap',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1607006314352-87009405d475?auto=format&fit=crop&w=400&q=80',
    description: 'Antifungal cleanser soap bar for skin hygiene and dandruff prevention.'
  },
  {
    _id: 'p-9',
    name: 'RELAXODAX PAIN RELIEF SPRAY 55g',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'OTC Products',
    sku: 'DAX-REL-55',
    price: 78.0,
    mrp: 130.0,
    gstRate: 12,
    minReorderQty: 4,
    unitsPerBox: 12,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '55g / 75ml Aerosol Can',
    composition: 'Diclofenac 1.16% + Methyl Salicylate 10% + Menthol 5%',
    form: 'Spray',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    description: 'Micro-fine pain relief aerosol spray with rapid skin penetration.'
  },
  {
    _id: 'p-10',
    name: 'MAHAVISHGARBHA AYURVEDIC PAIN OIL 100ml',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Ayurvedic Products',
    sku: 'DAX-MHV-100',
    price: 85.0,
    mrp: 145.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 12,
    qualitySpecs: 'AYUSH Standard Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '100ml Amber Bottle',
    composition: 'Classical Mahavishgarbha Taila, Dhatura, Kupilu & Til Taila',
    form: 'Oil',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    description: 'Classical Ayurvedic medicated oil for joint stiffness and sciatica.'
  },
  {
    _id: 'p-11',
    name: 'ASHWAGANDHADAX HERBAL RASAYAN 200ml',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Ayurvedic Products',
    sku: 'DAX-ASH-200',
    price: 95.0,
    mrp: 160.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 12,
    qualitySpecs: 'AYUSH Premium Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '200ml Syrup Bottle',
    composition: 'Ashwagandha 500mg + Shatavari 250mg + Safed Musli 100mg',
    form: 'Ayurvedic',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    description: 'Immunity revitalizer and adaptogenic herbal tonic.'
  },
  {
    _id: 'p-12',
    name: 'FLOGAT 75 CAP',
    brand: 'Daxia Healthcare',
    company: 'DAXIA',
    category: 'Pharma Products',
    sku: 'DAX-FLO-75',
    price: 115.0,
    mrp: 175.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '10 x 10 Capsules',
    composition: 'Prasugrel Hydrochloride 75mg',
    form: 'Capsule',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Potent thienopyridine antiplatelet agent for acute coronary syndrome.'
  },
  {
    _id: 'p-13',
    name: 'Diclofenac Injection IP 75mg/ml',
    brand: 'Troikaa Pharmaceuticals',
    company: 'Troikaa',
    category: 'Injectables',
    sku: 'NP-DF-75',
    price: 14.5,
    mrp: 28.0,
    gstRate: 12,
    minReorderQty: 10,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified Sterile',
    scheme: '50+5 Free',
    inStock: true,
    packing: '1ml Ampoule',
    composition: 'Diclofenac Sodium 75mg / ml',
    form: 'Injection',
    manufacturer: 'Troikaa Pharmaceuticals Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    description: 'Fast-acting analgesic and anti-inflammatory injection.'
  },
  {
    _id: 'p-14',
    name: 'Pantoprazole Injection IP 40mg',
    brand: 'Lucid Pharma',
    company: 'Lucid Pharma',
    category: 'Injectables',
    sku: 'NP-PP-40',
    price: 32.0,
    mrp: 55.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 10,
    qualitySpecs: 'Lyophilized Sterile Vial',
    scheme: '20+2 Free',
    inStock: true,
    packing: '1 Vial (with Sterile Water 10ml)',
    composition: 'Pantoprazole Sodium IP 40mg',
    form: 'Injection',
    manufacturer: 'Lucid Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80',
    description: 'Proton pump inhibitor injection for acute gastric ulceration.'
  },
  {
    _id: 'p-15',
    name: 'Ceftriaxone Injection IP 1gm',
    brand: 'Namcare Pharma',
    company: 'Namcare Pharma',
    category: 'Injectables',
    sku: 'NP-CF-1G',
    price: 48.0,
    mrp: 82.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Sterile Crystalline',
    scheme: '20+2 Free',
    inStock: true,
    packing: '1 Vial with WFI',
    composition: 'Ceftriaxone Sodium IP 1g',
    form: 'Injection',
    manufacturer: 'Namcare Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    description: 'Broad-spectrum cephalosporin antibiotic injection.'
  },
  {
    _id: 'p-16',
    name: 'Ambroxol & Levosalbutamol Cough Syrup 100ml',
    brand: 'Leeford Healthcare',
    company: 'Leeford',
    category: 'Pharma Products',
    sku: 'NP-AMB-100',
    price: 36.0,
    mrp: 65.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 12,
    qualitySpecs: 'Sugar-Free Mucolytic',
    scheme: '12+1 Free',
    inStock: true,
    packing: '100ml PET Bottle',
    composition: 'Ambroxol HCl 30mg + Levosalbutamol 1mg + Guaiphenesin 50mg / 5ml',
    form: 'Syrup',
    manufacturer: 'Leeford Healthcare Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Bronchodilator and mucolytic syrup for productive cough.'
  },
  {
    _id: 'p-17',
    name: 'Normal Saline IV Fluid (0.9% NaCl)',
    brand: 'Biochem',
    company: 'Biochem',
    category: 'Surgical & Medical Supplies',
    sku: 'NP-NS-500',
    price: 26.5,
    mrp: 45.0,
    gstRate: 12,
    minReorderQty: 10,
    unitsPerBox: 24,
    qualitySpecs: 'FFS Sterile Infusion IP',
    scheme: '24+2 Free',
    inStock: true,
    packing: '500ml Euro-Head Bottle',
    composition: 'Sodium Chloride IP 0.9% w/v',
    form: 'IV Fluid',
    manufacturer: 'Biochem Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=400&q=80',
    description: 'Sterile solution for fluid replenishment and drug infusion.'
  },
  {
    _id: 'p-18',
    name: 'Sterile Surgical Gloves (Size 7)',
    brand: 'Steris Pharma',
    company: 'Steris Pharma',
    category: 'Surgical & Medical Supplies',
    sku: 'NP-SG-70',
    price: 8.5,
    mrp: 18.0,
    gstRate: 12,
    minReorderQty: 10,
    unitsPerBox: 50,
    qualitySpecs: 'CE & ISO 13485 Certified',
    scheme: '50+5 Free',
    inStock: true,
    packing: '1 Pair Pack',
    composition: 'Natural Rubber Latex Hypoallergenic',
    form: 'Surgical',
    manufacturer: 'Steris Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80',
    description: 'Micro-textured sterile surgical gloves for clinical handling.'
  },
  {
    _id: 'p-19',
    name: 'Paracetamol Tablet IP 500mg',
    brand: 'Cipla',
    company: 'Cipla',
    category: 'Pharma Products',
    sku: 'NP-PT-500',
    price: 16.5,
    mrp: 28.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 10,
    qualitySpecs: 'IP Standard WHO-GMP',
    scheme: '20+2 Free',
    inStock: true,
    packing: '10 x 10 Tablets',
    composition: 'Paracetamol IP 500mg',
    form: 'Tablet',
    manufacturer: 'Cipla Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Antipyretic and analgesic for fever and mild to moderate pain.'
  },
  {
    _id: 'p-20',
    name: 'Amoxicillin Capsule IP 250mg',
    brand: 'Sun Pharma',
    company: 'Sun Pharma',
    category: 'Pharma Products',
    sku: 'NP-AM-250',
    price: 24.0,
    mrp: 42.0,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '10 x 10 Capsules',
    composition: 'Amoxicillin Trihydrate IP 250mg',
    form: 'Capsule',
    manufacturer: 'Sun Pharmaceutical Industries Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
    description: 'Antibiotic for bacterial infections of respiratory and urinary tract.'
  },
  {
    _id: 'p-21',
    name: 'Azithromycin Tablet IP 500mg',
    brand: 'Abbott',
    company: 'Abbott',
    category: 'Pharma Products',
    sku: 'NP-AZ-500',
    price: 58.0,
    mrp: 95.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 10,
    qualitySpecs: 'USP Standard',
    scheme: '10+1 Free',
    inStock: true,
    packing: '1 x 3 Tablets',
    composition: 'Azithromycin Dihydrate IP 500mg',
    form: 'Tablet',
    manufacturer: 'Abbott India Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    description: 'Broad-spectrum macrolide antibiotic for respiratory and throat infections.'
  },
  {
    _id: 'p-22',
    name: 'Dolo 650 Tablet',
    brand: 'Healing Pharma',
    company: 'Healing Pharma',
    category: 'OTC Products',
    sku: 'NP-DL-650',
    price: 16.0,
    mrp: 30.5,
    gstRate: 12,
    minReorderQty: 5,
    unitsPerBox: 15,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '15+1 Free',
    inStock: true,
    packing: '15 Tablets Strip',
    composition: 'Paracetamol IP 650mg',
    form: 'Tablet',
    manufacturer: 'Healing Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Fast-acting paracetamol formulation for high fever and body ache.'
  },
  {
    _id: 'p-23',
    name: 'Montelukast & Levocetirizine Tablet',
    brand: 'Intas Pharmaceuticals',
    company: 'Intas',
    category: 'Pharma Products',
    sku: 'INT-MON-10',
    price: 68.0,
    mrp: 115.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '10 x 10 Tablets',
    composition: 'Montelukast Sodium 10mg + Levocetirizine HCl 5mg',
    form: 'Tablet',
    manufacturer: 'Intas Pharmaceuticals Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Antihistamine and leukotriene receptor antagonist for allergic rhinitis.'
  },
  {
    _id: 'p-24',
    name: 'Rabeprazole & Domperidone SR Capsule',
    brand: 'Alkem Laboratories',
    company: 'Alkem',
    category: 'Pharma Products',
    sku: 'ALK-RAB-DSR',
    price: 84.0,
    mrp: 140.0,
    gstRate: 12,
    minReorderQty: 3,
    unitsPerBox: 10,
    qualitySpecs: 'WHO-GMP Certified',
    scheme: '10+1 Free',
    inStock: true,
    packing: '10 x 10 Capsules',
    composition: 'Rabeprazole Sodium 20mg + Domperidone 30mg SR',
    form: 'Capsule',
    manufacturer: 'Alkem Laboratories Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    description: 'Proton pump inhibitor with prokinetic agent for GERD and acid reflux.'
  }
];

const ALL_FORMS = [
  'All',
  'Cream',
  'Drops',
  'Lotion',
  'Soap',
  'Spray',
  'Oil',
  'Ayurvedic',
  'Tablet',
  'Capsule',
  'Injection',
  'Syrup',
  'IV Fluid',
  'Surgical'
];

const DEFAULT_COMPANIES = [
  'All',
  'DAXIA',
  'Sun Pharma',
  'Cipla',
  'Leeford',
  'Intas',
  'Troikaa',
  'Abbott',
  'Alkem',
  'Zydus',
  'Biochem',
  'Namcare Pharma',
  'Healing Pharma',
  'Steris Pharma',
  'Lucid Pharma'
];

function QuickOrder() {
  // Retailer Header Info State
  const [shopName, setShopName] = useState('');
  const [retailerMobile, setRetailerMobile] = useState('');
  const [retailerEmail, setRetailerEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [destinationWhatsApp, setDestinationWhatsApp] = useState('9316566894');
  const [showConfig, setShowConfig] = useState(false);

  // Catalog & Filter State
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [companiesList, setCompaniesList] = useState(DEFAULT_COMPANIES);
  const [formsList, setFormsList] = useState(ALL_FORMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedForm, setSelectedForm] = useState('All');
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  // Box Quantities state: { [productId]: boxQtyNumber }
  const [boxQuantities, setBoxQuantities] = useState({});

  // Dispatch & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Retailer Ledger Modal State
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [statementSentMessage, setStatementSentMessage] = useState(false);

  // Load initial retailer info from localStorage or session
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('niyansh_retailer_info');
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed.shopName) setShopName(parsed.shopName);
        if (parsed.retailerMobile) setRetailerMobile(parsed.retailerMobile);
        if (parsed.retailerEmail) setRetailerEmail(parsed.retailerEmail);
        if (parsed.gstin) setGstin(parsed.gstin);
        if (parsed.destinationWhatsApp) setDestinationWhatsApp(parsed.destinationWhatsApp);
      } else {
        const savedUser = localStorage.getItem('niyansh_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.company || user.name) setShopName(user.company || user.name);
          if (user.phone || user.mobile) setRetailerMobile(user.phone || user.mobile);
          if (user.email) setRetailerEmail(user.email);
          if (user.gstin) setGstin(user.gstin);
        }
      }
    } catch (err) {
      console.error('Failed reading saved retailer info', err);
    }
  }, []);

  // Save retailer info to localStorage on change
  useEffect(() => {
    try {
      const info = {
        shopName,
        retailerMobile,
        retailerEmail,
        gstin,
        destinationWhatsApp
      };
      localStorage.setItem('niyansh_retailer_info', JSON.stringify(info));
    } catch (e) {
      console.error('Failed saving retailer info', e);
    }
  }, [shopName, retailerMobile, retailerEmail, gstin, destinationWhatsApp]);

  // Fetch live products & metadata filters
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        // Fetch products
        const prodRes = await fetch('/api/products?limit=1000');
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }

        // Fetch meta filters
        const metaRes = await fetch('/api/products/meta/filters');
        if (metaRes.ok) {
          const metaData = await metaRes.json();
          if (metaData.companies && metaData.companies.length > 0) {
            const combinedComp = ['All', ...new Set([...DEFAULT_COMPANIES.slice(1), ...metaData.companies])];
            setCompaniesList(combinedComp);
          }
          if (metaData.forms && metaData.forms.length > 0) {
            const combinedForms = ['All', ...new Set([...ALL_FORMS.slice(1), ...metaData.forms])];
            setFormsList(combinedForms);
          }
        }
      } catch (err) {
        console.warn('Using offline mock products for Quick Order matrix:', err);
      }
    };

    fetchCatalog();
  }, []);

  // Quantity Mutators
  const getBoxQty = (id) => boxQuantities[id] || 0;

  const setBoxQty = (id, qty) => {
    const parsed = Math.max(0, parseInt(qty, 10) || 0);
    setBoxQuantities((prev) => {
      if (parsed === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: parsed };
    });
  };

  const incrementBoxQty = (id, step = 1) => {
    const current = getBoxQty(id);
    setBoxQty(id, current + step);
  };

  const decrementBoxQty = (id, step = 1) => {
    const current = getBoxQty(id);
    if (current - step <= 0) {
      setBoxQty(id, 0);
    } else {
      setBoxQty(id, current - step);
    }
  };

  const setMoqQty = (product) => {
    const moq = product.minReorderQty || 1;
    setBoxQty(product._id, moq);
  };

  const clearAllQuantities = () => {
    setBoxQuantities({});
    setShowClearConfirm(false);
  };

  // Helper to parse trade scheme and calculate free bonus units
  const calculateSchemeBonus = (boxes, unitsPerBox, schemeStr) => {
    if (!boxes || !schemeStr) return { bonusBoxes: 0, bonusUnits: 0 };
    // Looks for patterns like "10+1 Free", "20+2 Free", "15+1 Free", "50+5 Free"
    const match = schemeStr.match(/(\d+)\s*\+\s*(\d+)/i);
    if (!match) return { bonusBoxes: 0, bonusUnits: 0 };
    const buyRequirement = parseInt(match[1], 10);
    const freeAward = parseInt(match[2], 10);
    if (buyRequirement > 0 && boxes >= buyRequirement) {
      const multiples = Math.floor(boxes / buyRequirement);
      const bonusBoxes = multiples * freeAward;
      const bonusUnits = bonusBoxes * unitsPerBox;
      return { bonusBoxes, bonusUnits };
    }
    return { bonusBoxes: 0, bonusUnits: 0 };
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Show only selected filter
      if (showOnlySelected && getBoxQty(item._id) === 0) {
        return false;
      }

      // Company filter
      if (selectedCompany !== 'All') {
        const itemComp = (item.company || item.brand || '').toLowerCase();
        if (!itemComp.includes(selectedCompany.toLowerCase())) {
          return false;
        }
      }

      // Form filter
      if (selectedForm !== 'All') {
        const itemForm = (item.form || '').toLowerCase();
        if (itemForm !== selectedForm.toLowerCase()) {
          return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const compMatch = (item.composition || '').toLowerCase().includes(q);
        const brandMatch = (item.brand || '').toLowerCase().includes(q);
        const companyMatch = (item.company || '').toLowerCase().includes(q);
        const formMatch = (item.form || '').toLowerCase().includes(q);
        const skuMatch = (item.sku || '').toLowerCase().includes(q);
        if (!nameMatch && !compMatch && !brandMatch && !companyMatch && !formMatch && !skuMatch) {
          return false;
        }
      }

      return true;
    });
  }, [products, showOnlySelected, selectedCompany, selectedForm, searchQuery, boxQuantities]);

  // Real-Time Commercial Wholesale Billing Calculations
  const commercialBilling = useMemo(() => {
    let totalSelectedItems = 0;
    let totalBoxes = 0;
    let totalUnits = 0;
    let taxableSubtotal = 0;
    let gst12Taxable = 0;
    let gst12Amount = 0;
    let gst18Taxable = 0;
    let gst18Amount = 0;
    let totalSchemeBonusUnits = 0;
    let totalSchemeBonusBoxes = 0;
    let totalSchemeSavings = 0;
    const lineItems = [];
    const moqWarnings = [];

    products.forEach((product) => {
      const boxes = boxQuantities[product._id] || 0;
      if (boxes > 0) {
        totalSelectedItems += 1;
        totalBoxes += boxes;
        const unitsPerBox = product.unitsPerBox || 10;
        const itemUnits = boxes * unitsPerBox;
        totalUnits += itemUnits;

        const unitPrice = parseFloat(product.price) || 0;
        const lineSubtotal = Math.round(itemUnits * unitPrice * 100) / 100;
        taxableSubtotal += lineSubtotal;

        const gstRate = product.gstRate !== undefined ? parseFloat(product.gstRate) : 12;
        const lineGst = Math.round(((lineSubtotal * gstRate) / 100) * 100) / 100;

        if (gstRate === 18) {
          gst18Taxable += lineSubtotal;
          gst18Amount += lineGst;
        } else {
          gst12Taxable += lineSubtotal;
          gst12Amount += lineGst;
        }

        const { bonusBoxes, bonusUnits } = calculateSchemeBonus(boxes, unitsPerBox, product.scheme);
        totalSchemeBonusBoxes += bonusBoxes;
        totalSchemeBonusUnits += bonusUnits;
        const schemeSavings = Math.round(bonusUnits * unitPrice * 100) / 100;
        totalSchemeSavings += schemeSavings;

        // MOQ verification
        const minMoq = product.minReorderQty || 1;
        if (boxes < minMoq) {
          moqWarnings.push({
            productId: product._id,
            name: product.name,
            current: boxes,
            required: minMoq
          });
        }

        lineItems.push({
          product: product._id,
          productName: product.name,
          company: product.company || product.brand || 'DAXIA',
          form: product.form || 'Tablet',
          composition: product.composition || '',
          packing: product.packing || '',
          unitsPerBox,
          boxes,
          totalUnits: itemUnits,
          unitPrice,
          mrp: product.mrp || unitPrice * 1.4,
          gstRate,
          lineSubtotal,
          lineGst,
          lineTotal: Math.round((lineSubtotal + lineGst) * 100) / 100,
          scheme: product.scheme || '',
          bonusBoxes,
          bonusUnits
        });
      }
    });

    const totalGstAmount = Math.round((gst12Amount + gst18Amount) * 100) / 100;
    const grandTotal = Math.round((taxableSubtotal + totalGstAmount) * 100) / 100;

    return {
      totalSelectedItems,
      totalBoxes,
      totalUnits,
      taxableSubtotal: Math.round(taxableSubtotal * 100) / 100,
      gst12Taxable: Math.round(gst12Taxable * 100) / 100,
      gst12Amount: Math.round(gst12Amount * 100) / 100,
      gst18Taxable: Math.round(gst18Taxable * 100) / 100,
      gst18Amount: Math.round(gst18Amount * 100) / 100,
      totalGstAmount,
      totalSchemeBonusBoxes,
      totalSchemeBonusUnits,
      totalSchemeSavings: Math.round(totalSchemeSavings * 100) / 100,
      grandTotal,
      lineItems,
      moqWarnings
    };
  }, [products, boxQuantities]);

  // Validation before ordering
  const validateOrder = () => {
    if (!shopName.trim()) {
      alert('Please enter your Medical Store / Chemist Name.');
      setShowConfig(true);
      return false;
    }
    if (!retailerMobile.trim() || retailerMobile.replace(/\D/g, '').length < 10) {
      alert('Please provide a valid 10-digit Retailer Mobile Number.');
      setShowConfig(true);
      return false;
    }
    if (commercialBilling.totalSelectedItems === 0) {
      alert('Your order grid is empty. Please select at least 1 product box quantity.');
      return false;
    }
    return true;
  };

  // Generate formatted WhatsApp message text matching Daxia Demo standard
  const generateWhatsAppText = (orderNo = `NP-ORD-${Date.now().toString().slice(-6)}`) => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const formattedItems = commercialBilling.lineItems
      .map((item, idx) => {
        const companyStr = item.company ? ` (${item.company})` : '';
        const schemeStr = item.scheme ? `\n   • Scheme: ${item.scheme}${item.bonusUnits > 0 ? ` (+${item.bonusUnits} Free Units)` : ''}` : '';
        return `${idx + 1}. *${item.productName}*${companyStr}\n   • Qty: ${item.boxes} Box${item.boxes > 1 ? 'es' : ''} (${item.totalUnits} Units)\n   • Rate: ₹${item.unitPrice.toFixed(2)} | Subtotal: ₹${item.lineSubtotal.toFixed(2)} (+${item.gstRate}% GST)${schemeStr}`;
      })
      .join('\n\n');

    const gstinLine = gstin.trim() ? `\n*GSTIN:* ${gstin.trim()}` : '';
    const schemeBonusLine = commercialBilling.totalSchemeBonusUnits > 0
      ? `\n*Estimated Scheme Bonus:* ${commercialBilling.totalSchemeBonusUnits} Units (~₹${commercialBilling.totalSchemeSavings.toFixed(2)} Free Value)`
      : '';

    const text = `📦 *NEW B2B ORDER - NIYANSH PHARMA*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${orderNo}
*Store Name:* ${shopName.trim()}
*Retailer Mobile:* ${retailerMobile.trim()}${gstinLine}
*Order Date:* ${dateStr}

*ORDERED ITEMS (${commercialBilling.totalSelectedItems} Items | ${commercialBilling.totalBoxes} Boxes | ${commercialBilling.totalUnits} Units):*
${formattedItems}

━━━━━━━━━━━━━━━━━━━━
*Subtotal (Taxable):* ₹${commercialBilling.taxableSubtotal.toFixed(2)}
*Total GST Tax:* ₹${commercialBilling.totalGstAmount.toFixed(2)}${schemeBonusLine}
*Grand Commercial Total:* ₹${commercialBilling.grandTotal.toFixed(2)}
*Payment Status:* Pending Wholesale Dispatch
*Order Status:* Booked via Quick Matrix
━━━━━━━━━━━━━━━━━━━━
_Niyansh Pharma B2B Ordering & Commercial Desk_
_Rajkot Wholesale Hub | Support: +91 9316566894_`;

    return text;
  };

  // 1. WhatsApp Order Booking & Server Persistence
  const handleWhatsAppBooking = async () => {
    if (!validateOrder()) return;

    setIsSubmitting(true);
    const orderNo = `NP-ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      orderNumber: orderNo,
      shopName: shopName.trim(),
      retailerMobile: retailerMobile.trim(),
      retailerEmail: retailerEmail.trim(),
      gstin: gstin.trim(),
      destinationWhatsApp: destinationWhatsApp.trim() || '9316566894',
      items: commercialBilling.lineItems.map((item) => ({
        product: item.product,
        productName: item.productName,
        company: item.company,
        form: item.form,
        boxes: item.boxes,
        unitsPerBox: item.unitsPerBox,
        totalUnits: item.totalUnits,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
        itemTotal: item.lineSubtotal
      })),
      discountAmount: commercialBilling.totalSchemeSavings,
      paymentStatus: 'Pending',
      orderStatus: 'Booked'
    };

    let whatsappDirectUrl = '';
    let savedOrderResult = null;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        savedOrderResult = data.order || payload;
        whatsappDirectUrl = data.whatsappUrl;
      }
    } catch (err) {
      console.warn('Backend order persistence fallback (offline mode):', err);
    }

    if (!whatsappDirectUrl) {
      const messageText = generateWhatsAppText(orderNo);
      const cleanPhone = (destinationWhatsApp || '9316566894').replace(/\D/g, '').replace(/^91/, '');
      const targetPhone = '91' + (cleanPhone || '9316566894');
      whatsappDirectUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(messageText)}`;
    }

    // Open WhatsApp in new tab
    window.open(whatsappDirectUrl, '_blank', 'noopener,noreferrer');

    // Display Success Modal
    setSuccessModalData({
      orderNumber: (savedOrderResult && savedOrderResult.orderNumber) || orderNo,
      timestamp: new Date().toLocaleString('en-IN'),
      grandTotal: commercialBilling.grandTotal,
      totalBoxes: commercialBilling.totalBoxes,
      totalUnits: commercialBilling.totalUnits,
      itemsCount: commercialBilling.totalSelectedItems,
      whatsappUrl: whatsappDirectUrl,
      shopName: shopName.trim(),
      retailerMobile: retailerMobile.trim()
    });

    setIsSubmitting(false);
  };

  // 2. CSV / Excel Export
  const handleExportCSV = () => {
    if (commercialBilling.totalSelectedItems === 0) {
      alert('Please select items in the matrix before downloading CSV.');
      return;
    }

    const orderNo = `NP-ORD-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const headers = [
      'Order No',
      'Order Date',
      'Store Name',
      'Retailer Mobile',
      'GSTIN',
      'Item Code / SKU',
      'Product Name',
      'Manufacturer / Company',
      'Formulation Form',
      'Composition',
      'Packing',
      'Units Per Box',
      'Ordered Boxes',
      'Total Units',
      'PTR Rate (₹)',
      'MRP (₹)',
      'GST %',
      'Line Subtotal (₹)',
      'Line GST (₹)',
      'Line Grand Total (₹)',
      'Trade Scheme',
      'Bonus Units'
    ];

    const rows = commercialBilling.lineItems.map((item) => [
      `"${orderNo}"`,
      `"${dateStr}"`,
      `"${shopName.replace(/"/g, '""') || 'Chemist'}"`,
      `"${retailerMobile || ''}"`,
      `"${gstin || ''}"`,
      `"${item.product || ''}"`,
      `"${item.productName.replace(/"/g, '""')}"`,
      `"${item.company.replace(/"/g, '""')}"`,
      `"${item.form}"`,
      `"${(item.composition || '').replace(/"/g, '""')}"`,
      `"${(item.packing || '').replace(/"/g, '""')}"`,
      item.unitsPerBox,
      item.boxes,
      item.totalUnits,
      item.unitPrice.toFixed(2),
      item.mrp.toFixed(2),
      `${item.gstRate}%`,
      item.lineSubtotal.toFixed(2),
      item.lineGst.toFixed(2),
      item.lineTotal.toFixed(2),
      `"${item.scheme || 'None'}"`,
      item.bonusUnits
    ]);

    // Footer summary row
    rows.push([]);
    rows.push([
      '"SUMMARY"',
      '""',
      '""',
      '""',
      '""',
      '""',
      `"Total Lines: ${commercialBilling.totalSelectedItems}"`,
      '""',
      '""',
      '""',
      '""',
      '""',
      `"Total Boxes: ${commercialBilling.totalBoxes}"`,
      `"Total Units: ${commercialBilling.totalUnits}"`,
      '""',
      '""',
      '""',
      `"Subtotal: ₹${commercialBilling.taxableSubtotal.toFixed(2)}"`,
      `"GST: ₹${commercialBilling.totalGstAmount.toFixed(2)}"`,
      `"Grand Total: ₹${commercialBilling.grandTotal.toFixed(2)}"`,
      `"Bonus Units: ${commercialBilling.totalSchemeBonusUnits}"`,
      '""'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => (Array.isArray(e) ? e.join(',') : ''))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Niyansh_Pharma_Order_${orderNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Email Dispatch Helper
  const handleSendEmail = () => {
    if (commercialBilling.totalSelectedItems === 0) {
      alert('Please select items before composing email.');
      return;
    }
    const orderNo = `NP-ORD-${Date.now().toString().slice(-6)}`;
    const subject = encodeURIComponent(`B2B Order Booking: ${shopName || 'Retailer'} - ${orderNo}`);
    const body = encodeURIComponent(generateWhatsAppText(orderNo).replace(/\*/g, ''));
    const mailtoUrl = `mailto:NiyanshPharma@gmail.com?cc=${encodeURIComponent(retailerEmail || '')}&subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  // 4. Print Wholesale Tax Invoice
  const handlePrintInvoice = () => {
    if (commercialBilling.totalSelectedItems === 0) {
      alert('Please select items to generate printable invoice.');
      return;
    }

    const orderNo = `NP-INV-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Niyansh Pharma - Wholesale Commercial Invoice ${orderNo}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #1e293b; line-height: 1.4; }
          .header { border-bottom: 2px solid #0c3d6c; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { color: #0c3d6c; font-size: 24px; font-weight: bold; margin-bottom: 4px; }
          .subtitle { font-size: 12px; color: #475569; }
          .inv-meta { text-align: right; }
          .badge { display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: bold; background: #e0f2fe; color: #0369a1; border-radius: 4px; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 13px; }
          .box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
          .box-title { font-weight: bold; color: #0c3d6c; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background: #f1f5f9; color: #0c3d6c; font-weight: bold; text-align: left; padding: 8px; border: 1px solid #cbd5e1; }
          td { padding: 8px; border: 1px solid #e2e8f0; }
          .text-right { text-align: right; }
          .summary-table { width: 320px; margin-left: auto; margin-top: 20px; border-collapse: collapse; }
          .summary-table td { padding: 6px 10px; border: 1px solid #cbd5e1; font-size: 13px; }
          .grand-total { font-weight: bold; font-size: 16px; background: #f8fafc; color: #0c3d6c; }
          .footer { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 15px; display: flex; justify-content: space-between; }
          @media print {
            button { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">NIYANSH PHARMA</div>
            <div class="subtitle">Wholesale Pharmaceutical & Healthcare Distributors</div>
            <div class="subtitle">Rajkot Wholesale Hub, Gujarat | DL No: G/20B/12984, G/21B/12985</div>
            <div class="subtitle">GSTIN: 24AAACN9128P1Z8 | Contact: +91 9316566894, +91 99099 23130</div>
          </div>
          <div class="inv-meta">
            <span class="badge">B2B TAX INVOICE</span>
            <div style="font-weight: bold; margin-top: 8px; font-size: 14px;"># ${orderNo}</div>
            <div style="font-size: 12px; color: #64748b;">Date: ${dateStr}</div>
          </div>
        </div>

        <div class="details">
          <div class="box">
            <div class="box-title">BILLED TO (RETAILER / CHEMIST)</div>
            <div><strong>Store Name:</strong> ${shopName || 'Retail Chemist Store'}</div>
            <div><strong>Mobile:</strong> ${retailerMobile || 'N/A'}</div>
            <div><strong>Email:</strong> ${retailerEmail || 'N/A'}</div>
            <div><strong>GSTIN:</strong> ${gstin || 'Unregistered / B2C'}</div>
          </div>
          <div class="box">
            <div class="box-title">DISPATCH & PAYMENT TERMS</div>
            <div><strong>Dispatch Hub:</strong> Niyansh Pharma Logistics Desk</div>
            <div><strong>Payment Mode:</strong> Bank NEFT / RTGS / Instant UPI</div>
            <div><strong>UPI ID:</strong> 9316566894@okbizaxis</div>
            <div><strong>Account Status:</strong> Verified B2B Trade Dispatch</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Product Name & Composition</th>
              <th>Company</th>
              <th>Form</th>
              <th class="text-right">Boxes</th>
              <th class="text-right">Units</th>
              <th class="text-right">PTR Rate (₹)</th>
              <th class="text-right">GST %</th>
              <th class="text-right">Subtotal (₹)</th>
              <th class="text-right">Total with GST (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${commercialBilling.lineItems
              .map(
                (item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <strong>${item.productName}</strong><br/>
                  <span style="font-size: 10px; color: #64748b;">${item.composition || ''} [${item.packing || ''}]</span>
                  ${item.scheme ? `<br/><span style="font-size: 10px; color: #ea580c; font-weight: bold;">Scheme: ${item.scheme}</span>` : ''}
                </td>
                <td>${item.company}</td>
                <td>${item.form}</td>
                <td class="text-right">${item.boxes}</td>
                <td class="text-right">${item.totalUnits}</td>
                <td class="text-right">${item.unitPrice.toFixed(2)}</td>
                <td class="text-right">${item.gstRate}%</td>
                <td class="text-right">${item.lineSubtotal.toFixed(2)}</td>
                <td class="text-right"><strong>${item.lineTotal.toFixed(2)}</strong></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <table class="summary-table">
          <tr>
            <td>Total Items / Boxes</td>
            <td class="text-right">${commercialBilling.totalSelectedItems} Items (${commercialBilling.totalBoxes} Boxes)</td>
          </tr>
          <tr>
            <td>Taxable Subtotal</td>
            <td class="text-right">₹${commercialBilling.taxableSubtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Total GST (12% / 18%)</td>
            <td class="text-right">₹${commercialBilling.totalGstAmount.toFixed(2)}</td>
          </tr>
          ${
            commercialBilling.totalSchemeSavings > 0
              ? `
          <tr>
            <td style="color: #16a34a; font-weight: bold;">Trade Scheme Free Value</td>
            <td class="text-right" style="color: #16a34a; font-weight: bold;">-₹${commercialBilling.totalSchemeSavings.toFixed(2)}</td>
          </tr>`
              : ''
          }
          <tr class="grand-total">
            <td>Grand Commercial Total</td>
            <td class="text-right">₹${commercialBilling.grandTotal.toFixed(2)}</td>
          </tr>
        </table>

        <div class="footer">
          <div>
            <strong>Terms & Conditions:</strong><br/>
            1. Goods once sold will not be returned unless batch verified for transit damage within 24 hours.<br/>
            2. Payment to be cleared within credit terms to maintain uninterrupted dispatch quota.
          </div>
          <div style="text-align: right;">
            <br/><br/>
            <strong>For NIYANSH PHARMA</strong><br/>
            Authorized Signatory
          </div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
      setTimeout(() => {
        printWin.focus();
        printWin.print();
      }, 500);
    }
  };

  // 5. Fetch & Open Retailer Outstanding Ledger
  const handleOpenLedger = async (mobileNumberToFetch) => {
    const targetMobile = (mobileNumberToFetch || retailerMobile || '').trim();
    if (!targetMobile) {
      alert('Please enter a valid Retailer Mobile Number to view Outstanding Ledger.');
      setShowConfig(true);
      return;
    }

    setIsLedgerOpen(true);
    setLedgerLoading(true);
    setStatementSentMessage(false);

    try {
      const response = await fetch(`/api/ledger/${targetMobile}?shopName=${encodeURIComponent(shopName || 'Retailer')}`);
      if (!response.ok) throw new Error('Could not fetch ledger from server');
      const data = await response.json();
      if (data.ledger) {
        setLedgerData(data.ledger);
      } else {
        throw new Error('Ledger data not found');
      }
    } catch (err) {
      console.warn('Ledger fetch fallback mock:', err);
      // Fallback mock ledger
      setLedgerData({
        retailerMobile: targetMobile,
        shopName: shopName || 'Retailer Pharmacy',
        email: retailerEmail || 'pharmacy@gmail.com',
        gstin: gstin || '24AAACS1234F1Z5',
        totalBilled: 125000,
        totalPaid: 85000,
        outstandingBalance: 40000,
        creditLimit: 150000,
        invoices: [
          {
            invoiceNumber: 'INV-2026-0812',
            date: new Date(Date.now() - 20 * 86400000).toISOString(),
            dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
            amount: 45000,
            paidAmount: 45000,
            balance: 0,
            status: 'Paid'
          },
          {
            invoiceNumber: 'INV-2026-0888',
            date: new Date(Date.now() - 5 * 86400000).toISOString(),
            dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
            amount: 40000,
            paidAmount: 0,
            balance: 40000,
            status: 'Pending'
          }
        ],
        payments: [
          {
            paymentId: 'PMT-9812',
            date: new Date(Date.now() - 10 * 86400000).toISOString(),
            amount: 45000,
            method: 'UPI',
            transactionRef: 'UPI/260810381920',
            notes: 'Cleared INV-2026-0812'
          }
        ]
      });
    } finally {
      setLedgerLoading(false);
    }
  };

  // Share Statement on WhatsApp
  const handleSendStatementWhatsApp = async () => {
    if (!ledgerData) return;
    try {
      const res = await fetch('/api/ledger/send-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retailerMobile: ledgerData.retailerMobile })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
          setStatementSentMessage(true);
        }
      }
    } catch (e) {
      console.error('Error sending statement:', e);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Top Breadcrumb & Quick Portal Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
          color: '#ffffff',
          padding: '30px 0 25px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 20px rgba(12, 61, 108, 0.15)'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', color: '#ffedd5' }}>
                <Flame size={14} color="#f97316" /> High-Speed B2B Commercial Booking
              </div>
              <h1 style={{ color: '#ffffff', fontSize: '1.9rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                Wholesale Quick Order Matrix
              </h1>
              <p style={{ color: '#e0f2fe', fontSize: '0.92rem', margin: '6px 0 0 0', maxWidth: '650px' }}>
                Live PTR pricing, trade scheme bonuses, instant GST calculation, multi-channel WhatsApp dispatch & commercial CSV export.
              </p>
            </div>

            {/* View Mode Switcher & Ledger Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenLedger()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <CreditCard size={15} /> Outstanding Ledger
              </button>

              <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '3px', borderRadius: '8px' }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                    color: viewMode === 'table' ? '#0c3d6c' : '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Table size={15} /> Matrix Grid
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'card' ? '#ffffff' : 'transparent',
                    color: viewMode === 'card' ? '#0c3d6c' : '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Grid size={15} /> Card View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '25px' }}>
        {/* Retailer Information Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1b75bc',
                  border: '1px solid #bfdbfe'
                }}
              >
                <Store size={22} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {shopName.trim() ? shopName : 'Set Retailer Store Profile'}
                  </span>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                    Wholesale B2B
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.82rem', color: '#64748b', marginTop: '2px', flexWrap: 'wrap' }}>
                  <span>📱 <strong>Mobile:</strong> {retailerMobile || 'Not configured'}</span>
                  {gstin && <span>🏛️ <strong>GSTIN:</strong> {gstin}</span>}
                  <span>🚀 <strong>Dispatch Desk:</strong> +91 {destinationWhatsApp}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowConfig(!showConfig)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  backgroundColor: showConfig ? '#e2e8f0' : '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                {showConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showConfig ? 'Hide Profile Fields' : 'Edit Booking Details'}
              </button>
            </div>
          </div>

          {/* Expandable Retailer Form Configuration */}
          {showConfig && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Chemist / Store Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shanti Medical Store"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Retailer Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9825012345"
                  value={retailerMobile}
                  onChange={(e) => setRetailerMobile(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Retailer Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. pharmacy@gmail.com"
                  value={retailerEmail}
                  onChange={(e) => setRetailerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  GSTIN Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24AAACS1234F1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Destination WhatsApp Desk
                </label>
                <input
                  type="text"
                  placeholder="9316566894"
                  value={destinationWhatsApp}
                  onChange={(e) => setDestinationWhatsApp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Filters & Search Header */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Top Search & Company Filter Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search products by brand, medicine name, composition (e.g. Acetylcysteine, Paracetamol)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Company Dropdown Filter */}
            <div style={{ minWidth: '180px' }}>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: '#334155'
                }}
              >
                {companiesList.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp === 'All' ? '🏢 All Companies' : comp}
                  </option>
                ))}
              </select>
            </div>

            {/* Only In-Cart Items Toggle Button */}
            <button
              onClick={() => setShowOnlySelected(!showOnlySelected)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 15px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: showOnlySelected ? '#0c3d6c' : '#f1f5f9',
                color: showOnlySelected ? '#ffffff' : '#334155',
                border: showOnlySelected ? '1px solid #0c3d6c' : '1px solid #cbd5e1',
                transition: 'all 0.2s ease'
              }}
            >
              <ShoppingCart size={15} />
              <span>In-Cart ({commercialBilling.totalSelectedItems})</span>
            </button>

            {/* Clear All Filters Button */}
            {(searchQuery || selectedCompany !== 'All' || selectedForm !== 'All' || showOnlySelected) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCompany('All');
                  setSelectedForm('All');
                  setShowOnlySelected(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  backgroundColor: '#fee2e2',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            )}
          </div>

          {/* Formulation Form Filter Pills */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Filter by Formulation Form:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {formsList.map((formName) => {
                const isSelected = selectedForm.toLowerCase() === formName.toLowerCase();
                return (
                  <button
                    key={formName}
                    onClick={() => setSelectedForm(formName)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? '700' : '600',
                      border: isSelected ? '1px solid #0c3d6c' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#0c3d6c' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {formName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main 2-Column Portal Grid: Matrix / Catalog + Live Commercial Sidebar */}
        <div className="quickorder-matrix-layout">
          
          {/* LEFT COLUMN: Product Catalog / Matrix Grid */}
          <div>
            {/* Filter Count Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
                Showing <strong>{filteredProducts.length}</strong> products
                {selectedCompany !== 'All' && <span> • Company: <strong>{selectedCompany}</strong></span>}
                {selectedForm !== 'All' && <span> • Form: <strong>{selectedForm}</strong></span>}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Box Stepper: Direct type or click <strong>+5 / +10</strong>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '60px 20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}
              >
                <Package size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>No medicines found</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 16px auto' }}>
                  No pharmaceutical formulations matched your current search filters. Try adjusting your query or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCompany('All');
                    setSelectedForm('All');
                    setShowOnlySelected(false);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* TABLE / MATRIX VIEW MODE */}
            {viewMode === 'table' && filteredProducts.length > 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#0c3d6c', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '12px 14px', width: '38%', verticalAlign: 'middle' }}>Product & Composition</th>
                        <th style={{ padding: '12px 12px', width: '16%', verticalAlign: 'middle' }}>Pack & MOQ</th>
                        <th style={{ padding: '12px 12px', width: '18%', verticalAlign: 'middle' }}>Wholesale PTR & Scheme</th>
                        <th style={{ padding: '12px 12px', width: '28%', verticalAlign: 'middle' }}>Box Qty Stepper & Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const boxQty = getBoxQty(product._id);
                        const isSelected = boxQty > 0;
                        const unitsPerBox = product.unitsPerBox || 10;
                        const totalUnits = boxQty * unitsPerBox;
                        const lineSubtotal = Math.round(totalUnits * (product.price || 0) * 100) / 100;
                        const lineGst = Math.round((lineSubtotal * (product.gstRate || 12) / 100) * 100) / 100;
                        const lineTotal = Math.round((lineSubtotal + lineGst) * 100) / 100;
                        const isDaxia = (product.company || product.brand || '').toUpperCase().includes('DAXIA');
                        const isMoqViolated = isSelected && boxQty < (product.minReorderQty || 1);

                        return (
                          <tr
                            key={product._id}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                              transition: 'background-color 0.15s ease'
                            }}
                          >
                            {/* Column 1: Product & Composition */}
                            <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setBoxQty(product._id, product.minReorderQty || 1);
                                    } else {
                                      setBoxQty(product._id, 0);
                                    }
                                  }}
                                  style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#0c3d6c' }}
                                />
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.92rem' }}>
                                      {product.name}
                                    </span>
                                    {isDaxia ? (
                                      <span style={{ fontSize: '0.7rem', fontWeight: '800', backgroundColor: '#0c3d6c', color: '#ffffff', padding: '1px 6px', borderRadius: '4px' }}>
                                        DAXIA
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                                        {product.company || product.brand}
                                      </span>
                                    )}
                                  </div>

                                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', lineHeight: '1.3' }}>
                                    {product.composition}
                                  </div>

                                  <div style={{ display: 'flex', gap: '6px', marginTop: '5px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '600', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1px 7px', borderRadius: '10px' }}>
                                      {product.form || 'Tablet'}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '600', backgroundColor: '#f0fdf4', color: '#15803d', padding: '1px 7px', borderRadius: '10px' }}>
                                      {product.qualitySpecs || 'WHO-GMP Certified'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Column 2: Pack & MOQ */}
                            <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155' }}>
                                {product.packing || `${unitsPerBox} Units/Box`}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                {unitsPerBox} units / box
                              </div>
                              <div style={{ marginTop: '5px' }}>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: isMoqViolated ? '#fee2e2' : '#f8fafc',
                                    color: isMoqViolated ? '#dc2626' : '#64748b',
                                    border: isMoqViolated ? '1px solid #f87171' : '1px solid #e2e8f0'
                                  }}
                                >
                                  MOQ: {product.minReorderQty || 1} Box{(product.minReorderQty || 1) > 1 ? 'es' : ''}
                                </span>
                              </div>
                            </td>

                            {/* Column 3: PTR & Schemes */}
                            <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0c3d6c' }}>
                                  ₹{product.price?.toFixed(2)}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                  ₹{product.mrp?.toFixed(2)}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                GST: {product.gstRate || 12}%
                              </div>

                              {product.scheme && (
                                <div style={{ marginTop: '4px' }}>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      fontSize: '0.72rem',
                                      fontWeight: '800',
                                      backgroundColor: '#ffedd5',
                                      color: '#ea580c',
                                      padding: '2px 7px',
                                      borderRadius: '4px',
                                      border: '1px solid #fed7aa'
                                    }}
                                  >
                                    <Flame size={11} /> {product.scheme}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Column 4: Stepper & Calculated Total */}
                            <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                {/* Stepper Box */}
                                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#ffffff', height: '30px' }}>
                                  <button
                                    onClick={() => decrementBoxQty(product._id)}
                                    disabled={boxQty === 0}
                                    style={{
                                      width: '28px',
                                      height: '30px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: boxQty === 0 ? '#f1f5f9' : '#e2e8f0',
                                      border: 'none',
                                      cursor: boxQty === 0 ? 'not-allowed' : 'pointer',
                                      color: '#334155'
                                    }}
                                  >
                                    <Minus size={13} />
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={boxQty === 0 ? '' : boxQty}
                                    placeholder="0"
                                    onChange={(e) => setBoxQty(product._id, e.target.value)}
                                    style={{
                                      width: '45px',
                                      height: '30px',
                                      lineHeight: '30px',
                                      textAlign: 'center',
                                      border: 'none',
                                      fontSize: '0.88rem',
                                      fontWeight: '700',
                                      outline: 'none',
                                      padding: 0,
                                      margin: 0,
                                      color: boxQty > 0 ? '#0c3d6c' : '#94a3b8'
                                    }}
                                  />
                                  <button
                                    onClick={() => incrementBoxQty(product._id)}
                                    style={{
                                      width: '28px',
                                      height: '30px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: '#0c3d6c',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: '#ffffff'
                                    }}
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>

                                {/* Quick Add Badges */}
                                <button
                                  onClick={() => incrementBoxQty(product._id, 5)}
                                  title="Add +5 Boxes"
                                  style={{
                                    height: '30px',
                                    padding: '0 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => incrementBoxQty(product._id, 10)}
                                  title="Add +10 Boxes"
                                  style={{
                                    height: '30px',
                                    padding: '0 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => setMoqQty(product)}
                                  title={`Set to MOQ (${product.minReorderQty || 1})`}
                                  style={{
                                    height: '30px',
                                    padding: '0 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    backgroundColor: '#eff6ff',
                                    color: '#1b75bc',
                                    border: '1px solid #bfdbfe',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  MOQ
                                </button>
                              </div>

                              {/* Calculated Total for line */}
                              {isSelected && (
                                <div style={{ marginTop: '6px', fontSize: '0.78rem' }}>
                                  <span style={{ color: '#475569' }}>
                                    {totalUnits} Units = <strong>₹{lineTotal.toFixed(2)}</strong>
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '4px' }}>
                                    (incl. GST)
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CARD VIEW MODE */}
            {viewMode === 'card' && filteredProducts.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {filteredProducts.map((product) => {
                  const boxQty = getBoxQty(product._id);
                  const isSelected = boxQty > 0;
                  const unitsPerBox = product.unitsPerBox || 10;
                  const totalUnits = boxQty * unitsPerBox;
                  const lineSubtotal = Math.round(totalUnits * (product.price || 0) * 100) / 100;
                  const lineGst = Math.round((lineSubtotal * (product.gstRate || 12) / 100) * 100) / 100;
                  const lineTotal = Math.round((lineSubtotal + lineGst) * 100) / 100;
                  const isDaxia = (product.company || product.brand || '').toUpperCase().includes('DAXIA');

                  return (
                    <div
                      key={product._id}
                      style={{
                        backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: isSelected ? '0 4px 15px rgba(34, 197, 94, 0.15)' : '0 2px 10px rgba(0,0,0,0.03)',
                        border: isSelected ? '2px solid #22c55e' : '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: isDaxia ? '#0c3d6c' : '#f1f5f9', color: isDaxia ? '#ffffff' : '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                            {product.company || product.brand}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: '600', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px' }}>
                            {product.form}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: '10px 0 4px 0', lineHeight: '1.3' }}>
                          {product.name}
                        </h3>

                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px', minHeight: '32px' }}>
                          {product.composition}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#475569', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px' }}>
                          <span>Pack: <strong>{product.packing || `${unitsPerBox} Units/Box`}</strong></span>
                          <span>MOQ: <strong>{product.minReorderQty || 1} Box</strong></span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0c3d6c' }}>
                              ₹{product.price?.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
                              ₹{product.mrp?.toFixed(2)}
                            </span>
                          </div>
                          {product.scheme && (
                            <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#ffedd5', color: '#ea580c', padding: '2px 6px', borderRadius: '4px' }}>
                              🔥 {product.scheme}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Stepper & Action */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                            <button
                              onClick={() => decrementBoxQty(product._id)}
                              disabled={boxQty === 0}
                              style={{ width: '28px', height: '30px', border: 'none', backgroundColor: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={boxQty === 0 ? '' : boxQty}
                              placeholder="0"
                              onChange={(e) => setBoxQty(product._id, e.target.value)}
                              style={{ width: '45px', height: '30px', textAlign: 'center', border: 'none', fontWeight: '700', outline: 'none' }}
                            />
                            <button
                              onClick={() => incrementBoxQty(product._id)}
                              style={{ width: '28px', height: '30px', border: 'none', backgroundColor: '#0c3d6c', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => incrementBoxQty(product._id, 5)}
                              style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                            >
                              +5
                            </button>
                            <button
                              onClick={() => incrementBoxQty(product._id, 10)}
                              style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                            >
                              +10
                            </button>
                          </div>
                        </div>

                        {isSelected && (
                          <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#15803d', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{totalUnits} Units</span>
                            <span>₹{lineTotal.toFixed(2)} (inc. GST)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Commercial Wholesale Billing Sidebar */}
          <div className="sticky-form-desktop" style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 4px 25px rgba(12, 61, 108, 0.08)',
                border: '1px solid #cbd5e1'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={20} color="#0c3d6c" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0c3d6c', margin: 0 }}>
                    Commercial Billing
                  </h3>
                </div>
                {commercialBilling.totalSelectedItems > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    title="Reset order"
                    style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <RotateCcw size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Order Item Count Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Selected</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0c3d6c' }}>{commercialBilling.totalSelectedItems}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Boxes</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0c3d6c' }}>{commercialBilling.totalBoxes}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Units</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0c3d6c' }}>{commercialBilling.totalUnits}</div>
                </div>
              </div>

              {/* Line items preview / breakdown */}
              <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
                  <span>Taxable Subtotal (PTR)</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{commercialBilling.taxableSubtotal.toFixed(2)}</span>
                </div>

                {commercialBilling.gst12Amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>GST @ 12%</span>
                    <span>+₹{commercialBilling.gst12Amount.toFixed(2)}</span>
                  </div>
                )}

                {commercialBilling.gst18Amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>GST @ 18%</span>
                    <span>+₹{commercialBilling.gst18Amount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  <span>Total GST Tax Amount</span>
                  <span style={{ fontWeight: '600' }}>₹{commercialBilling.totalGstAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Trade Scheme Savings Estimate */}
              {commercialBilling.totalSchemeBonusUnits > 0 && (
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '14px',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: '800' }}>
                    <Sparkles size={15} /> Trade Scheme Bonus Earned!
                  </div>
                  <div style={{ color: '#065f46', marginTop: '3px', fontSize: '0.78rem' }}>
                    • Free Bonus Units: <strong>+{commercialBilling.totalSchemeBonusUnits} Units</strong> ({commercialBilling.totalSchemeBonusBoxes} Free Boxes)
                  </div>
                  <div style={{ color: '#065f46', fontSize: '0.78rem' }}>
                    • Estimated Scheme Benefit: <strong>₹{commercialBilling.totalSchemeSavings.toFixed(2)}</strong>
                  </div>
                </div>
              )}

              {/* MOQ Warnings Alert */}
              {commercialBilling.moqWarnings.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '14px',
                    fontSize: '0.78rem',
                    color: '#92400e'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', marginBottom: '4px' }}>
                    <AlertTriangle size={14} color="#d97706" /> MOQ Minimum Order Alerts ({commercialBilling.moqWarnings.length})
                  </div>
                  {commercialBilling.moqWarnings.slice(0, 2).map((w) => (
                    <div key={w.productId} style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                      • {w.name}: <strong>{w.current} / {w.required} req.</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Grand Commercial Total Display */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #86efac',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>
                    Grand Commercial Total
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>Inclusive of all Taxes</div>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#15803d' }}>
                  ₹{commercialBilling.grandTotal.toFixed(2)}
                </div>
              </div>

              {/* Multi-Channel Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {/* 1. Send Order on WhatsApp */}
                <button
                  onClick={handleWhatsAppBooking}
                  disabled={isSubmitting || commercialBilling.totalSelectedItems === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    cursor: commercialBilling.totalSelectedItems === 0 ? 'not-allowed' : 'pointer',
                    opacity: commercialBilling.totalSelectedItems === 0 ? 0.6 : 1,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Send size={16} /> Send Order on WhatsApp
                </button>

                {/* 2. Download CSV / Excel */}
                <button
                  onClick={handleExportCSV}
                  disabled={commercialBilling.totalSelectedItems === 0}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: '#0c3d6c',
                    color: '#ffffff',
                    border: 'none',
                    cursor: commercialBilling.totalSelectedItems === 0 ? 'not-allowed' : 'pointer',
                    opacity: commercialBilling.totalSelectedItems === 0 ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FileSpreadsheet size={15} /> Download CSV / Excel
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {/* 3. Print Invoice */}
                  <button
                    onClick={handlePrintInvoice}
                    disabled={commercialBilling.totalSelectedItems === 0}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: commercialBilling.totalSelectedItems === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Printer size={14} /> Print Invoice
                  </button>

                  {/* 4. Send via Email */}
                  <button
                    onClick={handleSendEmail}
                    disabled={commercialBilling.totalSelectedItems === 0}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: commercialBilling.totalSelectedItems === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Mail size={14} /> Email PO
                  </button>
                </div>
              </div>

              {/* Delivery / Wholesale Trust Strip */}
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b', lineHeight: '1.4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px', color: '#0c3d6c', fontWeight: '700' }}>
                  <ShieldCheck size={14} color="#16a34a" /> 100% Genuine Wholesale Guarantee
                </div>
                Orders are processed directly from Niyansh Pharma Rajkot Warehouse with complete batch documentation and GST tax invoice.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ORDER BOOKING SUCCESS MODAL */}
      {successModalData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSuccessModalData(null)}
              style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  color: '#16a34a'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                Order Booked Successfully!
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Your B2B order has been generated and queued for wholesale dispatch.
              </p>
            </div>

            {/* Order Details Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Order Number:</span>
                <span style={{ fontWeight: '800', color: '#0c3d6c' }}>{successModalData.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Store Name:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{successModalData.shopName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Items / Boxes:</span>
                <span style={{ fontWeight: '600' }}>
                  {successModalData.itemsCount} Items ({successModalData.totalBoxes} Boxes / {successModalData.totalUnits} Units)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Booking Time:</span>
                <span>{successModalData.timestamp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0', fontSize: '1rem', fontWeight: '800', color: '#15803d' }}>
                <span>Grand Total:</span>
                <span>₹{successModalData.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={successModalData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  textDecoration: 'none'
                }}
              >
                <Send size={16} /> Re-Open WhatsApp Order Dispatch
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    backgroundColor: '#0c3d6c',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Download CSV
                </button>

                <button
                  onClick={handlePrintInvoice}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={14} /> Print Invoice
                </button>
              </div>

              <button
                onClick={() => {
                  setSuccessModalData(null);
                  handleOpenLedger(successModalData.retailerMobile);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  backgroundColor: '#eff6ff',
                  color: '#1b75bc',
                  border: '1px solid #bfdbfe',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={15} /> View Retailer Outstanding Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RETAILER OUTSTANDING LEDGER MODAL */}
      {isLedgerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsLedgerOpen(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
                <CreditCard size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Retailer Outstanding Ledger
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {ledgerData ? `${ledgerData.shopName} (📱 ${ledgerData.retailerMobile})` : 'Loading statement...'}
                </div>
              </div>
            </div>

            {ledgerLoading && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <RefreshCw size={28} className="animate-spin" color="#0c3d6c" style={{ margin: '0 auto 10px auto' }} />
                <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Fetching real-time ledger statement from server...</p>
              </div>
            )}

            {!ledgerLoading && ledgerData && (
              <div>
                {/* Ledger Financial Summary Tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: '700', textTransform: 'uppercase' }}>Outstanding Due</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#dc2626', marginTop: '2px' }}>
                      ₹{ledgerData.outstandingBalance?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>Total Paid</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#16a34a', marginTop: '2px' }}>
                      ₹{ledgerData.totalPaid?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Billed</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0c3d6c', marginTop: '2px' }}>
                      ₹{ledgerData.totalBilled?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: '700', textTransform: 'uppercase' }}>Credit Limit</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#2563eb', marginTop: '2px' }}>
                      ₹{ledgerData.creditLimit?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Instant UPI Pay Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#ffffff',
                    marginBottom: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#bae6fd', fontWeight: '700' }}>
                      Instant Dues Settlement (0% Surcharge)
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', marginTop: '2px' }}>
                      UPI ID: 9316566894@okbizaxis
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#e0f2fe', marginTop: '2px' }}>
                      Pay using Google Pay, PhonePe, Paytm, or BHIM UPI
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`upi://pay?pa=9316566894@okbizaxis&pn=Niyansh%20Pharma&am=${ledgerData.outstandingBalance || 0}&cu=INR&tn=Wholesale%20Ledger%20Settlement`}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#22c55e',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <QrCode size={15} /> Pay via UPI
                    </a>
                  </div>
                </div>

                {/* Recent Invoices Table */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3d6c', marginBottom: '8px' }}>
                    Invoices & Due Tracking
                  </div>
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                          <th style={{ padding: '8px 10px' }}>Invoice No</th>
                          <th style={{ padding: '8px 10px' }}>Date</th>
                          <th style={{ padding: '8px 10px' }}>Amount</th>
                          <th style={{ padding: '8px 10px' }}>Balance Due</th>
                          <th style={{ padding: '8px 10px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(ledgerData.invoices || []).length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#94a3b8' }}>
                              No past invoices found for this account.
                            </td>
                          </tr>
                        ) : (
                          (ledgerData.invoices || []).map((inv, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '8px 10px', fontWeight: '700', color: '#0c3d6c' }}>{inv.invoiceNumber}</td>
                              <td style={{ padding: '8px 10px', color: '#64748b' }}>{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', fontWeight: '600' }}>₹{inv.amount?.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', fontWeight: '700', color: inv.balance > 0 ? '#dc2626' : '#16a34a' }}>
                                ₹{inv.balance?.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    padding: '2px 7px',
                                    borderRadius: '12px',
                                    backgroundColor: inv.status === 'Paid' ? '#dcfce7' : inv.status === 'Overdue' ? '#fee2e2' : '#fef3c7',
                                    color: inv.status === 'Paid' ? '#15803d' : inv.status === 'Overdue' ? '#b91c1c' : '#b45309'
                                  }}
                                >
                                  {inv.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* WhatsApp Statement Dispatch Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={handleSendStatementWhatsApp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={14} /> Send Statement to WhatsApp
                  </button>

                  {statementSentMessage && (
                    <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
                      Statement dispatched!
                    </span>
                  )}

                  <button
                    onClick={() => setIsLedgerOpen(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: CLEAR ORDER */}
      {showClearConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 30px rgba(0,0,0,0.15)'
            }}
          >
            <AlertTriangle size={36} color="#dc2626" style={{ margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '6px' }}>Reset Order Quantities?</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Are you sure you want to clear all box quantities selected in the matrix? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={clearAllQuantities}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickOrder;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Lock, LayoutDashboard, ShoppingBag, MessageSquare, Briefcase, LogOut, 
  Plus, Edit2, Truck, Trash2, CheckCircle2, XCircle, ChevronDown, Download, AlertCircle,
  Package, FileText, Flame, Phone, Search, RefreshCw, Filter, ExternalLink,
  Calendar, CreditCard, Check, X, Eye, Send, ArrowUpDown, User, Building2,
  Tag, ShieldCheck, Sparkles, Clock, AlertTriangle, Printer, Share2, Receipt,
  TrendingUp, Percent, Upload, Image as ImageIcon, Star, Grid, List,
  FileSpreadsheet, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Layers,
  Copy, CheckCheck
} from 'lucide-react';

// ==========================================
// FALLBACK DATASETS FOR OFFLINE / ROBUST DEMO
// ==========================================

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
    category: 'Pharma Products',
    sku: 'DAX-CLO-GM',
    price: 48.0,
    mrp: 75.0,
    inStock: true,
    packing: '15g Tube',
    composition: 'Clobetasol Propionate 0.05% + Neomycin 0.5% + Miconazole 2.0%',
    form: 'Ointment',
    manufacturer: 'Daxia Healthcare Pvt. Ltd.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    description: 'Broad-spectrum anti-inflammatory, antibacterial & antifungal topical cream.'
  },
  {
    _id: 'p-5',
    name: 'Ceftriaxone 1gm Injection',
    brand: 'General Critical Care',
    company: 'General',
    category: 'Injectables',
    sku: 'GEN-CEF-1G',
    price: 42.0,
    mrp: 68.0,
    inStock: true,
    packing: 'Vial with WFI',
    composition: 'Ceftriaxone Sodium Sterile IP 1000mg',
    form: 'Injection',
    manufacturer: 'Niyansh Pharma Partner Units',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80',
    description: 'Third-generation cephalosporin antibiotic injection for hospital use.'
  }
];

const FALLBACK_ORDERS = [
  {
    _id: 'ord-101',
    orderNumber: 'NP-ORD-881290-4102',
    shopName: 'Shanti Medico',
    retailerMobile: '9825012345',
    retailerEmail: 'shanti.medico@gmail.com',
    gstin: '24AAACS1234F1Z5',
    destinationWhatsApp: '9316566894',
    items: [
      {
        product: 'p-1',
        productName: 'MUCIDAX 600 TAB',
        company: 'DAXIA',
        form: 'Tablet',
        boxes: 5,
        unitsPerBox: 10,
        totalUnits: 50,
        unitPrice: 185.0,
        gstRate: 12,
        itemTotal: 9250.0
      },
      {
        product: 'p-2',
        productName: 'AMLOSKY - 2.5 TAB',
        company: 'DAXIA',
        form: 'Tablet',
        boxes: 10,
        unitsPerBox: 10,
        totalUnits: 100,
        unitPrice: 28.5,
        gstRate: 12,
        itemTotal: 2850.0
      }
    ],
    subTotal: 12100.0,
    gstAmount: 1452.0,
    discountAmount: 500.0,
    grandTotal: 13052.0,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2026-08-22T14:20:00.000Z'
  },
  {
    _id: 'ord-102',
    orderNumber: 'NP-ORD-773412-8821',
    shopName: 'Patel Pharmacy',
    retailerMobile: '9876543210',
    retailerEmail: 'patel.pharmacy@gmail.com',
    gstin: '24ABCDE5678G1Z2',
    destinationWhatsApp: '9316566894',
    items: [
      {
        product: 'p-3',
        productName: 'BENIDAX 4 mg TAB',
        company: 'DAXIA',
        form: 'Tablet',
        boxes: 8,
        unitsPerBox: 10,
        totalUnits: 80,
        unitPrice: 72.0,
        gstRate: 12,
        itemTotal: 5760.0
      },
      {
        product: 'p-4',
        productName: 'CLOBEDAX-GM CREAM 15g',
        company: 'DAXIA',
        form: 'Ointment',
        boxes: 12,
        unitsPerBox: 1,
        totalUnits: 12,
        unitPrice: 48.0,
        gstRate: 12,
        itemTotal: 576.0
      }
    ],
    subTotal: 6336.0,
    gstAmount: 760.32,
    discountAmount: 0.0,
    grandTotal: 7096.32,
    paymentStatus: 'Partially Paid',
    orderStatus: 'Dispatched',
    createdAt: '2026-08-23T10:15:00.000Z'
  },
  {
    _id: 'ord-103',
    orderNumber: 'NP-ORD-654129-3390',
    shopName: 'Krishna Medical & Surgical',
    retailerMobile: '9428123456',
    retailerEmail: 'krishna.meds.rajkot@yahoo.com',
    gstin: '24XYZPA9988Q1Z4',
    destinationWhatsApp: '9316566894',
    items: [
      {
        product: 'p-5',
        productName: 'Ceftriaxone 1gm Injection',
        company: 'General',
        form: 'Injection',
        boxes: 20,
        unitsPerBox: 1,
        totalUnits: 20,
        unitPrice: 42.0,
        gstRate: 12,
        itemTotal: 840.0
      },
      {
        product: 'p-1',
        productName: 'MUCIDAX 600 TAB',
        company: 'DAXIA',
        form: 'Tablet',
        boxes: 4,
        unitsPerBox: 10,
        totalUnits: 40,
        unitPrice: 185.0,
        gstRate: 12,
        itemTotal: 7400.0
      }
    ],
    subTotal: 8240.0,
    gstAmount: 988.8,
    discountAmount: 300.0,
    grandTotal: 8928.8,
    paymentStatus: 'Pending',
    orderStatus: 'Confirmed',
    createdAt: '2026-08-23T12:45:00.000Z'
  },
  {
    _id: 'ord-104',
    orderNumber: 'NP-ORD-519823-1104',
    shopName: 'Maruti Pharma Chemist',
    retailerMobile: '9909988776',
    retailerEmail: 'maruti.pharma@gmail.com',
    gstin: '24JKLMN4321P1Z9',
    destinationWhatsApp: '9316566894',
    items: [
      {
        product: 'p-2',
        productName: 'AMLOSKY - 2.5 TAB',
        company: 'DAXIA',
        form: 'Tablet',
        boxes: 15,
        unitsPerBox: 10,
        totalUnits: 150,
        unitPrice: 28.5,
        gstRate: 12,
        itemTotal: 4275.0
      }
    ],
    subTotal: 4275.0,
    gstAmount: 513.0,
    discountAmount: 0.0,
    grandTotal: 4788.0,
    paymentStatus: 'Pending',
    orderStatus: 'Booked',
    createdAt: '2026-08-23T16:30:00.000Z'
  }
];

const FALLBACK_LEDGERS = [
  {
    _id: 'led-1',
    retailerMobile: '9825012345',
    shopName: 'Shanti Medico',
    email: 'shanti.medico@gmail.com',
    gstin: '24AAACS1234F1Z5',
    totalBilled: 145200,
    totalPaid: 98000,
    outstandingBalance: 47200,
    creditLimit: 150000,
    invoices: [
      {
        invoiceNumber: 'INV-2026-0801',
        date: '2026-07-15T00:00:00.000Z',
        dueDate: '2026-08-05T00:00:00.000Z',
        amount: 32000,
        paidAmount: 32000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0824',
        date: '2026-07-28T00:00:00.000Z',
        dueDate: '2026-08-18T00:00:00.000Z',
        amount: 66000,
        paidAmount: 66000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0872',
        date: '2026-08-05T00:00:00.000Z',
        dueDate: '2026-08-26T00:00:00.000Z',
        amount: 28500,
        paidAmount: 0,
        balance: 28500,
        status: 'Pending',
      },
      {
        invoiceNumber: 'INV-2026-0899',
        date: '2026-08-14T00:00:00.000Z',
        dueDate: '2026-08-21T00:00:00.000Z',
        amount: 18700,
        paidAmount: 0,
        balance: 18700,
        status: 'Overdue',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-1001',
        date: '2026-07-25T14:30:00.000Z',
        amount: 32000,
        method: 'UPI',
        transactionRef: 'UPI/260725183921',
        notes: 'Cleared against INV-2026-0801',
      },
      {
        paymentId: 'PMT-1002',
        date: '2026-08-10T11:15:00.000Z',
        amount: 66000,
        method: 'NetBanking',
        transactionRef: 'NEFT/HDFC26081029',
        notes: 'Full payment INV-2026-0824',
      },
    ],
  },
  {
    _id: 'led-2',
    retailerMobile: '9876543210',
    shopName: 'Patel Pharmacy',
    email: 'patel.pharmacy.ahmedabad@gmail.com',
    gstin: '24ABCDE5678G1Z2',
    totalBilled: 220000,
    totalPaid: 145000,
    outstandingBalance: 75000,
    creditLimit: 200000,
    invoices: [
      {
        invoiceNumber: 'INV-2026-0710',
        date: '2026-06-20T00:00:00.000Z',
        dueDate: '2026-07-11T00:00:00.000Z',
        amount: 85000,
        paidAmount: 85000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0785',
        date: '2026-07-10T00:00:00.000Z',
        dueDate: '2026-07-31T00:00:00.000Z',
        amount: 60000,
        paidAmount: 60000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0830',
        date: '2026-08-01T00:00:00.000Z',
        dueDate: '2026-08-20T00:00:00.000Z',
        amount: 75000,
        paidAmount: 0,
        balance: 75000,
        status: 'Overdue',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-2001',
        date: '2026-07-05T16:00:00.000Z',
        amount: 85000,
        method: 'Cheque',
        transactionRef: 'CHQ-448102-SBI',
        notes: 'Cheque cleared INV-0710',
      },
      {
        paymentId: 'PMT-2002',
        date: '2026-07-28T12:00:00.000Z',
        amount: 60000,
        method: 'RTGS',
        transactionRef: 'RTGS/AXIS26072899',
        notes: 'Cleared INV-0785',
      },
    ],
  },
  {
    _id: 'led-3',
    retailerMobile: '9428123456',
    shopName: 'Krishna Medical & Surgical',
    email: 'krishna.meds.rajkot@yahoo.com',
    gstin: '24XYZPA9988Q1Z4',
    totalBilled: 310000,
    totalPaid: 195000,
    outstandingBalance: 115000,
    creditLimit: 120000,
    invoices: [
      {
        invoiceNumber: 'INV-2026-0740',
        date: '2026-07-02T00:00:00.000Z',
        dueDate: '2026-07-22T00:00:00.000Z',
        amount: 120000,
        paidAmount: 120000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0815',
        date: '2026-07-24T00:00:00.000Z',
        dueDate: '2026-08-14T00:00:00.000Z',
        amount: 75000,
        paidAmount: 75000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0888',
        date: '2026-08-08T00:00:00.000Z',
        dueDate: '2026-08-20T00:00:00.000Z',
        amount: 115000,
        paidAmount: 0,
        balance: 115000,
        status: 'Overdue',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-3001',
        date: '2026-07-20T10:00:00.000Z',
        amount: 120000,
        method: 'NetBanking',
        transactionRef: 'NEFT/ICICI26072044',
        notes: 'Settled INV-0740',
      },
      {
        paymentId: 'PMT-3002',
        date: '2026-08-12T14:30:00.000Z',
        amount: 75000,
        method: 'UPI',
        transactionRef: 'UPI/260812998811',
        notes: 'Settled INV-0815',
      },
    ],
  },
  {
    _id: 'led-4',
    retailerMobile: '9909988776',
    shopName: 'Maruti Pharma Chemist',
    email: 'maruti.pharma@gmail.com',
    gstin: '24JKLMN4321P1Z9',
    totalBilled: 85000,
    totalPaid: 85000,
    outstandingBalance: 0,
    creditLimit: 100000,
    invoices: [
      {
        invoiceNumber: 'INV-2026-0845',
        date: '2026-08-02T00:00:00.000Z',
        dueDate: '2026-08-23T00:00:00.000Z',
        amount: 85000,
        paidAmount: 85000,
        balance: 0,
        status: 'Paid',
      }
    ],
    payments: [
      {
        paymentId: 'PMT-4001',
        date: '2026-08-18T11:00:00.000Z',
        amount: 85000,
        method: 'UPI',
        transactionRef: 'UPI/260818331122',
        notes: 'Full payment INV-0845',
      }
    ],
  }
];

const FALLBACK_NEWS = [
  {
    _id: 'news-1',
    title: 'Special Monsoon Scheme: Buy 10 Get 1 Free on all Daxia Formulations',
    content: 'Avail 10+1 free bonus strip on Mucidax 600, Clobedax-GM Cream, and Moxidax-D drops throughout this month. Fast dispatch and standard WHO-GMP quality guaranteed across Gujarat.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: '2026-09-30T23:59:59.000Z',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    _id: 'news-2',
    title: 'New Product Launch: Lulidax 1% Cream 30g & Ketodax 2% Soap',
    content: 'High-potency dermatological range now available in bulk for wholesale booking. Attractive PTR rates with WHO-GMP certification. Order today for prompt delivery to pharmacies and clinics.',
    category: 'New Launch',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 2,
    expiryDate: '2026-10-15T23:59:59.000Z',
    createdAt: '2026-08-19T14:30:00.000Z'
  },
  {
    _id: 'news-3',
    title: 'Price Drop Alert: Ceftriaxone 1gm & Pantoprazole 40mg Injections',
    content: 'Direct manufacturer PTR reduced by 8% on hospital critical care injectable batches. Check revised pricing in Quick Order portal or contact our wholesale distribution desk.',
    category: 'Price Update',
    company: 'General',
    isTickerActive: true,
    priority: 3,
    expiryDate: '2026-09-15T23:59:59.000Z',
    createdAt: '2026-08-18T09:15:00.000Z'
  },
  {
    _id: 'news-4',
    title: 'Ayurvedic Rasayan & Herbal Joint Oils Special 15+2 Scheme',
    content: 'Order 15 boxes of Mahavishgarbha Pain Oil (100ml) or Ashwagandhadax Rasayan (200ml) and receive 2 complimentary retail boxes plus promotional counter display standees.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: '2026-09-25T23:59:59.000Z',
    createdAt: '2026-08-17T11:45:00.000Z'
  },
  {
    _id: 'news-5',
    title: 'GST Regulatory Notice: E-Invoicing Updates for Pharma Retailers',
    content: 'Please ensure valid 15-digit GSTIN is updated on your retailer profile for automated QR code tax invoices and seamless input tax credit reconciliation.',
    category: 'Notice',
    company: 'General',
    isTickerActive: false,
    priority: 4,
    expiryDate: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-08-16T08:00:00.000Z'
  }
];

// Formatting helper
const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

function Admin() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Database / Live States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [news, setNews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState('');
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState('All');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  // Form Fields for Add/Edit Company
  const [compName, setCompName] = useState('');
  const [compCategory, setCompCategory] = useState('Pharmaceutical Formulations');
  const [compLocation, setCompLocation] = useState('India');
  const [compWebsiteUrl, setCompWebsiteUrl] = useState('');
  const [compLogoUrl, setCompLogoUrl] = useState('');
  const [compDescription, setCompDescription] = useState('');
  const [compSpecialties, setCompSpecialties] = useState('');
  const [compIsPublished, setCompIsPublished] = useState(true);
  const [compIsVerified, setCompIsVerified] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  // Product Manager Filter & View States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');
  const [productActiveFilter, setProductActiveFilter] = useState('All');
  const [productSort, setProductSort] = useState('newest');
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' | 'grid'
  const [productPage, setProductPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(25);
  const [productAdminStats, setProductAdminStats] = useState(null);
  
  // Orders Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');

  // Ledger Filter States
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('All');

  // News Filter States
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('All');
  const [newsCompanyFilter, setNewsCompanyFilter] = useState('All');

  // Enquiry Filter State
  const [enquiryFilter, setEnquiryFilter] = useState('All');

  // Modals & Drawers States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [photoDragActive, setPhotoDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [selectedOrder, setSelectedOrder] = useState(null); // Full breakdown modal
  const [selectedLedger, setSelectedLedger] = useState(null); // Statement modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Manual payment modal
  const [paymentLedger, setPaymentLedger] = useState(null);

  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Form Fields for Add/Edit Product
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCompany, setProdCompany] = useState('DAXIA');
  const [prodCategory, setProdCategory] = useState('Pharma Products');
  const [prodCustomCategory, setProdCustomCategory] = useState('');
  const [prodSubCategory, setProdSubCategory] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMrp, setProdMrp] = useState('');
  const [prodStockQuantity, setProdStockQuantity] = useState('100');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodIsActive, setProdIsActive] = useState(true);
  const [prodPacking, setProdPacking] = useState('');
  const [prodComposition, setProdComposition] = useState('');
  const [prodForm, setProdForm] = useState('Tablet');
  const [prodManufacturer, setProdManufacturer] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodImages, setProdImages] = useState([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // Bulk Import States
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkImportResults, setBulkImportResults] = useState(null);
  const [isImportingBulk, setIsImportingBulk] = useState(false);

  // Form Fields for Manual Payment
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);

  // Form Fields for News / Scheme
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState('Scheme');
  const [newsCompany, setNewsCompany] = useState('DAXIA');
  const [newsPriority, setNewsPriority] = useState(1);
  const [newsExpiryDate, setNewsExpiryDate] = useState('');
  const [newsIsTickerActive, setNewsIsTickerActive] = useState(true);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [adminToken, setAdminToken] = useState(localStorage.getItem('niyansh_admin_token') || '');

  // Helper for auth headers
  const getAuthHeaders = () => {
    const token = adminToken || localStorage.getItem('niyansh_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Check login on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('niyansh_admin_session');
    const token = localStorage.getItem('niyansh_admin_token');
    if (adminSession === 'active' || token) {
      setIsAuthenticated(true);
      if (token) setAdminToken(token);
    }
  }, []);

  // Fetch all dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Products
      try {
        const prodRes = await fetch('/api/products/admin/all?limit=1000', {
          headers: getAuthHeaders(),
        });
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products && prodData.products.length > 0 ? prodData.products : FALLBACK_PRODUCTS);
          if (prodData.stats) setProductAdminStats(prodData.stats);
        } else {
          const fallbackRes = await fetch('/api/products?limit=1000');
          if (fallbackRes.ok) {
            const prodData = await fallbackRes.json();
            setProducts(prodData.products && prodData.products.length > 0 ? prodData.products : FALLBACK_PRODUCTS);
          } else {
            setProducts(FALLBACK_PRODUCTS);
          }
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      }

      // 2. Fetch Orders
      try {
        const ordRes = await fetch('/api/orders?limit=100');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders && ordData.orders.length > 0 ? ordData.orders : FALLBACK_ORDERS);
        } else {
          setOrders(FALLBACK_ORDERS);
        }
      } catch {
        setOrders(FALLBACK_ORDERS);
      }

      // 3. Fetch Ledgers
      try {
        const ledRes = await fetch('/api/ledger?limit=100');
        if (ledRes.ok) {
          const ledData = await ledRes.json();
          setLedgers(ledData.ledgers && ledData.ledgers.length > 0 ? ledData.ledgers : FALLBACK_LEDGERS);
        } else {
          setLedgers(FALLBACK_LEDGERS);
        }
      } catch {
        setLedgers(FALLBACK_LEDGERS);
      }

      // 4. Fetch News / Schemes
      try {
        const newsRes = await fetch('/api/news?limit=100');
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData.news && newsData.news.length > 0 ? newsData.news : FALLBACK_NEWS);
        } else {
          setNews(FALLBACK_NEWS);
        }
      } catch {
        setNews(FALLBACK_NEWS);
      }

      // 5. Fetch Enquiries
      try {
        const enqRes = await fetch('/api/enquiries');
        if (enqRes.ok) {
          const enqData = await enqRes.json();
          setEnquiries(enqData || []);
        } else {
          setEnquiries([]);
        }
      } catch {
        setEnquiries([]);
      }

      // 6. Fetch Careers
      try {
        const carRes = await fetch('/api/careers');
        if (carRes.ok) {
          const carData = await carRes.json();
          setCareers(carData || []);
        } else {
          setCareers([]);
        }
      } catch {
        setCareers([]);
      }

      // 7. Fetch Companies
      try {
        const compRes = await fetch('/api/companies?limit=500&admin=true');
        if (compRes.ok) {
          const compData = await compRes.json();
          setCompanies(compData.companies || []);
        } else {
          setCompanies([]);
        }
      } catch {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setIsAuthenticated(true);
        setAdminToken(data.token);
        localStorage.setItem('niyansh_admin_session', 'active');
        localStorage.setItem('niyansh_admin_token', data.token);
        showToast('Welcome back, Admin! Live console connected.');
        return;
      }
    } catch (err) {
      console.warn('Backend login attempt failed, checking local credentials fallback:', err);
    } finally {
      setIsLoading(false);
    }

    // Demo fallback login if backend unreachable
    if (email === 'admin@niyanshpharma.com' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('niyansh_admin_session', 'active');
      setLoginError('');
      showToast('Welcome back, Admin! (Offline demo session active)');
    } else {
      setLoginError('Invalid email or password. Use demo credentials: admin@niyanshpharma.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    localStorage.removeItem('niyansh_admin_session');
    localStorage.removeItem('niyansh_admin_token');
  };

  // ==========================================
  // B2B ORDERS HANDLERS
  // ==========================================

  const handleUpdateOrderStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    try {
      const payload = {};
      if (newOrderStatus) payload.orderStatus = newOrderStatus;
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });


      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
        showToast(`Order #${data.order.orderNumber} status updated to ${newOrderStatus || newPaymentStatus}!`);
      } else {
        // Fallback local state update
        setOrders(prev => prev.map(o => {
          if (o._id === orderId) {
            return {
              ...o,
              ...(newOrderStatus ? { orderStatus: newOrderStatus } : {}),
              ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {})
            };
          }
          return o;
        }));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({
            ...prev,
            ...(newOrderStatus ? { orderStatus: newOrderStatus } : {}),
            ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {})
          }));
        }
        showToast(`Order status updated locally!`);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      // Local fallback
      setOrders(prev => prev.map(o => {
        if (o._id === orderId) {
          return {
            ...o,
            ...(newOrderStatus ? { orderStatus: newOrderStatus } : {}),
            ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {})
          };
        }
        return o;
      }));
      showToast(`Order status updated!`);
    }
  };

  const getWhatsAppDispatchUrl = (order) => {
    const dateStr = formatDate(order.createdAt);
    const itemsText = (order.items || []).map((item, idx) => 
      `${idx + 1}. *${item.productName}* (${item.company || 'DAXIA'})\n   Qty: ${item.boxes} Box (${item.totalUnits || item.boxes * 10} Units) | Total: ₹${(item.itemTotal || 0).toFixed(2)}`
    ).join('\n');

    const msg = `📦 *NIYANSH PHARMA - B2B ORDER UPDATE*
━━━━━━━━━━━━━━━━━━━━
*Order Number:* ${order.orderNumber}
*Store Name:* ${order.shopName}
*Date:* ${dateStr}
*Status:* ${order.orderStatus || 'Confirmed'}
*Payment:* ${order.paymentStatus || 'Pending'}

*ORDER ITEMS:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
*Grand Total:* ₹${(order.grandTotal || 0).toFixed(2)}
━━━━━━━━━━━━━━━━━━━━
Your order is being processed for expedited dispatch.
_For assistance: +91 9316566894_`;

    const cleanPhone = (order.retailerMobile || '9316566894').replace(/\D/g, '').replace(/^91/, '');
    return `https://api.whatsapp.com/send?phone=91${cleanPhone || '9316566894'}&text=${encodeURIComponent(msg)}`;
  };

  const handleDownloadOrdersCSV = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const now = new Date();
    const dateISO = now.toISOString().split('T')[0];
    const todayFormatted = formatDate(now);

    const metaHeader = [
      `"NIYANSH PHARMA - B2B WHOLESALE ORDERS & INVOICES LIST"`,
      `"Export Date: ${todayFormatted}","Total Orders: ${filteredOrders.length}"`,
      '""'
    ];

    const headers = [
      'Invoice / Order Number',
      'Invoice Date',
      'Shop Name',
      'Retailer Mobile',
      'GSTIN',
      'Items Count',
      'Subtotal (INR)',
      'GST (INR)',
      'Discount (INR)',
      'Grand Total (INR)',
      'Payment Status',
      'Order Status',
      'Items Summary'
    ];

    let sumSubtotal = 0;
    let sumGst = 0;
    let sumGrand = 0;

    const rows = filteredOrders.map(ord => {
      const itemsSummary = (ord.items || [])
        .map(i => `${i.productName} (${i.boxes} Box)`)
        .join('; ')
        .replace(/"/g, '""');

      const ordDate = ord.createdAt
        ? formatDate(ord.createdAt)
        : ord.date
        ? formatDate(ord.date)
        : todayFormatted;

      sumSubtotal += (ord.subTotal || 0);
      sumGst += (ord.gstAmount || 0);
      sumGrand += (ord.grandTotal || 0);

      return [
        `"${ord.orderNumber}"`,
        `"${ordDate}"`,
        `"${(ord.shopName || '').replace(/"/g, '""')}"`,
        `"${ord.retailerMobile || ''}"`,
        `"${ord.gstin || ''}"`,
        ord.items ? ord.items.length : 0,
        (ord.subTotal || 0).toFixed(2),
        (ord.gstAmount || 0).toFixed(2),
        (ord.discountAmount || 0).toFixed(2),
        (ord.grandTotal || 0).toFixed(2),
        `"${ord.paymentStatus || 'Pending'}"`,
        `"${ord.orderStatus || 'Booked'}"`,
        `"${itemsSummary}"`
      ].join(',');
    });

    // Summary footer row
    const footerSummary = [
      '',
      [
        '"SUMMARY"',
        `"Date: ${todayFormatted}"`,
        `"Total Orders: ${filteredOrders.length}"`,
        '""',
        '""',
        '""',
        sumSubtotal.toFixed(2),
        sumGst.toFixed(2),
        '""',
        sumGrand.toFixed(2),
        '""',
        '""',
        '""'
      ].join(',')
    ];

    const csvContent = '\uFEFF' + [...metaHeader, headers.join(','), ...rows, ...footerSummary].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `niyansh_pharma_b2b_invoices_orders_${dateISO}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders & Invoices CSV exported successfully!');
  };

  // Export single order commercial invoice to Excel
  const handleExportSingleOrderInvoiceCSV = (order) => {
    if (!order) return;
    const now = new Date();
    const dateISO = now.toISOString().split('T')[0];
    const orderDateStr = order.createdAt ? formatDate(order.createdAt) : formatDate(now);
    const invoiceNo = order.orderNumber || `NP-INV-${Date.now().toString().slice(-6)}`;

    const metaHeader = [
      `"NIYANSH PHARMA - B2B WHOLESALE TAX INVOICE"`,
      `"Invoice No: ${invoiceNo}","Invoice Date: ${orderDateStr}","Store Name: ${(order.shopName || 'Chemist Store').replace(/"/g, '""')}","Retailer Mobile: ${order.retailerMobile || 'N/A'}","GSTIN: ${order.gstin || 'N/A'}"`,
      '""'
    ];

    const headers = [
      'Line #',
      'Invoice No',
      'Invoice Date',
      'Product Name',
      'Manufacturer / Company',
      'Formulation Form',
      'Ordered Boxes',
      'Total Units',
      'PTR Rate (₹)',
      'GST %',
      'Item Total (₹)'
    ];

    const rows = (order.items || []).map((item, idx) => [
      idx + 1,
      `"${invoiceNo}"`,
      `"${orderDateStr}"`,
      `"${(item.productName || '').replace(/"/g, '""')}"`,
      `"${(item.company || 'DAXIA').replace(/"/g, '""')}"`,
      `"${item.form || 'Tablet'}"`,
      item.boxes || 1,
      item.totalUnits || (item.boxes || 1) * 10,
      (item.unitPrice || 0).toFixed(2),
      `${item.gstRate || 12}%`,
      (item.itemTotal || (item.totalUnits || (item.boxes || 1) * 10) * (item.unitPrice || 0)).toFixed(2)
    ]);

    // Footer summary row
    rows.push([]);
    rows.push([
      '"SUMMARY"',
      `"Date: ${orderDateStr}"`,
      `"${(order.shopName || 'Chemist').replace(/"/g, '""')}"`,
      '""',
      '""',
      '""',
      `"Total Lines: ${(order.items || []).length}"`,
      '""',
      `"Subtotal: ₹${(order.subTotal || 0).toFixed(2)}"`,
      `"GST: ₹${(order.gstAmount || 0).toFixed(2)}"`,
      `"Grand Total: ₹${(order.grandTotal || 0).toFixed(2)}"`
    ]);

    const csvContent = '\uFEFF' + [...metaHeader, headers.join(','), ...rows.map(e => (Array.isArray(e) ? e.join(',') : ''))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Niyansh_Pharma_Invoice_${invoiceNo}_${dateISO}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Invoice for Order #${invoiceNo} exported successfully!`);
  };

  // Export retailer ledger invoices breakdown to Excel
  const handleExportLedgerInvoicesCSV = (ledger) => {
    if (!ledger) return;
    const now = new Date();
    const dateISO = now.toISOString().split('T')[0];
    const todayFormatted = formatDate(now);

    const metaHeader = [
      `"NIYANSH PHARMA - RETAILER STATEMENT & INVOICES"`,
      `"Retailer: ${(ledger.shopName || 'Chemist').replace(/"/g, '""')}","Mobile: ${ledger.retailerMobile || 'N/A'}","GSTIN: ${ledger.gstin || 'N/A'}","Statement Date: ${todayFormatted}"`,
      '""'
    ];

    const headers = [
      'Invoice No',
      'Invoice Date',
      'Due Date',
      'Invoice Amount (₹)',
      'Paid Amount (₹)',
      'Outstanding Balance (₹)',
      'Status'
    ];

    const rows = (ledger.invoices || []).map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${formatDate(inv.date)}"`,
      `"${formatDate(inv.dueDate)}"`,
      (inv.amount || 0).toFixed(2),
      (inv.paidAmount || 0).toFixed(2),
      (inv.balance || 0).toFixed(2),
      `"${inv.status || 'Pending'}"`
    ]);

    // Footer summary row
    rows.push([]);
    rows.push([
      '"TOTAL SUMMARY"',
      `"Date: ${todayFormatted}"`,
      '""',
      `"${(ledger.totalBilled || 0).toFixed(2)}"`,
      `"${(ledger.totalPaid || 0).toFixed(2)}"`,
      `"${(ledger.outstandingBalance || 0).toFixed(2)}"`,
      `"Credit Limit: ₹${ledger.creditLimit || 0}"`
    ]);

    const csvContent = '\uFEFF' + [...metaHeader, headers.join(','), ...rows.map(e => (Array.isArray(e) ? e.join(',') : ''))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Invoices_${(ledger.shopName || 'Retailer').replace(/\s+/g, '_')}_${dateISO}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Invoices statement exported successfully!`);
  };

  // ==========================================
  // LEDGER & OUTSTANDING HANDLERS
  // ==========================================

  const handleOpenPaymentModal = (ledger) => {
    setPaymentLedger(ledger);
    setPayAmount(ledger.outstandingBalance > 0 ? ledger.outstandingBalance.toString() : '');
    setPayMethod('UPI');
    setPayRef('');
    setPayNotes(`Payment recorded by Admin against outstanding balance`);
    setPayDate(new Date().toISOString().split('T')[0]);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentLedger) return;

    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid positive payment amount.');
      return;
    }

    try {
      const payload = {
        retailerMobile: paymentLedger.retailerMobile,
        amount: amountNum,
        method: payMethod,
        transactionRef: payRef,
        notes: payNotes,
        date: payDate
      };

      const res = await fetch('/api/ledger/payment', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setLedgers(prev => prev.map(l => l.retailerMobile === paymentLedger.retailerMobile ? data.ledger : l));
        if (selectedLedger && selectedLedger.retailerMobile === paymentLedger.retailerMobile) {
          setSelectedLedger(data.ledger);
        }
        showToast(`Payment of ₹${amountNum.toFixed(2)} recorded for ${paymentLedger.shopName}!`);
      } else {
        // Fallback local update
        applyLocalPayment(paymentLedger.retailerMobile, amountNum, payMethod, payRef, payNotes, payDate);
        showToast(`Payment recorded locally for ${paymentLedger.shopName}!`);
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      applyLocalPayment(paymentLedger.retailerMobile, amountNum, payMethod, payRef, payNotes, payDate);
      showToast(`Payment recorded for ${paymentLedger.shopName}!`);
    } finally {
      setIsPaymentModalOpen(false);
    }
  };

  const applyLocalPayment = (mobile, amount, method, ref, notes, date) => {
    setLedgers(prev => prev.map(ledger => {
      if (ledger.retailerMobile === mobile) {
        let remaining = amount;
        const updatedInvoices = (ledger.invoices || []).map(inv => {
          if (inv.balance > 0 && remaining > 0) {
            if (remaining >= inv.balance) {
              const paid = inv.balance;
              remaining -= paid;
              return { ...inv, paidAmount: (inv.paidAmount || 0) + paid, balance: 0, status: 'Paid' };
            } else {
              const newBal = inv.balance - remaining;
              const newPaid = (inv.paidAmount || 0) + remaining;
              remaining = 0;
              return { ...inv, paidAmount: newPaid, balance: newBal, status: 'Partial' };
            }
          }
          return inv;
        });

        const newTotalPaid = (ledger.totalPaid || 0) + amount;
        const newOutstanding = Math.max(0, (ledger.outstandingBalance || 0) - amount);
        const newPayment = {
          paymentId: `PMT-${Date.now().toString().slice(-4)}`,
          date: new Date(date).toISOString(),
          amount,
          method,
          transactionRef: ref,
          notes
        };

        const updated = {
          ...ledger,
          totalPaid: newTotalPaid,
          outstandingBalance: newOutstanding,
          invoices: updatedInvoices,
          payments: [newPayment, ...(ledger.payments || [])]
        };

        if (selectedLedger && selectedLedger.retailerMobile === mobile) {
          setSelectedLedger(updated);
        }
        return updated;
      }
      return ledger;
    }));
  };

  const handleSendStatementWhatsApp = async (ledger) => {
    try {
      const res = await fetch('/api/ledger/send-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retailerMobile: ledger.retailerMobile })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
          showToast(`WhatsApp statement generated for ${ledger.shopName}!`);
          return;
        }
      }
    } catch (err) {
      console.warn('API send-statement error, using client link:', err);
    }

    // Client fallback link
    const statementDate = formatDate(new Date());
    const upiLink = `upi://pay?pa=9316566894@okbizaxis&pn=Niyansh%20Pharma&am=${ledger.outstandingBalance || 0}&cu=INR&tn=Ledger%20Settlement`;
    const overdueInvoices = (ledger.invoices || []).filter(inv => inv.balance > 0 && inv.status === 'Overdue');
    const overdueText = overdueInvoices.length > 0 
      ? `\n⚠️ *OVERDUE NOTICE:* ${overdueInvoices.length} overdue invoice(s) totaling ${formatCurrency(overdueInvoices.reduce((s, i) => s + i.balance, 0))}. Please clear immediately.`
      : '';

    const text = `📊 *STATEMENT OF ACCOUNT - NIYANSH PHARMA*
━━━━━━━━━━━━━━━━━━━━
*Retailer:* ${ledger.shopName}
*Mobile:* ${ledger.retailerMobile}${ledger.gstin ? `\n*GSTIN:* ${ledger.gstin}` : ''}
*Statement Date:* ${statementDate}

*ACCOUNT SUMMARY:*
• Total Billed: ${formatCurrency(ledger.totalBilled)}
• Total Received: ${formatCurrency(ledger.totalPaid)}
• *Current Outstanding: ${formatCurrency(ledger.outstandingBalance)}*
• Credit Limit: ${formatCurrency(ledger.creditLimit)}${overdueText}

*INSTANT PAYMENT LINK:*
UPI: 9316566894@okbizaxis
Pay: ${upiLink}
━━━━━━━━━━━━━━━━━━━━
_Niyansh Pharma Accounts Desk_
_Helpline: +91 9316566894_`;

    const cleanPhone = (ledger.retailerMobile || '9316566894').replace(/\D/g, '').replace(/^91/, '');
    const url = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(`WhatsApp statement opened for ${ledger.shopName}!`);
  };

  // ==========================================
  // DYNAMIC NEWS & SCHEMES HANDLERS
  // ==========================================

  const handleOpenNewsModal = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setNewsTitle(newsItem.title);
      setNewsContent(newsItem.content);
      setNewsCategory(newsItem.category || 'Scheme');
      setNewsCompany(newsItem.company || 'DAXIA');
      setNewsPriority(newsItem.priority || 1);
      setNewsExpiryDate(newsItem.expiryDate ? new Date(newsItem.expiryDate).toISOString().split('T')[0] : '');
      setNewsIsTickerActive(newsItem.isTickerActive !== undefined ? newsItem.isTickerActive : true);
    } else {
      setEditingNews(null);
      setNewsTitle('');
      setNewsContent('');
      setNewsCategory('Scheme');
      setNewsCompany('DAXIA');
      setNewsPriority(1);
      setNewsExpiryDate('');
      setNewsIsTickerActive(true);
    }
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    const payload = {
      title: newsTitle,
      content: newsContent,
      category: newsCategory,
      company: newsCompany,
      priority: parseInt(newsPriority, 10) || 1,
      expiryDate: newsExpiryDate ? new Date(newsExpiryDate).toISOString() : null,
      isTickerActive: newsIsTickerActive
    };

    try {
      let res;
      if (editingNews) {
        res = await fetch(`/api/news/${editingNews._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/news', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (editingNews) {
          setNews(prev => prev.map(n => n._id === editingNews._id ? data.news : n));
        } else {
          setNews(prev => [data.news, ...prev]);
        }
        showToast(editingNews ? 'Scheme/News announcement updated!' : 'New scheme created and published!');
      } else {
        // Fallback local update
        if (editingNews) {
          setNews(prev => prev.map(n => n._id === editingNews._id ? { ...n, ...payload } : n));
        } else {
          const newItem = {
            _id: `news-${Date.now()}`,
            ...payload,
            createdAt: new Date().toISOString()
          };
          setNews(prev => [newItem, ...prev]);
        }
        showToast(editingNews ? 'Announcement updated!' : 'Announcement created!');
      }
    } catch (err) {
      console.error('Error saving news:', err);
      if (editingNews) {
        setNews(prev => prev.map(n => n._id === editingNews._id ? { ...n, ...payload } : n));
      } else {
        const newItem = {
          _id: `news-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString()
        };
        setNews(prev => [newItem, ...prev]);
      }
      showToast('Announcement saved!');
    } finally {
      setIsNewsModalOpen(false);
    }
  };

  const handleToggleNewsTicker = async (item) => {
    const newStatus = !item.isTickerActive;
    try {
      const res = await fetch(`/api/news/${item._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isTickerActive: newStatus })
      });

      if (res.ok) {
        const data = await res.json();
        setNews(prev => prev.map(n => n._id === item._id ? data.news : n));
      } else {
        setNews(prev => prev.map(n => n._id === item._id ? { ...n, isTickerActive: newStatus } : n));
      }
    } catch {
      setNews(prev => prev.map(n => n._id === item._id ? { ...n, isTickerActive: newStatus } : n));
    }
    showToast(`Ticker visibility ${newStatus ? 'enabled' : 'disabled'} for announcement!`);
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheme/announcement?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE', headers: getAuthHeaders() });

      if (res.ok) {
        setNews(prev => prev.filter(n => n._id !== id));
        showToast('Announcement deleted successfully.');
      } else {
        setNews(prev => prev.filter(n => n._id !== id));
        showToast('Announcement deleted.');
      }
    } catch {
      setNews(prev => prev.filter(n => n._id !== id));
      showToast('Announcement deleted.');
    }
  };

  // ==========================================
  // PRODUCT CRUD & MULTI-PHOTO HANDLERS
  // ==========================================

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name || '');
      setProdBrand(product.brand || 'Daxia Healthcare');
      setProdCompany(product.company || 'DAXIA');
      setProdCategory(product.category || 'Pharma Products');
      setProdCustomCategory('');
      setProdSubCategory(product.subCategory || '');
      setProdSku(product.sku || '');
      setProdPrice(product.price !== undefined ? product.price : '');
      setProdMrp(product.mrp !== undefined ? product.mrp : '');
      setProdStockQuantity(product.stockQuantity !== undefined ? String(product.stockQuantity) : (product.inStock ? '100' : '0'));
      setProdInStock(product.inStock !== undefined ? product.inStock : true);
      setProdFeatured(Boolean(product.featured));
      setProdIsActive(product.isActive !== false);
      setProdPacking(product.packing || '');
      setProdComposition(product.composition || '');
      setProdForm(product.form || 'Tablet');
      setProdManufacturer(product.manufacturer || 'Daxia Healthcare Pvt. Ltd.');
      setProdImageUrl(product.imageUrl || '');
      const initialImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);
      setProdImages(initialImages);
      setProdDescription(product.description || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdBrand('Daxia Healthcare');
      setProdCompany('DAXIA');
      setProdCategory('Pharma Products');
      setProdCustomCategory('');
      setProdSubCategory('');
      setProdSku(`NP-${Date.now().toString().slice(-6)}`);
      setProdPrice('');
      setProdMrp('');
      setProdStockQuantity('100');
      setProdInStock(true);
      setProdFeatured(false);
      setProdIsActive(true);
      setProdPacking('10 x 10 Tablets');
      setProdComposition('');
      setProdForm('Tablet');
      setProdManufacturer('Daxia Healthcare Pvt. Ltd.');
      setProdImageUrl('');
      setProdImages([]);
      setProdDescription('');
    }
    setNewImageUrlInput('');
    setIsProductModalOpen(true);
  };

  // Upload multiple product photos
  const handlePhotoUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);
    const formData = new FormData();
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      formData.append('photos', files[i]);
    }

    try {
      const token = adminToken || localStorage.getItem('niyansh_admin_token');
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.urls) {
        setProdImages(prev => {
          const combined = [...prev, ...data.urls];
          if (!prodImageUrl && combined.length > 0) {
            setProdImageUrl(combined[0]);
          }
          return combined;
        });
        showToast(`Uploaded ${data.urls.length} photo(s) successfully!`);
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast('Error uploading photos: ' + err.message, 'error');
    } finally {
      setIsUploadingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetMainPhoto = (url) => {
    setProdImageUrl(url);
    setProdImages(prev => [url, ...prev.filter(img => img !== url)]);
    showToast('Designated as primary photo');
  };

  const handleRemovePhoto = (url) => {
    setProdImages(prev => {
      const updated = prev.filter(img => img !== url);
      if (prodImageUrl === url) {
        setProdImageUrl(updated[0] || '');
      }
      return updated;
    });
  };

  const handleMovePhoto = (idx, direction) => {
    setProdImages(prev => {
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      if (idx === 0 || targetIdx === 0) {
        setProdImageUrl(copy[0]);
      }
      return copy;
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrlInput || !newImageUrlInput.trim()) return;
    const trimmed = newImageUrlInput.trim();
    setProdImages(prev => [...prev, trimmed]);
    if (!prodImageUrl) setProdImageUrl(trimmed);
    setNewImageUrlInput('');
    showToast('Image URL added to gallery');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    const finalCategory = prodCategory === 'Custom' ? prodCustomCategory.trim() : prodCategory;
    if (!finalCategory) {
      showToast('Product category is required', 'error');
      return;
    }

    const finalImages = prodImages.filter(img => img && img.trim() !== '');
    const finalMainImage = prodImageUrl || (finalImages.length > 0 ? finalImages[0] : '');

    const stockNum = parseInt(prodStockQuantity, 10);
    const validStock = !isNaN(stockNum) ? stockNum : (prodInStock ? 100 : 0);

    const payload = {
      name: prodName.trim(),
      brand: prodBrand.trim() || 'Daxia Healthcare',
      company: prodCompany.trim() || 'DAXIA',
      category: finalCategory,
      subCategory: prodSubCategory.trim(),
      sku: prodSku.trim(),
      price: parseFloat(prodPrice) || 0,
      mrp: parseFloat(prodMrp) || parseFloat(prodPrice) || 0,
      stockQuantity: validStock,
      inStock: prodInStock && validStock > 0,
      packing: prodPacking.trim(),
      composition: prodComposition.trim(),
      form: prodForm,
      manufacturer: prodManufacturer.trim(),
      imageUrl: finalMainImage,
      images: finalImages,
      description: prodDescription.trim(),
      featured: prodFeatured,
      isActive: prodIsActive,
    };

    setIsSavingProduct(true);
    try {
      let response;
      if (editingProduct && editingProduct._id && !editingProduct._id.startsWith('p-')) {
        response = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setIsProductModalOpen(false);
        await fetchDashboardData();
        showToast(editingProduct ? 'Product updated successfully!' : 'New product created with all photos!');
      } else {
        showToast(data.message || 'Error saving product', 'error');
      }
    } catch (err) {
      console.error('Save product error:', err);
      showToast('Failed to save product: ' + err.message, 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
        setProductToDelete(null);
        showToast('Product and associated photos removed successfully');
        fetchDashboardData();
      } else {
        showToast(data.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      showToast('Error deleting product: ' + err.message, 'error');
    }
  };

  const handleToggleStock = async (product) => {
    const newStock = !product.inStock;
    const newQuantity = newStock ? (product.stockQuantity > 0 ? product.stockQuantity : 100) : 0;
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inStock: newStock, stockQuantity: newQuantity })
      });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: newStock, stockQuantity: newQuantity } : p));
      showToast(`Product marked as ${newStock ? 'In Stock' : 'Out of Stock'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: newStock, stockQuantity: newQuantity } : p));
      showToast(`Product stock updated`);
    }
  };

  const handleToggleActive = async (product) => {
    const newActive = product.isActive === false ? true : false;
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: newActive })
      });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: newActive } : p));
      showToast(`Product visibility set to ${newActive ? 'Active (Live)' : 'Inactive (Hidden)'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: newActive } : p));
      showToast(`Product visibility updated`);
    }
  };

  const handleToggleFeatured = async (product) => {
    const newFeatured = !product.featured;
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ featured: newFeatured })
      });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, featured: newFeatured } : p));
      showToast(`Product ${newFeatured ? 'featured on homepage' : 'removed from featured'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, featured: newFeatured } : p));
    }
  };

  const handleExportCSV = () => {
    if (!products || products.length === 0) {
      showToast('No products to export', 'error');
      return;
    }
    const headers = ['Name', 'SKU', 'Brand', 'Category', 'SubCategory', 'Price (PTR)', 'MRP', 'Stock Quantity', 'In Stock', 'Featured', 'Active', 'Packing', 'Composition', 'Form', 'Image URL'];
    const rows = products.map(p => [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.sku || ''}"`,
      `"${p.brand || ''}"`,
      `"${p.category || ''}"`,
      `"${p.subCategory || ''}"`,
      p.price || 0,
      p.mrp || 0,
      p.stockQuantity !== undefined ? p.stockQuantity : 100,
      p.inStock ? 'Yes' : 'No',
      p.featured ? 'Yes' : 'No',
      p.isActive !== false ? 'Yes' : 'No',
      `"${p.packing || ''}"`,
      `"${(p.composition || '').replace(/"/g, '""')}"`,
      `"${p.form || ''}"`,
      `"${p.imageUrl || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `niyansh_pharma_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Product catalog exported to CSV successfully');
  };

  const handleExecuteBulkImport = async () => {
    if (!bulkCsvText.trim()) {
      showToast('Please paste CSV text or select a file to import', 'error');
      return;
    }

    setIsImportingBulk(true);
    setBulkImportResults(null);
    try {
      // Parse CSV rows
      const lines = bulkCsvText.trim().split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        showToast('CSV must have a header row and at least one data row', 'error');
        setIsImportingBulk(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
      const parsedProducts = [];

      for (let i = 1; i < lines.length; i++) {
        // Handle basic comma parsing
        const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
        const matches = [];
        let match;
        while ((match = regex.exec(lines[i])) !== null) {
          if (match.index === regex.lastIndex) regex.lastIndex++;
          let val = match[1] || '';
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
          }
          matches.push(val.trim());
          if (regex.lastIndex >= lines[i].length) break;
        }

        const rowObj = {};
        headers.forEach((h, colIdx) => {
          rowObj[h] = matches[colIdx] || '';
        });

        if (rowObj.name || rowObj['product name']) {
          parsedProducts.push({
            name: rowObj.name || rowObj['product name'],
            sku: rowObj.sku || rowObj['product id'] || rowObj['sku code'] || '',
            category: rowObj.category || 'Pharma Products',
            subCategory: rowObj.subcategory || rowObj['sub category'] || '',
            brand: rowObj.brand || 'Daxia Healthcare',
            price: parseFloat(rowObj.price || rowObj['price (ptr)'] || rowObj['ptr'] || 0),
            mrp: parseFloat(rowObj.mrp || rowObj['regular price'] || 0),
            stockQuantity: parseInt(rowObj.stockquantity || rowObj['stock quantity'] || rowObj.stock || 100, 10),
            packing: rowObj.packing || '',
            composition: rowObj.composition || '',
            form: rowObj.form || 'Tablet',
            imageUrl: rowObj.imageurl || rowObj['image url'] || rowObj.image || '',
            description: rowObj.description || '',
          });
        }
      }

      if (parsedProducts.length === 0) {
        showToast('No valid product rows found in CSV', 'error');
        setIsImportingBulk(false);
        return;
      }

      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ products: parsedProducts })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBulkImportResults(data);
        showToast(`Successfully imported ${data.successCount} products!`);
        fetchDashboardData();
      } else {
        showToast(data.message || 'Bulk import failed', 'error');
      }
    } catch (err) {
      console.error('Bulk import error:', err);
      showToast('Error parsing or importing CSV: ' + err.message, 'error');
    } finally {
      setIsImportingBulk(false);
    }
  };

  // ==========================================
  // COMPANY CRUD HANDLERS
  // ==========================================
  const handleOpenCompanyModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setCompName(company.name || '');
      setCompCategory(company.category || 'Pharmaceutical Formulations');
      setCompLocation(company.location || 'India');
      setCompWebsiteUrl(company.websiteUrl || '');
      setCompLogoUrl(company.logoUrl || '');
      setCompDescription(company.description || '');
      setCompSpecialties(Array.isArray(company.specialties) ? company.specialties.join(', ') : '');
      setCompIsPublished(company.isPublished !== false);
      setCompIsVerified(company.isVerified !== false);
    } else {
      setEditingCompany(null);
      setCompName('');
      setCompCategory('Pharmaceutical Formulations');
      setCompLocation('Gujarat, India');
      setCompWebsiteUrl('');
      setCompLogoUrl('');
      setCompDescription('');
      setCompSpecialties('Formulations, Hospital Supplies, WHO-GMP');
      setCompIsPublished(true);
      setCompIsVerified(true);
    }
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    if (!compName.trim()) {
      showToast('Company name is required', 'error');
      return;
    }

    const payload = {
      name: compName.trim(),
      category: compCategory.trim(),
      location: compLocation.trim(),
      websiteUrl: compWebsiteUrl.trim(),
      logoUrl: compLogoUrl.trim(),
      description: compDescription.trim(),
      specialties: compSpecialties.split(',').map(s => s.trim()).filter(Boolean),
      isPublished: compIsPublished,
      isVerified: compIsVerified,
    };

    setIsSavingCompany(true);
    try {
      let res;
      if (editingCompany && editingCompany._id) {
        res = await fetch(`/api/companies/${editingCompany._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/companies', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setIsCompanyModalOpen(false);
        await fetchDashboardData();
        showToast(editingCompany ? 'Company updated successfully!' : 'New company added to directory!');
      } else {
        showToast(data.message || 'Error saving company', 'error');
      }
    } catch (err) {
      showToast('Failed to save company: ' + err.message, 'error');
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleConfirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    try {
      const res = await fetch(`/api/companies/${companyToDelete._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCompanies(prev => prev.filter(c => c._id !== companyToDelete._id));
        setCompanyToDelete(null);
        showToast('Company removed from directory');
        fetchDashboardData();
      } else {
        showToast(data.message || 'Failed to delete company', 'error');
      }
    } catch (err) {
      showToast('Error deleting company: ' + err.message, 'error');
    }
  };

  const handleToggleCompanyPublish = async (company) => {
    const newStatus = !company.isPublished;
    try {
      await fetch(`/api/companies/${company._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isPublished: newStatus })
      });
      setCompanies(prev => prev.map(c => c._id === company._id ? { ...c, isPublished: newStatus } : c));
      showToast(`Company visibility set to ${newStatus ? 'Published (Live)' : 'Unpublished (Hidden)'}`);
    } catch {
      setCompanies(prev => prev.map(c => c._id === company._id ? { ...c, isPublished: newStatus } : c));
    }
  };

  // ==========================================
  // FILTERED DATA COMPUTATIONS
  // ==========================================

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const searchLower = productSearch.toLowerCase().trim();
      const matchesSearch = !searchLower ||
        (p.name && p.name.toLowerCase().includes(searchLower)) ||
        (p.brand && p.brand.toLowerCase().includes(searchLower)) ||
        (p.composition && p.composition.toLowerCase().includes(searchLower)) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
        (p.category && p.category.toLowerCase().includes(searchLower));

      let matchesCat = productCategoryFilter === 'All';
      if (!matchesCat) {
        if (productCategoryFilter === 'Generic Medicines') {
          matchesCat = !p.category || !p.category.match(/surgical|otc|ayurved/i);
        } else if (productCategoryFilter === 'Surgical Supplies') {
          matchesCat = p.category && Boolean(p.category.match(/surgical|device|instrument/i));
        } else if (productCategoryFilter === 'OTC & Wellness') {
          matchesCat = p.category && Boolean(p.category.match(/otc|wellness|personal/i));
        } else if (productCategoryFilter === 'Ayurvedic & Herbal') {
          matchesCat = p.category && Boolean(p.category.match(/ayurved|herbal/i));
        } else {
          matchesCat = p.category === productCategoryFilter;
        }
      }
      
      let matchesStock = true;
      if (productStockFilter === 'InStock') {
        matchesStock = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
      } else if (productStockFilter === 'OutOfStock') {
        matchesStock = !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
      }

      let matchesActive = true;
      if (productActiveFilter === 'Active') {
        matchesActive = p.isActive !== false;
      } else if (productActiveFilter === 'Inactive') {
        matchesActive = p.isActive === false;
      }

      return matchesSearch && matchesCat && matchesStock && matchesActive;
    });

    if (productSort === 'priceAsc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (productSort === 'priceDesc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (productSort === 'nameAsc') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (productSort === 'nameDesc') result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    else if (productSort === 'stockAsc') result.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0));
    else if (productSort === 'stockDesc') result.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));

    return result;
  }, [products, productSearch, productCategoryFilter, productStockFilter, productActiveFilter, productSort]);

  const uniqueCategories = useMemo(() => {
    const defaultCats = ['Pharma Products', 'OTC Products', 'Injectables', 'Surgical & Medical Supplies'];
    const fromProds = products.map(p => p.category).filter(Boolean);
    return [...new Set([...defaultCats, ...fromProds])].sort();
  }, [products]);

  const productStats = useMemo(() => {
    if (productAdminStats) return productAdminStats;
    const total = products.length;
    const active = products.filter(p => p.isActive !== false).length;
    const outOfStock = products.filter(p => !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0)).length;
    const categoriesCount = new Set(products.map(p => p.category).filter(Boolean)).size;
    const featured = products.filter(p => p.featured).length;
    return {
      totalProducts: total,
      activeProducts: active,
      outOfStock,
      totalCategories: categoriesCount,
      featuredProducts: featured,
    };
  }, [products, productAdminStats]);

  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * productPerPage;
    return filteredProducts.slice(start, start + productPerPage);
  }, [filteredProducts, productPage, productPerPage]);

  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / productPerPage));

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchesSearch = 
        !orderSearch ||
        ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.shopName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.retailerMobile.includes(orderSearch) ||
        (ord.gstin && ord.gstin.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchesStatus = orderStatusFilter === 'All' || ord.orderStatus === orderStatusFilter;
      const matchesPayment = paymentStatusFilter === 'All' || ord.paymentStatus === paymentStatusFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, orderSearch, orderStatusFilter, paymentStatusFilter]);

  const filteredLedgers = useMemo(() => {
    return ledgers.filter(l => {
      const matchesSearch = 
        !ledgerSearch ||
        l.shopName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        l.retailerMobile.includes(ledgerSearch) ||
        (l.gstin && l.gstin.toLowerCase().includes(ledgerSearch.toLowerCase()));

      let matchesFilter = true;
      if (ledgerFilter === 'Overdue') {
        const hasOverdue = (l.invoices || []).some(inv => inv.balance > 0 && inv.status === 'Overdue');
        matchesFilter = hasOverdue;
      } else if (ledgerFilter === 'WithBalance') {
        matchesFilter = (l.outstandingBalance || 0) > 0;
      } else if (ledgerFilter === 'Settled') {
        matchesFilter = (l.outstandingBalance || 0) === 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [ledgers, ledgerSearch, ledgerFilter]);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = 
        !newsSearch ||
        item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.content.toLowerCase().includes(newsSearch.toLowerCase());

      const matchesCat = newsCategoryFilter === 'All' || item.category === newsCategoryFilter;
      const matchesComp = newsCompanyFilter === 'All' || item.company === newsCompanyFilter;

      return matchesSearch && matchesCat && matchesComp;
    });
  }, [news, newsSearch, newsCategoryFilter, newsCompanyFilter]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => enquiryFilter === 'All' ? true : e.type === enquiryFilter);
  }, [enquiries, enquiryFilter]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const searchLower = companySearch.toLowerCase().trim();
      const matchesSearch = !searchLower ||
        c.name.toLowerCase().includes(searchLower) ||
        (c.location && c.location.toLowerCase().includes(searchLower)) ||
        (c.category && c.category.toLowerCase().includes(searchLower));

      const matchesCat = companyCategoryFilter === 'All' || c.category === companyCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [companies, companySearch, companyCategoryFilter]);

  const uniqueCompanyCategories = useMemo(() => {
    const list = companies.map(c => c.category).filter(Boolean);
    return ['All', ...new Set(list)].sort();
  }, [companies]);

  // Summary Metrics Computations for Wholesale B2B
  const totalWholesaleOrdersCount = orders.length;
  const totalWholesaleRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0), [orders]);
  const totalOutstandingDues = useMemo(() => ledgers.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0), [ledgers]);
  const overdueLedgersCount = useMemo(() => {
    return ledgers.filter(l => (l.invoices || []).some(inv => inv.balance > 0 && inv.status === 'Overdue')).length;
  }, [ledgers]);
  const activeSchemesCount = useMemo(() => news.filter(n => n.category === 'Scheme').length, [news]);
  const activeTickerCount = useMemo(() => news.filter(n => n.isTickerActive).length, [news]);
  const bookedOrdersCount = useMemo(() => orders.filter(o => (o.orderStatus || 'Booked') === 'Booked').length, [orders]);
  const confirmedOrdersCount = useMemo(() => orders.filter(o => o.orderStatus === 'Confirmed').length, [orders]);
  const dispatchedOrdersCount = useMemo(() => orders.filter(o => o.orderStatus === 'Dispatched').length, [orders]);
  const deliveredOrdersCount = useMemo(() => orders.filter(o => o.orderStatus === 'Delivered').length, [orders]);

  const genericMedicinesCount = useMemo(() => products.filter(p => !p.category || !p.category.match(/surgical|otc|ayurved/i)).length, [products]);
  const surgicalCount = useMemo(() => products.filter(p => p.category && p.category.match(/surgical|device|instrument/i)).length, [products]);
  const otcCount = useMemo(() => products.filter(p => p.category && p.category.match(/otc|wellness|personal/i)).length, [products]);
  const ayurvedicCount = useMemo(() => products.filter(p => p.category && p.category.match(/ayurved|herbal/i)).length, [products]);

  // ==========================================
  // RENDER: LOGIN SCREEN
  // ==========================================

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', backgroundColor: 'var(--bg-main)', padding: '20px' }} className="animate-fade-in">
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px', boxShadow: '0 20px 40px rgba(12, 61, 108, 0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ backgroundColor: 'rgba(12, 61, 108, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-blue)', display: 'inline-flex', marginBottom: '15px' }}>
              <Lock size={32} />
            </span>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Admin Console</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Niyansh Pharma Wholesale & B2B Management</p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="admin-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Admin Email</label>
              <input 
                id="admin-email"
                type="email" 
                required
                placeholder="admin@niyanshpharma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="admin-pwd" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Password</label>
              <input 
                id="admin-pwd"
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', height: '48px', marginTop: '10px', fontWeight: '700' }}
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div style={{ marginTop: '25px', padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-medium)', textAlign: 'center' }}>
            🔑 <strong>Demo Credentials:</strong><br />
            Email: <span style={{ fontFamily: 'monospace', color: 'var(--primary-blue)', fontWeight: '600' }}>admin@niyanshpharma.com</span><br />
            Password: <span style={{ fontFamily: 'monospace', color: 'var(--primary-blue)', fontWeight: '600' }}>admin123</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ADMIN DASHBOARD
  // ==========================================

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '30px 0' }}>
      {/* Medilio-Inspired B2B Healthcare Executive Command Header */}
      <div className="container" style={{ marginBottom: '22px' }}>
        <div className="card" style={{
          padding: 'clamp(16px, 2.5vw, 24px)',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(12, 61, 108, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Medilio Reference B2B Portal
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#f0fdf4', color: '#15803d', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                🛡️ WHO-GMP Certified Distribution
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                Rajkot Central Wholesale Hub (Gujarat)
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
              Niyansh Pharma • Central B2B Operations Console
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-medium)', flexWrap: 'wrap' }}>
              <span>🏛️ DL: <strong>G/20B/12984, G/21B/12985</strong></span>
              <span>•</span>
              <span>📑 GSTIN: <strong>24AAACN9128P1Z8</strong></span>
              <span>•</span>
              <span>⚡ Model: <strong>Medilio Healthcare Network</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href="/quick-order"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ gap: '6px', fontSize: '0.82rem', fontWeight: '700' }}
            >
              <ExternalLink size={14} /> Quick Matrix
            </a>
            <button
              onClick={handleDownloadOrdersCSV}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px', fontSize: '0.82rem', fontWeight: '700' }}
            >
              <FileSpreadsheet size={14} /> Export Orders (Excel)
            </button>
          </div>
        </div>
      </div>

      <div className="container admin-layout-container">
        
        {/* Sidebar Nav */}
        <aside className="card admin-desktop-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }}></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', margin: 0 }}>Admin Console</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
              Niyansh Pharma B2B Portal
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={() => setActiveTab('overview')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'overview' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'overview' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={16} /> Overview
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('orders')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'orders' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'orders' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={16} /> 📦 B2B Orders
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {orders.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('ledgers')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'ledgers' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'ledgers' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={16} /> 📊 Outstanding Ledger
              </div>
              {overdueLedgersCount > 0 && (
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: '700' }}>
                  {overdueLedgersCount} Due
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('news')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'news' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'news' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={16} /> 🔥 News & Schemes
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {news.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('products')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'products' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'products' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={16} /> Products
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {products.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('companies')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'companies' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'companies' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={16} /> Companies
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {companies.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('enquiries')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'enquiries' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'enquiries' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={16} /> Enquiries
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {enquiries.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('careers')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'careers' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'careers' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={16} /> Careers
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {careers.length}
              </span>
            </button>
          </nav>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={fetchDashboardData}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontSize: '0.8rem', gap: '6px' }}
            >
              <RefreshCw size={13} /> Refresh Live Data
            </button>

            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444', gap: '6px', fontSize: '0.8rem' }}
            >
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ minWidth: 0 }}>
          {/* Mobile & Tablet Responsive Horizontal Tab Bar */}
          <div className="admin-mobile-tabs-bar" style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }}></div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-dark)' }}>Admin Console</strong>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                  Live B2B
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={fetchDashboardData}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px', height: '30px' }}
                  title="Refresh Live Data"
                >
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', height: '30px' }}
                >
                  <LogOut size={12} /> Exit
                </button>
              </div>
            </div>

            <div className="admin-mobile-tabs-scroll">
              <button onClick={() => setActiveTab('overview')} className={`admin-tab-chip ${activeTab === 'overview' ? 'active' : ''}`}>
                <LayoutDashboard size={14} /> Overview
              </button>
              <button onClick={() => setActiveTab('orders')} className={`admin-tab-chip ${activeTab === 'orders' ? 'active' : ''}`}>
                <Package size={14} /> Orders ({orders.length})
              </button>
              <button onClick={() => setActiveTab('ledgers')} className={`admin-tab-chip ${activeTab === 'ledgers' ? 'active' : ''}`}>
                <CreditCard size={14} /> Ledgers {overdueLedgersCount > 0 ? `(${overdueLedgersCount} Due)` : `(${ledgers.length})`}
              </button>
              <button onClick={() => setActiveTab('news')} className={`admin-tab-chip ${activeTab === 'news' ? 'active' : ''}`}>
                <Flame size={14} /> Schemes ({news.length})
              </button>
              <button onClick={() => setActiveTab('products')} className={`admin-tab-chip ${activeTab === 'products' ? 'active' : ''}`}>
                <ShoppingBag size={14} /> Products ({products.length})
              </button>
              <button onClick={() => setActiveTab('companies')} className={`admin-tab-chip ${activeTab === 'companies' ? 'active' : ''}`}>
                <Building2 size={14} /> Companies ({companies.length})
              </button>
              <button onClick={() => setActiveTab('enquiries')} className={`admin-tab-chip ${activeTab === 'enquiries' ? 'active' : ''}`}>
                <MessageSquare size={14} /> Enquiries ({enquiries.length})
              </button>
              <button onClick={() => setActiveTab('careers')} className={`admin-tab-chip ${activeTab === 'careers' ? 'active' : ''}`}>
                <Briefcase size={14} /> Careers ({careers.length})
              </button>
            </div>
          </div>
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div style={{
              backgroundColor: toastMessage.type === 'error' ? '#fee2e2' : '#ecfdf5',
              color: toastMessage.type === 'error' ? '#ef4444' : '#059669',
              border: `1px solid ${toastMessage.type === 'error' ? '#fca5a5' : '#a7f3d0'}`,
              padding: '12px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>{toastMessage.msg}</span>
              </div>
              <button onClick={() => setToastMessage(null)} style={{ color: 'inherit' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
              <div style={{ border: '4px solid #cbd5e1', borderTop: '4px solid var(--primary-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : (
            <>
              {/* ==========================================
                  TAB 1: OVERVIEW DASHBOARD
                  ========================================== */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Overview & B2B Summary</h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>Real-time wholesale operations, retailer ledger dues, orders & active schemes</p>
                    </div>
                    <button onClick={fetchDashboardData} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                      <RefreshCw size={14} /> Refresh Metrics
                    </button>
                  </div>
                  
                  {/* Medilio-Style 4-Stage B2B Fulfillment Pipeline Funnel */}
                  <div className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TrendingUp size={18} color="var(--primary-blue)" /> Order Fulfillment Pipeline (Medilio Model)
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: '3px 0 0 0' }}>
                          Track wholesale consignments from chemist booking to verified delivery & invoice clearance
                        </p>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#1e40af', padding: '4px 10px', borderRadius: '15px' }}>
                        {orders.length} Total Consignments
                      </span>
                    </div>

                    <div className="admin-funnel-grid">
                      {/* Stage 1: Booked */}
                      <div
                        onClick={() => { setOrderStatusFilter('Booked'); setActiveTab('orders'); }}
                        style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1.5px solid #fde68a', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#b45309', textTransform: 'uppercase' }}>1. Booked (New)</span>
                          <Clock size={16} color="#d97706" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#b45309' }}>{bookedOrdersCount}</div>
                        <div style={{ fontSize: '0.74rem', color: '#92400e', marginTop: '2px' }}>Awaiting stock dispatch</div>
                      </div>

                      {/* Stage 2: Confirmed */}
                      <div
                        onClick={() => { setOrderStatusFilter('Confirmed'); setActiveTab('orders'); }}
                        style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f0f9ff', border: '1.5px solid #bae6fd', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase' }}>2. Confirmed</span>
                          <CheckCircle2 size={16} color="#0284c7" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0369a1' }}>{confirmedOrdersCount}</div>
                        <div style={{ fontSize: '0.74rem', color: '#075985', marginTop: '2px' }}>Stock & credit validated</div>
                      </div>

                      {/* Stage 3: Dispatched */}
                      <div
                        onClick={() => { setOrderStatusFilter('Dispatched'); setActiveTab('orders'); }}
                        style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f5f3ff', border: '1.5px solid #ddd6fe', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#6d28d9', textTransform: 'uppercase' }}>3. Dispatched</span>
                          <Package size={16} color="#7c3aed" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#6d28d9' }}>{dispatchedOrdersCount}</div>
                        <div style={{ fontSize: '0.74rem', color: '#5b21b6', marginTop: '2px' }}>In logistics with Tax Invoice</div>
                      </div>

                      {/* Stage 4: Delivered */}
                      <div
                        onClick={() => { setOrderStatusFilter('Delivered'); setActiveTab('orders'); }}
                        style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#15803d', textTransform: 'uppercase' }}>4. Delivered</span>
                          <Check size={16} color="#16a34a" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#15803d' }}>{deliveredOrdersCount}</div>
                        <div style={{ fontSize: '0.74rem', color: '#166534', marginTop: '2px' }}>Received & settled in ledger</div>
                      </div>
                    </div>
                  </div>

                  {/* Medilio-Style 4 Healthcare Category Pillars */}
                  <div className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers size={18} color="var(--primary-blue)" /> Medilio Category Ecosystem
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: '3px 0 0 0' }}>
                          Therapeutic formulations, surgical supplies, OTC personal wellness & Ayurvedic remedies
                        </p>
                      </div>
                      <button onClick={() => setActiveTab('products')} className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem' }}>
                        Explore Catalog ({products.length}) →
                      </button>
                    </div>

                    <div className="admin-category-grid">
                      <div onClick={() => { setProductCategoryFilter('Generic Medicines'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', textTransform: 'uppercase' }}>💊 Generic Medicines</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{genericMedicinesCount} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Cardiac, Antibiotics, Pain, Neuro</div>
                      </div>

                      <div onClick={() => { setProductCategoryFilter('Surgical Supplies'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase' }}>🩺 Surgical & Devices</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{surgicalCount || 18} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Disposables, Bandages, BP Monitors</div>
                      </div>

                      <div onClick={() => { setProductCategoryFilter('OTC & Wellness'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>🧴 OTC & Wellness</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{otcCount || 32} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Daily Healthcare, Balms, Nutrition</div>
                      </div>

                      <div onClick={() => { setProductCategoryFilter('Ayurvedic & Herbal'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase' }}>🌿 Ayurvedic & Herbal</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{ayurvedicCount || 24} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Herbal Tonics, Syrups & Ointments</div>
                      </div>
                    </div>
                  </div>

                  {/* High-Impact Wholesale B2B Summary Tiles */}
                  <div className="admin-stat-tiles-grid">
                    {/* Tile 1: Total B2B Orders */}
                    <div 
                      className="card" 
                      onClick={() => setActiveTab('orders')}
                      style={{ padding: '22px', borderLeft: '5px solid var(--primary-blue)', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total B2B Orders</span>
                        <Package size={20} color="var(--primary-blue)" />
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-blue)' }}>{totalWholesaleOrdersCount}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                        Volume: {formatCurrency(totalWholesaleRevenue)}
                      </span>
                    </div>

                    {/* Tile 2: Outstanding Dues */}
                    <div 
                      className="card" 
                      onClick={() => setActiveTab('ledgers')}
                      style={{ padding: '22px', borderLeft: '5px solid #ef4444', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Outstanding Dues</span>
                        <CreditCard size={20} color="#ef4444" />
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>{formatCurrency(totalOutstandingDues)}</div>
                      <span style={{ fontSize: '0.8rem', color: overdueLedgersCount > 0 ? '#ef4444' : 'var(--secondary-green)', fontWeight: '600' }}>
                        {overdueLedgersCount > 0 ? `⚠️ ${overdueLedgersCount} Overdue Accounts` : '✓ All accounts within credit limit'}
                      </span>
                    </div>

                    {/* Tile 3: Active Schemes */}
                    <div 
                      className="card" 
                      onClick={() => setActiveTab('news')}
                      style={{ padding: '22px', borderLeft: '5px solid #f59e0b', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Active Schemes</span>
                        <Flame size={20} color="#f59e0b" />
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>{activeSchemesCount}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                        {activeTickerCount} Live on Ticker
                      </span>
                    </div>

                    {/* Tile 4: Total Products */}
                    <div 
                      className="card" 
                      onClick={() => setActiveTab('products')}
                      style={{ padding: '22px', borderLeft: '5px solid var(--secondary-green)', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Products</span>
                        <ShoppingBag size={20} color="var(--secondary-green)" />
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary-green)' }}>{products.length}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                        {products.filter(p => p.inStock).length} In Stock
                      </span>
                    </div>
                  </div>

                  {/* Quick Sub-Stats Row */}
                  <div className="grid-2" style={{ gap: '20px' }}>
                    <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>B2B & Public Enquiries</span>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-blue)' }}>{enquiries.length}</div>
                      </div>
                      <button onClick={() => setActiveTab('enquiries')} className="btn btn-outline btn-sm">Manage Enquiries →</button>
                    </div>

                    <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Job Applications</span>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{careers.length}</div>
                      </div>
                      <button onClick={() => setActiveTab('careers')} className="btn btn-outline btn-sm">Review Applicants →</button>
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="card" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', margin: 0 }}>Recent B2B Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
                        View All Orders ({orders.length}) →
                      </button>
                    </div>

                    <div className="admin-table-container">
                      <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                            <th style={{ padding: '10px 12px', verticalAlign: 'middle' }}>Order #</th>
                            <th style={{ padding: '10px 12px', verticalAlign: 'middle' }}>Store Name</th>
                            <th style={{ padding: '10px 12px', verticalAlign: 'middle' }}>Date</th>
                            <th style={{ padding: '10px 12px', verticalAlign: 'middle' }}>Grand Total</th>
                            <th style={{ padding: '10px 12px', verticalAlign: 'middle' }}>Order Status</th>
                            <th style={{ padding: '10px 12px', verticalAlign: 'middle' }}>Payment</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 4).map((ord) => (
                            <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--primary-blue)', verticalAlign: 'middle' }}>{ord.orderNumber}</td>
                              <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                                <div style={{ fontWeight: '600' }}>{ord.shopName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{ord.retailerMobile}</div>
                              </td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-medium)', verticalAlign: 'middle' }}>{formatDate(ord.createdAt)}</td>
                              <td style={{ padding: '10px 12px', fontWeight: '700', verticalAlign: 'middle' }}>{formatCurrency(ord.grandTotal)}</td>
                              <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                                <span style={{
                                  padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                                  backgroundColor: ord.orderStatus === 'Delivered' ? 'rgba(34, 197, 94, 0.1)' : ord.orderStatus === 'Dispatched' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                  color: ord.orderStatus === 'Delivered' ? '#16a34a' : ord.orderStatus === 'Dispatched' ? '#2563eb' : '#d97706'
                                }}>
                                  {ord.orderStatus || 'Booked'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                                <span style={{
                                  padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                                  backgroundColor: ord.paymentStatus === 'Paid' ? 'rgba(34, 197, 94, 0.1)' : ord.paymentStatus === 'Partially Paid' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                  color: ord.paymentStatus === 'Paid' ? '#16a34a' : ord.paymentStatus === 'Partially Paid' ? '#d97706' : '#ef4444'
                                }}>
                                  {ord.paymentStatus || 'Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                <button 
                                  onClick={() => setSelectedOrder(ord)} 
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <Eye size={12} /> Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 2: 📦 B2B ORDERS MANAGER
                  ========================================== */}
              {activeTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>📦 Wholesale B2B Orders</h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Track booked chemist orders, update dispatch state, view itemized lists & trigger WhatsApp confirmations
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={handleDownloadOrdersCSV} 
                        className="btn btn-outline btn-sm" 
                        style={{ gap: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Download size={14} /> Export CSV
                      </button>
                      <button 
                        onClick={fetchDashboardData} 
                        className="btn btn-outline btn-sm" 
                        style={{ gap: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <RefreshCw size={14} /> Refresh
                      </button>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', width: '100%' }}>
                        <button onClick={() => setOrderStatusFilter('All')} className={`btn btn-sm ${orderStatusFilter === 'All' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}>
                          All Orders ({orders.length})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Booked')} className={`btn btn-sm ${orderStatusFilter === 'Booked' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Booked' ? '#f59e0b' : '#fff', color: orderStatusFilter === 'Booked' ? '#fff' : '#d97706', borderColor: '#f59e0b' }}>
                          🟡 Booked ({bookedOrdersCount})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Confirmed')} className={`btn btn-sm ${orderStatusFilter === 'Confirmed' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Confirmed' ? '#0284c7' : '#fff', color: orderStatusFilter === 'Confirmed' ? '#fff' : '#0369a1', borderColor: '#0284c7' }}>
                          🔵 Confirmed ({confirmedOrdersCount})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Dispatched')} className={`btn btn-sm ${orderStatusFilter === 'Dispatched' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Dispatched' ? '#8b5cf6' : '#fff', color: orderStatusFilter === 'Dispatched' ? '#fff' : '#7c3aed', borderColor: '#8b5cf6' }}>
                          🟣 Dispatched ({dispatchedOrdersCount})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Delivered')} className={`btn btn-sm ${orderStatusFilter === 'Delivered' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Delivered' ? '#16a34a' : '#fff', color: orderStatusFilter === 'Delivered' ? '#fff' : '#15803d', borderColor: '#16a34a' }}>
                          🟢 Delivered ({deliveredOrdersCount})
                        </button>
                      </div>

                      <div className="admin-filter-bar" style={{ width: '100%' }}>
                      {/* Search */}
                      <div className="admin-filter-search" style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input 
                          type="text"
                          placeholder="Search by Order #, Store Name, Phone, GSTIN..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                      </div>

                      {/* Order Status Filter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Order Status:</span>
                        <select 
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value)}
                          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Orders</option>
                          <option value="Booked">Booked</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      {/* Payment Status Filter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Payment:</span>
                        <select 
                          value={paymentStatusFilter}
                          onChange={(e) => setPaymentStatusFilter(e.target.value)}
                          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Payments</option>
                          <option value="Pending">Pending</option>
                          <option value="Partially Paid">Partially Paid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div className="admin-table-container">
                      <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Order ID & Date</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Store & Retailer</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Items Summary</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Grand Total</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Order Status</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Payment Status</th>
                            <th style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', verticalAlign: 'middle' }}>
                                No B2B orders match your current filters.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((ord) => (
                              <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <div style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>{ord.orderNumber}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{formatDate(ord.createdAt)}</div>
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <div style={{ fontWeight: '600' }}>{ord.shopName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>📞 {ord.retailerMobile}</div>
                                  {ord.gstin && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>GSTIN: {ord.gstin}</div>}
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                                    {(ord.items || []).length} Product Line{(ord.items || []).length > 1 ? 's' : ''}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {(ord.items || []).map(i => `${i.productName} (${i.boxes}b)`).join(', ')}
                                  </div>
                                </td>
                                <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--text-dark)', verticalAlign: 'middle' }}>
                                  {formatCurrency(ord.grandTotal)}
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <select 
                                    value={ord.orderStatus || 'Booked'}
                                    onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value, null)}
                                    style={{
                                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700',
                                      backgroundColor: ord.orderStatus === 'Delivered' ? 'rgba(34, 197, 94, 0.1)' : ord.orderStatus === 'Dispatched' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                      color: ord.orderStatus === 'Delivered' ? '#16a34a' : ord.orderStatus === 'Dispatched' ? '#2563eb' : '#d97706',
                                      border: '1px solid #cbd5e1'
                                    }}
                                  >
                                    <option value="Booked">Booked</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <select 
                                    value={ord.paymentStatus || 'Pending'}
                                    onChange={(e) => handleUpdateOrderStatus(ord._id, null, e.target.value)}
                                    style={{
                                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700',
                                      backgroundColor: ord.paymentStatus === 'Paid' ? 'rgba(34, 197, 94, 0.1)' : ord.paymentStatus === 'Partially Paid' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                      color: ord.paymentStatus === 'Paid' ? '#16a34a' : ord.paymentStatus === 'Partially Paid' ? '#d97706' : '#ef4444',
                                      border: '1px solid #cbd5e1'
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Partially Paid">Partially Paid</option>
                                    <option value="Paid">Paid</option>
                                  </select>
                                </td>
                                <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                                    <button 
                                      onClick={() => setSelectedOrder(ord)} 
                                      className="btn btn-outline btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                      title="View Breakdown"
                                    >
                                      <Eye size={13} /> View
                                    </button>
                                    <button 
                                      onClick={() => handleExportSingleOrderInvoiceCSV(ord)} 
                                      className="btn btn-outline btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                      title="Download Invoice in Excel"
                                    >
                                      <FileSpreadsheet size={13} /> Invoice
                                    </button>
                                    <a 
                                      href={getWhatsAppDispatchUrl(ord)} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="btn btn-primary btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', backgroundColor: '#25D366', borderColor: '#25D366', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                      title="Open WhatsApp Dispatch"
                                    >
                                      <Phone size={13} /> WhatsApp
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 3: 📊 RETAILER LEDGERS & OUTSTANDING
                  ========================================== */}
              {activeTab === 'ledgers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>📊 Outstanding Ledger</h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Manage B2B credit accounts, check overdue balances, record manual/offline payments & send WhatsApp ledger statements
                      </p>
                    </div>

                    <button onClick={fetchDashboardData} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                      <RefreshCw size={14} /> Refresh Ledgers
                    </button>
                  </div>

                  {/* Summary Metric Cards for Ledgers */}
                  <div className="admin-stat-tiles-grid">
                    <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--primary-blue)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Billed (All Time)</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-blue)', marginTop: '4px' }}>
                        {formatCurrency(ledgers.reduce((s, l) => s + (l.totalBilled || 0), 0))}
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--secondary-green)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Recovered / Paid</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary-green)', marginTop: '4px' }}>
                        {formatCurrency(ledgers.reduce((s, l) => s + (l.totalPaid || 0), 0))}
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px', borderLeft: '4px solid #ef4444' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Outstanding Dues</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444', marginTop: '4px' }}>
                        {formatCurrency(totalOutstandingDues)}
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px', borderLeft: '4px solid #f59e0b' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Overdue Accounts</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>
                        {overdueLedgersCount} / {ledgers.length}
                      </div>
                    </div>
                  </div>

                  {/* Search & Filter Toolbar */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                      <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input 
                          type="text"
                          placeholder="Search by Retailer Name, Mobile Number, or GSTIN..."
                          value={ledgerSearch}
                          onChange={(e) => setLedgerSearch(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Filter:</span>
                        <select 
                          value={ledgerFilter}
                          onChange={(e) => setLedgerFilter(e.target.value)}
                          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Retailers ({ledgers.length})</option>
                          <option value="Overdue">Overdue Invoices Only ({overdueLedgersCount})</option>
                          <option value="WithBalance">Outstanding Balance &gt; 0</option>
                          <option value="Settled">Fully Settled (0 Dues)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Ledgers Table */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div className="admin-table-container">
                      <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Retailer Shop & Mobile</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>GSTIN</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Total Billed</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Total Paid</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Outstanding Dues</th>
                            <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Credit Limit</th>
                            <th style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLedgers.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', verticalAlign: 'middle' }}>
                                No retailer ledgers match your search.
                              </td>
                            </tr>
                          ) : (
                            filteredLedgers.map((ledger) => {
                              const hasOverdue = (ledger.invoices || []).some(inv => inv.balance > 0 && inv.status === 'Overdue');
                              const hasDues = (ledger.outstandingBalance || 0) > 0;

                              return (
                                <tr 
                                  key={ledger._id || ledger.retailerMobile} 
                                  style={{ 
                                    borderBottom: '1px solid var(--border-light)',
                                    backgroundColor: hasOverdue ? 'rgba(239, 68, 68, 0.03)' : 'transparent'
                                  }}
                                >
                                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <strong style={{ color: 'var(--text-dark)' }}>{ledger.shopName}</strong>
                                      {hasOverdue && (
                                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: '800' }}>
                                          OVERDUE
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>📞 {ledger.retailerMobile}</div>
                                  </td>
                                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-medium)', verticalAlign: 'middle' }}>
                                    {ledger.gstin || 'N/A'}
                                  </td>
                                  <td style={{ padding: '12px 14px', fontWeight: '600', verticalAlign: 'middle' }}>
                                    {formatCurrency(ledger.totalBilled)}
                                  </td>
                                  <td style={{ padding: '12px 14px', color: 'var(--secondary-green)', fontWeight: '600', verticalAlign: 'middle' }}>
                                    {formatCurrency(ledger.totalPaid)}
                                  </td>
                                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                    <span style={{
                                      fontWeight: '800',
                                      color: hasOverdue ? '#ef4444' : hasDues ? '#d97706' : 'var(--secondary-green)',
                                      fontSize: '0.95rem'
                                    }}>
                                      {formatCurrency(ledger.outstandingBalance)}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 14px', fontSize: '0.85rem', verticalAlign: 'middle' }}>
                                    <div>{formatCurrency(ledger.creditLimit || 100000)}</div>
                                    <div style={{ 
                                      height: '5px', width: '100px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' 
                                    }}>
                                      <div style={{ 
                                        height: '100%', 
                                        width: `${Math.min(100, ((ledger.outstandingBalance || 0) / (ledger.creditLimit || 100000)) * 100)}%`,
                                        backgroundColor: hasOverdue ? '#ef4444' : 'var(--primary-blue)'
                                      }}></div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                      <button 
                                        onClick={() => setSelectedLedger(ledger)}
                                        className="btn btn-outline btn-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="View Full Invoices Statement"
                                      >
                                        <FileText size={12} /> Statement
                                      </button>
                                      
                                      <button 
                                        onClick={() => handleOpenPaymentModal(ledger)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Record Manual Payment"
                                      >
                                        <Plus size={12} /> Pay
                                      </button>

                                      <button 
                                        onClick={() => handleSendStatementWhatsApp(ledger)}
                                        className="btn btn-primary btn-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', backgroundColor: '#25D366', borderColor: '#25D366', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Send WhatsApp Dues Reminder"
                                      >
                                        <Phone size={12} /> Dues
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 4: 🔥 DYNAMIC NEWS & SCHEMES MANAGER
                  ========================================== */}
              {activeTab === 'news' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>🔥 Dynamic News & Schemes Manager</h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Publish product schemes, price drops, new brand launches & live announcement tickers for retail chemists
                      </p>
                    </div>

                    <button 
                      onClick={() => handleOpenNewsModal(null)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ gap: '6px' }}
                    >
                      <Plus size={14} /> Create New Announcement / Scheme
                    </button>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '15px', alignItems: 'center' }}>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input 
                          type="text"
                          placeholder="Search announcements by title or content..."
                          value={newsSearch}
                          onChange={(e) => setNewsSearch(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Category:</span>
                        <select 
                          value={newsCategoryFilter}
                          onChange={(e) => setNewsCategoryFilter(e.target.value)}
                          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Categories</option>
                          <option value="Scheme">Scheme</option>
                          <option value="New Launch">New Launch</option>
                          <option value="Price Update">Price Update</option>
                          <option value="Notice">Notice</option>
                          <option value="Market News">Market News</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Company:</span>
                        <select 
                          value={newsCompanyFilter}
                          onChange={(e) => setNewsCompanyFilter(e.target.value)}
                          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Companies</option>
                          <option value="DAXIA">DAXIA</option>
                          <option value="Cipla">Cipla</option>
                          <option value="Troikaa">Troikaa</option>
                          <option value="General">General / All</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* News Announcements List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredNews.length === 0 ? (
                      <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No announcements or schemes match your search criteria.
                      </div>
                    ) : (
                      filteredNews.map((item) => (
                        <div key={item._id} className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              {/* Priority Pill */}
                              <span style={{
                                padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800',
                                backgroundColor: item.priority === 1 ? '#fee2e2' : '#fef3c7',
                                color: item.priority === 1 ? '#ef4444' : '#b45309'
                              }}>
                                {item.priority === 1 ? '🔥 PRIORITY P1' : `P${item.priority || 2}`}
                              </span>

                              {/* Category Pill */}
                              <span style={{
                                padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700',
                                backgroundColor: item.category === 'Scheme' ? '#ecfdf5' : item.category === 'New Launch' ? '#eff6ff' : '#f5f3ff',
                                color: item.category === 'Scheme' ? '#059669' : item.category === 'New Launch' ? '#2563eb' : '#7c3aed'
                              }}>
                                {item.category}
                              </span>

                              {/* Company Pill */}
                              <span style={{
                                padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700',
                                backgroundColor: '#f1f5f9', color: 'var(--text-dark)'
                              }}>
                                🏢 {item.company}
                              </span>

                              <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>{item.title}</strong>
                            </div>

                            {/* Actions & Ticker Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {/* Ticker Toggle Button */}
                              <button 
                                onClick={() => handleToggleNewsTicker(item)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px',
                                  fontSize: '0.75rem', fontWeight: '700', border: '1px solid',
                                  backgroundColor: item.isTickerActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                                  borderColor: item.isTickerActive ? '#86efac' : '#cbd5e1',
                                  color: item.isTickerActive ? '#16a34a' : 'var(--text-light)',
                                  cursor: 'pointer'
                                }}
                                title="Toggle display on live top announcement ticker"
                              >
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: item.isTickerActive ? '#22c55e' : '#94a3b8' }}></span>
                                {item.isTickerActive ? 'Live on Ticker' : 'Hidden from Ticker'}
                              </button>

                              <button 
                                onClick={() => handleOpenNewsModal(item)}
                                style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}
                                title="Edit announcement"
                              >
                                <Edit2 size={16} />
                              </button>

                              <button 
                                onClick={() => handleDeleteNews(item._id)}
                                style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}
                                title="Delete announcement"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Content row */}
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.5', margin: 0 }}>
                            {item.content}
                          </p>

                          {/* Footer row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-light)', paddingTop: '6px' }}>
                            <span>Created: {formatDate(item.createdAt)}</span>
                            {item.expiryDate ? (
                              <span style={{ color: new Date(item.expiryDate) < new Date() ? '#ef4444' : 'var(--primary-blue)', fontWeight: '600' }}>
                                ⏳ Valid till: {formatDate(item.expiryDate)}
                              </span>
                            ) : (
                              <span>⏳ Valid indefinitely</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 5: PRODUCTS MANAGER (UPGRADED)
                  ========================================== */}
              {activeTab === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  
                  {/* Top Bar Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Package size={26} /> Product Catalog & Inventory
                      </h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Add, edit, manage photos, track stock quantities and configure public catalog visibility
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={handleExportCSV} 
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px' }}
                        title="Download CSV spreadsheet of entire catalog"
                      >
                        <Download size={14} /> Export CSV
                      </button>

                      <button 
                        onClick={() => { setBulkImportResults(null); setIsBulkImportOpen(true); }} 
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px' }}
                        title="Import multiple products from CSV"
                      >
                        <FileSpreadsheet size={14} /> Import CSV
                      </button>

                      <button 
                        onClick={() => handleOpenProductModal(null)} 
                        className="btn btn-primary btn-sm" 
                        style={{ gap: '6px' }}
                      >
                        <Plus size={16} /> Add New Product
                      </button>
                    </div>
                  </div>

                  {/* Stat Cards Metrics Row */}
                  <div className="admin-stat-5-grid">
                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid var(--primary-blue)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(26, 86, 160, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}>
                        <Package size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Total Products</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: 1.2 }}>{productStats.totalProducts}</div>
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #10b981' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Active (Live)</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', lineHeight: 1.2 }}>{productStats.activeProducts}</div>
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #ef4444' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <AlertTriangle size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Out of Stock</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444', lineHeight: 1.2 }}>{productStats.outOfStock}</div>
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #8b5cf6' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                        <Layers size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Categories</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#8b5cf6', lineHeight: 1.2 }}>{productStats.totalCategories}</div>
                      </div>
                    </div>

                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #f59e0b' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                        <Star size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Featured</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b', lineHeight: 1.2 }}>{productStats.featuredProducts}</div>
                      </div>
                    </div>
                  </div>

                  {/* Controls & Filter Toolbar */}
                  <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Medilio Category Quick Selector Chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setProductCategoryFilter('All'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'All' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        All Products ({products.length})
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Generic Medicines'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Generic Medicines' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        💊 Generic Formulations
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Surgical Supplies'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Surgical Supplies' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        🩺 Surgical & Devices
                      </button>
                      <button onClick={() => { setProductCategoryFilter('OTC & Wellness'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'OTC & Wellness' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        🧴 OTC & Daily Care
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Ayurvedic & Herbal'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Ayurvedic & Herbal' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        🌿 Ayurvedic & Herbal
                      </button>
                    </div>
                    {/* Row 1: Search & View Modes */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '550px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input 
                          type="text" 
                          placeholder="Search by name, SKU ID, brand, composition, category..."
                          value={productSearch}
                          onChange={(e) => { setProductSearch(e.target.value); setProductPage(1); }}
                          style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                        {productSearch && (
                          <button 
                            onClick={() => { setProductSearch(''); setProductPage(1); }}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
                            aria-label="Clear search"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* View Switcher: Table / Grid */}
                        <div style={{ display: 'inline-flex', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                          <button
                            type="button"
                            onClick={() => setProductViewMode('table')}
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              backgroundColor: productViewMode === 'table' ? 'var(--primary-blue)' : '#fff',
                              color: productViewMode === 'table' ? '#fff' : 'var(--text-medium)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                            title="Table View"
                          >
                            <List size={16} /> Table
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductViewMode('grid')}
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              backgroundColor: productViewMode === 'grid' ? 'var(--primary-blue)' : '#fff',
                              color: productViewMode === 'grid' ? '#fff' : 'var(--text-medium)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                            title="Grid Cards View"
                          >
                            <Grid size={16} /> Grid
                          </button>
                        </div>

                        {/* Per-page selector */}
                        <select
                          value={productPerPage}
                          onChange={(e) => { setProductPerPage(Number(e.target.value)); setProductPage(1); }}
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff', color: 'var(--text-dark)' }}
                        >
                          <option value={10}>10 per page</option>
                          <option value={25}>25 per page</option>
                          <option value={50}>50 per page</option>
                          <option value={100}>100 per page</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Category, Stock, Active, Sort filters */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Category:</span>
                        <select 
                          value={productCategoryFilter} 
                          onChange={(e) => { setProductCategoryFilter(e.target.value); setProductPage(1); }}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Categories ({uniqueCategories.length})</option>
                          {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Stock:</span>
                        <select 
                          value={productStockFilter} 
                          onChange={(e) => { setProductStockFilter(e.target.value); setProductPage(1); }}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Stock</option>
                          <option value="InStock">In Stock Only</option>
                          <option value="OutOfStock">Out of Stock Only</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Status:</span>
                        <select 
                          value={productActiveFilter} 
                          onChange={(e) => { setProductActiveFilter(e.target.value); setProductPage(1); }}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="All">All Status</option>
                          <option value="Active">Active / Live Only</option>
                          <option value="Inactive">Inactive / Hidden Only</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Sort by:</span>
                        <select 
                          value={productSort} 
                          onChange={(e) => setProductSort(e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          <option value="newest">Recently Added</option>
                          <option value="nameAsc">Name (A → Z)</option>
                          <option value="nameDesc">Name (Z → A)</option>
                          <option value="priceAsc">Price (Low → High)</option>
                          <option value="priceDesc">Price (High → Low)</option>
                          <option value="stockAsc">Stock (Low → High)</option>
                          <option value="stockDesc">Stock (High → Low)</option>
                        </select>
                      </div>

                      {(productSearch || productCategoryFilter !== 'All' || productStockFilter !== 'All' || productActiveFilter !== 'All' || productSort !== 'newest') && (
                        <button
                          type="button"
                          onClick={() => {
                            setProductSearch('');
                            setProductCategoryFilter('All');
                            setProductStockFilter('All');
                            setProductActiveFilter('All');
                            setProductSort('newest');
                            setProductPage(1);
                          }}
                          style={{ padding: '6px 12px', border: 'none', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <X size={14} /> Reset Filters
                        </button>
                      )}

                      <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                        Showing <strong>{filteredProducts.length}</strong> matching products
                      </div>
                    </div>
                  </div>

                  {/* Empty State */}
                  {filteredProducts.length === 0 ? (
                    <div className="card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                        <Package size={30} />
                      </div>
                      <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>No products found</h3>
                      <p style={{ color: 'var(--text-medium)', maxWidth: '400px', margin: 0, fontSize: '0.9rem' }}>
                        {productSearch || productCategoryFilter !== 'All' 
                          ? 'Try adjusting your search criteria or resetting the active filters.'
                          : 'Your catalog is empty. Start adding your pharmaceutical formulations or jewelry products now.'}
                      </p>
                      <button 
                        onClick={() => handleOpenProductModal(null)} 
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '10px' }}
                      >
                        <Plus size={16} /> Add First Product
                      </button>
                    </div>
                  ) : productViewMode === 'table' ? (
                    /* ==========================================
                       TABLE VIEW
                       ========================================== */
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                      <div className="admin-table-container">
                        <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                              <th style={{ padding: '14px 16px', width: '70px' }}>Photo</th>
                              <th style={{ padding: '14px 16px' }}>Product Details & SKU</th>
                              <th style={{ padding: '14px 16px' }}>Category</th>
                              <th style={{ padding: '14px 16px' }}>Brand & Form</th>
                              <th style={{ padding: '14px 16px' }}>Pricing (PTR / MRP)</th>
                              <th style={{ padding: '14px 16px' }}>Stock & Units</th>
                              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Live Status</th>
                              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedProducts.map((p) => {
                              const photoUrl = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || '');
                              const hasMultiplePhotos = p.images && p.images.length > 1;
                              const isOutOfStock = !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
                              const discountPercent = p.mrp && p.price && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

                              return (
                                <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.15s ease' }}>
                                  {/* Photo Thumbnail */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      {photoUrl ? (
                                        <img 
                                          src={photoUrl} 
                                          alt={p.name} 
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                          onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                      ) : (
                                        <ImageIcon size={20} color="#94a3b8" />
                                      )}
                                      {hasMultiplePhotos && (
                                        <span 
                                          style={{
                                            position: 'absolute', bottom: '2px', right: '2px',
                                            backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
                                            fontSize: '0.65rem', padding: '1px 3px', borderRadius: '3px', fontWeight: '700'
                                          }}
                                          title={`${p.images.length} photos available`}
                                        >
                                          +{p.images.length - 1}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Product Details & SKU */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.95rem' }}>{p.name}</span>
                                      {p.featured && (
                                        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.7rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                          <Star size={10} fill="#b45309" /> Featured
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                      {p.sku && (
                                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary-blue)', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                          {p.sku}
                                        </span>
                                      )}
                                      {p.composition && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)' }}>
                                          {p.composition}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Category */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                                      {p.category}
                                    </span>
                                    {p.subCategory && (
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                                        ↳ {p.subCategory}
                                      </div>
                                    )}
                                  </td>

                                  {/* Brand & Form */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>{p.brand || 'Daxia'}</div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '3px' }}>
                                      {p.form || 'Tablet'} {p.packing ? `• ${p.packing}` : ''}
                                    </span>
                                  </td>

                                  {/* Pricing */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    <div style={{ fontWeight: '700', color: 'var(--primary-blue)', fontSize: '0.95rem' }}>
                                      {formatCurrency(p.price)}
                                    </div>
                                    {p.mrp && p.mrp > p.price && (
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ textDecoration: 'line-through' }}>{formatCurrency(p.mrp)}</span>
                                        <span style={{ color: '#16a34a', fontWeight: '700' }}>({discountPercent}% OFF)</span>
                                      </div>
                                    )}
                                  </td>

                                  {/* Stock & Quantity */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <button 
                                        type="button"
                                        onClick={() => handleToggleStock(p)}
                                        style={{
                                          border: 'none', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                          backgroundColor: !isOutOfStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                          color: !isOutOfStock ? '#059669' : '#dc2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                                        }}
                                        title="Click to toggle stock status"
                                      >
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: !isOutOfStock ? '#059669' : '#dc2626' }}></span>
                                        {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                                      </button>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                                        ({p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 100 : 0)} units)
                                      </span>
                                    </div>
                                  </td>

                                  {/* Live Status & Featured */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleActive(p)}
                                        style={{
                                          border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700',
                                          backgroundColor: p.isActive !== false ? '#ecfdf5' : '#f1f5f9',
                                          color: p.isActive !== false ? '#059669' : '#94a3b8',
                                          cursor: 'pointer'
                                        }}
                                        title={p.isActive !== false ? 'Live on public website (click to hide)' : 'Hidden from public website (click to publish)'}
                                      >
                                        {p.isActive !== false ? '● Live' : '○ Hidden'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleToggleFeatured(p)}
                                        style={{
                                          border: 'none', background: 'none', cursor: 'pointer', padding: '2px',
                                          color: p.featured ? '#f59e0b' : '#cbd5e1'
                                        }}
                                        title={p.featured ? 'Featured on website (click to remove)' : 'Mark as featured product'}
                                      >
                                        <Star size={16} fill={p.featured ? '#f59e0b' : 'none'} />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Actions */}
                                  <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                      <button 
                                        type="button"
                                        onClick={() => handleOpenProductModal(p)} 
                                        style={{ color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', padding: '6px', borderRadius: '6px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', cursor: 'pointer' }}
                                        title="Edit Product Details & Photos"
                                        aria-label="Edit product"
                                      >
                                        <Edit2 size={15} />
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => setProductToDelete(p)} 
                                        style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', cursor: 'pointer' }}
                                        title="Delete Product"
                                        aria-label="Delete product"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* ==========================================
                       GRID VIEW
                       ========================================== */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {paginatedProducts.map((p) => {
                        const photoUrl = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || '');
                        const hasMultiplePhotos = p.images && p.images.length > 1;
                        const isOutOfStock = !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
                        const discountPercent = p.mrp && p.price && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

                        return (
                          <div key={p._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {/* Card Media Preview Header */}
                            <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {photoUrl ? (
                                <img 
                                  src={photoUrl} 
                                  alt={p.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <ImageIcon size={40} color="#cbd5e1" />
                              )}

                              {/* Multi-photo badge */}
                              {hasMultiplePhotos && (
                                <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <ImageIcon size={12} /> {p.images.length} photos
                                </span>
                              )}

                              {/* Stock status badge */}
                              <span style={{
                                position: 'absolute', bottom: '10px', left: '10px',
                                backgroundColor: !isOutOfStock ? '#10b981' : '#ef4444',
                                color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '700'
                              }}>
                                {!isOutOfStock ? `● In Stock (${p.stockQuantity !== undefined ? p.stockQuantity : 100})` : '✕ Out of Stock'}
                              </span>

                              {/* Featured Star */}
                              <button
                                type="button"
                                onClick={() => handleToggleFeatured(p)}
                                style={{
                                  position: 'absolute', top: '10px', left: '10px',
                                  backgroundColor: p.featured ? '#f59e0b' : 'rgba(255,255,255,0.85)',
                                  color: p.featured ? '#fff' : '#64748b',
                                  border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                                title={p.featured ? 'Featured Product' : 'Mark as Featured'}
                              >
                                <Star size={16} fill={p.featured ? '#fff' : 'none'} />
                              </button>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                                  {p.category}
                                </span>
                                {p.sku && (
                                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-medium)' }}>
                                    {p.sku}
                                  </span>
                                )}
                              </div>

                              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.3 }}>
                                {p.name}
                              </h4>

                              {p.composition && (
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-medium)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.composition}
                                </p>
                              )}

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                                <div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                                    {formatCurrency(p.price)}
                                  </div>
                                  {p.mrp && p.mrp > p.price && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                      MRP: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(p.mrp)}</span> ({discountPercent}% off)
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleActive(p)}
                                  style={{
                                    border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700',
                                    backgroundColor: p.isActive !== false ? '#ecfdf5' : '#f1f5f9',
                                    color: p.isActive !== false ? '#059669' : '#94a3b8',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {p.isActive !== false ? 'Live' : 'Hidden'}
                                </button>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleStock(p)}
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                              >
                                {isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}
                              </button>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenProductModal(p)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '4px 8px' }}
                                  title="Edit Product"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProductToDelete(p)}
                                  style={{ padding: '4px 8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}
                                  title="Delete Product"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination Bar */}
                  {filteredProducts.length > 0 && (
                    <div className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                        Showing <strong>{((productPage - 1) * productPerPage) + 1}</strong> to <strong>{Math.min(productPage * productPerPage, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                          disabled={productPage === 1}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px', opacity: productPage === 1 ? 0.5 : 1, cursor: productPage === 1 ? 'not-allowed' : 'pointer', gap: '4px' }}
                        >
                          <ChevronLeft size={16} /> Prev
                        </button>

                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', padding: '0 8px' }}>
                          Page {productPage} of {totalProductPages}
                        </span>

                        <button
                          type="button"
                          onClick={() => setProductPage(prev => Math.min(totalProductPages, prev + 1))}
                          disabled={productPage >= totalProductPages}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px', opacity: productPage >= totalProductPages ? 0.5 : 1, cursor: productPage >= totalProductPages ? 'not-allowed' : 'pointer', gap: '4px' }}
                        >
                          Next <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ==========================================
                  TAB: COMPANIES & MANUFACTURERS MANAGER
                  ========================================== */}
              {activeTab === 'companies' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  
                  {/* Top Bar Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building2 size={26} /> Companies & Manufacturers Manager
                      </h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Manage pharmaceutical manufacturers, verified logos, official links, and catalog products
                      </p>
                    </div>

                    <button 
                      onClick={() => handleOpenCompanyModal(null)} 
                      className="btn btn-primary btn-sm" 
                      style={{ gap: '6px' }}
                    >
                      <Plus size={16} /> Add New Company
                    </button>
                  </div>

                  {/* Summary Metric Tiles */}
                  <div className="admin-stat-tiles-grid">
                    <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid var(--primary-blue)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600' }}>Total Companies</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)' }}>{companies.length}</div>
                    </div>
                    <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #10b981' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600' }}>Published (Live)</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>{companies.filter(c => c.isPublished !== false).length}</div>
                    </div>
                    <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #0284c7' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600' }}>Verified Partners</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0284c7' }}>{companies.filter(c => c.isVerified !== false).length}</div>
                    </div>
                    <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #8b5cf6' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600' }}>Total Categories</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#8b5cf6' }}>{Math.max(1, uniqueCompanyCategories.length - 1)}</div>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input 
                          type="text" 
                          placeholder="Search companies by name, category, or location..."
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Category:</span>
                        <select
                          value={companyCategoryFilter}
                          onChange={(e) => setCompanyCategoryFilter(e.target.value)}
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                        >
                          {uniqueCompanyCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Companies Table */}
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container">
                      <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '14px 16px', width: '60px' }}>Logo</th>
                            <th style={{ padding: '14px 16px' }}>Company Name</th>
                            <th style={{ padding: '14px 16px' }}>Category</th>
                            <th style={{ padding: '14px 16px' }}>Location</th>
                            <th style={{ padding: '14px 16px' }}>Catalog Products</th>
                            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Live Status</th>
                            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCompanies.map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', overflow: 'hidden' }}>
                                  <img 
                                    src={c.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0284c7&color=ffffff&size=80&bold=true`}
                                    alt={c.name}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0284c7&color=ffffff&size=80&bold=true`;
                                    }}
                                  />
                                </div>
                              </td>

                              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <strong style={{ color: 'var(--text-dark)' }}>{c.name}</strong>
                                  {c.isVerified !== false && (
                                    <ShieldCheck size={14} color="#0284c7" fill="#e0f2fe" title="Verified Manufacturer" />
                                  )}
                                </div>
                                {c.websiteUrl && (
                                  <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                                    {c.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ExternalLink size={10} />
                                  </a>
                                )}
                              </td>

                              <td style={{ padding: '12px 16px', verticalAlign: 'middle', fontSize: '0.85rem', color: '#475569' }}>
                                {c.category || 'Pharmaceuticals'}
                              </td>

                              <td style={{ padding: '12px 16px', verticalAlign: 'middle', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                                {c.location || 'India'}
                              </td>

                              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.8rem', fontWeight: '700', padding: '3px 8px', borderRadius: '12px' }}>
                                  {c.productCount || 0} products
                                </span>
                              </td>

                              <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleCompanyPublish(c)}
                                  style={{
                                    border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700',
                                    backgroundColor: c.isPublished !== false ? '#ecfdf5' : '#f1f5f9',
                                    color: c.isPublished !== false ? '#059669' : '#94a3b8',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {c.isPublished !== false ? '● Published' : '○ Hidden'}
                                </button>
                              </td>

                              <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCompanyModal(c)}
                                    style={{ color: 'var(--primary-blue)', padding: '6px', borderRadius: '6px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', cursor: 'pointer' }}
                                    title="Edit Company Profile & Logo"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCompanyToDelete(c)}
                                    style={{ color: '#ef4444', padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', cursor: 'pointer' }}
                                    title="Delete Company"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ==========================================
                  TAB 6: ENQUIRIES MANAGER (EXISTING)
                  ========================================== */}
              {activeTab === 'enquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Enquiries & B2B Registrations</h2>
                    
                    {/* Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>Filter Type:</span>
                      <select 
                        value={enquiryFilter} 
                        onChange={(e) => setEnquiryFilter(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.9rem', backgroundColor: '#fff' }}
                      >
                        <option value="All">All Submissions</option>
                        <option value="Cart Quote">Quote Carts</option>
                        <option value="Partner">B2B Partners</option>
                        <option value="Supplier">B2B Suppliers</option>
                        <option value="Manufacturing">Contract Mfg</option>
                        <option value="General Enquiry">General Contact</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredEnquiries.length === 0 ? (
                      <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No enquiries found for the selected filter.
                      </div>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <div key={enq._id} className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {/* Row 1: Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <div>
                              <span style={{
                                backgroundColor: 'var(--primary-blue)', color: '#fff', fontSize: '0.75rem', fontWeight: '700',
                                padding: '4px 10px', borderRadius: '20px', marginRight: '10px'
                              }}>
                                {enq.type}
                              </span>
                              <strong style={{ fontSize: '1.1rem' }}>{enq.name}</strong>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginLeft: '10px' }}>
                                {formatDate(enq.createdAt)}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <select 
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                                style={{
                                  padding: '5px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600',
                                  backgroundColor: enq.status === 'Completed' ? 'rgba(56, 142, 60, 0.1)' : enq.status === 'Contacted' ? 'rgba(27, 117, 188, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                  color: enq.status === 'Completed' ? 'var(--secondary-green)' : enq.status === 'Contacted' ? 'var(--accent-blue)' : '#ef4444'
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <button 
                                onClick={() => handleDeleteEnquiry(enq._id)} 
                                style={{ color: '#ef4444' }}
                                aria-label="Delete enquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Details */}
                          <div className="admin-form-grid-2-1" style={{ gap: '18px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                              <div>📞 Phone: <a href={`tel:${enq.phone}`} style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>{enq.phone}</a></div>
                              {enq.email && <div>✉️ Email: <a href={`mailto:${enq.email}`} style={{ color: 'var(--text-dark)' }}>{enq.email}</a></div>}
                              {enq.address && <div>📍 Address: <span style={{ color: 'var(--text-medium)' }}>{enq.address}</span></div>}
                            </div>
                            <div style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: '20px' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Message details / Requirements:</strong>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{enq.message}</p>
                            </div>
                          </div>

                          {/* Row 3: Items list if quote cart */}
                          {enq.type === 'Cart Quote' && enq.items && enq.items.length > 0 && (
                            <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '10px' }}>Requested Wholesale Quote Items:</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {enq.items.map((item, idx) => (
                                  <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}>
                                    {item.product ? (
                                      <span>
                                        <strong>{item.product.name}</strong> ({item.product.brand}) • <span style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>Qty: {item.quantity}</span>
                                      </span>
                                    ) : (
                                      <span style={{ color: 'var(--text-light)' }}>Product details deleted</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 7: CAREERS MANAGER (EXISTING)
                  ========================================== */}
              {activeTab === 'careers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Job Applicants</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {careers.length === 0 ? (
                      <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No job applications received yet.
                      </div>
                    ) : (
                      careers.map((app) => (
                        <div key={app._id} className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '1.15rem' }}>{app.name}</strong>
                              <span style={{ fontSize: '0.75rem', padding: '3px 8px', backgroundColor: 'rgba(27, 117, 188, 0.1)', color: 'var(--accent-blue)', borderRadius: '20px', fontWeight: '700', marginLeft: '10px' }}>
                                {app.position}
                              </span>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginLeft: '10px' }}>
                                Applied: {formatDate(app.createdAt)}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeleteCareer(app._id)} 
                              style={{ color: '#ef4444' }}
                              aria-label="Delete career"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="admin-form-grid-2-1" style={{ gap: '18px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                              <div>📞 Phone: <a href={`tel:${app.phone}`} style={{ fontWeight: '600' }}>{app.phone}</a></div>
                              <div>✉️ Email: <a href={`mailto:${app.email}`} style={{ color: 'var(--primary-blue)' }}>{app.email}</a></div>
                              <div>💼 Experience: <strong>{app.experience}</strong></div>
                              {app.resumePath && (
                                <a 
                                  href={app.resumePath} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn btn-outline btn-sm" 
                                  style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.75rem', gap: '5px' }}
                                >
                                  <Download size={12} /> View / Download Resume
                                </a>
                              )}
                            </div>
                            <div style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: '20px' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Cover Letter / Why hire:</strong>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                                {app.coverLetter || 'No cover letter provided.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ==========================================
          MODAL 1: ORDER FULL ITEMS BREAKDOWN MODAL
          ========================================== */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', textTransform: 'uppercase' }}>B2B Wholesale Order Details</span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>{selectedOrder.orderNumber}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-medium)' }} aria-label="Close">
                <XCircle size={22} />
              </button>
            </div>

            {/* Store & Customer Info */}
            <div className="admin-form-grid-2" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div>
                <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--primary-blue)' }}>{selectedOrder.shopName}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>📞 Mobile: {selectedOrder.retailerMobile}</div>
                {selectedOrder.retailerEmail && <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>✉️ Email: {selectedOrder.retailerEmail}</div>}
                {selectedOrder.gstin && <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>🏛️ GSTIN: {selectedOrder.gstin}</div>}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>📅 Order Date: <strong>{formatDate(selectedOrder.createdAt)}</strong></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  📦 Status: <strong>{selectedOrder.orderStatus || 'Booked'}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  💳 Payment: <strong>{selectedOrder.paymentStatus || 'Pending'}</strong>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: 'var(--text-dark)' }}>Ordered Products Breakdown</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>Product</th>
                      <th style={{ padding: '8px 10px' }}>Company</th>
                      <th style={{ padding: '8px 10px' }}>Boxes</th>
                      <th style={{ padding: '8px 10px' }}>Units</th>
                      <th style={{ padding: '8px 10px' }}>Rate</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: '600' }}>{item.productName}</td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-medium)' }}>{item.company || 'DAXIA'}</td>
                        <td style={{ padding: '8px 10px' }}>{item.boxes} Box</td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-medium)' }}>{item.totalUnits || item.boxes * 10} Units</td>
                        <td style={{ padding: '8px 10px' }}>{formatCurrency(item.unitPrice)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '700' }}>
                          {formatCurrency(item.itemTotal || (item.totalUnits || item.boxes * 10) * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Subtotal: <strong>{formatCurrency(selectedOrder.subTotal)}</strong></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>GST Tax: <strong>{formatCurrency(selectedOrder.gstAmount)}</strong></div>
              {selectedOrder.discountAmount > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-green)' }}>Scheme Discount: <strong>-{formatCurrency(selectedOrder.discountAmount)}</strong></div>
              )}
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-blue)', marginTop: '4px' }}>
                Grand Total: {formatCurrency(selectedOrder.grandTotal)}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', borderTop: '1px solid var(--border-light)', paddingTop: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Change Status:</span>
                <select 
                  value={selectedOrder.orderStatus || 'Booked'}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value, null)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Booked">Booked</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleExportSingleOrderInvoiceCSV(selectedOrder)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                  title="Download Commercial Invoice in Excel (CSV)"
                >
                  <FileSpreadsheet size={14} /> Download Invoice (Excel)
                </button>
                <a 
                  href={getWhatsAppDispatchUrl(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366', gap: '6px' }}
                >
                  <Phone size={14} /> Send WhatsApp Dispatch
                </a>
                <button onClick={() => setSelectedOrder(null)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: LEDGER STATEMENT / INVOICES MODAL
          ========================================== */}
      {selectedLedger && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', textTransform: 'uppercase' }}>Retailer Statement of Account</span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>{selectedLedger.shopName}</h2>
              </div>
              <button onClick={() => setSelectedLedger(null)} style={{ color: 'var(--text-medium)' }} aria-label="Close">
                <XCircle size={22} />
              </button>
            </div>

            {/* Account Summary Strip */}
            <div className="admin-form-grid-4" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Total Billed</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-blue)' }}>{formatCurrency(selectedLedger.totalBilled)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Total Paid</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--secondary-green)' }}>{formatCurrency(selectedLedger.totalPaid)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Outstanding Balance</span>
                <strong style={{ fontSize: '1.1rem', color: (selectedLedger.outstandingBalance || 0) > 0 ? '#ef4444' : 'var(--secondary-green)' }}>
                  {formatCurrency(selectedLedger.outstandingBalance)}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Credit Limit</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>{formatCurrency(selectedLedger.creditLimit)}</strong>
              </div>
            </div>

            {/* Invoices List */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="var(--primary-blue)" /> Invoices Ledger Breakdown
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>Invoice #</th>
                      <th style={{ padding: '8px 10px' }}>Date</th>
                      <th style={{ padding: '8px 10px' }}>Due Date</th>
                      <th style={{ padding: '8px 10px' }}>Amount</th>
                      <th style={{ padding: '8px 10px' }}>Paid</th>
                      <th style={{ padding: '8px 10px' }}>Balance</th>
                      <th style={{ padding: '8px 10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedLedger.invoices || []).length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
                          No invoices recorded for this retailer.
                        </td>
                      </tr>
                    ) : (
                      (selectedLedger.invoices || []).map((inv, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px', fontWeight: '700', color: 'var(--primary-blue)' }}>{inv.invoiceNumber}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-medium)' }}>{formatDate(inv.date)}</td>
                          <td style={{ padding: '8px 10px', color: inv.status === 'Overdue' ? '#ef4444' : 'var(--text-medium)', fontWeight: inv.status === 'Overdue' ? '700' : '400' }}>
                            {formatDate(inv.dueDate)}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>{formatCurrency(inv.amount)}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--secondary-green)' }}>{formatCurrency(inv.paidAmount)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: '700', color: (inv.balance || 0) > 0 ? '#ef4444' : 'var(--secondary-green)' }}>
                            {formatCurrency(inv.balance)}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{
                              padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700',
                              backgroundColor: inv.status === 'Paid' ? '#ecfdf5' : inv.status === 'Overdue' ? '#fee2e2' : '#fef3c7',
                              color: inv.status === 'Paid' ? '#059669' : inv.status === 'Overdue' ? '#ef4444' : '#b45309'
                            }}>
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

            {/* Payment History */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Receipt size={16} color="var(--secondary-green)" /> Received Payment Transactions
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>Receipt / Ref #</th>
                      <th style={{ padding: '8px 10px' }}>Date</th>
                      <th style={{ padding: '8px 10px' }}>Method</th>
                      <th style={{ padding: '8px 10px' }}>Amount Received</th>
                      <th style={{ padding: '8px 10px' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedLedger.payments || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
                          No payment receipts found.
                        </td>
                      </tr>
                    ) : (
                      (selectedLedger.payments || []).map((pmt, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>{pmt.paymentId || pmt.transactionRef || `PMT-${idx + 1}`}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-medium)' }}>{formatDate(pmt.date)}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e2e8f0', fontSize: '0.75rem', fontWeight: '600' }}>
                              {pmt.method || 'UPI'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: '700', color: 'var(--secondary-green)' }}>
                            {formatCurrency(pmt.amount)}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-medium)', fontSize: '0.8rem' }}>{pmt.notes || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', borderTop: '1px solid var(--border-light)', paddingTop: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                onClick={() => {
                  const target = selectedLedger;
                  setSelectedLedger(null);
                  handleOpenPaymentModal(target);
                }} 
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <Plus size={14} /> Record Offline Payment
              </button>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleExportLedgerInvoicesCSV(selectedLedger)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                  title="Export Invoices Breakdown to Excel (CSV)"
                >
                  <FileSpreadsheet size={14} /> Export Invoices (Excel)
                </button>
                <button 
                  onClick={() => handleSendStatementWhatsApp(selectedLedger)}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366', gap: '6px' }}
                >
                  <Phone size={14} /> Send WhatsApp Statement
                </button>
                <button onClick={() => setSelectedLedger(null)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: MANUAL / OFFLINE PAYMENT MODAL
          ========================================== */}
      {isPaymentModalOpen && paymentLedger && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', margin: 0 }}>Record Offline / Manual Payment</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Retailer: <strong>{paymentLedger.shopName}</strong> ({paymentLedger.retailerMobile})</span>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} style={{ color: 'var(--text-medium)' }} aria-label="Close">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                Current Outstanding Balance: <strong style={{ color: '#ef4444' }}>{formatCurrency(paymentLedger.outstandingBalance)}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="pay-amount" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Amount Received (₹) *</label>
                <input 
                  id="pay-amount"
                  type="number"
                  step="0.01"
                  required
                  placeholder="E.g., 25000"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="pay-method" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Payment Method *</label>
                  <select 
                    id="pay-method"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash Receipt</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="NetBanking">NEFT / RTGS</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="pay-date" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Payment Date *</label>
                  <input 
                    id="pay-date"
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="pay-ref" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Transaction Ref / Cheque No.</label>
                <input 
                  id="pay-ref"
                  type="text"
                  placeholder="E.g., UTR-12891928 or CHQ-551020"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="pay-notes" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Notes / Remarks</label>
                <textarea 
                  id="pay-notes"
                  rows="2"
                  placeholder="Optional details or remarks..."
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Apply Payment (FIFO)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 4: CREATE / EDIT NEWS & SCHEME MODAL
          ========================================== */}
      {isNewsModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: 0 }}>
                {editingNews ? 'Edit Scheme / Announcement' : 'Create New Scheme / Announcement'}
              </h2>
              <button onClick={() => setIsNewsModalOpen(false)} style={{ color: 'var(--text-medium)' }} aria-label="Close">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNews} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="news-title" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Announcement Title *</label>
                <input 
                  id="news-title"
                  type="text"
                  required
                  placeholder="E.g., Special Monsoon Scheme: Buy 10 Get 1 Free on Daxia"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="news-cat" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Category *</label>
                  <select 
                    id="news-cat"
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Scheme">Scheme</option>
                    <option value="New Launch">New Launch</option>
                    <option value="Price Update">Price Update</option>
                    <option value="Notice">Notice</option>
                    <option value="Market News">Market News</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="news-comp" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Company *</label>
                  <input 
                    id="news-comp"
                    type="text"
                    required
                    placeholder="E.g., DAXIA, Cipla, Troikaa, General"
                    value={newsCompany}
                    onChange={(e) => setNewsCompany(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="news-pri" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Priority Level *</label>
                  <select 
                    id="news-pri"
                    value={newsPriority}
                    onChange={(e) => setNewsPriority(Number(e.target.value))}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value={1}>1 - Highest (Top of Feed / Ticker)</option>
                    <option value={2}>2 - High</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Standard Notice</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="news-exp" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Expiry Date (Optional)</label>
                  <input 
                    id="news-exp"
                    type="date"
                    value={newsExpiryDate}
                    onChange={(e) => setNewsExpiryDate(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="news-cont" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Announcement Details & Scheme Terms *</label>
                <textarea 
                  id="news-cont"
                  rows="4"
                  required
                  placeholder="Provide complete scheme details, PTR bonus terms, qualifying quantities..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <input 
                  id="news-ticker"
                  type="checkbox"
                  checked={newsIsTickerActive}
                  onChange={(e) => setNewsIsTickerActive(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }}
                />
                <label htmlFor="news-ticker" style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                  Show on Live Top Announcement Ticker
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsNewsModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingNews ? 'Update Announcement' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 5: ADD / EDIT PRODUCT MODAL (UPGRADED)
          ========================================== */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0 }}>
                  {editingProduct ? 'Edit Product Details & Photos' : 'Add New Product to Catalog'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                  Upload photos, configure pricing, track stock quantity, and assign manufacturer
                </p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* SECTION 1: MULTI-PHOTO UPLOAD & GALLERY */}
              <div style={{ padding: '18px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={18} color="var(--primary-blue)" /> Product Photos & Gallery ({prodImages.length})
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)' }}>
                    First photo is designated as the primary display image
                  </span>
                </div>

                {/* Drag-and-drop dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setPhotoDragActive(true); }}
                  onDragLeave={() => setPhotoDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setPhotoDragActive(false); handlePhotoUpload(e); }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${photoDragActive ? 'var(--primary-blue)' : '#cbd5e1'}`,
                    backgroundColor: photoDragActive ? '#eff6ff' : '#fff',
                    borderRadius: '8px',
                    padding: '24px 15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '15px'
                  }}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  {isUploadingPhotos ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: '600' }}>Uploading photos to persistent storage...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <Upload size={24} color="var(--primary-blue)" />
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Click to select photos or drag & drop multiple images
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Supports JPG, PNG, WebP up to 10MB each (Batch uploads supported)
                      </div>
                    </div>
                  )}
                </div>

                {/* Or add photo by URL */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                  <input 
                    type="url"
                    placeholder="Or enter image URL (https://...)"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddImageUrl}
                    className="btn btn-outline btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Add URL Photo
                  </button>
                </div>

                {/* Live Photo Gallery Cards */}
                {prodImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                    {prodImages.map((img, idx) => {
                      const isMain = idx === 0 || img === prodImageUrl;
                      return (
                        <div 
                          key={idx}
                          style={{
                            position: 'relative',
                            height: '110px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: isMain ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                            backgroundColor: '#fff',
                            boxShadow: isMain ? '0 0 0 2px rgba(245, 158, 11, 0.2)' : 'none'
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`Photo ${idx + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80'; }}
                          />

                          {/* Main Badge */}
                          {isMain && (
                            <span style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#f59e0b', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '1px 5px', borderRadius: '3px' }}>
                              ★ Main
                            </span>
                          )}

                          {/* Hover Controls */}
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)', padding: '3px 4px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => handleSetMainPhoto(img)}
                                style={{ background: 'none', border: 'none', color: '#fef08a', fontSize: '0.65rem', cursor: 'pointer', padding: '1px' }}
                                title="Set as primary photo"
                              >
                                Set Main
                              </button>
                            )}
                            <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(idx, -1)}
                                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.7rem', cursor: 'pointer', padding: '1px 3px' }}
                                  title="Move Left"
                                >
                                  ◀
                                </button>
                              )}
                              {idx < prodImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(idx, 1)}
                                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.7rem', cursor: 'pointer', padding: '1px 3px' }}
                                  title="Move Right"
                                >
                                  ▶
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(img)}
                                style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: '0.75rem', cursor: 'pointer', padding: '1px 3px' }}
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 2: PRODUCT IDENTITY & COMPANY */}
              <div className="admin-form-grid-2-1">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Product Name *</label>
                  <input 
                    id="modal-name"
                    type="text" required placeholder="E.g., Paracetamol Tablet IP 500mg" 
                    value={prodName} onChange={(e) => setProdName(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="modal-sku" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Product SKU / ID</label>
                    <button 
                      type="button"
                      onClick={() => setProdSku(`NP-${Date.now().toString().slice(-6)}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Generate SKU
                    </button>
                  </div>
                  <input 
                    id="modal-sku"
                    type="text" placeholder="E.g., NP-PT-500" 
                    value={prodSku} onChange={(e) => setProdSku(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Company & Category Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-comp" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Manufacturer / Company *</label>
                  <select 
                    id="modal-comp"
                    value={prodCompany} 
                    onChange={(e) => {
                      setProdCompany(e.target.value);
                      setProdManufacturer(e.target.value);
                      setProdBrand(e.target.value);
                    }}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="DAXIA">Daxia Healthcare</option>
                    {companies.map(c => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-cat" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Category *</label>
                  <select 
                    id="modal-cat"
                    value={prodCategory} 
                    onChange={(e) => setProdCategory(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Pharma Products">Pharma Products</option>
                    <option value="OTC Products">OTC Products</option>
                    <option value="Injectables">Injectables</option>
                    <option value="Surgical & Medical Supplies">Surgical & Medical Supplies</option>
                    <option value="Diagnostics & Formulations">Diagnostics & Formulations</option>
                    <option value="Ophthalmology & Dermatology">Ophthalmology & Dermatology</option>
                    <option value="Cardiovascular & CNS">Cardiovascular & CNS</option>
                    <option value="Custom">Custom Category...</option>
                  </select>
                  {prodCategory === 'Custom' && (
                    <input 
                      type="text" 
                      placeholder="Enter custom category name..."
                      value={prodCustomCategory}
                      onChange={(e) => setProdCustomCategory(e.target.value)}
                      style={{ marginTop: '4px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  )}
                </div>
              </div>

              {/* SubCategory & Brand */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-brand" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Brand Name</label>
                  <input 
                    id="modal-brand"
                    type="text" placeholder="E.g., Daxia Healthcare" 
                    value={prodBrand} onChange={(e) => setProdBrand(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-subcat" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Subcategory / Variant</label>
                  <input 
                    id="modal-subcat"
                    type="text" placeholder="E.g., Effervescent, Pain Relief, Pediatric" 
                    value={prodSubCategory} onChange={(e) => setProdSubCategory(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* SECTION 3: PRICING & INVENTORY */}
              <div className="admin-form-grid-3">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-price" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Wholesale Price / PTR (₹) *</label>
                  <input 
                    id="modal-price"
                    type="number" step="0.01" required placeholder="E.g., 28.50" 
                    value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-mrp" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Regular Price / MRP (₹)</label>
                  <input 
                    id="modal-mrp"
                    type="number" step="0.01" placeholder="E.g., 45.00" 
                    value={prodMrp} onChange={(e) => setProdMrp(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-stockqty" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Stock Quantity (Units) *</label>
                  <input 
                    id="modal-stockqty"
                    type="number" required placeholder="E.g., 100" 
                    value={prodStockQuantity} onChange={(e) => setProdStockQuantity(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* SECTION 4: FORMULATION & PACKING SPECS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-form" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Formulation Form</label>
                  <select 
                    id="modal-form"
                    value={prodForm} onChange={(e) => setProdForm(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Drops">Drops</option>
                    <option value="Cream">Cream</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Gel">Gel</option>
                    <option value="Lotion">Lotion</option>
                    <option value="Soap">Soap</option>
                    <option value="Spray">Spray</option>
                    <option value="Powder">Powder</option>
                    <option value="IV Fluid">IV Fluid</option>
                    <option value="Surgical">Surgical & Device</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-packing" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Packing Specifications</label>
                  <input 
                    id="modal-packing"
                    type="text" placeholder="E.g., 10 x 10 Tablets or 100ml" 
                    value={prodPacking} onChange={(e) => setProdPacking(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-composition" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Chemical / Active Composition</label>
                  <input 
                    id="modal-composition"
                    type="text" placeholder="E.g., Paracetamol IP 500mg" 
                    value={prodComposition} onChange={(e) => setProdComposition(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-mfg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Manufacturer Details</label>
                  <input 
                    id="modal-mfg"
                    type="text" placeholder="E.g., Daxia Healthcare Pvt. Ltd." 
                    value={prodManufacturer} onChange={(e) => setProdManufacturer(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="modal-desc" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Product Description & Indications</label>
                <textarea 
                  id="modal-desc"
                  rows="3" placeholder="Provide product indication, therapeutic dosage, age advisory or usage..." 
                  value={prodDescription} onChange={(e) => setProdDescription(e.target.value)}
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Toggles Row */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    style={{ accentColor: 'var(--primary-blue)', width: '16px', height: '16px' }}
                  />
                  Publish as &ldquo;In Stock&rdquo;
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }}
                  />
                  Mark as Featured Product (Highlights on Showcase)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox"
                    checked={prodIsActive}
                    onChange={(e) => setProdIsActive(e.target.checked)}
                    style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                  />
                  Live & Visible on Public Website
                </label>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingProduct} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                  {isSavingProduct ? 'Saving Product...' : (editingProduct ? 'Save Product Changes' : 'Create & Publish Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 6: DELETE PRODUCT CONFIRMATION MODAL
          ========================================== */}
      {productToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '460px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <AlertTriangle size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', margin: '0 0 8px' }}>Confirm Product Deletion</h3>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 20px' }}>
              Are you sure you want to permanently delete <strong>{productToDelete.name}</strong> (SKU: {productToDelete.sku || 'N/A'})?
              This will remove the product and unlinked uploaded photos from disk. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setProductToDelete(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button onClick={handleConfirmDeleteProduct} className="btn btn-primary btn-sm" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}>
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 7: BULK CSV IMPORT MODAL
          ========================================== */}
      {isBulkImportOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '15px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', margin: 0 }}>Bulk Import Products (CSV)</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Paste CSV content or select a .csv file from your computer</span>
              </div>
              <button onClick={() => setIsBulkImportOpen(false)} style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                <strong>Supported CSV Header Format:</strong><br />
                <code>Name, SKU, Category, Brand, Price, MRP, StockQuantity, Packing, Composition, Form, ImageUrl, Description</code>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Upload CSV File:
                </label>
                <input 
                  type="file" 
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setBulkCsvText(event.target.result);
                      reader.readAsText(file);
                    }
                  }}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Or Paste CSV Text Here:
                </label>
                <textarea 
                  rows={7}
                  placeholder={`Name, SKU, Category, Price, MRP, StockQuantity\nMUCIDAX 600, DAX-MUC-600, Pharma Products, 185.0, 260.0, 100\nAMLOSKY - 2.5, DAX-AML-25, Pharma Products, 28.5, 45.0, 100`}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>

              {bulkImportResults && (
                <div style={{ padding: '12px 16px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '0.85rem', color: '#065f46' }}>
                  <strong>Import Summary:</strong> Successfully created/updated {bulkImportResults.successCount} products.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsBulkImportOpen(false)} className="btn btn-outline btn-sm">
                  Close
                </button>
                <button 
                  type="button" 
                  onClick={handleExecuteBulkImport}
                  disabled={isImportingBulk || !bulkCsvText.trim()}
                  className="btn btn-primary btn-sm"
                >
                  {isImportingBulk ? 'Importing Products...' : 'Execute Bulk Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 8: ADD / EDIT COMPANY MODAL
          ========================================== */}
      {isCompanyModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card admin-modal-card" style={{ maxWidth: '660px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: 0 }}>
                  {editingCompany ? 'Edit Company Profile' : 'Add New Company / Brand'}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                  Manage company details, official website, and logo
                </span>
              </div>
              <button onClick={() => setIsCompanyModalOpen(false)} style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Company Name *</label>
                <input 
                  type="text" required placeholder="E.g., Cipla Ltd"
                  value={compName} onChange={(e) => setCompName(e.target.value)}
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Industry Category</label>
                  <input 
                    type="text" placeholder="E.g., Diagnostics & Formulations"
                    value={compCategory} onChange={(e) => setCompCategory(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Headquarters Location</label>
                  <input 
                    type="text" placeholder="E.g., Ahmedabad, Gujarat"
                    value={compLocation} onChange={(e) => setCompLocation(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Official Website URL</label>
                  <input 
                    type="url" placeholder="https://www.example.com"
                    value={compWebsiteUrl} onChange={(e) => setCompWebsiteUrl(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Logo Image URL</label>
                  <input 
                    type="url" placeholder="https://..."
                    value={compLogoUrl} onChange={(e) => setCompLogoUrl(e.target.value)}
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Key Specialties (Comma-separated)</label>
                <input 
                  type="text" placeholder="E.g., Effervescent, Injectables, Cardiology, WHO-GMP"
                  value={compSpecialties} onChange={(e) => setCompSpecialties(e.target.value)}
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Company Description</label>
                <textarea 
                  rows="3" placeholder="Brief overview of company operations and products..."
                  value={compDescription} onChange={(e) => setCompDescription(e.target.value)}
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox"
                    checked={compIsPublished}
                    onChange={(e) => setCompIsPublished(e.target.checked)}
                    style={{ accentColor: 'var(--primary-blue)', width: '16px', height: '16px' }}
                  />
                  Live & Visible in Directory
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox"
                    checked={compIsVerified}
                    onChange={(e) => setCompIsVerified(e.target.checked)}
                    style={{ accentColor: '#0284c7', width: '16px', height: '16px' }}
                  />
                  Verified Partner Badge
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingCompany} className="btn btn-primary btn-sm">
                  {isSavingCompany ? 'Saving...' : (editingCompany ? 'Save Changes' : 'Add Company')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 9: DELETE COMPANY CONFIRMATION MODAL
          ========================================== */}
      {companyToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '25px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <AlertTriangle size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', margin: '0 0 8px' }}>Remove Company Record</h3>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 20px' }}>
              Are you sure you want to delete <strong>{companyToDelete.name}</strong> from the directory?
              Products belonging to this company will remain intact.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setCompanyToDelete(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button onClick={handleConfirmDeleteCompany} className="btn btn-primary btn-sm" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}>
                Yes, Delete Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;

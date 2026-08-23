import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, LayoutDashboard, ShoppingBag, MessageSquare, Briefcase, LogOut, 
  Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronDown, Download, AlertCircle,
  Package, FileText, Flame, Phone, Search, RefreshCw, Filter, ExternalLink,
  Calendar, CreditCard, Check, X, Eye, Send, ArrowUpDown, User, Building2,
  Tag, ShieldCheck, Sparkles, Clock, AlertTriangle, Printer, Share2, Receipt,
  TrendingUp, Percent
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
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  
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

  const [selectedOrder, setSelectedOrder] = useState(null); // Full breakdown modal
  const [selectedLedger, setSelectedLedger] = useState(null); // Statement modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Manual payment modal
  const [paymentLedger, setPaymentLedger] = useState(null);

  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Form Fields for Add/Edit Product
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('Pharma Products');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodPacking, setProdPacking] = useState('');
  const [prodComposition, setProdComposition] = useState('');
  const [prodForm, setProdForm] = useState('Tablet');
  const [prodManufacturer, setProdManufacturer] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('');

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

  // Check login on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('niyansh_admin_session');
    if (adminSession === 'active') {
      setIsAuthenticated(true);
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
        const prodRes = await fetch('/api/products?limit=1000');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products && prodData.products.length > 0 ? prodData.products : FALLBACK_PRODUCTS);
        } else {
          setProducts(FALLBACK_PRODUCTS);
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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@niyanshpharma.com' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('niyansh_admin_session', 'active');
      setLoginError('');
      showToast('Welcome back, Admin! Live console connected.');
    } else {
      setLoginError('Invalid email or password. Use demo credentials below.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('niyansh_admin_session');
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
        headers: { 'Content-Type': 'application/json' },
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

    const headers = [
      'Order Number',
      'Date',
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

    const rows = filteredOrders.map(ord => {
      const itemsSummary = (ord.items || [])
        .map(i => `${i.productName} (${i.boxes} Box)`)
        .join('; ')
        .replace(/"/g, '""');

      return [
        `"${ord.orderNumber}"`,
        `"${formatDate(ord.createdAt)}"`,
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `niyansh_pharma_b2b_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders CSV exported successfully!');
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
        headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
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
  // PRODUCT CRUD HANDLERS
  // ==========================================

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdBrand(product.brand);
      setProdCategory(product.category);
      setProdSku(product.sku || '');
      setProdPrice(product.price);
      setProdInStock(product.inStock);
      setProdPacking(product.packing || '');
      setProdComposition(product.composition || '');
      setProdForm(product.form || 'Tablet');
      setProdManufacturer(product.manufacturer || '');
      setProdImageUrl(product.imageUrl || '');
      setProdDescription(product.description || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdBrand('');
      setProdCategory('Pharma Products');
      setProdSku('');
      setProdPrice('');
      setProdInStock(true);
      setProdPacking('');
      setProdComposition('');
      setProdForm('Tablet');
      setProdManufacturer('');
      setProdImageUrl('');
      setProdDescription('');
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      brand: prodBrand,
      category: prodCategory,
      sku: prodSku,
      price: parseFloat(prodPrice) || 0,
      inStock: prodInStock,
      packing: prodPacking,
      composition: prodComposition,
      form: prodForm,
      manufacturer: prodManufacturer,
      imageUrl: prodImageUrl,
      description: prodDescription
    };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setIsProductModalOpen(false);
        fetchDashboardData();
        showToast(editingProduct ? 'Product updated successfully!' : 'New product added to catalog!');
      } else {
        setIsProductModalOpen(false);
        if (editingProduct) {
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...payload } : p));
        } else {
          setProducts(prev => [{ _id: `p-${Date.now()}`, ...payload }, ...prev]);
        }
        showToast(editingProduct ? 'Product updated!' : 'Product added!');
      }
    } catch {
      setIsProductModalOpen(false);
      if (editingProduct) {
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...payload } : p));
      } else {
        setProducts(prev => [{ _id: `p-${Date.now()}`, ...payload }, ...prev]);
      }
      showToast('Product saved locally!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        showToast('Product deleted successfully');
      } else {
        setProducts(prev => prev.filter(p => p._id !== id));
        showToast('Product removed');
      }
    } catch {
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast('Product removed');
    }
  };

  const handleToggleStock = async (product) => {
    const newStock = !product.inStock;
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStock })
      });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: newStock } : p));
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: newStock } : p));
    }
    showToast(`Product marked as ${newStock ? 'In Stock' : 'Out of Stock'}`);
  };

  // ==========================================
  // ENQUIRIES & CAREERS HANDLERS
  // ==========================================

  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      showToast(`Enquiry status updated to ${status}`);
    } catch {
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      showToast(`Enquiry updated`);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      setEnquiries(prev => prev.filter(e => e._id !== id));
      showToast('Enquiry deleted');
    } catch {
      setEnquiries(prev => prev.filter(e => e._id !== id));
      showToast('Enquiry deleted');
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!window.confirm('Delete this job application record?')) return;
    try {
      await fetch(`/api/careers/${id}`, { method: 'DELETE' });
      setCareers(prev => prev.filter(c => c._id !== id));
      showToast('Applicant record deleted');
    } catch {
      setCareers(prev => prev.filter(c => c._id !== id));
      showToast('Applicant record deleted');
    }
  };

  // ==========================================
  // FILTERED DATA COMPUTATIONS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.composition && p.composition.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
    );
  }, [products, productSearch]);

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

  // Summary Metrics Computations for Wholesale B2B
  const totalWholesaleOrdersCount = orders.length;
  const totalWholesaleRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0), [orders]);
  const totalOutstandingDues = useMemo(() => ledgers.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0), [ledgers]);
  const overdueLedgersCount = useMemo(() => {
    return ledgers.filter(l => (l.invoices || []).some(inv => inv.balance > 0 && inv.status === 'Overdue')).length;
  }, [ledgers]);
  const activeSchemesCount = useMemo(() => news.filter(n => n.category === 'Scheme').length, [news]);
  const activeTickerCount = useMemo(() => news.filter(n => n.isTickerActive).length, [news]);

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
      <div className="container admin-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Sidebar Nav */}
        <aside className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
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
                <CreditCard size={16} /> 📊 Retailer Ledgers
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
                  
                  {/* High-Impact Wholesale B2B Summary Tiles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
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

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                            <th style={{ padding: '10px 12px' }}>Order #</th>
                            <th style={{ padding: '10px 12px' }}>Store Name</th>
                            <th style={{ padding: '10px 12px' }}>Date</th>
                            <th style={{ padding: '10px 12px' }}>Grand Total</th>
                            <th style={{ padding: '10px 12px' }}>Order Status</th>
                            <th style={{ padding: '10px 12px' }}>Payment</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 4).map((ord) => (
                            <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--primary-blue)' }}>{ord.orderNumber}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <div style={{ fontWeight: '600' }}>{ord.shopName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{ord.retailerMobile}</div>
                              </td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-medium)' }}>{formatDate(ord.createdAt)}</td>
                              <td style={{ padding: '10px 12px', fontWeight: '700' }}>{formatCurrency(ord.grandTotal)}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                                  backgroundColor: ord.orderStatus === 'Delivered' ? 'rgba(34, 197, 94, 0.1)' : ord.orderStatus === 'Dispatched' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                  color: ord.orderStatus === 'Delivered' ? '#16a34a' : ord.orderStatus === 'Dispatched' ? '#2563eb' : '#d97706'
                                }}>
                                  {ord.orderStatus || 'Booked'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                                  backgroundColor: ord.paymentStatus === 'Paid' ? 'rgba(34, 197, 94, 0.1)' : ord.paymentStatus === 'Partially Paid' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                  color: ord.paymentStatus === 'Paid' ? '#16a34a' : ord.paymentStatus === 'Partially Paid' ? '#d97706' : '#ef4444'
                                }}>
                                  {ord.paymentStatus || 'Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <button 
                                  onClick={() => setSelectedOrder(ord)} 
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
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
                        style={{ gap: '6px' }}
                      >
                        <Download size={14} /> Export CSV
                      </button>
                      <button 
                        onClick={fetchDashboardData} 
                        className="btn btn-outline btn-sm" 
                        style={{ gap: '6px' }}
                      >
                        <RefreshCw size={14} /> Refresh
                      </button>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '15px', alignItems: 'center' }}>
                      {/* Search */}
                      <div style={{ position: 'relative' }}>
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
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '12px 14px' }}>Order ID & Date</th>
                            <th style={{ padding: '12px 14px' }}>Store & Retailer</th>
                            <th style={{ padding: '12px 14px' }}>Items Summary</th>
                            <th style={{ padding: '12px 14px' }}>Grand Total</th>
                            <th style={{ padding: '12px 14px' }}>Order Status</th>
                            <th style={{ padding: '12px 14px' }}>Payment Status</th>
                            <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                                No B2B orders match your current filters.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((ord) => (
                              <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '12px 14px' }}>
                                  <div style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>{ord.orderNumber}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{formatDate(ord.createdAt)}</div>
                                </td>
                                <td style={{ padding: '12px 14px' }}>
                                  <div style={{ fontWeight: '600' }}>{ord.shopName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>📞 {ord.retailerMobile}</div>
                                  {ord.gstin && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>GSTIN: {ord.gstin}</div>}
                                </td>
                                <td style={{ padding: '12px 14px' }}>
                                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                                    {(ord.items || []).length} Product Line{(ord.items || []).length > 1 ? 's' : ''}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {(ord.items || []).map(i => `${i.productName} (${i.boxes}b)`).join(', ')}
                                  </div>
                                </td>
                                <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--text-dark)' }}>
                                  {formatCurrency(ord.grandTotal)}
                                </td>
                                <td style={{ padding: '12px 14px' }}>
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
                                <td style={{ padding: '12px 14px' }}>
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
                                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                                    <button 
                                      onClick={() => setSelectedOrder(ord)} 
                                      className="btn btn-outline btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                                      title="View Breakdown"
                                    >
                                      <Eye size={13} /> View
                                    </button>
                                    <a 
                                      href={getWhatsAppDispatchUrl(ord)} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="btn btn-primary btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', backgroundColor: '#25D366', borderColor: '#25D366' }}
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
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>📊 Retailer Ledgers & Outstanding</h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Manage B2B credit accounts, check overdue balances, record manual/offline payments & send WhatsApp ledger statements
                      </p>
                    </div>

                    <button onClick={fetchDashboardData} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                      <RefreshCw size={14} /> Refresh Ledgers
                    </button>
                  </div>

                  {/* Summary Metric Cards for Ledgers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'center' }}>
                      <div style={{ position: 'relative' }}>
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
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '12px 14px' }}>Retailer Shop & Mobile</th>
                            <th style={{ padding: '12px 14px' }}>GSTIN</th>
                            <th style={{ padding: '12px 14px' }}>Total Billed</th>
                            <th style={{ padding: '12px 14px' }}>Total Paid</th>
                            <th style={{ padding: '12px 14px' }}>Outstanding Dues</th>
                            <th style={{ padding: '12px 14px' }}>Credit Limit</th>
                            <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLedgers.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
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
                                  <td style={{ padding: '12px 14px' }}>
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
                                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-medium)' }}>
                                    {ledger.gstin || 'N/A'}
                                  </td>
                                  <td style={{ padding: '12px 14px', fontWeight: '600' }}>
                                    {formatCurrency(ledger.totalBilled)}
                                  </td>
                                  <td style={{ padding: '12px 14px', color: 'var(--secondary-green)', fontWeight: '600' }}>
                                    {formatCurrency(ledger.totalPaid)}
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <span style={{
                                      fontWeight: '800',
                                      color: hasOverdue ? '#ef4444' : hasDues ? '#d97706' : 'var(--secondary-green)',
                                      fontSize: '0.95rem'
                                    }}>
                                      {formatCurrency(ledger.outstandingBalance)}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 14px', fontSize: '0.85rem' }}>
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
                                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                      <button 
                                        onClick={() => setSelectedLedger(ledger)}
                                        className="btn btn-outline btn-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                                        title="View Full Invoices Statement"
                                      >
                                        <FileText size={12} /> Statement
                                      </button>
                                      
                                      <button 
                                        onClick={() => handleOpenPaymentModal(ledger)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                                        title="Record Manual Payment"
                                      >
                                        <Plus size={12} /> Pay
                                      </button>

                                      <button 
                                        onClick={() => handleSendStatementWhatsApp(ledger)}
                                        className="btn btn-primary btn-sm"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px', backgroundColor: '#25D366', borderColor: '#25D366' }}
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
                  TAB 5: PRODUCTS MANAGER (EXISTING)
                  ========================================== */}
              {activeTab === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Product Catalog Manager</h2>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Manage pharmaceutical products, PTR rates, formulation forms & live stock availability
                      </p>
                    </div>
                    <button 
                      onClick={() => handleOpenProductModal(null)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ gap: '6px' }}
                    >
                      <Plus size={14} /> Add New Product
                    </button>
                  </div>

                  <div className="card" style={{ padding: '20px' }}>
                    {/* Search block */}
                    <div style={{ marginBottom: '20px' }}>
                      <input 
                        type="text" 
                        placeholder="Search products by name, brand, composition, SKU..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        style={{ width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '12px 15px' }}>Name</th>
                            <th style={{ padding: '12px 15px' }}>Brand & Form</th>
                            <th style={{ padding: '12px 15px' }}>Category</th>
                            <th style={{ padding: '12px 15px' }}>Price (PTR)</th>
                            <th style={{ padding: '12px 15px' }}>Stock</th>
                            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p) => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '12px 15px' }}>
                                <div style={{ fontWeight: '700' }}>{p.name}</div>
                                {p.composition && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.composition}</div>}
                              </td>
                              <td style={{ padding: '12px 15px' }}>
                                <div>{p.brand}</div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                  {p.form || 'Tablet'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 15px', fontSize: '0.8rem', color: 'var(--text-medium)' }}>{p.category}</td>
                              <td style={{ padding: '12px 15px', fontWeight: '700', color: 'var(--primary-blue)' }}>{formatCurrency(p.price)}</td>
                              <td style={{ padding: '12px 15px' }}>
                                <button 
                                  onClick={() => handleToggleStock(p)}
                                  style={{
                                    border: 'none', padding: '3px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                    backgroundColor: p.inStock ? 'rgba(56, 142, 60, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: p.inStock ? 'var(--secondary-green)' : '#ef4444', cursor: 'pointer'
                                  }}
                                >
                                  {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                                </button>
                              </td>
                              <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '10px' }}>
                                  <button 
                                    onClick={() => handleOpenProductModal(p)} 
                                    style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}
                                    title="Edit Product"
                                    aria-label="Edit product"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p._id)} 
                                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}
                                    title="Delete Product"
                                    aria-label="Delete product"
                                  >
                                    <Trash2 size={16} />
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
                          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
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

                          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
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
          <div className="card" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
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

              <div style={{ display: 'flex', gap: '10px' }}>
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
          <div className="card" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
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

              <div style={{ display: 'flex', gap: '10px' }}>
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
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
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
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
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
          MODAL 5: ADD / EDIT PRODUCT MODAL (EXISTING)
          ========================================== */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} style={{ color: 'var(--text-medium)' }} aria-label="Close">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-name" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Product Name *</label>
                  <input 
                    id="modal-name"
                    type="text" required placeholder="E.g., Paracetamol Tablet IP 500mg" 
                    value={prodName} onChange={(e) => setProdName(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-brand" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Brand Name *</label>
                  <input 
                    id="modal-brand"
                    type="text" required placeholder="E.g., Cipla" 
                    value={prodBrand} onChange={(e) => setProdBrand(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-cat" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Category *</label>
                  <select 
                    id="modal-cat"
                    value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Pharma Products">Pharma Products</option>
                    <option value="OTC Products">OTC Products</option>
                    <option value="Injectables">Injectables</option>
                    <option value="Surgical & Medical Supplies">Surgical & Medical Supplies</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-sku" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>SKU Code</label>
                  <input 
                    id="modal-sku"
                    type="text" placeholder="E.g., NP-PT-500" 
                    value={prodSku} onChange={(e) => setProdSku(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-price" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Wholesale Estimate (₹) *</label>
                  <input 
                    id="modal-price"
                    type="number" step="0.01" required placeholder="E.g., 15.60" 
                    value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-packing" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Packing Specs</label>
                  <input 
                    id="modal-packing"
                    type="text" placeholder="E.g., 10 x 10 Tablets" 
                    value={prodPacking} onChange={(e) => setProdPacking(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-form" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Formulation Form</label>
                  <select 
                    id="modal-form"
                    value={prodForm} onChange={(e) => setProdForm(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Powder">Powder</option>
                    <option value="IV Fluid">IV Fluid</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Gloves">Gloves</option>
                    <option value="Syringe">Syringe</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-composition" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Chemical Composition</label>
                  <input 
                    id="modal-composition"
                    type="text" placeholder="E.g., Paracetamol IP 500mg" 
                    value={prodComposition} onChange={(e) => setProdComposition(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-mfg" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Manufacturer</label>
                  <input 
                    id="modal-mfg"
                    type="text" placeholder="E.g., Cipla Ltd." 
                    value={prodManufacturer} onChange={(e) => setProdManufacturer(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="modal-img" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Image URL (Image source link)</label>
                <input 
                  id="modal-img"
                  type="text" placeholder="https://images.unsplash.com/photo-..." 
                  value={prodImageUrl} onChange={(e) => setProdImageUrl(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="modal-desc" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Product Description</label>
                <textarea 
                  id="modal-desc"
                  rows="3" placeholder="Provide product indication, age group or therapeutic usage..." 
                  value={prodDescription} onChange={(e) => setProdDescription(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <input 
                  id="modal-instock"
                  type="checkbox" checked={prodInStock} onChange={(e) => setProdInStock(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }}
                />
                <label htmlFor="modal-instock" style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>Publish as &ldquo;In Stock&rdquo;</label>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '15px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;

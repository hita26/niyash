import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { 
  Lock, LayoutDashboard, ShoppingBag, MessageSquare, Briefcase, LogOut, 
  Plus, Edit2, Truck, Trash2, CheckCircle2, XCircle, ChevronDown, Download, AlertCircle,
  Package, FileText, Flame, Phone, Search, RefreshCw, Filter, ExternalLink,
  Calendar, CreditCard, Check, X, Eye, Send, ArrowUpDown, User, Building2,
  Tag, ShieldCheck, Sparkles, Clock, AlertTriangle, Printer, Share2, Receipt,
  TrendingUp, Percent, Upload, Image as ImageIcon, Star, Grid, List,
  FileSpreadsheet, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Layers,
  Copy, CheckCheck, MapPin, Mail, Save, EyeOff, Shield, Users, Key, Crown, UserCheck, UserX, Camera, UserPlus
} from 'lucide-react';
import { broadcastLiveEvent, SYNC_EVENTS } from '../utils/liveSync';
import { useLanguage } from '../context/LanguageContext';

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
  const { t, formatCurrency, formatDate, translateStatus, translatePaymentStatus } = useLanguage();
  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('niyansh_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.email === 'info@niyanshpharma.com';
  const hasPermission = (permKey) => {
    if (isSuperAdmin) return true;
    if (!currentUser || !currentUser.permissions) return false;
    return Boolean(currentUser.permissions[permKey]);
  };

  // Staff & Admin Management State (SuperAdmin Only)
  const [adminList, setAdminList] = useState([]);
  const [isAdminListLoading, setIsAdminListLoading] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminFormName, setAdminFormName] = useState('');
  const [adminFormEmail, setAdminFormEmail] = useState('');
  const [adminFormPassword, setAdminFormPassword] = useState('');
  const [adminFormPhone, setAdminFormPhone] = useState('');
  const [adminFormPermissions, setAdminFormPermissions] = useState({
    canManageProducts: true,
    canDeleteProducts: false,
    canBulkImport: true,
    canManageOrders: true,
    canManageLedgers: false,
    canManageCompanies: true,
    canManageNews: true,
    canManageEnquiries: true,
    canClearDatabase: false
  });
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  // Profile Modal State (SuperAdmin & Admin)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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
  const [totalCompaniesCount, setTotalCompaniesCount] = useState(0);
  const [companySearch, setCompanySearch] = useState('');
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState('All');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isClearingProducts, setIsClearingProducts] = useState(false);
  const [isClearingCompanies, setIsClearingCompanies] = useState(false);

  // Dynamic Contact & Wholesale Hub Settings
  const [contactSettings, setContactSettings] = useState({
    hubAddress: 'Block no. 52B, Panchayat Nagar-3, Ram Park Main Road, University Rd, Rajkot, Gujarat - 360005.',
    primaryPhone: '+91 99099 23130',
    secondaryPhone: '+91 93165 66894',
    email: 'info@niyanshpharma.com',
    workingHours: '9:00 AM – 9:00 PM',
    workingDays: 'Monday – Saturday',
    sundayStatus: 'Sunday: Holiday',
    lunchBreak: '2:00 PM – 4:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.4650393043817!2d70.76194731589283!3d22.287219093721385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb33b44fc73f%3A0x3c79432bfa8b8b1d!2sNiyansh%20pharma!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
  });
  const [isContactSaving, setIsContactSaving] = useState(false);
  const [contactSaveSuccess, setContactSaveSuccess] = useState(false);
  const [contactSaveError, setContactSaveError] = useState('');

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
  const [deleteConfirm, setDeleteConfirm] = useState(null); // In-page top confirmation state (no alert box)
  const [copiedLicenseKey, setCopiedLicenseKey] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isSyncingCatalog, setIsSyncingCatalog] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [photoDragActive, setPhotoDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);
  const [isSearchingWebImages, setIsSearchingWebImages] = useState(false);
  const [webImageResults, setWebImageResults] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null); // Full breakdown modal
  const [selectedLedger, setSelectedLedger] = useState(null); // Statement modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Manual payment modal
  const [paymentLedger, setPaymentLedger] = useState(null);

  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Dynamic Custom Field Definitions & Product Values
  const [customFieldDefs, setCustomFieldDefs] = useState([]);
  const [prodCustomValues, setProdCustomValues] = useState({});
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [newCustomFieldType, setNewCustomFieldType] = useState('text');
  const [newCustomFieldRequired, setNewCustomFieldRequired] = useState(false);
  const [newCustomFieldPlaceholder, setNewCustomFieldPlaceholder] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Lock body & document scroll whenever any modal is active to prevent page scrolling behind modals
  const hasActiveModal = Boolean(
    isAdminModalOpen ||
    isProfileModalOpen ||
    isProductModalOpen || 
    isBulkImportOpen || 
    isCompanyModalOpen || 
    isNewsModalOpen || 
    isPaymentModalOpen || 
    selectedOrder || 
    selectedLedger ||
    isCustomFieldModalOpen ||
    deleteConfirm ||
    showSaveConfirm ||
    previewImage
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (hasActiveModal) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      const originalOverscroll = document.body.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'contain';
      document.documentElement.style.overscrollBehavior = 'contain';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
        document.body.style.overscrollBehavior = originalOverscroll;
        document.documentElement.style.overscrollBehavior = originalOverscroll;
      };
    }
  }, [hasActiveModal]);

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
  const [prodIsOurProduct, setProdIsOurProduct] = useState(false);
  const [prodIsActive, setProdIsActive] = useState(true);
  const [prodPacking, setProdPacking] = useState('');
  const [prodComposition, setProdComposition] = useState('');
  const [prodForm, setProdForm] = useState('Tablet');
  const [prodManufacturer, setProdManufacturer] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodImages, setProdImages] = useState([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // Fixed Pharma Inventory & Tax Fields
  const [prodRackId, setProdRackId] = useState('');
  const [prodBatchNumber, setProdBatchNumber] = useState('');
  const [prodHsnCode, setProdHsnCode] = useState('3004');
  const [prodPurchaseGst, setProdPurchaseGst] = useState(12);
  const [prodSalesGst, setProdSalesGst] = useState(12);
  const [prodExpiryDate, setProdExpiryDate] = useState('');


  // Bulk Excel & CSV Import States
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkParsedRows, setBulkParsedRows] = useState([]);
  const [bulkPreviewFilter, setBulkPreviewFilter] = useState('all'); // 'all' | 'valid' | 'duplicates'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [bulkSkipDuplicates, setBulkSkipDuplicates] = useState(true);
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
    const savedUser = localStorage.getItem('niyansh_admin_user');
    if (adminSession === 'active' || token) {
      setIsAuthenticated(true);
      if (token) setAdminToken(token);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
  }, []);

  // Fetch all dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      if (isSuperAdmin) {
        fetchAdmins();
      }
    }
  }, [isAuthenticated, isSuperAdmin]);

  const fetchDashboardData = async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    try {
      const headers = getAuthHeaders();

      // Parallel high-speed fetch for all dashboard metrics and collections (Bullet train speed)
      const [
        prodResult,
        ordResult,
        ledResult,
        newsResult,
        enqResult,
        carResult,
        compResult,
        cfResult,
        contactResult
      ] = await Promise.allSettled([
        fetch('/api/products/admin/all?limit=15000', { headers })
          .then(async (res) => {
            if (res.ok) return res.json();
            const fallback = await fetch('/api/products?limit=15000');
            return fallback.ok ? fallback.json() : { products: [] };
          })
          .catch(() => ({ products: [] })),
        fetch('/api/orders?limit=100', { headers })
          .then(r => r.ok ? r.json() : { orders: FALLBACK_ORDERS })
          .catch(() => ({ orders: FALLBACK_ORDERS })),
        fetch('/api/ledger?limit=100', { headers })
          .then(r => r.ok ? r.json() : { ledgers: FALLBACK_LEDGERS })
          .catch(() => ({ ledgers: FALLBACK_LEDGERS })),
        fetch('/api/news?limit=100', { headers })
          .then(r => r.ok ? r.json() : { news: FALLBACK_NEWS })
          .catch(() => ({ news: FALLBACK_NEWS })),
        fetch('/api/enquiries', { headers })
          .then(r => r.ok ? r.json() : [])
          .catch(() => []),
        fetch('/api/careers', { headers })
          .then(r => r.ok ? r.json() : [])
          .catch(() => []),
        fetch('/api/companies?limit=1000&admin=true', { headers })
          .then(r => r.ok ? r.json() : { companies: [] })
          .catch(() => ({ companies: [] })),
        fetch('/api/products/custom-fields', { headers })
          .then(r => r.ok ? r.json() : { fields: [] })
          .catch(() => ({ fields: [] })),
        fetch('/api/settings/contact')
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      ]);

      // 1. Products
      if (prodResult.status === 'fulfilled' && prodResult.value) {
        const pData = prodResult.value;
        if (Array.isArray(pData.products)) setProducts(pData.products);
        if (pData.stats) setProductAdminStats(pData.stats);
      }

      // 2. Orders
      if (ordResult.status === 'fulfilled' && ordResult.value) {
        const oData = ordResult.value;
        setOrders(oData.orders && oData.orders.length > 0 ? oData.orders : FALLBACK_ORDERS);
      }

      // 3. Ledgers
      if (ledResult.status === 'fulfilled' && ledResult.value) {
        const lData = ledResult.value;
        setLedgers(lData.ledgers && lData.ledgers.length > 0 ? lData.ledgers : FALLBACK_LEDGERS);
      }

      // 4. News
      if (newsResult.status === 'fulfilled' && newsResult.value) {
        const nData = newsResult.value;
        setNews(nData.news && nData.news.length > 0 ? nData.news : FALLBACK_NEWS);
      }

      // 5. Enquiries
      if (enqResult.status === 'fulfilled' && enqResult.value) {
        setEnquiries(Array.isArray(enqResult.value) ? enqResult.value : []);
      }

      // 6. Careers
      if (carResult.status === 'fulfilled' && carResult.value) {
        setCareers(Array.isArray(carResult.value) ? carResult.value : []);
      }

      // 7. Companies
      if (compResult.status === 'fulfilled' && compResult.value) {
        const cData = compResult.value;
        setCompanies(cData.companies || []);
        if (cData.total) setTotalCompaniesCount(cData.total);
      }

      // 8. Custom fields
      if (cfResult.status === 'fulfilled' && cfResult.value) {
        setCustomFieldDefs(cfResult.value.fields || []);
      }

      // 9. Contact settings
      if (contactResult.status === 'fulfilled' && contactResult.value && contactResult.value.contact) {
        setContactSettings(prev => ({ ...prev, ...contactResult.value.contact }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      if (showSpinner) setIsLoading(false);
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
        const userObj = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role || 'admin',
          phone: data.phone || '',
          avatar: data.avatar || '',
          permissions: data.permissions || {}
        };
        setCurrentUser(userObj);
        localStorage.setItem('niyansh_admin_session', 'active');
        localStorage.setItem('niyansh_admin_token', data.token);
        localStorage.setItem('niyansh_admin_user', JSON.stringify(userObj));
        showToast(`Welcome back, ${userObj.name}! (${userObj.role === 'superadmin' ? 'Super Admin Console' : 'Operations Admin Console'} active)`);
        return;
      } else if (data.message) {
        setLoginError(data.message);
        return;
      }
    } catch (err) {
      console.warn('Backend login attempt failed, checking local credentials fallback:', err);
    } finally {
      setIsLoading(false);
    }

    // Demo fallback login if backend unreachable
    const normEmail = email.trim().toLowerCase();
    if (normEmail === 'info@niyanshpharma.com' && password === 'NiyanshSuper@2026') {
      const superUser = {
        _id: 'super-root',
        name: 'Niyansh Super Admin',
        email: 'info@niyanshpharma.com',
        role: 'superadmin',
        phone: '9316566894',
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=f59e0b&color=ffffff&bold=true',
        permissions: {
          canManageProducts: true,
          canDeleteProducts: true,
          canBulkImport: true,
          canManageOrders: true,
          canManageLedgers: true,
          canManageCompanies: true,
          canManageNews: true,
          canManageEnquiries: true,
          canClearDatabase: true
        }
      };
      setIsAuthenticated(true);
      setCurrentUser(superUser);
      localStorage.setItem('niyansh_admin_session', 'active');
      localStorage.setItem('niyansh_admin_user', JSON.stringify(superUser));
      setLoginError('');
      showToast('Welcome back, Super Admin! Live console active.');
      return;
    }

    if (normEmail === 'admin@niyanshpharma.com' && password === 'admin123') {
      const adminUser = {
        _id: 'admin-staff-demo',
        name: 'Niyansh Staff Admin',
        email: 'admin@niyanshpharma.com',
        role: 'admin',
        phone: '9316566894',
        avatar: 'https://ui-avatars.com/api/?name=Admin+Staff&background=2563eb&color=ffffff&bold=true',
        permissions: {
          canManageProducts: true,
          canDeleteProducts: false,
          canBulkImport: true,
          canManageOrders: true,
          canManageLedgers: false,
          canManageCompanies: true,
          canManageNews: true,
          canManageEnquiries: true,
          canClearDatabase: false
        }
      };
      setIsAuthenticated(true);
      setCurrentUser(adminUser);
      localStorage.setItem('niyansh_admin_session', 'active');
      localStorage.setItem('niyansh_admin_user', JSON.stringify(adminUser));
      setLoginError('');
      showToast('Welcome back, Admin! (Staff console active)');
      return;
    }

    setLoginError('Invalid email or password. SuperAdmin: info@niyanshpharma.com / NiyanshSuper@2026 or Admin: admin@niyanshpharma.com / admin123');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    setCurrentUser(null);
    localStorage.removeItem('niyansh_admin_session');
    localStorage.removeItem('niyansh_admin_token');
    localStorage.removeItem('niyansh_admin_user');
    showToast('Logged out successfully.');
  };

  // ==========================================
  // SUPERADMIN: ADMIN & STAFF MANAGEMENT HANDLERS
  // ==========================================

  const fetchAdmins = async () => {
    setIsAdminListLoading(true);
    try {
      const res = await fetch('/api/users/admins', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.admins)) {
        setAdminList(data.admins);
      }
    } catch (err) {
      console.warn('Error fetching admin accounts:', err);
    } finally {
      setIsAdminListLoading(false);
    }
  };

  const handleOpenAdminModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setAdminFormName(admin.name || '');
      setAdminFormEmail(admin.email || '');
      setAdminFormPassword(admin.plainPassword || '');
      setAdminFormPhone(admin.phone || '');
      setAdminFormPermissions(admin.permissions || {
        canManageProducts: true,
        canDeleteProducts: false,
        canBulkImport: true,
        canManageOrders: true,
        canManageLedgers: false,
        canManageCompanies: true,
        canManageNews: true,
        canManageEnquiries: true,
        canClearDatabase: false
      });
    } else {
      setEditingAdmin(null);
      setAdminFormName('');
      setAdminFormEmail('');
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setAdminFormPassword(`NpStaff@${randNum}`);
      setAdminFormPhone('');
      setAdminFormPermissions({
        canManageProducts: true,
        canDeleteProducts: false,
        canBulkImport: true,
        canManageOrders: true,
        canManageLedgers: false,
        canManageCompanies: true,
        canManageNews: true,
        canManageEnquiries: true,
        canClearDatabase: false
      });
    }
    setIsAdminModalOpen(true);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    if (!adminFormName.trim()) {
      showToast('Admin full name is required', 'error');
      return;
    }
    if (!adminFormEmail.trim()) {
      showToast('Admin email (username) is required', 'error');
      return;
    }
    if (!editingAdmin && (!adminFormPassword || adminFormPassword.length < 6)) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSavingAdmin(true);
    try {
      const payload = {
        name: adminFormName.trim(),
        email: adminFormEmail.trim().toLowerCase(),
        phone: adminFormPhone.replace(/\D/g, ''),
        permissions: adminFormPermissions
      };
      if (adminFormPassword) {
        payload.password = adminFormPassword.trim();
      }

      const url = editingAdmin ? `/api/users/admins/${editingAdmin._id}` : '/api/users/admins';
      const method = editingAdmin ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingAdmin ? `Updated admin "${data.admin.name}"` : `Created new admin "${data.admin.name}"`);
        setIsAdminModalOpen(false);
        fetchAdmins();
      } else {
        showToast(data.message || 'Failed to save admin account', 'error');
      }
    } catch (err) {
      showToast('Network error saving admin: ' + err.message, 'error');
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const handleToggleAdminStatus = async (admin) => {
    if (admin.role === 'superadmin' || admin.email === 'info@niyanshpharma.com') {
      showToast('Super Admin root account cannot be deactivated', 'error');
      return;
    }
    try {
      const newStatus = !admin.isActive;
      const res = await fetch(`/api/users/admins/${admin._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Admin "${admin.name}" is now ${newStatus ? 'Active' : 'Deactivated'}`);
        fetchAdmins();
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Error updating status: ' + err.message, 'error');
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (admin.role === 'superadmin' || admin.email === 'info@niyanshpharma.com') {
      showToast('Super Admin account cannot be deleted', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete Admin "${admin.name}" (${admin.email})?`)) {
      try {
        const res = await fetch(`/api/users/admins/${admin._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Admin "${admin.name}" deleted successfully.`);
          fetchAdmins();
        } else {
          showToast(data.message || 'Failed to delete admin', 'error');
        }
      } catch (err) {
        showToast('Error deleting admin: ' + err.message, 'error');
      }
    }
  };

  // ==========================================
  // SUPERADMIN: PROFILE MANAGEMENT HANDLERS
  // ==========================================

  const handleOpenProfileModal = () => {
    setProfileName(currentUser?.name || (isSuperAdmin ? 'Niyansh Super Admin' : 'Admin Staff'));
    setProfilePhone(currentUser?.phone || '9316566894');
    setProfileEmail(currentUser?.email || (isSuperAdmin ? 'info@niyanshpharma.com' : 'admin@niyanshpharma.com'));
    setProfileAvatar(currentUser?.avatar || '');
    setProfilePassword('');
    setProfileConfirmPassword('');
    setIsProfileModalOpen(true);
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setProfileAvatar(dataUrl);
        showToast('Photo selected! Click "Save Profile Changes" below to apply.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (profilePassword && profilePassword !== profileConfirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (profilePassword && profilePassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSavingProfile(true);
    try {
      const payload = {
        name: profileName.trim(),
        phone: profilePhone.replace(/\D/g, ''),
        avatar: profileAvatar.trim()
      };
      if (profilePassword) {
        payload.password = profilePassword.trim();
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        const updatedUser = {
          ...currentUser,
          name: data.name,
          phone: data.phone,
          avatar: data.avatar || payload.avatar
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('niyansh_admin_user', JSON.stringify(updatedUser));
        showToast('Profile updated successfully!');
        setIsProfileModalOpen(false);
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Network error updating profile: ' + err.message, 'error');
    } finally {
      setIsSavingProfile(false);
    }
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

    const msg = `*NIYANSH PHARMA - B2B ORDER UPDATE*
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
      ? `\n*OVERDUE NOTICE:* ${overdueInvoices.length} overdue invoice(s) totaling ${formatCurrency(overdueInvoices.reduce((s, i) => s + i.balance, 0))}. Please clear immediately.`
      : '';

    const text = `*STATEMENT OF ACCOUNT - NIYANSH PHARMA*
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
        broadcastLiveEvent(SYNC_EVENTS.SCHEME_MUTATED, { action: editingNews ? 'update' : 'create', news: data.news });
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
        broadcastLiveEvent(SYNC_EVENTS.SCHEME_MUTATED, { action: editingNews ? 'update' : 'create', payload });
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
      broadcastLiveEvent(SYNC_EVENTS.SCHEME_MUTATED, { action: editingNews ? 'update' : 'create', payload });
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
    broadcastLiveEvent(SYNC_EVENTS.SCHEME_MUTATED, { action: 'toggle', id: item._id, isTickerActive: newStatus });
    showToast(`Ticker visibility ${newStatus ? 'enabled' : 'disabled'} for announcement!`);
  };

  const handleRequestDeleteNews = (item) => {
    setDeleteConfirm({
      type: 'news',
      id: item._id,
      name: item.title || 'Scheme / Announcement'
    });
  };

  const handleRequestDeleteEnquiry = (id, name = 'Enquiry record') => {
    setDeleteConfirm({
      type: 'enquiry',
      id,
      name
    });
  };

  const handleRequestDeleteCareer = (id, name = 'Job application record') => {
    setDeleteConfirm({
      type: 'career',
      id,
      name
    });
  };

  const handleRequestDeleteProduct = (product) => {
    if (!isSuperAdmin && !hasPermission('canDeleteProducts')) {
      showToast('You do not have permission to delete products. Please contact Super Admin.', 'warning');
      return;
    }
    setDeleteConfirm({
      type: 'product',
      id: product._id,
      name: product.name || 'Product',
      sku: product.sku
    });
  };

  const handleRequestDeleteCompany = (company) => {
    if (!isSuperAdmin && !hasPermission('canManageCompanies')) {
      showToast('You do not have permission to delete companies. Please contact Super Admin.', 'warning');
      return;
    }
    setDeleteConfirm({
      type: 'company',
      id: company._id,
      name: company.name || 'Company'
    });
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, name } = deleteConfirm;

    try {
      if (type === 'product') {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setProducts(prev => prev.filter(p => p._id !== id));
          showToast(`"${name}" deleted successfully`);
          // Real-time broadcast: inform all browser tabs and storefront pages immediately
          broadcastLiveEvent(SYNC_EVENTS.PRODUCT_DELETED, { id, name });
          fetchDashboardData();
        } else {
          showToast(data.message || 'Failed to delete product', 'error');
        }
      } else if (type === 'company') {
        const res = await fetch(`/api/companies/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCompanies(prev => prev.filter(c => c._id !== id));
          showToast(`"${name}" removed from directory`);
          broadcastLiveEvent(SYNC_EVENTS.COMPANY_MUTATED, { action: 'delete', id, name });
          fetchDashboardData();
        } else {
          showToast(data.message || 'Failed to delete company', 'error');
        }
      } else if (type === 'news') {
        const res = await fetch(`/api/news/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        setNews(prev => prev.filter(n => n._id !== id));
        showToast('Announcement deleted successfully.');
        broadcastLiveEvent(SYNC_EVENTS.SCHEME_MUTATED, { action: 'delete', id });
      } else if (type === 'enquiry') {
        await fetch(`/api/enquiries/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        setEnquiries(prev => prev.filter(e => e._id !== id));
        showToast('Enquiry deleted');
      } else if (type === 'career') {
        await fetch(`/api/careers/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        setCareers(prev => prev.filter(c => c._id !== id));
        showToast('Applicant record deleted');
      }
    } catch (err) {
      showToast('Error deleting item: ' + err.message, 'error');
    } finally {
      setDeleteConfirm(null);
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
      setProdIsOurProduct(Boolean(product.isOurProduct));
      setProdIsActive(product.isActive !== false);
      setProdPacking(product.packing || '');
      setProdComposition(product.composition || '');
      setProdForm(product.form || 'Tablet');
      setProdManufacturer(product.manufacturer || 'Daxia Healthcare Pvt. Ltd.');
      setProdRackId(product.rackId || '');
      setProdBatchNumber(product.batchNumber || product.batchNo || '');
      setProdHsnCode(product.hsnCode || '3004');
      setProdPurchaseGst(product.purchaseGst !== undefined ? product.purchaseGst : 12);
      setProdSalesGst(product.salesGst !== undefined ? product.salesGst : (product.gstRate || 12));
      setProdExpiryDate(product.expiryDate || '');
      const customMap = {};
      if (Array.isArray(product.customFields)) {
        product.customFields.forEach(cf => {
          if (cf && cf.fieldKey) customMap[cf.fieldKey] = cf.fieldValue;
        });
      }
      setProdCustomValues(customMap);
      setProdImageUrl(product.imageUrl || '');
      const initialImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);
      setProdImages(initialImages);
      setProdDescription(product.description || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdBrand('');
      setProdCompany('Daxia Healthcare');
      setProdCategory('Pharma Products');
      setProdCustomCategory('');
      setProdSubCategory('');
      setProdSku('');
      setProdPrice('');
      setProdMrp('');
      setProdStockQuantity('100');
      setProdInStock(true);
      setProdFeatured(false);
      setProdIsOurProduct(false);
      setProdIsActive(true);
      setProdPacking('10 x 10 Tablets');
      setProdComposition('');
      setProdForm('Tablet');
      setProdManufacturer('Daxia Healthcare Pvt. Ltd.');
      setProdRackId('');
      setProdBatchNumber('');
      setProdHsnCode('3004');
      setProdPurchaseGst(12);
      setProdSalesGst(12);
      setProdExpiryDate('');
      setProdCustomValues({});
      setProdImageUrl('');
      setProdImages([]);
      setProdDescription('');
    }
    setNewImageUrlInput('');
    setIsProductModalOpen(true);
  };

  // Upload multiple product photos (Max 5 photos allowed)
  const handlePhotoUpload = async (e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    if (prodImages.length >= 5) {
      showToast('મહત્તમ 5 ફોટો જ રાખી શકાય છે (Maximum 5 photos allowed per product)', 'warning');
      return;
    }

    const availableSlots = 5 - prodImages.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);
    if (filesToUpload.length < files.length) {
      showToast(`માત્ર ${availableSlots} ફોટો એડ થશે (મહત્તમ 5 ફોટો મર્યાદા)`, 'warning');
    }

    setIsUploadingPhotos(true);
    const formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append('photos', filesToUpload[i]);
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
          const combined = [...prev, ...data.urls].slice(0, 5);
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
    if (prodImages.length >= 5) {
      showToast('મહત્તમ 5 ફોટો જ રાખી શકાય છે (Maximum 5 photos allowed per product)', 'warning');
      return;
    }
    const trimmed = newImageUrlInput.trim();
    if (prodImages.includes(trimmed)) {
      showToast('આ ફોટો URL પહેલેથી ગેલેરીમાં છે', 'warning');
      return;
    }
    setProdImages(prev => {
      const combined = [...prev, trimmed].slice(0, 5);
      return combined;
    });
    if (!prodImageUrl) setProdImageUrl(trimmed);
    setNewImageUrlInput('');
    showToast('Image URL added to gallery');
  };

  const handleSearchGoogleImages = () => {
    const rawName = prodName || '';
    if (!rawName.trim()) {
      showToast('Please enter Product Name first to search on Google', 'error');
      return;
    }
    // Clean name: strip wholesale pack specs like (50*10), (10*10), (12*12*100ml), etc.
    const cleanName = rawName
      .replace(/\(\s*\d+\s*[\*xX]\s*\d+.*?\)/gi, '')
      .replace(/\b\d+\s*[\*xX]\s*\d+\b/gi, '')
      .replace(/\(\s*(GREEN|WHITE|RED|BLUE|YELLOW)\s*\)/gi, '')
      .replace(/[()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const companyPart = (prodCompany || prodBrand || '').replace(/\(ranbaxy\)|\(wellness\)|\(cosmacia\)|\(cadila\)|pvt|ltd|group/gi, '').trim();
    const query = `${cleanName} ${companyPart} medicine packaging`.trim();
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
    showToast(`Searching Google Images for: "${cleanName}"`);
  };

  const handleAutoFetchImages = async () => {
    const rawName = prodName || '';
    if (!rawName.trim()) {
      showToast('Please enter Product Name first to auto-find photos', 'error');
      return;
    }
    setIsSearchingWebImages(true);
    setWebImageResults([]);
    try {
      const cleanName = rawName
        .replace(/\(\s*\d+\s*[\*xX]\s*\d+.*?\)/gi, '')
        .replace(/\b\d+\s*[\*xX]\s*\d+\b/gi, '')
        .replace(/\(\s*(GREEN|WHITE|RED|BLUE|YELLOW)\s*\)/gi, '')
        .replace(/[()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const compPart = (prodCompany || prodBrand || '').replace(/\(ranbaxy\)|\(wellness\)|\(cosmacia\)|\(cadila\)|pvt|ltd|group/gi, '').trim();
      const query = `${cleanName} ${compPart}`.trim();

      const res = await fetch(`/api/products/search-medicine-images?query=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success && data.images && data.images.length > 0) {
        setWebImageResults(data.images);
        showToast(`Found ${data.images.length} photos! Click any photo to attach. (Max 5 photos)`, 'success');
      } else {
        showToast('No photos found automatically. Click Google Tab to search in browser.', 'error');
      }
    } catch (err) {
      showToast('Error finding photos: ' + err.message, 'error');
    } finally {
      setIsSearchingWebImages(false);
    }
  };

  const handleSelectWebImage = (imgUrl) => {
    if (prodImages.includes(imgUrl)) {
      setProdImageUrl(imgUrl);
      showToast('Photo designated as primary!');
      return;
    }
    if (prodImages.length >= 5) {
      showToast('મહત્તમ 5 ફોટો જ રાખી શકાય છે (Maximum 5 photos allowed per product)', 'warning');
      return;
    }
    setProdImages(prev => [imgUrl, ...prev].slice(0, 5));
    setProdImageUrl(imgUrl);
    showToast('Photo attached to product!');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Product Name / Brand Name is required', 'error');
      return;
    }
    const currentSku = prodSku.trim();
    if (!currentSku) {
      showToast('SKU / ID is required (Click Generate to create one)', 'error');
      return;
    }
    const assignedCompany = prodCompany.trim();
    if (!assignedCompany) {
      showToast('Manufacturer / Company is required', 'error');
      return;
    }
    const finalCategory = prodCategory === 'Custom' ? prodCustomCategory.trim() : prodCategory;
    if (!finalCategory) {
      showToast('Product category is required', 'error');
      return;
    }
    if (!prodComposition.trim()) {
      showToast('Contains is required', 'error');
      return;
    }
    if (!prodForm) {
      showToast('Formulation Form is required', 'error');
      return;
    }
    if (!prodPrice || parseFloat(prodPrice) <= 0) {
      showToast('Wholesale price is required and must be greater than 0', 'error');
      return;
    }
    if (!prodMrp || parseFloat(prodMrp) <= 0) {
      showToast('MRP is required and must be greater than 0', 'error');
      return;
    }
    if (prodStockQuantity === '' || isNaN(parseInt(prodStockQuantity, 10)) || parseInt(prodStockQuantity, 10) < 0) {
      showToast('Stock Units is required', 'error');
      return;
    }
    if (!prodPacking.trim()) {
      showToast('Packing Specifications is required', 'error');
      return;
    }
    if (!prodSubCategory.trim()) {
      showToast('Subcategory / Variant is required', 'error');
      return;
    }
    if (!prodManufacturer.trim()) {
      showToast('Manufacturer Details is required', 'error');
      return;
    }
    if (!prodBatchNumber.trim()) {
      showToast('Batch Number is required', 'error');
      return;
    }
    if (!prodRackId.trim()) {
      showToast('Rack ID / Location is required', 'error');
      return;
    }
    if (!prodHsnCode.trim()) {
      showToast('HSN Code is required', 'error');
      return;
    }
    if (!prodExpiryDate.trim()) {
      showToast('Expiry Date is required', 'error');
      return;
    }

    // DUPLICATION PREVENTION 1: Check duplicate product name (case-insensitive)
    const trimmedName = prodName.trim();
    const isDuplicateName = products.some(p => 
      p.name?.trim().toLowerCase() === trimmedName.toLowerCase() && 
      (!editingProduct || p._id !== editingProduct._id)
    );
    if (isDuplicateName) {
      showToast(`પ્રોડક્ટ "${trimmedName}" પહેલેથી અસ્તિત્વમાં છે! ડુપ્લિકેટ પ્રોડક્ટ એડ કરી શકાશે નહીં.`, 'error');
      return;
    }

    // DUPLICATION PREVENTION 2: Check duplicate SKU
    if (currentSku) {
      const isDuplicateSku = products.some(p => 
        p.sku?.trim().toLowerCase() === currentSku.toLowerCase() && 
        (!editingProduct || p._id !== editingProduct._id)
      );
      if (isDuplicateSku) {
        showToast(`SKU "${currentSku}" પહેલેથી બીજી પ્રોડક્ટમાં વપરાયેલ છે! કૃપા કરીને નવો SKU વાપરો.`, 'error');
        return;
      }
    }

    // Validate required dynamic custom fields
    for (const def of customFieldDefs) {
      if (def.isRequired) {
        const val = prodCustomValues[def.fieldKey];
        if (val === undefined || val === null || String(val).trim() === '') {
          showToast(`${def.fieldName} is required`, 'error');
          return;
        }
      }
    }

    // Open verification confirmation modal before actually saving!
    setShowSaveConfirm(true);
  };

  const executeActualSaveProduct = async () => {
    const finalCategory = prodCategory === 'Custom' ? prodCustomCategory.trim() : prodCategory;
    const finalImages = prodImages.filter(img => img && img.trim() !== '').slice(0, 5);
    const finalMainImage = prodImageUrl || (finalImages.length > 0 ? finalImages[0] : '');

    const stockNum = parseInt(prodStockQuantity, 10);
    const validStock = !isNaN(stockNum) ? stockNum : (prodInStock ? 100 : 0);

    const customFieldsArr = customFieldDefs.map(def => ({
      fieldKey: def.fieldKey,
      fieldName: def.fieldName,
      fieldValue: prodCustomValues[def.fieldKey] !== undefined ? prodCustomValues[def.fieldKey] : '',
      fieldType: def.fieldType || 'text',
      isRequired: Boolean(def.isRequired),
    }));

    const assignedCompany = prodCompany.trim() || 'Daxia Healthcare';

    const payload = {
      name: prodName.trim(),
      brand: prodName.trim(), // Brand name unified with Product Name
      company: assignedCompany,
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
      manufacturer: prodManufacturer.trim() || assignedCompany,
      rackId: prodRackId.trim(),
      batchNumber: prodBatchNumber.trim(),
      hsnCode: prodHsnCode.trim() || '3004',
      purchaseGst: parseFloat(prodPurchaseGst) || 12,
      salesGst: parseFloat(prodSalesGst) || 12,
      gstRate: parseFloat(prodSalesGst) || 12,
      expiryDate: prodExpiryDate.trim(),
      customFields: customFieldsArr,
      imageUrl: finalMainImage,
      images: finalImages,
      description: prodDescription.trim() || `${prodName.trim()} formulation by ${assignedCompany}.`,
      featured: prodFeatured,
      isOurProduct: prodIsOurProduct,
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
        const savedProd = data.product || { ...payload, _id: editingProduct?._id || ('p-' + Date.now()) };

        // INSTANT OPTIMISTIC UPDATE: Update products list immediately without waiting
        setProducts(prev => {
          if (editingProduct && editingProduct._id) {
            return prev.map(p => p._id === savedProd._id ? { ...p, ...savedProd } : p);
          } else {
            return [savedProd, ...prev];
          }
        });

        // Auto-add company to local state if brand new so it appears in suggestions immediately
        if (assignedCompany && !companies.some(c => c.name?.toLowerCase() === assignedCompany.toLowerCase())) {
          setCompanies(prev => [{ name: assignedCompany, category: finalCategory, status: 'Published' }, ...prev]);
        }

        // Silent background sync without blocking UI
        fetchDashboardData(false);

        broadcastLiveEvent(
          editingProduct ? SYNC_EVENTS.PRODUCT_UPDATED : SYNC_EVENTS.PRODUCT_CREATED,
          { product: savedProd }
        );
        showToast(
          editingProduct 
            ? 'પ્રોડક્ટ વિગતો સફળતાપૂર્વક અપડેટ થઈ! (Product updated)' 
            : 'નવી પ્રોડક્ટ સફળતાપૂર્વક પબ્લિશ થઈ! (Product published)',
          'success'
        );
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

  const handleDeleteProduct = (product) => handleRequestDeleteProduct(product);

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
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, inStock: newStock, stockQuantity: newQuantity });
      showToast(`Product marked as ${newStock ? 'In Stock' : 'Out of Stock'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, inStock: newStock, stockQuantity: newQuantity } : p));
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, inStock: newStock, stockQuantity: newQuantity });
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
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, isActive: newActive });
      showToast(`Product visibility set to ${newActive ? 'Active (Live)' : 'Inactive (Hidden)'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: newActive } : p));
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, isActive: newActive });
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
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, featured: newFeatured });
      showToast(`Product ${newFeatured ? 'featured on homepage' : 'removed from featured'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, featured: newFeatured } : p));
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, featured: newFeatured });
    }
  };

  const handleToggleOurProduct = async (product) => {
    const newOurProduct = !product.isOurProduct;
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isOurProduct: newOurProduct })
      });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isOurProduct: newOurProduct } : p));
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, isOurProduct: newOurProduct });
      showToast(`Product ${newOurProduct ? 'marked as Our Product' : 'removed from Our Products'}`);
    } catch {
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isOurProduct: newOurProduct } : p));
      broadcastLiveEvent(SYNC_EVENTS.PRODUCT_UPDATED, { id: product._id, isOurProduct: newOurProduct });
    }
  };

  const handleClearAllProducts = async () => {
    if (!window.confirm('ARE YOU SURE? This will permanently delete ALL products from the database so you can add products manually from scratch.')) {
      return;
    }
    if (!window.confirm('Double Confirmation: Delete ALL products now? This action cannot be undone.')) {
      return;
    }
    setIsClearingProducts(true);
    try {
      const res = await fetch('/api/products/clear-all', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'All products cleared from catalog successfully!');
        setProducts([]);
        setProductAdminStats({
          totalProducts: 0,
          inStock: 0,
          outOfStock: 0,
          totalCompanies: 0,
          totalCategories: 0,
        });
        broadcastLiveEvent(SYNC_EVENTS.PRODUCT_DELETED, { all: true });
        await fetchDashboardData();
      } else {
        showToast(data.message || 'Failed to clear products', 'error');
      }
    } catch (err) {
      showToast('Error clearing products: ' + err.message, 'error');
    } finally {
      setIsClearingProducts(false);
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

  const handleSyncFullCatalog = async () => {
    setIsSyncingCatalog(true);
    showToast('Syncing full 9,560 catalog into cloud database... This may take a few seconds.');
    try {
      const res = await fetch('/api/products/sync-catalog', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Full catalog synced successfully!');
        await fetchDashboardData();
        broadcastLiveEvent(SYNC_EVENTS.PRODUCT_BULK_IMPORTED, { total: data.totalProducts });
      } else {
        showToast(data.message || 'Catalog sync failed', 'error');
      }
    } catch (err) {
      showToast('Error syncing catalog: ' + err.message, 'error');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  // ==========================================
  // BULK EXCEL & CSV TEMPLATE GENERATOR & IMPORTER
  // ==========================================

  const handleDownloadExcelTemplate = () => {
    try {
      // 1. Column Headers for Sheet 1
      const headers = [
        'Product Name / Brand Name *',
        'SKU / ID',
        'Manufacturer / Company *',
        'Category *',
        'Chemical / Active Composition *',
        'Formulation Form *',
        'Wholesale Price (₹) *',
        'MRP (₹) *',
        'Stock Units *',
        'Packing Specifications *',
        'Subcategory / Variant *',
        'Manufacturer Details *',
        'Rack ID / Location *',
        'HSN Code *',
        'Expiry Date *',
        'Purchase GST (%) *',
        'Sales GST (%) *',
        'Product Description & Indications *',
        'In Stock (YES/NO)',
        'Featured Showcase (YES/NO)',
        'Our Product Exclusive (YES/NO)',
        'Live on Website (YES/NO)'
      ];

      // 2. Sample Data Rows
      const sampleCompany1 = companies[0]?.name || 'Daxia Healthcare';
      const sampleCompany2 = companies[1]?.name || companies[0]?.name || 'BIOCHEM';

      const sampleRows = [
        [
          'Paracetamol Tablet IP 500mg',
          'NP-825665',
          sampleCompany1,
          'Pharma Products',
          'Paracetamol IP 500mg',
          'Tablet',
          28.50,
          45.00,
          100,
          '10 x 10 Tablets',
          'Pain Relief & Antipyretic',
          `${sampleCompany1} Pvt. Ltd., Plot 12, GIDC, Rajkot, Gujarat`,
          'R-04, Shelf-B',
          '3004',
          '12/2027',
          12,
          12,
          'Effective relief of fever, mild to moderate body pain and headache.',
          'YES',
          'NO',
          'YES',
          'YES'
        ],
        [
          'Pantoprazole Gastro-Resistant Tabs IP 40mg',
          'NP-825666',
          sampleCompany2,
          'Pharma Products',
          'Pantoprazole Sodium IP 40mg',
          'Tablet',
          34.00,
          65.00,
          150,
          '10 x 10 Strips',
          'Gastro Care',
          `${sampleCompany2} Pharma Labs, Ahmedabad, Gujarat`,
          'R-02, Shelf-A',
          '3004',
          '08/2027',
          12,
          12,
          'Provides fast and sustained relief from acidity, heartburn, and GERD symptoms.',
          'YES',
          'YES',
          'NO',
          'YES'
        ]
      ];

      // 3. Create Worksheet for Products Template
      const wsTemplate = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
      wsTemplate['!cols'] = [
        { wch: 34 }, // Product Name
        { wch: 16 }, // SKU
        { wch: 26 }, // Company
        { wch: 22 }, // Category
        { wch: 32 }, // Composition
        { wch: 16 }, // Form
        { wch: 18 }, // Wholesale Price
        { wch: 14 }, // MRP
        { wch: 14 }, // Stock
        { wch: 22 }, // Packing
        { wch: 26 }, // Subcategory
        { wch: 38 }, // Manufacturer Details
        { wch: 18 }, // Rack ID
        { wch: 14 }, // HSN Code
        { wch: 16 }, // Expiry Date
        { wch: 18 }, // Purchase GST
        { wch: 18 }, // Sales GST
        { wch: 42 }, // Description
        { wch: 18 }, // In Stock
        { wch: 22 }, // Featured
        { wch: 24 }, // Our Product
        { wch: 20 }  // Live
      ];

      // 4. Create Worksheet for Companies List
      const companyHeaders = ['Registered Company / Manufacturer Name', 'Live Status'];
      const compList = companies.length > 0 ? companies : [{ name: 'Daxia Healthcare' }, { name: 'BIOCHEM' }];
      const companyData = compList.map(c => [c.name, 'Active Live Partner']);
      const wsCompanies = XLSX.utils.aoa_to_sheet([companyHeaders, ...companyData]);
      wsCompanies['!cols'] = [{ wch: 36 }, { wch: 20 }];

      // 5. Build Workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsTemplate, 'Products_Template');
      XLSX.utils.book_append_sheet(wb, wsCompanies, 'Companies_List');

      // 6. Download file
      XLSX.writeFile(wb, 'Niyansh_Pharma_Product_Import_Template.xlsx');
      showToast('Excel Template downloaded successfully!');
    } catch (err) {
      console.error('Download template error:', err);
      showToast('Failed to download Excel template: ' + err.message, 'error');
    }
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setBulkImportResults(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showToast('The selected file has no data rows', 'error');
          return;
        }

        const seenNamesInSheet = new Set();
        const seenSkusInSheet = new Set();

        const parsed = rawJson.map((row, idx) => {
          const getVal = (...keys) => {
            for (const k of keys) {
              const matchedKey = Object.keys(row).find(
                rk => rk.toLowerCase().trim() === k.toLowerCase().trim() ||
                      rk.toLowerCase().replace(/[^a-z0-9]/g, '') === k.toLowerCase().replace(/[^a-z0-9]/g, '')
              );
              if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
                return String(row[matchedKey]).trim();
              }
            }
            return '';
          };

          const name = getVal('Product Name / Brand Name *', 'Product Name', 'Name', 'Product', 'Brand Name');
          const rawSku = getVal('SKU / ID', 'SKU', 'Product ID', 'Item Code');
          const sku = rawSku || `NP-${Date.now().toString().slice(-6)}-${idx + 1}`;
          const company = getVal('Manufacturer / Company *', 'Manufacturer / Company', 'Company', 'Manufacturer') || 'Daxia Healthcare';
          const category = getVal('Category *', 'Category') || 'Pharma Products';
          const composition = getVal('Chemical / Active Composition *', 'Chemical / Active Composition', 'Composition', 'Chemical');
          const form = getVal('Formulation Form *', 'Formulation Form', 'Form') || 'Tablet';
          const price = parseFloat(getVal('Wholesale Price (₹) *', 'Wholesale Price', 'Wholesale', 'Price', 'PTR')) || 0;
          const mrp = parseFloat(getVal('MRP (₹) *', 'MRP', 'Retail MRP')) || (price > 0 ? Math.round(price * 1.35) : 0);
          const stockQuantity = parseInt(getVal('Stock Units *', 'Stock Units', 'Stock', 'Quantity', 'Qty') || '100', 10);
          const packing = getVal('Packing Specifications *', 'Packing Specifications', 'Packing', 'Pack') || '10 x 10 Tablets';
          const subCategory = getVal('Subcategory / Variant *', 'Subcategory / Variant', 'Subcategory', 'Variant') || '';
          const manufacturer = getVal('Manufacturer Details *', 'Manufacturer Details') || `${company} Pvt. Ltd.`;
          const rackId = getVal('Rack ID / Location *', 'Rack ID / Location', 'Rack ID', 'Rack', 'Location') || 'R-01';
          const hsnCode = getVal('HSN Code *', 'HSN Code', 'HSN') || '3004';
          const expiryDate = getVal('Expiry Date *', 'Expiry Date', 'Expiry', 'Exp') || '12/2027';
          const purchaseGst = parseFloat(getVal('Purchase GST (%) *', 'Purchase GST', 'Purchase GST Rate (%)')) || 12;
          const salesGst = parseFloat(getVal('Sales GST (%) *', 'Sales GST', 'Sales GST Rate (%)')) || 12;
          const description = getVal('Product Description & Indications *', 'Product Description', 'Description') || `${name} formulation by ${company}.`;

          const inStockVal = getVal('In Stock (YES/NO)', 'In Stock', 'Publish as In Stock').toUpperCase();
          const inStock = inStockVal === 'NO' || inStockVal === 'FALSE' ? false : true;

          const featuredVal = getVal('Featured Showcase (YES/NO)', 'Featured').toUpperCase();
          const featured = featuredVal === 'YES' || featuredVal === 'TRUE';

          const ourProductVal = getVal('Our Product Exclusive (YES/NO)', 'Our Product').toUpperCase();
          const isOurProduct = ourProductVal === 'YES' || ourProductVal === 'TRUE';

          const liveVal = getVal('Live on Website (YES/NO)', 'Live on Public Website', 'Live').toUpperCase();
          const isActive = liveVal === 'NO' || liveVal === 'FALSE' ? false : true;

          // DUPLICATION & ERROR CHECKS
          let isDuplicate = false;
          let duplicateReason = '';
          let hasError = false;
          let errorMessage = '';

          if (!name) {
            hasError = true;
            errorMessage = 'Product name is missing';
          } else {
            const normName = name.toLowerCase();
            if (seenNamesInSheet.has(normName)) {
              isDuplicate = true;
              duplicateReason = 'Duplicate Name in file';
            } else {
              seenNamesInSheet.add(normName);
              const existsInCatalog = products.find(p => p.name?.toLowerCase().trim() === normName);
              if (existsInCatalog) {
                isDuplicate = true;
                duplicateReason = `Already in catalog (SKU: ${existsInCatalog.sku || 'N/A'})`;
              }
            }
          }

          if (rawSku) {
            const normSku = rawSku.toLowerCase();
            if (seenSkusInSheet.has(normSku)) {
              isDuplicate = true;
              duplicateReason = duplicateReason || 'Duplicate SKU in file';
            } else {
              seenSkusInSheet.add(normSku);
              const existsSku = products.find(p => p.sku?.toLowerCase().trim() === normSku);
              if (existsSku) {
                isDuplicate = true;
                duplicateReason = duplicateReason || `SKU already used by "${existsSku.name}"`;
              }
            }
          }

          if (price <= 0) {
            hasError = true;
            errorMessage = errorMessage || 'Wholesale price must be > 0';
          }

          return {
            _rowId: idx + 1,
            selected: !isDuplicate && !hasError,
            name,
            sku,
            company,
            category,
            composition,
            form,
            price,
            mrp,
            stockQuantity,
            packing,
            subCategory,
            manufacturer,
            rackId,
            hsnCode,
            expiryDate,
            purchaseGst,
            salesGst,
            description,
            inStock,
            featured,
            isOurProduct,
            isActive,
            isDuplicate,
            duplicateReason,
            hasError,
            errorMessage
          };
        });

        setBulkParsedRows(parsed);
        showToast(`Parsed ${parsed.length} products from ${file.name}`);
      } catch (err) {
        console.error('Error parsing spreadsheet:', err);
        showToast('Error reading spreadsheet: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleToggleRowSelection = (rowId) => {
    setBulkParsedRows(prev => prev.map(r => r._rowId === rowId ? { ...r, selected: !r.selected } : r));
  };

  const handleToggleSelectAll = (checked) => {
    setBulkParsedRows(prev => prev.map(r => {
      // Don't select error rows or duplicates if skipping
      if (r.hasError) return { ...r, selected: false };
      if (bulkSkipDuplicates && r.isDuplicate) return { ...r, selected: false };
      return { ...r, selected: checked };
    }));
  };

  const handleExecuteBulkImport = async () => {
    let rowsToImport = [];

    if (bulkParsedRows.length > 0) {
      rowsToImport = bulkParsedRows.filter(r => {
        if (!r.selected) return false;
        if (r.hasError) return false;
        if (bulkSkipDuplicates && r.isDuplicate) return false;
        return true;
      });
    } else if (bulkCsvText.trim()) {
      // Manual text fallback
      const lines = bulkCsvText.trim().split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length >= 2) {
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
          const rowObj = {};
          headers.forEach((h, colIdx) => { rowObj[h] = parts[colIdx] || ''; });
          if (rowObj.name || rowObj['product name']) {
            rowsToImport.push({
              name: rowObj.name || rowObj['product name'],
              sku: rowObj.sku || `NP-${Date.now().toString().slice(-6)}-${i}`,
              company: rowObj.company || 'Daxia Healthcare',
              category: rowObj.category || 'Pharma Products',
              composition: rowObj.composition || '',
              form: rowObj.form || 'Tablet',
              price: parseFloat(rowObj.price || rowObj.ptr || 0),
              mrp: parseFloat(rowObj.mrp || 0),
              stockQuantity: parseInt(rowObj.stockquantity || 100, 10),
              packing: rowObj.packing || '10 x 10 Tablets',
              subCategory: rowObj.subcategory || '',
              manufacturer: rowObj.manufacturer || 'Daxia Healthcare Pvt. Ltd.',
              rackId: rowObj.rackid || 'R-01',
              hsnCode: rowObj.hsncode || '3004',
              expiryDate: rowObj.expirydate || '12/2027',
              purchaseGst: parseFloat(rowObj.purchasegst || 12),
              salesGst: parseFloat(rowObj.salesgst || 12),
              description: rowObj.description || '',
              inStock: true,
              featured: false,
              isOurProduct: false,
              isActive: true
            });
          }
        }
      }
    }

    if (rowsToImport.length === 0) {
      showToast('No valid products selected to import. Check preview for errors or duplicates.', 'error');
      return;
    }

    setIsImportingBulk(true);
    setBulkImportResults(null);
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          products: rowsToImport,
          skipDuplicates: bulkSkipDuplicates
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBulkImportResults(data);
        showToast(`Successfully imported ${data.successCount} products! ${data.skippedCount ? `(${data.skippedCount} duplicates skipped)` : ''}`);
        broadcastLiveEvent(SYNC_EVENTS.PRODUCT_BULK_IMPORTED, { count: data.successCount });
        fetchProducts();
        fetchDashboardData();
        // Clear preview after successful import
        setBulkParsedRows([]);
        setUploadedFileName('');
        setBulkCsvText('');
      } else {
        showToast(data.message || 'Bulk import failed', 'error');
      }
    } catch (err) {
      showToast('Error executing bulk import: ' + err.message, 'error');
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
        const savedComp = data.company || { ...payload, _id: editingCompany?._id || ('comp-' + Date.now()) };
        setCompanies(prev => {
          if (editingCompany && editingCompany._id) {
            return prev.map(c => c._id === savedComp._id ? { ...c, ...savedComp } : c);
          } else {
            return [savedComp, ...prev];
          }
        });
        fetchDashboardData(false);
        broadcastLiveEvent(SYNC_EVENTS.COMPANY_MUTATED, { action: editingCompany ? 'update' : 'create', company: savedComp });
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

  const handleDeleteCompany = (company) => handleRequestDeleteCompany(company);

  const handleToggleCompanyPublish = async (company) => {
    const newStatus = !company.isPublished;
    try {
      await fetch(`/api/companies/${company._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isPublished: newStatus })
      });
      setCompanies(prev => prev.map(c => c._id === company._id ? { ...c, isPublished: newStatus } : c));
      broadcastLiveEvent(SYNC_EVENTS.COMPANY_MUTATED, { action: 'toggle', id: company._id, isPublished: newStatus });
      showToast(`Company visibility set to ${newStatus ? 'Published (Live)' : 'Unpublished (Hidden)'}`);
    } catch {
      setCompanies(prev => prev.map(c => c._id === company._id ? { ...c, isPublished: newStatus } : c));
      broadcastLiveEvent(SYNC_EVENTS.COMPANY_MUTATED, { action: 'toggle', id: company._id, isPublished: newStatus });
    }
  };

  const handleClearAllCompanies = async () => {
    if (!window.confirm('ARE YOU SURE? This will permanently delete ALL companies from the database so you can add companies manually from scratch.')) {
      return;
    }
    if (!window.confirm('Double Confirmation: Delete ALL companies now? This action cannot be undone.')) {
      return;
    }
    setIsClearingCompanies(true);
    try {
      const res = await fetch('/api/companies/clear-all', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'All companies cleared successfully!');
        setCompanies([]);
        setTotalCompaniesCount(0);
        broadcastLiveEvent(SYNC_EVENTS.COMPANY_MUTATED, { all: true });
        await fetchDashboardData();
      } else {
        showToast(data.message || 'Failed to clear companies', 'error');
      }
    } catch (err) {
      showToast('Error clearing companies: ' + err.message, 'error');
    } finally {
      setIsClearingCompanies(false);
    }
  };

  const handleSaveCustomFieldDef = async (e) => {
    e.preventDefault();
    if (!newCustomFieldName.trim()) {
      showToast('Field name is required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/products/custom-fields', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fieldName: newCustomFieldName.trim(),
          fieldType: newCustomFieldType,
          isRequired: newCustomFieldRequired,
          placeholder: newCustomFieldPlaceholder.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Field "${newCustomFieldName}" added successfully!`);
        setCustomFieldDefs(prev => {
          const exists = prev.some(f => f.fieldKey === data.field.fieldKey);
          return exists ? prev.map(f => f.fieldKey === data.field.fieldKey ? data.field : f) : [...prev, data.field];
        });
        setNewCustomFieldName('');
        setNewCustomFieldType('text');
        setNewCustomFieldRequired(false);
        setNewCustomFieldPlaceholder('');
        setIsCustomFieldModalOpen(false);
      } else {
        showToast(data.message || 'Error saving custom field', 'error');
      }
    } catch (err) {
      showToast('Error saving field: ' + err.message, 'error');
    }
  };

  const handleDeleteCustomFieldDef = async (fieldKey) => {
    if (!window.confirm(`Delete custom field "${fieldKey}"?`)) return;
    try {
      const res = await fetch(`/api/products/custom-fields/${fieldKey}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Field definition removed');
        setCustomFieldDefs(prev => prev.filter(f => f.fieldKey !== fieldKey));
      } else {
        showToast(data.message || 'Error deleting field', 'error');
      }
    } catch (err) {
      showToast('Error deleting field: ' + err.message, 'error');
    }
  };

  // Save Dynamic Contact & Wholesale Hub Details
  const handleSaveContactSettings = async (e) => {
    if (e) e.preventDefault();
    setIsContactSaving(true);
    setContactSaveSuccess(false);
    setContactSaveError('');
    try {
      const res = await fetch('/api/settings/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(contactSettings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactSaveSuccess(true);
        broadcastLiveEvent(SYNC_EVENTS.SETTINGS_UPDATED, { type: 'contact', contact: contactSettings });
        showToast('Contact & Wholesale Hub details published live!');
        setTimeout(() => setContactSaveSuccess(false), 4500);
      } else {
        setContactSaveError(data.message || 'Failed to update contact settings');
        showToast(data.message || 'Error saving contact details', 'error');
      }
    } catch (err) {
      setContactSaveError('Network error while saving settings: ' + err.message);
      showToast('Network error while saving settings', 'error');
    } finally {
      setIsContactSaving(false);
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
        if (productCategoryFilter === 'Our Products') {
          matchesCat = Boolean(p.isOurProduct);
        } else if (productCategoryFilter === 'Generic Medicines') {
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

          <div style={{ marginTop: '20px', padding: '14px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px', textAlign: 'center' }}>
              Quick Login Credentials (Click to Auto-Fill):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => { setEmail('info@niyanshpharma.com'); setPassword('NiyanshSuper@2026'); }}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #fde68a', backgroundColor: '#fffbeb', color: '#92400e', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}
              >
                <div>
                  <strong>Super Admin (Master Account)</strong><br />
                  <span style={{ fontFamily: 'monospace' }}>info@niyanshpharma.com</span> • <span style={{ fontFamily: 'monospace' }}>NiyanshSuper@2026</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>Auto-Fill</span>
              </button>

              <button
                type="button"
                onClick={() => { setEmail('admin@niyanshpharma.com'); setPassword('admin123'); }}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#1e40af', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}
              >
                <div>
                  <strong>Staff Admin (Operations)</strong><br />
                  <span style={{ fontFamily: 'monospace' }}>admin@niyanshpharma.com</span> • <span style={{ fontFamily: 'monospace' }}>admin123</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>Auto-Fill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ADMIN DASHBOARD
  // ==========================================

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '30px 0' }}>
      {/* In-page Top Confirmation Bar (No browser alert box, smooth top slide-in) */}
      {deleteConfirm && (
        <div 
          role="alert"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            width: 'min(94vw, 680px)',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(239, 68, 68, 0.35)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderLeft: '5px solid #ef4444',
            animation: 'slideDownTopBar 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={20} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Delete {deleteConfirm.type === 'product' ? 'Product' : deleteConfirm.type === 'company' ? 'Company' : 'Item'}?</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ef4444', backgroundColor: '#fee2e2', padding: '1px 7px', borderRadius: '10px', textTransform: 'uppercase' }}>
                  Direct Option
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Are you sure you want to delete <strong style={{ color: '#0f172a' }}>{deleteConfirm.name}</strong>?
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="btn btn-outline btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.84rem', cursor: 'pointer', height: '34px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteDelete}
              className="btn btn-sm"
              style={{
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                color: '#ffffff',
                fontWeight: '700',
                padding: '6px 16px',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)'
              }}
            >
              <Trash2 size={14} />
              <span>Yes, Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Central B2B Operations Header */}
      <div className="admin-workspace-container" style={{ marginBottom: '22px' }}>
        <div className="admin-b2b-header-card">
          {/* Identity & Compliance Details */}
          <div className="admin-b2b-identity-wrap">
            <div className="admin-b2b-emblem">
              <ShieldCheck size={28} color="#ffffff" />
              <div className="admin-b2b-emblem-badge" />
            </div>

            <div className="admin-b2b-title-area">
              <div className="admin-b2b-badges-row">
                {isSuperAdmin ? (
                  <span className="admin-role-badge superadmin">
                    <Crown size={12} /> Super Admin Console
                  </span>
                ) : (
                  <span className="admin-role-badge admin">
                    <Shield size={12} /> Operations Admin
                  </span>
                )}
                <span className="admin-live-badge">
                  <span className="admin-live-dot" /> Live System Online
                </span>
                <span className="admin-hub-badge">
                  <MapPin size={11} color="#0284c7" /> Rajkot Wholesale Hub (Gujarat)
                </span>
              </div>

              <h1 className="admin-b2b-title">
                Niyansh Pharma • Central B2B Operations Console
              </h1>

              <div className="admin-b2b-licenses-row">
                {[
                  { key: 'dl', label: 'D.L.No.', val: '20B, 264618, 21B, 264619' },
                  { key: 'gstin', label: 'GSTIN', val: '24BVXPP6108F2Z7' },
                  { key: 'pan', label: 'PAN', val: 'BVXPP6108F' },
                  { key: 'food', label: 'Food Lic.', val: '20726030000567' }
                ].map(lic => (
                  <button
                    key={lic.key}
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(lic.val);
                        setCopiedLicenseKey(lic.key);
                        showToast(`${lic.label} copied to clipboard!`, 'info');
                        setTimeout(() => setCopiedLicenseKey(null), 1800);
                      }
                    }}
                    className="admin-license-pill-interactive"
                    title={`Click to copy ${lic.label}`}
                  >
                    <span>{lic.label}:</span>
                    <strong>{lic.val}</strong>
                    {copiedLicenseKey === lic.key ? (
                      <Check size={11} color="#16a34a" />
                    ) : (
                      <Copy size={10} style={{ opacity: 0.5, marginLeft: '2px' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions Bar */}
          <div className="admin-b2b-controls-wrap">
            <div className="admin-b2b-kpis-grid">
              {/* Orders KPI */}
              <div 
                className="admin-b2b-kpi-chip" 
                onClick={() => setActiveTab('orders')}
                title="View Active Orders"
              >
                <div className="admin-b2b-kpi-icon" style={{ backgroundColor: '#e0f2fe' }}>
                  <ShoppingBag size={16} color="#0284c7" />
                </div>
                <div>
                  <div className="admin-b2b-kpi-val">
                    {(orders || []).filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing' || o.orderStatus === 'Booked').length}
                  </div>
                  <div className="admin-b2b-kpi-lbl">Active Orders</div>
                </div>
              </div>

              {/* Products KPI */}
              <div 
                className="admin-b2b-kpi-chip" 
                onClick={() => setActiveTab('products')}
                title="View All Catalog Products"
              >
                <div className="admin-b2b-kpi-icon" style={{ backgroundColor: '#dcfce7' }}>
                  <Package size={16} color="#16a34a" />
                </div>
                <div>
                  <div className="admin-b2b-kpi-val">{(products || []).length}</div>
                  <div className="admin-b2b-kpi-lbl">Live Products</div>
                </div>
              </div>

              {/* Low Stock Alert KPI */}
              {(() => {
                const lowCount = (products || []).filter(p => (Number(p.stock) || 0) <= (Number(p.minOrderQty) || 5)).length;
                return (
                  <div 
                    className="admin-b2b-kpi-chip" 
                    onClick={() => { setActiveTab('products'); setProductStockFilter('low'); }}
                    title={lowCount > 0 ? `${lowCount} products low in stock` : 'All products well stocked'}
                    style={{ borderColor: lowCount > 0 ? '#fde68a' : undefined }}
                  >
                    <div className="admin-b2b-kpi-icon" style={{ backgroundColor: lowCount > 0 ? '#fef3c7' : '#f1f5f9' }}>
                      <AlertTriangle size={16} color={lowCount > 0 ? '#d97706' : '#94a3b8'} />
                    </div>
                    <div>
                      <div className="admin-b2b-kpi-val" style={{ color: lowCount > 0 ? '#b45309' : undefined }}>
                        {lowCount}
                      </div>
                      <div className="admin-b2b-kpi-lbl">Low Stock</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quick Actions */}
            <div className="admin-b2b-actions-group">
              <button 
                type="button" 
                onClick={() => handleOpenProductModal()} 
                className="admin-b2b-btn admin-b2b-btn-primary"
                title="Quick Add New Product to Catalog"
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>

              <button 
                type="button" 
                onClick={() => { 
                  fetchDashboardData(true); 
                  showToast('Live dashboard data synced!', 'info'); 
                }} 
                className="admin-b2b-btn admin-b2b-btn-secondary"
                title="Sync Live Orders & Catalog"
              >
                <RefreshCw size={13} className={isLoading ? 'spin-anim' : ''} />
                <span>Sync</span>
              </button>

              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="admin-b2b-btn admin-b2b-btn-outline"
                title="Open Retailer B2B Storefront in New Tab"
              >
                <ExternalLink size={13} />
                <span>Storefront</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-workspace-container admin-layout-container">
        
        {/* Sidebar Nav */}
        <aside className="card admin-desktop-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px', alignSelf: 'start', maxHeight: 'calc(100vh - 95px)', overflowY: 'auto' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }}></div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', margin: 0 }}>{t('admin.consoleSidebarTitle', 'Admin Console')}</h3>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
              Niyansh Pharma B2B Portal
            </span>

            {/* Logged in User Profile Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              backgroundColor: isSuperAdmin ? '#fffbeb' : '#f8fafc',
              border: `1.5px solid ${isSuperAdmin ? '#fde68a' : '#e2e8f0'}`,
              borderRadius: '10px',
              marginTop: '12px'
            }}>
              <img 
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || (isSuperAdmin ? 'Super Admin' : 'Admin'))}&background=${isSuperAdmin ? 'f59e0b' : '2563eb'}&color=ffffff&bold=true`}
                alt="Avatar"
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isSuperAdmin ? '#f59e0b' : '#2563eb'}`, flexShrink: 0 }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || (isSuperAdmin ? 'Niyansh Super Admin' : 'Operations Admin')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  {isSuperAdmin ? (
                    <span style={{ fontSize: '0.68rem', fontWeight: '800', backgroundColor: '#f59e0b', color: '#ffffff', padding: '1px 7px', borderRadius: '10px', letterSpacing: '0.3px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Crown size={10} /> Super Admin
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.68rem', fontWeight: '800', backgroundColor: '#2563eb', color: '#ffffff', padding: '1px 7px', borderRadius: '10px', letterSpacing: '0.3px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Shield size={10} /> Staff Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenProfileModal}
                title="Edit My Profile & Password"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isSuperAdmin ? '#b45309' : '#2563eb',
                  padding: '5px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >
                <Edit2 size={13} />
              </button>
            </div>
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

            {/* SUPERADMIN ONLY: MANAGE ADMINS TAB */}
            {isSuperAdmin && (
              <button 
                onClick={() => { setActiveTab('manage-admins'); fetchAdmins(); }} 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                  borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem',
                  backgroundColor: activeTab === 'manage-admins' ? '#fef3c7' : '#fffbeb',
                  color: '#92400e',
                  border: `1.5px solid ${activeTab === 'manage-admins' ? '#f59e0b' : '#fde68a'}`,
                  boxShadow: '0 1px 3px rgba(245, 158, 11, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={16} color="#d97706" /> Manage Admins
                </div>
                <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#f59e0b', color: '#ffffff', fontWeight: '800' }}>
                  {adminList.length}
                </span>
              </button>
            )}

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
                <Package size={16} /> B2B Orders
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                {orders.length}
              </span>
            </button>

            {(isSuperAdmin || hasPermission('canManageLedgers')) && (
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
                  <CreditCard size={16} /> Outstanding Ledger
                </div>
                {overdueLedgersCount > 0 && (
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: '700' }}>
                    {overdueLedgersCount} Due
                  </span>
                )}
              </button>
            )}

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
                <Flame size={16} /> News & Schemes
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
                {productStats.totalProducts || products.length}
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

            <button 
              onClick={() => setActiveTab('contact')} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                backgroundColor: activeTab === 'contact' ? 'rgba(12, 61, 108, 0.1)' : 'transparent',
                color: activeTab === 'contact' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} /> Contact & Hub
              </div>
              <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: '700' }}>
                Live
              </span>
            </button>
          </nav>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={fetchDashboardData}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontSize: '0.8rem', gap: '6px' }}
            >
              <RefreshCw size={13} /> {t('admin.refreshData', 'Refresh Live Data')}
            </button>

            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444', gap: '6px', fontSize: '0.8rem' }}
            >
              <LogOut size={13} /> {t('admin.logout', 'Log Out')}
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
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> {t('admin.refresh', 'Refresh')}
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', height: '30px' }}
                >
                  <LogOut size={12} /> {t('admin.exit', 'Exit')}
                </button>
              </div>
            </div>

            <div className="admin-mobile-tabs-scroll">
              <button onClick={() => setActiveTab('overview')} className={`admin-tab-chip ${activeTab === 'overview' ? 'active' : ''}`}>
                <LayoutDashboard size={14} /> {t('admin.tabOverview', 'Overview')}
              </button>
              {isSuperAdmin && (
                <button 
                  onClick={() => { setActiveTab('manage-admins'); fetchAdmins(); }} 
                  className={`admin-tab-chip ${activeTab === 'manage-admins' ? 'active' : ''}`}
                  style={{ backgroundColor: activeTab === 'manage-admins' ? '#f59e0b' : '#fffbeb', color: activeTab === 'manage-admins' ? '#fff' : '#b45309', border: '1.5px solid #fde68a', fontWeight: '700' }}
                >
                  <Users size={14} /> Admins ({adminList.length})
                </button>
              )}
              <button onClick={() => setActiveTab('orders')} className={`admin-tab-chip ${activeTab === 'orders' ? 'active' : ''}`}>
                <Package size={14} /> {t('admin.tabOrders', 'Orders')} ({orders.length})
              </button>
              {(isSuperAdmin || hasPermission('canManageLedgers')) && (
                <button onClick={() => setActiveTab('ledgers')} className={`admin-tab-chip ${activeTab === 'ledgers' ? 'active' : ''}`}>
                  <CreditCard size={14} /> {t('admin.tabLedgers', 'Ledgers')} {overdueLedgersCount > 0 ? `(${overdueLedgersCount} Due)` : `(${ledgers.length})`}
                </button>
              )}
              <button onClick={() => setActiveTab('news')} className={`admin-tab-chip ${activeTab === 'news' ? 'active' : ''}`}>
                <Flame size={14} /> {t('admin.tabBulletins', 'Schemes')} ({news.length})
              </button>
              <button onClick={() => setActiveTab('products')} className={`admin-tab-chip ${activeTab === 'products' ? 'active' : ''}`}>
                <ShoppingBag size={14} /> {t('admin.tabProducts', 'Products')} ({productStats.totalProducts || products.length})
              </button>
              <button onClick={() => setActiveTab('enquiries')} className={`admin-tab-chip ${activeTab === 'enquiries' ? 'active' : ''}`}>
                <MessageSquare size={14} /> {t('admin.tabEnquiries', 'Enquiries')} ({enquiries.length})
              </button>
              <button onClick={() => setActiveTab('careers')} className={`admin-tab-chip ${activeTab === 'careers' ? 'active' : ''}`}>
                <Briefcase size={14} /> {t('admin.tabCareers', 'Careers')} ({careers.length})
              </button>
              <button onClick={() => setActiveTab('contact')} className={`admin-tab-chip ${activeTab === 'contact' ? 'active' : ''}`}>
                <Phone size={14} /> Contact & Hub
              </button>
              <button onClick={handleOpenProfileModal} className="admin-tab-chip" style={{ color: '#059669', borderColor: '#a7f3d0' }}>
                <User size={14} /> Profile
              </button>
            </div>
          </div>

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
                  
                  {/* 4-Stage B2B Fulfillment Pipeline Funnel */}
                  <div className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TrendingUp size={18} color="var(--primary-blue)" /> Order Fulfillment Pipeline
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

                  {/* 4 Healthcare Category Pillars */}
                  <div className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers size={18} color="var(--primary-blue)" /> Healthcare Category Ecosystem
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: '3px 0 0 0' }}>
                          Therapeutic formulations, surgical supplies, OTC personal wellness & Ayurvedic remedies
                        </p>
                      </div>
                      <button onClick={() => setActiveTab('products')} className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem' }}>
                        Explore Catalog ({productStats.totalProducts || products.length}) →
                      </button>
                    </div>

                    <div className="admin-category-grid">
                      <div onClick={() => { setProductCategoryFilter('Generic Medicines'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', textTransform: 'uppercase' }}>Generic Medicines</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{genericMedicinesCount} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Cardiac, Antibiotics, Pain, Neuro</div>
                      </div>

                      <div onClick={() => { setProductCategoryFilter('Surgical Supplies'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase' }}>Surgical & Devices</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{surgicalCount || 18} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Disposables, Bandages, BP Monitors</div>
                      </div>

                      <div onClick={() => { setProductCategoryFilter('OTC & Wellness'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>OTC & Wellness</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{otcCount || 32} SKUs</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>Daily Healthcare, Balms, Nutrition</div>
                      </div>

                      <div onClick={() => { setProductCategoryFilter('Ayurvedic & Herbal'); setActiveTab('products'); }} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase' }}>Ayurvedic & Herbal</span>
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
                        {overdueLedgersCount > 0 ? `${overdueLedgersCount} Overdue Accounts` : 'All accounts within credit limit'}
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
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary-green)' }}>{productStats.totalProducts || products.length}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                        {productStats.activeProducts ?? products.filter(p => p.inStock).length} In Stock
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
                      <table className="admin-table" style={{ width: '100%', minWidth: '780px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '140px', whiteSpace: 'nowrap' }}>Order #</th>
                            <th style={{ minWidth: '180px' }}>Store Name</th>
                            <th style={{ minWidth: '110px', whiteSpace: 'nowrap' }}>Date</th>
                            <th style={{ minWidth: '110px', whiteSpace: 'nowrap' }}>Grand Total</th>
                            <th style={{ minWidth: '110px' }}>Order Status</th>
                            <th style={{ minWidth: '110px' }}>Payment</th>
                            <th style={{ minWidth: '90px', textAlign: 'center' }}>Action</th>
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
                  TAB 2: B2B ORDERS MANAGER
                  ========================================== */}
              {activeTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Wholesale B2B Orders</h2>
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
                          Booked ({bookedOrdersCount})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Confirmed')} className={`btn btn-sm ${orderStatusFilter === 'Confirmed' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Confirmed' ? '#0284c7' : '#fff', color: orderStatusFilter === 'Confirmed' ? '#fff' : '#0369a1', borderColor: '#0284c7' }}>
                          Confirmed ({confirmedOrdersCount})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Dispatched')} className={`btn btn-sm ${orderStatusFilter === 'Dispatched' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Dispatched' ? '#8b5cf6' : '#fff', color: orderStatusFilter === 'Dispatched' ? '#fff' : '#7c3aed', borderColor: '#8b5cf6' }}>
                          Dispatched ({dispatchedOrdersCount})
                        </button>
                        <button onClick={() => setOrderStatusFilter('Delivered')} className={`btn btn-sm ${orderStatusFilter === 'Delivered' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', backgroundColor: orderStatusFilter === 'Delivered' ? '#16a34a' : '#fff', color: orderStatusFilter === 'Delivered' ? '#fff' : '#15803d', borderColor: '#16a34a' }}>
                          Delivered ({deliveredOrdersCount})
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
                      <table className="admin-table" style={{ width: '100%', minWidth: '1050px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '140px', whiteSpace: 'nowrap' }}>Order ID & Date</th>
                            <th style={{ minWidth: '180px' }}>Store & Retailer</th>
                            <th style={{ minWidth: '220px' }}>Items Summary</th>
                            <th style={{ minWidth: '110px', whiteSpace: 'nowrap' }}>Grand Total</th>
                            <th style={{ minWidth: '130px' }}>Order Status</th>
                            <th style={{ minWidth: '130px' }}>Payment Status</th>
                            <th style={{ minWidth: '240px', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>
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
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Mobile: {ord.retailerMobile}</div>
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
                                <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
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
                  TAB 3: RETAILER LEDGERS & OUTSTANDING
                  ========================================== */}
              {activeTab === 'ledgers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Outstanding Ledger</h2>
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
                      <table className="admin-table" style={{ width: '100%', minWidth: '1050px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '200px' }}>Retailer Shop & Mobile</th>
                            <th style={{ minWidth: '150px', whiteSpace: 'nowrap' }}>GSTIN</th>
                            <th style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Total Billed</th>
                            <th style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Total Paid</th>
                            <th style={{ minWidth: '130px', whiteSpace: 'nowrap' }}>Outstanding Dues</th>
                            <th style={{ minWidth: '140px' }}>Credit Limit</th>
                            <th style={{ minWidth: '240px', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>
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
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Mobile: {ledger.retailerMobile}</div>
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
                                  <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', whiteSpace: 'nowrap' }}>
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
                  TAB 4: DYNAMIC NEWS & SCHEMES MANAGER
                  ========================================== */}
              {activeTab === 'news' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Dynamic News & Schemes Manager</h2>
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
                                {item.priority === 1 ? 'PRIORITY P1' : `P${item.priority || 2}`}
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
                                {item.company}
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

                              {deleteConfirm?.type === 'news' && deleteConfirm?.id === item._id ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <button 
                                    type="button"
                                    onClick={handleExecuteDelete} 
                                    style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                                    title="Confirm Delete"
                                  >
                                    Delete
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)} 
                                    style={{ color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                    title="Cancel"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleRequestDeleteNews(item)}
                                  style={{ color: '#ef4444', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                                  title="Delete announcement"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
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

                    <div className="admin-action-toolbar">
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
                        title="Import multiple products from Excel or CSV with live preview"
                      >
                        <FileSpreadsheet size={14} /> Import Excel / CSV
                      </button>

                      <button 
                        onClick={handleDownloadExcelTemplate} 
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px', color: '#15803d', borderColor: '#86efac', backgroundColor: '#f0fdf4', fontWeight: '700' }}
                        title="Download sample Excel template (.xlsx) with all fields and registered companies"
                      >
                        <Download size={14} /> Download Template
                      </button>

                      {products.length > 0 && (isSuperAdmin || hasPermission('canClearDatabase')) && (
                        <button 
                          onClick={handleClearAllProducts}
                          disabled={isClearingProducts}
                          className="btn btn-sm"
                          style={{ gap: '6px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: '700' }}
                          title="Delete all products to start manual entry from scratch"
                        >
                          <Trash2 size={14} /> {isClearingProducts ? 'Clearing...' : 'Clear All'}
                        </button>
                      )}

                      <button 
                        onClick={() => handleOpenProductModal(null)} 
                        className="btn btn-primary btn-sm admin-add-prod-btn" 
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
                    {/* Category Quick Selector Chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setProductCategoryFilter('All'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'All' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        All Products ({productStats.totalProducts || products.length})
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Our Products'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Our Products' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px', borderColor: '#10b981', color: productCategoryFilter === 'Our Products' ? '#fff' : '#047857' }}>
                        Our Products ({products.filter(p => p.isOurProduct).length})
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Generic Medicines'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Generic Medicines' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        Generic Formulations
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Surgical Supplies'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Surgical Supplies' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        Surgical & Devices
                      </button>
                      <button onClick={() => { setProductCategoryFilter('OTC & Wellness'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'OTC & Wellness' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        OTC & Daily Care
                      </button>
                      <button onClick={() => { setProductCategoryFilter('Ayurvedic & Herbal'); setProductPage(1); }} className={`btn btn-sm ${productCategoryFilter === 'Ayurvedic & Herbal' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '20px' }}>
                        Ayurvedic & Herbal
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
                       TABLE & MOBILE CARDS DUAL-MODE VIEW
                       ========================================== */
                    <>
                      {/* Desktop Data Grid View (Screens >= 993px - Streamlined 5-Column Single View, Zero Horizontal Scroll) */}
                      <div className="admin-product-desktop-table card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div className="admin-table-container" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                          <table className="admin-table" style={{ width: '100%', tableLayout: 'auto', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                <th style={{ width: '42%', padding: '12px 14px' }}>Product & Formulation</th>
                                <th style={{ width: '18%', padding: '12px 12px' }}>Category & Tax</th>
                                <th style={{ width: '15%', padding: '12px 12px' }}>Wholesale Price</th>
                                <th style={{ width: '13%', padding: '12px 12px' }}>Stock & Live</th>
                                <th style={{ width: '12%', padding: '12px 12px', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedProducts.map((p) => {
                                const photoUrl = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || '');
                                const hasMultiplePhotos = p.images && p.images.length > 1;
                                const isOutOfStock = !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
                                const discountPercent = p.mrp && p.price && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

                                const isTargetedForDelete = deleteConfirm?.type === 'product' && deleteConfirm?.id === p._id;

                                return (
                                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: isTargetedForDelete ? '#fef2f2' : 'transparent', transition: 'background-color 0.15s ease' }}>
                                    {/* Column 1: Photo + Name + SKU + Form + Packing + Composition */}
                                    <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div style={{ position: 'relative', width: '44px', height: '44px', minWidth: '44px', aspectRatio: '1 / 1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff', padding: '2px', boxSizing: 'border-box', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                          {photoUrl ? (
                                            <img 
                                              src={photoUrl} 
                                              alt={p.name} 
                                              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                              onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                          ) : (
                                            <ImageIcon size={18} color="#94a3b8" />
                                          )}
                                          {hasMultiplePhotos && (
                                            <span 
                                              style={{
                                                position: 'absolute', bottom: '2px', right: '2px',
                                                backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
                                                fontSize: '0.62rem', padding: '1px 3px', borderRadius: '3px', fontWeight: '700'
                                              }}
                                              title={`${p.images.length} photos available`}
                                            >
                                              +{p.images.length - 1}
                                            </span>
                                          )}
                                        </div>

                                        <div style={{ minWidth: 0, flex: 1 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.94rem' }}>{p.name}</span>
                                            {p.featured && (
                                              <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.68rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                                <Star size={10} fill="#b45309" /> Featured
                                              </span>
                                            )}
                                            {p.isOurProduct && (
                                              <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.68rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                                                ★ Our Brand
                                              </span>
                                            )}
                                          </div>

                                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
                                            <span style={{ fontWeight: '700', color: '#475569' }}>{p.company || p.brand}</span>
                                            <span>•</span>
                                            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>{p.form || 'Tablet'}</span>
                                            <span>•</span>
                                            <span style={{ color: '#64748b' }}>{p.packing || 'Standard'}</span>
                                            {p.sku && (
                                              <>
                                                <span>•</span>
                                                <span style={{ fontFamily: 'monospace', color: 'var(--primary-blue)', backgroundColor: '#eff6ff', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                                  {p.sku}
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          {p.composition && (
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }} title={p.composition}>
                                              <em>{p.composition}</em>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </td>

                                    {/* Column 2: Category & Tax */}
                                    <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                                      <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155' }}>
                                        {p.category}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', flexWrap: 'wrap' }}>
                                        {(p.salesGst !== undefined || p.gstRate !== undefined) && (
                                          <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                                            GST: {p.salesGst !== undefined ? p.salesGst : p.gstRate}%
                                          </span>
                                        )}
                                        {p.hsnCode && (
                                          <span style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px' }}>
                                            HSN: {p.hsnCode}
                                          </span>
                                        )}
                                        {(p.batchNumber || p.batchNo) && (
                                          <span style={{ fontSize: '0.7rem', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '1px 5px', borderRadius: '4px', fontWeight: '600' }}>
                                            B:{p.batchNumber || p.batchNo}
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    {/* Column 3: Wholesale Pricing & MRP */}
                                    <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                                      <div style={{ fontWeight: '800', color: 'var(--primary-blue)', fontSize: '0.98rem' }}>
                                        {formatCurrency(p.price)}
                                      </div>
                                      {p.mrp && p.mrp > p.price && (
                                        <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                          <span style={{ textDecoration: 'line-through' }}>{formatCurrency(p.mrp)}</span>
                                          <span style={{ color: '#16a34a', fontWeight: '700' }}>({discountPercent}% OFF)</span>
                                        </div>
                                      )}
                                    </td>

                                    {/* Column 4: Stock & Live Status */}
                                    <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                                      <div>
                                        <button 
                                          type="button"
                                          onClick={() => handleToggleStock(p)}
                                          style={{
                                            border: 'none', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700',
                                            backgroundColor: !isOutOfStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: !isOutOfStock ? '#059669' : '#dc2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                                          }}
                                          title="Click to toggle stock status"
                                        >
                                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: !isOutOfStock ? '#059669' : '#dc2626' }}></span>
                                          {!isOutOfStock ? 'In Stock' : 'Out'}
                                        </button>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleActive(p)}
                                          style={{
                                            border: 'none', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700',
                                            backgroundColor: p.isActive !== false ? '#ecfdf5' : '#f1f5f9',
                                            color: p.isActive !== false ? '#059669' : '#94a3b8',
                                            cursor: 'pointer'
                                          }}
                                          title={p.isActive !== false ? 'Live on website' : 'Hidden from website'}
                                        >
                                          {p.isActive !== false ? '● Live' : '○ Off'}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleFeatured(p)}
                                          style={{
                                            border: 'none', background: 'none', cursor: 'pointer', padding: '2px',
                                            color: p.featured ? '#f59e0b' : '#cbd5e1'
                                          }}
                                          title={p.featured ? 'Featured on website' : 'Mark as featured'}
                                        >
                                          <Star size={13} fill={p.featured ? '#f59e0b' : 'none'} />
                                        </button>
                                      </div>
                                    </td>

                                    {/* Column 5: Actions */}
                                    <td style={{ padding: '10px 12px', verticalAlign: 'middle', textAlign: 'right' }}>
                                      {isTargetedForDelete ? (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                          <button 
                                            type="button"
                                            onClick={handleExecuteDelete} 
                                            style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: '700' }}
                                            title="Confirm Delete"
                                          >
                                            <Trash2 size={11} />
                                            <span>Delete</span>
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => setDeleteConfirm(null)} 
                                            style={{ color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', padding: '4px 6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem' }}
                                            title="Cancel"
                                          >
                                            <X size={11} />
                                          </button>
                                        </div>
                                      ) : (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                          <button 
                                            type="button"
                                            onClick={() => handleOpenProductModal(p)} 
                                            style={{ color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', padding: '6px', borderRadius: '6px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', cursor: 'pointer' }}
                                            title="Edit Product Details & Photos"
                                            aria-label="Edit product"
                                          >
                                            <Edit2 size={13} />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => handleRequestDeleteProduct(p)} 
                                            style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', cursor: 'pointer' }}
                                            title="Delete Product"
                                            aria-label="Delete product"
                                          >
                                            <Trash2 size={13} />
                                          </button>
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

                      {/* Mobile & Tablet Product List Cards (Screens <= 992px) */}
                      <div className="admin-product-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
                        {paginatedProducts.map((p) => {
                          const photoUrl = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || '');
                          const isOutOfStock = !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
                          const discountPercent = p.mrp && p.price && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
                          const isTargetedForDelete = deleteConfirm?.type === 'product' && deleteConfirm?.id === p._id;

                          return (
                            <div 
                              key={p._id}
                              className="card"
                              style={{
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                border: isTargetedForDelete ? '2px solid #ef4444' : '1px solid var(--border-light)',
                                backgroundColor: isTargetedForDelete ? '#fef2f2' : 'var(--bg-card)',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}
                            >
                              {/* Top: Photo + Name + Category + Form */}
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ width: '54px', height: '54px', minWidth: '54px', aspectRatio: '1 / 1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff', padding: '4px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {photoUrl ? (
                                    <img src={photoUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                  ) : (
                                    <ImageIcon size={22} color="#94a3b8" />
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                    <span style={{ fontWeight: '800', color: 'var(--text-dark)', fontSize: '0.98rem', lineHeight: '1.3' }}>{p.name}</span>
                                    {p.featured && (
                                      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.68rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                        <Star size={10} fill="#b45309" /> Featured
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                                    {p.category} • <span style={{ color: '#0f172a', fontWeight: '600' }}>{p.form || 'Tablet'}</span> {p.packing ? `(${p.packing})` : ''}
                                  </div>
                                  {p.composition && (
                                    <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      <strong>Contains:</strong> {p.composition}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Badges Bar: SKU, Batch, Expiry, GST */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.72rem' }}>
                                {p.sku && (
                                  <span style={{ fontFamily: 'monospace', color: 'var(--primary-blue)', backgroundColor: '#eff6ff', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                                    {p.sku}
                                  </span>
                                )}
                                {(p.batchNumber || p.batchNo) && (
                                  <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                                    Batch: {p.batchNumber || p.batchNo}
                                  </span>
                                )}
                                {p.rackId && (
                                  <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                                    Rack: {p.rackId}
                                  </span>
                                )}
                                {p.expiryDate && (
                                  <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                                    Exp: {p.expiryDate}
                                  </span>
                                )}
                                {p.hsnCode && (
                                  <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 7px', borderRadius: '4px', fontWeight: '600' }}>
                                    HSN: {p.hsnCode}
                                  </span>
                                )}
                                {(p.salesGst !== undefined || p.gstRate !== undefined) && (
                                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                                    GST: {p.salesGst !== undefined ? p.salesGst : p.gstRate}%
                                  </span>
                                )}
                              </div>

                              {/* Commercial Matrix: Price & Stock Controls */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Wholesale PTR</div>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-blue)' }}>{formatCurrency(p.price)}</span>
                                    {p.mrp && p.mrp > p.price && (
                                      <>
                                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatCurrency(p.mrp)}</span>
                                        <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '700' }}>({discountPercent}% OFF)</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStock(p)}
                                    style={{
                                      border: 'none', padding: '5px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                      backgroundColor: !isOutOfStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                      color: !isOutOfStock ? '#059669' : '#dc2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                                    }}
                                  >
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: !isOutOfStock ? '#059669' : '#dc2626' }}></span>
                                    {!isOutOfStock ? `In Stock (${p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 100 : 0)})` : 'Out of Stock'}
                                  </button>
                                </div>
                              </div>

                              {/* Footer Actions: Live Status, Featured, Our Product, Edit, Delete */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleActive(p)}
                                    style={{
                                      border: 'none', padding: '4px 9px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '700',
                                      backgroundColor: p.isActive !== false ? '#ecfdf5' : '#f1f5f9',
                                      color: p.isActive !== false ? '#059669' : '#94a3b8',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {p.isActive !== false ? '● Live' : '○ Hidden'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleFeatured(p)}
                                    style={{
                                      border: '1px solid #fde68a', backgroundColor: p.featured ? '#fef3c7' : '#ffffff',
                                      padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px',
                                      fontSize: '0.74rem', fontWeight: '700', color: p.featured ? '#b45309' : '#64748b'
                                    }}
                                  >
                                    <Star size={12} fill={p.featured ? '#f59e0b' : 'none'} color={p.featured ? '#b45309' : '#cbd5e1'} />
                                    <span>{p.featured ? 'Featured' : 'Feature'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleOurProduct(p)}
                                    style={{
                                      border: '1px solid #bbf7d0', backgroundColor: p.isOurProduct ? '#dcfce7' : '#ffffff',
                                      padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                                      fontSize: '0.74rem', fontWeight: '700', color: p.isOurProduct ? '#15803d' : '#64748b'
                                    }}
                                  >
                                    {p.isOurProduct ? '★ Our' : '+ Our'}
                                  </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {isTargetedForDelete ? (
                                    <>
                                      <button 
                                        type="button"
                                        onClick={handleExecuteDelete} 
                                        style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                      >
                                        <Trash2 size={13} /> Delete
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => setDeleteConfirm(null)} 
                                        style={{ color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                                      >
                                        <X size={13} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenProductModal(p)}
                                        style={{
                                          color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px',
                                          padding: '6px 12px', borderRadius: '7px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff',
                                          cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700'
                                        }}
                                      >
                                        <Edit2 size={13} /> Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRequestDeleteProduct(p)}
                                        style={{
                                          color: '#ef4444', display: 'inline-flex', alignItems: 'center',
                                          padding: '6px 10px', borderRadius: '7px', border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                                          cursor: 'pointer'
                                        }}
                                        title="Delete Product"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
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
                            {/* Card Media Preview Header - Standard 1:1 Square */}
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', backgroundColor: '#ffffff', padding: '12px', boxSizing: 'border-box', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {photoUrl ? (
                                <img 
                                  src={photoUrl} 
                                  alt={p.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
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

                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {p.rackId && (
                                  <span style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '3px', fontWeight: '700' }}>
                                    Rack: {p.rackId}
                                  </span>
                                )}
                                {p.hsnCode && (
                                  <span style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '3px', fontWeight: '600' }}>
                                    HSN: {p.hsnCode}
                                  </span>
                                )}
                                {(p.salesGst !== undefined || p.gstRate !== undefined) && (
                                  <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: '3px', fontWeight: '700' }}>
                                    GST: {p.salesGst !== undefined ? p.salesGst : p.gstRate}%
                                  </span>
                                )}
                                {p.expiryDate && (
                                  <span style={{ fontSize: '0.7rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '1px 5px', borderRadius: '3px', fontWeight: '600' }}>
                                    Exp: {p.expiryDate}
                                  </span>
                                )}
                              </div>

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

                              {deleteConfirm?.type === 'product' && deleteConfirm?.id === p._id ? (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={handleExecuteDelete}
                                    style={{ padding: '4px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                    title="Confirm Delete"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)}
                                    style={{ padding: '4px 8px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    title="Cancel"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
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
                                    onClick={() => handleRequestDeleteProduct(p)}
                                    style={{ padding: '4px 8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}
                                    title="Delete Product"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {companies.length > 0 && (isSuperAdmin || hasPermission('canClearDatabase')) && (
                        <button 
                          onClick={handleClearAllCompanies}
                          disabled={isClearingCompanies}
                          className="btn btn-sm"
                          style={{ gap: '6px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: '700' }}
                          title="Delete all companies to start manual entry from scratch"
                        >
                          <Trash2 size={14} /> {isClearingCompanies ? 'Clearing...' : 'Clear All Companies'}
                        </button>
                      )}

                      <button 
                        onClick={() => handleOpenCompanyModal(null)} 
                        className="btn btn-primary btn-sm" 
                        style={{ gap: '6px' }}
                      >
                        <Plus size={16} /> Add New Company
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Tiles */}
                  <div className="admin-stat-tiles-grid">
                    <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid var(--primary-blue)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: '600' }}>Total Companies</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)' }}>{totalCompaniesCount || companies.length}</div>
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

                  {/* Companies Table or Empty State */}
                  {filteredCompanies.length === 0 ? (
                    <div className="card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                        <Building2 size={30} />
                      </div>
                      <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>No companies found</h3>
                      <p style={{ color: 'var(--text-medium)', maxWidth: '420px', margin: 0, fontSize: '0.9rem' }}>
                        {companySearch || companyCategoryFilter !== 'All'
                          ? 'Try adjusting your search criteria or resetting the category filter.'
                          : 'No companies in directory. Start adding your pharmaceutical manufacturers or suppliers now.'}
                      </p>
                      <button 
                        onClick={() => handleOpenCompanyModal(null)} 
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '10px' }}
                      >
                        <Plus size={16} /> Add First Company
                      </button>
                    </div>
                  ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div className="admin-table-container">
                        <table className="admin-table" style={{ width: '100%', minWidth: '780px' }}>
                          <thead>
                            <tr>
                              <th style={{ width: '68px', minWidth: '68px', textAlign: 'center' }}>Logo</th>
                              <th style={{ minWidth: '220px' }}>Company Name</th>
                              <th style={{ minWidth: '160px' }}>Category</th>
                              <th style={{ minWidth: '160px' }}>Location</th>
                              <th style={{ minWidth: '110px', textAlign: 'center' }}>Status</th>
                              <th style={{ minWidth: '110px', textAlign: 'center' }}>Actions</th>
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
                                  {deleteConfirm?.type === 'company' && deleteConfirm?.id === c._id ? (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      <button 
                                        type="button"
                                        onClick={handleExecuteDelete} 
                                        style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                        title="Confirm Delete"
                                      >
                                        <Trash2 size={13} />
                                        <span>Delete</span>
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => setDeleteConfirm(null)} 
                                        style={{ color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        title="Cancel"
                                      >
                                        <X size={13} />
                                      </button>
                                    </div>
                                  ) : (
                                    <>
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
                                        onClick={() => handleRequestDeleteCompany(c)}
                                        style={{ color: '#ef4444', padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', cursor: 'pointer' }}
                                        title="Delete Company"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                </div>
              )}

              {/* ==========================================
                  TAB 6: ENQUIRIES MANAGER (EXISTING)
                  ========================================== */}
              {activeTab === 'enquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0 }}>Enquiries & Chemist Registrations</h2>
                    
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
                              {deleteConfirm?.type === 'enquiry' && deleteConfirm?.id === enq._id ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <button 
                                    type="button"
                                    onClick={handleExecuteDelete} 
                                    style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                                  >
                                    Delete
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)} 
                                    style={{ color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleRequestDeleteEnquiry(enq._id, enq.name || enq.phone)} 
                                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                  aria-label="Delete enquiry"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Row 2: Details */}
                          <div className="admin-form-grid-2-1" style={{ gap: '18px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                              <div>Phone: <a href={`tel:${enq.phone}`} style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>{enq.phone}</a></div>
                              {enq.email && <div>Email: <a href={`mailto:${enq.email}`} style={{ color: 'var(--text-dark)' }}>{enq.email}</a></div>}
                              {enq.address && <div>Address: <span style={{ color: 'var(--text-medium)' }}>{enq.address}</span></div>}
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
                            {deleteConfirm?.type === 'career' && deleteConfirm?.id === app._id ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button 
                                  type="button"
                                  onClick={handleExecuteDelete} 
                                  style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                                >
                                  Delete
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setDeleteConfirm(null)} 
                                  style={{ color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleRequestDeleteCareer(app._id, app.fullName || app.position)} 
                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                aria-label="Delete career"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>

                          <div className="admin-form-grid-2-1" style={{ gap: '18px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                              <div>Phone: <a href={`tel:${app.phone}`} style={{ fontWeight: '600' }}>{app.phone}</a></div>
                              <div>Email: <a href={`mailto:${app.email}`} style={{ color: 'var(--primary-blue)' }}>{app.email}</a></div>
                              <div>Experience: <strong>{app.experience}</strong></div>
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

              {/* ==========================================
                  TAB 8: DYNAMIC CONTACT & HUB MANAGEMENT
                  ========================================== */}
              {activeTab === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone size={24} /> Contact & Wholesale Hub Management
                        </h2>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                          Live Public Sync Active
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', margin: 0 }}>
                        Manage public contact coordinates, direct calling hotlines, business hours, and Sunday holiday status. Any edits saved here immediately reflect across the live website without requiring page refreshes.
                      </p>
                    </div>

                    <button 
                      type="button"
                      onClick={handleSaveContactSettings}
                      disabled={isContactSaving}
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', gap: '8px', fontSize: '0.9rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(12, 61, 108, 0.2)' }}
                    >
                      <Save size={16} /> {isContactSaving ? 'Publishing Live...' : 'Save & Publish Live'}
                    </button>
                  </div>

                  {/* Feedback Alerts */}
                  {contactSaveSuccess && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '0.92rem', fontWeight: '600' }} role="status">
                      <CheckCircle2 size={18} color="#16a34a" />
                      <span>Contact & Wholesale Hub coordinates successfully updated and published to the live public website!</span>
                    </div>
                  )}

                  {contactSaveError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.92rem', fontWeight: '600' }} role="alert">
                      <AlertCircle size={18} color="#dc2626" />
                      <span>{contactSaveError}</span>
                    </div>
                  )}

                  {/* Split Layout: Form on Left, Live Preview Card on Right */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)', gap: '22px', alignItems: 'start' }} className="admin-contact-split">
                    {/* Left: Settings Form */}
                    <form onSubmit={handleSaveContactSettings} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', margin: 0, paddingBottom: '12px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Wholesale Dispatch Desk Settings</span>
                      </h3>

                      {/* 1. Hub Physical Address */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="hub-address" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                          Wholesale Hub Physical Address <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                        </label>
                        <textarea
                          id="hub-address"
                          rows="3"
                          required
                          value={contactSettings.hubAddress}
                          onChange={(e) => setContactSettings(prev => ({ ...prev, hubAddress: e.target.value }))}
                          style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }}
                          placeholder="Enter complete hub building, street, landmark, city, state and PIN..."
                        />
                      </div>

                      {/* 2. Direct Calling Numbers */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label htmlFor="phone-primary" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Direct Calling - Line 1 (Primary) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                          </label>
                          <input
                            id="phone-primary"
                            type="text"
                            required
                            value={contactSettings.primaryPhone}
                            onChange={(e) => setContactSettings(prev => ({ ...prev, primaryPhone: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                            placeholder="+91 99099 23130"
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label htmlFor="phone-secondary" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Direct Calling - Line 2 (Slash / Number)
                          </label>
                          <input
                            id="phone-secondary"
                            type="text"
                            value={contactSettings.secondaryPhone}
                            onChange={(e) => setContactSettings(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                            placeholder="+91 93165 66894"
                          />
                        </div>
                      </div>

                      {/* 3. Email Address */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="contact-email-setting" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                          Wholesale Inquiry Email <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                        </label>
                        <input
                          id="contact-email-setting"
                          type="email"
                          required
                          value={contactSettings.email}
                          onChange={(e) => setContactSettings(prev => ({ ...prev, email: e.target.value }))}
                          style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                          placeholder="info@niyanshpharma.com"
                        />
                      </div>

                      {/* 4. Business Hours & Working Days */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label htmlFor="working-hours" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Business Working Hours <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                          </label>
                          <input
                            id="working-hours"
                            type="text"
                            required
                            value={contactSettings.workingHours}
                            onChange={(e) => setContactSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                            placeholder="9:00 AM – 9:00 PM"
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label htmlFor="working-days" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Working Days Badge <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                          </label>
                          <input
                            id="working-days"
                            type="text"
                            required
                            value={contactSettings.workingDays}
                            onChange={(e) => setContactSettings(prev => ({ ...prev, workingDays: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                            placeholder="Monday – Saturday"
                          />
                        </div>
                      </div>

                      {/* 5. Sunday Holiday Status & Lunch Break */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label htmlFor="sunday-status" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Sunday Status Badge (Next Line) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                          </label>
                          <input
                            id="sunday-status"
                            type="text"
                            required
                            value={contactSettings.sundayStatus}
                            onChange={(e) => setContactSettings(prev => ({ ...prev, sundayStatus: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                            placeholder="Sunday: Holiday"
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label htmlFor="lunch-break" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Lunch Break Timing <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                          </label>
                          <input
                            id="lunch-break"
                            type="text"
                            required
                            value={contactSettings.lunchBreak}
                            onChange={(e) => setContactSettings(prev => ({ ...prev, lunchBreak: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                            placeholder="2:00 PM – 4:00 PM"
                          />
                        </div>
                      </div>

                      {/* 6. Google Map Embed URL */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="map-url" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                          Google Maps Embed URL (Iframe `src`)
                        </label>
                        <input
                          id="map-url"
                          type="text"
                          value={contactSettings.mapEmbedUrl}
                          onChange={(e) => setContactSettings(prev => ({ ...prev, mapEmbedUrl: e.target.value }))}
                          style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                          placeholder="https://www.google.com/maps/embed?..."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Reset form to current saved database values?')) {
                              fetchDashboardData();
                            }
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          Discard Edits
                        </button>
                        <button
                          type="submit"
                          disabled={isContactSaving}
                          className="btn btn-primary"
                          style={{ gap: '8px', fontWeight: '700' }}
                        >
                          <Save size={16} /> {isContactSaving ? 'Publishing Live...' : 'Save & Publish Live'}
                        </button>
                      </div>
                    </form>

                    {/* Right: Real-time Public Website Preview Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Live Public Preview (Chemist View)
                          </span>
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                            Real-time Mirror
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Hub Address */}
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
                              <MapPin size={20} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '3px' }}>Wholesale Hub Address</div>
                              <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                                {contactSettings.hubAddress || 'Block no. 52B, Panchayat Nagar-3, Ram Park Main Road, University Rd, Rajkot, Gujarat - 360005.'}
                              </p>
                            </div>
                          </div>

                          {/* Direct Calling */}
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
                              <Phone size={20} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '3px' }}>Direct Calling</div>
                              <div style={{ color: 'var(--text-dark)', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ color: 'var(--primary-blue)' }}>{contactSettings.primaryPhone || '+91 99099 23130'}</span>
                                {contactSettings.secondaryPhone && (
                                  <>
                                    <span style={{ color: '#94a3b8', fontWeight: '400' }}>/</span>
                                    <span style={{ color: 'var(--primary-blue)' }}>{contactSettings.secondaryPhone}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Email Address */}
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
                              <Mail size={20} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '3px' }}>Email Address</div>
                              <div style={{ color: 'var(--primary-blue)', fontWeight: '600', fontSize: '0.9rem' }}>
                                {contactSettings.email || 'info@niyanshpharma.com'}
                              </div>
                            </div>
                          </div>

                          {/* Business Hours */}
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
                              <Clock size={20} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>Business Hours</div>
                              
                              {/* Hours + Monday-Saturday Badge */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <strong style={{ color: 'var(--text-dark)', fontSize: '0.92rem' }}>
                                  {contactSettings.workingHours || '9:00 AM – 9:00 PM'}
                                </strong>
                                <span style={{ fontSize: '0.78rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                                  ({contactSettings.workingDays || 'Monday – Saturday'})
                                </span>
                              </div>

                              {/* Next line: Sunday Holiday */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8rem', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: '14px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                                  {contactSettings.sundayStatus || 'Sunday: Holiday'}
                                </span>
                              </div>

                              {/* Lunch Break */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                                <strong>Lunch Break:</strong> {contactSettings.lunchBreak || '2:00 PM – 4:00 PM'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Map Preview */}
                      <div className="card" style={{ padding: '0', overflow: 'hidden', height: '220px', borderRadius: '12px' }}>
                        <iframe 
                          title="Hub Location Preview"
                          src={contactSettings.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.4650393043817!2d70.76194731589283!3d22.287219093721385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb33b44fc73f%3A0x3c79432bfa8b8b1d!2sNiyansh%20pharma!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen="" 
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 9: SUPERADMIN STAFF & ADMINS MANAGER
                  ========================================== */}
              {activeTab === 'manage-admins' && isSuperAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  
                  {/* HEADER */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '20px 24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1.5px solid #fde68a',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.08)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                          Super Admin Exclusive
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '10px' }}>
                          Live Access Control
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                        Admins & Staff Management
                      </h2>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                        Create sub-admins, manage login credentials, and assign custom granular permissions.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={fetchAdmins}
                        disabled={isAdminListLoading}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <RefreshCw size={14} className={isAdminListLoading ? 'animate-spin' : ''} /> Refresh
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAdminModal(null)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px', backgroundColor: '#f59e0b', borderColor: '#f59e0b', color: '#ffffff', fontWeight: '700', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' }}
                      >
                        <UserPlus size={15} /> Add New Admin
                      </button>
                    </div>
                  </div>

                  {/* KPI STATS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-medium)', textTransform: 'uppercase' }}>Total Admin Accounts</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{adminList.length}</div>
                    </div>

                    <div style={{ padding: '14px 16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Active Staff</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
                        {adminList.filter(a => a.isActive !== false).length}
                      </div>
                    </div>

                    <div style={{ padding: '14px 16px', backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#92400e', textTransform: 'uppercase' }}>Super Admins</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>
                        {adminList.filter(a => a.role === 'superadmin').length || 1}
                      </div>
                    </div>

                    <div style={{ padding: '14px 16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>Role Governance</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2563eb', marginTop: '4px' }}>
                        Active RBAC
                      </div>
                    </div>
                  </div>

                  {/* ADMINS TABLE & RESPONSIVE CARDS */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                  }}>
                    {/* DESKTOP TABLE (>= 768px) */}
                    <div className="hide-mobile" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                      <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <tr>
                            <th style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Admin Profile</th>
                            <th style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Login Email / Username</th>
                            <th style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Password</th>
                            <th style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Mobile No.</th>
                            <th style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Permissions</th>
                            <th style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Status</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-dark)' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminList.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-medium)' }}>
                                {isAdminListLoading ? 'Loading admin accounts...' : 'No additional sub-admins created yet. Click "+ Add New Admin" above to create one.'}
                              </td>
                            </tr>
                          ) : (
                            adminList.map((adm) => {
                              const isRootSuper = adm.role === 'superadmin' || adm.email === 'info@niyanshpharma.com';
                              const isPwRevealed = Boolean(showPasswordMap[adm._id]);
                              const p = adm.permissions || {};

                              return (
                                <tr key={adm._id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: adm.isActive === false ? '#f8fafc' : '#ffffff' }}>
                                  
                                  {/* Profile */}
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <img 
                                        src={adm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adm.name)}&background=${isRootSuper ? 'f59e0b' : '2563eb'}&color=ffffff&bold=true`}
                                        alt={adm.name}
                                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                      />
                                      <div>
                                        <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{adm.name}</div>
                                        {isRootSuper ? (
                                          <span style={{ fontSize: '0.68rem', fontWeight: '800', backgroundColor: '#fef3c7', color: '#b45309', padding: '1px 7px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            <ShieldCheck size={11} /> Root Super Admin
                                          </span>
                                        ) : (
                                          <span style={{ fontSize: '0.68rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '1px 7px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            <Shield size={10} /> Operations Admin
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Email */}
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--text-dark)' }}>
                                        {adm.email}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(adm.email);
                                          showToast('Email copied to clipboard!');
                                        }}
                                        title="Copy Email"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                                      >
                                        <Copy size={13} />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Password with View & Copy */}
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                                      <span style={{ fontFamily: 'monospace', fontWeight: '700', color: isPwRevealed ? '#0f172a' : '#64748b', minWidth: '80px' }}>
                                        {isPwRevealed ? (adm.plainPassword || '••••••••') : '••••••••'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setShowPasswordMap(prev => ({ ...prev, [adm._id]: !prev[adm._id] }))}
                                        title={isPwRevealed ? 'Hide Password' : 'Show Password'}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '2px' }}
                                      >
                                        {isPwRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                      </button>
                                      {adm.plainPassword && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(adm.plainPassword);
                                            showToast('Password copied to clipboard!');
                                          }}
                                          title="Copy Password"
                                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '2px' }}
                                        >
                                          <Copy size={13} />
                                        </button>
                                      )}
                                    </div>
                                  </td>

                                  {/* Mobile */}
                                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>
                                    {adm.phone ? (
                                      <a href={`tel:${adm.phone}`} style={{ color: '#0369a1', textDecoration: 'none', fontWeight: '600' }}>
                                        {adm.phone}
                                      </a>
                                    ) : '—'}
                                  </td>

                                  {/* Permissions Pill Badges (Professional Clean No Emojis) */}
                                  <td style={{ padding: '12px 16px' }}>
                                    {isRootSuper ? (
                                      <span style={{ fontSize: '0.74rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                        Full Access (All Permissions)
                                      </span>
                                    ) : (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '280px' }}>
                                        {p.canManageProducts && <span style={{ fontSize: '0.68rem', backgroundColor: '#eff6ff', color: '#1e40af', padding: '1px 6px', borderRadius: '4px' }}>Products</span>}
                                        {p.canDeleteProducts && <span style={{ fontSize: '0.68rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: '4px' }}>Delete Prod</span>}
                                        {p.canBulkImport && <span style={{ fontSize: '0.68rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '1px 6px', borderRadius: '4px' }}>Excel Import</span>}
                                        {p.canManageOrders && <span style={{ fontSize: '0.68rem', backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '1px 6px', borderRadius: '4px' }}>Orders</span>}
                                        {p.canManageLedgers && <span style={{ fontSize: '0.68rem', backgroundColor: '#fef9c3', color: '#854d0e', padding: '1px 6px', borderRadius: '4px' }}>Ledgers</span>}
                                        {p.canManageCompanies && <span style={{ fontSize: '0.68rem', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '1px 6px', borderRadius: '4px' }}>Companies</span>}
                                        {p.canManageNews && <span style={{ fontSize: '0.68rem', backgroundColor: '#ffedd5', color: '#9a3412', padding: '1px 6px', borderRadius: '4px' }}>News</span>}
                                        {p.canManageEnquiries && <span style={{ fontSize: '0.68rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: '4px' }}>Enquiries</span>}
                                        {p.canClearDatabase && <span style={{ fontSize: '0.68rem', backgroundColor: '#991b1b', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Wipe DB</span>}
                                      </div>
                                    )}
                                  </td>

                                  {/* Status */}
                                  <td style={{ padding: '12px 16px' }}>
                                    {adm.isActive !== false ? (
                                      <span style={{ fontSize: '0.72rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                                        Active
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '0.72rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                                        Inactive
                                      </span>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenAdminModal(adm)}
                                        title="Edit Admin Account"
                                        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', color: '#0f172a' }}
                                      >
                                        <Edit2 size={14} />
                                      </button>

                                      {!isRootSuper && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleToggleAdminStatus(adm)}
                                            title={adm.isActive !== false ? 'Deactivate Admin' : 'Activate Admin'}
                                            style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', color: adm.isActive !== false ? '#b45309' : '#15803d' }}
                                          >
                                            {adm.isActive !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleDeleteAdmin(adm)}
                                            title="Delete Admin Account"
                                            style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', cursor: 'pointer', color: '#ef4444' }}
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARD VIEW (< 768px): HARD RESPONSIVE */}
                    <div className="hide-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
                      {adminList.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-medium)', fontSize: '0.86rem' }}>
                          {isAdminListLoading ? 'Loading admin accounts...' : 'No sub-admins created yet.'}
                        </div>
                      ) : (
                        adminList.map((adm) => {
                          const isRootSuper = adm.role === 'superadmin' || adm.email === 'info@niyanshpharma.com';
                          const isPwRevealed = Boolean(showPasswordMap[adm._id]);
                          const p = adm.permissions || {};

                          return (
                            <div key={adm._id} style={{
                              backgroundColor: adm.isActive === false ? '#f8fafc' : '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                            }}>
                              {/* Card Header: Avatar, Name, Role & Status */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <img 
                                    src={adm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adm.name)}&background=${isRootSuper ? 'f59e0b' : '2563eb'}&color=ffffff&bold=true`}
                                    alt={adm.name}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-dark)' }}>{adm.name}</div>
                                    {isRootSuper ? (
                                      <span style={{ fontSize: '0.68rem', fontWeight: '800', backgroundColor: '#fef3c7', color: '#b45309', padding: '1px 7px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                        <ShieldCheck size={11} /> Root Super Admin
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '0.68rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '1px 7px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                        <Shield size={10} /> Operations Admin
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.72rem', backgroundColor: adm.isActive !== false ? '#dcfce7' : '#fee2e2', color: adm.isActive !== false ? '#15803d' : '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                                  {adm.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                              </div>

                              {/* Email & Mobile */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-medium)' }}>Email:</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{adm.email}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(adm.email);
                                        showToast('Email copied to clipboard!');
                                      }}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                                    >
                                      <Copy size={12} />
                                    </button>
                                  </div>
                                </div>

                                {adm.phone && (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-medium)' }}>Mobile:</span>
                                    <a href={`tel:${adm.phone}`} style={{ color: '#0369a1', fontWeight: '600', textDecoration: 'none' }}>
                                      {adm.phone}
                                    </a>
                                  </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-medium)' }}>Password:</span>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: isPwRevealed ? '#0f172a' : '#64748b' }}>
                                      {isPwRevealed ? (adm.plainPassword || '••••••••') : '••••••••'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setShowPasswordMap(prev => ({ ...prev, [adm._id]: !prev[adm._id] }))}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '2px' }}
                                    >
                                      {isPwRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                    </button>
                                    {adm.plainPassword && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(adm.plainPassword);
                                          showToast('Password copied to clipboard!');
                                        }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '2px' }}
                                      >
                                        <Copy size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Permissions Pills */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {isRootSuper ? (
                                  <span style={{ fontSize: '0.72rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                    Full Access (All Permissions)
                                  </span>
                                ) : (
                                  <>
                                    {p.canManageProducts && <span style={{ fontSize: '0.68rem', backgroundColor: '#eff6ff', color: '#1e40af', padding: '1px 6px', borderRadius: '4px' }}>Products</span>}
                                    {p.canDeleteProducts && <span style={{ fontSize: '0.68rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: '4px' }}>Delete Prod</span>}
                                    {p.canBulkImport && <span style={{ fontSize: '0.68rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '1px 6px', borderRadius: '4px' }}>Excel Import</span>}
                                    {p.canManageOrders && <span style={{ fontSize: '0.68rem', backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '1px 6px', borderRadius: '4px' }}>Orders</span>}
                                    {p.canManageLedgers && <span style={{ fontSize: '0.68rem', backgroundColor: '#fef9c3', color: '#854d0e', padding: '1px 6px', borderRadius: '4px' }}>Ledgers</span>}
                                    {p.canManageCompanies && <span style={{ fontSize: '0.68rem', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '1px 6px', borderRadius: '4px' }}>Companies</span>}
                                    {p.canManageNews && <span style={{ fontSize: '0.68rem', backgroundColor: '#ffedd5', color: '#9a3412', padding: '1px 6px', borderRadius: '4px' }}>News</span>}
                                    {p.canManageEnquiries && <span style={{ fontSize: '0.68rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: '4px' }}>Enquiries</span>}
                                    {p.canClearDatabase && <span style={{ fontSize: '0.68rem', backgroundColor: '#991b1b', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Wipe DB</span>}
                                  </>
                                )}
                              </div>

                              {/* Card Actions */}
                              <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenAdminModal(adm)}
                                  className="btn btn-outline btn-sm"
                                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', gap: '6px' }}
                                >
                                  <Edit2 size={13} /> Edit Account
                                </button>
                                {!isRootSuper && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminStatus(adm)}
                                      className="btn btn-outline btn-sm"
                                      style={{ padding: '6px 10px', color: adm.isActive !== false ? '#b45309' : '#15803d' }}
                                      title={adm.isActive !== false ? 'Deactivate' : 'Activate'}
                                    >
                                      {adm.isActive !== false ? <UserX size={13} /> : <UserCheck size={13} />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAdmin(adm)}
                                      className="btn btn-sm"
                                      style={{ padding: '6px 10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none' }}
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
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
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>Mobile: {selectedOrder.retailerMobile}</div>
                {selectedOrder.retailerEmail && <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Email: {selectedOrder.retailerEmail}</div>}
                {selectedOrder.gstin && <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>GSTIN: {selectedOrder.gstin}</div>}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Order Date: <strong>{formatDate(selectedOrder.createdAt)}</strong></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  Status: <strong>{selectedOrder.orderStatus || 'Booked'}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  Payment: <strong>{selectedOrder.paymentStatus || 'Pending'}</strong>
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
                <label htmlFor="pay-amount" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  Amount Received (₹) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                </label>
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
                  <label htmlFor="pay-method" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Payment Method <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                  </label>
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
                  <label htmlFor="pay-date" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Payment Date <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                  </label>
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
                <label htmlFor="news-title" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  Announcement Title <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                </label>
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
                  <label htmlFor="news-cat" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Category <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                  </label>
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
                  <label htmlFor="news-comp" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Company <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                  </label>
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
                  <label htmlFor="news-pri" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Priority Level <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                  </label>
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
                <label htmlFor="news-cont" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  Announcement Details & Scheme Terms <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                </label>
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
          MODAL 5: ADD / EDIT PRODUCT MODAL (UPGRADED ENTERPRISE 2-COLUMN WORKSPACE)
          ========================================== */}
      {isProductModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="admin-modal-overlay">
          <div className="card admin-modal-workspace" role="dialog" aria-modal="true">
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', minWidth: 0 }}>
              
              {/* STICKY HEADER */}
              <div className="admin-workspace-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: 0, fontWeight: '700' }}>
                      {editingProduct ? 'Edit Product Details & Photos' : 'Add New Product to Catalog'}
                    </h2>
                    <span style={{ 
                      fontSize: '0.78rem', 
                      backgroundColor: editingProduct ? '#eff6ff' : '#ecfdf5', 
                      color: editingProduct ? '#2563eb' : '#059669', 
                      padding: '3px 10px', 
                      borderRadius: '14px', 
                      fontWeight: '700' 
                    }}>
                      {editingProduct ? (prodSku || 'Editing SKU') : 'New SKU'}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--text-medium)' }}>
                    Upload photos, configure wholesale PTR & MRP pricing, track stock inventory and active molecules
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsProductModalOpen(false)} 
                  style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }} 
                  aria-label="Close"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* 2-COLUMN RESPONSIVE BODY */}
              <div className="admin-workspace-body">
                
                {/* ================= LEFT COLUMN: MEDIA & STATUS (FIXED) ================= */}
                <div className="admin-workspace-left" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  
                  {/* Photo Upload & Gallery Card */}
                  <div className="admin-workspace-panel" style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ImageIcon size={18} color="var(--primary-blue)" /> Product Photos ({prodImages.length}/5)
                      </label>
                      <span style={{ fontSize: '0.74rem', color: prodImages.length >= 5 ? '#d97706' : 'var(--text-medium)', fontWeight: prodImages.length >= 5 ? '700' : '400' }}>
                        {prodImages.length >= 5 ? '★ Max 5 Attached' : '★ First photo is Primary'}
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
                        backgroundColor: photoDragActive ? '#eff6ff' : '#ffffff',
                        borderRadius: '10px',
                        padding: '16px 14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '12px',
                        boxSizing: 'border-box',
                        width: '100%'
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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <div className="spinner" style={{ width: '22px', height: '22px' }}></div>
                          <span style={{ fontSize: '0.84rem', color: 'var(--primary-blue)', fontWeight: '600' }}>Uploading photos...</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                          <Upload size={22} color="var(--primary-blue)" />
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                            Click to upload or drag & drop photos
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-light)' }}>
                            JPG, PNG, WebP up to 10MB each (Batch uploads supported)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Auto-Fetch Medicine Photos Button (In-Modal, Zero Manual Work!) */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}>
                      <button
                        type="button"
                        onClick={handleAutoFetchImages}
                        disabled={isSearchingWebImages}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '9px 10px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                          transition: 'background-color 0.2s ease',
                          boxSizing: 'border-box',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
                        title="Auto-search and pick medicine photos right inside this modal"
                      >
                        {isSearchingWebImages ? (
                          <>
                            <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#fff' }}></div>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Sparkles size={15} /> Auto-Find Photos
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSearchGoogleImages}
                        style={{
                          flexShrink: 0,
                          padding: '9px 11px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '0.80rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          boxSizing: 'border-box',
                          whiteSpace: 'nowrap'
                        }}
                        title="Open Google Images in browser tab as backup"
                      >
                        <Search size={13} /> Google Tab
                      </button>
                    </div>

                    {/* Instant In-Modal Photo Picker Grid (Click any photo to attach instantly) */}
                    {webImageResults.length > 0 && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '10px',
                        border: '1.5px solid #bfdbfe',
                        marginBottom: '12px',
                        boxSizing: 'border-box',
                        width: '100%'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e40af' }}>
                            Found {webImageResults.length} photos! Click one to attach:
                          </span>
                          <button
                            type="button"
                            onClick={() => setWebImageResults([])}
                            style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                          >
                            ✕ Close
                          </button>
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '8px',
                          maxHeight: '190px',
                          overflowY: 'auto',
                          paddingRight: '2px',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}>
                          {webImageResults.map((img, idx) => {
                            const isSelected = prodImageUrl === img || prodImages.includes(img);
                            return (
                              <div
                                key={idx}
                                style={{
                                  height: '80px',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  boxShadow: isSelected ? '0 0 0 2px rgba(37,99,235,0.25)' : 'none',
                                  transition: 'transform 0.15s ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                title="Click to attach photo (or click eye to preview full size)"
                              >
                                <img
                                  src={img}
                                  alt={`Result ${idx + 1}`}
                                  onClick={() => handleSelectWebImage(img)}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }}
                                  style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    backgroundColor: 'rgba(0,0,0,0.65)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '2px 5px',
                                    fontSize: '0.65rem',
                                    cursor: 'pointer',
                                    zIndex: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Preview in full size"
                                >
                                  <Eye size={12} />
                                </button>
                                {isSelected && (
                                  <span style={{ position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>
                                    ✓ Added
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Or enter photo URL */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}>
                      <input 
                        type="url"
                        placeholder="Or enter image URL (https://...)"
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        style={{ 
                          flex: 1, 
                          minWidth: 0, 
                          width: '100%', 
                          boxSizing: 'border-box', 
                          padding: '8px 10px', 
                          border: '1px solid #cbd5e1', 
                          borderRadius: '7px', 
                          fontSize: '0.82rem' 
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={handleAddImageUrl}
                        className="btn btn-outline btn-sm"
                        style={{ 
                          flexShrink: 0, 
                          whiteSpace: 'nowrap', 
                          padding: '8px 12px', 
                          fontSize: '0.82rem', 
                          fontWeight: '600',
                          boxSizing: 'border-box' 
                        }}
                      >
                        + Add URL
                      </button>
                    </div>

                    {/* Photo Gallery Grid */}
                    {prodImages.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '160px', overflowY: 'auto', paddingRight: '2px' }}>
                        {prodImages.map((img, idx) => {
                          const isMain = idx === 0 || img === prodImageUrl;
                          return (
                            <div 
                              key={idx}
                              style={{
                                position: 'relative',
                                height: '80px',
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
                                onClick={() => setPreviewImage(img)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} 
                                title="Click to view full photo preview"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80'; }}
                              />

                              {/* Main Badge */}
                              {isMain && (
                                <span style={{ position: 'absolute', top: '3px', left: '3px', backgroundColor: '#f59e0b', color: '#fff', fontSize: '0.64rem', fontWeight: '800', padding: '1px 5px', borderRadius: '3px' }}>
                                  ★ Main
                                </span>
                              )}

                              {/* Thumbnail Controls */}
                              <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                backgroundColor: 'rgba(0,0,0,0.78)', padding: '2px 4px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                              }}>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewImage(img)}
                                    style={{ background: 'none', border: 'none', color: '#93c5fd', fontSize: '0.68rem', cursor: 'pointer', padding: '1px 2px', fontWeight: '700', display: 'inline-flex', alignItems: 'center' }}
                                    title="View full preview"
                                  >
                                    <Eye size={11} style={{ marginRight: '3px' }} /> View
                                  </button>
                                  {!isMain && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainPhoto(img)}
                                      style={{ background: 'none', border: 'none', color: '#fef08a', fontSize: '0.66rem', cursor: 'pointer', padding: '1px' }}
                                      title="Set as primary photo"
                                    >
                                      Main
                                    </button>
                                  )}
                                </div>
                                <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
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

                  {/* Publishing Flags & Status */}
                  <div className="admin-workspace-panel" style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Publishing & Visibility
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: prodInStock ? '#10b981' : '#94a3b8', flexShrink: 0 }}></span>
                        Publish as &ldquo;In Stock&rdquo;
                      </span>
                      <input 
                        type="checkbox"
                        checked={prodInStock}
                        onChange={(e) => setProdInStock(e.target.checked)}
                        style={{ accentColor: '#10b981', width: '18px', height: '18px', flexShrink: 0 }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: prodFeatured ? '#f59e0b' : '#94a3b8', flexShrink: 0 }}></span>
                        Featured Showcase
                      </span>
                      <input 
                        type="checkbox"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                        style={{ accentColor: '#f59e0b', width: '18px', height: '18px', flexShrink: 0 }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: prodIsOurProduct ? '#059669' : '#94a3b8', flexShrink: 0 }}></span>
                        Our Product (અમારી પ્રોડક્ટ - Exclusive Page)
                      </span>
                      <input 
                        type="checkbox"
                        checked={prodIsOurProduct}
                        onChange={(e) => setProdIsOurProduct(e.target.checked)}
                        style={{ accentColor: '#059669', width: '18px', height: '18px', flexShrink: 0 }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: prodIsActive ? '#2563eb' : '#94a3b8', flexShrink: 0 }}></span>
                        Live on Public Website
                      </span>
                      <input 
                        type="checkbox"
                        checked={prodIsActive}
                        onChange={(e) => setProdIsActive(e.target.checked)}
                        style={{ accentColor: '#2563eb', width: '18px', height: '18px', flexShrink: 0 }}
                      />
                    </label>
                  </div>

                  {/* Commercial Margin Calculation Card */}
                  {prodPrice && prodMrp && parseFloat(prodMrp) > 0 && (
                    <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>Chemist Profit Margin</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#16a34a' }}>
                          {parseFloat(prodMrp) > parseFloat(prodPrice)
                            ? `${Math.round(((parseFloat(prodMrp) - parseFloat(prodPrice)) / parseFloat(prodMrp)) * 100)}% Profit`
                            : '0% Margin'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                        <div>Wholesale: ₹{parseFloat(prodPrice).toFixed(2)}</div>
                        <div>MRP: ₹{parseFloat(prodMrp).toFixed(2)}</div>
                      </div>
                    </div>
                  )}

                </div>

                {/* ================= RIGHT COLUMN: PRODUCT FORM DETAILS (SCROLLABLE) ================= */}
                <div className="admin-workspace-right" style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  
                  {/* Row 1: Product Name / Brand Name & SKU */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-name" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Product Name / Brand Name <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-name"
                        type="text" required placeholder="E.g., Paracetamol Tablet IP 500mg, Dolo 650, etc." 
                        value={prodName} onChange={(e) => setProdName(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="modal-sku" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                          SKU / ID <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => setProdSku(`NP-${Date.now().toString().slice(-6)}`)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '700' }}
                        >
                          Generate
                        </button>
                      </div>
                      <input 
                        id="modal-sku"
                        type="text" required placeholder="Click Generate or enter SKU" 
                        value={prodSku} onChange={(e) => setProdSku(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', fontFamily: 'monospace', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Manufacturer / Company (Direct Input / Datalist) & Category */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="modal-comp" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                          Manufacturer / Company <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                        </label>
                        <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>Type new or pick</span>
                      </div>
                      <input 
                        id="modal-comp"
                        type="text"
                        list="modal-company-suggestions"
                        required
                        placeholder="Type or select company name..."
                        value={prodCompany} 
                        onChange={(e) => {
                          setProdCompany(e.target.value);
                          setProdManufacturer(e.target.value);
                        }}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                      />
                      <datalist id="modal-company-suggestions">
                        <option value="Daxia Healthcare" />
                        {companies.map(c => (
                          <option key={c._id || c.name} value={c.name}>{c.name}</option>
                        ))}
                      </datalist>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-cat" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Category <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <select 
                        id="modal-cat"
                        required
                        value={prodCategory} 
                        onChange={(e) => setProdCategory(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
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
                          required
                          placeholder="Enter custom category name..."
                          value={prodCustomCategory}
                          onChange={(e) => setProdCustomCategory(e.target.value)}
                          style={{ marginTop: '4px', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 3: Chemical Composition & Formulation Form */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-composition" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Chemical / Active Composition <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-composition"
                        type="text" required placeholder="E.g., Paracetamol IP 500mg, Amoxicillin 250mg" 
                        value={prodComposition} onChange={(e) => setProdComposition(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-form" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Formulation Form <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <select 
                        id="modal-form"
                        required
                        value={prodForm} onChange={(e) => setProdForm(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
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
                  </div>

                  {/* Row 4: Commercial Matrix (Wholesale, MRP, Stock Units) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }} className="admin-workspace-panel">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                      <label htmlFor="modal-price" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                        Wholesale (₹) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-price"
                        type="number" step="0.01" required placeholder="E.g., 28.50" 
                        value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                        style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.95rem', fontWeight: '700', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                      <label htmlFor="modal-mrp" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                        MRP (₹) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-mrp"
                        type="number" step="0.01" required placeholder="E.g., 45.00" 
                        value={prodMrp} onChange={(e) => setProdMrp(e.target.value)}
                        style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                      <label htmlFor="modal-stockqty" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                        Stock Units <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-stockqty"
                        type="number" required placeholder="E.g., 100" 
                        value={prodStockQuantity} onChange={(e) => setProdStockQuantity(e.target.value)}
                        style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Row 5: Packing Specifications & Subcategory / Variant */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-packing" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Packing Specifications <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-packing"
                        type="text" required placeholder="E.g., 10 × 10 Tablets" 
                        value={prodPacking} onChange={(e) => setProdPacking(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-subcat" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Subcategory / Variant <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-subcat"
                        type="text" required placeholder="E.g., Effervescent, Pain Relief, Pediatric" 
                        value={prodSubCategory} onChange={(e) => setProdSubCategory(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Row 6: Manufacturer Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', boxSizing: 'border-box' }}>
                    <label htmlFor="modal-mfg" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                      Manufacturer Details <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                    </label>
                    <input 
                      id="modal-mfg"
                      type="text" required placeholder="E.g., Daxia Healthcare Pvt. Ltd." 
                      value={prodManufacturer} onChange={(e) => setProdManufacturer(e.target.value)}
                      style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Row 7: Pharma Logistics - Batch Number, Rack ID, HSN Code, Expiry Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-batch" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Batch Number <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-batch"
                        type="text" required placeholder="E.g., B-9482, NB-102" 
                        value={prodBatchNumber} onChange={(e) => setProdBatchNumber(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-rackid" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Rack ID / Location <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-rackid"
                        type="text" required placeholder="E.g., R-04, Shelf-B" 
                        value={prodRackId} onChange={(e) => setProdRackId(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-hsn" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        HSN Code <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-hsn"
                        type="text" required placeholder="E.g., 3004" 
                        value={prodHsnCode} onChange={(e) => setProdHsnCode(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-expiry" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Expiry Date <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <input 
                        id="modal-expiry"
                        type="text" required placeholder="E.g., 12/2027 or MM/YYYY" 
                        value={prodExpiryDate} onChange={(e) => setProdExpiryDate(e.target.value)}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Row 8: GST Rates (Purchase & Sales) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-purgst" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Purchase GST Rate (%) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <select 
                        id="modal-purgst"
                        required
                        value={prodPurchaseGst} 
                        onChange={(e) => setProdPurchaseGst(Number(e.target.value))}
                        style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#ffffff', width: '100%', boxSizing: 'border-box' }}
                      >
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST (Medicines)</option>
                        <option value={18}>18% GST</option>
                        <option value={28}>28% GST</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                      <label htmlFor="modal-salesgst" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                        Sales GST Rate (%) <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                      </label>
                      <select 
                        id="modal-salesgst"
                        required
                        value={prodSalesGst} 
                        onChange={(e) => setProdSalesGst(Number(e.target.value))}
                        style={{ padding: '9px 13px', border: '1px solid #86efac', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#ffffff', fontWeight: '600', width: '100%', boxSizing: 'border-box' }}
                      >
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST (Standard Medicines)</option>
                        <option value={18}>18% GST</option>
                        <option value={28}>28% GST</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 9: Dynamic Custom Fields Section */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Custom Parameters ({customFieldDefs.length})</span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => setIsCustomFieldModalOpen(true)}
                        style={{ backgroundColor: '#eff6ff', color: 'var(--primary-blue)', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '5px 12px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Plus size={14} /> Add Custom Field
                      </button>
                    </div>

                    {customFieldDefs.length === 0 ? (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                        Need extra fields (Batch No, Schedule Drug, Storage Temp)? Click <strong>"Add Custom Field"</strong> above to create fields that will automatically save to all products.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                        {customFieldDefs.map(def => (
                          <div key={def.fieldKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: 0, boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                                {def.fieldName} {def.isRequired && <span style={{ color: '#ef4444' }}>*</span>}
                              </label>
                              <button 
                                type="button"
                                onClick={() => handleDeleteCustomFieldDef(def.fieldKey)}
                                title="Remove this field definition"
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <input 
                              type={def.fieldType === 'number' ? 'number' : def.fieldType === 'date' ? 'date' : 'text'}
                              placeholder={def.placeholder || `Enter ${def.fieldName}...`}
                              required={def.isRequired}
                              value={prodCustomValues[def.fieldKey] !== undefined ? prodCustomValues[def.fieldKey] : ''}
                              onChange={(e) => setProdCustomValues(prev => ({ ...prev, [def.fieldKey]: e.target.value }))}
                              style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 10: Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', boxSizing: 'border-box' }}>
                    <label htmlFor="modal-desc" style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                      Product Description & Indications <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 'normal' }}>(Optional)</span>
                    </label>
                    <textarea 
                      id="modal-desc"
                      rows="3" placeholder="Provide product indication, therapeutic dosage, age advisory or usage..." 
                      value={prodDescription} onChange={(e) => setProdDescription(e.target.value)}
                      style={{ padding: '9px 13px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                </div>
              </div>

              {/* DOCKED STICKY FOOTER ACTIONS (ALWAYS VISIBLE AT BOTTOM) */}
              <div className="admin-workspace-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                    {prodName ? <strong style={{ color: 'var(--text-dark)' }}>{prodName}</strong> : 'New Product Formulation'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>•</span>
                  <span style={{ fontSize: '0.82rem', color: prodInStock ? '#16a34a' : '#dc2626', fontWeight: '700' }}>
                    {prodInStock ? '✓ In Stock' : '✕ Out of Stock'}
                  </span>
                  {prodPrice && (
                    <>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>•</span>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-dark)', fontWeight: '700' }}>
                        PTR: ₹{parseFloat(prodPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsProductModalOpen(false)} 
                    className="btn btn-outline btn-sm"
                    style={{ padding: '9px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSavingProduct} 
                    className="btn btn-primary btn-sm" 
                    style={{ padding: '9px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '0.92rem', gap: '6px' }}
                  >
                    {isSavingProduct ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff' }}></div>
                        Saving Product...
                      </>
                    ) : (
                      editingProduct ? 'Save Product Changes' : 'Create & Publish Product'
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==========================================
          MODAL 7: BULK EXCEL & CSV IMPORT MODAL (WITH LIVE PREVIEW & DUPLICATION PREVENTER)
          ========================================== */}
      {isBulkImportOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.78)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100010,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '16px', boxSizing: 'border-box'
        }}>
          <div className="card" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '1240px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.5)',
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }} role="dialog" aria-modal="true">

            {/* MODAL HEADER */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: '700' }}>
                    Bulk Import Products via Excel / CSV
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                    Upload spreadsheet, inspect live table preview, verify duplication checks, and import all products in 1 click.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsBulkImportOpen(false);
                  setBulkParsedRows([]);
                  setUploadedFileName('');
                }} 
                style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                aria-label="Close"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* MODAL BODY (SCROLLABLE & RESPONSIVE) */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
              
              {/* TOP ACTION BAR: UPLOAD BUTTON & DOWNLOAD TEMPLATE BUTTON */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '14px 18px', backgroundColor: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input 
                    type="file" 
                    ref={excelFileInputRef}
                    accept=".xlsx, .xls, .csv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style={{ display: 'none' }}
                    onChange={handleBulkFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => excelFileInputRef.current?.click()}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px', padding: '9px 16px', fontWeight: '700' }}
                  >
                    <Upload size={16} /> {uploadedFileName ? 'Change Excel / CSV File' : 'Select Excel (.xlsx) or CSV File'}
                  </button>

                  {uploadedFileName && (
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      {uploadedFileName} ({bulkParsedRows.length} rows detected)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDownloadExcelTemplate}
                  className="btn btn-sm"
                  style={{
                    gap: '6px',
                    padding: '9px 16px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                  }}
                  title="Download ready sample Excel spreadsheet with all columns and registered companies"
                >
                  <Download size={15} /> Download Sample Excel Template
                </button>
              </div>

              {/* STATE 1: NO FILE UPLOADED YET (DRAG & DROP ZONE & INSTRUCTIONS) */}
              {bulkParsedRows.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    onClick={() => excelFileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #94a3b8',
                      borderRadius: '14px',
                      padding: '40px 20px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <FileSpreadsheet size={30} />
                    </div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: 'var(--text-dark)', fontWeight: '700' }}>
                      Click or Drag & Drop Excel (.xlsx, .xls) or CSV file here
                    </h4>
                    <p style={{ margin: '0 0 14px', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                      Supports all pharma formulation columns. Images can be left empty and added later.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDownloadExcelTemplate(); }}
                      style={{ fontSize: '0.84rem', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}
                    >
                      Don&apos;t have a format? Click here to download the ready Excel Template (.xlsx)
                    </button>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
                      Supported Spreadsheet Columns (All auto-mapped):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', color: 'var(--text-medium)', fontSize: '0.82rem' }}>
                      <div>• <strong>Product Name / Brand Name *</strong></div>
                      <div>• <strong>SKU / ID</strong> (Auto-generated if blank)</div>
                      <div>• <strong>Manufacturer / Company *</strong></div>
                      <div>• <strong>Category *</strong></div>
                      <div>• <strong>Chemical / Active Composition *</strong></div>
                      <div>• <strong>Formulation Form *</strong></div>
                      <div>• <strong>Wholesale Price (₹) *</strong></div>
                      <div>• <strong>MRP (₹) *</strong></div>
                      <div>• <strong>Stock Units *</strong></div>
                      <div>• <strong>Packing Specifications *</strong></div>
                      <div>• <strong>Subcategory / Variant *</strong></div>
                      <div>• <strong>Manufacturer Details *</strong></div>
                      <div>• <strong>Rack ID / Location *</strong></div>
                      <div>• <strong>HSN Code *</strong></div>
                      <div>• <strong>Expiry Date *</strong></div>
                      <div>• <strong>Purchase & Sales GST (%) *</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: FILE PARSED -> INTERACTIVE RESPONSIVE PREVIEW TABLE WITH DUPLICATION PREVENTER */}
              {bulkParsedRows.length > 0 && (() => {
                const totalCount = bulkParsedRows.length;
                const duplicateCount = bulkParsedRows.filter(r => r.isDuplicate).length;
                const errorCount = bulkParsedRows.filter(r => r.hasError).length;
                const validCount = bulkParsedRows.filter(r => !r.isDuplicate && !r.hasError).length;
                const selectedCount = bulkParsedRows.filter(r => r.selected && !r.hasError && (!bulkSkipDuplicates || !r.isDuplicate)).length;

                const displayedRows = bulkParsedRows.filter(r => {
                  if (bulkPreviewFilter === 'valid') return !r.isDuplicate && !r.hasError;
                  if (bulkPreviewFilter === 'duplicates') return r.isDuplicate;
                  if (bulkPreviewFilter === 'errors') return r.hasError;
                  return true;
                });

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, minHeight: 0 }}>
                    
                    {/* STATS SUMMARY BAR */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                      <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)', fontWeight: '700', textTransform: 'uppercase' }}>Total In File</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{totalCount}</div>
                      </div>

                      <div style={{ padding: '12px 14px', backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Ready to Import</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>{validCount}</div>
                      </div>

                      <div style={{ padding: '12px 14px', backgroundColor: duplicateCount > 0 ? '#fffbeb' : '#f8fafc', borderRadius: '10px', border: `1px solid ${duplicateCount > 0 ? '#fde68a' : '#e2e8f0'}` }}>
                        <div style={{ fontSize: '0.72rem', color: duplicateCount > 0 ? '#b45309' : 'var(--text-medium)', fontWeight: '700', textTransform: 'uppercase' }}>Duplicates Flagged</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: duplicateCount > 0 ? '#d97706' : 'var(--text-dark)' }}>{duplicateCount}</div>
                      </div>

                      <div style={{ padding: '12px 14px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                        <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: '700', textTransform: 'uppercase' }}>Selected for Import</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb' }}>{selectedCount}</div>
                      </div>
                    </div>

                    {/* CONTROLS BAR: FILTER TABS & DUPLICATION CHECKBOX */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button 
                          type="button" 
                          onClick={() => setBulkPreviewFilter('all')}
                          style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: bulkPreviewFilter === 'all' ? '#2563eb' : '#e2e8f0', color: bulkPreviewFilter === 'all' ? '#fff' : '#475569' }}
                        >
                          All Rows ({totalCount})
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setBulkPreviewFilter('valid')}
                          style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: bulkPreviewFilter === 'valid' ? '#059669' : '#e2e8f0', color: bulkPreviewFilter === 'valid' ? '#fff' : '#475569' }}
                        >
                          Ready ({validCount})
                        </button>
                        {duplicateCount > 0 && (
                          <button 
                            type="button" 
                            onClick={() => setBulkPreviewFilter('duplicates')}
                            style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: bulkPreviewFilter === 'duplicates' ? '#d97706' : '#e2e8f0', color: bulkPreviewFilter === 'duplicates' ? '#fff' : '#475569' }}
                          >
                            Duplicates ({duplicateCount})
                          </button>
                        )}
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '700', color: '#1e293b' }}>
                        <input 
                          type="checkbox" 
                          checked={bulkSkipDuplicates}
                          onChange={(e) => setBulkSkipDuplicates(e.target.checked)}
                          style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                        />
                        <span>Automatically skip duplicates (prevent duplicates from being added)</span>
                      </label>
                    </div>

                    {/* RESPONSIVE SCROLLABLE DATA PREVIEW TABLE */}
                    <div style={{
                      maxHeight: '380px',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 5, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                          <tr>
                            <th style={{ padding: '10px 12px', width: '38px', textAlign: 'center' }}>
                              <input 
                                type="checkbox"
                                checked={selectedCount > 0 && selectedCount === validCount}
                                onChange={(e) => handleToggleSelectAll(e.target.checked)}
                                style={{ accentColor: '#2563eb', width: '15px', height: '15px', cursor: 'pointer' }}
                                title="Select / Deselect all valid rows"
                              />
                            </th>
                            <th style={{ padding: '10px 12px', width: '70px' }}>Row</th>
                            <th style={{ padding: '10px 12px', minWidth: '130px' }}>Status</th>
                            <th style={{ padding: '10px 12px', minWidth: '190px' }}>Product Name / Brand</th>
                            <th style={{ padding: '10px 12px', minWidth: '110px' }}>SKU / ID</th>
                            <th style={{ padding: '10px 12px', minWidth: '140px' }}>Company</th>
                            <th style={{ padding: '10px 12px', minWidth: '170px' }}>Composition</th>
                            <th style={{ padding: '10px 12px', minWidth: '130px' }}>Packing & Form</th>
                            <th style={{ padding: '10px 12px', minWidth: '95px' }}>Wholesale</th>
                            <th style={{ padding: '10px 12px', minWidth: '85px' }}>MRP</th>
                            <th style={{ padding: '10px 12px', minWidth: '70px' }}>Stock</th>
                            <th style={{ padding: '10px 12px', minWidth: '80px' }}>GST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedRows.length === 0 ? (
                            <tr>
                              <td colSpan="12" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-medium)' }}>
                                No products found matching this filter.
                              </td>
                            </tr>
                          ) : (
                            displayedRows.map((r) => {
                              const isRowDuplicate = r.isDuplicate;
                              const isRowError = r.hasError;
                              const rowBg = isRowError ? '#fef2f2' : isRowDuplicate ? '#fffbeb' : (r.selected ? '#ffffff' : '#f8fafc');

                              return (
                                <tr 
                                  key={r._rowId} 
                                  style={{ 
                                    backgroundColor: rowBg, 
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                >
                                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                    <input 
                                      type="checkbox"
                                      checked={r.selected && (!bulkSkipDuplicates || !isRowDuplicate) && !isRowError}
                                      disabled={isRowError || (bulkSkipDuplicates && isRowDuplicate)}
                                      onChange={() => handleToggleRowSelection(r._rowId)}
                                      style={{ accentColor: '#2563eb', cursor: (isRowError || (bulkSkipDuplicates && isRowDuplicate)) ? 'not-allowed' : 'pointer' }}
                                    />
                                  </td>
                                  <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: '600' }}>
                                    #{r._rowId}
                                  </td>
                                  <td style={{ padding: '8px 12px' }}>
                                    {isRowError ? (
                                      <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                        ✕ {r.errorMessage}
                                      </span>
                                    ) : isRowDuplicate ? (
                                      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '700', whiteSpace: 'nowrap' }} title={r.duplicateReason}>
                                        Duplicate: {r.duplicateReason}
                                      </span>
                                    ) : (
                                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                        ✓ Ready
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: '8px 12px', fontWeight: '700', color: 'var(--text-dark)' }}>
                                    {r.name || <span style={{ color: '#ef4444' }}>[Missing Name]</span>}
                                  </td>
                                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#334155' }}>
                                    {r.sku}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: '#1d4ed8', fontWeight: '600' }}>
                                    {r.company}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: 'var(--text-medium)' }}>
                                    {r.composition || '—'}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: 'var(--text-medium)' }}>
                                    {r.form} • {r.packing}
                                  </td>
                                  <td style={{ padding: '8px 12px', fontWeight: '700', color: '#16a34a' }}>
                                    ₹{r.price.toFixed(2)}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: 'var(--text-dark)' }}>
                                    ₹{r.mrp.toFixed(2)}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: 'var(--text-dark)' }}>
                                    {r.stockQuantity}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: 'var(--text-medium)' }}>
                                    {r.salesGst}%
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>
                );
              })()}

              {/* SUCCESS RESULTS SUMMARY IF AVAILABLE */}
              {bulkImportResults && (
                <div style={{ padding: '14px 18px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', fontSize: '0.88rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} color="#059669" />
                  <div>
                    <strong>Import Successful:</strong> Added <strong>{bulkImportResults.successCount}</strong> products to catalog. {bulkImportResults.skippedCount > 0 && `(${bulkImportResults.skippedCount} duplicates skipped)`}
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div style={{
              padding: '14px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              flexShrink: 0
            }}>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-medium)', fontWeight: '600' }}>
                {bulkParsedRows.length > 0 ? (
                  <span>
                    Selected <strong style={{ color: '#2563eb' }}>
                      {bulkParsedRows.filter(r => r.selected && !r.hasError && (!bulkSkipDuplicates || !r.isDuplicate)).length}
                    </strong> of {bulkParsedRows.length} products
                  </span>
                ) : (
                  <span>Ready to parse Excel or CSV spreadsheet</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkImportOpen(false);
                    setBulkParsedRows([]);
                    setUploadedFileName('');
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '8px 16px', fontWeight: '600' }}
                >
                  Cancel / Close
                </button>

                {bulkParsedRows.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExecuteBulkImport}
                    disabled={isImportingBulk || bulkParsedRows.filter(r => r.selected && !r.hasError && (!bulkSkipDuplicates || !r.isDuplicate)).length === 0}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 22px', fontWeight: '700', gap: '6px' }}
                  >
                    {isImportingBulk ? (
                      <>
                        <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#fff' }}></div>
                        Importing Products...
                      </>
                    ) : (
                      `✓ Confirm & Import (${bulkParsedRows.filter(r => r.selected && !r.hasError && (!bulkSkipDuplicates || !r.isDuplicate)).length}) Products`
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
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
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  Company Name <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                </label>
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

      {/* MODAL: ADD CUSTOM FIELD DEFINITION (STACKED ON TOP OF PRODUCT MODAL VIA PORTAL) */}
      {isCustomFieldModalOpen && typeof document !== 'undefined' && createPortal(
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100005, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '24px', borderRadius: '16px', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)', border: '1px solid var(--border-light)' }} role="dialog" aria-modal="true">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: '700' }}>Create New Custom Field</h3>
              <button type="button" onClick={() => setIsCustomFieldModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-medium)', padding: '4px' }} aria-label="Close custom field modal"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveCustomFieldDef} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Field Name / Label <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="E.g., Batch Number, Storage Temp, Schedule Drug..." 
                  value={newCustomFieldName} 
                  onChange={(e) => setNewCustomFieldName(e.target.value)} 
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Field Type</label>
                  <select 
                    value={newCustomFieldType} 
                    onChange={(e) => setNewCustomFieldType(e.target.value)} 
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="text">Text (Short Input)</option>
                    <option value="number">Number (Numeric)</option>
                    <option value="date">Date (Picker)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Is Required?</label>
                  <select 
                    value={newCustomFieldRequired ? 'yes' : 'no'} 
                    onChange={(e) => setNewCustomFieldRequired(e.target.value === 'yes')} 
                    style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="no">Optional (No)</option>
                    <option value="yes">Required (Yes *)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Placeholder Hint (Optional)</label>
                <input 
                  type="text" 
                  placeholder="E.g., Enter batch code..." 
                  value={newCustomFieldPlaceholder} 
                  onChange={(e) => setNewCustomFieldPlaceholder(e.target.value)} 
                  style={{ padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCustomFieldModalOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Create Field</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRMATION MODAL BEFORE CREATING / UPDATING PRODUCT */}
      {showSaveConfirm && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100015,
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <div className="card" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.5)',
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }} role="dialog" aria-modal="true">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', flexShrink: 0 }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: '700' }}>
                  {editingProduct ? 'Confirm Product Update' : 'Confirm New Product Creation'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                  તમે ભરેલી વિગતો બરાબર ચકાસી લીધી છે?
                </p>
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Product / Brand:</span>
                  <strong style={{ color: 'var(--text-dark)', textAlign: 'right' }}>{prodName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>SKU / ID:</span>
                  <span style={{ color: 'var(--text-dark)', fontFamily: 'monospace', textAlign: 'right' }}>{prodSku}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Company:</span>
                  <strong style={{ color: 'var(--primary-blue)', textAlign: 'right' }}>{prodCompany || 'Daxia Healthcare'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Category:</span>
                  <span style={{ color: 'var(--text-dark)', textAlign: 'right' }}>{prodCategory === 'Custom' ? prodCustomCategory : prodCategory}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Contains:</span>
                  <span style={{ color: 'var(--text-dark)', textAlign: 'right' }}>{prodComposition}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Batch No:</span>
                  <span style={{ color: 'var(--text-dark)', fontFamily: 'monospace', fontWeight: '700', textAlign: 'right' }}>{prodBatchNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Form & Packing:</span>
                  <span style={{ color: 'var(--text-dark)', textAlign: 'right' }}>{prodForm} • {prodPacking}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Subcategory / Variant:</span>
                  <span style={{ color: 'var(--text-dark)', textAlign: 'right' }}>{prodSubCategory}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Wholesale Price:</span>
                  <strong style={{ color: '#16a34a', fontSize: '0.95rem' }}>₹{parseFloat(prodPrice || 0).toFixed(2)}</strong>
                </div>
                {prodMrp && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>MRP:</span>
                    <strong style={{ color: 'var(--text-dark)' }}>₹{parseFloat(prodMrp).toFixed(2)}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Stock Units:</span>
                  <span style={{ color: 'var(--text-dark)' }}>{prodStockQuantity || 100} ({prodInStock ? '✓ In Stock' : '✕ Out of Stock'})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>Attached Photos:</span>
                  <span style={{ color: 'var(--text-dark)' }}>{prodImages.length} photo(s)</span>
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: '500', lineHeight: 1.5 }}>
                તમે ભરેલી વિગતો યોગ્ય છે? શું તમે આ પ્રોડક્ટ સેવ કરી પબ્લિક વેબસાઇટ પર લાઈવ કરવા માંગો છો?
              </div>
            </div>

            <div style={{ padding: '14px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowSaveConfirm(false)}
                className="btn btn-outline"
                style={{ padding: '9px 18px', fontSize: '0.88rem', fontWeight: '600' }}
              >
                ✕ Review Details (No)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaveConfirm(false);
                  executeActualSaveProduct();
                }}
                className="btn btn-primary"
                style={{ padding: '9px 24px', fontSize: '0.88rem', fontWeight: '700', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
              >
                ✓ Yes, Save & Publish
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PHOTO PREVIEW LIGHTBOX MODAL */}
      {previewImage && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100020,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img 
              src={previewImage} 
              alt="Photo Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '78vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <div style={{ marginTop: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{
                  padding: '9px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '24px',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                ✕ Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ==========================================
          MODAL: CREATE / EDIT SUB-ADMIN (SUPERADMIN ONLY)
          ========================================== */}
      {isAdminModalOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', boxSizing: 'border-box',
          overscrollBehavior: 'contain'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
            border: '1.5px solid #fde68a'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: '#fffbeb',
              borderBottom: '1px solid #fde68a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#92400e', fontWeight: '800' }}>
                    {editingAdmin ? `Edit Admin Account: ${editingAdmin.name}` : 'Create New Sub-Admin Staff'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#b45309' }}>
                    SuperAdmin Access Control • Assign credentials & granular permissions
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveAdmin} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                
                {/* Row 1: Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Admin Full Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="E.g., Rajesh Sharma"
                      value={adminFormName}
                      onChange={(e) => setAdminFormName(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Mobile Number</label>
                    <input 
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={adminFormPhone}
                      onChange={(e) => setAdminFormPhone(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Row 2: Email (Username) & Password */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Login Email / Username *</label>
                    <input 
                      type="email"
                      required
                      placeholder="staff.name@niyanshpharma.com"
                      value={adminFormEmail}
                      onChange={(e) => setAdminFormEmail(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                        {editingAdmin ? 'New Password (Optional)' : 'Password *'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randNum = Math.floor(1000 + Math.random() * 9000);
                          setAdminFormPassword(`NpStaff@${randNum}`);
                        }}
                        style={{ fontSize: '0.72rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Sparkles size={12} /> Generate Password
                      </button>
                    </div>
                    <input 
                      type="text"
                      placeholder={editingAdmin ? 'Leave blank to keep unchanged' : 'Min 6 characters'}
                      value={adminFormPassword}
                      onChange={(e) => setAdminFormPassword(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      SuperAdmin can always view or change this password later.
                    </span>
                  </div>
                </div>

                {/* Permissions Section */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                        Granular Access Permissions
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-medium)' }}>
                        Choose what features this staff member is allowed to see or modify:
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setAdminFormPermissions({
                          canManageProducts: true,
                          canDeleteProducts: true,
                          canBulkImport: true,
                          canManageOrders: true,
                          canManageLedgers: true,
                          canManageCompanies: true,
                          canManageNews: true,
                          canManageEnquiries: true,
                          canClearDatabase: false
                        })}
                        style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminFormPermissions({
                          canManageProducts: true,
                          canDeleteProducts: false,
                          canBulkImport: true,
                          canManageOrders: true,
                          canManageLedgers: false,
                          canManageCompanies: true,
                          canManageNews: true,
                          canManageEnquiries: true,
                          canClearDatabase: false
                        })}
                        style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Standard Staff
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canManageProducts)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canManageProducts: e.target.checked }))}
                        style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                      />
                      <span>Add & Edit Products</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canDeleteProducts)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canDeleteProducts: e.target.checked }))}
                        style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                      />
                      <span>Delete Products</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canBulkImport)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canBulkImport: e.target.checked }))}
                        style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                      />
                      <span>Upload Excel / CSV Import</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canManageOrders)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canManageOrders: e.target.checked }))}
                        style={{ accentColor: '#8b5cf6', width: '16px', height: '16px' }}
                      />
                      <span>Manage B2B Orders & Status</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canManageLedgers)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canManageLedgers: e.target.checked }))}
                        style={{ accentColor: '#eab308', width: '16px', height: '16px' }}
                      />
                      <span>Access Outstanding Financial Ledgers</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canManageCompanies)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canManageCompanies: e.target.checked }))}
                        style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                      />
                      <span>Manage Companies & Manufacturers</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canManageNews)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canManageNews: e.target.checked }))}
                        style={{ accentColor: '#f97316', width: '16px', height: '16px' }}
                      />
                      <span>Post Schemes, Tickers & News</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canManageEnquiries)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canManageEnquiries: e.target.checked }))}
                        style={{ accentColor: '#0ea5e9', width: '16px', height: '16px' }}
                      />
                      <span>View & Manage Enquiries</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', color: '#b91c1c', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(adminFormPermissions.canClearDatabase)}
                        onChange={(e) => setAdminFormPermissions(prev => ({ ...prev, canClearDatabase: e.target.checked }))}
                        style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                      />
                      <span>Danger Zone: Clear Entire Database</span>
                    </label>

                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '14px 24px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 18px', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAdmin}
                  className="btn btn-primary"
                  style={{ padding: '8px 24px', fontWeight: '700', backgroundColor: '#f59e0b', borderColor: '#f59e0b', gap: '6px' }}
                >
                  {isSavingAdmin ? 'Saving...' : editingAdmin ? 'Save Changes' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==========================================
          MODAL: SUPERADMIN / USER PROFILE & SETTINGS
          ========================================== */}
      {isProfileModalOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', boxSizing: 'border-box',
          overscrollBehavior: 'contain'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
            border: isSuperAdmin ? '1.5px solid #fde68a' : '1px solid #cbd5e1'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: isSuperAdmin ? '#fffbeb' : '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: isSuperAdmin ? '#fef3c7' : '#eff6ff', color: isSuperAdmin ? '#b45309' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: '800' }}>
                    {isSuperAdmin ? 'SuperAdmin Profile & Settings' : 'Admin Profile'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)' }}>
                    Edit your account name, mobile number, avatar photo and password
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                
                {/* Avatar Preview & Selection */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={profileAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName || 'Admin')}&background=${isSuperAdmin ? 'f59e0b' : '2563eb'}&color=ffffff&bold=true`}
                      alt="Preview"
                      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${isSuperAdmin ? '#f59e0b' : '#2563eb'}` }}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>Profile Photo</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <label 
                        className="btn btn-sm btn-primary"
                        style={{ 
                          cursor: 'pointer', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          fontSize: '0.8rem', 
                          backgroundColor: isSuperAdmin ? '#f59e0b' : '#2563eb', 
                          borderColor: isSuperAdmin ? '#f59e0b' : '#2563eb',
                          margin: 0
                        }}
                      >
                        <Camera size={14} /> Upload / Choose Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleProfilePhotoUpload} 
                          style={{ display: 'none' }} 
                        />
                      </label>

                      {profileAvatar && (
                        <button
                          type="button"
                          onClick={() => setProfileAvatar('')}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.78rem', color: '#ef4444', borderColor: '#fca5a5', padding: '4px 10px' }}
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setProfileAvatar('https://ui-avatars.com/api/?name=Super+Admin&background=f59e0b&color=ffffff&bold=true')}
                        style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: '#fff', color: '#64748b' }}
                      >
                        Gold Avatar
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileAvatar('https://ui-avatars.com/api/?name=Hari+Patel&background=0c3d6c&color=ffffff&bold=true')}
                        style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: '#fff', color: '#64748b' }}
                      >
                        Corporate Avatar
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileAvatar('')}
                        style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: '#fff', color: '#64748b' }}
                      >
                        Auto Initials
                      </button>
                    </div>
                    <input 
                      type="url"
                      placeholder="Or enter image URL (e.g. https://...)"
                      value={profileAvatar && profileAvatar.startsWith('data:') ? '' : profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', marginTop: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Full Name</label>
                  <input 
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Email (Read-only or display) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Registered Email / Login Username</label>
                  <input 
                    type="email"
                    disabled
                    value={profileEmail}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', backgroundColor: '#f1f5f9', color: '#64748b' }}
                  />
                </div>

                {/* Mobile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Mobile Number</label>
                  <input 
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Change Password */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={15} /> Change Password (Optional)
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>New Password</label>
                      <input 
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>Confirm New Password</label>
                      <input 
                        type="password"
                        placeholder="Retype new password"
                        value={profileConfirmPassword}
                        onChange={(e) => setProfileConfirmPassword(e.target.value)}
                        style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div style={{
                padding: '14px 24px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 18px', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary"
                  style={{ padding: '8px 24px', fontWeight: '700', backgroundColor: isSuperAdmin ? '#f59e0b' : '#2563eb', borderColor: isSuperAdmin ? '#f59e0b' : '#2563eb' }}
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* GLOBAL TOAST NOTIFICATION (PORTAL TO BODY - ALWAYS ON TOP OF ANY MODAL, Z-INDEX 9999999) */}
      {toastMessage && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          maxWidth: '460px',
          width: 'calc(100vw - 48px)',
          backgroundColor: toastMessage.type === 'error' ? '#fef2f2' : toastMessage.type === 'warning' ? '#fffbeb' : '#f0fdf4',
          color: toastMessage.type === 'error' ? '#991b1b' : toastMessage.type === 'warning' ? '#92400e' : '#166534',
          border: `1.5px solid ${toastMessage.type === 'error' ? '#f87171' : toastMessage.type === 'warning' ? '#fcd34d' : '#86efac'}`,
          borderRadius: '12px',
          padding: '14px 18px',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 9999999,
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            {toastMessage.type === 'error' ? (
              <AlertCircle size={22} style={{ flexShrink: 0, color: '#dc2626' }} />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle size={22} style={{ flexShrink: 0, color: '#d97706' }} />
            ) : (
              <CheckCircle2 size={22} style={{ flexShrink: 0, color: '#16a34a' }} />
            )}
            <span style={{ fontSize: '0.9rem', fontWeight: '600', lineHeight: 1.4, wordBreak: 'break-word' }}>
              {toastMessage.msg}
            </span>
          </div>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)} 
            style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>,
        document.body
      )}

    </div>
  );
}

export default Admin;

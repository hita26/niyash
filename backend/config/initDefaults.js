const mongoose = require('mongoose');
const User = require('../models/User');
const NewsUpdate = require('../models/NewsUpdate');
const Ledger = require('../models/Ledger');
const Product = require('../models/Product');
const Company = require('../models/Company');
const AuditLog = require('../models/AuditLog');
const fs = require('fs');
const path = require('path');

let isInitialized = false;

const getFutureDate = (daysAhead) => new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

const sampleNews = [
  {
    title: 'Special Trade Scheme: Buy 10 Get 1 Free on all Daxia Formulations',
    content: 'Avail 10+1 free bonus strip on Mucidax 600, Clobedax-GM Cream, and Moxidax-D drops throughout this month. Fast dispatch and standard WHO-GMP quality guaranteed across Gujarat.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: getFutureDate(30),
  },
  {
    title: 'New Product Launch: Lulidax 1% Cream 30g & Ketodax 2% Soap',
    content: 'High-potency dermatological range now available in bulk for wholesale booking. Attractive PTR rates with WHO-GMP certification. Order today for prompt delivery to pharmacies and clinics.',
    category: 'New Launch',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 2,
    expiryDate: getFutureDate(45),
  },
  {
    title: 'Price Drop Alert: Ceftriaxone 1gm & Pantoprazole 40mg Injections',
    content: 'Direct manufacturer PTR reduced by 8% on hospital critical care injectable batches. Check revised pricing in Quick Order portal or contact our wholesale distribution desk.',
    category: 'Price Update',
    company: 'General',
    isTickerActive: true,
    priority: 3,
    expiryDate: getFutureDate(20),
  },
  {
    title: 'Ayurvedic Rasayan & Herbal Joint Oils Special 15+2 Scheme',
    content: 'Order 15 boxes of Mahavishgarbha Pain Oil or Ashwagandhadax Rasayan and receive 2 complimentary retail boxes plus promotional counter display standees.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: getFutureDate(35),
  },
  {
    title: 'GST Regulatory Notice: E-Invoicing Updates for Pharma Retailers',
    content: 'Please ensure valid 15-digit GSTIN is updated on your retailer profile for automated QR code tax invoices and seamless input tax credit reconciliation.',
    category: 'Notice',
    company: 'General',
    isTickerActive: true,
    priority: 4,
    expiryDate: getFutureDate(90),
  },
];

const demoLedgers = [
  {
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
        date: new Date('2026-07-15'),
        dueDate: new Date('2026-08-05'),
        amount: 32000,
        paidAmount: 32000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0824',
        date: new Date('2026-07-28'),
        dueDate: new Date('2026-08-18'),
        amount: 66000,
        paidAmount: 66000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0872',
        date: new Date('2026-08-05'),
        dueDate: new Date('2026-08-26'),
        amount: 28500,
        paidAmount: 0,
        balance: 28500,
        status: 'Pending',
      },
      {
        invoiceNumber: 'INV-2026-0899',
        date: new Date('2026-08-14'),
        dueDate: new Date('2026-09-04'),
        amount: 18700,
        paidAmount: 0,
        balance: 18700,
        status: 'Pending',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-1001',
        date: new Date('2026-07-25T14:30:00Z'),
        amount: 32000,
        method: 'UPI',
        transactionRef: 'UPI/260725183921',
        notes: 'Cleared against INV-2026-0801',
      },
      {
        paymentId: 'PMT-1002',
        date: new Date('2026-08-10T11:15:00Z'),
        amount: 66000,
        method: 'NetBanking',
        transactionRef: 'NEFT/HDFC26081029',
        notes: 'Full payment INV-2026-0824',
      },
    ],
  },
  {
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
        date: new Date('2026-06-20'),
        dueDate: new Date('2026-07-11'),
        amount: 85000,
        paidAmount: 85000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0785',
        date: new Date('2026-07-12'),
        dueDate: new Date('2026-08-02'),
        amount: 60000,
        paidAmount: 60000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0842',
        date: new Date('2026-07-20'),
        dueDate: new Date('2026-08-10'),
        amount: 45000,
        paidAmount: 0,
        balance: 45000,
        status: 'Overdue',
      },
      {
        invoiceNumber: 'INV-2026-0891',
        date: new Date('2026-08-08'),
        dueDate: new Date('2026-08-29'),
        amount: 30000,
        paidAmount: 0,
        balance: 30000,
        status: 'Pending',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-2001',
        date: new Date('2026-07-05T16:20:00Z'),
        amount: 85000,
        method: 'Cheque',
        transactionRef: 'CHQ-984021-SBI',
        notes: 'Cheque Cleared for June batch',
      },
      {
        paymentId: 'PMT-2002',
        date: new Date('2026-07-28T09:45:00Z'),
        amount: 60000,
        method: 'UPI',
        transactionRef: 'UPI/260728994812',
        notes: 'Payment for July order',
      },
    ],
  },
];

let initPromise = null;

const initDefaults = async () => {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 0B. Storage Safety Guard: Automatically purge audit & ERP sync logs older than 7 days
      try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const [auditClean, syncClean] = await Promise.all([
          AuditLog.deleteMany({
            $or: [
              { timestamp: { $lt: sevenDaysAgo } },
              { createdAt: { $lt: sevenDaysAgo } }
            ]
          }),
          mongoose.models.SyncLog
            ? mongoose.models.SyncLog.deleteMany({ createdAt: { $lt: sevenDaysAgo } })
            : Promise.resolve({ deletedCount: 0 })
        ]);
        if (auditClean && auditClean.deletedCount > 0) {
          console.log(`[Storage Guard] Cleaned ${auditClean.deletedCount} audit logs older than 7 days`);
        }
        if (syncClean && syncClean.deletedCount > 0) {
          console.log(`[Storage Guard] Cleaned ${syncClean.deletedCount} ERP sync logs older than 7 days`);
        }
      } catch (errClean) {
        console.warn('Warning during 7-day log purge:', errClean.message);
      }

      // 1. Ensure SuperAdmin & Admin Users
      // 1A. SuperAdmin User (Full Control Master Account)
      const superAdminEmail = 'info@niyanshpharma.com';
      let superAdmin = await User.findOne({ email: superAdminEmail });
      const superPermissions = {
        canManageProducts: true,
        canDeleteProducts: true,
        canBulkImport: true,
        canManageOrders: true,
        canManageLedgers: true,
        canManageCompanies: true,
        canManageNews: true,
        canManageEnquiries: true,
        canClearDatabase: true
      };

      if (!superAdmin) {
        try {
          await User.create({
            name: 'Niyansh Super Admin',
            email: superAdminEmail,
            password: 'NiyanshSuper@2026',
            plainPassword: 'NiyanshSuper@2026',
            companyName: 'Niyansh Pharma Wholesale Distribution',
            role: 'superadmin',
            phone: '9316566894',
            gstin: '24TESTG1234F1Z9',
            avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=f59e0b&color=ffffff&bold=true',
            isActive: true,
            permissions: superPermissions
          });
          console.log(`✅ SuperAdmin user created: ${superAdminEmail}`);
        } catch (sErr) {
          if (!sErr.message.includes('E11000')) console.warn('SuperAdmin user setup:', sErr.message);
        }
      } else {
        // Upgrade existing info user to superadmin if needed
        let needSave = false;
        if (superAdmin.role !== 'superadmin') {
          superAdmin.role = 'superadmin';
          needSave = true;
        }
        if (!superAdmin.plainPassword) {
          superAdmin.plainPassword = 'NiyanshSuper@2026';
          needSave = true;
        }
        if (!superAdmin.avatar) {
          superAdmin.avatar = 'https://ui-avatars.com/api/?name=Super+Admin&background=f59e0b&color=ffffff&bold=true';
          needSave = true;
        }
        if (needSave) {
          await superAdmin.save();
          console.log(`✅ SuperAdmin account updated: ${superAdminEmail}`);
        }
      }

      // 1B. Standard Staff Admin User
      const adminUser = await User.findOne({ email: 'admin@niyanshpharma.com' });
      if (!adminUser) {
        try {
          await User.create({
            name: 'Niyansh Staff Admin',
            email: 'admin@niyanshpharma.com',
            password: 'admin123',
            plainPassword: 'admin123',
            companyName: 'Niyansh Pharma Wholesale Distribution',
            role: 'admin',
            phone: '9316566894',
            gstin: '24TESTG1234F1Z9',
            avatar: 'https://ui-avatars.com/api/?name=Admin+Staff&background=2563eb&color=ffffff&bold=true',
            isActive: true,
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
          });
          console.log('✅ Staff Admin user created: admin@niyanshpharma.com');
        } catch (uErr) {
          if (!uErr.message.includes('E11000')) {
            console.warn('Admin user setup:', uErr.message);
          }
        }
      } else if (!adminUser.plainPassword) {
        adminUser.plainPassword = 'admin123';
        await adminUser.save();
      }

      // 1C. Permanent Safeguard: Ensure Hari Patel Admin Account is active and never purged
      const hariAdmin = await User.findOne({ email: 'haripatel267998@gmail.com' });
      if (!hariAdmin) {
        try {
          await User.create({
            name: 'Hari Patel',
            email: 'haripatel267998@gmail.com',
            password: 'admin123',
            plainPassword: 'admin123',
            companyName: 'Niyansh Pharma Wholesale Operations',
            role: 'admin',
            phone: '9316566894',
            avatar: 'https://ui-avatars.com/api/?name=Hari+Patel&background=2563eb&color=ffffff&bold=true',
            isActive: true,
            permissions: {
              canManageProducts: true,
              canDeleteProducts: false,
              canBulkImport: true,
              canManageOrders: true,
              canManageLedgers: true,
              canManageCompanies: true,
              canManageNews: true,
              canManageEnquiries: true,
              canClearDatabase: false
            }
          });
          console.log('✅ Hari Patel admin permanently created and protected');
        } catch (hErr) {
          if (!hErr.message.includes('E11000')) console.warn('Hari Patel setup:', hErr.message);
        }
      } else {
        if (!hariAdmin.plainPassword) {
          hariAdmin.plainPassword = 'admin123';
          await hariAdmin.save();
        }
      }

      // 2. Ensure News / Schemes
      const newsCount = await NewsUpdate.countDocuments();
      if (newsCount === 0) {
        await NewsUpdate.insertMany(sampleNews);
        console.log('✅ Default news & schemes seeded');
      }

      // 3. Ensure Demo Ledgers (Shanti Medico & Patel Pharmacy)
      for (const demo of demoLedgers) {
        const existing = await Ledger.findOne({ retailerMobile: demo.retailerMobile });
        if (!existing || existing.invoices.length === 0) {
          await Ledger.findOneAndUpdate(
            { retailerMobile: demo.retailerMobile },
            { $set: demo },
            { upsert: true, new: true }
          );
          console.log(`✅ Demo ledger seeded: ${demo.shopName} (${demo.retailerMobile})`);
        }
      }

      // 4. Ensure Hita user profile has mobile number 8668139528 attached
      try {
        const hita = await User.findOne({ email: 'shihorahita863@gmail.com' });
        if (hita && (!hita.phone || hita.phone !== '8668139528')) {
          hita.phone = '8668139528';
          await hita.save();
          console.log('✅ Linked phone 8668139528 to shihorahita863@gmail.com');
        }
      } catch (hErr) {
        // ignore
      }

      // 5. Catalog sync (only if explicitly enabled via AUTO_SEED_CATALOG env)
      try {
        const productCount = await Product.countDocuments();
        if (process.env.AUTO_SEED_CATALOG === 'true' && productCount < 500) {
          console.log(`AUTO_SEED_CATALOG is active and product count (${productCount}) is below threshold. Starting catalog sync...`);
          let companiesData = null;
          let productsData = null;

          try {
            const catalog = require('../data/catalogData');
            companiesData = catalog.companies || null;
            productsData = catalog.products || null;
          } catch (e) {
            try {
              companiesData = require('../data/companies.json');
            } catch (e1) {
              const companiesFile = path.join(__dirname, '../data/companies.json');
              if (fs.existsSync(companiesFile)) {
                companiesData = JSON.parse(fs.readFileSync(companiesFile, 'utf8'));
              }
            }

            try {
              productsData = require('../data/products.json');
            } catch (e2) {
              const productsFile = path.join(__dirname, '../data/products.json');
              if (fs.existsSync(productsFile)) {
                productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
              }
            }
          }

          if (companiesData && companiesData.length > 0) {
            try {
              const compOps = companiesData.map(c => ({
                updateOne: {
                  filter: { name: c.name },
                  update: { $set: { ...c, isPublished: true, isVerified: true } },
                  upsert: true
                }
              }));
              await Company.bulkWrite(compOps, { ordered: false });
              console.log(`✅ ${companiesData.length} companies synced.`);
            } catch (cErr) {
              console.warn('Company sync notice:', cErr.message);
            }
          }

          if (productsData && productsData.length > 0) {
            try {
              const BATCH_SIZE = 1500;
              for (let i = 0; i < productsData.length; i += BATCH_SIZE) {
                const chunk = productsData.slice(i, i + BATCH_SIZE);
                const bulkOps = chunk.map(p => ({
                  updateOne: {
                    filter: { sku: p.sku },
                    update: { $set: p },
                    upsert: true
                  }
                }));
                await Product.bulkWrite(bulkOps, { ordered: false });
              }
              const finalCount = await Product.countDocuments();
              console.log(`✅ Full catalog seeded successfully. Total products: ${finalCount}`);
            } catch (pErr) {
              console.warn('Product sync notice:', pErr.message);
            }
          }
        }

        // Initialize isOurProduct for DAXIA flagship products if none currently flagged
        try {
          const ourProdCount = await Product.countDocuments({ isOurProduct: true });
          if (ourProdCount === 0) {
            const updated = await Product.updateMany(
              { $or: [{ company: /DAXIA/i }, { brand: /DAXIA/i }, { manufacturer: /DAXIA/i }] },
              { $set: { isOurProduct: true } }
            );
            console.log(`✅ Initialized ${updated.modifiedCount} flagship products with isOurProduct=true`);
          }
        } catch (ourErr) {
          console.warn('Flagship product flag notice:', ourErr.message);
        }
      } catch (catErr) {
        console.warn('Catalog check notice:', catErr.message);
      }

      isInitialized = true;
    } catch (err) {
      if (!err.message?.includes('E11000')) {
        console.error('Warning during default initialization:', err.message);
      }
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
};

module.exports = initDefaults;

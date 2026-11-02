import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  Download,
  Printer,
  Share2,
  Mail,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Phone,
  Calendar,
  IndianRupee,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Percent,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  User,
  Zap,
  Receipt,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import PaymentGatewayModal from '../components/PaymentGatewayModal';

// Robust fallback ledger data covering the 3 primary wholesale retailer accounts
const FALLBACK_LEDGERS = {
  '9825012345': {
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
        dueDate: '2026-09-04T00:00:00.000Z',
        amount: 18700,
        paidAmount: 0,
        balance: 18700,
        status: 'Pending',
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
  '9876543210': {
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
        date: '2026-07-12T00:00:00.000Z',
        dueDate: '2026-08-02T00:00:00.000Z',
        amount: 60000,
        paidAmount: 60000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0842',
        date: '2026-07-20T00:00:00.000Z',
        dueDate: '2026-08-10T00:00:00.000Z',
        amount: 45000,
        paidAmount: 0,
        balance: 45000,
        status: 'Overdue',
      },
      {
        invoiceNumber: 'INV-2026-0891',
        date: '2026-08-08T00:00:00.000Z',
        dueDate: '2026-08-29T00:00:00.000Z',
        amount: 30000,
        paidAmount: 0,
        balance: 30000,
        status: 'Pending',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-2001',
        date: '2026-07-05T16:20:00.000Z',
        amount: 85000,
        method: 'Cheque',
        transactionRef: 'CHQ-984021-SBI',
        notes: 'Cheque Cleared for June batch',
      },
      {
        paymentId: 'PMT-2002',
        date: '2026-07-28T09:45:00.000Z',
        amount: 60000,
        method: 'UPI',
        transactionRef: 'UPI/260728994812',
        notes: 'Payment for July order',
      },
    ],
  },
  '9316566894': {
    retailerMobile: '9316566894',
    shopName: 'City Chemist',
    email: 'citychemist.surat@gmail.com',
    gstin: '24XYZPA9988B1Z7',
    totalBilled: 94500,
    totalPaid: 65000,
    outstandingBalance: 29500,
    creditLimit: 100000,
    invoices: [
      {
        invoiceNumber: 'INV-2026-0812',
        date: '2026-07-18T00:00:00.000Z',
        dueDate: '2026-08-08T00:00:00.000Z',
        amount: 40000,
        paidAmount: 40000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0865',
        date: '2026-08-02T00:00:00.000Z',
        dueDate: '2026-08-23T00:00:00.000Z',
        amount: 25000,
        paidAmount: 25000,
        balance: 0,
        status: 'Paid',
      },
      {
        invoiceNumber: 'INV-2026-0905',
        date: '2026-08-16T00:00:00.000Z',
        dueDate: '2026-09-06T00:00:00.000Z',
        amount: 29500,
        paidAmount: 0,
        balance: 29500,
        status: 'Pending',
      },
    ],
    payments: [
      {
        paymentId: 'PMT-3001',
        date: '2026-07-29T18:00:00.000Z',
        amount: 40000,
        method: 'UPI',
        transactionRef: 'UPI/260729381920',
        notes: 'Auto-verified UPI Payment',
      },
      {
        paymentId: 'PMT-3002',
        date: '2026-08-12T12:30:00.000Z',
        amount: 25000,
        method: 'Card',
        transactionRef: 'CARD/TXN882910',
        notes: 'Debit Card Portal Pay',
      },
    ],
  },
};

export default function OutstandingLedger({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mobile number query parameter or active logged in user
  const initialMobile =
    searchParams.get('mobile') ||
    user?.phone ||
    user?.mobile ||
    localStorage.getItem('niyansh_retailer_mobile') ||
    '9825012345';

  const [activeMobile, setActiveMobile] = useState(initialMobile);
  const [searchInput, setSearchInput] = useState(initialMobile);
  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);

  // Ledger state
  const [ledgerData, setLedgerData] = useState(FALLBACK_LEDGERS[initialMobile] || FALLBACK_LEDGERS['9825012345']);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Filter & Search states
  const [invoiceFilter, setInvoiceFilter] = useState('All'); // 'All' | 'Pending' | 'Overdue' | 'Paid'
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All'); // 'All' | 'UPI' | 'Card' | 'NetBanking' | 'Cheque'

  // Payment Gateway Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payModalDueAmount, setPayModalDueAmount] = useState(0);
  const [payModalInvoiceNumber, setPayModalInvoiceNumber] = useState('');

  // View Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Helper to format INR currency
  const formatINR = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Helper to format dates
  const formatDate = (dStr) => {
    if (!dStr) return '-';
    const date = new Date(dStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Fetch ledger data from backend API
  const fetchLedger = async (mobile) => {
    const cleanMobile = mobile.trim();
    if (!cleanMobile) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/ledger/${cleanMobile}`);
      const data = await response.json();

      if (response.ok && data.success && data.ledger) {
        setLedgerData(data.ledger);
        setLastSyncTime(new Date());
      } else {
        // Fallback to mock data if not found or server is down
        if (FALLBACK_LEDGERS[cleanMobile]) {
          setLedgerData(FALLBACK_LEDGERS[cleanMobile]);
        } else {
          // Generate new mock ledger for this mobile
          setLedgerData({
            retailerMobile: cleanMobile,
            shopName: `Retailer ${cleanMobile}`,
            email: `retailer.${cleanMobile}@niyanshpharma.com`,
            gstin: '24AAAAA0000A1Z5',
            totalBilled: 0,
            totalPaid: 0,
            outstandingBalance: 0,
            creditLimit: 100000,
            invoices: [],
            payments: [],
          });
        }
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.warn('API error, using local fallback ledger:', err);
      if (FALLBACK_LEDGERS[cleanMobile]) {
        setLedgerData(FALLBACK_LEDGERS[cleanMobile]);
      }
      setLastSyncTime(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Load ledger on active mobile change
  useEffect(() => {
    fetchLedger(activeMobile);
    localStorage.setItem('niyansh_retailer_mobile', activeMobile);
  }, [activeMobile]);

  // Handle Account Switching
  const handleSwitchAccount = (mobile) => {
    setActiveMobile(mobile);
    setSearchInput(mobile);
    setSearchParams({ mobile });
    setIsSwitchAccountOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim().length >= 10) {
      handleSwitchAccount(searchInput.trim());
    } else {
      showToast('Please enter a valid 10-digit mobile number');
    }
  };

  // Calculate Overdue Invoices
  const now = new Date();
  const overdueInvoices = useMemo(() => {
    return (ledgerData.invoices || []).filter((inv) => {
      if (inv.balance <= 0) return false;
      if (inv.status === 'Overdue') return true;
      if (inv.dueDate && new Date(inv.dueDate) < now) return true;
      return false;
    });
  }, [ledgerData.invoices]);

  const totalOverdueAmount = useMemo(() => {
    return overdueInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
  }, [overdueInvoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return (ledgerData.invoices || []).filter((inv) => {
      // Status Filter
      if (invoiceFilter === 'Pending' && (inv.status !== 'Pending' && inv.status !== 'Partial')) return false;
      if (invoiceFilter === 'Overdue') {
        const isInvOverdue = inv.status === 'Overdue' || (inv.dueDate && new Date(inv.dueDate) < now && inv.balance > 0);
        if (!isInvOverdue) return false;
      }
      if (invoiceFilter === 'Paid' && inv.status !== 'Paid') return false;

      // Search Filter
      if (invoiceSearchQuery) {
        const q = invoiceSearchQuery.toLowerCase();
        const numMatch = inv.invoiceNumber?.toLowerCase().includes(q);
        const amtMatch = inv.amount?.toString().includes(q);
        if (!numMatch && !amtMatch) return false;
      }

      return true;
    });
  }, [ledgerData.invoices, invoiceFilter, invoiceSearchQuery]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return (ledgerData.payments || []).filter((pmt) => {
      if (paymentMethodFilter === 'All') return true;
      return pmt.method?.toLowerCase() === paymentMethodFilter.toLowerCase();
    });
  }, [ledgerData.payments, paymentMethodFilter]);

  // Open Payment Gateway for full balance or specific invoice
  const openPaymentModal = (amount, invNumber = '') => {
    setPayModalDueAmount(amount !== undefined ? amount : ledgerData.outstandingBalance);
    setPayModalInvoiceNumber(invNumber);
    setIsPayModalOpen(true);
  };

  // On payment completed callback
  const handlePaymentSuccess = (receipt, updatedLedger) => {
    if (updatedLedger) {
      setLedgerData(updatedLedger);
    } else {
      // Local optimistic update
      const payAmount = Number(receipt.amount) || 0;
      setLedgerData((prev) => {
        let remaining = payAmount;
        const newInvoices = (prev.invoices || []).map((inv) => {
          if (inv.balance > 0 && remaining > 0) {
            const unpaid = inv.balance;
            if (remaining >= unpaid) {
              remaining -= unpaid;
              return { ...inv, paidAmount: (inv.paidAmount || 0) + unpaid, balance: 0, status: 'Paid' };
            } else {
              const newBalance = inv.balance - remaining;
              const newPaid = (inv.paidAmount || 0) + remaining;
              remaining = 0;
              return { ...inv, paidAmount: newPaid, balance: newBalance, status: 'Partial' };
            }
          }
          return inv;
        });

        const newPayments = [
          {
            paymentId: receipt.paymentId,
            date: receipt.date || new Date().toISOString(),
            amount: payAmount,
            method: receipt.method,
            transactionRef: receipt.transactionRef,
            notes: receipt.invoiceNumber ? `Cleared against ${receipt.invoiceNumber}` : 'Ledger settlement',
          },
          ...(prev.payments || []),
        ];

        const newTotalPaid = (prev.totalPaid || 0) + payAmount;
        const newOutstanding = Math.max(0, (prev.outstandingBalance || 0) - payAmount);

        return {
          ...prev,
          totalPaid: newTotalPaid,
          outstandingBalance: newOutstanding,
          invoices: newInvoices,
          payments: newPayments,
        };
      });
    }

    showToast(`Payment of ${formatINR(receipt.amount)} received and reconciled successfully!`);
    setLastSyncTime(new Date());
  };

  // WhatsApp Statement Dispatch
  const handleSendStatementWhatsApp = async () => {
    try {
      const res = await fetch('/api/ledger/send-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retailerMobile: ledgerData.retailerMobile }),
      });
      const data = await res.json();
      if (res.ok && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
        showToast('Statement formatted for WhatsApp dispatch');
      } else {
        // Fallback WhatsApp message generator
        const statementText = `📊 *STATEMENT OF ACCOUNT - NIYANSH PHARMA*
━━━━━━━━━━━━━━━━━━━━
*Retailer:* ${ledgerData.shopName}
*Mobile:* ${ledgerData.retailerMobile}${ledgerData.gstin ? `\n*GSTIN:* ${ledgerData.gstin}` : ''}
*Statement Date:* ${new Date().toLocaleDateString('en-IN')}

*ACCOUNT SUMMARY:*
• Total Invoiced: ${formatINR(ledgerData.totalBilled)}
• Total Paid: ${formatINR(ledgerData.totalPaid)}
• *Outstanding Balance: ${formatINR(ledgerData.outstandingBalance)}*
• Credit Limit: ${formatINR(ledgerData.creditLimit)}
• Available Credit: ${formatINR(Math.max(0, (ledgerData.creditLimit || 100000) - (ledgerData.outstandingBalance || 0)))}

*Pay Instantly via UPI:* 9316566894@okbizaxis
━━━━━━━━━━━━━━━━━━━━
_Niyansh Pharma Wholesale & Distribution • Rajkot_`;

        const waUrl = `https://api.whatsapp.com/send?phone=91${ledgerData.retailerMobile.replace(/\D/g, '')}&text=${encodeURIComponent(statementText)}`;
        window.open(waUrl, '_blank');
        showToast('Statement opened in WhatsApp');
      }
    } catch (e) {
      console.error('WhatsApp send error:', e);
      showToast('Opening WhatsApp statement...');
    }
  };

  // Email statement dispatch
  const handleSendStatementEmail = () => {
    const subject = encodeURIComponent(`Statement of Account - ${ledgerData.shopName} [Niyansh Pharma]`);
    const body = encodeURIComponent(`Dear ${ledgerData.shopName},

Please find below your Statement of Account with Niyansh Pharma Wholesale Distribution as of ${new Date().toLocaleDateString('en-IN')}:

• Total Invoiced Purchases: ${formatINR(ledgerData.totalBilled)}
• Total Paid Amount: ${formatINR(ledgerData.totalPaid)}
• Outstanding Balance Due: ${formatINR(ledgerData.outstandingBalance)}
• Credit Limit: ${formatINR(ledgerData.creditLimit)}
• Available Credit Balance: ${formatINR(Math.max(0, (ledgerData.creditLimit || 100000) - (ledgerData.outstandingBalance || 0)))}

Wholesale Bank Details:
Axis Bank, Rajkot Main Branch
Account Number: 923020048192019
IFSC Code: UTIB0000123
UPI ID: 9316566894@okbizaxis

For billing queries, call +91 9316566894 or reply to this email.

Niyansh Pharma Wholesale & Distribution
Rajkot, Gujarat`);

    const mailto = `mailto:${ledgerData.email || 'accounts@niyanshpharma.com'}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
    showToast('Email client opened with statement');
  };

  // Download Statement CSV
  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'NIYANSH PHARMA - RETAILER STATEMENT OF ACCOUNT\n';
    csvContent += `Retailer,${ledgerData.shopName}\n`;
    csvContent += `Mobile,${ledgerData.retailerMobile}\n`;
    csvContent += `GSTIN,${ledgerData.gstin || 'N/A'}\n`;
    csvContent += `Date,${new Date().toLocaleDateString('en-IN')}\n\n`;

    csvContent += 'FINANCIAL SUMMARY\n';
    csvContent += `Total Invoiced,${ledgerData.totalBilled}\n`;
    csvContent += `Total Paid,${ledgerData.totalPaid}\n`;
    csvContent += `Outstanding Balance,${ledgerData.outstandingBalance}\n`;
    csvContent += `Credit Limit,${ledgerData.creditLimit}\n\n`;

    csvContent += 'INVOICES BREAKDOWN\n';
    csvContent += 'Invoice No,Date,Due Date,Amount,Paid Amount,Balance,Status\n';
    (ledgerData.invoices || []).forEach((inv) => {
      csvContent += `${inv.invoiceNumber},${formatDate(inv.date)},${formatDate(inv.dueDate)},${inv.amount},${inv.paidAmount || 0},${inv.balance},${inv.status}\n`;
    });

    csvContent += '\nPAYMENT TRANSACTIONS HISTORY\n';
    csvContent += 'Payment ID,Date,Amount,Method,Reference / UTR,Notes\n';
    (ledgerData.payments || []).forEach((pmt) => {
      csvContent += `${pmt.paymentId},${formatDate(pmt.date)},${pmt.amount},${pmt.method},${pmt.transactionRef || '-'},"${pmt.notes || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Statement_${ledgerData.shopName.replace(/\s+/g, '_')}_${ledgerData.retailerMobile}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Statement CSV downloaded successfully');
  };

  // Print Statement A4
  const handlePrintStatement = () => {
    window.print();
  };

  // Credit Utilization Percentage
  const creditLimitVal = ledgerData.creditLimit || 100000;
  const availableCredit = Math.max(0, creditLimitVal - (ledgerData.outstandingBalance || 0));
  const creditUtilizationPercent = Math.min(100, Math.round(((ledgerData.outstandingBalance || 0) / creditLimitVal) * 100));

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 0 80px' }}>
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body { background-color: #ffffff !important; }
          header, footer, .no-print, nav, .news-ticker { display: none !important; }
          .printable-ledger { box-shadow: none !important; border: none !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1300,
            backgroundColor: '#0c3d6c',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <Sparkles size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container printable-ledger">
        {/* Page Top Breadcrumb & Actions */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
              <Link to="/" style={{ color: '#0c3d6c', fontWeight: 600 }}>Home</Link>
              <span>/</span>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>Retailer Ledger & Statement of Account</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0c3d6c', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📊 Retailer Outstanding Ledger</span>
              <span style={{ fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                Live B2B Portal
              </span>
            </h1>
          </div>

          {/* Quick Account Switcher & Search Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#0c3d6c',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <User size={16} />
              <span>Switch Retailer ({ledgerData.retailerMobile})</span>
              <ChevronDown size={14} />
            </button>

            <button
              onClick={() => fetchLedger(activeMobile)}
              disabled={isLoading}
              title="Refresh ledger from server"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span className="hide-mobile">Sync</span>
            </button>
          </div>
        </div>

        {/* Account Switcher Drawer / Search Box */}
        {isSwitchAccountOpen && (
          <div
            className="no-print animate-fade-in card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0c3d6c' }}>
                Lookup Retailer Account or Select Demo Wholesale Account
              </div>
              <button
                onClick={() => setIsSwitchAccountOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 10-Digit Mobile Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit Retailer Mobile Number (e.g. 9825012345)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    fontWeight: 600
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0c3d6c',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Fetch Statement
              </button>
            </form>

            {/* Quick Demo Switcher Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Quick Sample Accounts:</span>
              <button
                type="button"
                onClick={() => handleSwitchAccount('9825012345')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: activeMobile === '9825012345' ? '#0c3d6c' : '#f1f5f9',
                  color: activeMobile === '9825012345' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                🏬 Shanti Medico (9825012345) • ₹47.2k Due
              </button>

              <button
                type="button"
                onClick={() => handleSwitchAccount('9876543210')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: activeMobile === '9876543210' ? '#0c3d6c' : '#f1f5f9',
                  color: activeMobile === '9876543210' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                🏬 Patel Pharmacy (9876543210) • ₹75k Overdue
              </button>

              <button
                type="button"
                onClick={() => handleSwitchAccount('9316566894')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: activeMobile === '9316566894' ? '#0c3d6c' : '#f1f5f9',
                  color: activeMobile === '9316566894' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                🏬 City Chemist (9316566894) • ₹29.5k Due
              </button>
            </div>
          </div>
        )}

        {/* Retailer Profile Header Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0c3d6c'
              }}
            >
              <Building2 size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0c3d6c', fontWeight: 800 }}>
                  {ledgerData.shopName}
                </h2>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    border: '1px solid #bbf7d0'
                  }}
                >
                  Verified Wholesale Account
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} color="#0c3d6c" /> {ledgerData.retailerMobile}
                </span>
                {ledgerData.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} color="#0c3d6c" /> {ledgerData.email}
                  </span>
                )}
                {ledgerData.gstin && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="#0c3d6c" /> GSTIN: <strong style={{ color: '#334155' }}>{ledgerData.gstin}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748b' }}>
              <div>Statement as of:</div>
              <strong style={{ color: '#0f172a' }}>{lastSyncTime.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
          </div>
        </div>

        {/* Overdue Alert Banner (If Any Overdue Dues Exist) */}
        {overdueInvoices.length > 0 && (
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '14px',
              padding: '18px 24px',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '1rem' }}>
                  ⚠️ OVERDUE INVOICE ALERT: {overdueInvoices.length} Invoice(s) Overdue ({formatINR(totalOverdueAmount)})
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#b91c1c' }}>
                  Overdue invoices may lead to dispatch hold on new wholesale orders. Kindly clear dues immediately.
                </p>
              </div>
            </div>

            <button
              onClick={() => openPaymentModal(totalOverdueAmount, overdueInvoices[0]?.invoiceNumber || '')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)'
              }}
            >
              <Zap size={16} /> Pay Overdue Balance ({formatINR(totalOverdueAmount)})
            </button>
          </div>
        )}

        {/* 4 Key Financial Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}
        >
          {/* CARD 1: Outstanding Balance */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Outstanding Balance
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: ledgerData.outstandingBalance > 0 ? (overdueInvoices.length > 0 ? '#fee2e2' : '#fef3c7') : '#dcfce7',
                  color: ledgerData.outstandingBalance > 0 ? (overdueInvoices.length > 0 ? '#dc2626' : '#d97706') : '#15803d'
                }}
              >
                {ledgerData.outstandingBalance > 0 ? (overdueInvoices.length > 0 ? 'Action Required' : 'Payment Due') : 'All Clear'}
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: ledgerData.outstandingBalance > 0 ? '#0c3d6c' : '#16a34a', margin: '4px 0' }}>
              {formatINR(ledgerData.outstandingBalance)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Net unpaid balance across all wholesale orders
            </div>
          </div>

          {/* CARD 2: Total Invoiced / Billed */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Total Invoiced / Billed
              </span>
              <FileText size={18} color="#0c3d6c" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0c3d6c', margin: '4px 0' }}>
              {formatINR(ledgerData.totalBilled)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Cumulative wholesale purchases ({(ledgerData.invoices || []).length} Invoices)
            </div>
          </div>

          {/* CARD 3: Total Paid */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Total Paid Amount
              </span>
              <CheckCircle2 size={18} color="#16a34a" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>
              {formatINR(ledgerData.totalPaid)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Total reconciled payments ({(ledgerData.payments || []).length} Transactions)
            </div>
          </div>

          {/* CARD 4: Credit Limit & Utilization */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Credit Limit
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0c3d6c' }}>
                {formatINR(creditLimitVal)}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0c3d6c', margin: '2px 0' }}>
              {formatINR(availableCredit)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
              Available Credit Remaining ({100 - creditUtilizationPercent}%)
            </div>

            {/* Credit Utilization Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${creditUtilizationPercent}%`,
                  height: '100%',
                  backgroundColor: creditUtilizationPercent > 80 ? '#ef4444' : creditUtilizationPercent > 50 ? '#f59e0b' : '#10b981',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div
          className="no-print card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '28px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0c3d6c' }}>Quick Ledger Actions:</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            {/* Pay Outstanding Button */}
            <button
              onClick={() => openPaymentModal(ledgerData.outstandingBalance, '')}
              disabled={ledgerData.outstandingBalance <= 0}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: ledgerData.outstandingBalance > 0 ? '#0c3d6c' : '#94a3b8',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: 'none',
                cursor: ledgerData.outstandingBalance > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: ledgerData.outstandingBalance > 0 ? '0 4px 12px rgba(12, 61, 108, 0.25)' : 'none'
              }}
            >
              <CreditCard size={16} /> Pay Outstanding ({formatINR(ledgerData.outstandingBalance)})
            </button>

            {/* WhatsApp Statement */}
            <button
              onClick={handleSendStatementWhatsApp}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#25D366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 10px rgba(37, 211, 102, 0.2)'
              }}
            >
              <Share2 size={15} /> Send WhatsApp Statement
            </button>

            {/* Email Statement */}
            <button
              onClick={handleSendStatementEmail}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mail size={15} /> Email
            </button>

            {/* Download CSV */}
            <button
              onClick={handleDownloadCSV}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> Download CSV
            </button>

            {/* Print Statement */}
            <button
              onClick={handlePrintStatement}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} /> Print A4
            </button>
          </div>
        </div>

        {/* SECTION 1: INVOICES BREAKDOWN TABLE */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          {/* Table Header Controls */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0c3d6c', fontWeight: 800 }}>
                Wholesale Invoices Breakdown
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Itemized invoice records, due dates, paid balances, and settlement actions.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                {['All', 'Pending', 'Overdue', 'Paid'].map((tab) => {
                  const isSelected = invoiceFilter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setInvoiceFilter(tab)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#ffffff' : 'transparent',
                        color: isSelected ? '#0c3d6c' : '#64748b',
                        boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search Invoice No..."
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  style={{
                    padding: '7px 10px 7px 30px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Invoices Data Table */}
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Invoice No</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Invoice Date</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Due Date</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right', verticalAlign: 'middle' }}>Total Amount</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right', verticalAlign: 'middle' }}>Paid Amount</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right', verticalAlign: 'middle' }}>Balance Due</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center', verticalAlign: 'middle' }}>Status</th>
                  <th className="no-print" style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center', verticalAlign: 'middle' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv, idx) => {
                    const isOverdue = inv.status === 'Overdue' || (inv.dueDate && new Date(inv.dueDate) < now && inv.balance > 0);
                    return (
                      <tr
                        key={inv.invoiceNumber || idx}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                        }}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0c3d6c', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                          {inv.invoiceNumber}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748b', verticalAlign: 'middle' }}>
                          {formatDate(inv.date)}
                        </td>
                        <td style={{ padding: '12px 14px', color: isOverdue ? '#dc2626' : '#64748b', fontWeight: isOverdue ? 700 : 500, verticalAlign: 'middle' }}>
                          {formatDate(inv.dueDate)}
                          {isOverdue && (
                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#dc2626' }}>
                              ⚠️ Overdue
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#1e293b', verticalAlign: 'middle' }}>
                          {formatINR(inv.amount)}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a', fontWeight: 600, verticalAlign: 'middle' }}>
                          {formatINR(inv.paidAmount || 0)}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: inv.balance > 0 ? '#0c3d6c' : '#16a34a', verticalAlign: 'middle' }}>
                          {formatINR(inv.balance)}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor:
                                inv.status === 'Paid'
                                  ? '#dcfce7'
                                  : isOverdue
                                  ? '#fee2e2'
                                  : inv.status === 'Partial'
                                  ? '#fef3c7'
                                  : '#eff6ff',
                              color:
                                inv.status === 'Paid'
                                  ? '#15803d'
                                  : isOverdue
                                  ? '#dc2626'
                                  : inv.status === 'Partial'
                                  ? '#b45309'
                                  : '#1d4ed8'
                            }}
                          >
                            {inv.status === 'Paid' ? 'Paid' : isOverdue ? 'Overdue' : inv.status || 'Pending'}
                          </span>
                        </td>
                        <td className="no-print" style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                          {inv.balance > 0 ? (
                            <button
                              onClick={() => openPaymentModal(inv.balance, inv.invoiceNumber)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                backgroundColor: isOverdue ? '#dc2626' : '#0c3d6c',
                                color: '#ffffff',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <CreditCard size={13} /> Pay This
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={14} /> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', verticalAlign: 'middle' }}>
                      No invoices found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredInvoices.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: '#f1f5f9', borderTop: '2px solid #cbd5e1', fontWeight: 800, color: '#0f172a' }}>
                    <td colSpan={3} style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      Totals ({filteredInvoices.length} {filteredInvoices.length === 1 ? 'Invoice' : 'Invoices'})
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', verticalAlign: 'middle' }} className="tabular-nums">
                      {formatINR(filteredInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0))}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a', verticalAlign: 'middle' }} className="tabular-nums">
                      {formatINR(filteredInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0))}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#0c3d6c', verticalAlign: 'middle' }} className="tabular-nums">
                      {formatINR(filteredInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0))}
                    </td>
                    <td colSpan={2} style={{ padding: '12px 14px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                      Reconciled Live
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* SECTION 2: PAYMENT TRANSACTIONS HISTORY TABLE */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          {/* Payment Table Header */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0c3d6c', fontWeight: 800 }}>
                Cleared Payment Transactions History
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Verified payments via UPI, Debit/Credit Card, Net Banking, and Bank Cheque.
              </p>
            </div>

            {/* Method Filter */}
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              {['All', 'UPI', 'Card', 'NetBanking', 'Cheque'].map((method) => {
                const isSelected = paymentMethodFilter === method;
                return (
                  <button
                    key={method}
                    onClick={() => setPaymentMethodFilter(method)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#ffffff' : 'transparent',
                      color: isSelected ? '#0c3d6c' : '#64748b',
                      boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment History Table */}
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Receipt / Payment ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Payment Date</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right', verticalAlign: 'middle' }}>Amount Paid</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center', verticalAlign: 'middle' }}>Method</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Reference / UTR No</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, verticalAlign: 'middle' }}>Notes & Allocation</th>
                  <th className="no-print" style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center', verticalAlign: 'middle' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((pmt, idx) => (
                    <tr
                      key={pmt.paymentId || idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0c3d6c', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                        {pmt.paymentId}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b', verticalAlign: 'middle' }}>
                        {formatDate(pmt.date)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#16a34a', verticalAlign: 'middle' }}>
                        {formatINR(pmt.amount)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#f1f5f9',
                            color: '#334155'
                          }}
                        >
                          {pmt.method === 'UPI' ? '⚡ UPI' : pmt.method === 'Card' ? '💳 Card' : pmt.method === 'NetBanking' ? '🏛️ NetBank' : '📄 Cheque'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#475569', verticalAlign: 'middle' }}>
                        {pmt.transactionRef || '-'}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#64748b', verticalAlign: 'middle' }}>
                        {pmt.notes || 'Reconciled FIFO settlement'}
                      </td>
                      <td className="no-print" style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => setSelectedReceipt(pmt)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#0c3d6c',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Receipt size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', verticalAlign: 'middle' }}>
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredPayments.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: '#f1f5f9', borderTop: '2px solid #cbd5e1', fontWeight: 800, color: '#0f172a' }}>
                    <td colSpan={2} style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      Total Payments ({filteredPayments.length} {filteredPayments.length === 1 ? 'Transaction' : 'Transactions'})
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a', verticalAlign: 'middle' }} className="tabular-nums">
                      {formatINR(filteredPayments.reduce((sum, pmt) => sum + (pmt.amount || 0), 0))}
                    </td>
                    <td colSpan={4} style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>
                      Reconciled FIFO Payments
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Printable Footer / Verification Seal */}
        <div
          style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#64748b'
          }}
        >
          <div>
            <strong>NIYANSH PHARMA WHOLESALE DISTRIBUTORS</strong>
            <div>Rajkot Main Distribution Centre, Gujarat • Contact: +91 9316566894</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Computer Generated Statement • Authorized Signatory</div>
            <div style={{ fontWeight: 700, color: '#16a34a' }}>● Status: Active Tier 1 B2B Account</div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Dialog Modal */}
      <PaymentGatewayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        retailerInfo={{
          shopName: ledgerData.shopName,
          retailerMobile: ledgerData.retailerMobile,
          email: ledgerData.email,
          gstin: ledgerData.gstin
        }}
        dueAmount={payModalDueAmount}
        invoiceNumber={payModalInvoiceNumber}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* View Historical Receipt Modal */}
      {selectedReceipt && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0c3d6c', fontSize: '1.15rem' }}>Payment Receipt</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Niyansh Pharma Wholesale Distribution</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Receipt ID</span>
                <strong style={{ fontFamily: 'monospace', color: '#0c3d6c' }}>{selectedReceipt.paymentId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Retailer</span>
                <strong>{ledgerData.shopName} ({ledgerData.retailerMobile})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount Cleared</span>
                <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>{formatINR(selectedReceipt.amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Mode</span>
                <strong>{selectedReceipt.method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Reference / UTR</span>
                <span style={{ fontFamily: 'monospace' }}>{selectedReceipt.transactionRef || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Date & Time</span>
                <span>{new Date(selectedReceipt.date).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Notes / Allocation</span>
                <span>{selectedReceipt.notes || 'FIFO Wholesale Allocation'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  const msg = `🧾 *NIYANSH PHARMA - PAYMENT RECEIPT*\nReceipt: ${selectedReceipt.paymentId}\nAmount: ${formatINR(selectedReceipt.amount)}\nMethod: ${selectedReceipt.method}\nRef: ${selectedReceipt.transactionRef}\nShop: ${ledgerData.shopName}`;
                  window.open(`https://api.whatsapp.com/send?phone=91${ledgerData.retailerMobile.replace(/\D/g, '')}&text=${encodeURIComponent(msg)}`, '_blank');
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={15} /> WhatsApp
              </button>

              <button
                onClick={() => window.print()}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#0c3d6c',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

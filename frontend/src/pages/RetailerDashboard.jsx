import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  User,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  CreditCard,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Percent,
  Search,
  Printer,
  Share2,
  RefreshCw,
  Zap,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  Lock,
  MessageCircle,
  Truck
} from 'lucide-react';
import PaymentGatewayModal from '../components/PaymentGatewayModal';

export default function RetailerDashboard() {
  const { user, token, logout, openAuth, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'orders' | 'invoices' | 'schemes'
  const [activeTab, setActiveTab] = useState('orders');

  // Dynamic States
  const [orders, setOrders] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payInvoiceNumber, setPayInvoiceNumber] = useState('');

  // Toast / notification
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const userMobile = user?.phone || user?.mobile || '9825012345';
  const cleanMobile = userMobile.toString().replace(/\D/g, '').replace(/^91/, '').slice(-10);
  const shopName = user?.companyName || user?.company || user?.name || 'Retail Pharmacy';

  // 1. Fetch Orders for this retailer
  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const queryParams = new URLSearchParams();
        if (cleanMobile) queryParams.append('retailerMobile', cleanMobile);
        queryParams.append('limit', '50');

        const res = await fetch(`/api/orders?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setOrders(data.orders || []);
          }
        }
      } catch (err) {
        console.error('Error fetching retailer orders:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [cleanMobile]);

  // 2. Fetch Ledger & Outstanding Balance
  useEffect(() => {
    let isMounted = true;
    const fetchLedger = async () => {
      setLoadingLedger(true);
      try {
        const target = cleanMobile || '9825012345';
        const res = await fetch(`/api/ledger/${target}?shopName=${encodeURIComponent(shopName)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setLedger(data.ledger);
          }
        }
      } catch (err) {
        console.error('Error fetching retailer ledger:', err);
      } finally {
        if (isMounted) setLoadingLedger(false);
      }
    };

    fetchLedger();
    return () => { isMounted = false; };
  }, [cleanMobile, shopName]);

  // 3. Fetch Featured High-Margin Schemes & Products
  useEffect(() => {
    let isMounted = true;
    const fetchSchemes = async () => {
      setLoadingSchemes(true);
      try {
        const res = await fetch('/api/products?limit=12&sort=featured');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSchemes(data.products || []);
          }
        }
      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        if (isMounted) setLoadingSchemes(false);
      }
    };

    fetchSchemes();
    return () => { isMounted = false; };
  }, []);

  // Format currency helper
  const formatINR = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Open Payment Modal for custom amount or specific invoice
  const handleOpenPayment = (amount, invNum = '') => {
    setPayAmount(amount || ledger?.outstandingBalance || 0);
    setPayInvoiceNumber(invNum);
    setIsPaymentOpen(true);
  };

  // Payment Success Handler
  const handlePaymentSuccess = (receipt, updatedLedger) => {
    if (updatedLedger) setLedger(updatedLedger);
    showToast(`Payment of ₹${receipt.amount} recorded successfully! Receipt: ${receipt.paymentId}`);
  };

  // Share Statement via WhatsApp
  const handleShareStatement = async () => {
    try {
      const res = await fetch('/api/ledger/send-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retailerMobile: cleanMobile, channel: 'whatsapp' }),
      });
      const data = await res.json();
      if (data.success && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback WhatsApp message
        const text = `*NIYANSH PHARMA - STATEMENT REQUEST*\nStore: ${shopName}\nMobile: ${cleanMobile}\nBalance: ${formatINR(ledger?.outstandingBalance || 0)}`;
        window.open(`https://api.whatsapp.com/send?phone=919909923130&text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch {
      window.open(`https://api.whatsapp.com/send?phone=919909923130&text=Requesting%20Statement%20for%20${encodeURIComponent(shopName)}`, '_blank');
    }
  };

  // WhatsApp 1-Click Reorder
  const handleWhatsAppReorder = (order) => {
    const itemsSummary = (order.items || [])
      .map((it, idx) => `${idx + 1}. ${it.productName} (${it.company || 'DAXIA'}) - ${it.boxes} Boxes`)
      .join('\n');
    const msg = `*RE-ORDER REQUEST - NIYANSH PHARMA*\nStore: ${order.shopName || shopName}\nMobile: ${order.retailerMobile || cleanMobile}\nPrevious Order: ${order.orderNumber}\n\n*ITEMS TO REORDER:*\n${itemsSummary}\n\nPlease confirm dispatch and PTR invoice.`;
    window.open(`https://api.whatsapp.com/send?phone=919909923130&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items?.some((it) => it.productName?.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const outstandingBal = ledger?.outstandingBalance || 0;
  const creditLimit = ledger?.creditLimit || 150000;
  const availableCredit = Math.max(0, creditLimit - outstandingBal);
  const creditUsedPercent = Math.min(100, Math.round((outstandingBal / creditLimit) * 100));

  // Overdue count
  const now = new Date();
  const overdueInvoices = (ledger?.invoices || []).filter(
    (inv) => inv.balance > 0 && (inv.status === 'Overdue' || (inv.dueDate && new Date(inv.dueDate) < now))
  );
  const overdueTotal = overdueInvoices.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  // If not logged in, show verified chemist access barrier
  if (!isLoggedIn && !user) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#f8fafc', padding: '40px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07)', padding: '36px 24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#eff6ff', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            B2B Chemist Portal Login
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '24px' }}>
            To view confidential <strong>Wholesale PTR Pricing</strong>, book high-speed bulk orders, and access your <strong>Store Ledger & Credit Statements</strong>, please sign in with your verified pharmacy credentials.
          </p>

          <div style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '14px', marginBottom: '24px', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#047857', fontWeight: '700' }}>
              <ShieldCheck size={16} /> Exclusive Chemist Features:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
              <li>Direct WHO-GMP PTR Wholesale Rates (Up to 35% margin)</li>
              <li>Live Stock Availability & 10+1 / 15+2 Bonus Schemes</li>
              <li>Outstanding Balance, Invoices & UPI Settlement</li>
              <li>Instant WhatsApp Tax Bill Dispatch</li>
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={openAuth}
              style={{
                backgroundColor: 'var(--primary-blue)',
                color: '#ffffff',
                border: 'none',
                padding: '13px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(12, 61, 108, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={18} /> Sign In to Chemist Account
            </button>
            <Link
              to="/products"
              style={{
                color: 'var(--text-medium)',
                fontSize: '0.85rem',
                textDecoration: 'none',
                padding: '8px',
                fontWeight: '600'
              }}
            >
              Browse Public Medicine Catalog (MRP Only)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', paddingBottom: '90px' }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#065f46',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: '600',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top B2B Header & Chemist Identity Banner */}
      <section style={{ backgroundColor: '#0c3d6c', color: '#ffffff', padding: '30px 16px', borderBottom: '4px solid #388e3c' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            
            {/* Store & Chemist Details */}
            <div style={{ flex: '1 1 350px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }}></span>
                WHO-GMP VERIFIED B2B RETAILER PORTAL
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: '800', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={26} color="#38bdf8" />
                <span>{shopName}</span>
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: '#cbd5e1', fontSize: '0.85rem', marginTop: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} color="#94a3b8" /> {user?.name || 'Authorized Chemist'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} color="#94a3b8" /> +91 {cleanMobile}
                </span>
                {user?.gstin && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc', padding: '1px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '0.75rem' }}>
                    GST: {user.gstin}
                  </span>
                )}
                {user?.drugLicense && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#86efac', padding: '1px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '0.75rem' }}>
                    DL: {user.drugLicense}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions (Desktop & Tablet) */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/quick-order"
                style={{
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Zap size={16} /> Quick Order Portal
              </Link>

              <button
                onClick={handleShareStatement}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Send ledger statement to WhatsApp"
              >
                <MessageCircle size={16} color="#4ade80" /> WhatsApp Statement
              </button>

              <button
                onClick={logout}
                style={{
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem'
                }}
                title="Sign out of B2B portal"
              >
                <LogOut size={15} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px' }}>

        {/* 4 Financial & Order KPI Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Outstanding Due Balance */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: outstandingBal > 0 ? '#ef4444' : '#10b981' }}></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Outstanding Dues
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: outstandingBal > 0 ? '#fef2f2' : '#ecfdf5',
                  color: outstandingBal > 0 ? '#dc2626' : '#059669'
                }}>
                  {outstandingBal > 0 ? (overdueInvoices.length > 0 ? `${overdueInvoices.length} Overdue` : 'Pending') : 'Clean'}
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>
                {loadingLedger ? '...' : formatINR(outstandingBal)}
              </div>
              {overdueTotal > 0 && (
                <div style={{ fontSize: '0.76rem', color: '#b91c1c', fontWeight: '600' }}>
                  ⚠️ Overdue &gt; 21 days: {formatINR(overdueTotal)}
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleOpenPayment(outstandingBal)}
                disabled={outstandingBal <= 0}
                style={{
                  flex: 1,
                  backgroundColor: outstandingBal > 0 ? '#0c3d6c' : '#e2e8f0',
                  color: outstandingBal > 0 ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: outstandingBal > 0 ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={14} /> Pay Dues Now
              </button>
              <Link
                to="/outstanding"
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  color: 'var(--text-medium)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="View Full Ledger"
              >
                Ledger
              </Link>
            </div>
          </div>

          {/* Card 2: Wholesale Credit Limit */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#3b82f6' }}></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Available Credit Limit
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  {100 - creditUsedPercent}% Avail
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#2563eb', marginBottom: '4px' }}>
                {loadingLedger ? '...' : formatINR(availableCredit)}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-light)' }}>
                Total Allocated Limit: {formatINR(creditLimit)}
              </div>
            </div>

            {/* Credit progress meter */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ height: '7px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${creditUsedPercent}%`,
                  backgroundColor: creditUsedPercent > 85 ? '#ef4444' : creditUsedPercent > 60 ? '#f59e0b' : '#10b981',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px' }}>
                <span>Used: {creditUsedPercent}%</span>
                <span>Max: {formatINR(creditLimit)}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Wholesale Orders Summary */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#8b5cf6' }}></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Orders Placed
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                  Wholesale
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>
                {loadingOrders ? '...' : orders.length}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-medium)' }}>
                {orders[0] ? `Latest: ${orders[0].orderNumber} (${new Date(orders[0].createdAt).toLocaleDateString('en-IN')})` : 'No orders placed yet'}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: 'var(--primary-blue)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Package size={14} /> View Order History
              </button>
            </div>
          </div>

          {/* Card 4: Chemist Margins & Active Bonus Schemes */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#ea580c' }}></div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Live Bonus Schemes
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#ea580c' }}>
                  Active Deals
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ea580c', marginBottom: '4px' }}>
                10+1 & 15+2
              </div>
              <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: '700' }}>
                ✨ Up to 40% Chemist Profit Margin
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setActiveTab('schemes')}
                style={{
                  width: '100%',
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: '#ea580c',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} /> View Margin Schemes
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '2px'
        }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              fontWeight: '700',
              color: activeTab === 'orders' ? 'var(--primary-blue)' : 'var(--text-medium)',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary-blue)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              marginBottom: '-2px'
            }}
          >
            <Package size={17} />
            <span>My Wholesale Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              fontWeight: '700',
              color: activeTab === 'invoices' ? 'var(--primary-blue)' : 'var(--text-medium)',
              borderBottom: activeTab === 'invoices' ? '3px solid var(--primary-blue)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              marginBottom: '-2px'
            }}
          >
            <FileText size={17} />
            <span>Invoices & Statements ({ledger?.invoices?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              fontWeight: '700',
              color: activeTab === 'schemes' ? '#ea580c' : 'var(--text-medium)',
              borderBottom: activeTab === 'schemes' ? '3px solid #ea580c' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              marginBottom: '-2px'
            }}
          >
            <Sparkles size={17} />
            <span>High-Margin Schemes & PTR Rates</span>
          </button>
        </div>

        {/* TAB 1: Wholesale Orders & Live Tracking */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter & Search Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
              backgroundColor: '#ffffff',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px', maxWidth: '400px', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px' }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search order number, medicine name..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: '600' }}>Status:</span>
                {['All', 'Booked', 'Confirmed', 'Dispatched', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      border: '1px solid',
                      borderColor: orderStatusFilter === st ? 'var(--primary-blue)' : '#e2e8f0',
                      backgroundColor: orderStatusFilter === st ? '#eff6ff' : '#ffffff',
                      color: orderStatusFilter === st ? 'var(--primary-blue)' : 'var(--text-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Table */}
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <RefreshCw size={24} className="spin" style={{ color: 'var(--primary-blue)' }} />
                <p style={{ marginTop: '8px', color: 'var(--text-medium)', fontSize: '0.9rem' }}>Loading wholesale orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Package size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)' }}>No Orders Found</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.85rem', maxWidth: '400px', margin: '4px auto 16px auto' }}>
                  {orderSearch ? 'No orders match your search keyword.' : 'You haven’t booked any wholesale orders yet.'}
                </p>
                <Link
                  to="/quick-order"
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={15} /> Book First B2B Order
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredOrders.map((order) => {
                  const statusColors = {
                    Booked: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
                    Confirmed: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
                    Dispatched: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
                    Delivered: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
                    Cancelled: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' }
                  };
                  const st = statusColors[order.orderStatus] || statusColors.Booked;

                  return (
                    <div
                      key={order._id || order.orderNumber}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '16px 20px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      {/* Top Header of Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                              {order.orderNumber}
                            </span>
                            <span style={{
                              backgroundColor: st.bg,
                              color: st.text,
                              border: `1px solid ${st.border}`,
                              padding: '2px 8px',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: '700'
                            }}>
                              {order.orderStatus || 'Booked'}
                            </span>
                            <span style={{
                              backgroundColor: order.paymentStatus === 'Paid' ? '#ecfdf5' : '#fef2f2',
                              color: order.paymentStatus === 'Paid' ? '#047857' : '#b91c1c',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: '700'
                            }}>
                              Payment: {order.paymentStatus || 'Pending'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '2px' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Amount & Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>Bill Amount:</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                              {formatINR(order.grandTotal)}
                            </div>
                          </div>

                          <button
                            onClick={() => handleWhatsAppReorder(order)}
                            style={{
                              backgroundColor: '#ecfdf5',
                              color: '#065f46',
                              border: '1px solid #a7f3d0',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title="Re-order these exact items via WhatsApp"
                          >
                            <RepeatIcon size={14} /> Re-Order
                          </button>
                        </div>
                      </div>

                      {/* Items Preview Chips */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-medium)', marginBottom: '6px' }}>
                          Ordered Items ({order.items?.length || 0}):
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {(order.items || []).map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                color: 'var(--text-dark)'
                              }}
                            >
                              <strong>{item.productName}</strong>
                              <span style={{ color: 'var(--text-light)', marginLeft: '4px' }}>
                                × {item.boxes} Box{item.boxes > 1 ? 'es' : ''} ({formatINR(item.itemTotal)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Outstanding Invoices & Ledger Breakdown */}
        {activeTab === 'invoices' && (
          <div>
            {/* Action Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                  Store Invoices & FIFO Settlement Table
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: '2px 0 0 0' }}>
                  Payments automatically settle oldest unpaid bills in first-in-first-out order.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleOpenPayment(outstandingBal)}
                  disabled={outstandingBal <= 0}
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: outstandingBal > 0 ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CreditCard size={15} /> Settle Total Dues
                </button>
                <button
                  onClick={handleShareStatement}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: 'var(--text-dark)',
                    border: '1px solid #cbd5e1',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Share2 size={15} /> WhatsApp Statement
                </button>
              </div>
            </div>

            {/* Invoices List */}
            {loadingLedger ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                <RefreshCw size={24} className="spin" style={{ color: 'var(--primary-blue)' }} />
                <p style={{ marginTop: '8px', color: 'var(--text-medium)' }}>Loading store statement...</p>
              </div>
            ) : !ledger?.invoices || ledger.invoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                <FileText size={40} color="#94a3b8" />
                <p style={{ marginTop: '8px', color: 'var(--text-medium)' }}>No outstanding invoices found for this store.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-medium)', fontWeight: '700' }}>
                        <th style={{ padding: '12px 16px' }}>Invoice #</th>
                        <th style={{ padding: '12px 16px' }}>Date</th>
                        <th style={{ padding: '12px 16px' }}>Due Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Bill Total</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Paid Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Balance Due</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.invoices.map((inv, idx) => {
                        const isOverdue = inv.balance > 0 && (inv.status === 'Overdue' || (inv.dueDate && new Date(inv.dueDate) < now));
                        const statusBadge = inv.balance === 0
                          ? { bg: '#ecfdf5', text: '#059669', label: 'Paid' }
                          : isOverdue
                          ? { bg: '#fef2f2', text: '#dc2626', label: 'Overdue' }
                          : { bg: '#eff6ff', text: '#2563eb', label: inv.paidAmount > 0 ? 'Partial' : 'Pending' };

                        return (
                          <tr key={inv.invoiceNumber || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-blue)' }}>
                              {inv.invoiceNumber}
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-medium)' }}>
                              {new Date(inv.date).toLocaleDateString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 16px', color: isOverdue ? '#dc2626' : 'var(--text-medium)', fontWeight: isOverdue ? '700' : '400' }}>
                              {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : '-'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700' }}>
                              {formatINR(inv.amount)}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                              {formatINR(inv.paidAmount || 0)}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: inv.balance > 0 ? '#b91c1c' : '#059669', fontWeight: '800' }}>
                              {formatINR(inv.balance)}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <span style={{
                                backgroundColor: statusBadge.bg,
                                color: statusBadge.text,
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.72rem',
                                fontWeight: '700'
                              }}>
                                {statusBadge.label}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {inv.balance > 0 ? (
                                <button
                                  onClick={() => handleOpenPayment(inv.balance, inv.invoiceNumber)}
                                  style={{
                                    backgroundColor: '#eff6ff',
                                    color: 'var(--primary-blue)',
                                    border: '1px solid #bfdbfe',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Pay Bill
                                </button>
                              ) : (
                                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '600' }}>
                                  ✓ Cleared
                                </span>
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
          </div>
        )}

        {/* TAB 3: High-Margin Schemes & Recommended Stocks */}
        {activeTab === 'schemes' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                High-Margin Formulations & Active Bonus Schemes
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: '2px 0 0 0' }}>
                Exclusive chemist purchase rates (PTR) with guaranteed WHO-GMP manufacturing certificates.
              </p>
            </div>

            {loadingSchemes ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
                <RefreshCw size={24} className="spin" style={{ color: 'var(--primary-blue)' }} />
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {schemes.map((p) => {
                  const ptr = Number(p.price) || 0;
                  const mrp = Number(p.mrp) || ptr * 1.35;
                  const marginPct = mrp > ptr ? Math.round(((mrp - ptr) / mrp) * 100) : 25;

                  return (
                    <div
                      key={p._id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div>
                        {/* Company & Scheme Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary-blue)', fontWeight: '800', textTransform: 'uppercase' }}>
                            {p.company || 'DAXIA'}
                          </span>
                          <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800' }}>
                            {marginPct}% MARGIN
                          </span>
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                          {p.name}
                        </h4>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-medium)', marginBottom: '8px' }}>
                          {p.composition || p.form || 'Pharmaceutical formulation'}
                        </div>

                        {p.scheme && (
                          <div style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                            🎁 Scheme: {p.scheme}
                          </div>
                        )}
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>Wholesale PTR:</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                              {formatINR(ptr)}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>Retail MRP:</span>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-medium)', textDecoration: 'line-through' }}>
                              {formatINR(mrp)}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/quick-order?search=${encodeURIComponent(p.name)}`}
                          style={{
                            width: '100%',
                            backgroundColor: '#0c3d6c',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            textAlign: 'center',
                            display: 'block',
                            boxSizing: 'border-box'
                          }}
                        >
                          Book into Quick Order
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Payment Gateway Modal */}
      {isPaymentOpen && (
        <PaymentGatewayModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          dueAmount={payAmount}
          invoiceNumber={payInvoiceNumber}
          retailerInfo={{
            shopName,
            retailerMobile: cleanMobile,
            gstin: user?.gstin || '',
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

function RepeatIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
      <polyline points="7 23 3 19 7 15"></polyline>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>
  );
}

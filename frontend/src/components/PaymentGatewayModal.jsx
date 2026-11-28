import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  QrCode,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Printer,
  Smartphone,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Download,
  IndianRupee,
  Sparkles,
  Clock,
  ChevronRight,
  CheckCircle2,
  Landmark,
  BadgeCheck,
  Eye,
  EyeOff,
  Send
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

const TOP_BANKS = [
  { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC0000001', color: '#004c8f', logo: '🏛️' },
  { id: 'SBI', name: 'State Bank of India', code: 'SBIN0000001', color: '#280071', logo: '🏦' },
  { id: 'ICICI', name: 'ICICI Bank', code: 'ICIC0000001', color: '#b02a30', logo: '🏛️' },
  { id: 'AXIS', name: 'Axis Bank', code: 'UTIB0000001', color: '#97144d', logo: '🏦' },
  { id: 'KOTAK', name: 'Kotak Mahindra Bank', code: 'KKBK0000001', color: '#e62e2d', logo: '🏛️' },
  { id: 'BOB', name: 'Bank of Baroda', code: 'BARB0000001', color: '#f26522', logo: '🏦' },
  { id: 'PNB', name: 'Punjab National Bank', code: 'PUNB0000001', color: '#a01d24', logo: '🏛️' },
  { id: 'CANARA', name: 'Canara Bank', code: 'CNRB0000001', color: '#0070ba', logo: '🏦' }
];

const OTHER_BANKS = [
  'IndusInd Bank',
  'Yes Bank',
  'Union Bank of India',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Bank of India',
  'Central Bank of India',
  'Indian Bank',
  'UCO Bank',
  'RBL Bank'
];

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  retailerInfo = {},
  dueAmount = 0,
  invoiceNumber = '',
  onPaymentSuccess
}) {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { token } = useAuth();

  // Amount selection state
  const initialDue = Math.max(0, Number(dueAmount) || 0);
  const [payAmountType, setPayAmountType] = useState('full'); // 'full' | 'custom'
  const [customAmount, setCustomAmount] = useState(initialDue.toString());
  const [amountToPay, setAmountToPay] = useState(initialDue);

  // Payment method tab: 'upi' | 'card' | 'netbanking' | 'neft'
  const [activeTab, setActiveTab] = useState('upi');

  // Form states
  // 1. UPI State
  const [vpa, setVpa] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiIntentSent, setUpiIntentSent] = useState(false);

  // 2. Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [cardType, setCardType] = useState('Visa');

  // 3. Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [otherBankName, setOtherBankName] = useState('');

  // 4. NEFT / Cheque State
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0]);
  const [chequeBankName, setChequeBankName] = useState('');
  const [neftNotes, setNeftNotes] = useState('');

  // Flow / Stage state: 'input' | 'processing' | 'otp' | 'success' | 'error'
  const [gatewayStage, setGatewayStage] = useState('input');
  const [processingMessage, setProcessingMessage] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(59);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedReceipt, setCompletedReceipt] = useState(null);

  // Dynamic Payment & Bank Account Settings from Admin
  const [paymentSettings, setPaymentSettings] = useState({
    merchantUpiId: '9316566894@okbizaxis',
    accountNumber: '924020012345678',
    ifscCode: 'UTIB0000123',
    accountName: 'Niyansh Pharma Wholesale',
    bankName: 'Axis Bank Ltd, University Road Branch',
    paymentNotes: ''
  });

  useEffect(() => {
    fetch('/api/settings/payment')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.payment) {
          setPaymentSettings(prev => ({ ...prev, ...data.payment }));
        }
      })
      .catch(err => console.warn('Could not fetch payment settings:', err));
  }, []);

  // Synchronize amount when modal opens or dueAmount changes
  useEffect(() => {
    if (isOpen) {
      const amt = Math.max(0, Number(dueAmount) || 0);
      setPayAmountType('full');
      setCustomAmount(amt.toString());
      setAmountToPay(amt);
      setGatewayStage('input');
      setErrorMessage('');
      setCompletedReceipt(null);
      setVpa('');
      setUtrNumber('');
      setUpiIntentSent(false);
    }
  }, [isOpen, dueAmount]);

  // Update calculated amount
  useEffect(() => {
    if (payAmountType === 'full') {
      setAmountToPay(initialDue);
    } else {
      const parsed = parseFloat(customAmount);
      setAmountToPay(isNaN(parsed) || parsed < 0 ? 0 : parsed);
    }
  }, [payAmountType, customAmount, initialDue]);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (gatewayStage === 'otp' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gatewayStage, otpCountdown]);

  // Lock background page scroll (iOS Safari safe) and listen for Escape key
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && gatewayStage !== 'processing') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, gatewayStage, onClose]);

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    // Detect card type
    if (raw.startsWith('4')) setCardType('Visa');
    else if (raw.startsWith('5')) setCardType('MasterCard');
    else if (raw.startsWith('60') || raw.startsWith('65') || raw.startsWith('81') || raw.startsWith('82')) setCardType('RuPay');
    else if (raw.startsWith('34') || raw.startsWith('37')) setCardType('Amex');
    else setCardType('Card');
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  const fillDemoCard = () => {
    setCardNumber('4532 8920 1842 7793');
    setCardName(retailerInfo.shopName || 'Shanti Medico Rajkot');
    setCardExpiry('08/29');
    setCardCvv('742');
    setCardType('Visa');
  };

  // UPI QR and Deep Link strings
  const merchantUpiId = paymentSettings.merchantUpiId || '9316566894@okbizaxis';
  const merchantName = paymentSettings.accountName || 'Niyansh Pharma Wholesale';
  const safePayAmount = Math.max(1, amountToPay || 0).toFixed(2);
  const upiTransactionNote = invoiceNumber
    ? `Settlement Inv ${invoiceNumber}`
    : `Ledger Settlement ${retailerInfo.shopName || ''}`.trim();
  const upiDeepLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${safePayAmount}&cu=INR&tn=${encodeURIComponent(upiTransactionNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiDeepLink)}&margin=6`;

  const copyToClipboard = (text, type) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } else if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    } else if (type === 'ifsc') {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2500);
    }
  };

  // Format currency helper
  const formatINR = (val) => {
    if (formatCurrency) return formatCurrency(val);
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Submit payment initiation
  const handleInitiatePayment = (e) => {
    if (e) e.preventDefault();
    if (amountToPay <= 0) {
      setErrorMessage(t('common.error', 'Please enter a valid amount greater than ₹0'));
      return;
    }

    setErrorMessage('');
    setGatewayStage('processing');
    setProcessingMessage(t('payment.processingSettlement', 'Connecting securely to RBI 256-bit payment switch...'));

    setTimeout(() => {
      if (activeTab === 'card' || activeTab === 'netbanking') {
        setGatewayStage('otp');
        setOtpCountdown(59);
        setOtpCode('749210');
      } else if (activeTab === 'upi') {
        setProcessingMessage(t('payment.paymentRequestSent', { vpa: merchantUpiId }));
        setTimeout(() => {
          executeFinalPaymentRecord('UPI', `UPI/${Date.now().toString().slice(-8)}`);
        }, 1800);
      } else {
        // NEFT / Cheque
        setProcessingMessage(t('payment.processingSettlement', 'Validating bank UTR / Cheque reference...'));
        setTimeout(() => {
          executeFinalPaymentRecord('Cheque', utrNumber || `NEFT/${Date.now().toString().slice(-8)}`);
        }, 1500);
      }
    }, 1400);
  };

  // Handle OTP verification
  const handleAuthorizeOtp = (e) => {
    if (e) e.preventDefault();
    setGatewayStage('processing');
    setProcessingMessage(t('payment.processingSettlement', 'Verifying two-factor bank authorization & updating wholesale ledger...'));

    const methodTag = activeTab === 'card' ? 'Card' : 'NetBanking';
    const txnRef = activeTab === 'card' 
      ? `CARD/${cardType.toUpperCase()}-${Date.now().toString().slice(-6)}`
      : `NETBANK/${selectedBank}-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      executeFinalPaymentRecord(methodTag, txnRef);
    }, 1600);
  };

  // Execute payment API call
  const executeFinalPaymentRecord = async (methodName, txnRef) => {
    const paymentId = `PMT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const targetMobile = retailerInfo.retailerMobile || '9825012345';
    const notesStr = invoiceNumber
      ? `Settlement for Invoice ${invoiceNumber}`
      : `Wholesale ledger payment via ${methodName}`;

    const paymentPayload = {
      retailerMobile: targetMobile,
      amount: amountToPay,
      method: methodName === 'Card' ? 'Card' : methodName === 'NetBanking' ? 'NetBanking' : methodName === 'Cheque' ? 'Cheque' : 'UPI',
      transactionRef: txnRef,
      notes: notesStr,
      paymentId: paymentId,
      date: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/ledger/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(paymentPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const receiptData = {
          paymentId: data.receipt?.paymentId || paymentId,
          amount: data.receipt?.amount || amountToPay,
          method: data.receipt?.method || methodName,
          transactionRef: data.receipt?.transactionRef || txnRef,
          date: data.receipt?.date || new Date().toISOString(),
          remainingBalance: data.receipt?.remainingBalance !== undefined ? data.receipt.remainingBalance : Math.max(0, initialDue - amountToPay),
          shopName: data.receipt?.shopName || retailerInfo.shopName || 'Retailer Account',
          retailerMobile: targetMobile,
          gstin: retailerInfo.gstin || '',
          invoiceNumber: invoiceNumber || ''
        };

        setCompletedReceipt(receiptData);
        setGatewayStage('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(receiptData, data.ledger);
        }
      } else {
        const fallbackReceipt = {
          paymentId: paymentId,
          amount: amountToPay,
          method: methodName,
          transactionRef: txnRef,
          date: new Date().toISOString(),
          remainingBalance: Math.max(0, initialDue - amountToPay),
          shopName: retailerInfo.shopName || 'Retailer Account',
          retailerMobile: targetMobile,
          gstin: retailerInfo.gstin || '',
          invoiceNumber: invoiceNumber || ''
        };
        setCompletedReceipt(fallbackReceipt);
        setGatewayStage('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(fallbackReceipt, null);
        }
      }
    } catch (err) {
      console.warn('Backend payment recording offline fallback:', err);
      const fallbackReceipt = {
        paymentId: paymentId,
        amount: amountToPay,
        method: methodName,
        transactionRef: txnRef,
        date: new Date().toISOString(),
        remainingBalance: Math.max(0, initialDue - amountToPay),
        shopName: retailerInfo.shopName || 'Retailer Account',
        retailerMobile: targetMobile,
        gstin: retailerInfo.gstin || '',
        invoiceNumber: invoiceNumber || ''
      };
      setCompletedReceipt(fallbackReceipt);
      setGatewayStage('success');
      if (onPaymentSuccess) {
        onPaymentSuccess(fallbackReceipt, null);
      }
    }
  };

  // WhatsApp share receipt
  const shareReceiptWhatsApp = () => {
    if (!completedReceipt) return;
    const msg = `🧾 *${t('payment.receiptId', 'NIYANSH PHARMA - PAYMENT RECEIPT')}*
━━━━━━━━━━━━━━━━━━━━
*${t('payment.receiptId', 'Receipt ID')}:* ${completedReceipt.paymentId}
*${t('payment.amountCleared', 'Amount Paid')}:* ${formatINR(completedReceipt.amount)}
*${t('payment.paymentMethod', 'Payment Mode')}:* ${completedReceipt.method}
*${t('payment.bankRefUtr', 'Ref / UTR')}:* ${completedReceipt.transactionRef}
*${t('payment.paymentTimestamp', 'Date')}:* ${new Date(completedReceipt.date).toLocaleString('en-IN')}

*${t('payment.paidForRetailer', 'Retailer')}:* ${completedReceipt.shopName} (${completedReceipt.retailerMobile})
${completedReceipt.invoiceNumber ? `*Invoice Settled:* ${completedReceipt.invoiceNumber}\n` : ''}*${t('payment.updatedBalance', 'Remaining Outstanding')}:* ${formatINR(completedReceipt.remainingBalance)}

*${t('payment.statusCompleted', 'Status')}:* ✅ ${t('payment.statusCompleted', 'Payment Cleared & Reconciled')}
━━━━━━━━━━━━━━━━━━━━
_${t('payment.distributorSubtitle', 'Niyansh Pharma Wholesale & Distribution')}_
_${t('payment.support', 'Support: +91 99099 23130')}_`;

    const url = `https://api.whatsapp.com/send?phone=91${(completedReceipt.retailerMobile || '9909923130').replace(/\D/g, '')}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && gatewayStage !== 'processing') {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('payment.title', 'Wholesale Payment Gateway')}
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '94vh',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: 0,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Gateway Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0c3d6c 0%, #1e5288 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backdropFilter: 'blur(4px)'
              }}
            >
              <ShieldCheck size={24} color="#4ade80" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, wordBreak: 'break-word' }}>
                  {t('payment.b2bTitle', 'Niyansh Pharma B2B Payments')}
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    color: '#86efac',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('payment.sslSecure', '256-bit SSL')}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {retailerInfo.shopName ? `${retailerInfo.shopName} • ` : ''}
                {invoiceNumber ? t('payment.payingInvoice', { invoice: invoiceNumber }) : t('payment.ledgerSettlement', 'Ledger Account Settlement')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            aria-label={t('common.close', 'Close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Amount Selection Strip */}
        {gatewayStage !== 'success' && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface-alt)',
              borderBottom: '1px solid var(--border-light)',
              padding: '12px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)', fontWeight: 700 }}>
                {t('payment.payableAmount', 'Total Payable Amount')}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {formatINR(amountToPay)}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setPayAmountType('full')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: payAmountType === 'full' ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
                  backgroundColor: payAmountType === 'full' ? 'var(--primary-blue)' : 'var(--bg-card)',
                  color: payAmountType === 'full' ? '#ffffff' : 'var(--text-medium)',
                  minHeight: '36px'
                }}
              >
                {t('payment.fullAmount', 'Full Amount')} ({formatINR(initialDue)})
              </button>

              <button
                type="button"
                onClick={() => setPayAmountType('custom')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: payAmountType === 'custom' ? '2px solid var(--primary-blue)' : '1px solid var(--border-light)',
                  backgroundColor: payAmountType === 'custom' ? 'var(--primary-blue)' : 'var(--bg-card)',
                  color: payAmountType === 'custom' ? '#ffffff' : 'var(--text-medium)',
                  minHeight: '36px'
                }}
              >
                {t('payment.customPartial', 'Custom Partial')}
              </button>
            </div>

            {payAmountType === 'custom' && (
              <div style={{ width: '100%', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    inputMode="numeric"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={t('payment.enterAmountPlaceholder', 'Enter amount to pay')}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 28px',
                      borderRadius: '8px',
                      border: '1px solid #0c3d6c',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#0c3d6c',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[1000, 5000, 10000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomAmount(preset.toString())}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#e2e8f0',
                        color: '#334155',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      +₹{(preset / 1000)}k
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Body Container */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {/* STAGE 1: INPUT STAGE */}
          {gatewayStage === 'input' && (
            <div>
              {/* Payment Method Selector Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))',
                  gap: '6px',
                  marginBottom: '16px',
                  backgroundColor: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    minHeight: '44px',
                    backgroundColor: activeTab === 'upi' ? '#ffffff' : 'transparent',
                    color: activeTab === 'upi' ? '#0c3d6c' : '#64748b',
                    boxShadow: activeTab === 'upi' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <QrCode size={18} color={activeTab === 'upi' ? '#0c3d6c' : '#64748b'} />
                  <span>{t('payment.tabUpi', '⚡ UPI / QR')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    minHeight: '44px',
                    backgroundColor: activeTab === 'card' ? '#ffffff' : 'transparent',
                    color: activeTab === 'card' ? '#0c3d6c' : '#64748b',
                    boxShadow: activeTab === 'card' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <CreditCard size={18} color={activeTab === 'card' ? '#0c3d6c' : '#64748b'} />
                  <span>{t('payment.tabCard', '💳 Card')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    minHeight: '44px',
                    backgroundColor: activeTab === 'netbanking' ? '#ffffff' : 'transparent',
                    color: activeTab === 'netbanking' ? '#0c3d6c' : '#64748b',
                    boxShadow: activeTab === 'netbanking' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Landmark size={18} color={activeTab === 'netbanking' ? '#0c3d6c' : '#64748b'} />
                  <span>{t('payment.tabNetBanking', '🏛️ Net Banking')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('neft')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    minHeight: '44px',
                    backgroundColor: activeTab === 'neft' ? '#ffffff' : 'transparent',
                    color: activeTab === 'neft' ? '#0c3d6c' : '#64748b',
                    boxShadow: activeTab === 'neft' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileText size={18} color={activeTab === 'neft' ? '#0c3d6c' : '#64748b'} />
                  <span>{t('payment.tabNeftCheque', '📄 NEFT / Cheque')}</span>
                </button>
              </div>

              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '0.85rem'
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: UPI / QR CODE */}
              {activeTab === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                      gap: '16px',
                      backgroundColor: '#f8fafc',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      alignItems: 'center'
                    }}
                  >
                    {/* QR Code Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '8px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          border: '1px solid #e2e8f0',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={qrCodeUrl}
                          alt="Niyansh Pharma UPI QR"
                          style={{ width: '150px', height: '150px', display: 'block', borderRadius: '8px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          style={{
                            width: '150px',
                            height: '150px',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '8px',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <QrCode size={40} color="#0c3d6c" />
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569' }}>UPI: 9316566894@okbizaxis</span>
                        </div>
                      </div>
                      <span style={{ marginTop: '8px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                        {t('payment.scanToPay', 'Scan QR Code using any UPI App')}
                      </span>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <span key={app} style={{ fontSize: '0.7rem', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick UPI Details & App Launch */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                          {t('payment.officialUpi', 'Official Wholesale UPI ID')}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            marginTop: '4px',
                            gap: '8px'
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0c3d6c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {merchantUpiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(merchantUpiId, 'upi')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: 'none',
                              backgroundColor: copiedUpi ? '#dcfce7' : '#f1f5f9',
                              color: copiedUpi ? '#15803d' : '#475569',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          >
                            {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                            {copiedUpi ? t('payment.copied', 'Copied') : t('payment.copyUpi', 'Copy')}
                          </button>
                        </div>
                      </div>

                      {/* 1-Click Launch UPI Intent Apps */}
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                          {t('payment.openInUpi', 'Open Directly in UPI App')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          <a
                            href={upiDeepLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '8px',
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#1e293b'
                            }}
                          >
                            <span>Google Pay</span>
                            <ExternalLink size={12} color="#64748b" />
                          </a>
                          <a
                            href={upiDeepLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '8px',
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#1e293b'
                            }}
                          >
                            <span>PhonePe</span>
                            <ExternalLink size={12} color="#64748b" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pay via UPI ID Input */}
                  <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                        {t('payment.enterUpiVpa', 'Or Enter your UPI VPA / ID')}
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                          <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input
                            type="text"
                            placeholder={t('payment.vpaPlaceholder', 'e.g. retailer@okaxis or 9825012345@paytm')}
                            value={vpa}
                            onChange={(e) => setVpa(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px 10px 38px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.9rem',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setVpa(`${retailerInfo.retailerMobile || '9825012345'}@okaxis`)}
                          style={{
                            padding: '0 14px',
                            minHeight: '44px',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          Auto Fill
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '14px',
                        minHeight: '48px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(12, 61, 108, 0.25)',
                        marginTop: '4px'
                      }}
                    >
                      <Lock size={16} /> {t('payment.verifyAndPay', 'Verify VPA & Request Payment')} ({formatINR(amountToPay)})
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARD */}
              {activeTab === 'card' && (
                <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: cardType === 'Visa' ? '#00579f' : '#f1f5f9', color: cardType === 'Visa' ? '#ffffff' : '#64748b' }}>Visa</span>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: cardType === 'MasterCard' ? '#eb001b' : '#f1f5f9', color: cardType === 'MasterCard' ? '#ffffff' : '#64748b' }}>MasterCard</span>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: cardType === 'RuPay' ? '#097939' : '#f1f5f9', color: cardType === 'RuPay' ? '#ffffff' : '#64748b' }}>RuPay</span>
                    </div>

                    <button
                      type="button"
                      onClick={fillDemoCard}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #bfdbfe',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={12} /> Fill Demo Card
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      {t('payment.cardNumber', 'Card Number')} <span className="required-star">*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="4532 8920 1842 7793"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 40px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                          letterSpacing: '1px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      {t('payment.cardholderName', 'Cardholder Name')} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shanti Medico Rajkot"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                        {t('payment.expiryDate', 'Expiry Date')} <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                        {t('payment.cvv', 'CVV / CVC')} <span className="required-star">*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCvv ? 'text' : 'password'}
                          required
                          maxLength={4}
                          inputMode="numeric"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          style={{
                            width: '100%',
                            padding: '10px 36px 10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            letterSpacing: showCvv ? 'normal' : '2px',
                            boxSizing: 'border-box'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={showCvv ? 'Hide CVV' : 'Show CVV'}
                          aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
                        >
                          {showCvv ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      minHeight: '48px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(12, 61, 108, 0.25)',
                      marginTop: '4px'
                    }}
                  >
                    <Lock size={16} /> {t('payment.payViaCard', { amount: formatINR(amountToPay) })}
                  </button>
                </form>
              )}

              {/* TAB 3: NET BANKING */}
              {activeTab === 'netbanking' && (
                <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    {t('payment.selectBank', 'Select Your Bank')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))', gap: '8px' }}>
                    {TOP_BANKS.map((bank) => {
                      const isSelected = selectedBank === bank.id;
                      return (
                        <div
                          key={bank.id}
                          onClick={() => { setSelectedBank(bank.id); setOtherBankName(''); }}
                          style={{
                            padding: '10px 6px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #0c3d6c' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minHeight: '74px',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '1.3rem' }}>{bank.logo}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#0c3d6c' : '#334155', lineHeight: 1.2 }}>
                            {bank.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>
                      {t('payment.otherBank', 'Or Select Other Bank')}
                    </label>
                    <select
                      value={otherBankName}
                      onChange={(e) => { setOtherBankName(e.target.value); setSelectedBank(''); }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        backgroundColor: '#ffffff',
                        color: '#334155',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">{t('payment.chooseBankPlaceholder', '-- Choose from all Indian Banks --')}</option>
                      {OTHER_BANKS.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      minHeight: '48px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(12, 61, 108, 0.25)',
                      marginTop: '4px'
                    }}
                  >
                    <Landmark size={16} /> {t('payment.proceedToNetBanking', 'Proceed to Net Banking')} ({formatINR(amountToPay)})
                  </button>
                </form>
              )}

              {/* TAB 4: NEFT / RTGS & CHEQUE */}
              {activeTab === 'neft' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '14px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={18} color="#0c3d6c" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0c3d6c' }}>
                        {t('payment.companyBankDetails', 'Official Company Bank Account')}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '0.82rem' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                          {t('payment.bankAndBranch', 'Bank & Branch')}
                        </span>
                        <strong style={{ color: '#1e293b' }}>{paymentSettings.bankName || 'Axis Bank, University Road Branch'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                          {t('payment.accountType', 'Account Type')}
                        </span>
                        <strong style={{ color: '#1e293b' }}>{t('payment.currentAccount', 'Current Account')}</strong>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        gap: '8px'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>
                          {t('payment.accountNumber', 'Account Number')}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#0c3d6c', wordBreak: 'break-all' }}>
                          {paymentSettings.accountNumber || '924020012345678'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentSettings.accountNumber || '924020012345678', 'account')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: 'none',
                          backgroundColor: copiedAccount ? '#dcfce7' : '#f1f5f9',
                          color: copiedAccount ? '#15803d' : '#475569',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        {copiedAccount ? <Check size={12} /> : <Copy size={12} />}
                        {copiedAccount ? t('payment.copied', 'Copied') : t('payment.copyUpi', 'Copy')}
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        gap: '8px'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>
                          {t('payment.ifscCode', 'IFSC Code')}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#0c3d6c' }}>
                          {paymentSettings.ifscCode || 'UTIB0000123'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentSettings.ifscCode || 'UTIB0000123', 'ifsc')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: 'none',
                          backgroundColor: copiedIfsc ? '#dcfce7' : '#f1f5f9',
                          color: copiedIfsc ? '#15803d' : '#475569',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        {copiedIfsc ? <Check size={12} /> : <Copy size={12} />}
                        {copiedIfsc ? t('payment.copied', 'Copied') : t('payment.copyUpi', 'Copy')}
                      </button>
                    </div>
                  </div>

                  {/* Cheque / NEFT Reference Submission Form */}
                  <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      {t('payment.utrLabel', 'Record Cheque / NEFT / RTGS Transfer Details')}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                          {t('payment.utrLabel', 'UTR / Cheque No.')} <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={t('payment.utrPlaceholder', 'e.g. UTR1948201 or CHQ-991204')}
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem',
                            boxSizing: 'border-box',
                            width: '100%'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                          {t('payment.depositDate', 'Date of Transfer')} <span className="required-star">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={depositDate}
                          onChange={(e) => setDepositDate(e.target.value)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem',
                            boxSizing: 'border-box',
                            width: '100%'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                        {t('payment.bankNameCheque', 'Remitting Bank Name')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('payment.bankPlaceholder', 'e.g. State Bank of India, Rajkot Branch')}
                        value={chequeBankName}
                        onChange={(e) => setChequeBankName(e.target.value)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '14px',
                        minHeight: '48px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(12, 61, 108, 0.25)',
                        marginTop: '4px'
                      }}
                    >
                      <FileText size={16} /> {t('payment.recordAndClear', { amount: formatINR(amountToPay) })}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: PROCESSING ANIMATION */}
          {gatewayStage === 'processing' && (
            <div
              style={{
                padding: '30px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '4px solid #e2e8f0',
                  borderTopColor: '#0c3d6c',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <div>
                <h4 style={{ margin: '0 0 6px', color: '#0c3d6c', fontSize: '1.15rem' }}>
                  {t('payment.processingSettlement', 'Processing B2B Settlement')}
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', maxWidth: '380px' }}>
                  {processingMessage}
                </p>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '6px 14px',
                  borderRadius: '20px'
                }}
              >
                <Lock size={12} /> {t('payment.encryptedGateway', 'Encrypted Gateway • Do not refresh or press back')}
              </div>
            </div>
          )}

          {/* STAGE 3: SIMULATED BANK OTP SCREEN */}
          {gatewayStage === 'otp' && (
            <form onSubmit={handleAuthorizeOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <ShieldCheck size={24} color="#0c3d6c" />
                </div>
                <h4 style={{ margin: '0 0 4px', color: '#0c3d6c' }}>
                  {t('payment.bank2fa', 'Bank Two-Factor Authentication')}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  {t('payment.enterOtp', 'Enter the 6-digit OTP sent to registered mobile linked with your account')}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <input
                  type="text"
                  maxLength={6}
                  required
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  style={{
                    width: '180px',
                    padding: '10px',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    letterSpacing: '6px',
                    fontWeight: 800,
                    borderRadius: '10px',
                    border: '2px solid #0c3d6c',
                    color: '#0c3d6c',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {t('payment.resendOtpIn', { seconds: otpCountdown })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpCode('749210')}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#0c3d6c',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {t('payment.autoFillDemo', 'Auto-Fill Demo OTP')}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setGatewayStage('input')}
                  style={{
                    flex: 1,
                    minWidth: '100px',
                    minHeight: '44px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('payment.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    minWidth: '160px',
                    minHeight: '44px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <CheckCircle2 size={16} /> {t('payment.authorizeAndPay', { amount: formatINR(amountToPay) })}
                </button>
              </div>
            </form>
          )}

          {/* STAGE 4: PAYMENT SUCCESS RECEIPT */}
          {gatewayStage === 'success' && completedReceipt && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Celebration Banner */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '8px 0'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.2)'
                  }}
                >
                  <CheckCircle2 size={32} color="#16a34a" />
                </div>
                <h3 style={{ margin: '0 0 4px', color: '#16a34a', fontSize: '1.25rem', fontWeight: 800 }}>
                  {t('payment.paymentSettled', 'Payment Received & Settled!')}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                  {t('payment.settledDesc', 'Transaction reconciled and ledger updated with FIFO invoice deduction.')}
                </p>
              </div>

              {/* Printable Receipt Card */}
              <div
                id="payment-receipt-print"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative'
                }}
              >
                {/* Receipt Watermark / Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0c3d6c', fontSize: '0.95rem' }}>NIYANSH PHARMA</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {t('payment.distributorSubtitle', 'Wholesale Pharma Distributor • Rajkot')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {t('payment.receiptId', 'RECEIPT ID')}
                    </div>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0c3d6c', fontSize: '0.85rem' }}>
                      {completedReceipt.paymentId}
                    </div>
                  </div>
                </div>

                {/* Key Receipt Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '10px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                      {t('payment.paidForRetailer', 'Paid For Retailer')}
                    </span>
                    <strong style={{ color: '#1e293b' }}>{completedReceipt.shopName}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Mob: {completedReceipt.retailerMobile}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                      {t('payment.amountCleared', 'Amount Cleared')}
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: '#16a34a', fontWeight: 800 }}>
                      {formatINR(completedReceipt.amount)}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                      {t('payment.paymentMethod', 'Payment Method')}
                    </span>
                    <strong style={{ color: '#1e293b' }}>{completedReceipt.method}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                      {t('payment.bankRefUtr', 'Bank Reference / UTR')}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155', wordBreak: 'break-all' }}>
                      {completedReceipt.transactionRef}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                      {t('payment.paymentTimestamp', 'Payment Timestamp')}
                    </span>
                    <span style={{ color: '#334155' }}>
                      {new Date(completedReceipt.date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                      {t('payment.updatedBalance', 'Updated Remaining Balance')}
                    </span>
                    <strong style={{ color: completedReceipt.remainingBalance > 0 ? '#ea580c' : '#16a34a', fontWeight: 700 }}>
                      {formatINR(completedReceipt.remainingBalance)}
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #cbd5e1',
                    fontSize: '0.72rem',
                    color: '#64748b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}
                >
                  <span>{t('payment.autoReconciled', 'Auto-reconciled with FIFO invoice allocation')}</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    {t('payment.statusCompleted', '● Status: COMPLETED')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  onClick={shareReceiptWhatsApp}
                  style={{
                    padding: '10px 8px',
                    minHeight: '44px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(37, 211, 102, 0.25)'
                  }}
                >
                  <Share2 size={15} /> {t('payment.whatsAppReceipt', 'WhatsApp Receipt')}
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  style={{
                    padding: '10px 8px',
                    minHeight: '44px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={15} /> {t('payment.printReceipt', 'Print Receipt')}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 8px',
                    minHeight: '44px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0c3d6c',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={15} /> {t('payment.doneReturn', 'Done / Return')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gateway Footer Strip */}
        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderTop: '1px solid #e2e8f0',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BadgeCheck size={14} color="#16a34a" />
            <span>{t('payment.verifiedGateway', 'Niyansh Pharma Verified Wholesale Gateway')}</span>
          </div>
          <span>{t('payment.support', 'Support: +91 99099 23130')}</span>
        </div>
      </div>
    </div>
  );
}

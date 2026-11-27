import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, Send, CheckCircle, ShoppingBag, AlertCircle, Printer, MessageCircle, Zap, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';
import { openWholesaleInvoiceWindow } from '../utils/invoiceTemplate';

function EnquiryCartModal({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, clearCart, user, token, onOpenAuth }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sync form fields with user profile details
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setAddress(user.companyName || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Phone number must contain exactly 10 numeric digits.');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'Cart Quote',
          name: name.trim().toUpperCase(),
          phone: cleanPhone,
          email: email.trim().toLowerCase(),
          address: address.trim().toUpperCase(),
          message: message.trim().toUpperCase(),
          items: itemsPayload,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          clearCart();
          onClose();
        }, 3000);
      } else {
        setErrorMessage(data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let totalGst = 0;
    let totalMrp = 0;
    let totalQty = 0;

    const lineItems = cartItems.map((item) => {
      const p = item.product || {};
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Number(user ? p.price : (p.mrp || p.price)) || 0;
      const mrp = Number(p.mrp || p.price) || 0;
      const gstRate = p.gstRate !== undefined ? Number(p.gstRate) : 12;
      const lineSub = Math.round(unitPrice * qty * 100) / 100;
      const lineGst = Math.round(((lineSub * gstRate) / 100) * 100) / 100;
      subtotal += lineSub;
      totalGst += lineGst;
      totalMrp += mrp * qty;
      totalQty += qty;

      return {
        product: p._id,
        productName: p.name,
        company: p.company || p.brand || 'Niyansh Pharma',
        form: p.form || 'Tablet',
        composition: p.composition || '',
        packing: p.packing || 'Standard Pack',
        unitsPerBox: 1,
        boxes: qty,
        totalUnits: qty,
        unitPrice,
        mrp,
        gstRate,
        lineSubtotal: lineSub,
        lineGst,
        lineTotal: Math.round((lineSub + lineGst) * 100) / 100,
        scheme: p.scheme || ''
      };
    });

    const taxableSubtotal = Math.round(subtotal * 100) / 100;
    const totalGstAmount = Math.round(totalGst * 100) / 100;
    const grandTotal = Math.round((taxableSubtotal + totalGstAmount) * 100) / 100;
    const savings = Math.max(0, Math.round((totalMrp - taxableSubtotal) * 100) / 100);

    return { taxableSubtotal, totalGstAmount, grandTotal, savings, totalQty, lineItems };
  }, [cartItems, user]);

  const totalValuation = cartSummary.taxableSubtotal;

  const handleWhatsAppCartOrder = () => {
    const store = address.trim() || user?.companyName || user?.name || 'Chemist Store';
    const mob = phone.trim() || user?.phone || user?.mobile || '';
    const lines = cartSummary.lineItems
      .map((it, idx) => `${idx + 1}. *${it.productName}* (${it.company}) - Qty: ${it.boxes} | Rate: ₹${it.unitPrice.toFixed(2)} | Sub: ₹${it.lineSubtotal.toFixed(2)}`)
      .join('\n');
    const msg = `📦 *WHOLESALE CART ORDER - NIYANSH PHARMA*\n*Store:* ${store}\n*Mobile:* ${mob}\n\n${lines}\n\n*Subtotal:* ₹${cartSummary.taxableSubtotal.toFixed(2)}\n*Est. GST:* ₹${cartSummary.totalGstAmount.toFixed(2)}\n*Grand Total:* ₹${cartSummary.grandTotal.toFixed(2)}`;
    window.open(`https://api.whatsapp.com/send?phone=919909923130&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handlePrintCartBill = () => {
    openWholesaleInvoiceWindow({
      invoiceNumber: `NP-CART-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString(),
      shopName: address.trim() || user?.companyName || user?.name || 'Retail Chemist Store',
      retailerMobile: phone.trim() || user?.phone || user?.mobile || 'N/A',
      retailerEmail: email.trim() || user?.email || '',
      gstin: user?.gstin || '',
      drugLicense: user?.drugLicense1 || user?.drugLicense || '',
      items: cartSummary.lineItems,
      taxableSubtotal: cartSummary.taxableSubtotal,
      totalGstAmount: cartSummary.totalGstAmount,
      grandTotal: cartSummary.grandTotal,
      totalBoxes: cartSummary.totalQty,
      totalUnits: cartSummary.totalQty,
      paymentStatus: 'Proforma / Cart Estimate'
    });
  };

  const handleSyncToQuickOrder = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('niyansh_quickorder_cart') || '{}');
      const merged = (existing && typeof existing === 'object' && !Array.isArray(existing)) ? { ...existing } : {};
      cartItems.forEach((it) => {
        if (it?.product?._id) {
          merged[it.product._id] = Math.max(merged[it.product._id] || 0, Number(it.quantity) || 1);
        }
      });
      localStorage.setItem('niyansh_quickorder_cart', JSON.stringify(merged));
    } catch (_) {}
    onClose();
    navigate('/quick-order');
  };

  return (
    <div className="sidebar-backdrop" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Wholesale Cart Drawer"
        className="sidebar-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sidebar-header" style={{ gap: '8px' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {t('cart.title', 'Wholesale Cart')}
            <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--primary-blue)', color: '#fff', whiteSpace: 'nowrap' }}>
              {cartItems.length} {t('products.productsCount', 'items')}
            </span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                style={{ fontSize: '0.74rem', fontWeight: '700', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Clear all items from cart"
              >
                <RotateCcw size={12} /> Clear
              </button>
            )}
            <button onClick={onClose} style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} aria-label={t('common.close', 'Close')}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="sidebar-body">
          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px', textAlign: 'center' }}>
              <CheckCircle size={60} color="var(--secondary-green)" />
              <h3 style={{ color: 'var(--secondary-green)' }}>{t('cart.successTitle', 'Enquiry Sent Successfully!')}</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                {t('cart.successDesc', `Thank you for reaching out to Niyansh Pharma. Our representative will contact you shortly on ${phone} with wholesale quotes.`)}
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px', color: 'var(--text-light)' }}>
              <ShoppingBag size={64} strokeWidth={1.5} />
              <p>{t('cart.empty', 'Your cart is empty.')}</p>
              <button 
                onClick={onClose} 
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}
              >
                {t('cart.browseCatalog', 'Browse Products')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Free Cold-Chain Delivery Progress Bar */}
              {totalValuation > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: totalValuation >= 10000 ? '#15803d' : '#166534' }}>
                      {totalValuation >= 10000 
                        ? t('cart.freeDeliveryUnlocked', '🎉 Free Cold-Chain Dispatch across Gujarat Unlocked!') 
                        : t('cart.addMoreForFree', `🚚 Add ₹${(10000 - totalValuation).toFixed(2)} more for Free Dispatch`)}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#15803d' }}>
                      {Math.min(100, Math.round((totalValuation / 10000) * 100))}%
                    </span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#dcfce7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, Math.round((totalValuation / 10000) * 100))}%`, backgroundColor: '#10b981', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )}

              {/* Cart Items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cartItems.map((item) => (
                  <div 
                    key={item.product._id} 
                    style={{
                      display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', border: '1px solid var(--border-light)',
                      borderRadius: '10px', position: 'relative', backgroundColor: 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: 0 }}>
                      {item.product.imageUrl && item.product.imageUrl !== '/pharma-products.jpg' ? (
                        <WatermarkedImage
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          compact
                          wrapperStyle={{ width: '46px', height: '46px', flexShrink: 0, aspectRatio: '1 / 1', borderRadius: '6px', backgroundColor: '#ffffff', padding: '4px', border: '1px solid var(--border-light)' }}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : null}
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                          {item.product.name}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.product.company || item.product.brand} • {item.product.packing || 'Standard'}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: '700', margin: 0 }}>
                          {user 
                            ? `PTR: ₹${(Number(item.product?.price) || 0).toFixed(2)} × ${item.quantity} = ₹${((Number(item.product?.price) || 0) * item.quantity).toFixed(2)}` 
                            : `MRP: ₹${(Number(item.product?.mrp || item.product?.price) || 0).toFixed(2)} × ${item.quantity}`}
                        </p>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.product._id)} 
                        style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', padding: '5px', flexShrink: 0 }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Smart Stepper + Quick Bulk Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', borderTop: '1px dashed var(--border-light)', paddingTop: '8px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#ffffff', height: '32px' }}>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          style={{ width: '30px', height: '32px', minHeight: '32px', padding: 0, backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          className="stepper-qty-input"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) updateQuantity(item.product._id, val);
                          }}
                          style={{ width: '44px', height: '32px', minHeight: '32px', padding: 0, textAlign: 'center', fontSize: '0.86rem', fontWeight: '800', border: 'none', outline: 'none', color: '#0c3d6c', backgroundColor: '#ffffff' }}
                          aria-label="Item quantity"
                        />
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          style={{ width: '30px', height: '32px', minHeight: '32px', padding: 0, backgroundColor: '#0c3d6c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {[5, 10].map((inc) => (
                          <button
                            key={inc}
                            type="button"
                            onClick={() => updateQuantity(item.product._id, item.quantity + inc)}
                            style={{ height: '30px', minHeight: '30px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0c3d6c', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            +{inc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Smart Estimate Breakdown */}
              <div style={{
                padding: '12px 14px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: '10px',
                display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                  <span>{user ? 'Taxable PTR Subtotal' : 'Retail Value (MRP)'}</span>
                  <strong className="tabular-nums">₹{cartSummary.taxableSubtotal.toFixed(2)}</strong>
                </div>
                {user && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <span>Est. GST (12%)</span>
                      <span className="tabular-nums">+₹{cartSummary.totalGstAmount.toFixed(2)}</span>
                    </div>
                    {cartSummary.savings > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#059669', fontWeight: '700' }}>
                        <span>Chemist Profit Margin vs MRP</span>
                        <span className="tabular-nums">₹{cartSummary.savings.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--border-medium)', fontSize: '0.96rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                      <span>Grand Total (inc. GST)</span>
                      <span className="tabular-nums">₹{cartSummary.grandTotal.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Smart Quick Actions (WhatsApp + Print Bill + Quick Order Pad) */}
              {user && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleWhatsAppCartOrder}
                    style={{
                      padding: '10px 8px', borderRadius: '8px', backgroundColor: '#16a34a', color: '#ffffff',
                      border: 'none', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <MessageCircle size={15} /> WhatsApp Order
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintCartBill}
                    style={{
                      padding: '10px 8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#0c3d6c',
                      border: '1px solid #bfdbfe', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <Printer size={15} /> Print GST Bill
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncToQuickOrder}
                    style={{
                      gridColumn: '1 / -1',
                      padding: '9px 10px', borderRadius: '8px', backgroundColor: '#fff7ed', color: '#ea580c',
                      border: '1px solid #fed7aa', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Zap size={15} /> Open in Quick Order Matrix
                  </button>
                </div>
              )}

              {/* Enquiry Form or Auth Required Prompt */}
              {user ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', color: 'var(--text-dark)' }}>{t('cart.confirmBusinessDetails', 'Confirm Business Details')}</h3>
                  
                  {errorMessage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem' }} role="alert">
                      <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="name-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('auth.nameLabel', 'Full Name')} <span className="required-star">*</span>
                    </label>
                    <input 
                      id="name-input"
                      type="text" 
                      required 
                      placeholder={t('auth.namePlaceholder', 'Enter name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="phone-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('auth.phoneLabel', 'Phone Number')} <span className="required-star">*</span>
                    </label>
                    <input 
                      id="phone-input"
                      type="tel" 
                      required 
                      maxLength={10}
                      placeholder={t('auth.phonePlaceholder', '10-digit mobile number')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="email-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>{t('cart.emailOptional', 'Email ID (Optional)')}</label>
                    <input 
                      id="email-input"
                      type="email" 
                      placeholder={t('auth.emailPlaceholder', 'Enter email address')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="address-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>{t('auth.companyLabel', 'Company / Store Name')}</label>
                    <input 
                      id="address-input"
                      type="text" 
                      placeholder={t('cart.storePlaceholder', 'Store name, address, city')}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="msg-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>{t('contact.messageLabel', 'Message / Instruction')}</label>
                    <textarea 
                      id="msg-input"
                      rows="3" 
                      placeholder={t('cart.msgPlaceholder', 'Enter special instructions or wholesale discount query...')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '10px', gap: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Send size={16} />
                    {isSubmitting ? t('cart.submitting', 'Submitting Order...') : t('cart.submitEnquiry', 'Submit Order Enquiry')}
                  </button>
                </form>
              ) : (
                <div style={{
                  padding: '25px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center', marginTop: '10px'
                }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', fontWeight: '600', lineHeight: '1.5' }}>
                    {t('cart.loginRequiredNotice', 'Please log in to your account to complete your B2B wholesale order enquiry.')}
                  </p>
                  <button 
                    type="button" 
                    onClick={() => { onClose(); onOpenAuth(); }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {t('cart.loginBtn', 'Sign In / Register Store')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnquiryCartModal;

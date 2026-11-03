import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, Send, CheckCircle, ShoppingBag, AlertCircle } from 'lucide-react';

function EnquiryCartModal({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, clearCart, user, token, onOpenAuth }) {
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
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          address: address.trim(),
          message: message.trim(),
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

  const totalValuation = cartItems.reduce(
    (total, item) => total + (user ? item.product.price : (item.product.mrp || item.product.price)) * item.quantity,
    0
  );

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
        <div className="sidebar-header">
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Wholesale Cart
            <span style={{ fontSize: '0.85rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--primary-blue)', color: '#fff' }}>
              {cartItems.length} items
            </span>
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-medium)', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="sidebar-body">
          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px', textAlign: 'center' }}>
              <CheckCircle size={60} color="var(--secondary-green)" />
              <h3 style={{ color: 'var(--secondary-green)' }}>Enquiry Sent Successfully!</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                Thank you for reaching out to Niyansh Pharma. Our representative will contact you shortly on <strong>{phone}</strong> with wholesale quotes.
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px', color: 'var(--text-light)' }}>
              <ShoppingBag size={64} strokeWidth={1.5} />
              <p>Your cart is empty.</p>
              <button 
                onClick={onClose} 
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Cart Items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div 
                    key={item.product._id} 
                    style={{
                      display: 'flex', gap: '10px', padding: '10px', border: '1px solid var(--border-light)',
                      borderRadius: '8px', position: 'relative', alignItems: 'center'
                    }}
                  >
                    {item.product.imageUrl && item.product.imageUrl !== '/pharma-products.jpg' ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', backgroundColor: 'var(--bg-main)' }}
                      />
                    ) : null}
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        Brand: {item.product.brand} | {item.product.packing}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: '600', marginTop: '3px' }}>
                        {user ? `PTR (Wholesale): ₹${item.product.price.toFixed(2)} / Strip` : `MRP: ₹${(item.product.mrp || item.product.price).toFixed(2)} / Strip`}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => removeFromCart(item.product._id)} 
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          style={{ minWidth: '32px', minHeight: '32px', padding: '6px 10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600' }} className="tabular-nums">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          style={{ minWidth: '32px', minHeight: '32px', padding: '6px 10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estimate Total */}
              <div style={{
                padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)'
              }}>
                <span style={{ fontWeight: '600', color: 'var(--text-medium)', fontSize: '0.9rem' }}>{user ? 'Estimated Wholesale Value:' : 'Estimated Retail Value (MRP):'}</span>
                <span style={{ fontWeight: '800', color: 'var(--primary-blue)', fontSize: '1.1rem' }}>₹{totalValuation.toFixed(2)}</span>
              </div>

              {/* Enquiry Form or Auth Required Prompt */}
              {user ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', color: 'var(--text-dark)' }}>Confirm Business Details</h3>
                  
                  {errorMessage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem' }} role="alert">
                      <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="name-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Full Name *</label>
                    <input 
                      id="name-input"
                      type="text" 
                      required 
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="phone-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Phone Number *</label>
                    <input 
                      id="phone-input"
                      type="tel" 
                      required 
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="email-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Email ID (Optional)</label>
                    <input 
                      id="email-input"
                      type="email" 
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="address-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Company / Store Name</label>
                    <input 
                      id="address-input"
                      type="text" 
                      placeholder="Store name, address, city"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="msg-input" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Message / Instruction</label>
                    <textarea 
                      id="msg-input"
                      rows="3" 
                      placeholder="Enter special instructions or wholesale discount query..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-secondary" 
                    style={{ width: '100%', marginTop: '10px', gap: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'Submitting Order...' : 'Submit Order Enquiry'}
                  </button>
                </form>
              ) : (
                <div style={{
                  padding: '25px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center', marginTop: '10px'
                }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', fontWeight: '600', lineHeight: '1.5' }}>
                    Please log in to your account to complete your B2B wholesale order enquiry.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => { onClose(); onOpenAuth(); }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Sign In / Register Store
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

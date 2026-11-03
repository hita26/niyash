import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, ArrowLeft, CheckCircle2, AlertTriangle, 
  Check, Truck, ShieldCheck, FileText, MessageSquare, 
  Sparkles, ChevronRight, Plus, Minus, Share2, 
  Building2, Package, Tag, Pill, Factory, Receipt, 
  Clock, Info, Lock, LogIn
} from 'lucide-react';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const { isLoggedIn, openAuth } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        if (!isCancelled) {
          setProduct(data.product);
          setRelated(data.related || []);
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
    setActiveImageIndex(0);
    setIsAdded(false);
    return () => { isCancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '15px' }}>
        <div style={{ border: '4px solid #cbd5e1', borderTop: '4px solid var(--primary-blue)', borderRadius: '50%', width: '44px', height: '44px', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>Loading formulation details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ marginBottom: '10px', color: 'var(--text-dark)' }}>Product Not Found</h2>
          <p style={{ margin: '0 0 24px', color: 'var(--text-medium)' }}>
            The medicine or formulation you requested does not exist or has been removed from catalog.
          </p>
          <Link to="/products" className="btn btn-primary btn-sm">
            ← Return to All Products
          </Link>
        </div>
      </div>
    );
  }

  const unitPrice = Number(product.price) || 0;
  const unitMrp = Number(product.mrp) || 0;
  const hasMargin = unitMrp > unitPrice;
  const marginPercent = hasMargin ? Math.round(((unitMrp - unitPrice) / unitMrp) * 100) : 0;
  const unitSavings = hasMargin ? (unitMrp - unitPrice) : 0;
  const totalOrderValue = unitPrice * quantity;
  const totalRetailValue = unitMrp * quantity;
  const totalChemistProfit = unitSavings * quantity;

  const handleWhatsAppOrder = () => {
    const rateLine = isLoggedIn
      ? `*Est. Rate (PTR):* ₹${unitPrice.toFixed(2)} / unit\n*Est. Total Value:* ₹${totalOrderValue.toFixed(2)}`
      : `*MRP (Retail):* ₹${unitMrp.toFixed(2)} / unit\n*Rate Request:* Please share wholesale PTR quote`;

    const message = `Hello Niyansh Pharma,\nI would like to place a wholesale order enquiry for:\n\n*Product:* ${product.name}\n*Brand / Company:* ${product.brand || product.company || 'Niyansh Pharma'}\n*Packing:* ${product.packing || 'Standard'}\n*Composition:* ${product.composition || 'N/A'}\n*Quantity:* ${quantity} units\n${rateLine}\n*SKU:* ${product.sku || 'N/A'}\n\nPlease confirm availability and dispatch schedule.`;
    const whatsappUrl = `https://wa.me/919909923130?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2200);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuantityPreset = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const rawGallery = (product.images && product.images.length > 0)
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);
  const gallery = rawGallery.filter(img => img && typeof img === 'string' && img.trim() !== '' && img !== '/pharma-products.jpg');
  const hasPhotos = gallery.length > 0;
  const currentPhoto = hasPhotos ? (gallery[activeImageIndex] || gallery[0]) : null;

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', paddingTop: '20px', paddingBottom: '70px' }}>
      <div className="container">
        
        {/* Breadcrumb & Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-medium)', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--text-medium)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" style={{ color: 'var(--text-medium)', textDecoration: 'none' }}>Products</Link>
            {product.category && (
              <>
                <ChevronRight size={14} />
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-medium)', textDecoration: 'none' }}>
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>
              {product.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              className="btn btn-outline btn-sm"
              style={{ padding: '5px 12px', fontSize: '0.78rem', gap: '5px', borderRadius: '20px', backgroundColor: '#fff' }}
              title="Copy product link"
            >
              <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share'}
            </button>
            <Link 
              to="/products" 
              className="btn btn-outline btn-sm"
              style={{ padding: '5px 12px', fontSize: '0.78rem', gap: '5px', borderRadius: '20px', backgroundColor: '#fff', textDecoration: 'none' }}
            >
              <ArrowLeft size={13} /> All Products
            </Link>
          </div>
        </div>

        {/* Main 2-Column Product Detail Layout */}
        <div className="detail-layout" style={{ marginBottom: '45px' }}>
          
          {/* ========================================================
              LEFT COLUMN: Product Photo Gallery & Visual Highlights
              ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Primary Main Photo Box */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              minHeight: '340px',
              maxHeight: '420px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
            }}>
              {product.featured && (
                <span style={{
                  position: 'absolute', top: '12px', left: '12px',
                  backgroundColor: '#fef3c7', color: '#b45309',
                  padding: '4px 10px', borderRadius: '20px', fontWeight: '700',
                  fontSize: '0.75rem', border: '1px solid #fde68a',
                  display: 'flex', alignItems: 'center', gap: '4px', zIndex: 2
                }}>
                  ★ Featured Formulation
                </span>
              )}

              {gallery.length > 1 && (
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#ffffff',
                  padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem',
                  fontWeight: '600', backdropFilter: 'blur(4px)', zIndex: 2
                }}>
                  {activeImageIndex + 1} / {gallery.length} Photos
                </span>
              )}

              {currentPhoto ? (
                <img 
                  src={currentPhoto} 
                  alt={`${product.name} photo`} 
                  onError={(e) => {
                    // Hide image completely on failure to leave section empty per instructions
                    e.target.style.display = 'none';
                  }}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '320px',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              ) : (
                /* Completely empty image area when authentic photograph is unavailable */
                <div 
                  style={{ 
                    minHeight: '280px', 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                  aria-label="No photograph available"
                />
              )}
            </div>

            {/* Multiple Photo Thumbnails Row */}
            {gallery.length > 1 && (
              <div 
                className="no-scrollbar touch-scroll-row"
                style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  padding: '4px 2px 8px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '10px',
                      flexShrink: 0,
                      padding: '4px',
                      backgroundColor: 'var(--bg-card)',
                      cursor: 'pointer',
                      border: activeImageIndex === idx ? '2.5px solid var(--primary-blue)' : '1px solid var(--border-light)',
                      boxShadow: activeImageIndex === idx ? '0 0 0 3px rgba(12, 61, 108, 0.15)' : 'none',
                      opacity: activeImageIndex === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Thumbnail ${idx + 1}`} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Left Column Quick Trust Micro-Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              padding: '14px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              color: 'var(--text-medium)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary-blue)" />
                <span>100% Genuine Batch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--primary-blue)" />
                <span>Prompt Dispatch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={16} color="var(--primary-blue)" />
                <span>GST Tax Invoice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>WHO-GMP Quality</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: Product Title, Commercial Order Box, Specs
              ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Header: Brand Chips & Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {product.brand && (
                  <span style={{
                    backgroundColor: 'rgba(12, 61, 108, 0.08)',
                    color: 'var(--primary-blue)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(12, 61, 108, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Building2 size={13} /> {product.brand}
                  </span>
                )}
                {product.sku && (
                  <span style={{ fontSize: '0.78rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '15px', fontWeight: '600' }}>
                    SKU: {product.sku}
                  </span>
                )}
                {product.form && (
                  <span style={{ fontSize: '0.78rem', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '4px 10px', borderRadius: '15px', fontWeight: '600' }}>
                    {product.form}
                  </span>
                )}
                {product.subCategory && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--secondary-green)', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '15px', fontWeight: '600' }}>
                    {product.subCategory}
                  </span>
                )}
              </div>
              
              <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)', color: 'var(--text-dark)', margin: '0 0 6px 0', fontWeight: '800', lineHeight: 1.25 }}>
                {product.name}
              </h1>

              {product.composition && (
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', fontStyle: 'italic', margin: '0 0 6px 0' }}>
                  {product.composition}
                </p>
              )}

              <p style={{ color: 'var(--text-light)', fontSize: '0.86rem', margin: 0 }}>
                Category: <strong style={{ color: 'var(--text-dark)' }}>{product.category || 'Pharmaceutical Products'}</strong>
                {product.packing && <span> • Packing: <strong style={{ color: 'var(--text-dark)' }}>{product.packing}</strong></span>}
              </p>
            </div>

            {/* ========================================================
                COMMERCIAL WHOLESALE ORDER CARD (Directly Visible)
                ======================================================== */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '14px',
              border: '1.5px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              
              {/* Price & Stock Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  {isLoggedIn ? (
                    <>
                      {hasMargin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }} className="tabular-nums">
                            MRP ₹{unitMrp.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '0.78rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
                            {marginPercent}% MARGIN
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
                            (Save ₹{unitSavings.toFixed(2)}/unit)
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '0.76rem', color: 'var(--primary-blue)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          PTR (Wholesale):
                        </span>
                        <span style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--primary-blue)' }} className="tabular-nums">
                          ₹{unitPrice.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-medium)' }}>
                          / {product.packing ? 'unit' : 'strip'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                        MRP (Retail Price):
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)' }} className="tabular-nums">
                          ₹{unitMrp.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-medium)' }}>
                          / {product.packing ? 'unit' : 'strip'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '700', padding: '6px 12px', borderRadius: '20px', backgroundColor: product.inStock ? '#ecfdf5' : '#fef2f2', border: product.inStock ? '1px solid #a7f3d0' : '1px solid #fecaca' }}>
                  {product.inStock && (!product.stockQuantity || product.stockQuantity > 0) ? (
                    <>
                      <CheckCircle2 size={16} color="var(--secondary-green)" />
                      <span style={{ color: 'var(--secondary-green)' }}>
                        In Stock {product.stockQuantity !== undefined && product.stockQuantity > 0 ? `(${product.stockQuantity})` : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} color="#ef4444" />
                      <span style={{ color: '#ef4444' }}>Out of Stock</span>
                    </>
                  )}
                </div>
              </div>

              {/* Protected Wholesale Callout for Logged-Out Users */}
              {!isLoggedIn && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1.5px dashed #3b82f6',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Lock size={18} color="var(--primary-blue)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                        Wholesale PTR Rate Protected
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        Special wholesale PTR rates and chemist trade margins are visible only to verified accounts.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAuth}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '7px 16px', fontSize: '0.82rem', fontWeight: '700', borderRadius: '6px', gap: '6px' }}
                  >
                    <LogIn size={14} /> Login to View PTR
                  </button>
                </div>
              )}

              {/* Quantity Stepper & Bulk Ordering Presets */}
              {product.inStock && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    
                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                        Quantity:
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', height: '42px', backgroundColor: '#fff' }}>
                        <button 
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          style={{ width: '42px', height: '100%', backgroundColor: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ width: '55px', height: '100%', textAlign: 'center', fontWeight: '800', fontSize: '1rem', border: 'none', outline: 'none', padding: 0 }}
                          className="tabular-nums"
                          aria-label="Order Quantity"
                        />
                        <button 
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          style={{ width: '42px', height: '100%', backgroundColor: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Bulk Preset Chips for Retailers */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '600' }}>Add Bulk:</span>
                      {[5, 10, 25, 50, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleQuantityPreset(preset)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: 'var(--primary-blue)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          +{preset}
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* Live Order Valuation Summary */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.85rem',
                    gap: '8px'
                  }}>
                    {isLoggedIn ? (
                      <>
                        <div>
                          <span>Total Cart Value (PTR): </span>
                          <strong style={{ fontSize: '1rem', fontWeight: '800' }} className="tabular-nums">
                            ₹{totalOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                        {hasMargin && (
                          <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: '700' }}>
                            Est. Chemist Profit: ₹{totalChemistProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <span>Estimated Retail Value (MRP): </span>
                          <strong style={{ fontSize: '1rem', fontWeight: '800' }} className="tabular-nums">
                            ₹{totalRetailValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={openAuth}
                          style={{ background: 'none', border: 'none', color: '#0369a1', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Lock size={12} /> Login to unlock wholesale PTR rates
                        </button>
                      </>
                    )}
                  </div>

                  {/* Primary Call-to-Action Buttons */}
                  <div className="product-detail-actions" style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button 
                      onClick={handleAddToCart}
                      className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                      style={{
                        height: '48px',
                        flex: '1 1 200px',
                        padding: '0 24px',
                        fontSize: '0.96rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        gap: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={18} /> Added ({quantity} units)!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} /> Add to Cart
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handleWhatsAppOrder}
                      className="btn"
                      style={{
                        height: '48px',
                        flex: '1 1 180px',
                        padding: '0 20px',
                        fontSize: '0.96rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        gap: '8px',
                        backgroundColor: '#22c55e',
                        color: '#ffffff',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <MessageSquare size={18} /> WhatsApp Order
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Product Specifications Section */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: '700', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={18} color="var(--primary-blue)" /> Product Specifications
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                gap: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Composition</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600', fontStyle: 'italic' }}>
                    {product.composition || 'As per formulation standard'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Packaging</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    {product.packing || 'Standard Pack'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Dosage Form</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    {product.form || 'Tablet / Capsule'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Manufacturer / Marketer</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    {product.manufacturer || product.brand || 'Authorized Pharma Partner'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Category</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    {product.category || 'Pharmaceutical Products'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>SKU Code</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    {product.sku || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Clinical Indications */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: '700', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={18} color="var(--primary-blue)" /> Description & Indications
              </h3>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '16px',
                color: 'var(--text-medium)',
                fontSize: '0.92rem',
                lineHeight: 1.65
              }}>
                {product.description || `${product.name} is a high-grade therapeutic pharmaceutical formulation distributed by Niyansh Pharma. Stored in temperature-controlled warehouses with batch compliance certificates.`}
              </div>
            </div>

          </div>

        </div>

        {/* Related Formulations Section */}
        {related.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', fontWeight: '800', margin: '0 0 4px 0' }}>
                  Related Medicines & Formulations
                </h2>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-medium)' }}>
                  Other high-demand therapeutic formulations in this category
                </p>
              </div>
              <Link to="/products" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
                View All Catalog →
              </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
              {related.map((relProd) => (
                <ProductCard key={relProd._id} product={relProd} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetail;

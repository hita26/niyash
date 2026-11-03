import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, CheckCircle2, AlertTriangle, Lock, Check, Plus, Minus, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product, addToCart }) {
  const { isLoggedIn, openAuth } = useAuth();
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priceText = isLoggedIn 
      ? `*PTR (Wholesale):* ₹${product.price.toFixed(2)}`
      : `*MRP:* ₹${(product.mrp || product.price || 0).toFixed(2)}\n*Note:* Please share wholesale PTR quote`;

    const message = `Hello Niyansh Pharma, I would like to enquire about this product:\n\n*Product Name:* ${product.name}\n*Brand:* ${product.brand}\n*Packing:* ${product.packing}\n${priceText}\n*SKU:* ${product.sku || 'N/A'}`;
    const whatsappUrl = `https://wa.me/919909923130?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onAddCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    const nextQty = 1;
    setQuantity(nextQty);
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextQty = quantity + 1;
    setQuantity(nextQty);
    addToCart(product, 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      setQuantity(0);
      addToCart(product, -1);
    } else {
      const nextQty = quantity - 1;
      setQuantity(nextQty);
      addToCart(product, -1);
    }
  };

  const displayMrp = Number(product.mrp && product.mrp > 0 ? product.mrp : product.price || 0);
  const displayPrice = Number(product.price || 0);
  const hasMargin = product.mrp && product.mrp > product.price;
  const marginPercent = hasMargin ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const hasValidImage = Boolean(product.imageUrl && product.imageUrl.trim() !== '' && product.imageUrl !== '/pharma-products.jpg');

  return (
    <div 
      className="card card-hover-lift" 
      style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        borderRadius: '14px',
        border: '1px solid var(--border-light)',
        position: 'relative',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Product Image Container */}
      <Link 
        to={`/products/${product._id}`} 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: '10px', 
          marginBottom: '14px', 
          backgroundColor: 'var(--bg-main)',
          height: '180px',
          border: '1px solid var(--border-light)'
        }}
      >
        {hasValidImage ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'var(--transition-smooth)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div 
            style={{ width: '100%', height: '100%' }} 
            aria-label="No photograph available"
          />
        )}

        {/* Brand Tag */}
        <span 
          style={{
            position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(12, 61, 108, 0.1)',
            color: 'var(--primary-blue)', fontSize: '0.74rem', fontWeight: '800', padding: '3px 9px',
            borderRadius: '20px', border: '1px solid rgba(12, 61, 108, 0.2)', backdropFilter: 'blur(4px)'
          }}
        >
          {product.brand}
        </span>

        {/* Featured / Scheme Badge */}
        {product.scheme ? (
          <span 
            style={{
              position: 'absolute', top: '10px', right: '10px', backgroundColor: '#fff7ed',
              color: '#ea580c', fontSize: '0.7rem', fontWeight: '800', padding: '3px 8px',
              borderRadius: '12px', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', gap: '3px'
            }}
          >
            <Sparkles size={11} /> {product.scheme}
          </span>
        ) : product.featured ? (
          <span 
            style={{
              position: 'absolute', top: '10px', right: '10px', backgroundColor: '#fef3c7',
              color: '#b45309', fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px',
              borderRadius: '12px', border: '1px solid #fde68a'
            }}
          >
            ★ Featured
          </span>
        ) : null}
      </Link>

      {/* Product Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.category || 'Pharmaceutical'}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={12} /> WHO-GMP
          </span>
        </div>

        <Link to={`/products/${product._id}`}>
          <h3 
            style={{
              fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-dark)', minHeight: '2.6rem',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              lineHeight: '1.3', margin: '2px 0 4px 0'
            }}
          >
            {product.name}
          </h3>
        </Link>
        
        <p style={{ fontSize: '0.82rem', color: 'var(--text-medium)', marginBottom: '4px' }}>
          Packing: <strong style={{ color: 'var(--text-dark)' }}>{product.packing || 'Standard'}</strong>
        </p>

        {product.composition && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.composition}>
            Molecule: <span style={{ fontStyle: 'italic', color: 'var(--text-medium)' }}>{product.composition}</span>
          </p>
        )}

        {/* Pricing Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
          <div>
            {isLoggedIn ? (
              <>
                {hasMargin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', textDecoration: 'line-through' }} className="tabular-nums">
                      MRP ₹{displayMrp.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>
                      {marginPercent}% MARGIN
                    </span>
                  </div>
                )}
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-blue)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                    PTR (Wholesale):
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--primary-blue)' }} className="tabular-nums">
                    ₹{displayPrice.toFixed(2)}
                    <span style={{ fontSize: '0.74rem', fontWeight: '500', color: 'var(--text-medium)' }}> /unit</span>
                  </span>
                </div>
              </>
            ) : (
              <div>
                <div style={{ marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                    MRP (Retail Price):
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }} className="tabular-nums">
                    ₹{displayMrp.toFixed(2)}
                    <span style={{ fontSize: '0.74rem', fontWeight: '500', color: 'var(--text-medium)' }}> /unit</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openAuth();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#eff6ff',
                    border: '1px dashed #3b82f6',
                    color: 'var(--primary-blue)',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  title="Login as verified chemist to view Wholesale PTR Rate"
                >
                  <Lock size={12} color="var(--primary-blue)" />
                  <span>Login for PTR Rate</span>
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', paddingBottom: '4px' }}>
            {product.inStock ? (
              <>
                <CheckCircle2 size={14} color="var(--secondary-green)" />
                <span style={{ color: 'var(--secondary-green)' }}>In Stock</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} color="#ef4444" />
                <span style={{ color: '#ef4444' }}>Out of Stock</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions: Inline Stepper when qty > 0 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
        {quantity > 0 ? (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: '#ecfdf5', 
              border: '1.5px solid #10b981', 
              borderRadius: '8px', 
              padding: '3px 6px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <button 
              onClick={handleDecrement}
              style={{ 
                width: '28px', height: '28px', borderRadius: '6px', 
                backgroundColor: '#ffffff', color: '#047857', border: '1px solid #a7f3d0', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}
              title="Decrease quantity"
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span style={{ fontWeight: '800', fontSize: '0.84rem', color: '#064e3b' }}>
              {quantity} Box{quantity > 1 ? 'es' : ''}
            </span>
            <button 
              onClick={handleIncrement}
              style={{ 
                width: '28px', height: '28px', borderRadius: '6px', 
                backgroundColor: '#059669', color: '#ffffff', border: 'none', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}
              title="Add another box"
              aria-label="Add another box"
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onAddCartClick}
            disabled={!product.inStock}
            className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', opacity: product.inStock ? 1 : 0.6 }}
            title={product.inStock ? 'Add to Cart' : 'Product Out of Stock'}
          >
            {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
            {isAdded ? ' Added' : ' Add to Cart'}
          </button>
        )}

        <button 
          onClick={handleWhatsAppOrder}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700' }}
        >
          WhatsApp
        </button>
      </div>

      <Link 
        to={`/products/${product._id}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          marginTop: '10px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)'
        }}
      >
        <Eye size={12} /> View Details
      </Link>
    </div>
  );
}

export default ProductCard;

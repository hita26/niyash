import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Eye, CheckCircle2, AlertTriangle, Lock, Check, Plus, Minus, 
  Sparkles, ShieldCheck, Pill, Syringe, Droplets, Package, Activity 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function getFormIcon(form) {
  const f = (form || '').toLowerCase();
  if (f.includes('inject')) return <Syringe size={22} />;
  if (f.includes('drop') || f.includes('syrup') || f.includes('liquid') || f.includes('susp')) return <Droplets size={22} />;
  if (f.includes('cream') || f.includes('gel') || f.includes('ointment')) return <Activity size={22} />;
  if (f.includes('surgic') || f.includes('powder')) return <Package size={22} />;
  return <Pill size={22} />;
}

function ProductCard({ product, addToCart }) {
  const { t, language, translateCategory, formatCurrency } = useLanguage();
  const { isLoggedIn, openAuth } = useAuth();
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priceText = isLoggedIn 
      ? `*PTR (Wholesale):* ₹${product.price.toFixed(2)}`
      : `*MRP:* ₹${(product.mrp || product.price || 0).toFixed(2)}\n*Note:* Please share wholesale PTR quote`;

    const greeting = language === 'gu'
      ? `નમસ્તે નિયાંશ ફાર્મા, મારે આ પ્રોડક્ટ માટે ઓર્ડર / પૂછપરછ કરવી છે:`
      : language === 'hi'
      ? `नमस्ते नियांश फार्मा, मुझे इस उत्पाद के लिए पूछताछ / ऑर्डर करना है:`
      : `Hello Niyansh Pharma, I would like to enquire about this product:`;

    const message = `${greeting}\n\n*Product Name:* ${product.name}\n*Brand:* ${product.brand}\n*Packing:* ${product.packing}\n${priceText}\n*SKU:* ${product.sku || 'N/A'}`;
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
      {/* Product Image Container - Fixed 1:1 Square Aspect Ratio */}
      <Link 
        to={`/products/${product._id}`} 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: '12px', 
          marginBottom: '14px', 
          backgroundColor: '#ffffff',
          width: '100%',
          aspectRatio: '1 / 1',
          padding: '14px',
          boxSizing: 'border-box',
          border: '1px solid var(--border-light)'
        }}
      >
        {hasValidImage ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              objectPosition: 'center',
              transition: 'var(--transition-smooth)' 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div 
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px dashed #cbd5e1',
              padding: '12px',
              boxSizing: 'border-box',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '1rem', fontWeight: '900', color: '#cbd5e1', fontStyle: 'italic', userSelect: 'none' }}>
              Rx
            </span>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              backgroundColor: '#e0f2fe', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '6px',
              color: 'var(--primary-blue)'
            }}>
              {getFormIcon(product.form)}
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-dark)', maxWidth: '92%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-light)', marginTop: '2px', fontWeight: '600' }}>
              {product.packing || product.form || 'Pharmaceutical'}
            </span>
            <span style={{ marginTop: '5px', fontSize: '0.62rem', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
              {product.company || product.brand}
            </span>
          </div>
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
            ★ {t('products.scheme', 'Featured')}
          </span>
        ) : null}
      </Link>

      {/* Product Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {translateCategory(product.category || 'Pharma Products')}
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
          {t('products.packing', 'Packing')}: <strong style={{ color: 'var(--text-dark)' }}>{product.packing || 'Standard'}</strong>
        </p>

        {product.composition && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.composition}>
            {t('products.composition', 'Composition')}: <span style={{ fontStyle: 'italic', color: 'var(--text-medium)' }}>{product.composition}</span>
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
                      {t('products.mrp', 'MRP')} {formatCurrency(displayMrp)}
                    </span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>
                      {marginPercent}% {language === 'gu' ? 'માર્જિન' : language === 'hi' ? 'मार्जिन' : 'MARGIN'}
                    </span>
                  </div>
                )}
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-blue)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                    {t('products.ptr', 'PTR Rate')}:
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--primary-blue)' }} className="tabular-nums">
                    {formatCurrency(displayPrice)}
                    <span style={{ fontSize: '0.74rem', fontWeight: '500', color: 'var(--text-medium)' }}> /{language === 'gu' ? 'નંગ' : language === 'hi' ? 'यूनिट' : 'unit'}</span>
                  </span>
                </div>
              </>
            ) : (
              <div>
                <div style={{ marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                    {t('products.mrp', 'MRP')}:
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }} className="tabular-nums">
                    {formatCurrency(displayMrp)}
                    <span style={{ fontSize: '0.74rem', fontWeight: '500', color: 'var(--text-medium)' }}> /{language === 'gu' ? 'નંગ' : language === 'hi' ? 'यूनिट' : 'unit'}</span>
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
                  <span>{t('products.loginForPtr', 'Login for PTR Rate')}</span>
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', paddingBottom: '4px' }}>
            {product.inStock ? (
              <>
                <CheckCircle2 size={14} color="var(--secondary-green)" />
                <span style={{ color: 'var(--secondary-green)' }}>{t('products.inStock', 'In Stock')}</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} color="#ef4444" />
                <span style={{ color: '#ef4444' }}>{t('products.outOfStock', 'Out of Stock')}</span>
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
              {quantity} {language === 'gu' ? 'બોક્સ' : language === 'hi' ? 'बॉक्स' : 'Box'}
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
            title={product.inStock ? t('products.addToCart', 'Add to Cart') : t('products.outOfStock', 'Product Out of Stock')}
          >
            {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
            {isAdded ? ` ${t('products.addedToCart', 'Added')}` : ` ${t('products.addToCart', 'Add to Cart')}`}
          </button>
        )}

        <button 
          onClick={handleWhatsAppOrder}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700' }}
        >
          {t('common.whatsapp', 'WhatsApp')}
        </button>
      </div>

      <Link 
        to={`/products/${product._id}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          marginTop: '10px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)'
        }}
      >
        <Eye size={12} /> {t('products.viewDetails', 'View Details')}
      </Link>
    </div>
  );
}

export default ProductCard;

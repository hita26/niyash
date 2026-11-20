import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Eye, CheckCircle2, AlertTriangle, Lock, Check, Plus, Minus, 
  Sparkles, ShieldCheck, Pill, Syringe, Droplets, Package, Activity, MessageCircle, ArrowRight
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
  const { t, language, translateCategory, translateDosageForm, formatCurrency } = useLanguage();
  const { isLoggedIn, openAuth } = useAuth();
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priceText = isLoggedIn 
      ? `*PTR (Wholesale):* ₹${Number(product.price || 0).toFixed(2)} / unit`
      : `*MRP:* ₹${Number(product.mrp || product.price || 0).toFixed(2)} / unit\n*Note:* Please share wholesale PTR quote`;

    const greeting = language === 'gu'
      ? `નમસ્તે નિયાંશ ફાર્મા, મારે આ પ્રોડક્ટ માટે પૂછપરછ / ઓર્ડર કરવો છે:`
      : language === 'hi'
      ? `नमस्ते नियांश फार्मा, मुझे इस उत्पाद के लिए पूछताछ / ऑर्डर करना है:`
      : `Hello Niyansh Pharma, I would like to enquire about wholesale booking for:`;

    const message = `${greeting}\n\n*Product Name:* ${product.name}\n*Company:* ${product.company || product.brand || 'Niyansh Pharma'}\n*Packing:* ${product.packing || 'Standard'}\n*Composition:* ${product.composition || 'N/A'}\n${priceText}\n*SKU:* ${product.sku || 'N/A'}\n\nPlease confirm availability and dispatch schedule.`;
    const whatsappUrl = `https://wa.me/919909923130?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onAddCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    setQuantity(1);
    if (addToCart) addToCart(product, 1);
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
    if (addToCart) addToCart(product, 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      setQuantity(0);
      if (addToCart) addToCart(product, -1);
    } else {
      const nextQty = quantity - 1;
      setQuantity(nextQty);
      if (addToCart) addToCart(product, -1);
    }
  };

  const displayMrp = Number(product.mrp && product.mrp > 0 ? product.mrp : product.price || 0);
  const displayPrice = Number(product.price || 0);
  const hasMargin = displayMrp > displayPrice && displayPrice > 0;
  const marginPercent = hasMargin ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;

  const hasValidImage = Boolean(product.imageUrl && product.imageUrl.trim() !== '' && product.imageUrl !== '/pharma-products.jpg');

  // Avoid duplicate brand chip if brand name is identical to product title
  const brandName = (product.company || product.brand || '').trim();
  const showBrandTag = brandName && brandName.toLowerCase() !== (product.name || '').trim().toLowerCase();

  return (
    <div 
      className="card card-hover-lift card-hover-pharma product-card-item" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        position: 'relative',
        transition: 'all 0.22s ease',
        minWidth: 0,
        backgroundColor: 'var(--bg-card)'
      }}
    >
      {/* Product Image Container - Fixed 1:1 Aspect Ratio (Amazon / Flipkart Standard) */}
      <Link 
        to={`/products/${product._id}`} 
        className="product-card-img-wrap"
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: '10px', 
          marginBottom: '10px', 
          backgroundColor: 'var(--bg-surface)',
          width: '100%',
          aspectRatio: '1 / 1',
          padding: '10px',
          boxSizing: 'border-box',
          border: '1px solid var(--border-light)'
        }}
        title={`View details for ${product.name}`}
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
              transition: 'transform 0.25s ease' 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
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
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '8px',
              border: '1px dashed var(--border-medium)',
              padding: '10px',
              boxSizing: 'border-box',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.9rem', fontWeight: '900', color: '#cbd5e1', fontStyle: 'italic', userSelect: 'none' }}>
              Rx
            </span>
            <div style={{ 
              width: '38px', 
              height: '38px', 
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
          </div>
        )}

        {/* Company / Brand Badge (Only shown when not identical to product title) */}
        {showBrandTag && (
          <span 
            style={{
              position: 'absolute', 
              top: '8px', 
              left: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              color: 'var(--primary-blue)', 
              fontSize: '0.70rem', 
              fontWeight: '700', 
              padding: '2px 8px',
              borderRadius: '12px', 
              border: '1px solid rgba(12, 61, 108, 0.15)', 
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
              maxWidth: '65%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={brandName}
          >
            {brandName}
          </span>
        )}

        {/* Top-Right Badge: Scheme or WHO-GMP Shield */}
        {product.scheme ? (
          <span 
            style={{
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              backgroundColor: '#fff7ed',
              color: '#ea580c', 
              fontSize: '0.68rem', 
              fontWeight: '800', 
              padding: '2px 7px',
              borderRadius: '10px', 
              border: '1px solid #fed7aa', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <Sparkles size={11} /> {product.scheme}
          </span>
        ) : product.featured ? (
          <span 
            style={{
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              backgroundColor: '#fef3c7',
              color: '#b45309', 
              fontSize: '0.68rem', 
              fontWeight: '700', 
              padding: '2px 7px',
              borderRadius: '10px', 
              border: '1px solid #fde68a',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            ★ {t('products.scheme', 'Featured')}
          </span>
        ) : (
          <span 
            style={{
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              color: '#059669', 
              fontSize: '0.66rem', 
              fontWeight: '700', 
              padding: '2px 7px',
              borderRadius: '10px', 
              border: '1px solid #a7f3d0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <ShieldCheck size={11} color="#059669" /> WHO-GMP
          </span>
        )}
      </Link>

      {/* Product Details Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Category Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.70rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {translateCategory(product.category || 'Pharma Products')}
          </span>
          {product.sku && (
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              {product.sku}
            </span>
          )}
        </div>

        {/* Product Name (2-Line Clamp - Amazon Standard) */}
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 
            style={{
              fontSize: '0.94rem', 
              fontWeight: '700', 
              color: 'var(--text-dark)', 
              minHeight: '2.5rem', 
              height: '2.5rem',
              overflow: 'hidden', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.35', 
              margin: '2px 0 4px 0',
              transition: 'color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        
        {/* Packing & Formulation Form */}
        <div style={{ fontSize: '0.80rem', color: 'var(--text-medium)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span>{t('products.packing', 'Packing')}: <strong style={{ color: 'var(--text-dark)' }}>{product.packing || 'Standard'}</strong></span>
          {product.form && <span style={{ color: '#94a3b8' }}> • {translateDosageForm(product.form)}</span>}
        </div>

        {/* Composition Snippet */}
        <div 
          style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-light)', 
            marginBottom: '6px', 
            minHeight: '1.25rem', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }} 
          title={product.composition || ''}
        >
          {product.composition ? (
            <span>Comp: <em style={{ color: 'var(--text-medium)', fontStyle: 'normal' }}>{product.composition}</em></span>
          ) : (
            <span style={{ visibility: 'hidden' }}>&nbsp;</span>
          )}
        </div>

        {/* Pricing Block (Modern B2B Wholesale Layout) */}
        <div 
          className="product-card-price-row" 
          style={{ 
            marginTop: 'auto', 
            paddingTop: '8px', 
            borderTop: '1px solid var(--border-light)', 
            minHeight: '62px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '3px'
          }}
        >
          {isLoggedIn ? (
            <>
              {/* Logged-in Chemist View: MRP Strikethrough + Margin Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', textDecoration: 'line-through' }} className="tabular-nums">
                  {t('products.mrp', 'MRP')} {formatCurrency(displayMrp)}
                </span>
                {hasMargin && (
                  <span style={{ fontSize: '0.68rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '1px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                    {marginPercent}% {language === 'gu' ? 'માર્જિન' : language === 'hi' ? 'मार्जिन' : 'MARGIN'}
                  </span>
                )}
              </div>
              
              {/* Wholesale PTR Rate + Stock Status */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                  <span style={{ fontSize: '0.70rem', color: 'var(--primary-blue)', fontWeight: '800', textTransform: 'uppercase' }}>
                    {t('products.ptr', 'PTR')}:
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-blue)' }} className="tabular-nums">
                    {formatCurrency(displayPrice)}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>
                    /{language === 'gu' ? 'નંગ' : language === 'hi' ? 'यूनिट' : 'unit'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.74rem', fontWeight: '600' }}>
                  {product.inStock ? (
                    <>
                      <CheckCircle2 size={12} color="#059669" />
                      <span style={{ color: '#059669' }}>{t('products.inStock', 'In Stock')}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} color="#ef4444" />
                      <span style={{ color: '#ef4444' }}>{t('products.outOfStock', 'Out of Stock')}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Guest / Public View: Retail MRP + In Stock */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '0.70rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {t('products.mrp', 'MRP')}:
                  </span>
                  <span style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-dark)' }} className="tabular-nums">
                    {formatCurrency(displayMrp)}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>
                    /{language === 'gu' ? 'નંગ' : language === 'hi' ? 'यूनिट' : 'unit'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.74rem', fontWeight: '600' }}>
                  {product.inStock ? (
                    <>
                      <CheckCircle2 size={12} color="#059669" />
                      <span style={{ color: '#059669' }}>{t('products.inStock', 'In Stock')}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} color="#ef4444" />
                      <span style={{ color: '#ef4444' }}>{t('products.outOfStock', 'Out of Stock')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Chemist PTR Rate Unlock Pill */}
              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openAuth();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    backgroundColor: '#eff6ff',
                    border: '1px dashed #3b82f6',
                    color: 'var(--primary-blue)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  title="Login as verified chemist to view Wholesale PTR Rate"
                >
                  <Lock size={11} color="var(--primary-blue)" />
                  <span>{t('products.loginForPtr', 'Login for PTR Rate')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons (Flipkart / Amazon Ergonomic Layout) */}
      <div 
        className="product-card-actions" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '8px', 
          marginTop: '10px' 
        }}
      >
        {quantity > 0 ? (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: '#ecfdf5', 
              border: '1.5px solid #10b981', 
              borderRadius: '8px', 
              padding: '2px 4px',
              minHeight: '36px',
              height: '36px',
              boxSizing: 'border-box'
            }}
          >
            <button 
              onClick={handleDecrement}
              style={{ 
                width: '26px', height: '26px', borderRadius: '5px', 
                backgroundColor: '#ffffff', color: '#047857', border: '1px solid #a7f3d0', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}
              title="Decrease quantity"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span style={{ fontWeight: '800', fontSize: '0.80rem', color: '#064e3b' }}>
              {quantity} {language === 'gu' ? 'બોક્સ' : language === 'hi' ? 'बॉक्स' : 'Box'}
            </span>
            <button 
              onClick={handleIncrement}
              style={{ 
                width: '26px', height: '26px', borderRadius: '5px', 
                backgroundColor: '#059669', color: '#ffffff', border: 'none', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}
              title="Add another box"
              aria-label="Add another box"
            >
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onAddCartClick}
            disabled={!product.inStock}
            className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ 
              padding: '6px 4px', 
              borderRadius: '8px', 
              fontSize: '0.78rem', 
              fontWeight: '700', 
              minHeight: '36px', 
              height: '36px', 
              opacity: product.inStock ? 1 : 0.6, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
            title={product.inStock ? t('products.addToCart', 'Add to Cart') : t('products.outOfStock', 'Product Out of Stock')}
          >
            {isAdded ? <Check size={13} /> : <ShoppingBag size={13} />}
            <span>{isAdded ? t('products.addedToCart', 'Added') : t('products.addToCart', 'Inquiry')}</span>
          </button>
        )}

        <button 
          onClick={handleWhatsAppOrder}
          className="btn btn-sm"
          style={{ 
            padding: '6px 4px', 
            borderRadius: '8px', 
            fontSize: '0.78rem', 
            fontWeight: '700', 
            minHeight: '36px', 
            height: '36px', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            backgroundColor: '#16a34a',
            borderColor: '#16a34a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          title="Direct WhatsApp Order Enquiry"
        >
          <MessageCircle size={13} />
          <span>{t('common.whatsapp', 'WhatsApp')}</span>
        </button>
      </div>

      {/* Details Link */}
      <Link 
        to={`/products/${product._id}`}
        style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '4px',
          marginTop: '8px', 
          fontSize: '0.78rem', 
          fontWeight: '600', 
          color: 'var(--text-medium)',
          textDecoration: 'none',
          transition: 'color 0.15s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-medium)'}
      >
        <Eye size={12} /> {t('products.viewDetails', 'View Details')}
        <ArrowRight size={11} style={{ marginLeft: '1px' }} />
      </Link>
    </div>
  );
}

export default ProductCard;

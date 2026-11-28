import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Eye, CheckCircle2, AlertTriangle, Lock, Check, Plus, Minus, 
  Sparkles, ShieldCheck, Pill, Syringe, Droplets, Package, Activity, MessageCircle, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';
import { cleanPharmaText, getEffectiveMrp, getEffectivePtr, getMarginPercent } from '../utils/pricing';

function getFormIcon(form) {
  const f = (form || '').toLowerCase();
  if (f.includes('inject')) return <Syringe size={20} />;
  if (f.includes('drop') || f.includes('syrup') || f.includes('liquid') || f.includes('susp')) return <Droplets size={20} />;
  if (f.includes('cream') || f.includes('gel') || f.includes('ointment')) return <Activity size={20} />;
  if (f.includes('surgic') || f.includes('powder')) return <Package size={20} />;
  return <Pill size={20} />;
}

function getCartQtyForProduct(productId) {
  try {
    const raw = localStorage.getItem('niyansh_enquiry_cart');
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    const found = parsed.find((item) => item?.product?._id === productId);
    return found ? Math.max(0, Number(found.quantity) || 0) : 0;
  } catch {
    return 0;
  }
}

function ProductCard({ product, addToCart }) {
  const { t, language, translateCategory, translateDosageForm, formatCurrency } = useLanguage();
  const { isLoggedIn, user, openAuth } = useAuth();
  const [quantity, setQuantity] = useState(() => (user ? getCartQtyForProduct(product._id) : 0));
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Keep card stepper synced with global cart updates across tabs/pages
  useEffect(() => {
    const syncQty = () => {
      if (!user) {
        setQuantity(0);
        return;
      }
      setQuantity(getCartQtyForProduct(product._id));
    };
    syncQty();
    window.addEventListener('niyansh:cart-updated', syncQty);
    window.addEventListener('storage', syncQty);
    return () => {
      window.removeEventListener('niyansh:cart-updated', syncQty);
      window.removeEventListener('storage', syncQty);
    };
  }, [product._id, user]);

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const effectivePtr = getEffectivePtr(product);
    const effectiveMrp = getEffectiveMrp(product);
    const priceText = isLoggedIn
      ? (effectivePtr > 0 ? `*PTR (Wholesale):* ₹${effectivePtr.toFixed(2)} / unit` : `*PTR (Wholesale):* Quote on Request`)
      : (effectiveMrp > 0 ? `*MRP:* ₹${effectiveMrp.toFixed(2)} / unit\n*Note:* Please share wholesale PTR quote` : `*Note:* Please share wholesale PTR quote`);

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
    if (!isLoggedIn && !user) {
      if (openAuth) openAuth();
      return;
    }
    if (addToCart) {
      const added = addToCart(product, 1);
      if (added === false) return;
    }
    setQuantity(1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn && !user) {
      if (openAuth) openAuth();
      return;
    }
    if (addToCart) {
      const added = addToCart(product, 1);
      if (added === false) return;
    }
    const nextQty = quantity + 1;
    setQuantity(nextQty);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn && !user) {
      if (openAuth) openAuth();
      return;
    }
    if (addToCart) {
      const added = addToCart(product, -1);
      if (added === false) return;
    }
    if (quantity <= 1) {
      setQuantity(0);
    } else {
      const nextQty = quantity - 1;
      setQuantity(nextQty);
    }
  };

  const displayMrp = getEffectiveMrp(product);
  const displayPrice = getEffectivePtr(product);
  const marginPercent = getMarginPercent(product);
  const hasMargin = marginPercent > 0;

  const hasValidImage = Boolean(
    product.imageUrl && 
    typeof product.imageUrl === 'string' &&
    product.imageUrl.trim() !== '' && 
    product.imageUrl !== '/pharma-products.jpg' &&
    !product.imageUrl.includes('unsplash.com') &&
    !product.imageUrl.includes('placeholder.com')
  );

  const validCategory = cleanPharmaText(product.category, 'Pharma Products');
  const cleanComposition = cleanPharmaText(product.composition, '');

  // Avoid duplicate brand chip if brand name is identical to product title or null
  const rawBrand = cleanPharmaText(product.company || product.brand, '');
  const brandName = rawBrand;
  const showBrandTag = Boolean(brandName && brandName.toLowerCase() !== (product.name || '').trim().toLowerCase());

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
        {hasValidImage && !imgError ? (
          <WatermarkedImage
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => {
              setImgError(true);
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
            className="product-card-rx-placeholder"
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
              padding: showBrandTag ? '34px 8px 26px 8px' : '14px 8px 26px 8px',
              boxSizing: 'border-box',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <span style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '0.78rem', fontWeight: '900', color: '#cbd5e1', fontStyle: 'italic', userSelect: 'none' }}>
              Rx
            </span>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#e0f2fe', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '5px',
              color: 'var(--primary-blue)',
              flexShrink: 0
            }}>
              {getFormIcon(product.form)}
            </div>
            <span style={{
              fontSize: '0.70rem',
              fontWeight: '800',
              color: 'var(--text-dark)',
              maxWidth: '96%',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.25,
              wordBreak: 'break-word'
            }}>
              {product.name}
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-light)', marginTop: '3px', fontWeight: '600', maxWidth: '96%', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {cleanPharmaText(product.packing || product.form, 'Pharmaceutical')}
            </span>
          </div>
        )}

        {/* Top Brand Badge (Full Name, Never Truncated to "DH D...") */}
        {showBrandTag && (
          <div
            className="product-card-badges-row"
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              right: '6px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          >
            <span 
              className="product-card-brand-badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                color: 'var(--primary-blue)', 
                fontSize: '0.62rem', 
                fontWeight: '800', 
                padding: '2px 7px',
                borderRadius: '8px', 
                border: '1px solid rgba(12, 61, 108, 0.16)', 
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                maxWidth: '100%',
                lineHeight: 1.2,
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
              title={brandName}
            >
              {brandName}
            </span>
          </div>
        )}

        {/* Bottom-Right Quality / Scheme Badge (Separate Row So It Never Collides With Brand) */}
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        >
          {product.scheme ? (
            <span 
              className="product-card-status-badge"
              style={{
                backgroundColor: '#fff7ed',
                color: '#ea580c', 
                fontSize: '0.61rem', 
                fontWeight: '800', 
                padding: '2px 6px',
                borderRadius: '8px', 
                border: '1px solid #fed7aa', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={10} /> {product.scheme}
            </span>
          ) : product.featured ? (
            <span 
              className="product-card-status-badge"
              style={{
                backgroundColor: '#fef3c7',
                color: '#b45309', 
                fontSize: '0.61rem', 
                fontWeight: '700', 
                padding: '2px 6px',
                borderRadius: '8px', 
                border: '1px solid #fde68a',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap'
              }}
            >
              ★ {t('products.scheme', 'Featured')}
            </span>
          ) : (
            <span 
              className="product-card-status-badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                color: '#059669', 
                fontSize: '0.61rem', 
                fontWeight: '700', 
                padding: '2px 6px',
                borderRadius: '8px', 
                border: '1px solid #a7f3d0', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '2px',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap'
              }}
            >
              <ShieldCheck size={10} color="#059669" /> WHO-GMP
            </span>
          )}
        </div>
      </Link>

      {/* Product Details Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Category Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2px 6px', marginBottom: '2px', minWidth: 0 }}>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2px', lineHeight: 1.2, wordBreak: 'break-word' }}>
            {translateCategory(validCategory)}
          </span>
          {product.sku && (
            <span style={{ fontSize: '0.63rem', color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
              {product.sku}
            </span>
          )}
        </div>

        {/* Product Name (2-Line Clamp - Amazon Standard) */}
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 
            style={{
              fontSize: '0.9rem', 
              fontWeight: '700', 
              color: 'var(--text-dark)', 
              minHeight: '2.35rem', 
              overflow: 'hidden', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.3', 
              margin: '2px 0 4px 0',
              wordBreak: 'break-word',
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
        <div style={{ fontSize: '0.73rem', color: 'var(--text-medium)', marginBottom: '3px', lineHeight: 1.3, wordBreak: 'break-word' }}>
          <span>{t('products.packing', 'Packing')}: <strong style={{ color: 'var(--text-dark)' }}>{cleanPharmaText(product.packing, 'Standard')}</strong></span>
          {cleanPharmaText(product.form) && <span style={{ color: '#94a3b8' }}> • {translateDosageForm(cleanPharmaText(product.form))}</span>}
        </div>

        {/* Composition Snippet */}
        <div 
          style={{ 
            fontSize: '0.71rem', 
            color: 'var(--text-light)', 
            marginBottom: '6px', 
            minHeight: '1.85rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word'
          }} 
          title={cleanComposition} 
        >
          {cleanComposition ? (
            <span>Comp: <em style={{ color: 'var(--text-medium)', fontStyle: 'normal' }}>{cleanComposition}</em></span>
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
            minHeight: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          {isLoggedIn ? (
            <>
              {/* Logged-in Chemist View: MRP Strikethrough + Margin Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', whiteSpace: 'nowrap' }} className="tabular-nums">
                  {t('products.mrp', 'MRP')} {formatCurrency(displayMrp)}
                </span>
                {hasMargin && (
                  <span style={{ fontSize: '0.64rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '1px 5px', borderRadius: '4px', border: '1px solid #a7f3d0', whiteSpace: 'nowrap' }}>
                    {marginPercent}% {language === 'gu' ? 'માર્જિન' : language === 'hi' ? 'मार्जिन' : 'MARGIN'}
                  </span>
                )}
              </div>
              
              {/* Wholesale PTR Rate + Stock Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', minWidth: 0 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--primary-blue)', fontWeight: '800', textTransform: 'uppercase' }}>
                    {t('products.ptr', 'PTR')}:
                  </span>
                  <span style={{ fontSize: displayPrice > 0 ? '1.05rem' : '0.84rem', fontWeight: '800', color: 'var(--primary-blue)' }} className="tabular-nums">
                    {displayPrice > 0 ? formatCurrency(displayPrice) : 'Rate on Request'}
                  </span>
                  {displayPrice > 0 && (
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-medium)', whiteSpace: 'nowrap' }}>
                      /{language === 'gu' ? 'નંગ' : language === 'hi' ? 'यूनिट' : 'unit'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {product.inStock ? (
                    <>
                      <CheckCircle2 size={11} color="#059669" />
                      <span style={{ color: '#059669' }}>{t('products.inStock', 'In Stock')}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={11} color="#ef4444" />
                      <span style={{ color: '#ef4444' }}>{t('products.outOfStock', 'Out of Stock')}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Guest / Public View: Retail MRP + In Stock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', minWidth: 0 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {t('products.mrp', 'MRP')}:
                  </span>
                  <span style={{ fontSize: '1.06rem', fontWeight: '800', color: 'var(--text-dark)' }} className="tabular-nums">
                    {formatCurrency(displayMrp)}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-medium)', whiteSpace: 'nowrap' }}>
                    /{language === 'gu' ? 'નંગ' : language === 'hi' ? 'यूनिट' : 'unit'}
                  </span>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {product.inStock ? (
                    <>
                      <CheckCircle2 size={11} color="#059669" />
                      <span style={{ color: '#059669' }}>{t('products.inStock', 'In Stock')}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={11} color="#ef4444" />
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
                    gap: '4px',
                    backgroundColor: '#eff6ff',
                    border: '1px dashed #3b82f6',
                    color: 'var(--primary-blue)',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    fontSize: '0.69rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title="Login as verified chemist to view Wholesale PTR Rate"
                >
                  <Lock size={11} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t('products.loginForPtr', 'Login for PTR Rate')}</span>
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
            className="product-card-stepper"
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
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <button 
              type="button"
              onClick={handleDecrement}
              style={{ 
                width: '24px', height: '24px', minHeight: '24px', borderRadius: '5px', flexShrink: 0,
                backgroundColor: '#ffffff', color: '#047857', border: '1px solid #a7f3d0', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
              }}
              title="Decrease quantity"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span style={{ fontWeight: '800', fontSize: '0.75rem', color: '#064e3b', whiteSpace: 'nowrap', padding: '0 2px' }}>
              {quantity} {language === 'gu' ? 'બોક્સ' : language === 'hi' ? 'बॉक्स' : 'Box'}
            </span>
            <button 
              type="button"
              onClick={handleIncrement}
              style={{ 
                width: '24px', height: '24px', minHeight: '24px', borderRadius: '5px', flexShrink: 0,
                backgroundColor: '#059669', color: '#ffffff', border: 'none', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
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

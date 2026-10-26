import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

function ProductCard({ product, addToCart }) {
  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Niyansh Pharma, I would like to enquire about this product:\n\n*Product Name:* ${product.name}\n*Brand:* ${product.brand}\n*Packing:* ${product.packing}\n*Price:* ₹${product.price.toFixed(2)}\n*SKU:* ${product.sku || 'N/A'}`;
    const whatsappUrl = `https://wa.me/919909923130?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onAddCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image */}
      <Link to={`/products/${product._id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#f8fafc' }}>
        <img 
          src={product.imageUrl || '/pharma-products.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/pharma-products.jpg';
          }}
          style={{ width: '100%', height: '180px', objectFit: 'contain', transition: 'var(--transition-smooth)' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <span 
          style={{
            position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(12, 61, 108, 0.1)',
            color: 'var(--primary-blue)', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px',
            borderRadius: '20px', border: '1px solid rgba(12, 61, 108, 0.2)'
          }}
        >
          {product.brand}
        </span>
        {product.featured && (
          <span 
            style={{
              position: 'absolute', top: '10px', right: '10px', backgroundColor: '#fef3c7',
              color: '#b45309', fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px',
              borderRadius: '12px', border: '1px solid #fde68a'
            }}
          >
            ★ Featured
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category || 'Pharmaceutical'}
        </span>
        <Link to={`/products/${product._id}`}>
          <h3 
            style={{
              fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-dark)', minHeight: '2.6rem',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              lineHeight: '1.3', marginBottom: '4px'
            }}
          >
            {product.name}
          </h3>
        </Link>
        
        <p style={{ fontSize: '0.82rem', color: 'var(--text-medium)', marginBottom: '4px' }}>
          Packing: <strong style={{ color: 'var(--text-dark)' }}>{product.packing || 'Standard'}</strong>
        </p>

        {product.composition && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.composition}>
            Composition: <span style={{ fontStyle: 'italic', color: 'var(--text-medium)' }}>{product.composition}</span>
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '10px' }}>
          <div>
            {product.mrp && product.mrp > product.price ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', textDecoration: 'line-through' }} className="tabular-nums">
                  MRP ₹{product.mrp.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.7rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% MARGIN
                </span>
              </div>
            ) : null}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary-blue)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                PTR (Wholesale):
              </span>
              <span style={{ fontSize: '1.28rem', fontWeight: '800', color: 'var(--primary-blue)' }} className="tabular-nums">
                ₹{product.price.toFixed(2)}
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-medium)' }}> /unit</span>
              </span>
            </div>
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

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <button 
          onClick={onAddCartClick}
          disabled={!product.inStock}
          className="btn btn-primary btn-sm"
          style={{ padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', opacity: product.inStock ? 1 : 0.6 }}
          title={product.inStock ? 'Add to Quote Enquiry' : 'Product Out of Stock'}
        >
          <ShoppingBag size={14} /> Add Quote
        </button>

        <button 
          onClick={handleWhatsAppOrder}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
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

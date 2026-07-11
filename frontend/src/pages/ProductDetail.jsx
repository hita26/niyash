import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data.product);
        setRelated(data.related || []);
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1); // Reset quantity on page change
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ border: '4px solid #cbd5e1', borderTop: '4px solid var(--primary-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-medium)' }}>The medicine or product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    const message = `Hello Niyansh Pharma, I want to enquire about:\n\n*Product:* ${product.name}\n*Brand:* ${product.brand}\n*Packing:* ${product.packing}\n*Required Quantity:* ${quantity}\n*SKU:* ${product.sku || 'N/A'}`;
    const whatsappUrl = `https://wa.me/919909923130?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Back Link */}
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '25px', color: 'var(--text-medium)', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="detail-layout" style={{ marginBottom: '50px' }}>
          
          {/* Image */}
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', minHeight: '350px'
          }}>
            <img 
              src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'} 
              alt={product.name} 
              style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }}
            />
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{
                backgroundColor: 'rgba(12, 61, 108, 0.08)', color: 'var(--primary-blue)',
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                textTransform: 'uppercase', border: '1px solid rgba(12, 61, 108, 0.15)', display: 'inline-block', marginBottom: '10px'
              }}>
                {product.brand}
              </span>
              
              <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '10px' }}>{product.name}</h1>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Category: {product.category}</p>
            </div>

            {/* Price & Stock */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '15px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Wholesale Estimate</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                  ₹{product.price.toFixed(2)}
                  <span style={{ fontSize: '0.9rem', fontWeight: '400', color: 'var(--text-medium)' }}> / strip</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: '700' }}>
                {product.inStock ? (
                  <>
                    <CheckCircle2 size={18} color="var(--secondary-green)" />
                    <span style={{ color: 'var(--secondary-green)' }}>In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} color="#ef4444" />
                    <span style={{ color: '#ef4444' }}>Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Product description */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Description</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {product.description || 'No additional description provided. Please call us for full therapeutic details and applications.'}
              </p>
            </div>

            {/* Specifications table */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Product Specifications</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-medium)', fontWeight: '600', width: '150px' }}>Composition</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-dark)', fontStyle: 'italic' }}>{product.composition || 'N/A'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-medium)', fontWeight: '600' }}>Packing</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-dark)' }}>{product.packing || 'N/A'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-medium)', fontWeight: '600' }}>Form</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-dark)' }}>{product.form || 'N/A'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-medium)', fontWeight: '600' }}>Manufacturer</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-dark)' }}>{product.manufacturer || 'N/A'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-medium)', fontWeight: '600' }}>SKU Code</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-dark)' }}>{product.sku || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quantity Selector & Order Buttons */}
            {product.inStock && (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', height: '45px' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ width: '40px', backgroundColor: '#f1f5f9', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    -
                  </button>
                  <span style={{ width: '50px', textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ width: '40px', backgroundColor: '#f1f5f9', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary" 
                  style={{ height: '45px', flex: 1, padding: '0 20px', gap: '8px' }}
                >
                  <ShoppingBag size={18} /> Add to Quote Cart
                </button>

                {/* WhatsApp */}
                <button 
                  onClick={handleWhatsAppOrder}
                  className="btn btn-secondary" 
                  style={{ height: '45px', padding: '0 25px' }}
                >
                  WhatsApp Order
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '25px', position: 'relative', paddingBottom: '10px' }}>
              Related Products
              <span style={{ content: '""', display: 'block', width: '50px', height: '3px', backgroundColor: 'var(--secondary-green)', position: 'absolute', bottom: 0, left: 0 }}></span>
            </h2>
            
            <div className="grid-4">
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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Sparkles, Search, SlidersHorizontal, ShieldCheck, 
  ArrowUpDown, RefreshCcw, CheckCircle2, Package, Award, ArrowRight, X
} from 'lucide-react';
import { useLiveSync, SYNC_EVENTS } from '../utils/liveSync';
import { useLanguage } from '../context/LanguageContext';

export default function OurProducts({ addToCart, searchTerm, setSearchTerm }) {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort states
  const [localSearch, setLocalSearch] = useState('');
  const [selectedForm, setSelectedForm] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState('featured');

  const formsList = [
    'All',
    'Tablet',
    'Capsule',
    'Syrup',
    'Injection',
    'Cream',
    'Ointment',
    'Drops',
    'Suspension'
  ];

  // Fetch only products flagged with isOurProduct=true (or fallback to DAXIA flagship)
  const fetchOurProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      // First attempt: Query backend specifically for isOurProduct=true
      const res = await fetch('/api/products?isOurProduct=true&limit=100');
      if (res.ok) {
        const data = await res.json();
        const items = data.products || data || [];
        if (items.length > 0) {
          setProducts(items);
          setLoading(false);
          return;
        }
      }

      // Fallback: If no isOurProduct explicitly returned, check all products and filter for isOurProduct OR DAXIA
      const fallbackRes = await fetch('/api/products?limit=200');
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        const allItems = fbData.products || fbData || [];
        const filtered = allItems.filter(p => 
          p.isOurProduct === true || 
          (p.company && p.company.toUpperCase().includes('DAXIA')) ||
          (p.brand && p.brand.toUpperCase().includes('DAXIA'))
        );
        setProducts(filtered.length > 0 ? filtered : allItems.slice(0, 24));
      } else {
        throw new Error('Failed to load exclusive products');
      }
    } catch (err) {
      console.warn('OurProducts load error:', err);
      setError(err.message || 'Unable to load products');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOurProducts();
  }, [fetchOurProducts]);

  // Real-time synchronization whenever admin updates or adds products
  useLiveSync(
    [SYNC_EVENTS.PRODUCT_CREATED, SYNC_EVENTS.PRODUCT_UPDATED, SYNC_EVENTS.PRODUCT_DELETED, SYNC_EVENTS.CATALOG_SYNCED],
    () => fetchOurProducts(true)
  );

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    const query = (localSearch || searchTerm || '').trim().toLowerCase();
    if (query) {
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.composition && p.composition.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    // Dosage Form filter
    if (selectedForm !== 'All') {
      result = result.filter(p => 
        p.form && p.form.toLowerCase().includes(selectedForm.toLowerCase())
      );
    }

    // In Stock filter
    if (onlyInStock) {
      result = result.filter(p => p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0));
    }

    // Sorting
    if (sortOrder === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOrder === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      // Default: featured first, then newest
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, localSearch, searchTerm, selectedForm, onlyInStock, sortOrder]);

  return (
    <div className="page-wrapper our-products-page" style={{ minHeight: '85vh', backgroundColor: 'var(--bg-main)', paddingBottom: '60px' }}>
      
      {/* HERO BANNER SECTION - Responsive & Modern */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        color: '#ffffff',
        padding: '48px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.16)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: '700', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <Sparkles size={16} style={{ color: '#fef08a' }} />
            <span>
              {language === 'gu' ? 'વિશેષ ફોર્મ્યુલેશન્સ • ડાયરેક્ટ ડિસ્ટ્રીબ્યુશન' : language === 'hi' ? 'विशेष फॉर्मूलेशन • प्रत्यक्ष वितरण' : 'Exclusive Formulations • Direct Distribution'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '800', lineHeight: '1.2', margin: '0 0 12px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            {language === 'gu' ? 'અમારી વિશેષ પ્રોડક્ટ્સ' : language === 'hi' ? 'हमारे विशेष उत्पाद' : 'Our Exclusive Products'}
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.12rem)', maxWidth: '720px', margin: '0 0 24px 0', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
            {language === 'gu'
              ? 'નિયાંશ ફાર્મા દ્વારા સીધા વિતરણ કરવામાં આવતી પ્રીમિયમ WHO-GMP ગુણવત્તાયુક્ત ફાર્માસ્યુટિકલ પ્રોડક્ટ્સ. શ્રેષ્ઠ PTR રેટ્સ અને ત્વરિત સપ્લાયની ખાતરી.'
              : language === 'hi'
              ? 'नियांश फार्मा द्वारा सीधे वितरित प्रीमियम WHO-GMP गुणवत्तापूर्ण फार्मास्युटिकल उत्पाद। सर्वोत्तम PTR दर और त्वरित आपूर्ति।'
              : 'Directly distributed premium WHO-GMP quality pharmaceutical formulations with competitive wholesale PTR rates and immediate dispatch across Gujarat.'}
          </p>

          {/* Quick Highlights Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '6px 12px', borderRadius: '8px' }}>
              <ShieldCheck size={16} style={{ color: '#34d399' }} />
              <span>100% Genuine WHO-GMP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '6px 12px', borderRadius: '8px' }}>
              <Award size={16} style={{ color: '#fef08a' }} />
              <span>Attractive PTR & Schemes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '6px 12px', borderRadius: '8px' }}>
              <Package size={16} style={{ color: '#6ee7b7' }} />
              <span>Ready Stock Dispatch</span>
            </div>
          </div>

        </div>
      </section>

      {/* SEARCH & FILTER CONTROLS TOOLBAR */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 0 20px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          
          {/* Top Row: Search Input + Sorting */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '520px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text"
                placeholder={language === 'gu' ? 'પ્રોડક્ટનું નામ અથવા કમ્પોઝિશન શોધો...' : language === 'hi' ? 'उत्पाद का नाम या संरचना खोजें...' : 'Search our products by name, salt composition, SKU...'}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-dark)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-medium)', cursor: 'pointer' }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* In Stock Only Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', userSelect: 'none' }}>
                <input 
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                />
                <span>{language === 'gu' ? 'ઇન સ્ટોક જ' : language === 'hi' ? 'केवल इन-स्टॉक' : 'In Stock Only'}</span>
              </label>

              {/* Sorting Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={16} style={{ color: 'var(--text-medium)' }} />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-dark)',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  <option value="featured">{language === 'gu' ? 'શ્રેષ્ઠ પ્રથમ' : 'Featured First'}</option>
                  <option value="name-asc">{language === 'gu' ? 'નામ (A to Z)' : 'Name (A to Z)'}</option>
                  <option value="price-low">{language === 'gu' ? 'કિંમત (ઓછી થી વધુ)' : 'Price: Low to High'}</option>
                  <option value="price-high">{language === 'gu' ? 'કિંમત (વધુ થી ઓછી)' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Dosage Form Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-medium)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {language === 'gu' ? 'સ્વરૂપ:' : 'Form:'}
            </span>
            {formsList.map((form) => {
              const isSelected = selectedForm === form;
              return (
                <button
                  key={form}
                  onClick={() => setSelectedForm(form)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '700' : '600',
                    border: '1px solid',
                    borderColor: isSelected ? '#059669' : 'var(--border-light)',
                    backgroundColor: isSelected ? '#059669' : 'var(--bg-main)',
                    color: isSelected ? '#ffffff' : 'var(--text-dark)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {form === 'All' ? (language === 'gu' ? 'તમામ' : language === 'hi' ? 'सभी' : 'All Forms') : form}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* PRODUCTS GRID CONTENT */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 0 20px' }}>
        
        {/* Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-medium)', fontWeight: '600' }}>
            {language === 'gu' ? (
              <span>કુલ <strong style={{ color: 'var(--text-dark)' }}>{filteredProducts.length}</strong> વિશેષ પ્રોડક્ટ્સ ઉપલબ્ધ</span>
            ) : language === 'hi' ? (
              <span>कुल <strong style={{ color: 'var(--text-dark)' }}>{filteredProducts.length}</strong> विशेष उत्पाद उपलब्ध</span>
            ) : (
              <span>Showing <strong style={{ color: 'var(--text-dark)' }}>{filteredProducts.length}</strong> exclusive formulations</span>
            )}
          </div>

          <Link 
            to="/products"
            style={{
              fontSize: '0.85rem',
              color: 'var(--primary-color)',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{language === 'gu' ? 'તમામ 9,500+ દવાઓ જુઓ' : language === 'hi' ? 'सभी 9,500+ दवाएं देखें' : 'View All 9,500+ General Catalog'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {[...Array(8)].map((_, i) => (
              <SkeletonLoader key={i} type="product-card" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          /* PRODUCTS GRID */
          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id || product.sku} 
                product={product} 
                addToCart={addToCart} 
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: '#059669',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Package size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 8px 0' }}>
              {language === 'gu' ? 'કોઈ પ્રોડક્ટ મળી નથી' : language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No Exclusive Products Found'}
            </h3>
            <p style={{ color: 'var(--text-medium)', maxWidth: '460px', margin: '0 auto 20px auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {language === 'gu'
                ? 'તમારી શોધ મુજબ કોઈ પ્રોડક્ટ મળી નથી અથવા એડમિન પેનલમાંથી "Our Product" તરીકે પ્રોડક્ટ ઉમેરવાની બાકી છે.'
                : 'No products match your current filter, or products are yet to be marked as "Our Product" in the Admin Panel.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {(localSearch || selectedForm !== 'All' || onlyInStock) && (
                <button
                  onClick={() => { setLocalSearch(''); setSelectedForm('All'); setOnlyInStock(false); }}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '8px', padding: '8px 18px', fontWeight: '600' }}
                >
                  {language === 'gu' ? 'ફિલ્ટર્સ રીસેટ કરો' : 'Reset Filters'}
                </button>
              )}
              <Link 
                to="/products"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px', padding: '8px 18px', fontWeight: '700', textDecoration: 'none' }}
              >
                {language === 'gu' ? 'તમામ પ્રોડક્ટ્સ જુઓ' : 'Browse All Products'}
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

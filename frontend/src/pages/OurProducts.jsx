import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Sparkles, Search, SlidersHorizontal, ShieldCheck, 
  ArrowUpDown, RefreshCcw, CheckCircle2, Package, Award, ArrowRight, X, ChevronLeft, ChevronRight
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
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState('featured');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
      const res = await fetch('/api/products?isOurProduct=true&limit=250');
      if (res.ok) {
        const data = await res.json();
        const items = data.products || data || [];
        if (items.length > 0) {
          setProducts(items);
          setLoading(false);
          return;
        }
      }

      // Check if any products exist that match our brand
      const fallbackRes = await fetch('/api/products?limit=250');
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        const allItems = fbData.products || fbData || [];
        const filtered = allItems.filter(p => 
          p.isOurProduct === true || 
          (p.company && p.company.toUpperCase().includes('DAXIA')) ||
          (p.brand && p.brand.toUpperCase().includes('DAXIA'))
        );
        setProducts(filtered);
      } else {
        setProducts([]);
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

  // Reset to first page whenever search/filter parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch, searchTerm, selectedForm, onlyInStock, sortOrder, pageSize]);

  // Standard Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="page-wrapper our-products-page" style={{ minHeight: '85vh', backgroundColor: 'var(--bg-main)', paddingBottom: '60px' }}>
      
      {/* CLEAN COMPACT PAGE HEADER - Fast, sleek, no bulky green banner */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 10px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Sparkles size={14} />
              <span>{language === 'gu' ? 'વિશેષ ફોર્મ્યુલેશન્સ' : language === 'hi' ? 'विशेष फॉर्मूलेशन' : 'Exclusive Formulations'}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              {language === 'gu' ? 'અમારી પ્રોડક્ટ્સ' : language === 'hi' ? 'हमारे उत्पाद' : 'Our Products'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', margin: 0, maxWidth: '640px' }}>
              {language === 'gu'
                ? 'નિયાંશ ફાર્મા દ્વારા સીધા વિતરણ કરવામાં આવતી વિશેષ અને ગુણવત્તાયુક્ત ફાર્માસ્યુટિકલ પ્રોડક્ટ્સ.'
                : 'Directly distributed proprietary formulations with authentic WHO-GMP quality and fast dispatch across Gujarat.'}
            </p>
          </div>

          <Link 
            to="/products"
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{language === 'gu' ? 'તમામ દવાઓ જુઓ (9,500+)' : 'Browse Full Catalog (9,500+)'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS TOOLBAR */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 0 20px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '14px 18px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          
          {/* Top Row: Search Input + In-stock toggle + Sorting */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '480px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text"
                placeholder={language === 'gu' ? 'પ્રોડક્ટનું નામ અથવા કમ્પોઝિશન શોધો...' : language === 'hi' ? 'उत्पाद का नाम या संरचना खोजें...' : 'Search our products by name, composition, SKU...'}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-dark)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-medium)', cursor: 'pointer' }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* In Stock Only Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-dark)', userSelect: 'none' }}>
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
                <ArrowUpDown size={15} style={{ color: 'var(--text-medium)' }} />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-dark)',
                    fontSize: '0.84rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-medium)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {language === 'gu' ? 'સ્વરૂપ:' : 'Form:'}
            </span>
            {formsList.map((form) => {
              const isSelected = selectedForm === form;
              return (
                <button
                  key={form}
                  onClick={() => setSelectedForm(form)}
                  style={{
                    padding: '4px 11px',
                    borderRadius: '16px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? '700' : '600',
                    border: '1px solid',
                    borderColor: isSelected ? '#059669' : 'var(--border-light)',
                    backgroundColor: isSelected ? '#059669' : 'var(--bg-main)',
                    color: isSelected ? '#ffffff' : 'var(--text-dark)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
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
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '18px 20px 0 20px' }}>
        
        {/* Count Bar with Page Size Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-medium)', fontWeight: '600' }}>
            {language === 'gu' ? (
              <span>કુલ <strong style={{ color: 'var(--text-dark)' }}>{filteredProducts.length}</strong> પ્રોડક્ટ્સમાંથી <strong>{paginatedProducts.length}</strong> દર્શાવેલ (પેજ {currentPage}/{totalPages})</span>
            ) : language === 'hi' ? (
              <span>कुल <strong style={{ color: 'var(--text-dark)' }}>{filteredProducts.length}</strong> में से <strong>{paginatedProducts.length}</strong> उत्पाद (पेज {currentPage}/{totalPages})</span>
            ) : (
              <span>Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
            <span>{language === 'gu' ? 'પ્રતિ પેજ:' : 'Per page:'}</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-dark)',
                fontSize: '0.82rem',
                fontWeight: '600'
              }}
            >
              <option value={12}>12</option>
              <option value={20}>20</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '18px'
          }}>
            {[...Array(pageSize > 12 ? 12 : pageSize)].map((_, i) => (
              <SkeletonLoader key={i} type="product-card" />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          /* PRODUCTS GRID */
          <>
            <div className="products-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '18px'
            }}>
              {paginatedProducts.map((product) => (
                <ProductCard 
                  key={product._id || product.sku} 
                  product={product} 
                  addToCart={addToCart} 
                />
              ))}
            </div>

            {/* REAL-WORLD PAGINATION BAR */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '36px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-light)',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    opacity: currentPage === 1 ? 0.35 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>{language === 'gu' ? 'પાછળ' : 'Prev'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                      const isActive = currentPage === p;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                          style={{
                            minWidth: '34px',
                            height: '34px',
                            padding: '0 8px',
                            borderRadius: '8px',
                            fontWeight: isActive ? '800' : '600',
                            fontSize: '0.84rem'
                          }}
                        >
                          {p}
                        </button>
                      );
                    } else if (p === currentPage - 3 || p === currentPage + 3) {
                      return <span key={p} style={{ padding: '0 4px', color: 'var(--text-light)', fontSize: '0.8rem' }}>•••</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    opacity: currentPage === totalPages ? 0.35 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{language === 'gu' ? 'આગળ' : 'Next'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '50px 20px',
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: '#059669',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Package size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 6px 0' }}>
              {language === 'gu' ? 'કોઈ પ્રોડક્ટ મળી નથી' : language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No Products Found'}
            </h3>
            <p style={{ color: 'var(--text-medium)', maxWidth: '440px', margin: '0 auto 18px auto', fontSize: '0.88rem', lineHeight: '1.5' }}>
              {language === 'gu'
                ? 'તમારી શોધ મુજબ કોઈ પ્રોડક્ટ મળી નથી.'
                : 'No products match your current search criteria.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {(localSearch || selectedForm !== 'All' || onlyInStock) && (
                <button
                  onClick={() => { setLocalSearch(''); setSelectedForm('All'); setOnlyInStock(false); }}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '600' }}
                >
                  {language === 'gu' ? 'ફિલ્ટર્સ રીસેટ કરો' : 'Reset Filters'}
                </button>
              )}
              <Link 
                to="/products"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '700', textDecoration: 'none' }}
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

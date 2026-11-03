import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCcw, X, ChevronLeft, ChevronRight, Building2, Search } from 'lucide-react';

function Products({ addToCart, searchTerm, setSearchTerm }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination and sorting states
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState('popular');
  
  // Mobile filter drawer state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filtering states (arrays for checkboxes)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const MAX_PRICE_LIMIT = 2000;
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);

  const activeFilterCount = selectedCategories.length + selectedBrands.length + selectedCompanies.length + selectedForms.length + (maxPrice < MAX_PRICE_LIMIT ? 1 : 0);

  const categories = [
    'Pharma Products',
    'OTC Products',
    'Injectables',
    'Surgical & Medical Supplies'
  ];

  // Default brands sorted strictly in alphabetical order (A to Z)
  const defaultBrands = [
    'Abbott',
    'Alkem',
    'Biochem',
    'Cipla',
    'Dr. Morepen',
    'Elder Pharmaceuticals',
    'Healing Pharma',
    'Intas',
    'Leeford Healthcare',
    'Lucid Pharma',
    'Namcare Pharma',
    'Steris Pharma',
    'Sun Pharma',
    'Troikaa Pharmaceuticals',
    'Zydus'
  ];

  const [availableBrands, setAvailableBrands] = useState(defaultBrands);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // Fetch dynamic brands & companies from backend
  useEffect(() => {
    let isCancelled = false;
    const fetchMetaFilters = async () => {
      try {
        const res = await fetch('/api/products/meta/filters');
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            if (data.brands && data.brands.length > 0) {
              const merged = [...new Set([...defaultBrands, ...data.brands])]
                .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
              setAvailableBrands(merged);
            }
            if (data.companies && data.companies.length > 0) {
              setAvailableCompanies(data.companies.sort((a, b) => a.localeCompare(b)));
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch filter metadata:', err);
      }
    };
    fetchMetaFilters();
    return () => { isCancelled = true; };
  }, []);

  const brands = useMemo(() => {
    return [...availableBrands].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [availableBrands]);

  const filteredCompaniesList = useMemo(() => {
    if (!companySearchTerm.trim()) return availableCompanies.slice(0, 50);
    return availableCompanies
      .filter(c => c.toLowerCase().includes(companySearchTerm.toLowerCase().trim()))
      .slice(0, 50);
  }, [availableCompanies, companySearchTerm]);

  const forms = [
    'Tablet', 'Capsule', 'Injection', 'Powder', 'IV Fluid', 'Syrup', 'Gloves', 'Syringe'
  ];

  // Sync state with search params on load or URL change
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const catVal = searchParams.get('category') ? searchParams.get('category').split(',') : [];
    const brandVal = searchParams.get('brand') ? searchParams.get('brand').split(',') : [];
    const compVal = searchParams.get('company') ? searchParams.get('company').split(',') : [];
    const formVal = searchParams.get('form') ? searchParams.get('form').split(',') : [];
    const priceVal = parseFloat(searchParams.get('maxPrice')) || MAX_PRICE_LIMIT;
    const pageVal = parseInt(searchParams.get('page')) || 1;
    const sortVal = searchParams.get('sort') || 'popular';

    if (searchTerm !== searchVal) setSearchTerm(searchVal);
    setSelectedCategories(catVal.filter(Boolean));
    setSelectedBrands(brandVal.filter(Boolean));
    setSelectedCompanies(compVal.filter(Boolean));
    setSelectedForms(formVal.filter(Boolean));
    setMaxPrice(priceVal);
    setPage(pageVal);
    setSortOrder(sortVal);
  }, [searchParams]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showMobileFilters]);

  // Handle Escape key to close mobile filters
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showMobileFilters) {
        setShowMobileFilters(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMobileFilters]);

  // Fetch products whenever searchParams change (single source of truth)
  useEffect(() => {
    let isCancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const searchVal = searchParams.get('search') || '';
        const catVal = searchParams.get('category') || '';
        const brandVal = searchParams.get('brand') || '';
        const compVal = searchParams.get('company') || '';
        const formVal = searchParams.get('form') || '';
        const maxPriceParam = searchParams.get('maxPrice');
        const sortVal = searchParams.get('sort') || 'popular';
        const pageVal = searchParams.get('page') || '1';

        if (searchVal) queryParams.append('search', searchVal);
        if (catVal) queryParams.append('category', catVal);
        if (brandVal) queryParams.append('brand', brandVal);
        if (compVal) queryParams.append('company', compVal);
        if (formVal) queryParams.append('form', formVal);
        if (maxPriceParam && parseFloat(maxPriceParam) < MAX_PRICE_LIMIT) {
          queryParams.append('maxPrice', maxPriceParam);
        }
        if (sortVal) queryParams.append('sort', sortVal);
        queryParams.append('page', pageVal);
        queryParams.append('limit', '12');

        const response = await fetch(`/api/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        if (!isCancelled) {
          setProducts(Array.isArray(data.products) ? data.products : []);
          setPages(data.pages || 1);
          setTotal(data.total || 0);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  // Update query params helper for arrays (checkboxes)
  const handleCheckboxChange = (key, list, setList, val) => {
    let newList;
    if (list.includes(val)) {
      newList = list.filter((item) => item !== val);
    } else {
      newList = [...list, val];
    }
    setList(newList);

    const newParams = new URLSearchParams(searchParams);
    if (newList.length > 0) {
      newParams.set(key, newList.join(','));
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceChange = (e) => {
    const val = parseFloat(e.target.value);
    setMaxPrice(val);
    const newParams = new URLSearchParams(searchParams);
    if (val < MAX_PRICE_LIMIT) {
      newParams.set('maxPrice', val.toString());
    } else {
      newParams.delete('maxPrice');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo(0, 0);
    }
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedCompanies([]);
    setSelectedForms([]);
    setMaxPrice(MAX_PRICE_LIMIT);
    setSortOrder('popular');
    setPage(1);
  };

  const updateSortParam = (val) => {
    setSortOrder(val);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', val);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const removeFilterTag = (type, val) => {
    if (type === 'category') handleCheckboxChange('category', selectedCategories, setSelectedCategories, val);
    if (type === 'brand') handleCheckboxChange('brand', selectedBrands, setSelectedBrands, val);
    if (type === 'company') handleCheckboxChange('company', selectedCompanies, setSelectedCompanies, val);
    if (type === 'form') handleCheckboxChange('form', selectedForms, setSelectedForms, val);
    if (type === 'price') {
      setMaxPrice(MAX_PRICE_LIMIT);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('maxPrice');
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
    if (type === 'search') {
      const p = new URLSearchParams(searchParams);
      p.delete('search');
      p.set('page', '1');
      setSearchParams(p);
      setSearchTerm('');
    }
  };

  const getPaginationItems = () => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    const items = [];
    items.push(1);
    if (page > 3) {
      items.push('ellipsis-1');
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);
    for (let p = start; p <= end; p++) {
      items.push(p);
    }
    if (page < pages - 2) {
      items.push('ellipsis-2');
    }
    items.push(pages);
    return items;
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container products-layout">
        
        {/* Mobile Filter Drawer Backdrop */}
        {showMobileFilters && (
          <div 
            className="mobile-filter-backdrop" 
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Filters Sidebar */}
        <aside className={`catalog-filter-sidebar ${showMobileFilters ? 'open' : ''}`}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} /> Filters {activeFilterCount > 0 && <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-blue)', color: '#ffffff', borderRadius: '10px', padding: '1px 7px' }}>{activeFilterCount}</span>}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={handleResetFilters}
                  style={{ fontSize: '0.8rem', color: 'var(--secondary-green)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <RefreshCcw size={12} /> Reset
                </button>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="mobile-close-filter-btn"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-medium)' }}
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Categories filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '10px', color: 'var(--text-dark)', fontWeight: '700' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((cat, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer', color: selectedCategories.includes(cat) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedCategories.includes(cat) ? '600' : '400' }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCheckboxChange('category', selectedCategories, setSelectedCategories, cat)}
                      style={{ accentColor: 'var(--primary-blue)', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Companies filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--text-dark)', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={15} color="var(--primary-blue)" /> Pharma Companies
                </h4>
                <Link to="/companies" style={{ fontSize: '0.74rem', color: 'var(--primary-blue)', fontWeight: '700', textDecoration: 'none' }}>
                  All 252 →
                </Link>
              </div>

              {/* Quick Search inside company filter */}
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search 252 companies..."
                  value={companySearchTerm}
                  onChange={(e) => setCompanySearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 30px',
                    fontSize: '0.82rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                {filteredCompaniesList.map((comp, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer', color: selectedCompanies.includes(comp) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedCompanies.includes(comp) ? '700' : '400' }}>
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(comp)}
                      onChange={() => handleCheckboxChange('company', selectedCompanies, setSelectedCompanies, comp)}
                      style={{ accentColor: 'var(--primary-blue)', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider Filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '10px', color: 'var(--text-dark)', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                <span>Wholesale Price</span>
                <span style={{ color: 'var(--primary-blue)', fontWeight: '700' }} className="tabular-nums">≤ ₹{maxPrice}</span>
              </h4>
              <input 
                type="range" 
                min="5" 
                max="2000" 
                step="10"
                value={maxPrice}
                onChange={handlePriceChange}
                style={{ width: '100%', accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
                aria-label="Price range filter"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                <span>₹5</span>
                <span>₹2,000</span>
              </div>
            </div>

            {/* Brands filter */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '10px', color: 'var(--text-dark)', fontWeight: '700' }}>Brands</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                {brands.map((br, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer', color: selectedBrands.includes(br) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedBrands.includes(br) ? '600' : '400' }}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(br)}
                      onChange={() => handleCheckboxChange('brand', selectedBrands, setSelectedBrands, br)}
                      style={{ accentColor: 'var(--primary-blue)', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <span>{br}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Formulation Forms Filter */}
            <div>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '10px', color: 'var(--text-dark)', fontWeight: '700' }}>Formulation Form</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto', paddingRight: '5px' }}>
                {forms.map((fr, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer', color: selectedForms.includes(fr) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedForms.includes(fr) ? '600' : '400' }}>
                    <input
                      type="checkbox"
                      checked={selectedForms.includes(fr)}
                      onChange={() => handleCheckboxChange('form', selectedForms, setSelectedForms, fr)}
                      style={{ accentColor: 'var(--primary-blue)', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <span>{fr}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Products Feed */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          
          {/* Controls Bar */}
          <div className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="btn btn-outline btn-sm mobile-filter-toggle"
                style={{ display: 'none', alignItems: 'center', gap: '6px' }}
              >
                <Filter size={14} />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-medium)' }}>
                {loading ? (
                  <span>Loading catalog...</span>
                ) : (
                  <span>Showing <strong className="tabular-nums">{products.length}</strong> of <strong className="tabular-nums">{total}</strong> products</span>
                )}
                {searchParams.get('search') && (
                  <span> matching &ldquo;<strong>{searchParams.get('search')}</strong>&rdquo;</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpDown size={14} /> Sort:
              </span>
              <select 
                value={sortOrder} 
                onChange={(e) => updateSortParam(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
              >
                <option value="popular">Default / Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedCompanies.length > 0 || selectedForms.length > 0 || maxPrice < MAX_PRICE_LIMIT || searchParams.get('search')) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', padding: '4px 0' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>Active:</span>
              {searchParams.get('search') && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '500' }}>
                  Search: &ldquo;{searchParams.get('search')}&rdquo;
                  <button onClick={() => removeFilterTag('search')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0369a1', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              )}
              {selectedCompanies.map((comp) => (
                <span key={comp} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0f2fe', color: 'var(--primary-blue)', padding: '3px 8px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '600' }}>
                  <Building2 size={11} /> {comp}
                  <button onClick={() => removeFilterTag('company', comp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              ))}
              {selectedCategories.map((cat) => (
                <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#eff6ff', color: 'var(--primary-blue)', padding: '3px 8px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '500' }}>
                  {cat}
                  <button onClick={() => removeFilterTag('category', cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              ))}
              {selectedBrands.map((brand) => (
                <span key={brand} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', color: 'var(--secondary-green)', padding: '3px 8px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '500' }}>
                  {brand}
                  <button onClick={() => removeFilterTag('brand', brand)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-green)', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              ))}
              {selectedForms.map((form) => (
                <span key={form} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '500' }}>
                  {form}
                  <button onClick={() => removeFilterTag('form', form)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b45309', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              ))}
              {maxPrice < MAX_PRICE_LIMIT && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: '500' }}>
                  ≤ ₹{maxPrice}
                  <button onClick={() => removeFilterTag('price')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                </span>
              )}
              <button 
                onClick={handleResetFilters}
                style={{ fontSize: '0.78rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <SkeletonLoader variant="product-grid" count={8} />
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: '70px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <SlidersHorizontal size={44} color="var(--text-light)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>No Products Found</h3>
              <p style={{ color: 'var(--text-medium)', maxWidth: '420px', fontSize: '0.9rem' }}>
                We couldn&apos;t find any medicines matching your active filters. Try resetting or adjusting your search term.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} addToCart={addToCart} />
                ))}
              </div>

              {/* Windowed Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '35px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="btn btn-outline btn-sm"
                    style={{ borderRadius: '6px', opacity: page === 1 ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>

                  {getPaginationItems().map((pItem, idx) => {
                    if (typeof pItem === 'string' && pItem.startsWith('ellipsis')) {
                      return (
                        <span key={`${pItem}-${idx}`} style={{ padding: '0 6px', color: 'var(--text-light)', fontWeight: '700' }}>
                          ...
                        </span>
                      );
                    }
                    return (
                      <button 
                        key={pItem}
                        onClick={() => handlePageChange(pItem)}
                        className={`btn btn-sm ${page === pItem ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '6px', minWidth: '36px', height: '36px', padding: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {pItem}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className="btn btn-outline btn-sm"
                    style={{ borderRadius: '6px', opacity: page === pages ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;

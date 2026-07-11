import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCcw } from 'lucide-react';

function Products({ addToCart, searchTerm, setSearchTerm }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination and sorting states
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState('popular');
  
  // Filtering states (arrays for checkboxes)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100);

  const categories = [
    'Pharma Products',
    'OTC Products',
    'Injectables',
    'Surgical & Medical Supplies'
  ];

  const brands = [
    'Cipla', 'Abbott', 'Sun Pharma', 'Intas', 'Alkem', 'Zydus', 
    'Leeford Healthcare', 'Troikaa Pharmaceuticals', 'Biochem', 
    'Namcare Pharma', 'Healing Pharma', 'Steris Pharma', 'Dr. Morepen',
    'Lucid Pharma', 'Elder Pharmaceuticals'
  ];

  const forms = [
    'Tablet', 'Capsule', 'Injection', 'Powder', 'IV Fluid', 'Syrup', 'Gloves', 'Syringe'
  ];

  // Sync state with search params on load or change
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const catVal = searchParams.get('category') ? searchParams.get('category').split(',') : [];
    const brandVal = searchParams.get('brand') ? searchParams.get('brand').split(',') : [];
    const formVal = searchParams.get('form') ? searchParams.get('form').split(',') : [];
    const priceVal = parseFloat(searchParams.get('maxPrice')) || 100;
    const pageVal = parseInt(searchParams.get('page')) || 1;
    const sortVal = searchParams.get('sort') || 'popular';

    setSearchTerm(searchVal);
    setSelectedCategories(catVal.filter(Boolean));
    setSelectedBrands(brandVal.filter(Boolean));
    setSelectedForms(formVal.filter(Boolean));
    setMaxPrice(priceVal);
    setPage(pageVal);
    setSortOrder(sortVal);
  }, [searchParams]);

  // Fetch products whenever filters or search terms change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const searchVal = searchParams.get('search') || '';
        
        if (searchVal) queryParams.append('search', searchVal);
        if (selectedCategories.length > 0) queryParams.append('category', selectedCategories.join(','));
        if (selectedBrands.length > 0) queryParams.append('brand', selectedBrands.join(','));
        if (selectedForms.length > 0) queryParams.append('form', selectedForms.join(','));
        if (maxPrice < 100) queryParams.append('maxPrice', maxPrice.toString());
        if (sortOrder) queryParams.append('sort', sortOrder);
        queryParams.append('page', page.toString());
        queryParams.append('limit', '12');

        const response = await fetch(`/api/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, selectedCategories, selectedBrands, selectedForms, maxPrice, sortOrder, page]);

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
    if (val < 100) {
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
    setSelectedForms([]);
    setMaxPrice(100);
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

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container products-layout">
        
        {/* Left Filters Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} /> Filters
              </h3>
              <button 
                onClick={handleResetFilters}
                style={{ fontSize: '0.8rem', color: 'var(--secondary-green)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
              >
                <RefreshCcw size={12} /> Reset
              </button>
            </div>

            {/* Categories filter */}
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-dark)', fontWeight: '700' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((cat, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', color: selectedCategories.includes(cat) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedCategories.includes(cat) ? '600' : '400' }}>
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

            {/* Price Slider Filter */}
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-dark)', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                <span>Wholesale Price</span>
                <span style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>≤ ₹{maxPrice}</span>
              </h4>
              <input 
                type="range" 
                min="2" 
                max="100" 
                value={maxPrice}
                onChange={handlePriceChange}
                style={{ width: '100%', accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
                aria-label="Price range filter"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '5px' }}>
                <span>₹2</span>
                <span>₹100</span>
              </div>
            </div>

            {/* Brands filter */}
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-dark)', fontWeight: '700' }}>Brands</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                {brands.map((br, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', color: selectedBrands.includes(br) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedBrands.includes(br) ? '600' : '400' }}>
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
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-dark)', fontWeight: '700' }}>Formulation Form</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                {forms.map((fr, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', color: selectedForms.includes(fr) ? 'var(--primary-blue)' : 'var(--text-dark)', fontWeight: selectedForms.includes(fr) ? '600' : '400' }}>
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
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Controls Bar */}
          <div className="card" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>
              {loading ? (
                <span>Loading products...</span>
              ) : (
                <span>Showing <strong>{products.length}</strong> of <strong>{total}</strong> products</span>
              )}
              {searchParams.get('search') && (
                <span> matching &ldquo;<strong>{searchParams.get('search')}</strong>&rdquo;</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-medium)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpDown size={14} /> Sort By:
              </span>
              <select 
                value={sortOrder} 
                onChange={(e) => updateSortParam(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.9rem', backgroundColor: '#ffffff' }}
              >
                <option value="popular">Default / Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div style={{ border: '4px solid #cbd5e1', borderTop: '4px solid var(--primary-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: '80px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <SlidersHorizontal size={48} color="var(--text-light)" />
              <h3>No Products Found</h3>
              <p style={{ color: 'var(--text-medium)', maxWidth: '400px' }}>
                We couldn&apos;t find any medicines matching your filters. Try resetting the filters or modifying your search.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} addToCart={addToCart} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="btn btn-outline btn-sm"
                    style={{ borderRadius: '6px', opacity: page === 1 ? 0.5 : 1 }}
                  >
                    Prev
                  </button>
                  {[...Array(pages).keys()].map((pNum) => (
                    <button 
                      key={pNum}
                      onClick={() => handlePageChange(pNum + 1)}
                      className={`btn btn-sm ${page === pNum + 1 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ borderRadius: '6px', minWidth: '35px', padding: '8px' }}
                    >
                      {pNum + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className="btn btn-outline btn-sm"
                    style={{ borderRadius: '6px', opacity: page === pages ? 0.5 : 1 }}
                  >
                    Next
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

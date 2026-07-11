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
  
  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

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

  // Sync state with search params on load or change
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const catVal = searchParams.get('category') || '';
    const brandVal = searchParams.get('brand') || '';
    const pageVal = parseInt(searchParams.get('page')) || 1;
    const sortVal = searchParams.get('sort') || 'popular';

    setSearchTerm(searchVal);
    setSelectedCategory(catVal);
    setSelectedBrand(brandVal);
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
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (selectedBrand) queryParams.append('brand', selectedBrand);
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
  }, [searchParams, selectedCategory, selectedBrand, sortOrder, page]);

  // Update query params helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
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
    setSelectedCategory('');
    setSelectedBrand('');
    setSortOrder('popular');
    setPage(1);
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
        
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
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-dark)', fontWeight: '700' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => updateQueryParam('category', '')}
                    style={{ accentColor: 'var(--primary-blue)' }}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((cat, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => updateQueryParam('category', cat)}
                      style={{ accentColor: 'var(--primary-blue)' }}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands filter */}
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-dark)', fontWeight: '700' }}>Top Brands</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === ''}
                    onChange={() => updateQueryParam('brand', '')}
                    style={{ accentColor: 'var(--primary-blue)' }}
                  />
                  <span>All Brands</span>
                </label>
                {brands.map((br, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === br}
                      onChange={() => updateQueryParam('brand', br)}
                      style={{ accentColor: 'var(--primary-blue)' }}
                    />
                    <span>{br}</span>
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
                onChange={(e) => updateQueryParam('sort', e.target.value)}
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

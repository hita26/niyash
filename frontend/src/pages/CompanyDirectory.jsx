import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Search, ExternalLink, ShieldCheck, MapPin, 
  Layers, Package, ChevronLeft, ChevronRight, X, ArrowUpDown,
  Filter, Sparkles, CheckCircle2
} from 'lucide-react';

function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('priority');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Diagnostics & Formulations',
    'Formulations & Cosmeceuticals',
    'Respiratory & Multi-Specialty',
    'Cardiovascular & Biologicals',
    'Biosimilars & Critical Care',
    'NDDS & Pain Management',
    'Critical Care & Injectables',
    'Ophthalmology & Dermatology',
    'Anti-infectives & Gynecology',
    'Gastroenterology & Generics',
    'Cardiovascular & CNS',
    'Surgical & Medical Supplies',
    'Pharmaceutical Formulations'
  ];

  const getCleanLogoUrl = (company) => {
    if (company.logoUrl && !company.logoUrl.includes('ui-avatars.com')) {
      return company.logoUrl;
    }
    const clean = (company.name || '').replace(/\([^)]*\)/g, '').trim();
    const words = clean.split(/\s+/).filter(Boolean);
    const initials = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : clean.slice(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || 'NP')}&background=0284c7&color=ffffff&size=120&bold=true`;
  };

  // Fetch companies from backend
  useEffect(() => {
    let isCancelled = false;
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit,
          sort: sortOrder === 'priority' ? 'newest' : sortOrder,
        });
        if (searchTerm.trim()) queryParams.set('search', searchTerm.trim());
        if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);

        const res = await fetch(`/api/companies?${queryParams.toString()}`);
        const data = await res.json();

        if (!isCancelled && data.success) {
          let comps = data.companies || [];
          if (sortOrder === 'productsDesc') {
            comps.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
          } else if (sortOrder === 'nameAsc') {
            comps.sort((a, b) => a.name.localeCompare(b.name));
          } else if (sortOrder === 'nameDesc') {
            comps.sort((a, b) => b.name.localeCompare(a.name));
          }
          setCompanies(comps);
          setTotal(data.total || comps.length);
          setTotalPages(data.pages || 1);
        }
      } catch (err) {
        console.error('Error fetching company directory:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchCompanies();
    return () => { isCancelled = true; };
  }, [page, limit, sortOrder, selectedCategory, searchTerm]);

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh', padding: '40px 0 60px' }}>
      <div className="container">
        
        {/* Header Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(26, 86, 160, 0.08)', color: 'var(--primary-blue)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '12px' }}>
            <Building2 size={16} /> Authorized Manufacturers & Partners Directory
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--text-dark)', margin: '0 0 10px', fontWeight: '800' }}>
            Browse Pharmaceutical Companies & Brands
          </h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Discover authorized formulation manufacturers, critical care laboratories, and certified medical surgical suppliers distributed wholesale across Gujarat by Niyansh Pharma.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card" style={{ padding: '18px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px', width: '100%', maxWidth: '520px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Search 252 companies, location, or specialty..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '10px 16px 10px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
              {searchTerm && (
                <button 
                  onClick={() => { setSearchTerm(''); setPage(1); }}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort & Limit Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={15} color="var(--text-medium)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: '600' }}>Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                  style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', backgroundColor: '#fff', color: 'var(--text-dark)' }}
                >
                  <option value="priority">Featured & Priority</option>
                  <option value="productsDesc">Most Products First</option>
                  <option value="nameAsc">Name (A → Z)</option>
                  <option value="nameDesc">Name (Z → A)</option>
                </select>
              </div>

              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', backgroundColor: '#fff', color: 'var(--text-dark)' }}
              >
                <option value={24}>24 / page</option>
                <option value={48}>48 / page</option>
                <option value={96}>96 / page</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills - App-like Touch Scroll with No Ugly Scrollbar */}
          <div 
            className="no-scrollbar touch-scroll-row"
            style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto', 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingBottom: '4px', 
              marginTop: '14px', 
              borderTop: '1px solid #f1f5f9', 
              paddingTop: '12px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: active ? '700' : '500',
                    whiteSpace: 'nowrap',
                    border: active ? '1px solid var(--primary-blue)' : '1px solid #e2e8f0',
                    backgroundColor: active ? 'var(--primary-blue)' : '#fff',
                    color: active ? '#fff' : 'var(--text-medium)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {cat === 'All' ? 'All Companies' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== 'All' || sortOrder !== 'priority') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
            <div>
              Showing <strong>{total}</strong> companies matching filters
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSortOrder('priority');
                setPage(1);
              }}
              style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
            >
              <X size={14} /> Clear all filters
            </button>
          </div>
        )}

        {/* Company Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-light)' }}>
            <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-medium)' }}>Loading verified company catalog...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Building2 size={40} color="var(--text-light)" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-dark)' }}>No companies found</h3>
            <p style={{ color: 'var(--text-medium)', margin: 0, fontSize: '0.9rem' }}>
              No companies match your search criteria. Try clearing the filter or search keyword.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
            {companies.map((company) => {
              const targetUrl = `/companies/${company.slug || company._id}`;

              return (
                <div 
                  key={company._id} 
                  className="card"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  {/* Card Header Media */}
                  <div style={{ padding: '18px 18px 12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '12px',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                    }}>
                      <img 
                        src={getCleanLogoUrl(company)}
                        alt={`${company.name} logo`}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = getCleanLogoUrl(company);
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                        <Link 
                          to={targetUrl}
                          style={{ textDecoration: 'none', color: 'var(--text-dark)', flex: 1 }}
                        >
                          <h3 
                            style={{ 
                              fontSize: '1.02rem', 
                              margin: 0, 
                              fontWeight: '700', 
                              lineHeight: 1.35, 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              wordBreak: 'break-word',
                              minHeight: '2.6rem'
                            }} 
                            title={company.name}
                          >
                            {company.name}
                          </h3>
                        </Link>
                        {company.isVerified !== false && (
                          <span title="Verified Wholesale Partner" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <ShieldCheck size={16} color="#0284c7" fill="#e0f2fe" />
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                        <MapPin size={13} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {company.location || 'India'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--primary-blue)', backgroundColor: 'rgba(26, 86, 160, 0.08)', padding: '3px 8px', borderRadius: '4px', maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {company.category || 'Pharmaceuticals'}
                      </span>

                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <Package size={12} /> {company.productCount || 0} Products
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-medium)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {company.description || `Supplying certified pharmaceuticals and healthcare formulations across Gujarat.`}
                    </p>

                    {company.specialties && company.specialties.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: 'auto', paddingTop: '4px' }}>
                        {company.specialties.slice(0, 3).map((spec, i) => (
                          <span key={i} style={{ fontSize: '0.68rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div style={{ padding: '12px 18px', backgroundColor: '#fff', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <Link
                      to={targetUrl}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem', padding: '7px 14px', textDecoration: 'none', flex: '1 1 auto', textAlign: 'center', justifyContent: 'center' }}
                    >
                      View Catalog ({company.productCount || 0})
                    </Link>

                    {company.websiteUrl ? (
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: '600', padding: '6px' }}
                        title="Visit official website"
                      >
                        Site <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>Verified Partner</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="card" style={{ padding: '16px 24px', marginTop: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total companies)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="btn btn-outline btn-sm"
                style={{ padding: '6px 12px', opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer', gap: '4px' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', padding: '0 8px' }}>
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="btn btn-outline btn-sm"
                style={{ padding: '6px 12px', opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer', gap: '4px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CompanyDirectory;

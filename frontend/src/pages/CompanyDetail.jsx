import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, ExternalLink, ShieldCheck, 
  Search, Package, ArrowLeft, Filter, CheckCircle2,
  AlertTriangle, Star, Image as ImageIcon, ChevronRight,
  Plus, Check, ShoppingBag, List, Grid
} from 'lucide-react';

function CompanyDetail({ addToCart }) {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local filtering & search
  const [productSearch, setProductSearch] = useState('');
  const [formFilter, setFormFilter] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [addedItemIds, setAddedItemIds] = useState(new Set());

  useEffect(() => {
    let isCancelled = false;
    const fetchCompanyData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/companies/${id}`);
        const data = await res.json();
        if (!isCancelled) {
          if (res.ok && data.success) {
            setCompany(data.company);
            setProducts(data.products || []);
          } else {
            setError(data.message || 'Company not found');
          }
        }
      } catch (err) {
        if (!isCancelled) setError('Failed to load company details: ' + err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchCompanyData();
    return () => { isCancelled = true; };
  }, [id]);

  const handleAdd = (prod) => {
    if (addToCart) {
      addToCart(prod);
      setAddedItemIds(prev => new Set(prev).add(prod._id));
      setTimeout(() => {
        setAddedItemIds(prev => {
          const next = new Set(prev);
          next.delete(prod._id);
          return next;
        });
      }, 1500);
    }
  };

  const availableForms = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.form) set.add(p.form); });
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const searchLower = productSearch.toLowerCase().trim();
      const matchesSearch = !searchLower ||
        (p.name && p.name.toLowerCase().includes(searchLower)) ||
        (p.composition && p.composition.toLowerCase().includes(searchLower)) ||
        (p.packing && p.packing.toLowerCase().includes(searchLower)) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower));

      const matchesForm = formFilter === 'All' || p.form === formFilter;
      const matchesStock = !inStockOnly || p.inStock;

      return matchesSearch && matchesForm && matchesStock;
    });
  }, [products, productSearch, formFilter, inStockOnly]);

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCleanLogoUrl = (comp) => {
    if (!comp) return '';
    if (comp.logoUrl && comp.logoUrl.trim() !== '') return comp.logoUrl;
    const cleanName = (comp.name || '').replace(/\s*\([^)]*\)/g, '').trim() || comp.name || 'Pharma';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=ffffff&size=160&bold=true`;
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
        <p style={{ color: 'var(--text-medium)' }}>Loading company profile and catalog...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
          <Building2 size={48} color="#ef4444" style={{ margin: '0 auto 15px' }} />
          <h2 style={{ margin: '0 0 10px', color: 'var(--text-dark)' }}>Company Not Found</h2>
          <p style={{ color: 'var(--text-medium)', marginBottom: '20px' }}>
            {error || "The company you are looking for does not exist or has been removed."}
          </p>
          <Link to="/companies" className="btn btn-primary btn-sm">
            ← Return to Companies Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '30px 0 60px' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'var(--text-medium)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/companies" style={{ color: 'var(--text-medium)', textDecoration: 'none' }}>Companies</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>{company.name}</span>
        </div>

        {/* Company Profile Hero Banner */}
        <div className="card" style={{ padding: '30px', marginBottom: '30px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', alignItems: 'flex-start' }}>
            
            {/* Company Logo Box */}
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '16px',
              backgroundColor: '#fff',
              border: '2px solid #e2e8f0',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
            }}>
              <img 
                src={getCleanLogoUrl(company)}
                alt={company.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  const cleanName = (company.name || '').replace(/\s*\([^)]*\)/g, '').trim() || company.name || 'Pharma';
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=ffffff&size=160&bold=true`;
                }}
              />
            </div>

            {/* Profile Info */}
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', color: 'var(--text-dark)', margin: 0, fontWeight: '800' }}>
                  {company.name}
                </h1>
                {company.isVerified !== false && (
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.8rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> Verified Partner
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={15} color="var(--primary-blue)" /> {company.location || 'India'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: '#059669' }}>
                  <Package size={15} /> {products.length} Products Listed
                </span>
                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#475569' }}>
                  {company.category || 'Pharmaceutical Formulations'}
                </span>
              </div>

              <p style={{ margin: '12px 0 16px', fontSize: '0.95rem', color: 'var(--text-medium)', lineHeight: 1.6 }}>
                {company.description || `Official pharmaceutical manufacturing partner supplying WHO-GMP certified therapeutic formulations to Niyansh Pharma.`}
              </p>

              {/* Specialties */}
              {company.specialties && company.specialties.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {company.specialties.map((spec, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', backgroundColor: 'rgba(26, 86, 160, 0.08)', padding: '3px 10px', borderRadius: '15px', fontWeight: '600' }}>
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Action Box */}
            <div className="company-hero-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px', textDecoration: 'none' }}
                >
                  <Globe size={15} /> Visit Official Website <ExternalLink size={13} />
                </a>
              )}
              <Link to="/companies" className="btn btn-secondary btn-sm" style={{ gap: '6px', textDecoration: 'none', textAlign: 'center' }}>
                <ArrowLeft size={15} /> All Companies
              </Link>
            </div>

          </div>
        </div>

        {/* Company Catalog Toolbar */}
        <div className="card" style={{ padding: '20px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            
            {/* Search within company */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '450px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder={`Search ${company.name} products by name, composition...`}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: '600' }}>Form:</span>
                <select
                  value={formFilter}
                  onChange={(e) => setFormFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                >
                  {availableForms.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-medium)', fontWeight: '600' }}>
                <input 
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--primary-blue)', width: '15px', height: '15px' }}
                />
                In Stock Only
              </label>

              {/* View Switcher */}
              <div style={{ display: 'inline-flex', borderRadius: '6px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '6px 10px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? 'var(--primary-blue)' : '#fff',
                    color: viewMode === 'grid' ? '#fff' : 'var(--text-medium)',
                    cursor: 'pointer'
                  }}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '6px 10px',
                    border: 'none',
                    backgroundColor: viewMode === 'table' ? 'var(--primary-blue)' : '#fff',
                    color: viewMode === 'table' ? '#fff' : 'var(--text-medium)',
                    cursor: 'pointer'
                  }}
                  title="Table View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Products Section */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: '700' }}>
            Products by {company.name} ({filteredProducts.length})
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="card" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <Package size={36} color="var(--text-light)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', color: 'var(--text-dark)' }}>No products found</h4>
            <p style={{ color: 'var(--text-medium)', margin: 0, fontSize: '0.9rem' }}>
              No items match your filter criteria under {company.name}. Try adjusting search or form filters.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* ==========================================
             GRID VIEW
             ========================================== */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '20px' }}>
            {filteredProducts.map((p) => {
              const photoUrl = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || '');
              const isAdded = addedItemIds.has(p._id);

              return (
                <div key={p._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Photo Box */}
                  <Link to={`/products/${p._id}`} style={{ position: 'relative', width: '100%', height: '170px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textDecoration: 'none' }}>
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt={p.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <ImageIcon size={36} color="#cbd5e1" />
                    )}

                    {p.images && p.images.length > 1 && (
                      <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '12px', fontWeight: '700' }}>
                        📸 {p.images.length}
                      </span>
                    )}

                    <span style={{
                      position: 'absolute', bottom: '8px', left: '8px',
                      backgroundColor: p.inStock ? '#10b981' : '#ef4444',
                      color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '700'
                    }}>
                      {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                    </span>
                  </Link>

                  {/* Body */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-medium)', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {p.form || 'Tablet'}
                      </span>
                      {p.packing && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          {p.packing}
                        </span>
                      )}
                    </div>

                    <Link to={`/products/${p._id}`} style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.3 }}>
                        {p.name}
                      </h4>
                    </Link>

                    {p.composition && (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-medium)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.composition}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {p.mrp && p.mrp > p.price && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', textDecoration: 'line-through' }} className="tabular-nums">
                              MRP: {formatCurrency(p.mrp)}
                            </span>
                            <span style={{ fontSize: '0.68rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                              {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% MARGIN
                            </span>
                          </div>
                        )}
                        <span style={{ fontSize: '0.68rem', color: 'var(--primary-blue)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                          PTR (Wholesale):
                        </span>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-blue)' }} className="tabular-nums">
                          {formatCurrency(p.price)}
                          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-medium)' }}> /unit</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
                      >
                        {isAdded ? <Check size={14} /> : <Plus size={14} />}
                        {isAdded ? 'Added' : 'Quote'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* ==========================================
             TABLE VIEW
             ========================================== */
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="responsive-table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left', minWidth: '680px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                    <th style={{ padding: '12px 16px', width: '60px' }}>Photo</th>
                    <th style={{ padding: '12px 16px' }}>Product Name</th>
                    <th style={{ padding: '12px 16px' }}>Form & Packing</th>
                    <th style={{ padding: '12px 16px' }}>Wholesale (PTR)</th>
                    <th style={{ padding: '12px 16px' }}>MRP</th>
                    <th style={{ padding: '12px 16px' }}>Availability</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const photoUrl = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || '');
                    const isAdded = addedItemIds.has(p._id);

                    return (
                      <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {photoUrl ? (
                              <img src={photoUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                              <ImageIcon size={18} color="#94a3b8" />
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <Link to={`/products/${p._id}`} style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '700' }}>
                            {p.name}
                          </Link>
                          {p.composition && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '2px' }}>
                              {p.composition}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <span style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                            {p.form || 'Tablet'}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginLeft: '6px' }}>
                            {p.packing || '—'}
                          </span>
                        </td>

                        <td style={{ padding: '10px 16px', verticalAlign: 'middle', fontWeight: '700', color: 'var(--primary-blue)' }}>
                          {formatCurrency(p.price)}
                        </td>

                        <td style={{ padding: '10px 16px', verticalAlign: 'middle', color: 'var(--text-medium)', fontSize: '0.85rem' }}>
                          {formatCurrency(p.mrp)}
                        </td>

                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                            backgroundColor: p.inStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: p.inStock ? '#059669' : '#dc2626'
                          }}>
                            {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                          </span>
                        </td>

                        <td style={{ padding: '10px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleAdd(p)}
                            className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                          >
                            {isAdded ? <Check size={13} /> : <Plus size={13} />}
                            {isAdded ? 'Added' : 'Add to Quote'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CompanyDetail;

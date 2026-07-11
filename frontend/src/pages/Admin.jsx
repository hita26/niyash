import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, ShoppingBag, MessageSquare, Briefcase, LogOut, 
  Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronDown, Download, AlertCircle 
} from 'lucide-react';

function Admin() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Database Data States
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState('All');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields State for Add/Edit Product
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('Pharma Products');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodPacking, setProdPacking] = useState('');
  const [prodComposition, setProdComposition] = useState('');
  const [prodForm, setProdForm] = useState('Tablet');
  const [prodManufacturer, setProdManufacturer] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // Check login on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('niyansh_admin_session');
    if (adminSession === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch Products
      const prodRes = await fetch('/api/products?limit=1000');
      const prodData = await prodRes.json();
      setProducts(prodData.products || []);

      // Fetch Enquiries
      const enqRes = await fetch('/api/enquiries');
      const enqData = await enqRes.json();
      setEnquiries(enqData || []);

      // Fetch Careers
      const carRes = await fetch('/api/careers');
      const carData = await carRes.json();
      setCareers(carData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@niyanshpharma.com' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('niyansh_admin_session', 'active');
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Use default admin credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('niyansh_admin_session');
  };

  // Product CRUD Handlers
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdBrand(product.brand);
      setProdCategory(product.category);
      setProdSku(product.sku || '');
      setProdPrice(product.price);
      setProdInStock(product.inStock);
      setProdPacking(product.packing || '');
      setProdComposition(product.composition || '');
      setProdForm(product.form || 'Tablet');
      setProdManufacturer(product.manufacturer || '');
      setProdImageUrl(product.imageUrl || '');
      setProdDescription(product.description || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdBrand('');
      setProdCategory('Pharma Products');
      setProdSku('');
      setProdPrice('');
      setProdInStock(true);
      setProdPacking('');
      setProdComposition('');
      setProdForm('Tablet');
      setProdManufacturer('');
      setProdImageUrl('');
      setProdDescription('');
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      brand: prodBrand,
      category: prodCategory,
      sku: prodSku,
      price: parseFloat(prodPrice) || 0,
      inStock: prodInStock,
      packing: prodPacking,
      composition: prodComposition,
      form: prodForm,
      manufacturer: prodManufacturer,
      imageUrl: prodImageUrl,
      description: prodDescription
    };

    try {
      let response;
      if (editingProduct) {
        // Edit Mode
        response = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create Mode
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setIsProductModalOpen(false);
        fetchDashboardData();
        alert(editingProduct ? 'Product updated!' : 'Product added!');
      } else {
        alert('Failed to save product.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchDashboardData();
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock })
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating stock status:', error);
    }
  };

  // Enquiry Update Handlers
  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return;

    try {
      const response = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  // Career Applicant Handlers
  const handleDeleteCareer = async (id) => {
    if (!window.confirm('Delete this job application record?')) return;

    try {
      const response = await fetch(`/api/careers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  // Filtering products list
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.composition && p.composition.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Filtering enquiries list
  const filteredEnquiries = enquiries.filter(e => 
    enquiryFilter === 'All' ? true : e.type === enquiryFilter
  );

  // --- RENDERS ---

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-main)' }} className="animate-fade-in">
        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ backgroundColor: 'rgba(12, 61, 108, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary-blue)', display: 'inline-flex', marginBottom: '15px' }}>
              <Lock size={30} />
            </span>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Admin Portal</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Niyansh Pharma Wholesale Panel</p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="admin-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Admin Email</label>
              <input 
                id="admin-email"
                type="email" 
                required
                placeholder="admin@niyanshpharma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="admin-pwd" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Password</label>
              <input 
                id="admin-pwd"
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', height: '48px', marginTop: '10px' }}
            >
              Sign In
            </button>
          </form>

          <div style={{ marginTop: '25px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-medium)', textAlign: 'center' }}>
            🔑 <strong>Demo Credentials:</strong><br />
            Email: <span style={{ fontFamily: 'monospace' }}>admin@niyanshpharma.com</span><br />
            Password: <span style={{ fontFamily: 'monospace' }}>admin123</span>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD SCREEN
  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container admin-layout">
        
        {/* Sidebar Nav */}
        <aside className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>Admin Console</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-green)', fontWeight: '700' }}>● Connected Live</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('overview')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
                backgroundColor: activeTab === 'overview' ? 'rgba(12, 61, 108, 0.08)' : 'transparent',
                color: activeTab === 'overview' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <LayoutDashboard size={16} /> Overview
            </button>

            <button 
              onClick={() => setActiveTab('products')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
                backgroundColor: activeTab === 'products' ? 'rgba(12, 61, 108, 0.08)' : 'transparent',
                color: activeTab === 'products' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <ShoppingBag size={16} /> Products
            </button>

            <button 
              onClick={() => setActiveTab('enquiries')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
                backgroundColor: activeTab === 'enquiries' ? 'rgba(12, 61, 108, 0.08)' : 'transparent',
                color: activeTab === 'enquiries' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <MessageSquare size={16} /> Enquiries
            </button>

            <button 
              onClick={() => setActiveTab('careers')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
                backgroundColor: activeTab === 'careers' ? 'rgba(12, 61, 108, 0.08)' : 'transparent',
                color: activeTab === 'careers' ? 'var(--primary-blue)' : 'var(--text-medium)'
              }}
            >
              <Briefcase size={16} /> Careers
            </button>
          </nav>

          <button 
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444', gap: '8px', marginTop: '20px' }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </aside>

        {/* Main Content Area */}
        <main>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div style={{ border: '4px solid #cbd5e1', borderTop: '4px solid var(--primary-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                  <h2 style={{ fontSize: '1.6rem' }}>Overview Dashboard</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid-3" style={{ gap: '20px' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '25px', borderLeft: '5px solid var(--primary-blue)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Products</span>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-blue)' }}>{products.length}</span>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '25px', borderLeft: '5px solid var(--secondary-green)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Total Enquiries</span>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary-green)' }}>{enquiries.length}</span>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '25px', borderLeft: '5px solid var(--accent-blue)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Job Applications</span>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{careers.length}</span>
                    </div>
                  </div>

                  {/* Enquiry breakdown */}
                  <div className="card" style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                      Recent Activity Breakdown
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', textAlign: 'center' }}>
                      {[
                        { title: 'Quote Carts', count: enquiries.filter(e => e.type === 'Cart Quote').length, bg: '#f1f5f9' },
                        { title: 'B2B Partners', count: enquiries.filter(e => e.type === 'Partner').length, bg: '#f1f5f9' },
                        { title: 'B2B Suppliers', count: enquiries.filter(e => e.type === 'Supplier').length, bg: '#f1f5f9' },
                        { title: 'Contract Mfg', count: enquiries.filter(e => e.type === 'Manufacturing').length, bg: '#f1f5f9' },
                        { title: 'General Info', count: enquiries.filter(e => e.type === 'General Enquiry').length, bg: '#f1f5f9' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ padding: '15px', backgroundColor: item.bg, borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', display: 'block', marginBottom: '5px' }}>{item.title}</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-blue)' }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER */}
              {activeTab === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.6rem' }}>Product Catalog Manager</h2>
                    <button 
                      onClick={() => handleOpenProductModal(null)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ gap: '6px' }}
                    >
                      <Plus size={14} /> Add New Product
                    </button>
                  </div>

                  <div className="card" style={{ padding: '20px' }}>
                    {/* Search block */}
                    <div style={{ marginBottom: '20px' }}>
                      <input 
                        type="text" 
                        placeholder="Search products by name, brand, composition..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        style={{ width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                            <th style={{ padding: '12px 15px' }}>Name</th>
                            <th style={{ padding: '12px 15px' }}>Brand</th>
                            <th style={{ padding: '12px 15px' }}>Category</th>
                            <th style={{ padding: '12px 15px' }}>Price</th>
                            <th style={{ padding: '12px 15px' }}>Stock</th>
                            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p) => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '12px 15px', fontWeight: '600' }}>{p.name}</td>
                              <td style={{ padding: '12px 15px' }}>{p.brand}</td>
                              <td style={{ padding: '12px 15px', fontSize: '0.8rem', color: 'var(--text-medium)' }}>{p.category}</td>
                              <td style={{ padding: '12px 15px', fontWeight: '600' }}>₹{p.price.toFixed(2)}</td>
                              <td style={{ padding: '12px 15px' }}>
                                <button 
                                  onClick={() => handleToggleStock(p)}
                                  style={{
                                    border: 'none', padding: '3px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                    backgroundColor: p.inStock ? 'rgba(56, 142, 60, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: p.inStock ? 'var(--secondary-green)' : '#ef4444', cursor: 'pointer'
                                  }}
                                >
                                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                                </button>
                              </td>
                              <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '10px' }}>
                                  <button 
                                    onClick={() => handleOpenProductModal(p)}
                                    style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}
                                    title="Edit Product"
                                    aria-label="Edit product"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p._id)}
                                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}
                                    title="Delete Product"
                                    aria-label="Delete product"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ENQUIRIES MANAGER */}
              {activeTab === 'enquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.6rem' }}>Enquiries & B2B Registrations</h2>
                    
                    {/* Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>Filter Type:</span>
                      <select 
                        value={enquiryFilter} 
                        onChange={(e) => setEnquiryFilter(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.9rem', backgroundColor: '#fff' }}
                      >
                        <option value="All">All Submissions</option>
                        <option value="Cart Quote">Quote Carts</option>
                        <option value="Partner">B2B Partners</option>
                        <option value="Supplier">B2B Suppliers</option>
                        <option value="Manufacturing">Contract Mfg</option>
                        <option value="General Enquiry">General Contact</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredEnquiries.length === 0 ? (
                      <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No enquiries found for the selected filter.
                      </div>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <div key={enq._id} className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {/* Row 1: Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <div>
                              <span style={{
                                backgroundColor: 'var(--primary-blue)', color: '#fff', fontSize: '0.75rem', fontWeight: '700',
                                padding: '4px 10px', borderRadius: '20px', marginRight: '10px'
                              }}>
                                {enq.type}
                              </span>
                              <strong style={{ fontSize: '1.1rem' }}>{enq.name}</strong>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginLeft: '10px' }}>
                                {new Date(enq.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <select 
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                                style={{
                                  padding: '5px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600',
                                  backgroundColor: enq.status === 'Completed' ? 'rgba(56, 142, 60, 0.1)' : enq.status === 'Contacted' ? 'rgba(27, 117, 188, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                  color: enq.status === 'Completed' ? 'var(--secondary-green)' : enq.status === 'Contacted' ? 'var(--accent-blue)' : '#ef4444'
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <button 
                                onClick={() => handleDeleteEnquiry(enq._id)} 
                                style={{ color: '#ef4444' }}
                                aria-label="Delete enquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Details */}
                          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                              <div>📞 Phone: <a href={`tel:${enq.phone}`} style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>{enq.phone}</a></div>
                              {enq.email && <div>✉️ Email: <a href={`mailto:${enq.email}`} style={{ color: 'var(--text-dark)' }}>{enq.email}</a></div>}
                              {enq.address && <div>📍 Address: <span style={{ color: 'var(--text-medium)' }}>{enq.address}</span></div>}
                            </div>
                            <div style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: '20px' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Message details / Requirements:</strong>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{enq.message}</p>
                            </div>
                          </div>

                          {/* Row 3: Items list if quote cart */}
                          {enq.type === 'Cart Quote' && enq.items && enq.items.length > 0 && (
                            <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '10px' }}>Requested Wholesale Quote Items:</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {enq.items.map((item, idx) => (
                                  <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}>
                                    {item.product ? (
                                      <span>
                                        <strong>{item.product.name}</strong> ({item.product.brand}) • <span style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>Qty: {item.quantity}</span>
                                      </span>
                                    ) : (
                                      <span style={{ color: 'var(--text-light)' }}>Product details deleted</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CAREERS MANAGER */}
              {activeTab === 'careers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.6rem' }}>Job Applicants</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {careers.length === 0 ? (
                      <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No job applications received yet.
                      </div>
                    ) : (
                      careers.map((app) => (
                        <div key={app._id} className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '1.15rem' }}>{app.name}</strong>
                              <span style={{ fontSize: '0.75rem', padding: '3px 8px', backgroundColor: 'rgba(27, 117, 188, 0.1)', color: 'var(--accent-blue)', borderRadius: '20px', fontWeight: '700', marginLeft: '10px' }}>
                                {app.position}
                              </span>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginLeft: '10px' }}>
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeleteCareer(app._id)} 
                              style={{ color: '#ef4444' }}
                              aria-label="Delete career"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                              <div>📞 Phone: <a href={`tel:${app.phone}`} style={{ fontWeight: '600' }}>{app.phone}</a></div>
                              <div>✉️ Email: <a href={`mailto:${app.email}`} style={{ color: 'var(--primary-blue)' }}>{app.email}</a></div>
                              <div>💼 Experience: <strong>{app.experience}</strong></div>
                              {app.resumePath && (
                                <a 
                                  href={app.resumePath} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn btn-outline btn-sm" 
                                  style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.75rem', gap: '5px' }}
                                >
                                  <Download size={12} /> View / Download Resume
                                </a>
                              )}
                            </div>
                            <div style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: '20px' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>Cover Letter / Why hire:</strong>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                                {app.coverLetter || 'No cover letter provided.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} style={{ color: 'var(--text-medium)' }} aria-label="Close">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-name" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Product Name *</label>
                  <input 
                    id="modal-name"
                    type="text" required placeholder="E.g., Paracetamol Tablet IP 500mg" 
                    value={prodName} onChange={(e) => setProdName(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-brand" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Brand Name *</label>
                  <input 
                    id="modal-brand"
                    type="text" required placeholder="E.g., Cipla" 
                    value={prodBrand} onChange={(e) => setProdBrand(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-cat" style={{ fontSize: '0.8/em', fontWeight: '600', color: 'var(--text-medium)' }}>Category *</label>
                  <select 
                    id="modal-cat"
                    value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Pharma Products">Pharma Products</option>
                    <option value="OTC Products">OTC Products</option>
                    <option value="Injectables">Injectables</option>
                    <option value="Surgical & Medical Supplies">Surgical & Medical Supplies</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-sku" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>SKU Code</label>
                  <input 
                    id="modal-sku"
                    type="text" placeholder="E.g., NP-PT-500" 
                    value={prodSku} onChange={(e) => setProdSku(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-price" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Wholesale Estimate (₹) *</label>
                  <input 
                    id="modal-price"
                    type="number" step="0.01" required placeholder="E.g., 15.60" 
                    value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-packing" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Packing Specs</label>
                  <input 
                    id="modal-packing"
                    type="text" placeholder="E.g., 10 x 10 Tablets" 
                    value={prodPacking} onChange={(e) => setProdPacking(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-form" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Formulation Form</label>
                  <select 
                    id="modal-form"
                    value={prodForm} onChange={(e) => setProdForm(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff' }}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Powder">Powder</option>
                    <option value="IV Fluid">IV Fluid</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Gloves">Gloves</option>
                    <option value="Syringe">Syringe</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-composition" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Chemical Composition</label>
                  <input 
                    id="modal-composition"
                    type="text" placeholder="E.g., Paracetamol IP 500mg" 
                    value={prodComposition} onChange={(e) => setProdComposition(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="modal-mfg" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Manufacturer</label>
                  <input 
                    id="modal-mfg"
                    type="text" placeholder="E.g., Cipla Ltd." 
                    value={prodManufacturer} onChange={(e) => setProdManufacturer(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="modal-img" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Image URL (Image source link)</label>
                <input 
                  id="modal-img"
                  type="text" placeholder="https://images.unsplash.com/photo-..." 
                  value={prodImageUrl} onChange={(e) => setProdImageUrl(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="modal-desc" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-medium)' }}>Product Description</label>
                <textarea 
                  id="modal-desc"
                  rows="3" placeholder="Provide product indication, age group or therapeutic usage..." 
                  value={prodDescription} onChange={(e) => setProdDescription(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <input 
                  id="modal-instock"
                  type="checkbox" checked={prodInStock} onChange={(e) => setProdInStock(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }}
                />
                <label htmlFor="modal-instock" style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>Publish as &ldquo;In Stock&rdquo;</label>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '15px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;

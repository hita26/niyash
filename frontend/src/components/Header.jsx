import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Phone, Mail, ChevronDown, Menu, X, User, LogOut, LogIn, ShieldCheck, FileText, Zap,
  Package, Flame, CreditCard, Factory, Handshake, Users, PhoneCall, Shield,
  ArrowRight, MessageCircle, ExternalLink, Lock, Info, Building2, Store, Sparkles, RefreshCw
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function Header({ cartCount, onOpenCart, searchTerm, setSearchTerm, user, onLogout, onOpenAuth, isB2BPortal }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [matchedCompanies, setMatchedCompanies] = useState([]);
  const [isTypeaheadOpen, setIsTypeaheadOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K focuses search
  useEffect(() => {
    const handleGlobalKbd = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (searchTerm && searchTerm.trim().length >= 2) {
          setIsTypeaheadOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKbd);
    return () => window.removeEventListener('keydown', handleGlobalKbd);
  }, [searchTerm]);

  // Debounced Typeahead Autocomplete Search
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setMatchedCompanies([]);
      setIsTypeaheadOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm.trim())}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const prods = data.products || [];
          setSuggestions(prods);

          // Extract unique matching companies
          const term = searchTerm.toLowerCase().trim();
          const comps = [...new Set(prods.map(p => p.company || p.brand).filter(Boolean))]
            .filter(c => c.toLowerCase().includes(term))
            .slice(0, 4);
          setMatchedCompanies(comps);
          setIsTypeaheadOpen(true);
        }
      } catch (err) {
        console.warn('Typeahead fetch error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fallback: If not passed from props, compute directly from location
  const isB2B = typeof isB2BPortal === 'boolean' 
    ? isB2BPortal 
    : (location.pathname.startsWith('/dashboard') || 
       location.pathname.startsWith('/portal') || 
       location.pathname.startsWith('/retailer-dashboard') ||
       location.pathname.startsWith('/quick-order') || 
       location.pathname.startsWith('/order') || 
       location.pathname.startsWith('/outstanding') || 
       location.pathname.startsWith('/ledger'));

  const chemistName = user?.companyName || user?.company || user?.name || 'Haritas Pharma';
  const chemistInitial = chemistName.split(' ')[0];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
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
  }, [isMobileMenuOpen]);

  // Handle escape key to close menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        setIsMoreOpen(false);
        setIsUserMenuOpen(false);
        setIsTypeaheadOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsMoreOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Click outside to close user menu & dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsTypeaheadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm && searchTerm.trim()) {
      if (isB2B) {
        navigate(`/quick-order?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      }
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // =========================================================================
  // RENDER 1: AUTHENTICATED B2B CHEMIST WORKSTATION HEADER
  // Clean, focused, high-productivity interface modeled after Pharmarack & Retailio
  // =========================================================================
  if (isB2B) {
    return (
      <header className="b2b-header-shell" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}>
        
        {/* Main Workstation Header Bar */}
        <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '10px 16px' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Left: Brand Logo & B2B Workstation Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/dashboard" aria-label="Niyansh Pharma B2B Dashboard" style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/logo.jpg" 
                  alt="Niyansh Pharma B2B" 
                  style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </Link>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '20px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#065f46', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  B2B Portal
                </span>
              </div>
            </div>

            {/* Center: Fast Wholesale Medicine Search */}
            <div ref={searchContainerRef} style={{ position: 'relative', flex: '1 1 320px', maxWidth: '540px' }}>
              <form 
                onSubmit={handleSearchSubmit} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: '#f8fafc', 
                  border: '1.5px solid #cbd5e1', 
                  borderRadius: '30px', 
                  padding: '4px 6px 4px 16px',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                role="search"
              >
                <Search size={16} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Wholesale Medicines, Compositions (Ctrl+K)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.trim().length >= 2) setIsTypeaheadOpen(true);
                  }}
                  onFocus={() => {
                    if (searchTerm && searchTerm.trim().length >= 2) setIsTypeaheadOpen(true);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.85rem',
                    color: 'var(--text-dark)',
                    fontWeight: '500'
                  }}
                  aria-label="Fast search for wholesale medicines"
                />
                <span className="kbd-shortcut hide-mobile" style={{ marginRight: '6px' }}>Ctrl K</span>
                <button 
                  type="submit" 
                  style={{ 
                    backgroundColor: '#0c3d6c', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '20px', 
                    padding: '6px 14px', 
                    fontSize: '0.78rem', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    flexShrink: 0 
                  }}
                >
                  Search
                </button>
              </form>

              {isTypeaheadOpen && searchTerm && searchTerm.trim().length >= 2 && (
                <div 
                  className="animate-slide-up"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
                    zIndex: 1100,
                    overflow: 'hidden',
                    maxHeight: '440px',
                    overflowY: 'auto'
                  }}
                >
                  {matchedCompanies.length > 0 && (
                    <div style={{ padding: '8px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Companies:</span>
                      {matchedCompanies.map(comp => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            navigate(isB2B ? `/quick-order?search=${encodeURIComponent(comp)}` : `/products?search=${encodeURIComponent(comp)}`);
                            setIsTypeaheadOpen(false);
                          }}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {comp} ➔
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearching ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      Searching wholesale catalog...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      No exact medicines matched "{searchTerm}". Press Enter to view all results.
                    </div>
                  ) : (
                    <div>
                      <div style={{ padding: '8px 14px 4px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Matched Medicines ({suggestions.length})
                      </div>
                      {suggestions.map(prod => (
                        <div
                          key={prod._id}
                          onClick={() => {
                            navigate(isB2B ? `/quick-order?search=${encodeURIComponent(prod.name)}` : `/products/${prod._id}`);
                            setIsTypeaheadOpen(false);
                          }}
                          style={{
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark, #0f172a)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </span>
                              {prod.scheme && (
                                <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#fff7ed', color: '#ea580c' }}>
                                  🎁 {prod.scheme}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.composition || prod.company || prod.form || 'Pharma formulation'} • {prod.packing || 'Strip/Box'}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--primary-blue, #0c3d6c)' }}>
                              ₹{Number(prod.ptr || prod.price || 0).toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              MRP ₹{Number(prod.mrp || (prod.ptr ? prod.ptr * 1.3 : prod.price * 1.3) || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#64748b' }}>
                    <span>Press <strong>Enter</strong> to view all results</span>
                    <span className="kbd-shortcut">ESC to close</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Operational Controls & Store Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
              {/* Credit Line Status Badge (Desktop only) */}
              <div 
                className="hide-mobile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}
                title="Allocated Wholesale Credit Line"
              >
                <CreditCard size={14} />
                <span>Credit: ₹1.00L</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
              </div>

              {/* Wholesale Cart Button */}
              <button 
                onClick={onOpenCart}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: cartCount > 0 ? '#ea580c' : '#f1f5f9',
                  color: cartCount > 0 ? '#ffffff' : 'var(--text-dark)',
                  border: cartCount > 0 ? 'none' : '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  transition: 'all 0.2s ease'
                }}
                title={`Wholesale Cart (${cartCount} items)`}
              >
                <ShoppingBag size={16} />
                <span>Cart ({cartCount})</span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Chemist Store Profile Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '24px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    color: '#0c3d6c'
                  }}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <Building2 size={16} color="#0c3d6c" />
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chemistInitial}
                  </span>
                  <ChevronDown size={14} style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0',
                    minWidth: '240px',
                    zIndex: 1050,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ● Verified B2B Partner
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '2px' }}>
                        {chemistName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-medium)', marginTop: '2px' }}>
                        👤 {user?.name || 'Hari Patel'}
                      </div>
                      {user?.gstin && (
                        <div style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: '700', marginTop: '4px' }}>
                          GST: {user.gstin}
                        </div>
                      )}
                    </div>

                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #f1f5f9' }}
                    >
                      <ShieldCheck size={16} color="#059669" /> B2B Dashboard
                    </Link>
                    <Link 
                      to="/quick-order" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #f1f5f9' }}
                    >
                      <Zap size={16} color="#ea580c" /> Quick Order Pad
                    </Link>
                    <Link 
                      to="/outstanding" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #f1f5f9' }}
                    >
                      <FileText size={16} color="#3b82f6" /> Ledger & GST Invoices
                    </Link>
                    <Link 
                      to="/products" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #f1f5f9' }}
                    >
                      <Package size={16} color="#6366f1" /> Browse Public Catalog (MRP)
                    </Link>

                    <button 
                      onClick={() => { setIsUserMenuOpen(false); onLogout(); }}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '11px 16px', 
                        fontSize: '0.85rem', 
                        color: '#dc2626', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontWeight: '700', 
                        textAlign: 'left' 
                      }}
                    >
                      <LogOut size={16} /> Sign Out of Workstation
                    </button>
                  </div>
                )}
              </div>

              {/* Exit to Public Website Button */}
              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                title="Return to Public Retail Website"
              >
                <span>🌐 Public Site</span>
              </Link>

              {/* Mobile Drawer Hamburger */}
              <button 
                className="mobile-menu-btn" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                style={{ marginLeft: '4px' }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>

          </div>
        </div>

        {/* Dedicated B2B Navigation Tab Bar */}
        <nav style={{ backgroundColor: '#0c3d6c', color: '#ffffff', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} aria-label="B2B Workstation Navigation">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', whiteSpace: 'nowrap', padding: '4px 0' }}>
              <Link 
                to="/dashboard" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontWeight: location.pathname === '/dashboard' || location.pathname === '/portal' ? '800' : '600',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  backgroundColor: location.pathname === '/dashboard' || location.pathname === '/portal' ? 'rgba(255,255,255,0.18)' : 'transparent',
                  borderBottom: location.pathname === '/dashboard' || location.pathname === '/portal' ? '3px solid #38bdf8' : '3px solid transparent'
                }}
              >
                <ShieldCheck size={16} color="#38bdf8" />
                <span>Dashboard Overview</span>
              </Link>

              <Link 
                to="/quick-order" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#fed7aa',
                  fontWeight: location.pathname.startsWith('/quick-order') || location.pathname.startsWith('/order') ? '800' : '600',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  backgroundColor: location.pathname.startsWith('/quick-order') ? 'rgba(234, 88, 12, 0.25)' : 'transparent',
                  borderBottom: location.pathname.startsWith('/quick-order') ? '3px solid #ea580c' : '3px solid transparent'
                }}
              >
                <Zap size={16} color="#fb923c" />
                <span>Quick Order Pad</span>
              </Link>

              <Link 
                to="/outstanding" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontWeight: location.pathname.startsWith('/outstanding') || location.pathname.startsWith('/ledger') ? '800' : '600',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  backgroundColor: location.pathname.startsWith('/outstanding') ? 'rgba(255,255,255,0.18)' : 'transparent',
                  borderBottom: location.pathname.startsWith('/outstanding') ? '3px solid #38bdf8' : '3px solid transparent'
                }}
              >
                <FileText size={16} color="#93c5fd" />
                <span>Ledger & GST Bills</span>
              </Link>

              <Link 
                to="/products" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontWeight: location.pathname === '/products' ? '800' : '600',
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <Package size={16} color="#a7f3d0" />
                <span>Wholesale Catalog & PTR</span>
              </Link>

              <Link 
                to="/news" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  color: '#fdba74',
                  fontWeight: location.pathname === '/news' ? '800' : '600',
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <Sparkles size={16} color="#fb923c" />
                <span>10+1 & 15+2 Schemes</span>
              </Link>
            </div>

            {/* Direct WhatsApp Ordering Desk */}
            <div style={{ flexShrink: 0, padding: '4px 0' }}>
              <a 
                href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%20Wholesale%20Desk%2C%20I%20am%20ordering%20from%20B2B%20Portal."
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
                title="Direct B2B Dispatch Helpline"
              >
                <MessageCircle size={14} />
                <span>Wholesale Desk</span>
              </a>
            </div>

          </div>
        </nav>

        {/* Chemist Mobile Drawer */}
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
            <div 
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div style={{
              position: 'relative',
              marginLeft: 'auto',
              width: '85%',
              maxWidth: '340px',
              backgroundColor: '#ffffff',
              height: '100%',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 16px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', color: '#0c3d6c', fontSize: '1rem' }}>B2B Workstation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={22} /></button>
              </div>

              {/* Chemist Profile Card in mobile */}
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px', margin: '14px 0' }}>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase' }}>● Verified Retailer</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginTop: '2px' }}>{chemistName}</div>
                <div style={{ fontSize: '0.78rem', color: '#065f46', marginTop: '2px' }}>👤 {user?.name || 'Hari Patel'}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', color: '#0c3d6c', textDecoration: 'none', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#2563eb" /> B2B Dashboard
                </Link>
                <Link to="/quick-order" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', color: '#ea580c', textDecoration: 'none', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#ea580c" /> Quick Order Pad
                </Link>
                <Link to="/outstanding" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', color: '#0c3d6c', textDecoration: 'none', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#3b82f6" /> Ledger & GST Invoices
                </Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} /> Wholesale Products
                </Link>
                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#ea580c" /> Margin Schemes
                </Link>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌐</span> Exit to Public Website
                </Link>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </header>
    );
  }

  // =========================================================================
  // RENDER 2: PUBLIC RETAIL / CORPORATE WEBSITE HEADER
  // Clean marketing presentation with single, non-redundant B2B Chemist Login button
  // =========================================================================
  return (
    <header style={{ width: '100%', position: 'relative', zIndex: 100 }}>
      {/* Top Contact Strip */}
      <div className="top-strip">
        <div className="container top-strip-content">
          <div className="top-contacts">
            <span className="top-contact-item">
              <Phone size={14} aria-hidden="true" /> 
              <a href="tel:+919909923130" aria-label="Call Niyansh Pharma at +91 99099 23130">+91 99099 23130</a>
            </span>
            <span className="top-contact-item">
              <Mail size={14} aria-hidden="true" /> 
              <a href="mailto:niyanshpharma@gmail.com" aria-label="Email Niyansh Pharma at niyanshpharma@gmail.com">niyanshpharma@gmail.com</a>
            </span>
          </div>
          <div className="top-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: '700', fontSize: '0.88rem', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }}></span>
            Care • Quality • Trust
          </div>
          <div className="top-links">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              📍 Rajkot, Gujarat
            </span>
            <span style={{ color: 'var(--secondary-green)', fontWeight: '600' }}>
              • WHO-GMP Certified Wholesale
            </span>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="main-header">
        <div className="container main-header-content">
          <Link to="/" className="logo-container" aria-label="Niyansh Pharma Home">
            <img 
              src="/logo.jpg" 
              alt="Niyansh Pharma Wholesale Distribution Logo" 
              style={{ height: '62px', width: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </Link>

          {/* Search Form with Typeahead */}
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '580px' }}>
            <form className="search-bar" onSubmit={handleSearchSubmit} role="search" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search 9,500+ medicines, companies, compositions (Ctrl+K)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim().length >= 2) setIsTypeaheadOpen(true);
                }}
                onFocus={() => {
                  if (searchTerm && searchTerm.trim().length >= 2) setIsTypeaheadOpen(true);
                }}
                aria-label="Search pharmaceutical products"
              />
              <span className="kbd-shortcut hide-mobile" style={{ position: 'absolute', right: '48px', top: '50%', transform: 'translateY(-50%)' }}>Ctrl K</span>
              <button type="submit" className="search-button" aria-label="Submit search">
                <Search size={18} aria-hidden="true" />
              </button>
            </form>

              {isTypeaheadOpen && searchTerm && searchTerm.trim().length >= 2 && (
                <div 
                  className="animate-slide-up"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
                    zIndex: 1100,
                    overflow: 'hidden',
                    maxHeight: '440px',
                    overflowY: 'auto'
                  }}
                >
                  {matchedCompanies.length > 0 && (
                    <div style={{ padding: '8px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Companies:</span>
                      {matchedCompanies.map(comp => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            navigate(isB2B ? `/quick-order?search=${encodeURIComponent(comp)}` : `/products?search=${encodeURIComponent(comp)}`);
                            setIsTypeaheadOpen(false);
                          }}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {comp} ➔
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearching ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      Searching wholesale catalog...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      No exact medicines matched "{searchTerm}". Press Enter to view all results.
                    </div>
                  ) : (
                    <div>
                      <div style={{ padding: '8px 14px 4px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Matched Medicines ({suggestions.length})
                      </div>
                      {suggestions.map(prod => (
                        <div
                          key={prod._id}
                          onClick={() => {
                            navigate(isB2B ? `/quick-order?search=${encodeURIComponent(prod.name)}` : `/products/${prod._id}`);
                            setIsTypeaheadOpen(false);
                          }}
                          style={{
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark, #0f172a)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </span>
                              {prod.scheme && (
                                <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#fff7ed', color: '#ea580c' }}>
                                  🎁 {prod.scheme}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.composition || prod.company || prod.form || 'Pharma formulation'} • {prod.packing || 'Strip/Box'}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--primary-blue, #0c3d6c)' }}>
                              ₹{Number(prod.ptr || prod.price || 0).toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              MRP ₹{Number(prod.mrp || (prod.ptr ? prod.ptr * 1.3 : prod.price * 1.3) || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#64748b' }}>
                    <span>Press <strong>Enter</strong> to view all results</span>
                    <span className="kbd-shortcut">ESC to close</span>
                  </div>
                </div>
              )}
          </div>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* SINGLE, NON-REDUNDANT B2B PORTAL ACCESS BUTTON */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-light)', paddingRight: '12px', position: 'relative' }} ref={userMenuRef}>
                <Link
                  to="/dashboard"
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '1.5px solid #a7f3d0',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Open B2B Portal"
                >
                  <ShieldCheck size={15} color="#059669" />
                  <span>B2B Portal ➔</span>
                </Link>

                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '20px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--primary-blue)'
                    }}
                  >
                    <User size={14} />
                    <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chemistInitial}
                    </span>
                    <ChevronDown size={12} />
                  </button>

                  {isUserMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      minWidth: '220px',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase' }}>● Verified B2B Partner</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)' }}>{chemistName}</div>
                      </div>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.84rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}
                      >
                        <ShieldCheck size={16} color="#059669" /> B2B Dashboard
                      </Link>
                      <Link 
                        to="/quick-order" 
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.84rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}
                      >
                        <Zap size={16} color="#ea580c" /> Quick Order Pad
                      </Link>
                      <Link 
                        to="/outstanding" 
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.84rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}
                      >
                        <FileText size={16} color="#3b82f6" /> Ledger & Invoices
                      </Link>
                      <button 
                        onClick={() => { setIsUserMenuOpen(false); onLogout(); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.84rem', color: '#dc2626', background: 'none', border: 'none', borderTop: '1px solid #f1f5f9', cursor: 'pointer', fontWeight: '600', textAlign: 'left' }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn btn-outline btn-sm"
                style={{ padding: '8px 18px', borderRadius: '30px', fontWeight: '800', border: '1.5px solid var(--primary-blue)', color: 'var(--primary-blue)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                aria-label="Open B2B login and registration modal"
              >
                <LogIn size={15} aria-hidden="true" /> <span>B2B Login</span>
              </button>
            )}

            <button 
              className="cart-icon-btn" 
              onClick={onOpenCart} 
              aria-label={`Open Cart containing ${cartCount} items`}
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar - Clean, balanced, NO DUPLICATE BUTTONS */}
      <nav className="nav-bar" aria-label="Main Navigation">
        <div className="container nav-bar-content">
          
          {/* Left Core Catalog Links */}
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={`nav-link ${isActive('/products')}`}>All Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/companies" className={`nav-link ${isActive('/companies') ? 'active' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Companies
                <span style={{ fontSize: '0.72rem', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '800', padding: '1px 6px', borderRadius: '10px' }}>252+</span>
              </Link>
            </li>
            <li 
              className="nav-item"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span 
                className="nav-link" 
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                role="button"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsDropdownOpen(!isDropdownOpen); }}
              >
                Categories <ChevronDown size={14} aria-hidden="true" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </span>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} style={{ display: isDropdownOpen ? 'block' : 'none' }}>
                <li><Link to="/products?category=Pharma Products" className="dropdown-link">Pharma Medicines</Link></li>
                <li><Link to="/products?category=OTC Products" className="dropdown-link">OTC Products</Link></li>
                <li><Link to="/products?category=Injectables" className="dropdown-link">Injectables & Critical Care</Link></li>
                <li><Link to="/products?category=Surgical %26 Medical Supplies" className="dropdown-link">Surgical & Medical Supplies</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link 
                to="/quick-order" 
                className={`nav-pill-link nav-pill-order ${isActive('/quick-order') || isActive('/order') ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <span>⚡</span> Quick Order Pad
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/news" className={`nav-link ${isActive('/news') || isActive('/schemes') ? 'active' : ''}`} style={{ color: '#ea580c', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>🔥</span> Schemes & Deals
              </Link>
            </li>
          </ul>

          {/* Right Corporate Links */}
          <ul className="nav-links nav-links-right">
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about') || isActive('/about-us') ? 'active' : ''}`}>About Us</Link>
            </li>
            <li 
              className="nav-item"
              ref={moreDropdownRef}
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <span 
                className="nav-link" 
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                role="button"
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsMoreOpen(!isMoreOpen); }}
              >
                Services <ChevronDown size={14} aria-hidden="true" style={{ transform: isMoreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </span>
              <ul className={`dropdown-menu dropdown-menu-right ${isMoreOpen ? 'show' : ''}`} style={{ display: isMoreOpen ? 'block' : 'none', minWidth: '220px', right: 0, left: 'auto' }}>
                <li><Link to="/manufacturing" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Factory size={15} /> Manufacturing</Link></li>
                <li><Link to="/partner" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Handshake size={15} /> Partner With Us</Link></li>
                <li><Link to="/supplier" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={15} /> Supplier Registration</Link></li>
                <li><Link to="/career" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={15} /> Career With Us</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
            </li>
            <li className="nav-item">
              <a 
                href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20enquire%20about%20wholesale%20supply." 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  marginLeft: '4px'
                }}
                title="Direct WhatsApp Wholesale Desk"
              >
                <MessageCircle size={14} /> WhatsApp Desk
              </a>
            </li>
          </ul>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998
            }}
            aria-hidden="true"
          />

          <div 
            className="mobile-nav-drawer"
            style={{
              position: 'fixed', 
              top: 0, 
              right: 0, 
              bottom: 0, 
              width: 'min(88vw, 380px)', 
              height: '100vh',
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-dark)',
              zIndex: 9999, 
              overflowY: 'auto', 
              padding: '20px 18px 40px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              borderLeft: '1px solid var(--border-light)',
              boxShadow: '-8px 0 35px rgba(0,0,0,0.22)'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.jpg" alt="" style={{ height: '36px', width: 'auto', borderRadius: '4px', backgroundColor: '#ffffff', padding: '2px 4px' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '800', color: 'var(--text-dark)', fontSize: '1.02rem', lineHeight: '1.2' }}>Niyansh Pharma</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--secondary-green)', fontWeight: '700' }}>Care • Quality • Trust</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-medium)', cursor: 'pointer' }}
                aria-label="Close navigation menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {user && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
                  <ShieldCheck size={14} /> Verified B2B Partner
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#064e3b', margin: '2px 0 8px 0' }}>
                  {chemistName}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ backgroundColor: '#059669', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', textDecoration: 'none' }}
                  >
                    B2B Portal
                  </Link>
                  <Link 
                    to="/quick-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ backgroundColor: '#ffffff', border: '1px solid #a7f3d0', color: '#047857', padding: '7px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', textDecoration: 'none' }}
                  >
                    Quick Order
                  </Link>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Theme Mode</span>
              <ThemeToggle variant="pill" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600' }}>Home</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600' }}>All Products Catalog</Link>
              <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600' }}>Companies & Manufacturers (252+)</Link>
              <Link to="/quick-order" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '700', color: '#ea580c' }}>⚡ Quick Order Pad</Link>
              <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600' }}>🔥 Schemes & Deals</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600' }}>About Us</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600' }}>Contact & Support</Link>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
              {user ? (
                <button 
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 15px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-medium)', fontWeight: '600', cursor: 'pointer', width: '100%' }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              ) : (
                <button 
                  onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 15px', backgroundColor: 'var(--primary-blue)', color: '#ffffff', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', border: 'none', width: '100%' }}
                >
                  <LogIn size={16} /> B2B Login / Register
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;

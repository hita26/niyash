import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Phone, Mail, ChevronDown, ChevronRight, Menu, X, User, LogOut, LogIn, ShieldCheck, FileText, Zap,
  Package, Flame, CreditCard, Factory, Handshake, Users, PhoneCall, Shield,
  ArrowRight, MessageCircle, ExternalLink, Lock, Info, Building2, Store, Sparkles, RefreshCw, Globe,
  Edit2, Crown
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

function Header({ 
  cartCount, 
  onOpenCart, 
  searchTerm, 
  setSearchTerm, 
  user, 
  onLogout, 
  onOpenAuth, 
  isB2BPortal,
  isMobileMenuOpen: externalIsMobileMenuOpen,
  setIsMobileMenuOpen: externalSetIsMobileMenuOpen 
}) {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const brandLogo = isDark ? '/logo-dark.png' : '/logo.jpg';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [localIsMobileMenuOpen, setLocalIsMobileMenuOpen] = useState(false);
  const isMobileMenuOpen = typeof externalIsMobileMenuOpen === 'boolean' ? externalIsMobileMenuOpen : localIsMobileMenuOpen;
  const setIsMobileMenuOpen = externalSetIsMobileMenuOpen || setLocalIsMobileMenuOpen;
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

  // Dedicated Admin Header Profile & Control States
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('niyansh_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [isAdminRefreshing, setIsAdminRefreshing] = useState(false);
  const adminDropdownRef = useRef(null);

  useEffect(() => {
    const handleAdminUserUpdate = (e) => {
      if (e && e.detail) {
        setAdminUser(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('niyansh_admin_user');
          setAdminUser(saved ? JSON.parse(saved) : null);
        } catch (_) {}
      }
    };
    window.addEventListener('admin:user-updated', handleAdminUserUpdate);
    window.addEventListener('storage', handleAdminUserUpdate);
    return () => {
      window.removeEventListener('admin:user-updated', handleAdminUserUpdate);
      window.removeEventListener('storage', handleAdminUserUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(e.target)) {
        setIsAdminProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Bulletproof Body Scroll Lock when Mobile Drawer is Open (prevents underlying webpage scroll on iOS & Android)
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.setAttribute('data-scroll-locked', scrollY.toString());
    } else {
      const savedScroll = document.body.getAttribute('data-scroll-locked');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (savedScroll !== null) {
        window.scrollTo(0, parseInt(savedScroll, 10));
        document.body.removeAttribute('data-scroll-locked');
      }
    }
    return () => {
      const savedScroll = document.body.getAttribute('data-scroll-locked');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (savedScroll !== null) {
        window.scrollTo(0, parseInt(savedScroll, 10));
        document.body.removeAttribute('data-scroll-locked');
      }
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
  // RENDER 0: DEDICATED ADMIN CONSOLE HEADER (SUPER ADMIN & OPERATIONS ADMIN)
  // Clean, distraction-free header: Logo, Language Selector & Theme Toggle only
  // =========================================================================
  if (location.pathname.startsWith('/admin')) {
    return (
      <header className="admin-header-shell" style={{ 
        width: '100%', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)', 
        backgroundColor: 'var(--bg-surface, #ffffff)',
        borderBottom: '1px solid var(--border-light, #e2e8f0)' 
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: '16px' }}>
          {/* Brand Logo & Compliance Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/admin" aria-label="Niyansh Pharma Admin Console" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src={brandLogo} 
                alt="Niyansh Pharma" 
                style={{ height: '52px', width: 'auto', display: 'block', objectFit: 'contain' }} 
              />
            </Link>
            <div className="admin-header-licenses" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-medium)' }}>
              <span style={{ backgroundColor: 'rgba(12, 61, 108, 0.05)', border: '1px solid var(--border-light)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }} title="Drug License: 20B GJ-RJT-264618, 21B GJ-RJT-264619">
                D.L.: 20B / 21B
              </span>
              <span style={{ backgroundColor: 'rgba(12, 61, 108, 0.05)', border: '1px solid var(--border-light)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }} title="GSTIN: 24BVXPP6108F2Z7">
                GSTIN: 24BVXPP6108F2Z7
              </span>
              <span style={{ backgroundColor: 'rgba(12, 61, 108, 0.05)', border: '1px solid var(--border-light)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }} title="Food Safety License: 20726030000567">
                FSSAI: 20726030000567
              </span>
            </div>
          </div>

          {/* Right Action Controls: Refresh (Icon Only), Language, Theme & Admin Profile Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Header Refresh Button - Strictly ICON ONLY */}
            <button
              type="button"
              onClick={() => {
                setIsAdminRefreshing(true);
                window.dispatchEvent(new CustomEvent('admin:refresh-data'));
                setTimeout(() => setIsAdminRefreshing(false), 800);
              }}
              title="Refresh Live Data"
              aria-label="Refresh Live Data"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-light, #e2e8f0)',
                backgroundColor: 'var(--bg-surface, #ffffff)',
                color: 'var(--text-dark, #1e293b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <RefreshCw size={17} className={isAdminRefreshing ? 'animate-spin' : ''} />
            </button>

            <LanguageSelector />
            <ThemeToggle />

            {/* Admin Profile Pill & Hover Dropdown */}
            {adminUser && (
              <div 
                ref={adminDropdownRef} 
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsAdminProfileOpen(true)}
                onMouseLeave={() => setIsAdminProfileOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsAdminProfileOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '4px 12px 4px 5px',
                    height: '38px',
                    borderRadius: '20px',
                    border: `1.5px solid ${
                      (adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com')
                        ? (isDark ? 'rgba(245, 158, 11, 0.45)' : '#fde68a')
                        : (isDark ? 'rgba(56, 189, 248, 0.35)' : 'var(--border-light, #e2e8f0)')
                    }`,
                    backgroundColor: (adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com')
                      ? (isDark ? 'rgba(245, 158, 11, 0.14)' : '#fffbeb')
                      : (isDark ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-surface, #ffffff)'),
                    cursor: 'pointer',
                    boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  title="My Admin Account"
                >
                  <img
                    src={adminUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminUser?.name || ((adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'Super Admin' : 'Admin'))}&background=${(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'f59e0b' : '0284c7'}&color=ffffff&bold=true`}
                    alt="Avatar"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `1.5px solid ${(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? '#f59e0b' : '#0284c7'}`
                    }}
                  />
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: isDark ? '#f8fafc' : '#1e293b', lineHeight: 1.1, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {adminUser?.name || ((adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'Super Admin' : 'Admin')}
                    </span>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: '800',
                      color: (adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com')
                        ? (isDark ? '#fbbf24' : '#b45309')
                        : (isDark ? '#38bdf8' : '#0284c7'),
                      letterSpacing: '0.3px',
                      lineHeight: 1
                    }}>
                      {(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'SUPER ADMIN' : 'STAFF ADMIN'}
                    </span>
                  </div>
                  <ChevronDown size={14} style={{ color: isDark ? '#cbd5e1' : 'var(--text-medium, #64748b)', transform: isAdminProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {/* Profile Dropdown Menu */}
                {isAdminProfileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: 'var(--bg-surface, #ffffff)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 32px rgba(12, 61, 108, 0.12)',
                    padding: '14px',
                    zIndex: 1050,
                    animation: 'pwaSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    {/* User info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light, #e2e8f0)' }}>
                      <img
                        src={adminUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminUser?.name || ((adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'Super Admin' : 'Admin'))}&background=${(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'f59e0b' : '0284c7'}&color=ffffff&bold=true`}
                        alt="Avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? '#f59e0b' : '#0284c7'}` }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark, #1e293b)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {adminUser?.name || 'Administrator'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light, #94a3b8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {adminUser?.email || 'admin@niyanshpharma.com'}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.62rem',
                          fontWeight: '800',
                          backgroundColor: (adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com')
                            ? (isDark ? 'rgba(245, 158, 11, 0.18)' : '#fef3c7')
                            : (isDark ? 'rgba(56, 189, 248, 0.16)' : '#e0f2fe'),
                          color: (adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com')
                            ? (isDark ? '#fbbf24' : '#b45309')
                            : (isDark ? '#38bdf8' : '#0369a1'),
                          border: isDark
                            ? `1px solid ${(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.3)'}`
                            : 'none',
                          padding: '1px 7px',
                          borderRadius: '8px',
                          marginTop: '3px'
                        }}>
                          {(adminUser?.role === 'superadmin' || adminUser?.email === 'info@niyanshpharma.com') ? 'Super Administrator' : 'Operations Staff'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminProfileOpen(false);
                          window.dispatchEvent(new CustomEvent('admin:open-profile'));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--text-dark, #1e293b)',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main, #f8fafc)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <User size={15} color="var(--primary-blue, #0284c7)" /> Edit Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminProfileOpen(false);
                          window.dispatchEvent(new CustomEvent('admin:logout'));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#ef4444',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      >
                        <LogOut size={15} color="#ef4444" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // RENDER 1: AUTHENTICATED B2B CHEMIST WORKSTATION HEADER
  // Clean, focused, high-productivity interface modeled after Pharmarack & Retailio
  // =========================================================================
  if (isB2B) {
    return (
      <header className="b2b-header-shell" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: 'var(--bg-surface)' }}>
        
        {/* Main Workstation Header Bar - STRICT SINGLE LINE ENTERPRISE B2B BAR */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', padding: '10px 16px' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'nowrap', minHeight: '62px' }}>
            
            {/* Top Row on Mobile: Logo (Left) + Cart, Theme, Hamburger (Right) */}
            <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
              <Link to="/dashboard" aria-label="Niyansh Pharma B2B Dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img 
                  src={brandLogo} 
                  alt="Niyansh Pharma" 
                  style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </Link>

              {/* Mobile Action Controls: Theme Toggle & Hamburger */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThemeToggle />

                <button 
                  className="mobile-menu-btn" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                  style={{ 
                    width: '38px',
                    height: '38px',
                    boxSizing: 'border-box',
                    border: '1.5px solid var(--border-light)', 
                    borderRadius: '8px', 
                    background: 'var(--bg-surface-alt)', 
                    color: 'var(--text-dark)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Left: Brand Logo on Desktop */}
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Link to="/dashboard" aria-label="Niyansh Pharma B2B Dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img 
                  src={brandLogo} 
                  alt="Niyansh Pharma" 
                  style={{ height: '54px', width: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </Link>
            </div>

            {/* Center: Fast Wholesale Medicine Search (Flexible Single-Line Width) */}
            <div ref={searchContainerRef} className="search-wrapper hide-mobile" style={{ position: 'relative', flex: '1 1 auto', minWidth: '160px', maxWidth: '440px', margin: '0 8px' }}>
              <form 
                onSubmit={handleSearchSubmit} 
                style={{ 
                  height: '38px',
                  boxSizing: 'border-box',
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: 'var(--bg-surface-alt)', 
                  border: '1.5px solid var(--border-light)', 
                  borderRadius: '24px', 
                  padding: '0 4px 0 14px',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                role="search"
              >
                <Search size={15} color="var(--primary-blue, #0c3d6c)" style={{ marginRight: '8px', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('nav.searchB2BPlaceholder', 'Search Wholesale Medicines, Compositions...')}
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
                    height: '100%',
                    fontSize: '0.84rem',
                    color: 'var(--text-dark)',
                    fontWeight: '500'
                  }}
                  aria-label="Fast search for wholesale medicines"
                />
                <button 
                  type="submit" 
                  style={{ 
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#0c3d6c', 
                    color: '#ffffff', 
                    border: 'none', 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'opacity 0.15s ease'
                  }}
                  title={t('common.search', 'Search')}
                  aria-label={t('common.search', 'Search')}
                >
                  <Search size={14} color="#ffffff" />
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
                    <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                      {t('products.searchingWholesale', 'Searching wholesale catalog...')}
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      {t('products.noExactMatches', `No exact medicines matched "${searchTerm}". Press Enter to view all results.`)}
                    </div>
                  ) : (
                    <div>
                      <div style={{ padding: '8px 14px 4px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {t('products.matchedMedicines', 'Matched Medicines')} ({suggestions.length})
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

                  <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-light)' }}>
                    <span>{t('common.pressEnter', 'Press Enter to view all results')}</span>
                    <span className="kbd-shortcut">{t('common.escToClose', 'ESC to close')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Operational Controls & Store Profile on Desktop (SINGLE ROW, NO WRAP) */}
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              
              {/* Language Selector */}
              <LanguageSelector />

              {/* Credit Line Status Badge */}
              <div 
                style={{
                  height: '38px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(2, 132, 199, 0.08)',
                  border: '1.5px solid rgba(2, 132, 199, 0.28)',
                  color: 'var(--primary-blue, #0284c7)',
                  padding: '0 12px',
                  borderRadius: '20px',
                  fontSize: '0.80rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}
                title="Allocated Wholesale Credit Line: ₹1,00,000"
              >
                <CreditCard size={15} />
                <span>Credit: ₹1.00L</span>
              </div>

              {/* Wholesale Cart Button */}
              <button 
                onClick={onOpenCart}
                style={{
                  height: '38px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: cartCount > 0 ? '#ea580c' : 'var(--bg-surface-alt, #f8fafc)',
                  color: cartCount > 0 ? '#ffffff' : 'var(--text-dark)',
                  border: cartCount > 0 ? '1.5px solid #ea580c' : '1.5px solid var(--border-light, #e2e8f0)',
                  borderRadius: '20px',
                  padding: '0 14px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.80rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
                title={`Wholesale Cart (${cartCount} items)`}
              >
                <ShoppingBag size={15} />
                <span>Cart ({cartCount})</span>
              </button>

              {/* Single Theme Toggle Button (Light ☀️ / Dark 🌙 Only) */}
              <ThemeToggle />

              {/* Chemist Store Profile Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    height: '38px',
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--bg-surface-alt, #f8fafc)',
                    border: '1.5px solid var(--border-light, #e2e8f0)',
                    borderRadius: '20px',
                    padding: '0 13px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    color: 'var(--primary-blue, #0c3d6c)',
                    whiteSpace: 'nowrap'
                  }}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <Building2 size={15} color="var(--primary-blue, #0c3d6c)" />
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chemistInitial}
                  </span>
                  <ChevronDown size={13} style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    minWidth: '260px',
                    zIndex: 1050,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-surface-alt, #f8fafc)', borderBottom: '1px solid var(--border-light, #e2e8f0)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ● {t('retailerDashboard.verifiedPartner', 'Verified B2B Partner')}
                      </div>
                      <div style={{ fontSize: '0.94rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '2px' }}>
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
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <ShieldCheck size={16} color="#059669" /> <span>{t('nav.dashboardOverview', 'Dashboard Overview')}</span>
                    </Link>

                    <Link 
                      to="/quick-order" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <Zap size={16} color="#ea580c" /> <span>{t('nav.quickOrder', 'Quick Order Pad')}</span>
                    </Link>

                    <Link 
                      to="/outstanding" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <FileText size={16} color="#3b82f6" /> <span>{t('nav.ledger', 'Ledger & GST Bills')}</span>
                    </Link>

                    <Link 
                      to="/products" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <Package size={16} color="#6366f1" /> <span>{t('nav.wholesaleCatalog', 'Wholesale Catalog & PTR')}</span>
                    </Link>

                    <Link 
                      to="/news" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <Sparkles size={16} color="#f59e0b" /> <span>{t('nav.marginSchemes', 'Schemes & Deals (10+1 & 15+2)')}</span>
                    </Link>

                    <a 
                      href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%20Wholesale%20Desk%2C%20I%20am%20ordering%20from%20B2B%20Portal."
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: '#059669', textDecoration: 'none', fontWeight: '700', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <MessageCircle size={16} color="#059669" /> <span>{t('nav.wholesaleDesk', 'Wholesale Desk (WhatsApp)')}</span>
                    </a>

                    <Link 
                      to="/" 
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: '700', borderBottom: '1px solid var(--border-light, #f1f5f9)' }}
                    >
                      <Globe size={16} color="#0284c7" /> <span>{t('nav.publicSite', 'Switch to Public Website')}</span>
                    </Link>

                    <button 
                      onClick={() => { setIsUserMenuOpen(false); onLogout(); navigate('/', { replace: true }); }}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
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
                      <LogOut size={16} /> <span>{t('nav.logout', 'Sign Out of Workstation')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Exit to Public Website Pill */}
              <Link
                to="/"
                style={{
                  height: '38px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border-light, #e2e8f0)',
                  backgroundColor: 'var(--bg-surface-alt, #f8fafc)',
                  color: 'var(--text-medium, #64748b)',
                  textDecoration: 'none',
                  padding: '0 12px',
                  fontSize: '0.80rem',
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
                title={t('nav.publicSite', 'Switch to Public Website')}
              >
                <Globe size={15} color="#0284c7" />
                <span>{t('nav.publicWebsite', 'Public Site')}</span>
              </Link>

            </div>

          </div>

          {/* Mobile Secondary Search Bar */}
          <div className="hide-desktop" style={{ width: '100%', paddingTop: '8px' }}>
            <form 
              onSubmit={handleSearchSubmit} 
              style={{ 
                height: '38px',
                boxSizing: 'border-box',
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'var(--bg-surface-alt)', 
                border: '1.5px solid var(--border-light)', 
                borderRadius: '24px', 
                padding: '0 4px 0 12px'
              }}
              role="search"
            >
              <Search size={15} color="var(--primary-blue, #0c3d6c)" style={{ marginRight: '6px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={t('nav.searchB2BPlaceholder', 'Search Wholesale Medicines...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  height: '100%',
                  fontSize: '0.82rem',
                  color: 'var(--text-dark)'
                }}
              />
              <button 
                type="submit" 
                style={{ 
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#0c3d6c', 
                  color: '#ffffff', 
                  border: 'none', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                title={t('common.search', 'Search')}
                aria-label={t('common.search', 'Search')}
              >
                <Search size={13} color="#ffffff" />
              </button>
            </form>
          </div>
        </div>

        {/* Chemist Mobile Drawer */}
        {isMobileMenuOpen && createPortal(
          <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', overflow: 'hidden' }}>
            <div 
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
            />
            <div className="mobile-nav-drawer" style={{
              position: 'relative',
              marginLeft: 'auto',
              width: 'min(88vw, 360px)',
              backgroundColor: 'var(--bg-card, #ffffff)',
              color: 'var(--text-dark)',
              height: '100dvh',
              maxHeight: '100dvh',
              boxShadow: '-8px 0 35px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              padding: 'max(20px, env(safe-area-inset-top, 20px)) 16px calc(140px + env(safe-area-inset-bottom, 24px)) 16px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontWeight: '800', color: 'var(--primary-blue)', fontSize: '1rem' }}>{t('nav.b2bWorkstation', 'B2B Workstation')}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Close menu"><X size={20} /></button>
              </div>

              {/* Chemist Profile Card in mobile */}
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase' }}>● {t('retailerDashboard.verifiedPartner', 'Verified Retailer')}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginTop: '2px' }}>{chemistName}</div>
                <div style={{ fontSize: '0.78rem', color: '#065f46', marginTop: '2px' }}>👤 {user?.name || 'Hari Patel'}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', color: '#0c3d6c', textDecoration: 'none', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#2563eb" /> {t('nav.dashboard', 'B2B Dashboard')}
                </Link>
                <Link to="/quick-order" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', color: '#ea580c', textDecoration: 'none', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#ea580c" /> {t('nav.quickOrder', 'Quick Order Pad')}
                </Link>
                <Link to="/outstanding" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', color: '#0c3d6c', textDecoration: 'none', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#3b82f6" /> {t('nav.ledger', 'Ledger & GST Invoices')}
                </Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} /> {t('nav.products', 'Wholesale Products')}
                </Link>
                <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} /> {t('nav.companies', 'Companies & Brands')}
                </Link>
                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#ea580c" /> {t('nav.marginSchemes', 'Margin Schemes')}
                </Link>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', borderRadius: '8px', fontWeight: '600', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌐</span> {t('nav.publicSite', 'Exit to Public Website')}
                </Link>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onLogout(); navigate('/', { replace: true }); }}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <LogOut size={16} /> {t('nav.logout', 'Sign Out')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      </header>
    );
  }

  // =========================================================================
  // RENDER 2: PUBLIC RETAIL / CORPORATE WEBSITE HEADER
  // Clean marketing presentation with single, non-redundant B2B Chemist Login button
  // =========================================================================
  return (
    <header className="public-header-shell" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', backgroundColor: 'var(--bg-surface)' }}>
      {/* Main Branding Header */}
      <div className="main-header">
        <div className="container main-header-content">
          <Link to="/" className="logo-container" aria-label="Niyansh Pharma Home">
            <img 
              src={brandLogo} 
              alt="Niyansh Pharma Wholesale Distribution Logo" 
              className="header-brand-logo"
              style={{ height: '58px', width: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </Link>

          {/* Search Form with Typeahead */}
          <div ref={searchContainerRef} className="search-wrapper" style={{ position: 'relative', flex: '1 1 200px', minWidth: 0, maxWidth: '580px' }}>
            <form className="search-bar" onSubmit={handleSearchSubmit} role="search" style={{ position: 'relative' }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('nav.searchPlaceholder', 'Search medicines, companies, compositions...')}
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
                    <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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

                  <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-light)' }}>
                    <span>Press <strong>Enter</strong> to view all results</span>
                    <span className="kbd-shortcut">ESC to close</span>
                  </div>
                </div>
              )}
          </div>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Language Selector (English | ગુજરાતી | हिन्दी) */}
            <LanguageSelector />

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Direct Admin Console Access Button (Opens in New Tab - Desktop Only) */}
            <Link
              to="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-pill hide-mobile"
              title="Admin & Operations Console"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '38px',
                boxSizing: 'border-box',
                gap: '6px',
                padding: '0 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--text-medium, #64748b)',
                border: '1.5px solid var(--border-light, #cbd5e1)',
                backgroundColor: 'var(--bg-main, #f8fafc)',
                textDecoration: 'none',
                lineHeight: 1,
                verticalAlign: 'middle'
              }}
            >
              <Shield size={14} style={{ color: 'var(--primary-blue, #2563eb)', flexShrink: 0 }} />
              <span style={{ lineHeight: 1 }}>Admin</span>
            </Link>

            {/* PUBLIC WEBSITE ACCESS: Strictly Clean Chemist Login / Register Button (Desktop Only) */}
            <button 
              onClick={() => {
                if (user) {
                  window.open('/dashboard', '_blank');
                } else {
                  onOpenAuth();
                }
              }}
              className="chemist-header-btn hide-mobile"
              aria-label="Open Chemist Login or Portal"
              style={{ height: '38px', boxSizing: 'border-box' }}
            >
              <LogIn size={15} aria-hidden="true" /> <span>{t('nav.login', 'Chemist Login / Register')}</span>
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
              <Link to="/" className={`nav-link ${isActive('/')}`}>{t('nav.home', 'Home')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={`nav-link ${isActive('/products')}`}>{t('nav.products', 'All Products')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/companies" className={`nav-link ${isActive('/companies') ? 'active' : ''}`}>
                {t('nav.companies', 'Companies')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/our-products" className={`nav-link ${isActive('/our-products') ? 'active' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {t('nav.ourProducts', 'Our Products')}
                <span style={{ fontSize: '0.70rem', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '1px 6px', borderRadius: '10px' }}>Exclusive</span>
              </Link>
            </li>
          </ul>

          {/* Right Corporate Links */}
          <ul className="nav-links nav-links-right">
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about') || isActive('/about-us') ? 'active' : ''}`}>{t('nav.about', 'About Us')}</Link>
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
                {t('nav.services', 'Services')} <ChevronDown size={14} aria-hidden="true" style={{ transform: isMoreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </span>
              <ul className={`dropdown-menu dropdown-menu-right ${isMoreOpen ? 'show' : ''}`} style={{ display: isMoreOpen ? 'block' : 'none', minWidth: '220px', right: 0, left: 'auto' }}>
                <li><Link to="/manufacturing" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Factory size={15} /> {t('services.contractManufacturing', 'Manufacturing')}</Link></li>
                <li><Link to="/partner" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Handshake size={15} /> {t('services.distributionSupply', 'Business With Us')}</Link></li>
                <li><Link to="/supplier" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={15} /> {t('services.thirdPartyManufacturing', 'Supplier Registration')}</Link></li>
                <li><Link to="/career" className="dropdown-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={15} /> {t('nav.career', 'Career With Us')}</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>{t('nav.contact', 'Contact Us')}</Link>
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
                <MessageCircle size={14} /> {t('nav.whatsappDesk', 'WhatsApp Desk')}
              </a>
            </li>
          </ul>

        </div>
      </nav>

      {/* Mobile Drawer Menu via Portal */}
      {isMobileMenuOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', overflow: 'hidden' }}>
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 999998
            }}
            aria-hidden="true"
          />

          <div 
            className="mobile-nav-drawer"
            style={{
              position: 'relative', 
              marginLeft: 'auto',
              width: 'min(88vw, 380px)', 
              height: '100dvh',
              maxHeight: '100dvh',
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-dark)',
              zIndex: 999999, 
              overflowY: 'auto', 
              WebkitOverflowScrolling: 'touch',
              paddingTop: 'max(20px, env(safe-area-inset-top, 20px))', 
              paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 24px))', 
              paddingLeft: 'max(18px, env(safe-area-inset-left, 18px))',
              paddingRight: 'max(18px, env(safe-area-inset-right, 18px))',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              borderLeft: '1px solid var(--border-light)',
              boxShadow: '-8px 0 35px rgba(0,0,0,0.25)'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={brandLogo} alt="Niyansh Pharma" style={{ height: '48px', width: 'auto', borderRadius: '4px', objectFit: 'contain' }} />
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

            {/* Chemist / B2B Wholesale Portal Access Button */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (user) {
                  window.open('/dashboard', '_blank');
                } else {
                  onOpenAuth();
                }
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: '700',
                fontSize: '0.90rem',
                backgroundColor: 'var(--primary-blue)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LogIn size={17} />
              <span>{t('nav.login', 'Chemist Login / Register')}</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Store size={17} color="var(--primary-blue)" /> {t('nav.home', 'Home')}
              </Link>
              <Link to="/our-products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '700', color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={17} color="#16a34a" /> {t('nav.ourProducts', 'Our Products')}
                </span>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '1px 6px', borderRadius: '10px' }}>Exclusive</span>
              </Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={17} color="var(--primary-blue)" /> {t('nav.products', 'All Products Catalog')}
              </Link>
              <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={17} color="var(--primary-blue)" /> {t('nav.companies', 'Companies & Brands')}
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Info size={17} color="var(--primary-blue)" /> {t('nav.about', 'About Us')}
              </Link>
              
              {/* Corporate Services Group */}
              <div style={{ marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ padding: '4px 12px', fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {t('nav.services', 'Services & Opportunities')}
                </div>
                <Link to="/manufacturing" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '9px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Factory size={16} color="#0284c7" /> {t('services.contractManufacturing', 'Manufacturing')}
                </Link>
                <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '9px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Handshake size={16} color="#059669" /> {t('services.distributionSupply', 'Business With Us')}
                </Link>
                <Link to="/supplier" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '9px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Shield size={16} color="#d97706" /> {t('services.thirdPartyManufacturing', 'Supplier Registration')}
                </Link>
                <Link to="/career" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '9px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Users size={16} color="#7c3aed" /> {t('nav.career', 'Career With Us')}
                </Link>
                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '9px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Sparkles size={16} color="#ea580c" /> {t('nav.marginSchemes', 'Margin Schemes & Bulletins')}
                </Link>
              </div>

              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', borderTop: '1px solid var(--border-light)' }}>
                <PhoneCall size={17} color="var(--primary-blue)" /> {t('nav.contact', 'Contact & Support')}
              </Link>

              {/* Direct WhatsApp Helpline in Drawer */}
              <a 
                href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20enquire%20about%20wholesale%20supply." 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  marginTop: '4px'
                }}
              >
                <MessageCircle size={16} /> {t('nav.whatsappDesk', 'WhatsApp Wholesale Desk')}
              </a>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-light)' }}>
              <span>© {new Date().getFullYear()} Niyansh Pharma B2B</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

export default Header;

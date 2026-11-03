import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Phone, Mail, ChevronDown, Menu, X, User, LogOut, LogIn, ShieldCheck, FileText, Zap,
  Package, Flame, CreditCard, Factory, Handshake, Users, PhoneCall, Shield,
  ArrowRight, MessageCircle, ExternalLink, Lock, Info, Building2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function Header({ cartCount, onOpenCart, searchTerm, setSearchTerm, user, onLogout, onOpenAuth }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

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
  }, [location.pathname, location.search]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

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

          {/* Search Form */}
          <form className="search-bar" onSubmit={handleSearchSubmit} role="search">
            <input
              type="text"
              placeholder="Search 9,500+ medicines, companies, compositions (e.g. Dolo, Cipla, Paracetamol)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search pharmaceutical products"
            />
            <button type="submit" className="search-button" aria-label="Submit search">
              <Search size={18} aria-hidden="true" />
            </button>
          </form>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-light)', paddingRight: '12px', position: 'relative' }}>
                <Link
                  to="/dashboard"
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '1.5px solid #a7f3d0',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Open Chemist B2B Headquarters"
                >
                  <ShieldCheck size={14} color="#059669" />
                  <span>Chemist Portal</span>
                </Link>

                <div 
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
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
                      {user.companyName ? user.companyName.split(' ')[0] : user.name.split(' ')[0]}
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
                      minWidth: '210px',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase' }}>✓ Verified Chemist</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-dark)' }}>{user.companyName || user.name}</div>
                      </div>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.84rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}
                      >
                        <ShieldCheck size={16} color="#059669" /> Chemist Dashboard
                      </Link>
                      <Link 
                        to="/quick-order" 
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.84rem', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}
                      >
                        <Zap size={16} color="#ea580c" /> Quick Order Matrix
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
                style={{ padding: '7px 16px', borderRadius: '30px', fontWeight: '700', border: '1.5px solid var(--primary-blue)', color: 'var(--primary-blue)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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

      {/* Desktop Navigation Bar - Symmetrically Balanced */}
      <nav className="nav-bar" aria-label="Main Navigation">
        <div className="container nav-bar-content">
          
          {/* Left Core Catalog & Trading Links */}
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
            {user && (
              <li className="nav-item">
                <Link 
                  to="/dashboard" 
                  className={`nav-pill-link ${isActive('/dashboard') || isActive('/portal') ? 'active' : ''}`}
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '1.5px solid #a7f3d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: '800'
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  <span>Chemist Dashboard</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link 
                to="/quick-order" 
                className={`nav-pill-link nav-pill-order ${isActive('/quick-order') || isActive('/order') ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <span>⚡</span> Quick Order
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/news" className={`nav-link ${isActive('/news') || isActive('/schemes') ? 'active' : ''}`} style={{ color: '#ea580c', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>🔥</span> Schemes & News
              </Link>
            </li>
          </ul>

          {/* Right Institutional & Support Links - Fills dead space */}
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
                  marginLeft: '4px',
                  transition: 'all 0.2s ease'
                }}
                title="Direct WhatsApp Wholesale Desk"
              >
                <MessageCircle size={14} /> WhatsApp Desk
              </a>
            </li>
          </ul>

        </div>
      </nav>

      {/* Enhanced Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
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
              zIndex: 9998,
              animation: 'fadeIn 0.2s ease forwards'
            }}
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
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
              boxShadow: '-8px 0 35px rgba(0,0,0,0.22)', 
              animation: 'slideInRight 0.25s ease forwards'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Drawer Header */}
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

            {/* Chemist Mobile Card */}
            {user && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
                  <ShieldCheck size={14} /> Verified B2B Chemist
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#064e3b', margin: '2px 0 8px 0' }}>
                  {user.companyName || user.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ backgroundColor: '#059669', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', textDecoration: 'none' }}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/outstanding"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ backgroundColor: '#ffffff', border: '1px solid #a7f3d0', color: '#047857', padding: '7px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', textDecoration: 'none' }}
                  >
                    My Ledger
                  </Link>
                </div>
              </div>
            )}
            {/* Quick Action Highlights for Retailers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '4px 0 8px' }}>
              <Link 
                to="/quick-order" 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px',
                  backgroundColor: 'rgba(12, 61, 108, 0.08)', borderRadius: '8px',
                  color: 'var(--primary-blue)', fontWeight: '700', fontSize: '0.86rem'
                }}
              >
                <Package size={16} /> Quick Order
              </Link>
              <Link 
                to="/news" 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px',
                  backgroundColor: '#fff7ed', borderRadius: '8px',
                  color: '#ea580c', fontWeight: '700', fontSize: '0.86rem'
                }}
              >
                <Flame size={16} /> Schemes
              </Link>
            </div>

            {/* Mobile Theme Toggle Switch Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Theme Mode</span>
              <ThemeToggle variant="pill" />
            </div>

            {/* Core Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', backgroundColor: location.pathname === '/' ? '#f1f5f9' : 'transparent' }}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: (location.pathname === '/about' || location.pathname === '/about-us') ? '#f1f5f9' : 'transparent' }}
              >
                <Info size={18} /> About Us
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', backgroundColor: location.pathname === '/products' ? '#f1f5f9' : 'transparent' }}
              >
                All Products Catalog
              </Link>
              <Link 
                to="/companies" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: location.pathname.startsWith('/companies') ? '#f1f5f9' : 'transparent' }}
              >
                <Building2 size={18} /> Companies & Manufacturers
              </Link>

              {/* Category sub-links */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0 4px 16px', gap: '6px', borderLeft: '2px solid var(--primary-blue)', margin: '4px 0 8px 10px' }}>
                <Link to="/products?category=Pharma Products" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.88rem', color: 'var(--text-medium)', padding: '5px 0' }}>Pharma Medicines</Link>
                <Link to="/products?category=OTC Products" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.88rem', color: 'var(--text-medium)', padding: '5px 0' }}>OTC Products</Link>
                <Link to="/products?category=Injectables" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.88rem', color: 'var(--text-medium)', padding: '5px 0' }}>Injectables & Critical Care</Link>
                <Link to="/products?category=Surgical %26 Medical Supplies" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.88rem', color: 'var(--text-medium)', padding: '5px 0' }}>Surgical & Medical Supplies</Link>
              </div>

              <Link 
                to="/manufacturing" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Factory size={18} /> Manufacturing & Third-Party
              </Link>
              <Link 
                to="/partner" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Handshake size={18} /> Partner With Us
              </Link>
              <Link 
                to="/supplier" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Shield size={18} /> Supplier Registration
              </Link>
              <Link 
                to="/career" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={18} /> Career With Us
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ padding: '11px 12px', borderRadius: '8px', fontWeight: '600', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <PhoneCall size={18} /> Contact & Support
              </Link>
            </div>

            {/* Direct Instant Contact Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Direct Dispatch Desk
              </span>
              <a 
                href="tel:+919909923130" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: '700', fontSize: '0.92rem' }}
              >
                <Phone size={16} /> +91 99099 23130
              </a>
              <a 
                href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20place%20a%20wholesale%20order." 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-green)', fontWeight: '700', fontSize: '0.92rem' }}
              >
                <MessageCircle size={16} /> WhatsApp Quick Order
              </a>
            </div>

            {/* User Session / Auth / Admin Link */}
            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: '600', fontSize: '0.9rem' }}>
                    <User size={18} />
                    <span>Logged in as <strong>{user.name}</strong></span>
                  </div>
                  <button 
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 15px',
                      backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px',
                      color: 'var(--text-medium)', fontWeight: '600', cursor: 'pointer', width: '100%', minHeight: '44px'
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 15px',
                    backgroundColor: 'var(--primary-blue)', color: '#ffffff', borderRadius: '8px',
                    fontWeight: '700', cursor: 'pointer', border: 'none', width: '100%', minHeight: '44px'
                  }}
                >
                  <LogIn size={16} /> B2B Log In / Register
                </button>
              )}

              {/* Admin Console Shortcut */}
              <Link 
                to="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  fontSize: '0.8rem', color: 'var(--text-light)', padding: '8px', borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)', border: '1px dashed var(--border-light)', textDecoration: 'none'
                }}
              >
                <Lock size={13} /> Admin Console
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;

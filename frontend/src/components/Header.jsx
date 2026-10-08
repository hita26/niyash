import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Phone, Mail, ChevronDown, Menu, X, User, LogOut, LogIn } from 'lucide-react';

function Header({ cartCount, onOpenCart, searchTerm, setSearchTerm, user, onLogout, onOpenAuth }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header style={{ width: '100%' }}>
      {/* Top Contact Strip */}
      <div className="top-strip">
        <div className="container top-strip-content">
          <div className="top-contacts">
            <span className="top-contact-item">
              <Phone size={14} /> 
              <a href="tel:+919909923130">+91 99099 23130</a>
            </span>
            <span className="top-contact-item">
              <Mail size={14} /> 
              <a href="mailto:NiyanshPharma@gmail.com">NiyanshPharma@gmail.com</a>
            </span>
          </div>
          <div className="top-links">
            <span>Rajkot, Gujarat</span>
            <span>Wholesale Distributor</span>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="main-header">
        <div className="container main-header-content">
          <Link to="/" className="logo-container">
            <img 
              src="/logo.jpg" 
              alt="Niyansh Pharma" 
              style={{ height: '65px', width: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </Link>

          {/* Search Form */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for medicines, brands, formulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

            {/* Header Action Buttons */}
          <div className="header-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid var(--border-light)', paddingRight: '12px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-blue)' }}>
                  <User size={16} />
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button 
                  onClick={onLogout} 
                  title="Log Out"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-medium)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn btn-outline btn-sm"
                style={{ padding: '7px 16px', borderRadius: '30px', fontWeight: '700', border: '1.5px solid var(--primary-blue)', color: 'var(--primary-blue)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <LogIn size={14} /> <span>Log In</span>
              </button>
            )}

            <button 
              className="cart-icon-btn" 
              onClick={onOpenCart} 
              aria-label="Open Enquiry Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="container nav-bar-content">
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={`nav-link ${isActive('/products')}`}>All Products</Link>
            </li>
            <li 
              className="nav-item"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="nav-link" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Categories <ChevronDown size={14} />
              </span>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} style={{ display: isDropdownOpen ? 'block' : 'none' }}>
                <li><Link to="/products?category=Pharma Products" className="dropdown-link">Pharma Medicines</Link></li>
                <li><Link to="/products?category=OTC Products" className="dropdown-link">OTC Products</Link></li>
                <li><Link to="/products?category=Injectables" className="dropdown-link">Injectables</Link></li>
                <li><Link to="/products?category=Surgical %26 Medical Supplies" className="dropdown-link">Surgical & Medical Supplies</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link 
                to="/quick-order" 
                className={`nav-pill-link nav-pill-order ${isActive('/quick-order') || isActive('/order') ? 'active' : ''}`}
              >
                Quick Order
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/news" className={`nav-link ${isActive('/news') || isActive('/schemes') ? 'active' : ''}`} style={{ color: '#ea580c', fontWeight: '700', display: 'inline-flex', alignItems: 'center' }}>
                Schemes & News
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ledger" className={`nav-link ${isActive('/ledger') || isActive('/outstanding') ? 'active' : ''}`} style={{ color: 'var(--primary-blue)', fontWeight: '700', display: 'inline-flex', alignItems: 'center' }}>
                Outstanding Ledger
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/manufacturing" className={`nav-link ${isActive('/manufacturing') ? 'active' : ''}`}>Manufacturing</Link>
            </li>
            <li className="nav-item">
              <Link to="/partner" className={`nav-link ${isActive('/partner') ? 'active' : ''}`}>Partner With Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/supplier" className={`nav-link ${isActive('/supplier') ? 'active' : ''}`}>Supplier</Link>
            </li>
            <li className="nav-item">
              <Link to="/career" className={`nav-link ${isActive('/career') ? 'active' : ''}`}>Career With Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
            </li>
          </ul>

          <div className="nav-tagline" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--secondary-green)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary-green)', display: 'inline-block' }}></span>
            Care • Quality • Trust
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0,
          bottom: 0,
          width: '100%', 
          height: '100vh',
          backgroundColor: '#ffffff', 
          zIndex: 1000, 
          overflowY: 'auto', 
          padding: '24px 20px 40px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)', 
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontWeight: '800', color: 'var(--primary-blue)', fontSize: '1.15rem' }}>Navigation Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>All Products</Link>
          
          <div style={{ display: 'flex', flexDirection: 'column', padding: '5px 0 5px 15px', gap: '10px', borderLeft: '2px solid var(--primary-blue)' }}>
            <Link to="/products?category=Pharma Products" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>Pharma Medicines</Link>
            <Link to="/products?category=OTC Products" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>OTC Products</Link>
            <Link to="/products?category=Injectables" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>Injectables</Link>
            <Link to="/products?category=Surgical %26 Medical Supplies" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>Surgical & Medical Supplies</Link>
          </div>

          <Link to="/quick-order" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '800', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}>Quick Order</Link>
          <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '700', color: '#ea580c' }}>Schemes & News</Link>
          <Link to="/ledger" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '700', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}>Outstanding Ledger</Link>
          <Link to="/manufacturing" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>Manufacturing</Link>
          <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>Partner With Us</Link>
          <Link to="/supplier" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>Supplier Registration</Link>
          <Link to="/career" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>Career With Us</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontWeight: '600' }}>Contact Us</Link>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: '600' }}>
                <User size={18} />
                <span>Logged in: {user.name}</span>
              </div>
              <button 
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 15px',
                  backgroundColor: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '6px',
                  color: 'var(--text-medium)', fontWeight: '600', cursor: 'pointer', textAlign: 'left', width: '100%'
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 15px',
                backgroundColor: 'var(--primary-blue)', color: '#ffffff', borderRadius: '6px',
                fontWeight: '700', cursor: 'pointer', border: 'none', marginTop: '15px', width: '100%', justifyContent: 'center'
              }}
            >
              <LogIn size={16} /> B2B Log In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Building2, ShieldCheck, FileText, Menu, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function MobileBottomNav({ cartCount = 0, onOpenCart, isB2BPortal, isMenuOpen = false, onOpenMenu }) {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  // Hide navigation on Admin panel
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isB2B = typeof isB2BPortal === 'boolean' 
    ? isB2BPortal 
    : (location.pathname.startsWith('/dashboard') || 
       location.pathname.startsWith('/portal') || 
       location.pathname.startsWith('/quick-order') || 
       location.pathname.startsWith('/outstanding') || 
       location.pathname.startsWith('/ledger'));

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleTabClick = () => {
    if (typeof window !== 'undefined' && window.triggerHaptic) {
      window.triggerHaptic('selection');
    }
  };

  const companiesLabel = language === 'gu' ? 'કંપનીઓ' : language === 'hi' ? 'कंपनियां' : 'Companies';
  const menuLabel = language === 'gu' ? 'મેનુ' : language === 'hi' ? 'मेनू' : 'Menu';

  return (
    <nav 
      className="mobile-bottom-nav" 
      aria-label="Mobile Bottom Quick Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(58px + env(safe-area-inset-bottom, 8px))',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        backgroundColor: 'var(--bg-card, #ffffff)',
        borderTop: '1px solid var(--border-light, #e2e8f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 9990,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        paddingLeft: 'max(4px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(4px, env(safe-area-inset-right, 0px))',
        boxSizing: 'border-box'
      }}
    >
      {/* B2B Mode Navigation Tabs */}
      {isB2B ? (
        <>
          {/* 1. Dashboard */}
          <Link 
            to="/dashboard" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/dashboard') || isActive('/portal') ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/dashboard') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <LayoutDashboard size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {t('nav.dashboard', 'Dashboard')}
            </span>
          </Link>

          {/* 2. Medicines Catalog */}
          <Link 
            to="/products" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/products') ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/products') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <Package size={20} strokeWidth={isActive('/products') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {t('nav.products', 'Medicines')}
            </span>
          </Link>

          {/* 3. Companies Directory */}
          <Link 
            to="/companies" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/companies') ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/companies') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <Building2 size={20} strokeWidth={isActive('/companies') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {companiesLabel}
            </span>
          </Link>

          {/* 4. Ledger */}
          <Link 
            to="/outstanding" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/outstanding') || isActive('/ledger') ? '#2563eb' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/outstanding') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <FileText size={20} strokeWidth={isActive('/outstanding') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {t('nav.ledger', 'Ledger')}
            </span>
          </Link>

          {/* 5. Menu Drawer */}
          <button 
            type="button"
            onClick={() => { handleTabClick(); onOpenMenu?.(); }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isMenuOpen ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isMenuOpen ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 2px',
              position: 'relative'
            }}
            aria-label="Open App Navigation Menu"
          >
            <div style={{ position: 'relative' }}>
              <Menu size={20} strokeWidth={isMenuOpen ? 2.5 : 2} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-7px',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '15px',
                    height: '15px',
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {menuLabel}
            </span>
          </button>
        </>
      ) : (
        <>
          {/* Public Mode Navigation Tabs */}
          {/* 1. Home */}
          <Link 
            to="/" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/') ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {t('nav.home', 'Home')}
            </span>
          </Link>

          {/* 2. Medicines Catalog */}
          <Link 
            to="/products" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/products') ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/products') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <Package size={20} strokeWidth={isActive('/products') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {t('nav.products', 'Medicines')}
            </span>
          </Link>

          {/* 3. Chemist B2B Portal Access */}
          <Link 
            to="/dashboard" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: '#059669',
              fontWeight: '800',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <ShieldCheck size={20} strokeWidth={2.5} color="#059669" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {t('nav.dashboard', 'B2B Portal')}
            </span>
          </Link>

          {/* 4. Companies Directory (replaces Quick Order) */}
          <Link 
            to="/companies" 
            onClick={handleTabClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isActive('/companies') ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isActive('/companies') ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              textDecoration: 'none',
              padding: '4px 2px',
              transition: 'color 0.15s ease'
            }}
          >
            <Building2 size={20} strokeWidth={isActive('/companies') ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {companiesLabel}
            </span>
          </Link>

          {/* 5. Menu Drawer (replaces Cart) */}
          <button 
            type="button"
            onClick={() => { handleTabClick(); onOpenMenu?.(); }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              minWidth: 0,
              color: isMenuOpen ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-medium, #64748b)',
              fontWeight: isMenuOpen ? '800' : '600',
              fontSize: 'clamp(0.68rem, 2.2vw, 0.74rem)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 2px',
              position: 'relative'
            }}
            aria-label="Open App Navigation Menu"
          >
            <div style={{ position: 'relative' }}>
              <Menu size={20} strokeWidth={isMenuOpen ? 2.5 : 2} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-7px',
                    backgroundColor: 'var(--primary-blue, #0c3d6c)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '15px',
                    height: '15px',
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {menuLabel}
            </span>
          </button>
        </>
      )}
    </nav>
  );
}

export default MobileBottomNav;

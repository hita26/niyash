import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Building2, Zap, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function MobileBottomNav({ cartCount, onOpenCart }) {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav 
      className="mobile-bottom-nav" 
      aria-label="Mobile Bottom Quick Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 9990,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        padding: '0 8px',
      }}
    >
      {/* Home */}
      <Link 
        to="/" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          color: isActive('/') ? 'var(--primary-blue)' : '#64748b',
          fontWeight: isActive('/') ? '700' : '500',
          fontSize: '0.72rem',
          textDecoration: 'none',
          padding: '4px 0',
        }}
      >
        <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
        <span>Home</span>
      </Link>

      {/* Medicines / All Products */}
      <Link 
        to="/products" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          color: isActive('/products') ? 'var(--primary-blue)' : '#64748b',
          fontWeight: isActive('/products') ? '700' : '500',
          fontSize: '0.72rem',
          textDecoration: 'none',
          padding: '4px 0',
        }}
      >
        <Package size={20} strokeWidth={isActive('/products') ? 2.5 : 2} />
        <span>Medicines</span>
      </Link>

      {/* B2B Dashboard (When logged in) OR Companies Directory */}
      {isLoggedIn || user ? (
        <Link 
          to="/dashboard" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            flex: 1,
            color: isActive('/dashboard') ? '#059669' : '#047857',
            fontWeight: isActive('/dashboard') ? '800' : '600',
            fontSize: '0.72rem',
            textDecoration: 'none',
            padding: '4px 0',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative' }}>
            <ShieldCheck size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} color={isActive('/dashboard') ? '#059669' : '#047857'} />
            <span style={{ position: 'absolute', top: '-2px', right: '-4px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          </div>
          <span>B2B Portal</span>
        </Link>
      ) : (
        <Link 
          to="/companies" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            flex: 1,
            color: isActive('/companies') ? 'var(--primary-blue)' : '#64748b',
            fontWeight: isActive('/companies') ? '700' : '500',
            fontSize: '0.72rem',
            textDecoration: 'none',
            padding: '4px 0',
            position: 'relative',
          }}
        >
          <Building2 size={20} strokeWidth={isActive('/companies') ? 2.5 : 2} />
          <span>Companies</span>
        </Link>
      )}

      {/* Quick Order */}
      <Link 
        to="/quick-order" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          color: isActive('/quick-order') ? '#ea580c' : '#64748b',
          fontWeight: isActive('/quick-order') ? '800' : '500',
          fontSize: '0.72rem',
          textDecoration: 'none',
          padding: '4px 0',
        }}
      >
        <Zap size={20} color={isActive('/quick-order') ? '#ea580c' : '#64748b'} strokeWidth={2.5} />
        <span>Quick Order</span>
      </Link>

      {/* Quote Cart */}
      <button 
        onClick={onOpenCart} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          flex: 1,
          color: cartCount > 0 ? 'var(--primary-blue)' : '#64748b',
          fontWeight: cartCount > 0 ? '700' : '500',
          fontSize: '0.72rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          position: 'relative',
        }}
        aria-label={`Open Cart with ${cartCount} items`}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} strokeWidth={2} />
          {cartCount > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                backgroundColor: 'var(--primary-blue)',
                color: '#ffffff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
}

export default MobileBottomNav;

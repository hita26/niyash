import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Building2, Zap, ShoppingBag } from 'lucide-react';

function MobileBottomNav({ cartCount, onOpenCart }) {
  const location = useLocation();

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

      {/* 252+ Companies */}
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
          <ShoppingBag size={20} strokeWidth={cartCount > 0 ? 2.5 : 2} />
          {cartCount > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                backgroundColor: 'var(--secondary-green)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: '800',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                border: '1.5px solid #ffffff'
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

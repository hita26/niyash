import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryCartModal from './components/EnquiryCartModal';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import OurProducts from './pages/OurProducts';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Career from './pages/Career';
import Partner from './pages/Partner';
import Supplier from './pages/Supplier';
import Manufacturing from './pages/Manufacturing';
import NewsFeed from './pages/NewsFeed';
import QuickOrder from './pages/QuickOrder';
import OutstandingLedger from './pages/OutstandingLedger';
import RetailerDashboard from './pages/RetailerDashboard';
import CompanyDirectory from './pages/CompanyDirectory';
import CompanyDetail from './pages/CompanyDetail';

// Code-split heavy administrative portal to keep initial public bundles ultra-fast
const Admin = React.lazy(() => import('./pages/Admin'));
import ScrollToTop from './components/ScrollToTop';
import MobileBottomNav from './components/MobileBottomNav';
import AIAssistant from './components/AIAssistant';
import FloatingOrderWidget from './components/FloatingOrderWidget';
import InstallAppBanner from './components/InstallAppBanner';
import SecurityVerification from './components/SecurityVerification';
import SecurityCheck from './pages/SecurityCheck';
import ErrorBoundary from './components/ErrorBoundary';

// Security Auth Guard: blocks unauthenticated access and forces login if user presses Back after logout
function ProtectedRoute({ children }) {
  const { isLoggedIn, user, openAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn && !user) {
      openAuth();
    }
  }, [isLoggedIn, user, openAuth]);

  if (!isLoggedIn && !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

function AppContent() {
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState(null);
  const [pendingCartProduct, setPendingCartProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Auth state from centralized context
  const { user, token, login, logout, isAuthOpen, openAuth, closeAuth } = useAuth();

  // Cloudflare-Style Bot Security Verification Gate State (Non-blocking for legitimate public visitors)
  const [isSecurityCleared, setIsSecurityCleared] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (localStorage.getItem('niyansh_bypass_security') === 'true') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.has('verify') || params.has('test-security')) return false;
    return true;
  });

  // Detect whether app is opened in PWA Standalone Mode (Installed App on Home Screen)
  // Public website uses top header with hamburger menu; bottom navigation is exclusive to installed PWA
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => setIsStandalone(e.matches || window.navigator.standalone === true);
    try {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (_) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isStandalone) {
      document.body.classList.add('standalone-pwa');
    } else {
      document.body.classList.remove('standalone-pwa');
    }
  }, [isStandalone]);

  // Detect whether current view is within the B2B Chemist Workstation
  const isB2BPortal = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/portal') || 
                      location.pathname.startsWith('/retailer-dashboard') ||
                      location.pathname.startsWith('/quick-order') || 
                      location.pathname.startsWith('/order') || 
                      location.pathname.startsWith('/outstanding') || 
                      location.pathname.startsWith('/ledger');

  // Security guard for back-forward cache (bfcache) and browser history navigation
  useEffect(() => {
    const handleNavigationSecurity = () => {
      const savedUser = localStorage.getItem('niyansh_user');
      const isProtected = ['/dashboard', '/portal', '/retailer-dashboard', '/quick-order', '/order', '/outstanding', '/ledger']
        .some(path => location.pathname.startsWith(path));

      if (!savedUser && isProtected) {
        openAuth();
      }
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        handleNavigationSecurity();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handleNavigationSecurity);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handleNavigationSecurity);
    };
  }, [location.pathname, openAuth]);

  // Real-time Public Visitor Tracking (Non-blocking telemetry)
  useEffect(() => {
    // Exclude internal admin panel visits from public analytics
    if (location.pathname.startsWith('/admin')) return;

    try {
      let sid = sessionStorage.getItem('niyansh_visitor_sid');
      if (!sid) {
        sid = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('niyansh_visitor_sid', sid);
      }

      const payload = {
        path: location.pathname,
        pageTitle: document.title || 'Niyansh Pharma',
        referrer: document.referrer || 'Direct',
        sessionId: sid
      };

      // Non-blocking fetch with keepalive
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    } catch (e) {
      // Ignore background telemetry errors
    }
  }, [location.pathname]);

  // Load cart from localStorage (strictly for authenticated chemists only)
  useEffect(() => {
    if (!user) {
      setEnquiryCart([]);
      return;
    }
    const savedCart = localStorage.getItem('niyansh_enquiry_cart');
    if (savedCart) {
      try {
        setEnquiryCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from local storage', e);
      }
    }
  }, [user]);

  // Listen for Quick Order Pad cart updates so Header cart & EnquiryCartModal stay unified
  useEffect(() => {
    const handleQuickOrderSync = (e) => {
      if (!user) return;
      const nextCart = e?.detail;
      if (Array.isArray(nextCart)) {
        setEnquiryCart(nextCart);
      }
    };
    window.addEventListener('niyansh:quickorder-cart-sync', handleQuickOrderSync);
    return () => window.removeEventListener('niyansh:quickorder-cart-sync', handleQuickOrderSync);
  }, [user]);

  // Save cart to localStorage and notify ProductCards & QuickOrder whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('niyansh_enquiry_cart', JSON.stringify(enquiryCart));
    } else {
      localStorage.removeItem('niyansh_enquiry_cart');
    }
    window.dispatchEvent(new CustomEvent('niyansh:cart-updated', { detail: enquiryCart }));
  }, [enquiryCart, user]);

  // Global Uppercase Form Input Enforcer (All forms except Login credentials & passwords)
  useEffect(() => {
    const handleGlobalInput = (e) => {
      const target = e.target;
      if (!target) return;

      const isInput = target.tagName === 'INPUT';
      const isTextarea = target.tagName === 'TEXTAREA';
      if (!isInput && !isTextarea) return;

      // EXCLUSIONS:
      // 1. Never uppercase passwords or hidden inputs
      if (target.type === 'password' || target.type === 'hidden') return;
      // 2. Email inputs (emails remain natural lowercase)
      if (target.type === 'email') return;
      // 3. Technical and selection input types
      if (['file', 'checkbox', 'radio', 'number', 'date', 'time', 'datetime-local', 'month', 'range', 'color'].includes(target.type)) return;
      // 4. Inputs explicitly marked to skip uppercase
      if (target.dataset.noUppercase === 'true' || target.classList.contains('no-uppercase') || target.classList.contains('login-input')) return;

      // 5. Exclude Login Forms (Chemist Login, Admin Login, Forgot Password)
      const form = target.closest('form');
      if (form) {
        if (
          form.classList.contains('login-form') ||
          form.dataset.authMode === 'login' ||
          form.id?.toLowerCase().includes('login') ||
          form.getAttribute('name')?.toLowerCase().includes('login')
        ) {
          return;
        }
      }
      if (target.closest('.login-modal') || target.closest('[data-auth-mode="login"]')) {
        return;
      }

      // 6. Only perform uppercase transformation for pharma codes explicitly marked (e.g. GSTIN, SKU, DL, PAN)
      const requiresUppercase = target.dataset.uppercase === 'true' || 
                                target.classList.contains('uppercase-input') || 
                                ['sku', 'gstin', 'pan', 'dlno'].some(k => target.name?.toLowerCase().includes(k) || target.id?.toLowerCase().includes(k));
      if (!requiresUppercase) return;

      const original = target.value;
      if (typeof original !== 'string') return;
      const upper = original.toUpperCase();

      if (original !== upper) {
        const start = target.selectionStart;
        const end = target.selectionEnd;

        // Use prototype setter to notify React's internal value tracker
        const prototype = isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (nativeSetter) {
          nativeSetter.call(target, upper);
        } else {
          target.value = upper;
        }

        if (typeof start === 'number' && typeof end === 'number') {
          try {
            target.setSelectionRange(start, end);
          } catch (_) {}
        }

        // Notify React of the synthetic input event
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    window.addEventListener('input', handleGlobalInput, true);
    return () => window.removeEventListener('input', handleGlobalInput, true);
  }, []);

  const showCartAddedToast = (productName) => {
    setCartToast({ name: productName, id: Date.now() });
    setTimeout(() => {
      setCartToast((prev) => (prev && Date.now() - prev.id >= 2900 ? null : prev));
    }, 3200);
  };

  const syncQuickOrderItem = (productId, nextQty) => {
    try {
      const saved = JSON.parse(localStorage.getItem('niyansh_quickorder_cart') || '{}');
      const map = (saved && typeof saved === 'object' && !Array.isArray(saved)) ? { ...saved } : {};
      if (nextQty <= 0) {
        delete map[productId];
      } else {
        map[productId] = nextQty;
      }
      localStorage.setItem('niyansh_quickorder_cart', JSON.stringify(map));
      window.dispatchEvent(new CustomEvent('niyansh:quickorder-updated', { detail: map }));
    } catch (_) {}
  };

  const addToCart = (product, quantity = 1) => {
    // Only authenticated verified chemists can add products to wholesale inquiry cart
    if (!user) {
      setPendingCartProduct({ product, quantity });
      openAuth();
      return false;
    }

    setEnquiryCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      if (existingItem) {
        const nextQty = existingItem.quantity + quantity;
        syncQuickOrderItem(product._id, nextQty);
        if (nextQty <= 0) {
          return prevCart.filter((item) => item.product._id !== product._id);
        }
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: nextQty }
            : item
        );
      }
      if (quantity <= 0) return prevCart;
      syncQuickOrderItem(product._id, quantity);
      return [...prevCart, { product, quantity }];
    });

    if (quantity > 0) {
      showCartAddedToast(product.name);
    }
    return true;
  };

  const handleAuthSuccess = (userData) => {
    login(userData);
    if (pendingCartProduct) {
      const { product, quantity } = pendingCartProduct;
      setEnquiryCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product._id === product._id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { product, quantity }];
      });
      setIsCartOpen(true);
      setPendingCartProduct(null);
    }
  };

  const handleLogout = () => {
    logout();
    setEnquiryCart([]);
    localStorage.removeItem('niyansh_enquiry_cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    syncQuickOrderItem(productId, quantity);
    setEnquiryCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    syncQuickOrderItem(productId, 0);
    setEnquiryCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    try {
      localStorage.setItem('niyansh_quickorder_cart', JSON.stringify({}));
      window.dispatchEvent(new CustomEvent('niyansh:quickorder-updated', { detail: {} }));
    } catch (_) {}
    setEnquiryCart([]);
  };

  return (
    <>
      {/* Cloudflare Bot Security Challenge Gate */}
      {!isSecurityCleared && location.pathname !== '/security-check' && (
        <SecurityVerification 
          onVerified={() => setIsSecurityCleared(true)} 
        />
      )}
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Header 
          cartCount={enquiryCart.reduce((total, item) => total + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
          onLogout={handleLogout}
          onOpenAuth={openAuth}
          isB2BPortal={isB2BPortal}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
            <Route 
              path="/our-products" 
              element={
                <OurProducts 
                  addToCart={addToCart} 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                />
              } 
            />
            <Route 
              path="/products" 
              element={
                <Products 
                  addToCart={addToCart} 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                />
              } 
            />
            <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/companies" element={<CompanyDirectory />} />
            <Route path="/companies/:id" element={<CompanyDetail addToCart={addToCart} />} />
            <Route path="/manufacturers" element={<Navigate to="/companies" replace />} />
            <Route path="/brands" element={<Navigate to="/companies" replace />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/schemes" element={<NewsFeed />} />
            <Route path="/dashboard" element={<ProtectedRoute><RetailerDashboard /></ProtectedRoute>} />
            <Route path="/portal" element={<ProtectedRoute><RetailerDashboard /></ProtectedRoute>} />
            <Route path="/retailer-dashboard" element={<ProtectedRoute><RetailerDashboard /></ProtectedRoute>} />
            <Route path="/quick-order" element={<ProtectedRoute><QuickOrder /></ProtectedRoute>} />
            <Route path="/order" element={<ProtectedRoute><QuickOrder /></ProtectedRoute>} />
            <Route path="/ledger" element={<ProtectedRoute><OutstandingLedger /></ProtectedRoute>} />
            <Route path="/outstanding" element={<ProtectedRoute><OutstandingLedger /></ProtectedRoute>} />
            <Route path="/outstanding-ledger" element={<ProtectedRoute><OutstandingLedger /></ProtectedRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/manufacturing" element={<Manufacturing />} />
            <Route path="/services" element={<Navigate to="/manufacturing" replace />} />
            <Route path="/catalog" element={<Navigate to="/products" replace />} />
            <Route 
              path="/admin/*" 
              element={
                <React.Suspense fallback={
                  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner" />
                  </div>
                }>
                  <Admin />
                </React.Suspense>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <React.Suspense fallback={
                  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner" />
                  </div>
                }>
                  <Admin />
                </React.Suspense>
              } 
            />
            <Route path="/security-check" element={<SecurityCheck />} />
            {/* Catch-all route to safely redirect any undefined route back to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer compact={isB2BPortal} />

        {/* Mobile Bottom Navigation: Strictly rendered for installed PWA standalone mode only */}
        {isStandalone && (
          <MobileBottomNav 
            cartCount={enquiryCart.reduce((total, item) => total + item.quantity, 0)} 
            onOpenCart={() => setIsCartOpen(true)} 
            isB2BPortal={isB2BPortal}
            isMenuOpen={isMobileMenuOpen}
            onOpenMenu={() => setIsMobileMenuOpen(prev => !prev)}
          />
        )}

        <InstallAppBanner />

        <EnquiryCartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={enquiryCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          user={user}
          token={token}
          onOpenAuth={openAuth}
        />

        {/* Non-blocking Smart Cart Added Toast */}
        {cartToast && !isCartOpen && (
          <div
            className="smart-cart-toast"
            style={{
              position: 'fixed',
              top: '76px',
              right: '16px',
              left: 'auto',
              maxWidth: 'calc(100vw - 32px)',
              zIndex: 9992,
              backgroundColor: '#0c3d6c',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '10px 14px',
              boxShadow: '0 10px 28px rgba(12, 61, 108, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(255,255,255,0.18)',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: '800', textTransform: 'uppercase' }}>
                ✓ Added to Cart
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cartToast.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setCartToast(null);
                setIsCartOpen(true);
              }}
              style={{
                backgroundColor: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              View Cart ({enquiryCart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>
        )}

        <AuthModal 
          isOpen={isAuthOpen}
          onClose={closeAuth}
          onSuccess={handleAuthSuccess}
        />
        {!isMobileMenuOpen && !location.pathname.startsWith('/admin') && (
          <>
            <FloatingOrderWidget />
            <AIAssistant addToCart={addToCart} />
          </>
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;

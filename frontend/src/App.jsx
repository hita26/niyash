import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryCartModal from './components/EnquiryCartModal';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';

// Code-split dynamic imports for secondary routes to optimize bundle size and page load speed
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const OurProducts = lazy(() => import('./pages/OurProducts'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Career = lazy(() => import('./pages/Career'));
const Partner = lazy(() => import('./pages/Partner'));
const Supplier = lazy(() => import('./pages/Supplier'));
const Manufacturing = lazy(() => import('./pages/Manufacturing'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const QuickOrder = lazy(() => import('./pages/QuickOrder'));
const OutstandingLedger = lazy(() => import('./pages/OutstandingLedger'));
const RetailerDashboard = lazy(() => import('./pages/RetailerDashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const CompanyDirectory = lazy(() => import('./pages/CompanyDirectory'));
const CompanyDetail = lazy(() => import('./pages/CompanyDetail'));
const SecurityCheck = lazy(() => import('./pages/SecurityCheck'));
import ScrollToTop from './components/ScrollToTop';
import MobileBottomNav from './components/MobileBottomNav';
import AIAssistant from './components/AIAssistant';
import FloatingOrderWidget from './components/FloatingOrderWidget';
import InstallAppBanner from './components/InstallAppBanner';
import BioNanoProgressBar from './components/BioNanoProgressBar';
import SecurityVerification from './components/SecurityVerification';

// Fast, elegant page loading fallback for code-split chunks
function PageLoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#059669', borderRadius: '50%', animation: 'npSpin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Loading Niyansh Pharma...</p>
      <style>{`@keyframes npSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Auth state from centralized context
  const { user, token, login, logout, isAuthOpen, openAuth, closeAuth } = useAuth();

  // Bot Security Verification Gate: instant access for legitimate users; triggered only on explicit verify query
  const [isSecurityCleared, setIsSecurityCleared] = useState(() => {
    if (typeof window === 'undefined') return true;
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('niyansh_enquiry_cart');
    if (savedCart) {
      try {
        setEnquiryCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from local storage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('niyansh_enquiry_cart', JSON.stringify(enquiryCart));
  }, [enquiryCart]);

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

      // 6. Perform Uppercase Transformation for data entry
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

  const addToCart = (product, quantity = 1) => {
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
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setEnquiryCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setEnquiryCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
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
      <BioNanoProgressBar />
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Header 
          cartCount={enquiryCart.reduce((total, item) => total + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
          onLogout={logout}
          onOpenAuth={openAuth}
          isB2BPortal={isB2BPortal}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main style={{ flex: 1 }}>
          <Suspense fallback={<PageLoadingFallback />}>
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
              <Route path="/admin" element={<Admin />} />
              <Route path="/security-check" element={<SecurityCheck />} />
            </Routes>
          </Suspense>
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

        <AuthModal 
          isOpen={isAuthOpen}
          onClose={closeAuth}
          onSuccess={login}
        />
        {!isMobileMenuOpen && (
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
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;

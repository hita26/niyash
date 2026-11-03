import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryCartModal from './components/EnquiryCartModal';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
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
import Admin from './pages/Admin';
import CompanyDirectory from './pages/CompanyDirectory';
import CompanyDetail from './pages/CompanyDetail';
import NewsTicker from './components/NewsTicker';
import ScrollToTop from './components/ScrollToTop';
import MobileBottomNav from './components/MobileBottomNav';

function AppContent() {
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  
  // Auth state from centralized context
  const { user, token, login, logout, isAuthOpen, openAuth, closeAuth } = useAuth();

  // Detect whether current view is within the B2B Chemist Workstation
  const isB2BPortal = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/portal') || 
                      location.pathname.startsWith('/retailer-dashboard') ||
                      location.pathname.startsWith('/quick-order') || 
                      location.pathname.startsWith('/order') || 
                      location.pathname.startsWith('/outstanding') || 
                      location.pathname.startsWith('/ledger');

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
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          cartCount={enquiryCart.reduce((total, item) => total + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
          onLogout={logout}
          onOpenAuth={openAuth}
          isB2BPortal={isB2BPortal}
        />

        {/* Clean layout: Hide public consumer marquee ticker on B2B Workstation pages */}
        {!isB2BPortal && <NewsTicker />}
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
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
            <Route path="/dashboard" element={<RetailerDashboard />} />
            <Route path="/portal" element={<RetailerDashboard />} />
            <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
            <Route path="/quick-order" element={<QuickOrder />} />
            <Route path="/order" element={<QuickOrder />} />
            <Route path="/ledger" element={<OutstandingLedger />} />
            <Route path="/outstanding" element={<OutstandingLedger />} />
            <Route path="/outstanding-ledger" element={<OutstandingLedger />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/manufacturing" element={<Manufacturing />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer compact={isB2BPortal} />

        <MobileBottomNav 
          cartCount={enquiryCart.reduce((total, item) => total + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)} 
          isB2BPortal={isB2BPortal}
        />

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
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

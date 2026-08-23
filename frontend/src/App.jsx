import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryCartModal from './components/EnquiryCartModal';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
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
import Admin from './pages/Admin';
import NewsTicker from './components/NewsTicker';

function App() {
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('niyansh_user');
    const savedToken = localStorage.getItem('niyansh_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error('Error parsing saved session', e);
      }
    }
  }, []);

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

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('niyansh_user', JSON.stringify(userData));
    localStorage.setItem('niyansh_token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('niyansh_user');
    localStorage.removeItem('niyansh_token');
  };

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
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          cartCount={enquiryCart.reduce((total, item) => total + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <NewsTicker />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
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
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/schemes" element={<NewsFeed />} />
            <Route path="/quick-order" element={<QuickOrder />} />
            <Route path="/order" element={<QuickOrder />} />
            <Route path="/ledger" element={<OutstandingLedger user={user} />} />
            <Route path="/outstanding" element={<OutstandingLedger user={user} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/manufacturing" element={<Manufacturing />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />

        <EnquiryCartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={enquiryCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          user={user}
          token={token}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        <AuthModal 
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;

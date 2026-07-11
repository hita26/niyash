import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryCartModal from './components/EnquiryCartModal';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Career from './pages/Career';
import Partner from './pages/Partner';
import Supplier from './pages/Supplier';
import Manufacturing from './pages/Manufacturing';
import Admin from './pages/Admin';

function App() {
  const [enquiryCart, setEnquiryCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    // Auto open cart drawer to show items added
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setEnquiryCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setEnquiryCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
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
        />
        
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
        />
      </div>
    </Router>
  );
}

export default App;

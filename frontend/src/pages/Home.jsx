import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Percent, Headset, Globe, ShoppingCart, MessageSquare, PhoneCall, Mail, Search, ArrowRight, Award } from 'lucide-react';

function Home({ addToCart }) {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/products');
    }
  };
  // Let's create static arrays of categories and top brands for rendering on home
  const categories = [
    {
      name: 'Pharma Products',
      title: 'Pharma Medicines',
      desc: 'Tablets, Capsules, Syrups, Ointments & more.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      link: '/products?category=Pharma Products'
    },
    {
      name: 'OTC Products',
      title: 'OTC Products',
      desc: 'Over-the-counter medicines & wellness supplies.',
      image: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf4?auto=format&fit=crop&w=400&q=80',
      link: '/products?category=OTC Products'
    },
    {
      name: 'Injectables',
      title: 'Injectables',
      desc: 'Critical care vials, ampoules, and IV infusions.',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
      link: '/products?category=Injectables'
    },
    {
      name: 'Surgical & Medical Supplies',
      title: 'Surgical & Medical',
      desc: 'Gloves, syringes, needles, dressings & consumables.',
      image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80',
      link: '/products?category=Surgical %26 Medical Supplies'
    }
  ];

  const features = [
    {
      icon: <ShieldCheck size={36} color="var(--primary-blue)" />,
      title: 'Genuine & Quality Assured',
      desc: '100% genuine products sourced directly from reputed pharmaceutical companies.'
    },
    {
      icon: <Globe size={36} color="var(--primary-blue)" />,
      title: 'Wide Product Availability',
      desc: 'Extensive inventory matching healthcare requirements, ready to ship.'
    },
    {
      icon: <Percent size={36} color="var(--primary-blue)" />,
      title: 'Competitive Wholesale Rates',
      desc: 'Best profit margins and wholesale pricing structures for medical stores.'
    },
    {
      icon: <Truck size={36} color="var(--primary-blue)" />,
      title: 'Fast & Reliable Delivery',
      desc: 'Timely and safe delivery mapping medical stores, clinics, and hospitals.'
    },
    {
      icon: <Headset size={36} color="var(--primary-blue)" />,
      title: 'Professional Support',
      desc: 'Our dedicated customer care team resolves order queries promptly.'
    },
    {
      icon: <ShieldCheck size={36} color="var(--primary-blue)" />, // Use appropriate icon
      title: 'Strong Network',
      desc: 'Extensive distribution reach covering Rajkot, Gujarat, and surrounding regions.'
    }
  ];

  const brands = [
    'Cipla', 'Abbott', 'Sun Pharma', 'Intas', 'Alkem', 'Zydus', 
    'Leeford Healthcare', 'Troikaa Pharmaceuticals', 'Biochem', 
    'Namcare Pharma', 'Healing Pharma', 'Steris Pharma', 'Dr. Morepen'
  ];

  const handleQuickWhatsApp = () => {
    const msg = "Hello Niyansh Pharma, I would like to place a quick wholesale order. Please guide me.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">
      
      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(12, 61, 108, 0.96), rgba(27, 117, 188, 0.88)), url("https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', color: '#ffffff',
        padding: '90px 0 100px 0', position: 'relative', overflow: 'hidden'
      }}>
        <div className="container hero-container-grid">
          <div>
            <span style={{
              backgroundColor: 'var(--secondary-green)', padding: '6px 14px',
              borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '1px', display: 'inline-block', marginBottom: '18px'
            }}>
              Wholesale & Distribution • PAN Gujarat
            </span>
            
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#ffffff', lineHeight: '1.15', fontWeight: '800', marginBottom: '20px', fontFamily: 'Outfit' }}>
              Your Trusted Partner in <br />
              <span style={{ color: '#86efac' }}>Pharma, OTC & Surgical</span> Supplies
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '25px', maxWidth: '620px', fontWeight: '400', lineHeight: '1.6' }}>
              Niyansh Pharma delivers 8,700+ genuine healthcare formulations, generic medicines, and hospital consumables with verified batch compliance and prompt delivery across Saurashtra & Gujarat.
            </p>

            {/* In-Banner Quick Medicine Search */}
            <form onSubmit={handleHeroSearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '540px', marginBottom: '25px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search 8,700+ medicines, salts or companies..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </form>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-secondary" style={{ padding: '12px 26px', fontSize: '0.95rem' }}>
                Browse Catalog
              </Link>
              <button onClick={handleQuickWhatsApp} className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff', padding: '12px 26px', fontSize: '0.95rem' }}>
                WhatsApp Order
              </button>
            </div>
          </div>

          {/* Graphical floating panel for Quick Stats */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(12px)',
            borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '10px' }}>
              Quick Contact
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ backgroundColor: 'var(--secondary-green)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneCall size={18} />
                </span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1' }}>Call for Orders</span>
                  <a href="tel:+919909923130" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>+91 99099 23130</a>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ backgroundColor: 'var(--accent-blue)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} />
                </span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1' }}>Email Us</span>
                  <a href="mailto:NiyanshPharma@gmail.com" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>NiyanshPharma@gmail.com</a>
                </div>
              </li>
            </ul>
            <div style={{ marginTop: '25px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'center' }}>
              📍 Block no. 52B, Panchayat Nagar-3, University Rd, Rajkot, Gujarat
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <h2 className="section-title">Shop By Category</h2>
          <p className="section-subtitle">We distribute a comprehensive portfolio of pharmaceutical and clinical supplies.</p>
          
          <div className="grid-4">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="card" 
                style={{
                  padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'space-between' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '15px', flex: 1 }}>{cat.desc}</p>
                  <Link to={cat.link} className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <h2 className="section-title">Why Choose Niyansh Pharma?</h2>
          <p className="section-subtitle">We prioritize quality, affordability, and professional distribution logistics.</p>

          <div className="grid-3">
            {features.map((feat, i) => (
              <div 
                key={i} 
                className="card" 
                style={{
                  display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '25px'
                }}
              >
                <div style={{
                  backgroundColor: 'rgba(12, 61, 108, 0.06)', padding: '12px',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text-dark)' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Easy Ordering Process */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <h2 className="section-title">Easy Ordering Process</h2>
          <p className="section-subtitle">How medical stores and healthcare institutions order from us.</p>

          <div className="grid-4" style={{ position: 'relative' }}>
            {[
              { step: '01', title: 'Search Products', desc: 'Browse our wholesale list of medicines and select required quantities.' },
              { step: '02', title: 'Add to Enquiry', desc: 'Add selected items to the Quote Cart. Include prescription if needed.' },
              { step: '03', title: 'Submit Details', desc: 'Provide your pharmacy or clinic info and send the enquiry.' },
              { step: '04', title: 'Get Fast Quote', desc: 'Our team will contact you with wholesale pricing and dispatch details.' }
            ].map((step, i) => (
              <div 
                key={i} 
                style={{
                  padding: '30px 20px', border: '1px solid var(--border-light)',
                  borderRadius: '12px', backgroundColor: '#f8fafc', position: 'relative',
                  textAlign: 'center'
                }}
              >
                <span style={{
                  position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: 'var(--primary-blue)', color: '#ffffff', width: '35px', height: '35px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '0.9rem'
                }}>
                  {step.step}
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: '15px 0 10px 0' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Order Form / WhatsApp Integration Section */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #1b75bc, var(--primary-blue))',
        color: '#ffffff', padding: '60px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '10px' }}>Quick Wholesale Enquiry</h2>
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', maxWidth: '700px' }}>
              Have a bulk pharmaceutical requirement? Send us a list or photo of your requirement on WhatsApp, and we will get back to you with rates instantly.
            </p>
          </div>
          <div>
            <button 
              onClick={handleQuickWhatsApp} 
              className="btn btn-secondary" 
              style={{
                backgroundColor: 'var(--secondary-green)', padding: '15px 35px',
                fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(56,142,60,0.3)', gap: '10px'
              }}
            >
              <MessageSquare size={18} />
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Brands We Deal In Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <h2 className="section-title">Brands We Deal In</h2>
          <p className="section-subtitle">We distribute high-quality medical supplies from reputed pharmaceutical corporations.</p>
          
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px',
            marginTop: '20px'
          }}>
            {brands.map((brand, i) => (
              <span 
                key={i} 
                style={{
                  padding: '12px 25px', backgroundColor: '#f8fafc', borderRadius: '30px',
                  fontWeight: '600', color: 'var(--text-medium)', border: '1px solid var(--border-light)',
                  fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.01)'
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

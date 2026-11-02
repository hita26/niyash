import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Truck, Percent, Headset, Globe, ShoppingCart, MessageSquare, 
  PhoneCall, Mail, Search, ArrowRight, Award, Building2, Package, CheckCircle2, Sparkles 
} from 'lucide-react';

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
  const categories = [
    {
      name: 'Pharma Products',
      title: 'Pharma Medicines',
      desc: 'Tablets, Capsules, Syrups, Ointments & more.',
      image: '/pharma-products.jpg',
      link: '/products?category=Pharma Products'
    },
    {
      name: 'OTC Products',
      title: 'OTC Products',
      desc: 'Over-the-counter medicines & wellness supplies.',
      image: '/otc-products.jpg',
      link: '/products?category=OTC Products'
    },
    {
      name: 'Injectables',
      title: 'Injectables',
      desc: 'Critical care vials, ampoules, and IV infusions.',
      image: '/injectables.jpg',
      link: '/products?category=Injectables'
    },
    {
      name: 'Surgical & Medical Supplies',
      title: 'Surgical & Medical',
      desc: 'Gloves, syringes, needles, dressings & consumables.',
      image: '/surgical-supplies.jpg',
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
    'Abbott',
    'Alkem',
    'Biochem',
    'Cipla',
    'Dr. Morepen',
    'Healing Pharma',
    'Intas',
    'Leeford Healthcare',
    'Namcare Pharma',
    'Steris Pharma',
    'Sun Pharma',
    'Troikaa Pharmaceuticals',
    'Zydus'
  ];

  const handleQuickWhatsApp = () => {
    const msg = "Hello Niyansh Pharma, I would like to place a quick wholesale order. Please guide me.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">
      
      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(10, 48, 86, 0.97), rgba(20, 83, 138, 0.92)), url("https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', color: '#ffffff',
        padding: '70px 0 85px 0', position: 'relative', overflow: 'hidden'
      }}>
        <div className="container hero-container-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(74, 222, 128, 0.35)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#86efac', marginBottom: '16px' }}>
              <ShieldCheck size={15} /> Authorized Wholesale & Distribution • PAN Gujarat
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)', color: '#ffffff', lineHeight: '1.18', fontWeight: '800', marginBottom: '18px', fontFamily: 'Outfit' }}>
              Your Trusted Partner in <br />
              <span style={{ color: '#86efac' }}>9,500+ Pharma, OTC & Surgical</span> Supplies
            </h1>
            
            <p style={{ fontSize: '1.08rem', color: '#e2e8f0', marginBottom: '28px', maxWidth: '620px', fontWeight: '400', lineHeight: '1.65' }}>
              Niyansh Pharma delivers 9,500+ genuine healthcare formulations, generic medicines, and hospital consumables from 252+ certified manufacturers with verified batch compliance and prompt delivery across Saurashtra & Gujarat.
            </p>

            {/* High-Impact Action CTAs for Chemists */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '25px' }}>
              <Link to="/companies" className="btn btn-secondary" style={{ padding: '13px 24px', fontSize: '0.96rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} /> Browse 252+ Companies
              </Link>
              <Link to="/quick-order" className="btn btn-primary" style={{ padding: '13px 24px', fontSize: '0.96rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: 'var(--primary-blue)' }}>
                <Package size={18} /> Fast Quick Order ⚡
              </Link>
              <button onClick={handleQuickWhatsApp} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#ffffff', padding: '13px 22px', fontSize: '0.96rem', fontWeight: '600', borderRadius: '30px' }}>
                <MessageSquare size={17} /> WhatsApp Order
              </button>
            </div>

            {/* Quick Formulation Filter Shortcuts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Jump:</span>
              <Link to="/products?category=Pharma Products" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '15px', textDecoration: 'none', transition: 'all 0.2s' }}>Tablets & Capsules</Link>
              <Link to="/products?category=Injectables" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '15px', textDecoration: 'none', transition: 'all 0.2s' }}>Critical Care Injectables</Link>
              <Link to="/products?category=OTC Products" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '15px', textDecoration: 'none', transition: 'all 0.2s' }}>OTC & Wellness</Link>
              <Link to="/products?category=Surgical %26 Medical Supplies" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '15px', textDecoration: 'none', transition: 'all 0.2s' }}>Surgical & Medical</Link>
            </div>
          </div>

          {/* Wholesale Trust & Statistics Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(16px)',
            borderRadius: '20px', padding: '30px', border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#86efac" />
                <h3 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>
                  Wholesale Advantage
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#22c55e', color: '#ffffff', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                LIVE B2B
              </span>
            </div>

            {/* Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>9,500+</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>Genuine Formulations</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#86efac', lineHeight: 1.1 }}>252+</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>Pharma Companies</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>WHO-GMP</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>Certified Supply Chain</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#93c5fd', lineHeight: 1.1 }}>Same-Day</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>Dispatch in Saurashtra</div>
              </div>
            </div>

            {/* Direct Order Help */}
            <div style={{ padding: '14px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block' }}>Call Wholesale Desk:</span>
                <a href="tel:+919909923130" style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.02rem', textDecoration: 'none' }}>+91 99099 23130</a>
              </div>
              <a 
                href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20place%20a%20wholesale%20order." 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ backgroundColor: '#22c55e', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/pharma-products.jpg';
                    }}
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
              { step: '02', title: 'Add to Cart', desc: 'Add selected items to your Cart. Include prescription if needed.' },
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
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px',
            marginTop: '20px'
          }}>
            {brands.map((brand, i) => (
              <Link 
                key={i} 
                to={`/products?brand=${encodeURIComponent(brand)}`}
                title={`Browse medicines manufactured by ${brand}`}
                style={{
                  padding: '10px 22px', backgroundColor: '#f8fafc', borderRadius: '30px',
                  fontWeight: '600', color: 'var(--primary-blue)', border: '1px solid var(--border-light)',
                  fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  display: 'inline-flex', alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--primary-blue)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = 'var(--primary-blue)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

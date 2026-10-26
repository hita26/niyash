import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Truck, 
  Building2, 
  Target, 
  HeartHandshake, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Users, 
  Layers, 
  Globe,
  ArrowRight,
  Package
} from 'lucide-react';

function About() {
  const stats = [
    { number: '8,700+', label: 'Registered Formulations', desc: 'Tablets, Capsules, Syrups, Injectables & Surgicals' },
    { number: '1,200+', label: 'Retail & Hospital Clients', desc: 'Medical stores and healthcare institutions across Gujarat' },
    { number: '15+', label: 'Reputed Pharma Partners', desc: 'Cipla, Sun Pharma, Abbott, Zydus, Daxia & more' },
    { number: '100%', label: 'WHO-GMP Compliant', desc: 'Strict regulatory quality and batch compliance' }
  ];

  const values = [
    {
      icon: <ShieldCheck size={28} color="var(--primary-blue)" />,
      title: '100% Genuine Medicines',
      desc: 'We enforce stringent authenticity protocols. Every batch is directly sourced from licensed pharmaceutical corporations with verified drug master files and manufacturer warranties.'
    },
    {
      icon: <Award size={28} color="var(--secondary-green)" />,
      title: 'WHO-GMP Quality Standards',
      desc: 'All distributed medicines and contract manufactured formulations comply with World Health Organization Good Manufacturing Practices (WHO-GMP) and national pharmacopeia guidelines.'
    },
    {
      icon: <Truck size={28} color="var(--accent-blue)" />,
      title: 'Fast & Temperature-Controlled Dispatch',
      desc: 'Our specialized warehousing and delivery routes guarantee timely delivery to retail pharmacies, clinics, and hospitals across Rajkot, Saurashtra, and PAN Gujarat.'
    },
    {
      icon: <HeartHandshake size={28} color="var(--primary-blue)" />,
      title: 'Ethical B2B Pricing & Trade Schemes',
      desc: 'We support independent pharmacy owners and institutions with transparent PTR wholesale rates, competitive margins, volume discounts, and attractive trade scheme bonuses.'
    }
  ];

  const infrastructureHighlights = [
    {
      title: 'Central Distribution Hub (Rajkot)',
      desc: 'Equipped with temperature-controlled zones, high-density storage, and computerized batch-tracking inventory software for prompt picking and packing.'
    },
    {
      title: 'Contract Manufacturing Network',
      desc: 'Collaborating with state-of-the-art third-party production facilities to formulate custom tablets, capsules, dry syrups, and injectables under private labels.'
    },
    {
      title: 'Omnichannel B2B Support',
      desc: 'Instant digital order booking through our online Quick Order portal, WhatsApp automated dispatch desk, and direct phone order coordination.'
    },
    {
      title: 'Regulatory & GST Compliance',
      desc: 'Complete statutory compliance with Form 20B/21B Drug Licenses, valid GST invoicing, and transparent credit accounting.'
    }
  ];

  const handleWhatsApp = () => {
    const msg = "Hello Niyansh Pharma team, I would like to know more about your pharmaceutical wholesale and distribution services.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(12, 61, 108, 0.95), rgba(27, 117, 188, 0.88)), url("https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '75px 0 85px 0'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <span style={{
            backgroundColor: 'var(--secondary-green)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '18px'
          }}>
            WHOLESALE DISTRIBUTION & MANUFACTURING • ESTABLISHED IN GUJARAT
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: '#ffffff', lineHeight: '1.2', fontWeight: '800', marginBottom: '20px', fontFamily: 'Outfit' }}>
            Empowering Healthcare Through <br />
            <span style={{ color: '#86efac' }}>Trust, Quality & Integrity</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: '1.65', marginBottom: '30px' }}>
            Niyansh Pharma is a premier pharmaceutical wholesale distributor and stockist based in Rajkot, Gujarat. We bridge top pharmaceutical manufacturers with retail chemists, dispensaries, nursing homes, and hospitals across Western India.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Explore Products
            </Link>
            <button 
              onClick={handleWhatsApp} 
              className="btn btn-outline" 
              style={{ borderColor: '#ffffff', color: '#ffffff', padding: '12px 28px', fontSize: '0.95rem', gap: '8px' }}
            >
              <MessageSquare size={16} /> Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', textAlign: 'center' }}>
            {stats.map((item, idx) => (
              <div key={idx} style={{ padding: '10px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-blue)', fontFamily: 'Outfit', lineHeight: '1' }}>
                  {item.number}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-dark)', marginTop: '8px', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: '1.4' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are & Mission / Vision Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container responsive-split-layout">
          <div>
            <span style={{
              backgroundColor: 'rgba(12, 61, 108, 0.08)',
              color: 'var(--primary-blue)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '15px'
            }}>
              Our Background
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '18px', color: 'var(--text-dark)' }}>
              A Trusted Partner for Healthcare Retailers & Institutions
            </h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '18px' }}>
              Headquartered at University Road in Rajkot, <strong>Niyansh Pharma</strong> was established with a singular objective: to eliminate supply-chain bottlenecks in the pharmaceutical distribution network by providing immediate access to genuine formulations at wholesale rates.
            </p>
            <p style={{ color: 'var(--text-medium)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '25px' }}>
              Today, our catalogue comprises over 8,700 medicinal formulations ranging from essential antibiotics, cardiovascular and diabetic medications, dermatology topicals, and critical injectables to disposable medical supplies and wellness OTC brands.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
              <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary-blue)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="var(--primary-blue)" /> Our Mission
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>
                  To ensure that vital, high-quality, and affordable pharmaceutical products reach every patient through an efficient, transparent, and technology-driven supply ecosystem.
                </p>
              </div>

              <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--secondary-green)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} color="var(--secondary-green)" /> Our Vision
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>
                  To become Gujarat’s most dependable healthcare supply-chain partner by continuously innovating our logistics, inventory availability, and customer service.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Facility Spotlight Card */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ padding: '30px', backgroundColor: '#ffffff', borderRadius: '16px' }}>
              <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                <img 
                  src="/pharma-products.jpg" 
                  alt="Niyansh Pharma Distribution Hub" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/pharma-products.jpg'; }}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--primary-blue)' }}>
                Central Warehouse & Operations
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '18px' }}>
                Conveniently located at Panchayat Nagar-3, University Road, Rajkot. Our facility operates with strict sanitation and climate controls ensuring all medicines retain their pharmacopeial potency.
              </p>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-medium)' }}>
                  <CheckCircle2 size={16} color="var(--secondary-green)" />
                  <span>Licensed wholesale drug storage (20B & 21B)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-medium)' }}>
                  <CheckCircle2 size={16} color="var(--secondary-green)" />
                  <span>Daily dispatch routes covering Saurashtra & Gujarat</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-medium)' }}>
                  <CheckCircle2 size={16} color="var(--secondary-green)" />
                  <span>Dedicated B2B account support for pharmacies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            <h2 className="section-title">Why Healthcare Providers Choose Us</h2>
            <p className="section-subtitle">
              We uphold the highest benchmarks in pharmaceutical distribution, trade terms, and client care.
            </p>
          </div>

          <div className="grid-2">
            {values.map((v, i) => (
              <div key={i} className="card" style={{ padding: '28px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.06)', padding: '14px', borderRadius: '12px', display: 'flex', flexShrink: 0 }}>
                  {v.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-medium)', lineHeight: '1.6' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure & Capabilities */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            <h2 className="section-title">Infrastructure & Trade Capabilities</h2>
            <p className="section-subtitle">
              End-to-end supply solutions designed to support modern healthcare logistics.
            </p>
          </div>

          <div className="grid-4">
            {infrastructureHighlights.map((inf, idx) => (
              <div key={idx} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: 'rgba(56, 142, 60, 0.08)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--secondary-green)', fontWeight: '800' }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--primary-blue)' }}>{inf.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.5', flex: 1 }}>{inf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Collaboration Banner */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Our Brand Network</h2>
          <p className="section-subtitle">
            Authorised distribution partner for India’s most trusted pharmaceutical manufacturers.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
            {[
              'Abbott', 'Alkem', 'Biochem', 'Cipla', 'Daxia Healthcare', 'Dr. Morepen',
              'Elder Pharmaceuticals', 'Healing Pharma', 'Intas', 'Leeford Healthcare',
              'Lucid Pharma', 'Namcare Pharma', 'Steris Pharma', 'Sun Pharma', 'Troikaa Pharmaceuticals', 'Zydus'
            ].map((b, i) => (
              <Link 
                key={i} 
                to={`/products?brand=${encodeURIComponent(b)}`}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: '24px',
                  color: 'var(--primary-blue)',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = 'var(--primary-blue)';
                }}
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Strip */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-blue), #1b75bc)',
        color: '#ffffff',
        padding: '60px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '8px' }}>
              Ready to Partner with Niyansh Pharma?
            </h2>
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', maxWidth: '680px' }}>
              Connect with our business development desk to unlock verified wholesale trade margins, credit terms, and reliable formulation dispatches.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link 
              to="/partner" 
              className="btn btn-secondary" 
              style={{ backgroundColor: 'var(--secondary-green)', padding: '14px 28px', fontSize: '1rem', gap: '8px' }}
            >
              <HeartHandshake size={18} /> Partner With Us
            </Link>
            <Link 
              to="/contact" 
              className="btn btn-outline" 
              style={{ borderColor: '#ffffff', color: '#ffffff', padding: '14px 28px', fontSize: '1rem', gap: '8px' }}
            >
              <PhoneCall size={18} /> Contact Office
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;

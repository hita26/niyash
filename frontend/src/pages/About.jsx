import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '../context/LanguageContext';
import AnimatedCounter from '../components/AnimatedCounter';

function About() {
  const { t, language } = useLanguage();
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80');
  const [liveProductsCount, setLiveProductsCount] = useState(500);
  const [liveCompaniesCount, setLiveCompaniesCount] = useState(15);

  useEffect(() => {
    fetch('/api/settings/banners')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.banners?.aboutHeroImage) {
          setHeroImage(data.banners.aboutHeroImage);
        }
      })
      .catch(err => console.warn('Could not fetch banner settings:', err));

    fetch('/api/products?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.total === 'number' && data.total > 0) {
          setLiveProductsCount(data.total);
        }
      })
      .catch(err => console.warn('Could not fetch products count:', err));

    fetch('/api/products/meta/filters')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.companies) && data.companies.length > 0) {
          setLiveCompaniesCount(data.companies.length);
        }
      })
      .catch(err => console.warn('Could not fetch companies count:', err));
  }, []);

  const stats = [
    { 
      numeric: liveProductsCount,
      suffix: '+',
      label: t('about.statFormulationsLabel', 'Registered Formulations'), 
      desc: t('about.statFormulationsDesc', 'Tablets, Capsules, Syrups, Injectables & Surgicals') 
    },
    { 
      numeric: 1200,
      suffix: '+',
      label: t('about.statClientsLabel', 'Retail & Hospital Clients'), 
      desc: t('about.statClientsDesc', 'Medical stores and healthcare institutions across Gujarat') 
    },
    { 
      numeric: liveCompaniesCount,
      suffix: '+',
      label: t('about.statPartnersLabel', 'Reputed Pharma Partners'), 
      desc: t('about.statPartnersDesc', 'Cipla, Sun Pharma, Abbott, Zydus, Daxia & more') 
    },
    { 
      numeric: 100,
      suffix: '%',
      label: t('about.statComplianceLabel', 'WHO-GMP Compliance'), 
      desc: t('about.statComplianceDesc', 'Strict regulatory quality and batch compliance') 
    }
  ];

  const values = [
    {
      icon: <ShieldCheck size={28} color="var(--primary-blue)" />,
      title: t('features.genuineTitle', '100% Genuine Medicines'),
      desc: t('features.genuineDesc', 'We enforce stringent authenticity protocols. Every batch is directly sourced from licensed pharmaceutical corporations with verified drug master files and manufacturer warranties.')
    },
    {
      icon: <Award size={28} color="var(--secondary-green)" />,
      title: t('hero.statSupplyChainLabel', 'WHO-GMP Quality Standards'),
      desc: t('features.genuineDesc', 'All distributed medicines and contract manufactured formulations comply with World Health Organization Good Manufacturing Practices (WHO-GMP) and national pharmacopeia guidelines.')
    },
    {
      icon: <Truck size={28} color="var(--accent-blue)" />,
      title: t('features.deliveryTitle', 'Fast & Temperature-Controlled Dispatch'),
      desc: t('features.deliveryDesc', 'Our specialized warehousing and delivery routes guarantee timely delivery to retail pharmacies, clinics, and hospitals across Rajkot, Saurashtra, and PAN Gujarat.')
    },
    {
      icon: <HeartHandshake size={28} color="var(--primary-blue)" />,
      title: t('features.pricingTitle', 'Ethical B2B Pricing & Trade Schemes'),
      desc: t('features.pricingDesc', 'We support independent pharmacy owners and institutions with transparent PTR wholesale rates, competitive margins, volume discounts, and attractive trade scheme bonuses.')
    }
  ];

  const infrastructureHighlights = [
    {
      title: t('about.warehouseTitle', 'Central Distribution Hub (Rajkot)'),
      desc: t('about.warehouseDesc', 'Equipped with temperature-controlled zones, high-density storage, and computerized batch-tracking inventory software for prompt picking and packing.')
    },
    {
      title: t('services.manufacturingTitle', 'Contract Manufacturing Network'),
      desc: t('services.manufacturingDesc', 'Collaborating with state-of-the-art third-party production facilities to formulate custom tablets, capsules, dry syrups, and injectables under private labels.')
    },
    {
      title: t('services.supplierTitle', 'Omnichannel B2B Support'),
      desc: t('services.supplierDesc', 'Instant digital order booking through our online Quick Order portal, WhatsApp automated dispatch desk, and direct phone order coordination.')
    },
    {
      title: t('about.warehousePill1', 'Regulatory & Quality Compliance'),
      desc: t('hero.badge', 'Complete statutory compliance with licensed wholesale drug storage, valid GST invoicing, and verified batch tracking.')
    }
  ];

  const handleWhatsApp = () => {
    const msg = language === 'gu' 
      ? "નમસ્તે નિયાંશ ફાર્મા, મારે આપની હોલસેલ અને દવા વિતરણ સેવાઓ વિશે વધુ જાણવું છે." 
      : language === 'hi' 
      ? "नमस्ते नियांश फार्मा, मुझे आपकी थोक दवा वितरण सेवाओं के बारे में अधिक जानकारी चाहिए।"
      : "Hello Niyansh Pharma team, I would like to know more about your pharmaceutical wholesale and distribution services.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">
      
      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, rgba(12, 61, 108, 0.95), rgba(27, 117, 188, 0.88)), url("${heroImage}")`,
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
            {t('about.badge', 'WHO-GMP Certified Pharmaceutical Distributor')}
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: '#ffffff', lineHeight: '1.2', fontWeight: '800', marginBottom: '20px' }}>
            {t('about.title', 'About Niyansh Pharma')}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: '1.65', marginBottom: '30px' }}>
            {t('about.subtitle', 'Niyansh Pharma is a premier pharmaceutical wholesale distributor and stockist based in Rajkot, Gujarat. We bridge top pharmaceutical manufacturers with retail chemists, dispensaries, nursing homes, and hospitals across Western India.')}
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              {t('categories.viewProducts', 'Explore Products')}
            </Link>
            <button 
              onClick={handleWhatsApp} 
              className="btn btn-outline" 
              style={{ borderColor: '#ffffff', color: '#ffffff', padding: '12px 28px', fontSize: '0.95rem', gap: '8px' }}
            >
              <MessageSquare size={16} /> {t('common.whatsapp', 'Contact Sales')}
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)', padding: 'clamp(28px, 5vw, 40px) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))', gap: 'clamp(14px, 3vw, 25px)', textAlign: 'center' }}>
            {stats.map((item, idx) => (
              <div key={idx} className="card-hover-pharma" style={{ padding: '16px 12px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--primary-blue)', lineHeight: '1', fontFamily: 'Outfit' }}>
                  <AnimatedCounter end={item.numeric} suffix={item.suffix} />
                </div>
                <div style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-dark)', marginTop: '8px', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-medium)', lineHeight: '1.4' }}>
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
              {t('about.backgroundBadge', 'Our Background')}
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '18px', color: 'var(--text-dark)' }}>
              {t('about.backgroundTitle', 'A Trusted Partner for Healthcare Retailers & Institutions')}
            </h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '18px' }}>
              {t('about.backgroundP1', 'Headquartered at University Road in Rajkot, Niyansh Pharma was established with a singular objective: to eliminate supply-chain bottlenecks in the pharmaceutical distribution network by providing immediate access to genuine formulations at wholesale rates.')}
            </p>
            <p style={{ color: 'var(--text-medium)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '25px' }}>
              {t('about.backgroundP2', 'Today, our catalogue comprises an extensive range of medicinal formulations ranging from essential antibiotics, cardiovascular and diabetic medications, dermatology topicals, and critical injectables to disposable medical supplies and wellness OTC brands.')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '15px' }}>
              <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary-blue)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="var(--primary-blue)" /> {t('about.ourMission', 'Our Mission')}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>
                  {t('about.missionText', 'To ensure that vital, high-quality, and affordable pharmaceutical products reach every patient through an efficient, transparent, and technology-driven supply ecosystem.')}
                </p>
              </div>

              <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--secondary-green)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} color="var(--secondary-green)" /> {t('about.ourVision', 'Our Vision')}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>
                  {t('about.visionText', 'To become Gujarat’s most dependable healthcare supply-chain partner by continuously innovating our logistics, inventory availability, and customer service.')}
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
                  alt={t('about.warehouseTitle', 'Central Warehouse & Operations')}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/pharma-products.jpg'; }}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--primary-blue)' }}>
                {t('about.warehouseTitle', 'Central Warehouse & Operations')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '18px' }}>
                {t('about.warehouseDesc', 'Conveniently located at Panchayat Nagar-3, University Road, Rajkot. Our facility operates with strict sanitation and climate controls ensuring all medicines retain their pharmacopeial potency.')}
              </p>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-medium)' }}>
                  <CheckCircle2 size={16} color="var(--secondary-green)" />
                  <span>{t('about.warehousePill1', 'Licensed wholesale drug storage & cold-chain distribution')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-medium)' }}>
                  <CheckCircle2 size={16} color="var(--secondary-green)" />
                  <span>{t('about.warehousePill2', 'Daily dispatch routes covering Saurashtra & Gujarat')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-medium)' }}>
                  <CheckCircle2 size={16} color="var(--secondary-green)" />
                  <span>{t('about.warehousePill3', 'Dedicated B2B account support for pharmacies')}</span>
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
            <h2 className="section-title">{t('about.whyChooseTitle', 'Why Healthcare Providers Choose Us')}</h2>
            <p className="section-subtitle">
              {t('about.whyChooseSubtitle', 'We uphold the highest benchmarks in pharmaceutical distribution, trade terms, and client care.')}
            </p>
          </div>

          <div className="grid-2">
            {values.map((v, i) => (
              <div key={i} className="card card-hover-pharma" style={{ padding: '28px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
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
            <h2 className="section-title">{t('about.infraTitle', 'Infrastructure & Trade Capabilities')}</h2>
            <p className="section-subtitle">
              {t('about.infraSubtitle', 'End-to-end supply solutions designed to support modern healthcare logistics.')}
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
          <h2 className="section-title">{t('about.brandNetworkTitle', 'Our Brand Network')}</h2>
          <p className="section-subtitle">
            {t('about.brandNetworkSubtitle', 'Authorised distribution partner for India’s most trusted pharmaceutical manufacturers.')}
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
              {t('about.ctaTitle', 'Ready to do Business with Niyansh Pharma?')}
            </h2>
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', maxWidth: '680px' }}>
              {t('about.ctaSubtitle', 'Connect with our business development desk to unlock verified wholesale trade margins, credit terms, and reliable formulation dispatches.')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link 
              to="/partner" 
              className="btn btn-secondary" 
              style={{ backgroundColor: 'var(--secondary-green)', padding: '14px 28px', fontSize: '1rem', gap: '8px' }}
            >
              <HeartHandshake size={18} /> {t('about.businessWithUsBtn', 'Business With Us')}
            </Link>
            <Link 
              to="/contact" 
              className="btn btn-outline" 
              style={{ borderColor: '#ffffff', color: '#ffffff', padding: '14px 28px', fontSize: '1rem', gap: '8px' }}
            >
              <PhoneCall size={18} /> {t('about.contactOfficeBtn', 'Contact Office')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;

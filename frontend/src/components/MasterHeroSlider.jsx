import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Package, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Layers
} from 'lucide-react';
import PharmaMoleculesCanvas from './PharmaMoleculesCanvas';
import AnimatedCounter from './AnimatedCounter';
import { useLanguage } from '../context/LanguageContext';

// Seed fallback banners if backend is offline
const FALLBACK_BANNERS = [
  {
    _id: 'seed-b1',
    title: 'Authorized Wholesale & B2B Distribution',
    subtitle: 'Genuine Healthcare Formulations, Generics & Hospital Consumables Delivered Across Saurashtra',
    badge: 'PAN GUJARAT DISTRIBUTION',
    image: '/banners/b1.jpeg',
    link: '/companies',
    ctaText: 'Browse Pharma Companies',
    order: 1,
    active: true,
    aspectRatio: 'landscape'
  },
  {
    _id: 'seed-b2',
    title: 'WHO-GMP Verified Pharmaceutical Formulations',
    subtitle: '100% Certified Batch Compliance & Direct Sourcing from Top Indian Manufacturers',
    badge: 'WHO-GMP CERTIFIED',
    image: '/banners/b2.jpeg',
    link: '/products?category=Pharma Products',
    ctaText: 'View Pharma Products',
    order: 2,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b3',
    title: 'Exclusive Chemist Schemes & Volume Discounts',
    subtitle: 'Special Bonus Margins, 10+1 Free Offers & Wholesale Savings for Registered Pharmacies',
    badge: 'CHEMIST SCHEMES & OFFERS',
    image: '/banners/b3.jpeg',
    link: '/quick-order',
    ctaText: 'Fast Quick Order ⚡',
    order: 3,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b4',
    title: 'Critical Care Emergency Injectables',
    subtitle: 'Dedicated Cold-Chain Storage & Sterile Ampoules for Nursing Homes & Hospitals',
    badge: 'COLD-CHAIN COMPLIANT',
    image: '/banners/b4.jpeg',
    link: '/products?category=Injectables',
    ctaText: 'Critical Care Range',
    order: 4,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b5',
    title: 'Hospital Disposables & Surgical Supplies',
    subtitle: 'Clinical Surgical Gloves, I.V. Cannulas, Syringes, Sutures & Diagnostic Consumables',
    badge: 'HOSPITAL SURGICAL SUPPLY',
    image: '/banners/b5.jpeg',
    link: '/products?category=Surgical %26 Medical Supplies',
    ctaText: 'Explore Surgical Supplies',
    order: 5,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b6',
    title: 'Guaranteed 24-Hour Dispatch from Rajkot Depot',
    subtitle: 'Rapid Logistics & Direct Wholesale Desk Connectivity Across Saurashtra',
    badge: 'SAME-DAY DISPATCH',
    image: '/banners/b6.jpeg',
    link: 'https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20place%20a%20wholesale%20order.',
    ctaText: 'WhatsApp Direct Order',
    order: 6,
    active: true,
    aspectRatio: 'portrait'
  },
  {
    _id: 'seed-b7',
    title: 'Authorized Distribution for 15+ Top Brands',
    subtitle: 'Direct Network for Sun Pharma, Cipla, Zydus, Alkem, Mankind, Abbott & Torrent',
    badge: 'OFFICIAL STOCKIST NETWORK',
    image: '/banners/b7.jpeg',
    link: '/companies',
    ctaText: 'Explore Manufacturers',
    order: 7,
    active: true,
    aspectRatio: 'portrait'
  }
];

const AUTOPLAY_MS = 5500; // 5.5 seconds per slide

export default function MasterHeroSlider({
  liveProductsCount = 500,
  liveCompaniesCount = 15,
  heroBgImage = '',
  handleQuickWhatsApp = () => {}
}) {
  const { t, language } = useLanguage();
  const [banners, setBanners] = useState(FALLBACK_BANNERS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Swipe tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);

  // Fetch active banners from backend
  useEffect(() => {
    let isMounted = true;
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners.filter(b => b.active !== false));
        }
      })
      .catch(err => {
        console.warn('Could not fetch banners, using seeded list:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Total slides: Slide 0 is the Master Interactive Brand Hub, followed by banners
  const totalSlides = 1 + banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIdx(prev => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIdx(prev => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const goToSlide = (idx) => {
    setCurrentIdx(idx);
    setProgress(0);
  };

  // Autoplay timer with progress ticker
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / AUTOPLAY_MS) * 100;

    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          nextSlide();
          return 0;
        }
        return old + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
  };

  // Active banner data for dynamic slides (index 1..N)
  const currentBanner = currentIdx > 0 ? banners[currentIdx - 1] : null;

  return (
    <section 
      className="home-hero-section master-hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        minHeight: 'clamp(520px, 68vh, 660px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        color: '#ffffff',
        background: `linear-gradient(135deg, rgba(8, 38, 70, 0.97), rgba(15, 68, 115, 0.93)), url("${heroBgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'clamp(32px, 5vw, 65px) 0 clamp(44px, 6vw, 75px) 0'
      }}
    >
      {/* ============================================================== */}
      {/* SLIDE 0: MASTER INTERACTIVE BIOTECH BRAND HUB (Default on load) */}
      {/* ============================================================== */}
      <div 
        style={{
          display: currentIdx === 0 ? 'block' : 'none',
          width: '100%',
          opacity: currentIdx === 0 ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out'
        }}
      >
        {/* Animated Molecular Canvas (Circular Bio-Nucleus Edition) */}
        <PharmaMoleculesCanvas particleCount={42} speed={0.40} />

        <div className="container hero-container-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ minWidth: 0 }}>
            {/* Live Gujarat Dispatch Pulse Badge */}
            <div 
              className="live-dispatch-pulse" 
              style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.16)', 
                border: '1px solid rgba(74, 222, 128, 0.45)', 
                padding: '6px 14px', 
                borderRadius: '30px', 
                fontSize: 'clamp(0.72rem, 2.5vw, 0.82rem)', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '0.6px', 
                color: '#86efac', 
                marginBottom: '16px', 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span className="live-pulse-dot" />
              <span>{t('hero.badge', 'Authorized Wholesale & Distribution • PAN Gujarat')}</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(1.75rem, 4.8vw, 3.2rem)', color: '#ffffff', lineHeight: '1.18', fontWeight: '800', marginBottom: '16px', fontFamily: 'Outfit' }}>
              {t('hero.title', 'Your Trusted Partner in')} <br />
              <span style={{ color: '#86efac' }}>{t('hero.titleHighlight', 'Pharma, OTC & Surgical')}</span> {t('hero.titleEnd', 'Supplies')}
            </h1>
            
            <p style={{ fontSize: 'clamp(0.92rem, 2.5vw, 1.08rem)', color: '#e2e8f0', marginBottom: '24px', maxWidth: '620px', fontWeight: '400', lineHeight: '1.65' }}>
              {t('hero.subtitle', 'Niyansh Pharma delivers genuine healthcare formulations, generic medicines, and hospital consumables from certified manufacturers with verified batch compliance and prompt delivery across Saurashtra & Gujarat.')}
            </p>

            {/* High-Impact Action CTAs for Chemists */}
            <div className="hero-cta-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
              <Link to="/companies" className="btn btn-secondary card-hover-pharma" style={{ padding: '12px 22px', fontSize: '0.94rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} /> {t('hero.browseCompanies', 'Browse Pharma Companies')}
              </Link>
              <Link to="/quick-order" className="btn btn-primary card-hover-pharma" style={{ padding: '12px 22px', fontSize: '0.94rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: 'var(--primary-blue)' }}>
                <Package size={18} /> {t('hero.quickOrder', 'Fast Quick Order ⚡')}
              </Link>
              <button onClick={handleQuickWhatsApp} className="btn btn-outline card-hover-pharma" style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#ffffff', padding: '12px 20px', fontSize: '0.94rem', fontWeight: '600', borderRadius: '30px' }}>
                <MessageSquare size={17} /> {t('hero.whatsappOrder', 'WhatsApp Order')}
              </button>
            </div>

            {/* Quick Formulation Filter Shortcuts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('hero.quickJump', 'Quick Jump:')}</span>
              <Link to="/products?category=Pharma Products" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '15px', textDecoration: 'none' }}>{t('categories.pharmaTitle', 'Tablets & Capsules')}</Link>
              <Link to="/products?category=Injectables" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '15px', textDecoration: 'none' }}>{t('categories.injectablesTitle', 'Critical Care Injectables')}</Link>
              <Link to="/products?category=OTC Products" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '15px', textDecoration: 'none' }}>{t('categories.otcTitle', 'OTC & Wellness')}</Link>
              <Link to="/products?category=Surgical %26 Medical Supplies" style={{ fontSize: '0.8rem', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '15px', textDecoration: 'none' }}>{t('categories.surgicalTitle', 'Surgical & Medical')}</Link>
            </div>
          </div>

          {/* Wholesale Trust & Real-time Live Statistics Card */}
          <div className="hero-trust-card pharma-glass-card float-gentle" style={{ borderRadius: '20px', padding: 'clamp(16px, 3vw, 28px)', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#86efac" />
                <h3 style={{ color: '#ffffff', fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: '700', margin: 0 }}>
                  {t('hero.wholesaleAdvantage', 'Wholesale Advantage')}
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#22c55e', color: '#ffffff', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="live-pulse-dot" style={{ width: 6, height: 6 }} /> {t('hero.liveB2B', 'LIVE B2B')}
              </span>
            </div>

            {/* Dynamic Stat Grid */}
            <div className="hero-stat-grid" style={{ marginBottom: '18px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 'clamp(1.15rem, 3.2vw, 1.45rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
                  <AnimatedCounter end={liveProductsCount} suffix="+" className="animated-stat-glow" />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '4px' }}>{t('hero.statFormulationsLabel', 'WHO-GMP Formulations')}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 'clamp(1.15rem, 3.2vw, 1.45rem)', fontWeight: '800', color: '#86efac', lineHeight: 1.1 }}>
                  <AnimatedCounter end={liveCompaniesCount} suffix="+" className="animated-stat-glow" style={{ color: '#86efac' }} />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '4px' }}>{t('hero.statCompaniesLabel', 'Pharma Manufacturers')}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
                  <AnimatedCounter end={100} suffix="%" className="animated-stat-glow" />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '4px' }}>{t('hero.statSupplyChainLabel', 'WHO-GMP Verified Batch')}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', fontWeight: '800', color: '#93c5fd', lineHeight: 1.1 }}>
                  <AnimatedCounter end={99.8} decimals={1} suffix="%" className="animated-stat-glow" style={{ color: '#93c5fd' }} />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '4px' }}>{t('hero.statDispatchLabel', 'Same-Day Dispatch Rate')}</div>
              </div>
            </div>

            {/* Direct Order Help */}
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block' }}>{t('hero.callWholesaleDesk', 'Call Wholesale Desk:')}</span>
                <a href="tel:+919909923130" style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>+91 99099 23130</a>
              </div>
              <a 
                href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20place%20a%20wholesale%20order." 
                target="_blank" 
                rel="noopener noreferrer"
                className="card-hover-pharma"
                style={{ backgroundColor: '#22c55e', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', minHeight: '38px', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)' }}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SLIDES 1..N: DYNAMIC HERO BANNERS (b1..b7 & Admin Created)       */}
      {/* ============================================================== */}
      {currentBanner && (
        <div 
          className="dynamic-banner-slide"
          style={{
            position: 'relative',
            width: '100%',
            zIndex: 2,
            animation: 'fadeInSlide 0.45s ease-out forwards'
          }}
        >
          {/* Ambient Blurred Backdrop for wide panoramic immersion */}
          <div 
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '120%',
              height: '140%',
              backgroundImage: `url("${currentBanner.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(36px) brightness(0.40)',
              opacity: 0.55,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div 
              className="banner-content-wrapper"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(20px, 4vw, 44px)',
                alignItems: 'center'
              }}
            >
              {/* Left Column: Heading, Subtitle & Action Buttons */}
              <div style={{ maxWidth: '640px' }}>
                {/* Badge Tag */}
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    backgroundColor: 'rgba(52, 211, 153, 0.18)',
                    border: '1.5px solid rgba(74, 222, 128, 0.55)',
                    padding: '6px 14px',
                    borderRadius: '24px',
                    fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
                    fontWeight: '800',
                    color: '#86efac',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}
                >
                  <Sparkles size={14} color="#86efac" />
                  <span>{currentBanner.badge || 'WHO-GMP DISTRIBUTOR'}</span>
                </div>

                {/* Banner Title */}
                <h2 
                  style={{
                    fontSize: 'clamp(1.65rem, 4.2vw, 2.9rem)',
                    fontWeight: '900',
                    lineHeight: '1.2',
                    color: '#ffffff',
                    marginBottom: '14px',
                    fontFamily: 'Outfit',
                    textShadow: '0 2px 14px rgba(0,0,0,0.5)'
                  }}
                >
                  {currentBanner.title}
                </h2>

                {/* Banner Subtitle */}
                <p 
                  style={{
                    fontSize: 'clamp(0.92rem, 2.2vw, 1.05rem)',
                    color: '#e2e8f0',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    maxWidth: '560px'
                  }}
                >
                  {currentBanner.subtitle}
                </p>

                {/* Trust Badges */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <ShieldCheck size={16} color="#86efac" /> WHO-GMP Batch Verified
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <Truck size={16} color="#38bdf8" /> Same-Day Dispatch in Saurashtra
                  </span>
                </div>

                {/* Action CTAs */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {currentBanner.link?.startsWith('http') || currentBanner.link?.startsWith('wa.me') ? (
                    <a 
                      href={currentBanner.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary card-hover-pharma"
                      style={{ padding: '12px 24px', fontSize: '0.94rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <MessageSquare size={17} /> {currentBanner.ctaText || 'WhatsApp Order'}
                    </a>
                  ) : (
                    <Link 
                      to={currentBanner.link || '/quick-order'} 
                      className="btn btn-primary card-hover-pharma"
                      style={{ padding: '12px 24px', fontSize: '0.94rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: 'var(--primary-blue)' }}
                    >
                      <Package size={17} /> {currentBanner.ctaText || 'Fast Quick Order ⚡'}
                    </Link>
                  )}

                  <button 
                    onClick={handleQuickWhatsApp} 
                    className="btn btn-outline card-hover-pharma"
                    style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#ffffff', padding: '12px 20px', fontSize: '0.94rem', fontWeight: '600', borderRadius: '30px' }}
                  >
                    <MessageSquare size={17} /> Direct Inquiry
                  </button>
                </div>
              </div>

              {/* Right Column: Crisp Illuminated Artwork Display */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <div 
                  className="banner-image-card float-gentle"
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 30px rgba(52, 211, 153, 0.25)',
                    border: '1.5px solid rgba(255, 255, 255, 0.18)',
                    backgroundColor: 'rgba(11, 35, 65, 0.65)',
                    backdropFilter: 'blur(12px)',
                    maxWidth: currentBanner.aspectRatio === 'landscape' ? '560px' : '420px',
                    width: '100%',
                    maxHeight: '440px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={currentBanner.image} 
                    alt={currentBanner.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '440px',
                      objectFit: currentBanner.aspectRatio === 'landscape' ? 'cover' : 'contain',
                      display: 'block'
                    }}
                    loading="lazy"
                  />
                  {/* Subtle Glass Sheen Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '35%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NAVIGATION CONTROLS: Glass Chevrons & Progress Indicators       */}
      {/* ============================================================== */}
      {totalSlides > 1 && (
        <>
          {/* Prev Arrow */}
          <button 
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hero-nav-arrow hero-nav-prev"
            style={{
              position: 'absolute',
              left: 'clamp(8px, 2vw, 24px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(10, 35, 65, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next Arrow */}
          <button 
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hero-nav-arrow hero-nav-next"
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2vw, 24px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(10, 35, 65, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Bottom Indicator Dots with Slide Titles & Progress */}
          <div 
            className="hero-slider-pagination"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: 0,
              right: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const isActive = idx === currentIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    position: 'relative',
                    height: '8px',
                    width: isActive ? '36px' : '10px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isActive && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: '#34d399',
                        borderRadius: '4px',
                        transition: 'width 50ms linear'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

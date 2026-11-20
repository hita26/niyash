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
  Layers,
  ArrowRight
} from 'lucide-react';
import PharmaMoleculesCanvas from './PharmaMoleculesCanvas';
import AnimatedCounter from './AnimatedCounter';
import { useLanguage } from '../context/LanguageContext';

// 7 Master Hero Banners for Niyansh Pharma's Exclusive Product Line (b1 - b7)
const FALLBACK_BANNERS = [
  {
    _id: 'seed-b1',
    tabLabel: 'NAP STAR A75',
    title: 'NAP STAR A75 Capsules',
    subtitle: 'Aspirin Gastro-resistant & Atorvastatin Capsules I.P. • For a Healthy Heart & Better Life • MRP ₹60',
    badge: 'NEWLY LAUNCHED • RAJKOT',
    image: '/banners/b1.jpeg',
    link: '/products?search=NAP%20STAR',
    ctaText: 'Order NAP STAR A75 ⚡',
    order: 1,
    active: true,
    aspectRatio: 'landscape'
  },
  {
    _id: 'seed-b2',
    tabLabel: 'NIYACOF-DX',
    title: 'NIYACOF-DX Cough Syrup',
    subtitle: 'Dextromethorphan HBr, Chlorpheniramine & Phenylephrine • Triple Relief from Cough, Cold & Congestion',
    badge: 'NEW LAUNCH • COUGH & COLD',
    image: '/banners/b2.jpeg',
    link: '/products?search=NIYACOF',
    ctaText: 'Order NIYACOF-DX ⚡',
    order: 2,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b3',
    tabLabel: 'Niyamet-G1',
    title: 'Niyamet-G1 SR Tablets',
    subtitle: 'Metformin Hydrochloride PR & Glimepiride Tablets I.P. • For Better Control of Diabetes • MRP ₹135/-',
    badge: 'DIABETES CARE • WHO-GMP',
    image: '/banners/b3.jpeg',
    link: '/products?search=Niyamet',
    ctaText: 'Order Niyamet-G1 ⚡',
    order: 3,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b4',
    tabLabel: 'Niyamet-G2',
    title: 'Niyamet-G2 SR Tablets',
    subtitle: 'Metformin Hydrochloride PR & Glimepiride Tablets I.P. • Better Control for Healthier Tomorrow • MRP ₹176/-',
    badge: 'DIABETES CARE • PROLONGED RELEASE',
    image: '/banners/b4.jpeg',
    link: '/products?search=Niyamet',
    ctaText: 'Order Niyamet-G2 ⚡',
    order: 4,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b5',
    tabLabel: 'Niyarose 10',
    title: 'Niyarose 10 Tablets',
    subtitle: 'Rosuvastatin Calcium Tablets I.P. • Effective Control of Cholesterol & Heart Health • MRP ₹185/-',
    badge: 'CARDIAC CARE • CHOLESTEROL CONTROL',
    image: '/banners/b5.jpeg',
    link: '/products?search=Niyarose',
    ctaText: 'Order Niyarose 10 ⚡',
    order: 5,
    active: true,
    aspectRatio: 'square'
  },
  {
    _id: 'seed-b6',
    tabLabel: 'Niyastat 10',
    title: 'Niyastat-Gold 10 Capsules',
    subtitle: 'Atorvastatin, Aspirin & Clopidogrel Capsules • Triple Action for Healthier Heart • MRP ₹107/Strip',
    badge: 'TRIPLE ACTION CARDIAC',
    image: '/banners/b6.jpeg',
    link: '/products?search=Niyastat',
    ctaText: 'Order Niyastat-Gold 10 ⚡',
    order: 6,
    active: true,
    aspectRatio: 'portrait'
  },
  {
    _id: 'seed-b7',
    tabLabel: 'Niyastat 20',
    title: 'Niyastat-Gold 20 Capsules',
    subtitle: 'Atorvastatin, Aspirin & Clopidogrel Capsules • Advanced Cardiovascular Protection • MRP ₹139/Strip',
    badge: 'TRIPLE ACTION ADVANCED',
    image: '/banners/b7.jpeg',
    link: '/products?search=Niyastat',
    ctaText: 'Order Niyastat-Gold 20 ⚡',
    order: 7,
    active: true,
    aspectRatio: 'portrait'
  }
];

const AUTOPLAY_MS = 5000; // 5 seconds per slide for a brisk, dynamic rotation

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

  // Fetch active banners from backend with fallback guarantee
  useEffect(() => {
    let isMounted = true;
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data && data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          const activeList = data.banners.filter(b => b.active !== false);
          if (activeList.length > 0) {
            setBanners(activeList);
          }
        }
      })
      .catch(err => {
        console.warn('Could not fetch banners from API, keeping seeded roster:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Total slides: Slide 0 is the Master Interactive Brand Hub, followed by product banners
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
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
  };

  // Active banner data for dynamic slides (index 1..N)
  const currentBanner = currentIdx > 0 ? banners[currentIdx - 1] : null;

  // Active slide label for the floating pill
  const activeLabel = currentIdx === 0 
    ? 'Brand Hub' 
    : (currentBanner?.tabLabel || currentBanner?.title?.split(' ')[0] || `Banner ${currentIdx}`);

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
        minHeight: 'clamp(520px, 70vh, 660px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        color: '#ffffff',
        background: `linear-gradient(135deg, rgba(8, 38, 70, 0.97), rgba(15, 68, 115, 0.93)), url("${heroBgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'clamp(32px, 5vw, 65px) 0 clamp(54px, 7vw, 85px) 0'
      }}
    >
      {/* Top Slide Autoplay Progress Line */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          zIndex: 15
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#34d399',
            boxShadow: '0 0 10px #34d399',
            transition: 'width 50ms linear'
          }}
        />
      </div>

      {/* Floating Rotating Status Beacon (Top Right) */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          right: 'clamp(14px, 3vw, 36px)',
          zIndex: 15,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(10, 35, 65, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(52, 211, 153, 0.45)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          fontWeight: '700',
          color: '#86efac',
          letterSpacing: '0.5px'
        }}
      >
        <span className="live-pulse-dot" style={{ width: 7, height: 7 }} />
        <span>Slide {currentIdx + 1} / {totalSlides} • {activeLabel}</span>
      </div>

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
      {/* SLIDES 1..N: DYNAMIC HERO PRODUCT BANNERS (b1..b7)              */}
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
              top: '-30%',
              left: '-15%',
              width: '130%',
              height: '160%',
              backgroundImage: `url("${currentBanner.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(45px) brightness(0.35)',
              opacity: 0.65,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            {/* If it's the wide landscape banner (b1): show full widescreen panorama card */}
            {currentBanner.aspectRatio === 'landscape' ? (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '1160px',
                  margin: '0 auto'
                }}
              >
                {/* Clickable Large Panoramic Poster */}
                <Link 
                  to={currentBanner.link || '/products'}
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(52, 211, 153, 0.3)',
                    border: '1.5px solid rgba(255, 255, 255, 0.22)',
                    backgroundColor: 'rgba(11, 35, 65, 0.7)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    textDecoration: 'none'
                  }}
                  className="banner-panoramic-card card-hover-pharma"
                >
                  <img 
                    src={currentBanner.image} 
                    alt={currentBanner.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '440px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </Link>

                {/* Sub-Banner Fast Action Bar */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(10, 35, 65, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.74rem', backgroundColor: '#22c55e', color: '#ffffff', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                      {currentBanner.badge || 'NEW LAUNCH'}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
                      {currentBanner.title}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'none', mdDisplay: 'inline' }} className="d-none d-md-inline">
                      • {currentBanner.subtitle}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link 
                      to={currentBanner.link || '/quick-order'} 
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.88rem', fontWeight: '700', borderRadius: '25px', backgroundColor: '#ffffff', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Package size={15} /> {currentBanner.ctaText || 'Fast Quick Order ⚡'}
                    </Link>
                    <a 
                      href={`https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(currentBanner.title)}.`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary"
                      style={{ padding: '8px 18px', fontSize: '0.88rem', fontWeight: '700', borderRadius: '25px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={15} /> WhatsApp Order
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* For Square & Portrait Posters (b2 - b7): Rich Split Showcase Layout */
              <div 
                className="banner-content-wrapper"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'clamp(24px, 5vw, 50px)',
                  alignItems: 'center'
                }}
              >
                {/* Left Column: Product Details & CTAs */}
                <div style={{ maxWidth: '600px' }}>
                  {/* Badge Tag */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      backgroundColor: 'rgba(52, 211, 153, 0.2)',
                      border: '1.5px solid rgba(74, 222, 128, 0.6)',
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
                    <span>{currentBanner.badge || 'EXCLUSIVE NIYANSH FORMULATION'}</span>
                  </div>

                  {/* Banner Title */}
                  <h2 
                    style={{
                      fontSize: 'clamp(1.75rem, 4.2vw, 2.85rem)',
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
                      fontSize: 'clamp(0.92rem, 2.2vw, 1.08rem)',
                      color: '#e2e8f0',
                      lineHeight: '1.65',
                      marginBottom: '22px',
                      maxWidth: '540px'
                    }}
                  >
                    {currentBanner.subtitle}
                  </p>

                  {/* Trust Badges */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      <ShieldCheck size={16} color="#86efac" /> WHO-GMP Certified Formulation
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      <Truck size={16} color="#38bdf8" /> Prompt Saurashtra & Gujarat Dispatch
                    </span>
                  </div>

                  {/* Action CTAs */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link 
                      to={currentBanner.link || '/products'} 
                      className="btn btn-primary card-hover-pharma"
                      style={{ padding: '12px 24px', fontSize: '0.94rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: 'var(--primary-blue)' }}
                    >
                      <Package size={17} /> {currentBanner.ctaText || 'Fast Quick Order ⚡'}
                    </Link>

                    <a 
                      href={`https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%2C%20I%20would%20like%20to%20place%20a%20wholesale%20order%20for%20${encodeURIComponent(currentBanner.title)}.`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary card-hover-pharma"
                      style={{ padding: '12px 24px', fontSize: '0.94rem', fontWeight: '700', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <MessageSquare size={17} /> WhatsApp Order
                    </a>

                    <button 
                      onClick={handleQuickWhatsApp} 
                      className="btn btn-outline card-hover-pharma"
                      style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#ffffff', padding: '12px 20px', fontSize: '0.94rem', fontWeight: '600', borderRadius: '30px' }}
                    >
                      Direct Inquiry
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
                  <Link
                    to={currentBanner.link || '/products'}
                    className="banner-image-card float-gentle"
                    style={{
                      position: 'relative',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(52, 211, 153, 0.28)',
                      border: '1.5px solid rgba(255, 255, 255, 0.22)',
                      backgroundColor: 'rgba(11, 35, 65, 0.7)',
                      backdropFilter: 'blur(12px)',
                      maxWidth: currentBanner.aspectRatio === 'portrait' ? '360px' : '440px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    <img 
                      src={currentBanner.image} 
                      alt={currentBanner.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '440px',
                        objectFit: 'contain',
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
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NAVIGATION CONTROLS: Prominent Glass Chevrons & Pill Indicators */}
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
              left: 'clamp(8px, 2.5vw, 28px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 28, 52, 0.82)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Arrow */}
          <button 
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hero-nav-arrow hero-nav-next"
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2.5vw, 28px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 28, 52, 0.82)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Bottom Interactive Slide Indicator Pills Bar */}
          <div 
            className="hero-slider-pagination"
            style={{
              position: 'absolute',
              bottom: '14px',
              left: 0,
              right: 0,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              padding: '0 16px'
            }}
          >
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const isActive = idx === currentIdx;
              const pillLabel = idx === 0 
                ? '✦ Brand Hub' 
                : (banners[idx - 1]?.tabLabel || banners[idx - 1]?.title?.split(' ')[0] || `Slide ${idx}`);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    position: 'relative',
                    height: '24px',
                    padding: isActive ? '0 12px' : '0 8px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(34, 197, 94, 0.35)' : 'rgba(255, 255, 255, 0.18)',
                    border: isActive ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.22)',
                    color: isActive ? '#86efac' : '#cbd5e1',
                    fontSize: '0.72rem',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.25s ease',
                    backdropFilter: 'blur(8px)',
                    boxShadow: isActive ? '0 0 12px rgba(52, 211, 153, 0.5)' : 'none'
                  }}
                >
                  <span 
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#34d399' : 'rgba(255, 255, 255, 0.5)'
                    }} 
                  />
                  <span className={isActive ? '' : 'd-none d-sm-inline'}>
                    {pillLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Truck, Percent, Headset, Globe, ShoppingCart, MessageSquare, 
  PhoneCall, Mail, Search, ArrowRight, Award, Building2, Package, CheckCircle2, Sparkles, X, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PharmaMoleculesCanvas from '../components/PharmaMoleculesCanvas';
import AnimatedCounter from '../components/AnimatedCounter';
import MasterHeroSlider from '../components/MasterHeroSlider';
import useScrollReveal from '../hooks/useScrollReveal';
import { useLiveSync, SYNC_EVENTS } from '../utils/liveSync';

function Home({ addToCart }) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  const [heroSearch, setHeroSearch] = useState('');
  const [liveProductsCount, setLiveProductsCount] = useState(500);
  const [liveCompaniesCount, setLiveCompaniesCount] = useState(15);

  // Dynamic Banners & Home Content Settings
  const [heroBgImage, setHeroBgImage] = useState('https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80');
  const [brandsList, setBrandsList] = useState([
    'Abbott', 'Alkem', 'Aristo', 'Biochem', 'Cipla', 'Daxia Healthcare', 'Dr. Morepen',
    'Glenmark', 'Healing Pharma', 'Intas', 'Ipca', 'Leeford Healthcare',
    'Lupin', 'Macleods', 'Mankind', 'Sun Pharma', 'Torrent', 'Troikaa Pharmaceuticals', 'Zydus Cadila'
  ]);
  const [dynamicCategories, setDynamicCategories] = useState([
    {
      name: 'Pharma Products',
      title: t('categories.pharmaTitle', 'Pharma Medicines'),
      desc: t('categories.pharmaDesc', 'Tablets, Capsules, Syrups, Ointments & more.'),
      image: '/pharma-products.jpg',
      link: '/products?category=Pharma Products'
    },
    {
      name: 'OTC Products',
      title: t('categories.otcTitle', 'OTC Products'),
      desc: t('categories.otcDesc', 'Over-the-counter medicines & wellness supplies.'),
      image: '/otc-products.jpg',
      link: '/products?category=OTC Products'
    },
    {
      name: 'Injectables',
      title: t('categories.injectablesTitle', 'Injectables'),
      desc: t('categories.injectablesDesc', 'Critical care vials, ampoules, and IV infusions.'),
      image: '/injectables.jpg',
      link: '/products?category=Injectables'
    },
    {
      name: 'Surgical & Medical Supplies',
      title: t('categories.surgicalTitle', 'Surgical & Medical'),
      desc: t('categories.surgicalDesc', 'Gloves, syringes, needles, dressings & consumables.'),
      image: '/surgical-supplies.jpg',
      link: '/products?category=Surgical %26 Medical Supplies'
    }
  ]);

  const fetchBrandsAndStats = useCallback(() => {
    // 1. Fetch dynamic banners
    fetch('/api/settings/banners')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.banners?.homeHeroImage) {
          setHeroBgImage(data.banners.homeHeroImage);
        }
      })
      .catch(err => console.warn('Could not load banner settings:', err));

    // 2. Fetch dynamic home brands & categories from settings + filters + companies + total count
    Promise.allSettled([
      fetch('/api/settings/home-content').then(r => r.json()),
      fetch('/api/products/meta/filters').then(r => r.json()),
      fetch('/api/companies').then(r => r.json()),
      fetch('/api/products?limit=1').then(r => r.json())
    ]).then(([settingsRes, filtersRes, companiesRes, countRes]) => {
      const brandMap = new Map();
      const addBrand = (name) => {
        if (!name || typeof name !== 'string') return;
        const clean = name.trim();
        // Skip empty, numbers, or non-brand entries like long product descriptions
        if (clean.length < 2 || clean.length > 30) return;
        if (/sanitary|pad|diaper|condom|\b\d+\s*(ml|gm|mg|tab|cap|vial|amp)\b/i.test(clean)) return;
        const lower = clean.toLowerCase();
        if (!brandMap.has(lower)) {
          // Normalize all-caps names like "BIOCHEM" -> "Biochem"
          let formatted = clean === clean.toUpperCase() && clean.length > 3
            ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase()
            : clean;
          
          if (lower === 'daxia') formatted = 'Daxia Healthcare';
          if (lower === 'zydus') formatted = 'Zydus Cadila';
          brandMap.set(lower, formatted);
        }
      };

      // Initial defaults
      brandsList.forEach(addBrand);

      // From Settings
      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
        if (Array.isArray(settingsRes.value.brands)) {
          settingsRes.value.brands.forEach(addBrand);
        }
        if (Array.isArray(settingsRes.value.categories) && settingsRes.value.categories.length > 0) {
          setDynamicCategories(settingsRes.value.categories);
        }
      }

      // From Product Database Filter Meta (Live active stock)
      if (filtersRes.status === 'fulfilled' && filtersRes.value.success) {
        if (Array.isArray(filtersRes.value.brands)) {
          filtersRes.value.brands.forEach(addBrand);
        }
        if (Array.isArray(filtersRes.value.companies)) {
          filtersRes.value.companies.forEach(addBrand);
          if (filtersRes.value.companies.length > 0) {
            setLiveCompaniesCount(filtersRes.value.companies.length);
          }
        }
      }

      // From Company Directory
      if (companiesRes.status === 'fulfilled' && companiesRes.value.success && Array.isArray(companiesRes.value.companies)) {
        companiesRes.value.companies.forEach(c => {
          if (c && c.name) addBrand(c.name);
        });
      }

      // Live product total
      if (countRes.status === 'fulfilled' && countRes.value.success && typeof countRes.value.total === 'number') {
        setLiveProductsCount(countRes.value.total);
      }

      const mergedBrands = Array.from(brandMap.values()).filter(Boolean).sort((a, b) => a.localeCompare(b));
      if (mergedBrands.length > 0) {
        setBrandsList(mergedBrands);
      }
    }).catch(err => console.warn('Dynamic brands sync error:', err));
  }, []);

  useEffect(() => {
    fetchBrandsAndStats();
  }, [fetchBrandsAndStats]);

  // Real-time live sync across admin changes
  useLiveSync((event) => {
    if (
      event.type === SYNC_EVENTS.SETTINGS_UPDATED ||
      event.type === SYNC_EVENTS.COMPANY_MUTATED ||
      event.type === SYNC_EVENTS.PRODUCT_CREATED ||
      event.type === SYNC_EVENTS.PRODUCT_BULK_IMPORTED ||
      event.type === SYNC_EVENTS.PRODUCT_DELETED
    ) {
      fetchBrandsAndStats();
    }
  });

  // Dual counter-flow marquee streams
  const { track1Stream, track2Stream } = useMemo(() => {
    const t1 = brandsList.filter((_, idx) => idx % 2 === 0);
    const t2 = brandsList.filter((_, idx) => idx % 2 === 1);
    const s1 = t1.length >= 8 ? t1 : brandsList;
    const s2 = t2.length >= 8 ? t2 : [...brandsList].reverse();
    return {
      track1Stream: [...s1, ...s1],
      track2Stream: [...s2, ...s2]
    };
  }, [brandsList]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const categories = dynamicCategories;

  const features = [
    {
      icon: <ShieldCheck size={36} color="var(--primary-blue)" />,
      title: t('features.genuineTitle', 'Genuine & Quality Assured'),
      desc: t('features.genuineDesc', '100% genuine products sourced directly from reputed pharmaceutical companies.')
    },
    {
      icon: <Globe size={36} color="var(--primary-blue)" />,
      title: t('features.networkTitle', 'Strong Network'),
      desc: t('features.networkDesc', 'Extensive distribution reach covering Rajkot, Gujarat, and surrounding regions.')
    },
    {
      icon: <Percent size={36} color="var(--primary-blue)" />,
      title: t('features.pricingTitle', 'Competitive Wholesale Rates'),
      desc: t('features.pricingDesc', 'Best profit margins and wholesale pricing structures for medical stores.')
    },
    {
      icon: <Truck size={36} color="var(--primary-blue)" />,
      title: t('features.deliveryTitle', 'Fast & Reliable Delivery'),
      desc: t('features.deliveryDesc', 'Timely and safe delivery mapping medical stores, clinics, and hospitals.')
    },
    {
      icon: <Headset size={36} color="var(--primary-blue)" />,
      title: t('features.supportTitle', 'Professional Support'),
      desc: t('features.supportDesc', 'Our dedicated customer care team resolves order queries promptly.')
    },
    {
      icon: <ShieldCheck size={36} color="var(--primary-blue)" />,
      title: t('features.coldChainTitle', 'Cold-Chain Logistics'),
      desc: t('features.coldChainDesc', 'Strict temperature-controlled handling for insulin, vaccines, and biologics.')
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
    const msg = language === 'gu'
      ? "નમસ્તે નિયાંશ ફાર્મા, મારે હોલસેલ દવાનો ઓર્ડર આપવો છે. કૃપા કરીને વિગતો આપો."
      : language === 'hi'
      ? "नमस्ते नियांश फार्मा, मुझे थोक दवा ऑर्डर करना है। कृपया सहायता करें।"
      : "Hello Niyansh Pharma, I would like to place a quick wholesale order. Please guide me.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">
      
      {/* Master Hero Slider: Slide 0 is Master Biotech Hub, followed by rotating banners */}
      <MasterHeroSlider
        liveProductsCount={liveProductsCount}
        liveCompaniesCount={liveCompaniesCount}
        heroBgImage={heroBgImage}
        handleQuickWhatsApp={handleQuickWhatsApp}
      />

      {/* Shop By Category Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="pharma-reveal">
            <h2 className="section-title">{t('categories.title', 'Shop By Category')}</h2>
            <p className="section-subtitle">{t('categories.subtitle', 'We distribute a comprehensive portfolio of pharmaceutical and clinical supplies.')}</p>
          </div>
          
          <div className="grid-4">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className={`card category-card-hover card-hover-pharma pharma-reveal stagger-${(i % 4) + 1}`} 
                style={{
                  padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/pharma-products.jpg';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', minHeight: '2.8rem', lineHeight: '1.4' }}>{cat.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '15px', minHeight: '3.6rem', lineHeight: '1.5' }}>{cat.desc}</p>
                  </div>
                  <Link to={cat.link} className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center', marginTop: 'auto', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t('categories.viewProducts', 'View Products')}
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
          <div className="pharma-reveal">
            <h2 className="section-title">{t('features.title', 'Why Choose Niyansh Pharma?')}</h2>
            <p className="section-subtitle">{t('features.subtitle', 'We prioritize quality, affordability, and professional distribution logistics.')}</p>
          </div>

          <div className="grid-3">
            {features.map((feat, i) => (
              <div 
                key={i} 
                className={`card card-hover-pharma pharma-reveal stagger-${(i % 3) + 1}`} 
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

      {/* Easy Ordering Process - Unclipped & Dark-Mode Native (Image Fix) */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="pharma-reveal">
            <h2 className="section-title">{t('orderingProcess.title', 'Easy Ordering Process')}</h2>
            <p className="section-subtitle">{t('orderingProcess.subtitle', 'How medical stores and healthcare institutions order from us in 4 simple steps.')}</p>
          </div>

          <div className="grid-4 pharma-steps-grid">
            {[
              { step: '01', title: t('orderingProcess.step1Title', 'Search Medicines'), desc: t('orderingProcess.step1Desc', 'Browse our product catalog by brand name, salt composition, or company.') },
              { step: '02', title: t('orderingProcess.step2Title', 'Add to Inquiry Cart'), desc: t('orderingProcess.step2Desc', 'Select required pack sizes and quantities into your inquiry cart.') },
              { step: '03', title: t('orderingProcess.step3Title', 'Confirm Store Details'), desc: t('orderingProcess.step3Desc', 'Enter your pharmacy name, mobile number, and drug license details.') },
              { step: '04', title: t('orderingProcess.step4Title', 'Instant Dispatch & Delivery'), desc: t('orderingProcess.step4Desc', 'Receive instant wholesale invoice quotation and expedited delivery.') }
            ].map((step, i) => (
              <div 
                key={i} 
                className={`pharma-step-card pharma-reveal stagger-${i + 1}`}
              >
                <div className="pharma-step-badge">
                  {step.step}
                </div>
                <h3 className="pharma-step-title">{step.title}</h3>
                <p className="pharma-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Order Form / WhatsApp Integration Section */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #1b75bc, var(--primary-blue))',
        color: '#ffffff', padding: 'clamp(40px, 6vw, 60px) 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.35rem, 4vw, 2rem)', marginBottom: '10px', lineHeight: 1.25 }}>
              {t('quickOrder.title', 'B2B Fast Quick Order Workstation')}
            </h2>
            <p style={{ color: '#e2e8f0', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', maxWidth: '700px', lineHeight: 1.55 }}>
              {t('quickOrder.subtitle', 'Search all formulations, bulk add to cart, and download or print wholesale purchase invoices instantly.')}
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <button 
              onClick={handleQuickWhatsApp} 
              className="btn btn-secondary" 
              style={{
                backgroundColor: 'var(--secondary-green)', padding: '14px 28px',
                fontSize: '0.98rem', boxShadow: '0 4px 15px rgba(56,142,60,0.3)', gap: '10px'
              }}
            >
              <MessageSquare size={18} />
              {t('hero.whatsappOrder', 'WhatsApp Order')}
            </button>
          </div>
        </div>
      </section>

      {/* Brands We Deal In Section - Bi-Directional Animated Marquees + Interactive Explorer */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
        <div className="container">
          <div className="pharma-reveal" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 24px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', backgroundColor: 'rgba(12, 61, 108, 0.08)', color: 'var(--primary-blue)', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
              <Sparkles size={15} color="var(--secondary-green)" />
              <span>{t('about.brandNetworkBadge', 'Direct Manufacturer Network')} • {brandsList.length}+ {t('about.brandsCountLabel', 'Partners')}</span>
            </div>
            <h2 className="section-title">{t('about.brandNetworkTitle', 'Our Brand Network')}</h2>
            <p className="section-subtitle">{t('about.brandNetworkSubtitle', 'Authorised distribution partner for India’s most trusted pharmaceutical manufacturers.')}</p>
          </div>

          {/* Dual Counter-Flow Animated Marquees */}
          <div className="brands-marquee-wrap">
            {/* Track 1: Streaming Left */}
            <div className="brands-marquee-container">
              <div className="brands-marquee-track">
                {track1Stream.map((brand, i) => (
                  <Link 
                    key={`t1-${i}`} 
                    to={`/products?brand=${encodeURIComponent(brand)}`}
                    title={`Browse medicines manufactured by ${brand}`}
                    className="brand-pill-card"
                  >
                    <span className="brand-pill-emblem">
                      <Building2 size={13} />
                    </span>
                    <span>{brand}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Track 2: Streaming Right in Counter-Flow Direction */}
            <div className="brands-marquee-container">
              <div className="brands-marquee-track-reverse">
                {track2Stream.map((brand, i) => (
                  <Link 
                    key={`t2-${i}`} 
                    to={`/products?brand=${encodeURIComponent(brand)}`}
                    title={`Browse medicines manufactured by ${brand}`}
                    className="brand-pill-card"
                  >
                    <span className="brand-pill-emblem">
                      <Building2 size={13} />
                    </span>
                    <span>{brand}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;

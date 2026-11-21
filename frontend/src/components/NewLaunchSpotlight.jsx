import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Percent, 
  MessageSquare, 
  Package, 
  Activity, 
  FileText, 
  Info, 
  X, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Settings,
  Edit3,
  Save,
  RotateCcw,
  Upload,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_SPOTLIGHT_DATA = {
  enabled: true,
  badgeText: 'NEW LAUNCH SPOTLIGHT • RAJKOT DEPOT',
  heading: 'Advanced Cardiovascular Formulation',
  productName: 'NAP STAR',
  productHighlight: 'A75',
  formula: 'Aspirin Gastro-resistant & Atorvastatin Capsules I.P.',
  description: 'Dual-action cardiovascular protection combining anti-platelet therapy with potent lipid regulation for cardiac defense and secondary stroke prevention.',
  image: '/banners/hero-banner-2.jpg',
  mrp: 60,
  scheme: '10 + 1 FREE',
  depotText: 'LIVE IN RAJKOT',
  dispatchText: 'Same-Day Dispatch',
  phone: '+919909923130'
};

const STORAGE_KEY = 'niyansh_new_launch_settings';

export default function NewLaunchSpotlight() {
  const { language } = useLanguage();
  const { user, token } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  // Spotlight Content State (Dynamic from DB / LocalStorage)
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_SPOTLIGHT_DATA, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not read saved spotlight data:', e);
    }
    return DEFAULT_SPOTLIGHT_DATA;
  });

  // Fetch from server API
  useEffect(() => {
    fetch('/api/settings/new-launch')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setData(prev => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(err => console.warn('Could not load remote spotlight settings:', err));
  }, []);

  // Active Hotspot state (null or index)
  const [activeHotspot, setActiveHotspot] = useState(0);

  // Admin Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(data);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 3D Card Tilt State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTilt({
      rotateX: Number(rotateX.toFixed(2)),
      rotateY: Number(rotateY.toFixed(2)),
      glareX: Number(((x / rect.width) * 100).toFixed(1)),
      glareY: Number(((y / rect.height) * 100).toFixed(1))
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    setEditForm(data);
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = { ...data, ...editForm };
      setData(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Persist to server
      await fetch('/api/settings/new-launch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
      }, 900);
    } catch (err) {
      console.error('Error saving spotlight settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset New Launch section to original defaults?')) {
      setEditForm(DEFAULT_SPOTLIGHT_DATA);
    }
  };

  // Hotspots definitions
  const hotspots = [
    {
      id: 'aspirin',
      x: '28%',
      y: '38%',
      title: 'Aspirin Gastro-Resistant (75 mg)',
      tag: language === 'gu' ? 'એન્ટિ-પ્લેટલેટ પ્રોટેક્શન' : language === 'hi' ? 'एंटी-प्लेटलेट सुरक्षा' : 'Anti-Platelet Protection',
      desc: language === 'gu'
        ? 'વિશેષ ગેસ્ટ્રો-રેઝિસ્ટન્ટ કોટિંગ જે પેટમાં એસિડિટી કે બળતરા અટકાવે છે અને લોહીને ગંઠાવા ન દઈ હૃદયની સુરક્ષા કરે છે.'
        : language === 'hi'
        ? 'विशेष गैस्ट्रो-रेसिस्टेंट कोटिंग जो पेट में एसिडिटी को रोकती है और खून का थक्का जमने से बचाकर दिल की सुरक्षा करती है।'
        : 'Special gastro-resistant enteric coating that prevents stomach irritation and inhibits blood clots for cardiac safety.'
    },
    {
      id: 'atorvastatin',
      x: '62%',
      y: '32%',
      title: 'Atorvastatin Capsules I.P.',
      tag: language === 'gu' ? 'કોલેસ્ટ્રોલ કંટ્રોલ' : language === 'hi' ? 'कोलेस्ट्रॉल नियंत्रण' : 'Lipid Regulating Statin',
      desc: language === 'gu'
        ? 'શરીરમાં ખરાબ કોલેસ્ટ્રોલ (LDL) ઘટાડે છે અને ધમનીઓમાં પ્લેક જામવાનું જોખમ અટકાવી હાર્ટ એટેકનું રિસ્ક ઘટાડે છે.'
        : language === 'hi'
        ? 'शरीर में खराब कोलेस्ट्रॉल (LDL) को कम करता है और धमनियों को स्वस्थ रखकर दिल के दौरे का खतरा कम करता है।'
        : 'Significantly lowers bad LDL cholesterol, stabilizes arterial plaques, and reduces myocardial infarction risk.'
    },
    {
      id: 'packing',
      x: '78%',
      y: '68%',
      title: '10×10 Alu-Alu Blister Pack',
      tag: language === 'gu' ? 'WHO-GMP ક્વોલિટી' : language === 'hi' ? 'WHO-GMP गुणवत्ता' : 'WHO-GMP Certified',
      desc: language === 'gu'
        ? 'સંપૂર્ણ ભેજમુક્ત Alu-Alu બ્લિસ્ટર પેકિંગ, ૧૦૦% સ્થિરતા અને શેલ્ફ-લાઇફ સાથે રાજકોટ સેન્ટ્રલ ડેપો પર ઉપલબ્ધ.'
        : language === 'hi'
        ? 'नमी-मुक्त एल्यु-एल्यु ब्लिस्टर पैकिंग, 100% स्थिरता और शेल्फ-लाइफ के साथ राजकोट डिपो पर उपलब्ध।'
        : 'Moisture-proof pharmaceutical grade blister packing with certified batch stability and laboratory testing.'
    },
    {
      id: 'scheme',
      x: '86%',
      y: '22%',
      title: `${language === 'gu' ? 'સ્પેશિયલ લૉન્ચ સ્કીમ' : 'Special Launch Scheme'} (${data.scheme})`,
      tag: `MRP ₹${data.mrp} • ${language === 'gu' ? 'ઉત્તમ માર્જિન' : 'High Margin'}`,
      desc: language === 'gu'
        ? 'કેમિસ્ટ અને ડિસ્ટ્રીબ્યુટર્સ માટે આકર્ષક ઇન્ટ્રોડક્ટરી માર્જિન અને સેમ-ડે ડિસ્પેચ સુવિધા.'
        : 'Attractive introductory margin for wholesale retailers, medical stores, and clinics across Saurashtra & Gujarat.'
    }
  ];

  // WhatsApp Order Handlers
  const handleWhatsAppScheme = () => {
    const text = language === 'gu'
      ? `નમસ્તે નિયાંશ ફાર્મા, મારે નવી લોન્ચ થયેલી ${data.productName} ${data.productHighlight || ''} (${data.scheme} સ્કીમ) વિશે માહિતી અને જથ્થાબંધ ઓર્ડર કરવો છે.`
      : `Hello Niyansh Pharma, I would like to inquire about the Wholesale Launch Offer (${data.scheme} Scheme) for ${data.productName} ${data.productHighlight || ''} Capsules.`;
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWhatsAppSample = () => {
    const text = language === 'gu'
      ? `નમસ્તે નિયાંશ ફાર્મા, મને ડોક્ટર્સ માટે ${data.productName} ${data.productHighlight || ''} નો સેમ્પલ / વિઝ્યુઅલ એઇડ પ્રોડક્ટ લિટરેચર આપવા વિનંતી.`
      : `Hello Niyansh Pharma, please provide doctor trial samples and visual aid monograph for ${data.productName} ${data.productHighlight || ''} Capsules.`;
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (data.enabled === false) return null;

  return (
    <section 
      className="new-launch-spotlight-section"
      style={{
        position: 'relative',
        padding: 'clamp(48px, 6vw, 84px) 0',
        backgroundColor: '#061325',
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.14) 0%, rgba(12, 61, 108, 0.45) 45%, rgba(6, 19, 37, 0.98) 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Background Animated Heartbeat ECG Waveform SVG */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.15,
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        <svg 
          viewBox="0 0 1200 200" 
          preserveAspectRatio="none" 
          style={{ width: '200%', height: '100%', position: 'absolute', left: 0, top: '20%' }}
        >
          <path
            d="M 0 100 L 250 100 L 270 70 L 285 140 L 305 20 L 325 180 L 340 85 L 355 105 L 370 100 L 600 100 L 620 70 L 635 140 L 655 20 L 675 180 L 690 85 L 705 105 L 720 100 L 1000 100 L 1020 70 L 1035 140 L 1055 20 L 1075 180 L 1090 85 L 1105 105 L 1120 100 L 1400 100"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(74, 222, 128, 0.4)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.7px', color: '#86efac', marginBottom: '10px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e', display: 'inline-block' }} />
              <span>{data.badgeText || 'NEW LAUNCH SPOTLIGHT • RAJKOT DEPOT'}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.8vw, 2.7rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.15, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              {data.heading || (language === 'gu' ? 'હૃદયની રક્ષા માટે નવીનતમ ફોર્મ્યુલેશન' : 'Advanced Cardiovascular Formulation')}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#4ade80" /> Rajkot, Gujarat
            </span>

            {/* Admin Quick Edit Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenEdit}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(74, 222, 128, 0.5)',
                  color: '#86efac',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Edit3 size={14} />
                <span>Admin: Edit Photo & Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(24px, 4vw, 44px)',
            alignItems: 'center'
          }}
        >
          
          {/* Left Column: Product Information & B2B Wholesale Details */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px' }}>
                By Niyansh Pharma
              </span>
              <h3 style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)', fontWeight: '900', color: '#ffffff', margin: '4px 0 8px 0', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                {data.productName} <span style={{ color: '#4ade80' }}>{data.productHighlight || ''}</span>
              </h3>
              <p style={{ fontSize: '1.08rem', color: '#e2e8f0', fontWeight: '600', margin: '0 0 14px 0' }}>
                {data.formula}
              </p>
              <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: '1.65', margin: 0 }}>
                {data.description}
              </p>
            </div>

            {/* Indication Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
              {['#Cardiology', '#AntiPlatelet', '#LipidLowering', '#HeartProtection', '#WHO-GMP'].map((tag, i) => (
                <span 
                  key={i}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    color: '#86efac',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Clinical Benefit Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.92rem', color: '#e2e8f0' }}>
                  <strong>{language === 'gu' ? 'હાર્ટ પ્રોટેક્શન:' : 'Heart Protection:'}</strong> {language === 'gu' ? 'ધમનીઓમાં લોહી ગંઠાવાનું જોખમ ઘટાડે છે.' : 'Inhibits thrombus formation in coronary arteries.'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.92rem', color: '#e2e8f0' }}>
                  <strong>{language === 'gu' ? 'કોલેસ્ટ્રોલ કંટ્રોલ:' : 'Cholesterol Control:'}</strong> {language === 'gu' ? 'ખરાબ કોલેસ્ટ્રોલ (LDL) ને નિયંત્રિત કરી હૃદયને સ્વસ્થ રાખે છે.' : 'Reduces circulating LDL and total cholesterol levels.'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.92rem', color: '#e2e8f0' }}>
                  <strong>{language === 'gu' ? 'ગેસ્ટ્રો-રેઝિસ્ટન્ટ:' : 'Gastro-Resistant:'}</strong> {language === 'gu' ? 'પેટમાં એસિડિટી કે દુઃખાવો થતો નથી.' : 'Enteric coated for superior stomach tolerance.'}
                </span>
              </div>
            </div>

            {/* B2B Wholesale Chemist Launch Scheme Box */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.7px', color: '#cbd5e1', display: 'block', fontWeight: '700' }}>
                  {language === 'gu' ? 'સ્પેશિયલ કેમિસ્ટ લૉન્ચ સ્કીમ' : 'EXCLUSIVE WHOLESALE LAUNCH OFFER'}
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#4ade80' }}>
                  {data.scheme} <span style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: '600' }}>• MRP ₹{data.mrp}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#22c55e', color: '#ffffff', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'inline-block' }}>
                  {data.depotText || 'LIVE IN RAJKOT'}
                </span>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                  {data.dispatchText || 'Same-Day Dispatch'}
                </div>
              </div>
            </div>

            {/* High-Impact Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                type="button"
                onClick={handleWhatsAppScheme}
                style={{
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '12px 22px',
                  fontSize: '0.94rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageSquare size={18} />
                <span>{language === 'gu' ? 'WhatsApp પર લૉન્ચ સ્કીમ ઓર્ડર કરો' : `Order ${data.scheme} via WhatsApp`}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSample}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '30px',
                  padding: '12px 20px',
                  fontSize: '0.94rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <FileText size={17} />
                <span>{language === 'gu' ? 'ડોક્ટર સેમ્પલ / લિટરેચર' : 'Request Doctor Sample'}</span>
              </button>

              <Link
                to="/quick-order"
                style={{
                  backgroundColor: 'transparent',
                  color: '#93c5fd',
                  border: '1px solid rgba(147, 197, 253, 0.3)',
                  borderRadius: '30px',
                  padding: '12px 18px',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <Package size={17} />
                <span>{language === 'gu' ? 'ક્વિક ઓર્ડર' : 'Quick Order'}</span>
              </Link>
            </div>

          </div>

          {/* Right Column: 3D Interactive Product Box with Hotspots */}
          <div style={{ position: 'relative', perspective: '1200px' }}>
            
            {/* 3D Tilt Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'rgba(15, 30, 56, 0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 35px rgba(34, 197, 94, 0.15)',
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
                cursor: 'crosshair'
              }}
            >
              {/* Product Poster Image */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1024 / 520', overflow: 'hidden' }}>
                <img 
                  src={data.image || '/banners/hero-banner-2.jpg'} 
                  alt={data.productName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/pharma-products.jpg';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Specular Glare Effect */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
                    transition: 'background 0.1s ease-out'
                  }}
                />

                {/* Hotspot Pins (Clickable Glowing Dots) */}
                {hotspots.map((hs, idx) => {
                  const isSelected = activeHotspot === idx;
                  return (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => setActiveHotspot(idx)}
                      title={hs.title}
                      aria-label={hs.title}
                      style={{
                        position: 'absolute',
                        left: hs.x,
                        top: hs.y,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        width: isSelected ? '34px' : '28px',
                        height: isSelected ? '34px' : '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#22c55e' : 'rgba(8, 20, 38, 0.85)',
                        border: isSelected ? '2px solid #ffffff' : '2px solid #4ade80',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isSelected 
                          ? '0 0 20px rgba(34, 197, 94, 1)' 
                          : '0 0 12px rgba(34, 197, 94, 0.6)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <Sparkles size={isSelected ? 16 : 13} />
                    </button>
                  );
                })}
              </div>

              {/* Active Hotspot Detail Drawer */}
              {activeHotspot !== null && (
                <div 
                  style={{
                    padding: '16px 20px',
                    backgroundColor: 'rgba(6, 19, 37, 0.95)',
                    borderTop: '1px solid rgba(74, 222, 128, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', backgroundColor: '#22c55e', color: '#ffffff', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                        {hotspots[activeHotspot].tag}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#ffffff', fontWeight: '700' }}>
                        {hotspots[activeHotspot].title}
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {activeHotspot + 1} / {hotspots.length}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {hotspots[activeHotspot].desc}
                  </p>
                </div>
              )}

              {/* Hotspot Switcher Tabs */}
              <div 
                style={{
                  display: 'flex',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(4, 12, 24, 0.6)'
                }}
              >
                {hotspots.map((hs, idx) => (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => setActiveHotspot(idx)}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeHotspot === idx ? '2px solid #22c55e' : '2px solid transparent',
                      color: activeHotspot === idx ? '#4ade80' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {hs.id === 'aspirin' ? 'Aspirin 75' : hs.id === 'atorvastatin' ? 'Atorvastatin' : hs.id === 'packing' ? 'Alu-Alu' : `Scheme ${data.scheme}`}
                  </button>
                ))}
              </div>

            </div>

            {/* Hint for visitor */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>
              💡 {language === 'gu' ? '૩D ઇફેક્ટ જોવા માઉસ ફેરવો અને વિશેષતાઓ માટે સ્પૉટ્સ પર ક્લિક કરો' : 'Hover to tilt in 3D • Click glowing pins for clinical formulation details'}
            </div>

          </div>

        </div>

      </div>

      {/* Admin Edit Modal */}
      {isEditModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={20} color="#4ade80" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Admin: Edit New Launch Spotlight</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {saveSuccess && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', borderRadius: '10px', color: '#86efac', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '700' }}>
                <Check size={18} /> Settings & Photo saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              {/* Image Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Product Image / Poster Path *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    required
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    placeholder="/banners/hero-banner-2.jpg or https://..."
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                  Tip: You can use <code>/banners/hero-banner-2.jpg</code>, <code>/banners/hero-banner-3.jpg</code>, or paste any direct image URL.
                </div>
              </div>

              {/* Product Titles */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Product Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.productName}
                    onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                    placeholder="e.g. NAP STAR"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Strength / Suffix
                  </label>
                  <input
                    type="text"
                    value={editForm.productHighlight}
                    onChange={(e) => setEditForm({ ...editForm, productHighlight: e.target.value })}
                    placeholder="e.g. A75"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Formula */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Salt / Generic Composition
                </label>
                <input
                  type="text"
                  value={editForm.formula}
                  onChange={(e) => setEditForm({ ...editForm, formula: e.target.value })}
                  placeholder="e.g. Aspirin Gastro-resistant & Atorvastatin Capsules I.P."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              {/* Pricing & Scheme */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Wholesale Launch Scheme
                  </label>
                  <input
                    type="text"
                    value={editForm.scheme}
                    onChange={(e) => setEditForm({ ...editForm, scheme: e.target.value })}
                    placeholder="e.g. 10 + 1 FREE"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editForm.mrp}
                    onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                    placeholder="60"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <RotateCcw size={13} /> Reset Defaults
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    style={{ padding: '9px 18px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', fontSize: '0.88rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      padding: '9px 22px',
                      borderRadius: '8px',
                      backgroundColor: '#22c55e',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      cursor: isSaving ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    <Save size={15} />
                    <span>{isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}

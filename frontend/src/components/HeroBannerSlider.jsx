import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  ExternalLink,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Default initial banners created from the user's uploaded artwork
export const DEFAULT_HERO_SLIDES = [
  {
    id: 'banner-empowering-health',
    image: '/banners/hero-banner-1.jpg',
    title: 'Empowering Health Through Advanced Care',
    subtitle: 'Newly launched range of cardiovascular & diabetic care solutions',
    link: '/products',
    badge: 'Cardiovascular & Diabetes',
    alt: 'Niyansh Pharma - Empowering Health Through Advanced Care'
  },
  {
    id: 'banner-napstar-a75-dark',
    image: '/banners/hero-banner-2.jpg',
    title: 'NAP STAR A75 Capsules',
    subtitle: 'Aspirin Gastro-resistant & Atorvastatin Capsules I.P. • MRP ₹60',
    link: '/products?search=NAP%20STAR',
    badge: 'Newly Launched',
    alt: 'NAP STAR A75 Capsules - Niyansh Pharma Rajkot'
  },
  {
    id: 'banner-napstar-a75-launch',
    image: '/banners/hero-banner-3.jpg',
    title: 'Newly Launched by Niyansh Pharma',
    subtitle: 'NAP STAR A75 • For a Healthy Heart & Better Life',
    link: '/quick-order',
    badge: 'Special Announcement',
    alt: 'Newly Launched NAP STAR A75 by Niyansh Pharma'
  }
];

const STORAGE_KEY = 'niyansh_hero_slides';
const AUTOPLAY_INTERVAL = 4800; // 4.8 seconds

export default function HeroBannerSlider() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  // Load slides from localStorage or fallback to defaults
  const [slides, setSlides] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved slides:', e);
    }
    return DEFAULT_HERO_SLIDES;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // New slide form state
  const [newImage, setNewImage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newLink, setNewLink] = useState('/products');
  const [newBadge, setNewBadge] = useState('New');

  // Swipe & drag tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const hasMoved = useRef(false);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Autoplay timer with progress bar
  useEffect(() => {
    if (slides.length <= 1 || isPaused || isManagerOpen) return;

    const tickInterval = 50; // update progress every 50ms
    const step = (tickInterval / AUTOPLAY_INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          nextSlide();
          return 0;
        }
        return old + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, isManagerOpen, nextSlide]);

  // Touch handlers for mobile/tablet swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    isSwiping.current = true;
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.touches[0].clientX;
    const diffX = Math.abs(touchEndX.current - touchStartX.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (diffX > 10 && diffX > diffY) {
      hasMoved.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 45 && hasMoved.current) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  // Handle slide click to navigate
  const handleSlideClick = (slide) => {
    if (hasMoved.current) return; // Prevent navigation when swiping
    if (slide.link) {
      if (slide.link.startsWith('http')) {
        window.open(slide.link, '_blank');
      } else {
        navigate(slide.link);
      }
    }
  };

  // Persist slides to localStorage and optionally API
  const saveSlides = (updatedSlides) => {
    setSlides(updatedSlides);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSlides));
      window.dispatchEvent(new Event('hero-slides-updated'));
    } catch (e) {
      console.error('Failed to save slides:', e);
    }
  };

  // Slide Manager Actions
  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!newImage.trim()) return;
    const newSlide = {
      id: `banner-${Date.now()}`,
      image: newImage.trim(),
      title: newTitle.trim() || 'Special Showcase',
      subtitle: newSubtitle.trim() || 'Quality Pharmaceutical Formulations',
      link: newLink.trim() || '/products',
      badge: newBadge.trim() || 'Featured',
      alt: newTitle.trim() || 'Niyansh Pharma Promotional Banner'
    };
    const updated = [...slides, newSlide];
    saveSlides(updated);
    setNewImage('');
    setNewTitle('');
    setNewSubtitle('');
    setNewLink('/products');
    setNewBadge('New');
  };

  const handleDeleteSlide = (id) => {
    if (slides.length <= 1) {
      alert('You must keep at least one slide in the carousel.');
      return;
    }
    const updated = slides.filter(s => s.id !== id);
    saveSlides(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(0);
    }
  };

  const handleMoveSlide = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    saveSlides(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all banners to the original uploaded posters?')) {
      saveSlides(DEFAULT_HERO_SLIDES);
      setCurrentIndex(0);
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      className="hero-slider-wrapper" 
      aria-label="Promotional Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: '#061325',
        outline: 'none',
        userSelect: 'none'
      }}
    >
      {/* Aspect-Ratio Box preserving 1024x373 (2.745:1 ratio) */}
      <div 
        className="hero-slider-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1024 / 373',
          maxHeight: 'min(580px, 42vw)',
          minHeight: '140px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Slides Track */}
        <div 
          className="hero-slider-track"
          style={{
            display: 'flex',
            width: `${slides.length * 100}%`,
            height: '100%',
            transform: `translateX(-${(currentIndex * 100) / slides.length}%)`,
            transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform'
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="hero-slider-slide"
              onClick={() => handleSlideClick(slide)}
              style={{
                position: 'relative',
                flex: `0 0 ${100 / slides.length}%`,
                width: `${100 / slides.length}%`,
                height: '100%',
                cursor: slide.link ? 'pointer' : 'default',
                overflow: 'hidden',
                backgroundColor: '#061325'
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt || slide.title || 'Niyansh Pharma Banner'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }}
              />

              {/* Subtle hover gradient for interactive visual depth */}
              <div 
                className="hero-slide-interactive-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(6, 19, 37, 0.25) 0%, transparent 40%)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Left Navigation Arrow */}
        {slides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Slide"
            className="hero-slider-nav-btn hero-slider-prev-btn"
            style={{
              position: 'absolute',
              left: 'clamp(8px, 1.8vw, 24px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: 'clamp(34px, 3.4vw, 46px)',
              height: 'clamp(34px, 3.4vw, 46px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 20, 38, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
        )}

        {/* Right Navigation Arrow */}
        {slides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Slide"
            className="hero-slider-nav-btn hero-slider-next-btn"
            style={{
              position: 'absolute',
              right: 'clamp(8px, 1.8vw, 24px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: 'clamp(34px, 3.4vw, 46px)',
              height: 'clamp(34px, 3.4vw, 46px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 20, 38, 0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ChevronRight size={22} strokeWidth={2.4} />
          </button>
        )}

        {/* Bottom Pagination Indicators */}
        {slides.length > 1 && (
          <div 
            className="hero-slider-pagination"
            style={{
              position: 'absolute',
              bottom: 'clamp(8px, 1.5vw, 18px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 1vw, 10px)',
              padding: '5px 12px',
              borderRadius: '24px',
              backgroundColor: 'rgba(4, 12, 24, 0.55)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}
          >
            {slides.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: isActive ? 'clamp(22px, 2.5vw, 32px)' : 'clamp(7px, 1vw, 9px)',
                    height: 'clamp(7px, 1vw, 9px)',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.45)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 12px rgba(34, 197, 94, 0.85)' : 'none',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Slide Counter Badge (Top Right) */}
        <div 
          style={{
            position: 'absolute',
            top: 'clamp(8px, 1.4vw, 16px)',
            right: 'clamp(10px, 1.8vw, 24px)',
            zIndex: 15,
            padding: '3px 10px',
            borderRadius: '16px',
            backgroundColor: 'rgba(4, 12, 24, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            fontSize: 'clamp(0.68rem, 1.1vw, 0.78rem)',
            fontWeight: '700',
            letterSpacing: '0.6px',
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          <span style={{ color: '#4ade80' }}>{currentIndex + 1}</span>
          <span style={{ opacity: 0.5, margin: '0 4px' }}>/</span>
          <span>{slides.length}</span>
        </div>

        {/* Admin Quick Manage Trigger */}
        {isAdmin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsManagerOpen(true);
            }}
            title="Manage Hero Carousel Slides"
            style={{
              position: 'absolute',
              top: 'clamp(8px, 1.4vw, 16px)',
              left: 'clamp(10px, 1.8vw, 24px)',
              zIndex: 15,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              color: '#86efac',
              fontSize: 'clamp(0.68rem, 1vw, 0.75rem)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Sliders size={13} />
            <span>Manage Slides</span>
          </button>
        )}
      </div>

      {/* Autoplay Progress Line Indicator (Bottom Edge) */}
      <div 
        style={{
          width: '100%',
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#22c55e',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.9)',
            transition: isPaused ? 'none' : 'width 50ms linear'
          }}
        />
      </div>

      {/* Admin Slide Management Modal */}
      {isManagerOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsManagerOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders size={20} color="#4ade80" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Hero Carousel Slide Manager</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsManagerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Slides List */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e2e8f0', fontWeight: '600' }}>Active Slides ({slides.length})</h4>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={12} /> Reset to Default Posters
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {slides.map((s, idx) => (
                  <div 
                    key={s.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '10px 14px'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', width: '20px' }}>
                      #{idx + 1}
                    </span>
                    <img 
                      src={s.image} 
                      alt="" 
                      style={{ width: '80px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Link: {s.link || 'None'}
                      </div>
                    </div>
                    {/* Reorder and Delete Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: 'none', color: idx === 0 ? '#475569' : '#ffffff', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, 1)}
                        disabled={idx === slides.length - 1}
                        title="Move Down"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: 'none', color: idx === slides.length - 1 ? '#475569' : '#ffffff', cursor: idx === slides.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(s.id)}
                        title="Delete Slide"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Slide Form */}
            <form onSubmit={handleAddSlide} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', color: '#4ade80', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add New Slide
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Image URL or Path * (1024 × 373 px recommended)</label>
                  <input
                    type="text"
                    required
                    placeholder="/banners/hero-banner-1.jpg or https://..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.86rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiovascular Care Range"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.86rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>Click Destination Link</label>
                  <input
                    type="text"
                    placeholder="/products or /quick-order"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.86rem' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                }}
              >
                <Plus size={16} /> Add to Carousel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

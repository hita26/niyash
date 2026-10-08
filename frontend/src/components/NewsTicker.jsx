import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  TrendingDown, 
  Sparkles, 
  Bell, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  X, 
  MessageSquare, 
  PhoneCall, 
  ExternalLink, 
  Calendar, 
  Building2, 
  ArrowRight,
  Radio
} from 'lucide-react';

const FALLBACK_TICKER_ITEMS = [
  {
    _id: 'mock-1',
    title: 'Special Monsoon Scheme: Buy 10 Get 1 Free on all Daxia Formulations',
    content: 'Avail 10+1 free bonus strip on Mucidax 600, Clobedax-GM Cream, and Moxidax-D drops throughout this month. Fast dispatch and standard WHO-GMP quality guaranteed across Gujarat.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: '2026-09-30T23:59:59.000Z',
    createdAt: '2026-08-18T10:00:00.000Z'
  },
  {
    _id: 'mock-2',
    title: 'New Product Launch: Lulidax 1% Cream 30g & Ketodax 2% Soap',
    content: 'High-potency dermatological range now available in bulk for wholesale booking. Attractive PTR rates with WHO-GMP certification. Order today for prompt delivery.',
    category: 'New Launch',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 2,
    expiryDate: '2026-10-15T23:59:59.000Z',
    createdAt: '2026-08-19T14:30:00.000Z'
  },
  {
    _id: 'mock-3',
    title: 'Price Drop Alert: Ceftriaxone 1gm & Pantoprazole 40mg Injections',
    content: 'Direct manufacturer PTR reduced by 8% on hospital critical care injectable batches. Check revised pricing in Quick Order portal or contact our wholesale desk.',
    category: 'Price Update',
    company: 'General',
    isTickerActive: true,
    priority: 3,
    expiryDate: '2026-09-15T23:59:59.000Z',
    createdAt: '2026-08-20T09:15:00.000Z'
  },
  {
    _id: 'mock-4',
    title: 'Ayurvedic Rasayan & Herbal Joint Oils Special 15+2 Scheme',
    content: 'Order 15 boxes of Mahavishgarbha Pain Oil (100ml) or Ashwagandhadax Rasayan (200ml) and receive 2 complimentary retail boxes plus promotional counter displays.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: '2026-09-25T23:59:59.000Z',
    createdAt: '2026-08-21T11:45:00.000Z'
  },
  {
    _id: 'mock-5',
    title: 'GST Regulatory Notice: E-Invoicing Updates for Pharma Retailers',
    content: 'Please ensure valid 15-digit GSTIN is updated on your retailer profile for automated QR code tax invoices and seamless input tax credit compliance.',
    category: 'Notice',
    company: 'General',
    isTickerActive: true,
    priority: 4,
    expiryDate: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-08-22T08:00:00.000Z'
  }
];

function NewsTicker() {
  const [newsList, setNewsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch news ticker announcements
  useEffect(() => {
    let isMounted = true;
    const fetchTickerNews = async () => {
      try {
        const response = await fetch('/api/news?ticker=true&limit=10');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          if (data && data.success && Array.isArray(data.news) && data.news.length > 0) {
            setNewsList(data.news);
          } else {
            setNewsList(FALLBACK_TICKER_ITEMS);
          }
        }
      } catch (err) {
        console.warn('News ticker API offline or unreachable, using default announcements:', err.message);
        if (isMounted) {
          setNewsList(FALLBACK_TICKER_ITEMS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTickerNews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance ticker every 5.5 seconds unless paused or modal open
  useEffect(() => {
    if (newsList.length <= 1 || isPaused || selectedNews) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [newsList.length, isPaused, selectedNews, currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
      setIsTransitioning(false);
    }, 200);
  };

  const getCategoryMeta = (category) => {
    switch (category) {
      case 'Scheme':
        return {
          icon: <Flame size={13} />,
          label: 'Scheme',
          bgColor: '#fff7ed',
          textColor: '#c2410c',
          borderColor: '#ffedd5',
          gradient: 'linear-gradient(135deg, #ea580c, #f97316)'
        };
      case 'Price Update':
        return {
          icon: <TrendingDown size={13} />,
          label: 'Price Update',
          bgColor: '#ecfdf5',
          textColor: '#047857',
          borderColor: '#d1fae5',
          gradient: 'linear-gradient(135deg, #059669, #10b981)'
        };
      case 'New Launch':
        return {
          icon: <Sparkles size={13} />,
          label: 'New Launch',
          bgColor: '#f5f3ff',
          textColor: '#6d28d9',
          borderColor: '#ede9fe',
          gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
        };
      case 'Notice':
        return {
          icon: <Bell size={13} />,
          label: 'Notice',
          bgColor: '#eff6ff',
          textColor: '#1d4ed8',
          borderColor: '#dbeafe',
          gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)'
        };
      default:
        return {
          icon: <Globe size={13} />,
          label: category || 'News',
          bgColor: '#f8fafc',
          textColor: '#334155',
          borderColor: '#e2e8f0',
          gradient: 'linear-gradient(135deg, #475569, #64748b)'
        };
    }
  };

  const formatExpiry = (dateString) => {
    if (!dateString) return null;
    const expiry = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Expired', isExpired: true };
    }
    if (diffDays === 0) {
      return { text: 'Expires Today', isUrgent: true };
    }
    if (diffDays === 1) {
      return { text: 'Expires Tomorrow', isUrgent: true };
    }
    if (diffDays <= 7) {
      return { text: `${diffDays} days left`, isUrgent: true };
    }
    return { 
      text: `Valid till ${expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
      isUrgent: false 
    };
  };

  const handleShareWhatsApp = (newsItem) => {
    if (!newsItem) return;
    const expiryText = newsItem.expiryDate 
      ? new Date(newsItem.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Limited Time Offer';

    const message = `📢 *NIYANSH PHARMA - ${newsItem.category.toUpperCase()} UPDATE* 📢\n\n` +
      `📌 *${newsItem.title}*\n` +
      `🏢 *Company / Brand:* ${newsItem.company || 'General'}\n` +
      `🏷️ *Category:* ${newsItem.category}\n` +
      `⏳ *Validity:* ${expiryText}\n\n` +
      `📝 *Details:*\n${newsItem.content}\n\n` +
      `📞 *Order / Enquiries:* +91 99099 23130\n` +
      `📍 Niyansh Pharma, Rajkot, Gujarat\n` +
      `🌐 https://niyanshpharma.com/news`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919909923130?text=${encoded}`, '_blank');
  };

  if (newsList.length === 0 && !isLoading) {
    return null;
  }

  const currentItem = newsList[currentIndex] || FALLBACK_TICKER_ITEMS[0];
  const catMeta = getCategoryMeta(currentItem.category);
  const expiryInfo = formatExpiry(currentItem.expiryDate);

  return (
    <>
      {/* Dynamic News Ticker Banner */}
      <div 
        className="news-ticker-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          backgroundColor: '#072340',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#ffffff',
          position: 'relative',
          zIndex: 90,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        <div 
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 20px',
            minHeight: '44px',
            gap: '12px'
          }}
        >
          {/* Live Badge */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0
            }}
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: '800',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
              }}
            >
              <span 
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'inline-block',
                  animation: 'pulse 1.5s infinite'
                }} 
              />
              <Radio size={12} />
              <span className="live-badge-text">LIVE SCHEMES</span>
            </div>
          </div>

          {/* Cycling News Content Area */}
          <div 
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(4px)' : 'translateY(0)',
              transition: 'opacity 0.2s ease, transform 0.2s ease'
            }}
            onClick={() => setSelectedNews(currentItem)}
            title="Click to view full scheme details"
          >
            {/* Category Pill */}
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: catMeta.bgColor,
                color: catMeta.textColor,
                border: `1px solid ${catMeta.borderColor}`,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: '700',
                flexShrink: 0
              }}
            >
              {catMeta.icon}
              <span className="ticker-cat-name">{catMeta.label}</span>
            </span>

            {/* Company Tag */}
            {currentItem.company && currentItem.company !== 'General' && (
              <span 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#93c5fd',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '0.4px',
                  flexShrink: 0
                }}
              >
                {currentItem.company}
              </span>
            )}

            {/* Title Text */}
            <span 
              className="ticker-headline"
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}
            >
              {currentItem.title}
            </span>

            {/* Expiry Pill */}
            {expiryInfo && (
              <span 
                className="ticker-expiry-badge"
                style={{
                  backgroundColor: expiryInfo.isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                  color: expiryInfo.isUrgent ? '#fca5a5' : '#86efac',
                  border: `1px solid ${expiryInfo.isUrgent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.3)'}`,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {expiryInfo.text}
              </span>
            )}
          </div>

          {/* Controls & Links */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            {/* View Details Quick Button */}
            <button
              onClick={() => setSelectedNews(currentItem)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '3px 9px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Read Full Announcement"
            >
              <Info size={12} />
              <span className="view-details-text">Details</span>
            </button>

            {/* Manual Navigation Arrows */}
            <div className="ticker-nav-arrows" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <button
                onClick={handlePrev}
                aria-label="Previous announcement"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  border: 'none',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next announcement"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  border: 'none',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* All Schemes Page Link */}
            <Link
              to="/news"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: 'var(--secondary-green)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '3px 10px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textDecoration: 'none',
                marginLeft: '4px'
              }}
            >
              <span>All Feed</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Full Scheme Announcement Modal */}
      {selectedNews && (
        <div 
          className="modal-backdrop-center"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '0',
              overflow: 'hidden',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: 'linear-gradient(135deg, #f8fafc, #edf2f7)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {(() => {
                    const meta = getCategoryMeta(selectedNews.category);
                    return (
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: meta.gradient,
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                    );
                  })()}

                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(12, 61, 108, 0.1)',
                      color: 'var(--primary-blue)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}
                  >
                    <Building2 size={12} />
                    {selectedNews.company || 'DAXIA Healthcare'}
                  </span>

                  {selectedNews.expiryDate && (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      <Calendar size={12} />
                      Valid till {new Date(selectedNews.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-blue)', lineHeight: '1.35', fontWeight: '800' }}>
                  {selectedNews.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: '15px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div 
                style={{
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid var(--primary-blue)',
                  padding: '16px 20px',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '20px',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: 'var(--text-dark)'
                }}
              >
                {selectedNews.content}
              </div>

              {/* Scheme Benefit Highlight Box if category is Scheme */}
              {selectedNews.category === 'Scheme' && (
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                    border: '1px solid #fed7aa',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Flame size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#9a3412', marginBottom: '2px' }}>
                      Special Wholesale Scheme Active
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#c2410c', margin: 0 }}>
                      Qualifies for extra free goods and higher profit margins for registered pharmacies & medical stores.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Guidance */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '25px', lineHeight: '1.5' }}>
                💡 <strong>How to claim:</strong> Mention this scheme notice when placing your purchase order through WhatsApp, phone booking, or via our online Enquiry Cart.
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => handleShareWhatsApp(selectedNews)}
                  className="btn"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <MessageSquare size={18} />
                  Claim Scheme / Share on WhatsApp
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <a
                    href="tel:+919909923130"
                    className="btn btn-outline"
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <PhoneCall size={14} />
                    Call +91 99099 23130
                  </a>

                  <Link
                    to="/news"
                    onClick={() => setSelectedNews(null)}
                    className="btn"
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: 'var(--text-dark)',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <ExternalLink size={14} />
                    All Daily Schemes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for ticker responsive behavior */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        @media (max-width: 768px) {
          .live-badge-text {
            display: none;
          }
          .ticker-cat-name {
            display: none;
          }
          .ticker-expiry-badge {
            display: none;
          }
          .view-details-text {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .news-ticker-container {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
}

export default NewsTicker;

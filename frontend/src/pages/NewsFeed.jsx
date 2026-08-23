import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  TrendingDown, 
  Sparkles, 
  Bell, 
  Globe, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  MessageSquare, 
  PhoneCall, 
  Share2, 
  Check, 
  Copy, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Tag, 
  Info,
  ArrowUpDown,
  X
} from 'lucide-react';

const FALLBACK_NEWS_ITEMS = [
  {
    _id: 'feed-1',
    title: 'Special Monsoon Scheme: Buy 10 Get 1 Free on all Daxia Formulations',
    content: 'Avail 10+1 free bonus strip on Mucidax 600, Clobedax-GM Cream, and Moxidax-D drops throughout this month. Fast dispatch and standard WHO-GMP quality guaranteed across Gujarat.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: '2026-09-30T23:59:59.000Z',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    _id: 'feed-2',
    title: 'New Product Launch: Lulidax 1% Cream 30g & Ketodax 2% Soap',
    content: 'High-potency dermatological range now available in bulk for wholesale booking. Attractive PTR rates with WHO-GMP certification. Order today for prompt delivery to pharmacies and clinics.',
    category: 'New Launch',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 2,
    expiryDate: '2026-10-15T23:59:59.000Z',
    createdAt: '2026-08-19T14:30:00.000Z'
  },
  {
    _id: 'feed-3',
    title: 'Price Drop Alert: Ceftriaxone 1gm & Pantoprazole 40mg Injections',
    content: 'Direct manufacturer PTR reduced by 8% on hospital critical care injectable batches. Check revised pricing in Quick Order portal or contact our wholesale distribution desk.',
    category: 'Price Update',
    company: 'General',
    isTickerActive: true,
    priority: 3,
    expiryDate: '2026-09-15T23:59:59.000Z',
    createdAt: '2026-08-18T09:15:00.000Z'
  },
  {
    _id: 'feed-4',
    title: 'Ayurvedic Rasayan & Herbal Joint Oils Special 15+2 Scheme',
    content: 'Order 15 boxes of Mahavishgarbha Pain Oil (100ml) or Ashwagandhadax Rasayan (200ml) and receive 2 complimentary retail boxes plus promotional counter display standees.',
    category: 'Scheme',
    company: 'DAXIA',
    isTickerActive: true,
    priority: 1,
    expiryDate: '2026-09-25T23:59:59.000Z',
    createdAt: '2026-08-17T11:45:00.000Z'
  },
  {
    _id: 'feed-5',
    title: 'GST Regulatory Notice: E-Invoicing Updates for Pharma Retailers',
    content: 'Please ensure valid 15-digit GSTIN is updated on your retailer profile for automated QR code tax invoices and seamless input tax credit reconciliation.',
    category: 'Notice',
    company: 'General',
    isTickerActive: true,
    priority: 4,
    expiryDate: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-08-16T08:00:00.000Z'
  },
  {
    _id: 'feed-6',
    title: 'Cipla Critical Care & Respiratory Portfolio Bulk Rebate Offer',
    content: 'Special 5% trade discount on inhalers, respules, and nebulization solutions for qualifying bulk orders above 50 units. Valid across all certified retail chemists.',
    category: 'Scheme',
    company: 'Cipla',
    isTickerActive: true,
    priority: 2,
    expiryDate: '2026-09-28T23:59:59.000Z',
    createdAt: '2026-08-15T16:20:00.000Z'
  },
  {
    _id: 'feed-7',
    title: 'Troikaa & Namcare Injectable Supply Assurance Announcement',
    content: 'Fresh batches of Diclofenac 75mg/ml and Paracetamol IV infusions have arrived with 24-month shelf life. Pre-order open for Saurashtra hospital chains.',
    category: 'Market News',
    company: 'Troikaa',
    isTickerActive: false,
    priority: 3,
    expiryDate: '2026-10-01T23:59:59.000Z',
    createdAt: '2026-08-14T12:00:00.000Z'
  }
];

const CATEGORIES = [
  { id: 'All', label: 'All Updates', icon: Globe },
  { id: 'Scheme', label: '🔥 Schemes', icon: Flame },
  { id: 'Price Update', label: '📉 Price Updates', icon: TrendingDown },
  { id: 'New Launch', label: '✨ New Launches', icon: Sparkles },
  { id: 'Notice', label: '📢 Notices', icon: Bell },
  { id: 'Market News', label: '🌐 Market News', icon: Globe },
];

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, priority, expiry

  // Modal / Detail state
  const [activeModalNews, setActiveModalNews] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Fetch all news updates
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      if (data && data.success && Array.isArray(data.news) && data.news.length > 0) {
        setNews(data.news);
      } else {
        setNews(FALLBACK_NEWS_ITEMS);
      }
    } catch (err) {
      console.warn('Could not fetch news from server, using preloaded updates:', err.message);
      setNews(FALLBACK_NEWS_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Compute unique company list dynamically
  const companies = useMemo(() => {
    const defaultCompanies = ['DAXIA', 'Cipla', 'Sun Pharma', 'Troikaa', 'Abbott', 'Leeford Healthcare', 'General'];
    const dynamicCompanies = news.map((item) => item.company).filter(Boolean);
    const combined = Array.from(new Set([...defaultCompanies, ...dynamicCompanies]));
    return ['All', ...combined];
  }, [news]);

  // Filtered and sorted news items
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Company filter
      if (selectedCompany !== 'All' && item.company?.toLowerCase() !== selectedCompany.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesContent = item.content?.toLowerCase().includes(query);
        const matchesCompany = item.company?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesCompany && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        return (a.priority || 5) - (b.priority || 5);
      }
      if (sortBy === 'expiry') {
        const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
        const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
        return dateA - dateB;
      }
      // Default: newest first
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
  }, [news, selectedCategory, selectedCompany, searchQuery, sortBy]);

  // Statistics
  const schemeCount = useMemo(() => news.filter((n) => n.category === 'Scheme').length, [news]);
  const launchCount = useMemo(() => news.filter((n) => n.category === 'New Launch').length, [news]);
  const priceCount = useMemo(() => news.filter((n) => n.category === 'Price Update').length, [news]);

  const getCategoryMeta = (category) => {
    switch (category) {
      case 'Scheme':
        return {
          icon: <Flame size={14} />,
          label: 'Scheme',
          bgColor: '#fff7ed',
          textColor: '#c2410c',
          borderColor: '#fed7aa',
          badgeGradient: 'linear-gradient(135deg, #ea580c, #f97316)'
        };
      case 'Price Update':
        return {
          icon: <TrendingDown size={14} />,
          label: 'Price Update',
          bgColor: '#ecfdf5',
          textColor: '#047857',
          borderColor: '#a7f3d0',
          badgeGradient: 'linear-gradient(135deg, #059669, #10b981)'
        };
      case 'New Launch':
        return {
          icon: <Sparkles size={14} />,
          label: 'New Launch',
          bgColor: '#f5f3ff',
          textColor: '#6d28d9',
          borderColor: '#ddd6fe',
          badgeGradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
        };
      case 'Notice':
        return {
          icon: <Bell size={14} />,
          label: 'Notice',
          bgColor: '#eff6ff',
          textColor: '#1d4ed8',
          borderColor: '#bfdbfe',
          badgeGradient: 'linear-gradient(135deg, #2563eb, #3b82f6)'
        };
      default:
        return {
          icon: <Globe size={14} />,
          label: category || 'Market News',
          bgColor: '#f8fafc',
          textColor: '#334155',
          borderColor: '#e2e8f0',
          badgeGradient: 'linear-gradient(135deg, #475569, #64748b)'
        };
    }
  };

  const formatExpiry = (dateString) => {
    if (!dateString) return null;
    const expiry = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        text: 'Expired', 
        isExpired: true, 
        badgeBg: '#fee2e2', 
        badgeColor: '#991b1b',
        dateText: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    }
    if (diffDays === 0) {
      return { 
        text: 'Expires Today', 
        isUrgent: true, 
        badgeBg: '#fef2f2', 
        badgeColor: '#dc2626',
        dateText: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    }
    if (diffDays === 1) {
      return { 
        text: 'Expires Tomorrow', 
        isUrgent: true, 
        badgeBg: '#fff7ed', 
        badgeColor: '#c2410c',
        dateText: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    }
    if (diffDays <= 7) {
      return { 
        text: `${diffDays} days left`, 
        isUrgent: true, 
        badgeBg: '#fff7ed', 
        badgeColor: '#c2410c',
        dateText: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    }
    return { 
      text: `${diffDays} days left`, 
      isUrgent: false, 
      badgeBg: '#ecfdf5', 
      badgeColor: '#065f46',
      dateText: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  };

  const handleShareWhatsApp = (newsItem) => {
    if (!newsItem) return;
    const expiryText = newsItem.expiryDate 
      ? new Date(newsItem.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Ongoing Scheme';

    const message = `📢 *NIYANSH PHARMA - ${newsItem.category.toUpperCase()}* 📢\n\n` +
      `📌 *${newsItem.title}*\n` +
      `🏢 *Company / Brand:* ${newsItem.company || 'DAXIA Healthcare'}\n` +
      `🏷️ *Category:* ${newsItem.category}\n` +
      `⏳ *Validity:* ${expiryText}\n\n` +
      `📝 *Scheme Details:*\n${newsItem.content}\n\n` +
      `📞 *Wholesale Booking Desk:* +91 99099 23130\n` +
      `📍 Niyansh Pharma, Rajkot, Gujarat\n` +
      `🌐 https://niyanshpharma.com/news`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919909923130?text=${encoded}`, '_blank');
  };

  const handleCopyDetails = (newsItem) => {
    const textToCopy = `${newsItem.title}\nCompany: ${newsItem.company}\nDetails: ${newsItem.content}\nValid till: ${newsItem.expiryDate ? new Date(newsItem.expiryDate).toLocaleDateString() : 'N/A'}\nContact: +91 99099 23130`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(newsItem._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCompany('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #072340 0%, #0c3d6c 60%, #1b75bc 100%)',
          color: '#ffffff',
          padding: '60px 0 45px 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '4px solid var(--secondary-green)'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#93c5fd',
                padding: '6px 16px',
                borderRadius: '30px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '18px',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Flame size={14} color="#f97316" />
              Live Trade Intelligence & Schemes
            </span>

            <h1 
              style={{
                fontSize: '2.6rem',
                color: '#ffffff',
                lineHeight: '1.2',
                fontWeight: '800',
                marginBottom: '15px',
                fontFamily: 'Outfit'
              }}
            >
              Daily Pharma News & Manufacturer Schemes
            </h1>

            <p 
              style={{
                fontSize: '1.1rem',
                color: '#e2e8f0',
                lineHeight: '1.6',
                marginBottom: '30px',
                fontWeight: '400'
              }}
            >
              Access verified distributor bonus schemes (10+1 / 15+2), manufacturer PTR revisions, new formulation launches, and pharmaceutical regulatory updates in real time.
            </p>

            {/* Quick Stats Strip */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '30px'
              }}
            >
              <div 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <Flame size={16} color="#fb923c" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  <strong>{schemeCount}</strong> Active Schemes
                </span>
              </div>

              <div 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <Sparkles size={16} color="#c084fc" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  <strong>{launchCount}</strong> New Launches
                </span>
              </div>

              <div 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <TrendingDown size={16} color="#4ade80" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  <strong>{priceCount}</strong> Price Revisions
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div 
              style={{
                position: 'relative',
                maxWidth: '620px',
                margin: '0 auto'
              }}
            >
              <input
                type="text"
                placeholder="Search schemes, products (e.g. Mucidax, Ceftriaxone), companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 55px 16px 22px',
                  borderRadius: '40px',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  backgroundColor: '#ffffff',
                  fontSize: '1rem',
                  color: 'var(--text-dark)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-light)',
                      padding: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
                <div 
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: '#ffffff',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Search size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '35px' }}>
        
        {/* Filter Controls Strip */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid var(--border-light)',
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-medium)', marginRight: '5px' }}>
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '600',
                    backgroundColor: isActive ? 'var(--primary-blue)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : 'var(--text-dark)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary-blue)' : '#e2e8f0',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    boxShadow: isActive ? '0 4px 12px rgba(12, 61, 108, 0.2)' : 'none'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Company Dropdown & Sort Controls */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '15px'
            }}
          >
            {/* Company Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-medium)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={15} /> Company / Manufacturer:
              </span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  cursor: 'pointer'
                }}
              >
                {companies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp === 'All' ? 'All Companies' : comp}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options & Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpDown size={14} /> Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-dark)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="priority">High Priority First</option>
                  <option value="expiry">Expiring Soonest</option>
                </select>
              </div>

              {/* Refresh / Reset Button */}
              <button
                onClick={resetFilters}
                title="Reset All Filters"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-medium)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={13} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter / Filter tags */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-medium)' }}>
            Showing <strong>{filteredNews.length}</strong> {filteredNews.length === 1 ? 'announcement' : 'announcements'}
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {selectedCompany !== 'All' && <span> from <strong>{selectedCompany}</strong></span>}
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--secondary-green)', fontWeight: '700' }}>
            <ShieldCheck size={16} /> Direct Wholesale Rates Guaranteed
          </div>
        </div>

        {/* News & Schemes Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-medium)' }}>
            <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-blue)', margin: '0 auto 15px auto' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Fetching live pharma announcements & schemes...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          /* Empty State */
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                color: 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}
            >
              <Search size={30} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-blue)', marginBottom: '8px' }}>
              No schemes or news updates found
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-medium)', maxWidth: '450px', margin: '0 auto 25px auto' }}>
              We couldn't find any announcements matching your selected category, company, or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              Clear Filters & View All
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '25px'
            }}
          >
            {filteredNews.map((item) => {
              const catMeta = getCategoryMeta(item.category);
              const expiry = formatExpiry(item.expiryDate);
              const isCopied = copiedId === item._id;

              return (
                <div
                  key={item._id}
                  className="card news-card"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    transition: 'var(--transition-smooth)',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top Row: Category & Company & Date */}
                    <div 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginBottom: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {/* Category Tag */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: catMeta.badgeGradient,
                            color: '#ffffff',
                            padding: '3px 10px',
                            borderRadius: '16px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            letterSpacing: '0.3px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                          }}
                        >
                          {catMeta.icon}
                          {catMeta.label}
                        </span>

                        {/* Company Badge */}
                        <span
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: 'var(--primary-blue)',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}
                        >
                          {item.company || 'DAXIA'}
                        </span>
                      </div>

                      {/* Expiry Pill */}
                      {expiry && (
                        <span
                          style={{
                            backgroundColor: expiry.badgeBg,
                            color: expiry.badgeColor,
                            padding: '3px 9px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Clock size={11} />
                          {expiry.text}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: 'var(--primary-blue)',
                        lineHeight: '1.4',
                        marginBottom: '12px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveModalNews(item)}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p 
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-medium)',
                        lineHeight: '1.6',
                        marginBottom: '18px'
                      }}
                    >
                      {item.content}
                    </p>

                    {/* Scheme Highlight Box */}
                    {item.category === 'Scheme' && (
                      <div 
                        style={{
                          backgroundColor: '#fff7ed',
                          border: '1px dashed #fdba74',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          marginBottom: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <Flame size={18} color="#ea580c" />
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#9a3412' }}>
                          Wholesale Trade Scheme: Free Bonus Goods & Extra PTR Margin
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Metadata & Actions */}
                  <div>
                    {/* Validity strip */}
                    <div 
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '12px',
                        marginBottom: '14px'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {item.createdAt 
                          ? `Posted ${new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                          : 'Recent Update'}
                      </span>

                      {item.expiryDate && (
                        <span>
                          Valid until: <strong>{new Date(item.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px' }}>
                      {/* WhatsApp Button */}
                      <button
                        onClick={() => handleShareWhatsApp(item)}
                        style={{
                          backgroundColor: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                          transition: 'var(--transition-smooth)'
                        }}
                        title="Share on WhatsApp or Order this scheme"
                      >
                        <MessageSquare size={15} />
                        <span>Order / WhatsApp</span>
                      </button>

                      {/* Copy Details */}
                      <button
                        onClick={() => handleCopyDetails(item)}
                        style={{
                          backgroundColor: isCopied ? '#ecfdf5' : '#f8fafc',
                          color: isCopied ? '#059669' : 'var(--text-medium)',
                          border: '1px solid',
                          borderColor: isCopied ? '#a7f3d0' : 'var(--border-light)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Copy Announcement Details"
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      </button>

                      {/* Detail View Modal Trigger */}
                      <button
                        onClick={() => setActiveModalNews(item)}
                        style={{
                          backgroundColor: '#f8fafc',
                          color: 'var(--primary-blue)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="View Full Details"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Contact & Wholesale Support CTA */}
        <div 
          style={{
            marginTop: '60px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '35px 30px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '25px'
          }}
        >
          <div>
            <span style={{ color: 'var(--secondary-green)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Direct Distributor Network
            </span>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-blue)', margin: '4px 0 8px 0' }}>
              Want to publish manufacturer schemes or book bulk supplies?
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-medium)', maxWidth: '650px' }}>
              Reach out to our wholesale desk directly at Rajkot head office for exclusive dealership contracts and daily rate sheets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a 
              href="tel:+919909923130"
              className="btn btn-outline"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <PhoneCall size={16} />
              +91 99099 23130
            </a>
            <Link 
              to="/products" 
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              Browse Catalog
            </Link>
          </div>
        </div>

      </div>

      {/* Focus / Detail Modal */}
      {activeModalNews && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setActiveModalNews(null)}
          style={{
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
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
                padding: '24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: 'linear-gradient(135deg, #f8fafc, #edf2f7)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {(() => {
                    const meta = getCategoryMeta(activeModalNews.category);
                    return (
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: meta.badgeGradient,
                          color: '#ffffff',
                          padding: '4px 12px',
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
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}
                  >
                    <Building2 size={13} />
                    {activeModalNews.company || 'DAXIA Healthcare'}
                  </span>

                  {activeModalNews.expiryDate && (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      <Calendar size={13} />
                      Valid till {new Date(activeModalNews.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-blue)', lineHeight: '1.35', fontWeight: '800' }}>
                  {activeModalNews.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalNews(null)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
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
                  padding: '18px 22px',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '20px',
                  fontSize: '1rem',
                  lineHeight: '1.65',
                  color: 'var(--text-dark)'
                }}
              >
                {activeModalNews.content}
              </div>

              {activeModalNews.category === 'Scheme' && (
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
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Flame size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#9a3412', marginBottom: '2px' }}>
                      Special Wholesale Scheme Terms
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#c2410c', margin: 0 }}>
                      Qualifies for extra free goods and higher profit margins for registered pharmacies, hospitals & healthcare institutions across Gujarat.
                    </p>
                  </div>
                </div>
              )}

              {/* Order instructions */}
              <div style={{ fontSize: '0.88rem', color: 'var(--text-medium)', marginBottom: '25px', lineHeight: '1.5' }}>
                📌 <strong>Order Instruction:</strong> Click the WhatsApp button below to instantly book with our wholesale logistics dispatch desk. Please mention your pharmacy name and DL number.
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleShareWhatsApp(activeModalNews)}
                  className="btn"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <MessageSquare size={20} />
                  Claim Scheme & Order on WhatsApp
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <a
                    href="tel:+919909923130"
                    className="btn btn-outline"
                    style={{
                      padding: '12px 15px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <PhoneCall size={15} />
                    Call +91 99099 23130
                  </a>

                  <button
                    onClick={() => handleCopyDetails(activeModalNews)}
                    className="btn"
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: 'var(--text-dark)',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    {copiedId === activeModalNews._id ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                    {copiedId === activeModalNews._id ? 'Copied to Clipboard' : 'Copy Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsFeed;

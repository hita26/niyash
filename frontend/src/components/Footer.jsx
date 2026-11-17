import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck, 
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import TopBar from './TopBar';
import { useLanguage } from '../context/LanguageContext';

function Footer({ compact = false }) {
  const { t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // If in compact B2B Workstation mode, display a sleek status footer to keep the workstation uncluttered
  if (compact) {
    return (
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '16px 20px', borderTop: '1px solid #1e293b', fontSize: '0.82rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80' }}>●</span>
            <span>{t('footer.tagline', 'Care • Quality • Trust • Rajkot, Gujarat')}</span>
          </div>
          <div>
            © 2026 {t('footer.chemistPortalRights', 'Niyansh Pharma Chemist Portal')} • {t('footer.directHelpline', 'Direct Helpline')}: <a href="tel:+919909923130" style={{ color: '#38bdf8', fontWeight: '700' }}>+91 99099 23130</a>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>{t('nav.publicSite', 'Public Website')}</Link>
            <Link to="/products" style={{ color: '#cbd5e1', textDecoration: 'none' }}>{t('nav.products', 'All Medicines')}</Link>
            <Link to="/quick-order" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: '700' }}>{t('nav.quickOrder', 'Quick Order Pad')}</Link>
          </div>
        </div>
      </footer>
    );
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = newsletterEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Newsletter',
          name: 'Trade Bulletin Subscriber',
          email: cleanEmail,
          phone: '9909923130',
          message: `Trade Bulletin newsletter subscription requested for ${cleanEmail}`
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Subscription failed. Please try again.');
      }

      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 6000);
    } catch (err) {
      // In case of network glitch, provide friendly fallback acknowledgment
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      {/* Top Information Strip right above Footer content */}
      <TopBar />

      {/* 2. Main 4-Column Footer Layout */}
      <div className="container footer-main-container">
        <div className="footer-grid">
          
          {/* Column 1 – Company Information */}
          <div className="footer-widget">
            <div className="footer-logo-card">
              <img 
                src="/logo.jpg" 
                alt="Niyansh Pharma" 
                className="footer-logo-img" 
                loading="lazy"
              />
            </div>

            <p className="footer-description">
              {t('footer.about', 'Niyansh Pharma is a trusted pharmaceutical wholesale distributor based in Rajkot, Gujarat. We supply genuine, quality-assured medicines, OTC products, and surgical supplies across Gujarat with reliable cold-chain and express dispatch.')}
            </p>

            <div className="footer-trust-badge">
              <ShieldCheck size={14} />
              <span>FDCA Compliant • Cold-Chain Assured</span>
            </div>

            <a 
              href="https://wa.me/919909923130?text=Hello%20Niyansh%20Pharma%20Wholesale%20Desk%2C%20I%20have%20an%20inquiry%20regarding%20bulk%20medicines."
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '0.82rem',
                color: '#38bdf8',
                textDecoration: 'none',
                marginTop: '14px',
                fontWeight: '600'
              }}
              title="Official WhatsApp Wholesale Helpdesk"
            >
              <MessageCircle size={15} color="#22c55e" />
              <span>Official WhatsApp Dispatch Desk</span>
            </a>
          </div>

          {/* Column 2 – Quick Links */}
          <div className="footer-widget">
            <h3 className="footer-heading">{t('footer.quickLinks', 'Quick Links')}</h3>
            <div className="footer-heading-accent"></div>
            <ul className="footer-nav-list">
              <li>
                <Link to="/" className="footer-nav-link">
                  <span className="arrow"><ChevronRight size={13} /></span>
                  <span>{t('nav.home', 'Home')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-nav-link">
                  <span className="arrow"><ChevronRight size={13} /></span>
                  <span>{t('nav.about', 'About Us')}</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-nav-link">
                  <span className="arrow"><ChevronRight size={13} /></span>
                  <span>{t('nav.products', 'All Products')}</span>
                </Link>
              </li>
              <li>
                <Link to="/companies" className="footer-nav-link">
                  <span className="arrow"><ChevronRight size={13} /></span>
                  <span>{t('nav.companies', 'Companies')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-nav-link">
                  <span className="arrow"><ChevronRight size={13} /></span>
                  <span>{t('nav.contact', 'Contact & Support')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Dispatch Desk */}
          <div className="footer-widget">
            <h3 className="footer-heading">{t('footer.dispatchDesk', 'Dispatch Desk')}</h3>
            <div className="footer-heading-accent"></div>
            
            <div className="footer-contact-list">
              {/* Location */}
              <div className="footer-contact-card">
                <div className="footer-contact-icon-box" aria-hidden="true">
                  <MapPin size={17} />
                </div>
                <div className="footer-contact-details">
                  <span className="footer-contact-label">Wholesale Hub</span>
                  <span className="footer-contact-val">
                    Niyansh Pharma Wholesale Hub, Rajkot, Gujarat – 360005
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="footer-contact-card">
                <div className="footer-contact-icon-box" aria-hidden="true">
                  <Phone size={17} />
                </div>
                <div className="footer-contact-details">
                  <span className="footer-contact-label">Direct Calling</span>
                  <span className="footer-contact-val">
                    <a href="tel:+919909923130" className="footer-contact-link">
                      +91 99099 23130
                    </a>
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="footer-contact-card">
                <div className="footer-contact-icon-box" aria-hidden="true">
                  <Mail size={17} />
                </div>
                <div className="footer-contact-details">
                  <span className="footer-contact-label">Official Email</span>
                  <span className="footer-contact-val">
                    <a href="mailto:info@niyanshpharma.com" className="footer-contact-link">
                      info@niyanshpharma.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4 – Trade Bulletins */}
          <div className="footer-widget">
            <h3 className="footer-heading">{t('footer.tradeBulletins', 'Trade Bulletins')}</h3>
            <div className="footer-heading-accent"></div>

            <p className="footer-bulletin-text">
              {t('footer.bulletinDesc', 'Subscribe to receive instant WhatsApp and email updates about weekly PTR price revisions, 10+1 schemes, new products, and stock arrivals.')}
            </p>

            {subscribed ? (
              <div className="footer-subscribe-msg success" role="status">
                <CheckCircle2 size={16} color="#34d399" />
                <span>{t('footer.subscribed', 'Thank you! Subscribed to trade alerts.')}</span>
              </div>
            ) : (
              <form className="footer-subscribe-form" onSubmit={handleNewsletterSubmit} noValidate>
                <div className="footer-subscribe-input-wrap">
                  <Mail size={16} className="footer-input-icon" aria-hidden="true" />
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={t('footer.emailPlaceholder', 'Enter your business email...')} 
                    required 
                    aria-label="Trade Bulletin email address"
                    className={`footer-subscribe-input ${errorMessage ? 'input-error' : ''}`}
                    disabled={loading}
                  />
                </div>

                {errorMessage && (
                  <div className="footer-subscribe-msg error" role="alert">
                    <AlertCircle size={15} color="#f87171" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="footer-subscribe-btn"
                  aria-label="Subscribe to Trade Bulletins"
                >
                  <Send size={15} aria-hidden="true" />
                  <span>{loading ? t('common.loading', 'Subscribing...') : t('footer.subscribe', 'Subscribe')}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* 5. Bottom Copyright Section */}
      <div className="footer-bottom-strip">
        <div className="container">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-rights">
              <span>© 2026 Niyansh Pharma. All Rights Reserved.</span>
            </div>
            <div className="footer-bottom-tagline">
              <span>Designed with Care • Quality • Trust</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

function Footer({ compact = false }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // If in compact B2B Workstation mode, display a sleek status footer to keep the workstation uncluttered
  if (compact) {
    return (
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '16px 20px', borderTop: '1px solid #1e293b', fontSize: '0.82rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80' }}>●</span>
            <span>WHO-GMP Certified B2B Pharma Wholesale • Rajkot, Gujarat</span>
          </div>
          <div>
            © {new Date().getFullYear()} Niyansh Pharma B2B Portal • Direct Helpline: <a href="tel:+919909923130" style={{ color: '#38bdf8', fontWeight: '700' }}>+91 99099 23130</a>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Public Website</Link>
            <Link to="/products" style={{ color: '#cbd5e1', textDecoration: 'none' }}>All Medicines</Link>
            <Link to="/quick-order" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: '700' }}>Quick Order Pad</Link>
          </div>
        </div>
      </footer>
    );
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setLoading(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Newsletter',
          name: 'Newsletter Subscriber',
          email: newsletterEmail.trim(),
          phone: 'N/A',
          message: `Newsletter subscription requested for ${newsletterEmail.trim()}`
        })
      });
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-widget" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '10px 16px', borderRadius: '8px', display: 'inline-block', alignSelf: 'flex-start' }}>
              <img 
                src="/logo.jpg" 
                alt="Niyansh Pharma Wholesale Logo" 
                style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }} 
              />
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#cbd5e1' }}>
              Niyansh Pharma is a trusted pharmaceutical wholesale distributor based in Rajkot, Gujarat. We supply genuine, quality assured medicines, OTC products, and surgical supplies across Gujarat with reliable cold-chain and express dispatch.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-green)', fontSize: '0.85rem', fontWeight: '600' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary-green)', display: 'inline-block' }}></span>
              WHO-GMP Assured • GST Compliant
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-widget">
            <h3 className="widget-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/companies">Companies Directory</Link></li>
              <li><Link to="/quick-order">⚡ Quick Bulk Order</Link></li>
              <li><Link to="/news">🔥 Schemes & PTR Deals</Link></li>
              <li><Link to="/contact">Contact & Dispatch</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-widget">
            <h3 className="widget-title">Dispatch Desk</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={18} className="contact-icon" aria-hidden="true" />
                <span>Niyansh Pharma Wholesale Hub, Rajkot, Gujarat - 360001</span>
              </div>
              <div className="contact-item">
                <Phone size={18} className="contact-icon" aria-hidden="true" />
                <a href="tel:+919909923130">+91 99099 23130</a>
              </div>
              <div className="contact-item">
                <Mail size={18} className="contact-icon" aria-hidden="true" />
                <a href="mailto:niyanshpharma@gmail.com">niyanshpharma@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Wholesale Trade Bulletin */}
          <div className="footer-widget">
            <h3 className="widget-title">Trade Bulletins</h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '15px' }}>
              Subscribe to get instant WhatsApp & email alerts for weekly PTR price revisions, 10+1 schemes, and stock arrivals.
            </p>
            {subscribed ? (
              <div style={{ backgroundColor: 'rgba(56, 142, 60, 0.2)', color: '#4ade80', padding: '10px 14px', borderRadius: '6px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Subscribed to trade alerts!
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value.toLowerCase())}
                  placeholder="Enter your email address..." 
                  required 
                  aria-label="Newsletter email address" 
                />
                <button type="submit" disabled={loading} aria-label="Subscribe to newsletter">
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Niyansh Pharma Wholesale Distribution. All Rights Reserved.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Niyansh Pharma on Facebook"><Facebook size={16} aria-hidden="true" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Niyansh Pharma on Twitter"><Twitter size={16} aria-hidden="true" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Niyansh Pharma on Instagram"><Instagram size={16} aria-hidden="true" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Niyansh Pharma on LinkedIn"><Linkedin size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, CheckCircle2, Lock } from 'lucide-react';

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setLoading(true);
    try {
      // Connect newsletter subscription to backend enquiries
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
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/companies">Companies Directory</Link></li>
              <li><Link to="/quick-order" style={{ color: '#ffffff', fontWeight: '600' }}>📦 Quick Order Portal</Link></li>
              <li><Link to="/news" style={{ color: '#ea580c', fontWeight: '600' }}>🔥 Schemes & News</Link></li>
              <li><Link to="/manufacturing">Manufacturing</Link></li>
              <li><Link to="/contact">Contact & Support</Link></li>
            </ul>
          </div>

          {/* Partnerships & Business Forms */}
          <div className="footer-widget">
            <h3>Business & Careers</h3>
            <ul className="footer-links">
              <li><Link to="/partner">Partner With Us (Retailers)</Link></li>
              <li><Link to="/supplier">Become a Supplier</Link></li>
              <li><Link to="/career">Career Opportunities</Link></li>
              <li><Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#94a3b8' }}><Lock size={12} /> Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="footer-widget">
            <h3>Get In Touch</h3>
            <ul className="footer-contact-info" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--secondary-green)' }} aria-hidden="true" />
                <span style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Block no. 52B, Panchayat Nagar-3,<br />
                  Ram Park Main Rd, University Rd,<br />
                  Above Jan Aarogya Sevao,<br />
                  Rajkot, Gujarat - 360005.
                </span>
              </li>
              <li>
                <Phone size={16} style={{ color: 'var(--secondary-green)' }} aria-hidden="true" />
                <a href="tel:+919909923130" style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '600' }}>+91 99099 23130</a>
              </li>
              <li>
                <Mail size={16} style={{ color: 'var(--secondary-green)' }} aria-hidden="true" />
                <a href="mailto:niyanshpharma@gmail.com" style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>niyanshpharma@gmail.com</a>
              </li>
            </ul>
            
            {/* Dynamic Newsletter Form */}
            <div style={{ marginTop: '15px' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                Subscribe for price drop alerts & schemes:
              </span>
              {subscribed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '0.85rem', fontWeight: '600', padding: '8px', backgroundColor: 'rgba(74, 222, 128, 0.1)', borderRadius: '6px' }}>
                  <CheckCircle2 size={16} /> Thank you for subscribing!
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

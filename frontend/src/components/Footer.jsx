import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-widget" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '10px 15px', borderRadius: '8px', display: 'inline-block', alignSelf: 'flex-start' }}>
              <img 
                src="/logo.jpg" 
                alt="Niyansh Pharma" 
                style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }} 
              />
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8' }}>
              Niyansh Pharma is a trusted pharmaceutical wholesale distributor based in Rajkot, Gujarat. We supply genuine, quality assured medicines, OTC products, and surgical supplies across the region.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-widget">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/manufacturing">Manufacturing</Link></li>
              <li><Link to="/career">Career With Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Partnerships */}
          <div className="footer-widget">
            <h3>Business Forms</h3>
            <ul className="footer-links">
              <li><Link to="/partner">Partner With Us</Link></li>
              <li><Link to="/supplier">Become a Supplier</Link></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="footer-widget">
            <h3>Get In Touch</h3>
            <ul className="footer-contact-info" style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <MapPin size={18} />
                <span style={{ fontSize: '0.9rem' }}>
                  Block no. 52B, Panchayat Nagar-3,<br />
                  Ram Park Main Road, University Rd,<br />
                  Above Jan Aarogya Sevao,<br />
                  Rajkot, Gujarat - 360005.
                </span>
              </li>
              <li>
                <Phone size={18} />
                <a href="tel:+919909923130" style={{ fontSize: '0.9rem' }}>+91 99099 23130</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:NiyanshPharma@gmail.com" style={{ fontSize: '0.9rem' }}>NiyanshPharma@gmail.com</a>
              </li>
            </ul>
            
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Subscribe newsletter..." required aria-label="Newsletter email" />
              <button type="submit" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Niyansh Pharma. All Rights Reserved. Designed with care.</p>
          <div className="social-links">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="https://twitter.com" className="social-icon" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

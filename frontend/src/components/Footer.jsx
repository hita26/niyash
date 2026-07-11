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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 70C20 40 40 20 60 20C65 20 70 25 70 30C70 45 40 45 40 70C40 75 35 80 30 80C25 80 20 75 20 70Z" fill="#ffffff" />
                <path d="M40 70C40 40 60 30 80 30C85 30 90 35 90 40C90 55 60 55 60 80C60 85 55 90 50 90C45 90 40 85 40 70Z" fill="#81c784" />
              </svg>
              <div style={{ lineHeight: '1.1' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'Outfit', color: '#ffffff', letterSpacing: '1px' }}>NIYANSH</span>
                <br />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '3px', color: '#81c784' }}>PHARMA</span>
              </div>
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
                  First Floor, [Your Building/Address],<br />
                  Gondal Road, Rajkot - 360002,<br />
                  Gujarat, India.
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

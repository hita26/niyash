import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function TopBar() {
  const { t } = useLanguage();
  const taglineParts = t('topbar.tagline', 'Care • Quality • Trust')
    .split('•')
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="website-topbar" role="region" aria-label="Website Top Information Bar">
      <div className="website-topbar-grid">
        {/* LEFT SECTION: Phone & Email */}
        <div className="website-topbar-left">
          <span className="website-topbar-item">
            <span className="website-topbar-icon" aria-hidden="true">
              <Phone size={16} color="#A9D3F5" />
            </span>
            <a href="tel:+919909923130" aria-label="Call Niyansh Pharma at +91 99099 23130">
              +91 99099 23130
            </a>
          </span>
          <span className="website-topbar-item">
            <span className="website-topbar-icon" aria-hidden="true">
              <Mail size={16} color="#A9D3F5" />
            </span>
            <a href="mailto:info@niyanshpharma.com" aria-label="Email Niyansh Pharma at info@niyanshpharma.com">
              info@niyanshpharma.com
            </a>
          </span>
        </div>

        {/* CENTER SECTION: Uniform green indicator dots for Care • Quality • Trust */}
        <div className="website-topbar-center">
          {taglineParts.map((word, idx) => (
            <React.Fragment key={idx}>
              <span className="website-topbar-dot" aria-hidden="true"></span>
              <span>{word}</span>
            </React.Fragment>
          ))}
        </div>

        {/* RIGHT SECTION: Location & Staff Portal */}
        <div className="website-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="website-topbar-icon" aria-hidden="true">
              <MapPin size={15} color="#A9D3F5" />
            </span>
            <span>{t('topbar.location', 'Rajkot, Gujarat')}</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', userSelect: 'none' }}>•</span>
          <Link 
            to="/admin" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              color: '#dbeafe', 
              textDecoration: 'none', 
              fontSize: '0.78rem',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)'
            }}
            title="Internal Staff & Operations Portal"
          >
            <Lock size={12} color="#93c5fd" />
            <span>Staff Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;

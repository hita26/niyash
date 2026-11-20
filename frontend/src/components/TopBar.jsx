import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
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
              <Phone size={15} color="#A9D3F5" />
            </span>
            <a href="tel:+919909923130" aria-label="Call Niyansh Pharma at +91 99099 23130">
              +91 99099 23130
            </a>
          </span>
          <span className="website-topbar-item">
            <span className="website-topbar-icon" aria-hidden="true">
              <Mail size={15} color="#A9D3F5" />
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

        {/* RIGHT SECTION: Business Hours & Location */}
        <div className="website-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className="website-topbar-item hide-mobile" title="Lunch break: 2:00 PM – 4:00 PM">
            <span className="website-topbar-icon" aria-hidden="true">
              <Clock size={14} color="#A9D3F5" />
            </span>
            <span>9:00 AM – 9:00 PM</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="website-topbar-icon" aria-hidden="true">
              <MapPin size={14} color="#A9D3F5" />
            </span>
            <span>{t('topbar.location', 'Rajkot, Gujarat')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;

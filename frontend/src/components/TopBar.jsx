import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function TopBar() {
  const { t } = useLanguage();

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

        {/* CENTER SECTION: Green indicator dot & Care • Quality • Trust */}
        <div className="website-topbar-center">
          <span className="website-topbar-dot" aria-hidden="true"></span>
          <span>{t('topbar.tagline', 'Care • Quality • Trust')}</span>
        </div>

        {/* RIGHT SECTION: Location */}
        <div className="website-topbar-right">
          <span className="website-topbar-icon" aria-hidden="true">
            <MapPin size={16} color="#A9D3F5" />
          </span>
          <span>{t('topbar.location', 'Rajkot, Gujarat')}</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, PhoneCall, Package, X, Sparkles, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * FloatingOrderWidget
 * Interactive B2B Quick Order / WhatsApp Floating Action Button with a subtle pulse ripple effect.
 * Responsive: sits above MobileBottomNav on small screens and at bottom-left on desktop (opposite of AI Assistant).
 */
export default function FloatingOrderWidget() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Strictly do not render in Admin portal (/admin) or Chemist B2B Workstation pages
  const isB2BPortal = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/portal') || 
                      location.pathname.startsWith('/retailer-dashboard') ||
                      location.pathname.startsWith('/quick-order') || 
                      location.pathname.startsWith('/order') || 
                      location.pathname.startsWith('/outstanding') || 
                      location.pathname.startsWith('/ledger');

  if (isB2BPortal) {
    return null;
  }

  const handleWhatsApp = () => {
    const msg = language === 'gu'
      ? "નમસ્તે નિયાંશ ફાર્મા, મારે હોલસેલ દવાનો ઓર્ડર / ભાવપત્રક મેળવવું છે. કૃપા કરીને વિગતો આપો."
      : language === 'hi'
      ? "नमस्ते नियांश फार्मा, मुझे थोक दवा ऑर्डर / रेट लिस्ट चाहिए। कृपया सहायता करें।"
      : "Hello Niyansh Pharma, I would like to get your wholesale price list and place an order. Please guide me.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="floating-b2b-widget" style={{ position: 'fixed', zIndex: 9980, left: '24px', bottom: '24px' }}>
      {/* Popover Menu */}
      {isOpen && (
        <div 
          className="b2b-widget-popover animate-slide-up"
          style={{
            position: 'absolute',
            bottom: '70px',
            left: 0,
            width: '290px',
            maxWidth: 'calc(100vw - 32px)',
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-dark)',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.28), 0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-dark)' }}>
                B2B Wholesale Desk
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '4px' }}
              aria-label="Close wholesale menu"
            >
              <X size={17} />
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-medium)', lineHeight: 1.45 }}>
            {language === 'gu'
              ? 'મેડિકલ સ્ટોર, ક્લિનિક અને હોસ્પિટલો માટે ડાયરેક્ટ હોલસેલ સપ્લાય અને ઇન્સ્ટન્ટ રેટ કાર્ડ.'
              : language === 'hi'
              ? 'मेडिकल स्टोर, क्लिनिक और अस्पतालों के लिए सीधा थोक ऑर्डर और त्वरित रेट कार्ड।'
              : 'Direct wholesale ordering for Retail Chemists, Clinics & Hospitals across Gujarat.'}
          </p>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="btn btn-sm"
            style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 16px',
              fontWeight: '700',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={17} /> {language === 'gu' ? 'WhatsApp પર ઓર્ડર આપો' : language === 'hi' ? 'WhatsApp पर ऑर्डर करें' : 'Order on WhatsApp'}
          </button>

          <a
            href="tel:+919909923130"
            className="btn btn-outline btn-sm"
            style={{
              borderRadius: '10px',
              padding: '10px 14px',
              fontWeight: '600',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--text-dark)',
              borderColor: 'var(--border-light)',
              textDecoration: 'none'
            }}
          >
            <PhoneCall size={15} /> +91 99099 23130
          </a>
        </div>
      )}

      {/* Floating Action Trigger Button with Double Pulse Ripple */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="b2b-pulse-trigger"
        aria-label="Open B2B Quick Order & WhatsApp Desk"
        title="Quick Wholesale Order / WhatsApp"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <span className="b2b-pulse-ring" />
        <span className="b2b-pulse-ring-delayed" />
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}

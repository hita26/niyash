import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Package, X, Sparkles, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * FloatingOrderWidget
 * Interactive B2B Quick Order / WhatsApp Floating Action Button with a subtle pulse ripple effect.
 * Responsive: sits above MobileBottomNav on small screens and at bottom-right on desktop.
 */
export default function FloatingOrderWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const msg = language === 'gu'
      ? "નમસ્તે નિયાંશ ફાર્મા, મારે હોલસેલ દવાનો ઓર્ડર / ભાવપત્રક મેળવવું છે. કૃપા કરીને વિગતો આપો."
      : language === 'hi'
      ? "नमस्ते नियांश फार्मा, मुझे थोक दवा ऑर्डर / रेट लिस्ट चाहिए। कृपया सहायता करें।"
      : "Hello Niyansh Pharma, I would like to get your wholesale price list and place an order. Please guide me.";
    window.open(`https://wa.me/919909923130?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="floating-b2b-widget" style={{ position: 'fixed', zIndex: 990, right: '20px', bottom: '24px' }}>
      {/* Popover Menu */}
      {isOpen && (
        <div 
          className="b2b-widget-popover animate-slide-up"
          style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '280px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 12px 36px rgba(12, 61, 108, 0.22), 0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#16a34a" />
              <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>
                B2B Wholesale Desk
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
              aria-label="Close wholesale menu"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
            Direct wholesale ordering for Retail Chemists, Clinics & Hospitals across Gujarat.
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
              padding: '10px 14px',
              fontWeight: '700',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            <MessageSquare size={16} /> Order on WhatsApp
          </button>

          <a
            href="tel:+919909923130"
            className="btn btn-outline btn-sm"
            style={{
              borderRadius: '10px',
              padding: '9px 14px',
              fontWeight: '600',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#0c3d6c',
              borderColor: '#cbd5e1'
            }}
          >
            <PhoneCall size={15} /> Call Wholesale Desk
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

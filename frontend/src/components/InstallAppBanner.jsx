import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed recently (wait 2 days before showing again)
    const dismissedAt = localStorage.getItem('niyansh_pwa_dismissed_at');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 2) {
        return;
      }
    }

    setIsDismissed(false);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    if (isAppleDevice) {
      setIsIOS(true);
    }

    // Capture Chrome/Android PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Capture successful app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem('niyansh_pwa_installed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // Trigger subtle haptic vibration
    if (window.navigator?.vibrate) {
      try { window.navigator.vibrate([15]); } catch (_) {}
    }

    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowIOSPrompt(false);
    localStorage.setItem('niyansh_pwa_dismissed_at', Date.now().toString());
  };

  // Do not render if installed or dismissed or not installable on non-iOS or on Quick Order page
  if (isInstalled || isDismissed) return null;
  if (!isInstallable && !isIOS) return null;
  if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/quick-order') || window.location.pathname.startsWith('/admin'))) return null;

  return (
    <>
      {/* Floating Bottom App Installation Bar */}
      <div 
        className="pwa-install-bar"
        style={{
          position: 'fixed',
          bottom: 'calc(82px + env(safe-area-inset-bottom, 0px))',
          left: '12px',
          right: '12px',
          maxWidth: '480px',
          margin: '0 auto',
          zIndex: 9970,
          background: 'linear-gradient(135deg, rgba(12, 61, 108, 0.98), rgba(15, 23, 42, 0.98))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.25)',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          color: '#ffffff',
          animation: 'pwaSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <img 
            src="/logo.jpg" 
            alt="Niyansh Pharma" 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              flexShrink: 0
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.88rem', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Niyansh Pharma App
              </span>
              <span style={{ 
                background: 'rgba(34, 197, 94, 0.2)', 
                color: '#4ade80', 
                fontSize: '0.62rem', 
                fontWeight: 800, 
                padding: '1px 6px', 
                borderRadius: '6px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                FAST
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isIOS ? 'Add to Home Screen for 1-Tap Ordering' : 'Install for instant offline order access'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.15s ease, filter 0.15s ease'
            }}
          >
            <Download size={15} strokeWidth={2.5} />
            <span>Install</span>
          </button>
          
          <button
            onClick={handleDismiss}
            aria-label="Dismiss app banner"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#94a3b8',
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS Step-by-Step Instructions Bottom Sheet Modal */}
      {showIOSPrompt && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={() => setShowIOSPrompt(false)}
        >
          <div 
            style={{
              background: 'var(--bg-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px 24px 0 0',
              padding: '24px 20px calc(24px + env(safe-area-inset-bottom, 0px))',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
              animation: 'pwaSlideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '2px', margin: '0 auto 16px' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={22} color="var(--primary-blue)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Install Niyansh App on iPhone</h3>
              </div>
              <button 
                onClick={() => setShowIOSPrompt(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '18px', lineHeight: 1.5 }}>
              Follow these simple steps in Safari to add Niyansh Pharma B2B portal directly to your iPhone Home Screen:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(37, 99, 235, 0.06)', borderRadius: '12px' }}>
                <div style={{ background: '#2563eb', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>1</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Tap the <Share size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Share</strong> button at bottom of Safari
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(37, 99, 235, 0.06)', borderRadius: '12px' }}>
                <div style={{ background: '#2563eb', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>2</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Scroll down and tap <PlusSquare size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Add to Home Screen</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(37, 99, 235, 0.06)', borderRadius: '12px' }}>
                <div style={{ background: '#2563eb', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>3</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Tap <strong>Add</strong> in the top-right corner. All done!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSPrompt(false)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                background: 'var(--primary-blue)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InstallAppBanner;

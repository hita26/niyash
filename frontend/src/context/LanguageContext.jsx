import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations, supportedLanguages } from '../translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('niyansh_language');
      if (saved && (saved === 'en' || saved === 'gu' || saved === 'hi')) {
        return saved;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'gu' || lang === 'hi') {
      setLanguageState(lang);
      try {
        localStorage.setItem('niyansh_language', lang);
      } catch (e) {
        console.error('Error saving language preference:', e);
      }
    }
  };

  // Sync document language attribute, font, and SEO meta tags
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.setAttribute('lang', language);

    // Update dynamic page SEO title if on homepage
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const pageTitle = translations[language]?.seo?.defaultTitle || translations['en']?.seo?.defaultTitle;
      const pageDesc = translations[language]?.seo?.defaultDesc || translations['en']?.seo?.defaultDesc;
      if (pageTitle) document.title = pageTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && pageDesc) metaDesc.setAttribute('content', pageDesc);
    }
  }, [language]);

  // Translation helper function with nested dot-lookup and token interpolation
  const t = (path, paramsOrFallback = {}) => {
    let fallback = typeof paramsOrFallback === 'string' ? paramsOrFallback : '';
    let params = typeof paramsOrFallback === 'object' ? paramsOrFallback : {};

    const keys = path.split('.');
    
    // 1. Look in active language
    let value = translations[language];
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    // 2. Fallback to English if not found
    if (value === undefined && language !== 'en') {
      let enValue = translations['en'];
      for (const key of keys) {
        if (enValue && typeof enValue === 'object' && key in enValue) {
          enValue = enValue[key];
        } else {
          enValue = undefined;
          break;
        }
      }
      value = enValue;
    }

    // 3. Fallback to passed fallback or key itself
    if (value === undefined) {
      return fallback || path;
    }

    // Replace parameter placeholders e.g. {count}
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/{(\w+)}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`));
    }

    return value;
  };

  // Localized currency formatter (Indian Rupee ₹)
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Localized number formatter
  const formatNumber = (num) => {
    const n = Number(num) || 0;
    const locale = language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    return n.toLocaleString(locale);
  };

  const currentLangObj = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      formatCurrency, 
      formatNumber, 
      supportedLanguages, 
      currentLangObj 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Reusable Premium Language Selector Dropdown Component
export function LanguageSelector({ variant = 'default' }) {
  const { language, setLanguage, supportedLanguages, currentLangObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'pill-buttons') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--bg-main, #f1f5f9)', padding: '3px', borderRadius: '24px', border: '1px solid var(--border-light, #e2e8f0)', gap: '3px' }}>
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: language === lang.code ? 'var(--primary-blue, #0c3d6c)' : 'transparent',
              color: language === lang.code ? '#ffffff' : 'var(--text-medium, #475569)',
              fontSize: '0.8rem',
              fontWeight: language === lang.code ? '800' : '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{lang.native}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change website language"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1.5px solid var(--border-light, #e2e8f0)',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-dark, #0f172a)',
          fontSize: '0.84rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary-blue, #0c3d6c)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-light, #e2e8f0)';
        }}
      >
        <Globe size={16} color="var(--primary-blue, #0c3d6c)" />
        <span>{currentLangObj.native}</span>
        <ChevronDown size={13} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderRadius: '12px',
            boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid var(--border-light, #e2e8f0)',
            padding: '6px',
            minWidth: '160px',
            zIndex: 1200,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ padding: '6px 10px 6px', fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {language === 'gu' ? 'ભાષા પસંદ કરો' : language === 'hi' ? 'भाषा चुनें' : 'Select Language'}
          </div>
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--primary-light, #eff6ff)' : 'transparent',
                  color: isSelected ? 'var(--primary-blue, #0c3d6c)' : 'var(--text-dark, #0f172a)',
                  fontSize: '0.86rem',
                  fontWeight: isSelected ? '800' : '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-main, #f8fafc)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>{lang.flag}</span>
                  <span>{lang.native}</span>
                </span>
                {isSelected && <Check size={15} color="var(--primary-blue, #0c3d6c)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LanguageContext;

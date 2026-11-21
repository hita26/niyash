import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Enterprise Single-Button Theme Toggle (Light ☀️ / Dark 🌙 Only)
 * High-performance 1-click switcher matching modern SaaS standards (GitHub, Vercel, Stripe).
 * Fully accessible with multilingual tooltips across English, Gujarati, and Hindi.
 */
export default function ThemeToggle({ className = '', style = {}, variant = 'default' }) {
  const { isDark, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const titleText = isDark
    ? (language === 'gu' ? 'લાઇટ મોડ કરો' : language === 'hi' ? 'लाइट मोड चालू करें' : 'Switch to Light Mode')
    : (language === 'gu' ? 'ડાર્ક મોડ કરો' : language === 'hi' ? 'डार्क मोड चालू करें' : 'Switch to Dark Mode');

  const handleClick = (e) => {
    e.stopPropagation();
    toggleTheme();
    if (typeof window !== 'undefined' && window.triggerHaptic) {
      window.triggerHaptic('selection');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={titleText}
      aria-label={titleText}
      className={`theme-toggle-single-btn ${className}`}
      style={{
        width: '38px',
        height: '38px',
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: '1.5px solid var(--border-light, #e2e8f0)',
        backgroundColor: 'var(--bg-surface-alt, #f8fafc)',
        color: isDark ? '#f59e0b' : '#0c3d6c',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDark 
          ? '0 0 14px rgba(245, 158, 11, 0.25), 0 2px 4px rgba(0,0,0,0.3)' 
          : '0 2px 6px rgba(0,0,0,0.06)',
        flexShrink: 0,
        position: 'relative',
        ...style
      }}
    >
      {isDark ? (
        <Sun 
          size={18} 
          strokeWidth={2.4} 
          style={{ 
            color: '#fbbf24',
            filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))',
            transition: 'transform 0.3s ease' 
          }} 
        />
      ) : (
        <Moon 
          size={17} 
          strokeWidth={2.3} 
          style={{ 
            color: '#1e293b',
            transition: 'transform 0.3s ease' 
          }} 
        />
      )}
    </button>
  );
}

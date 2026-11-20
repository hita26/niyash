import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Single-Icon Responsive Theme Toggle
 * - In Light Mode: Displays Moon icon 🌙 (Clicking switches to Dark Mode)
 * - In Dark Mode: Displays Sun icon ☀️ (Clicking switches to Light Mode)
 * - Single circular icon button with smooth rotation and scale micro-interactions.
 * - 100% accessible with dynamic aria-label and tooltips across English, Gujarati, and Hindi.
 */
export default function ThemeToggle({ className = '', style = {}, variant = 'default' }) {
  const { isDark, toggleTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsRotating(true);
    toggleTheme();
    if (typeof window !== 'undefined' && window.triggerHaptic) {
      window.triggerHaptic('selection');
    }
    setTimeout(() => {
      setIsRotating(false);
    }, 450);
  };

  const tooltipText = isDark
    ? (language === 'gu' ? 'લાઇટ મોડ ચાલુ કરો' : language === 'hi' ? 'लाइट मोड चालू करें' : 'Switch to Light Mode')
    : (language === 'gu' ? 'ડાર્ક મોડ ચાલુ કરો' : language === 'hi' ? 'डार्क मोड चालू करें' : 'Switch to Dark Mode');

  if (variant === 'segmented') {
    return (
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface-alt, #f1f5f9)',
          padding: '3px',
          borderRadius: '24px',
          border: '1px solid var(--border-light, #e2e8f0)',
          gap: '3px',
          ...style
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (isDark) toggleTheme();
            if (typeof window !== 'undefined' && window.triggerHaptic) window.triggerHaptic('selection');
          }}
          style={{
            padding: '5px 12px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: !isDark ? 'var(--primary-blue, #0c3d6c)' : 'transparent',
            color: !isDark ? '#ffffff' : 'var(--text-medium, #475569)',
            fontSize: '0.8rem',
            fontWeight: !isDark ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: !isDark ? '0 2px 6px rgba(12, 61, 108, 0.25)' : 'none'
          }}
        >
          <Sun size={14} />
          <span>{language === 'gu' ? 'લાઇટ' : language === 'hi' ? 'लाइट' : 'Light'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isDark) toggleTheme();
            if (typeof window !== 'undefined' && window.triggerHaptic) window.triggerHaptic('selection');
          }}
          style={{
            padding: '5px 12px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: isDark ? 'var(--primary-blue, #0284c7)' : 'transparent',
            color: isDark ? '#ffffff' : 'var(--text-medium, #475569)',
            fontSize: '0.8rem',
            fontWeight: isDark ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: isDark ? '0 2px 6px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          <Moon size={14} />
          <span>{language === 'gu' ? 'ડાર્ક' : language === 'hi' ? 'डार्क' : 'Dark'}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={handleClick}
      title={tooltipText}
      aria-label={tooltipText}
      aria-pressed={isDark}
      data-theme-state={isDark ? 'dark' : 'light'}
      style={style}
    >
      <span 
        className={`theme-toggle-icon ${isRotating ? 'rotating' : ''}`}
        aria-hidden="true"
      >
        {isDark ? (
          <Sun size={18} strokeWidth={2.3} />
        ) : (
          <Moon size={17} strokeWidth={2.3} />
        )}
      </span>
    </button>
  );
}

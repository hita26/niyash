import React, { useState } from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Responsive Multi-Mode Theme Toggle
 * Supports:
 * - Light Mode ☀️
 * - Dark Mode 🌙
 * - Black & White Mode ◐ (High-Contrast Corporate Monochrome)
 * Fully accessible with tooltips across English, Gujarati, and Hindi.
 */
export default function ThemeToggle({ className = '', style = {}, variant = 'default' }) {
  const { theme, setTheme, isDark, isBW } = useTheme();
  const { language } = useLanguage();

  const handleSelect = (mode) => {
    setTheme(mode);
    if (typeof window !== 'undefined' && window.triggerHaptic) {
      window.triggerHaptic('selection');
    }
  };

  const labels = {
    light: language === 'gu' ? 'લાઇટ' : language === 'hi' ? 'लाइट' : 'Light',
    dark: language === 'gu' ? 'ડાર્ક' : language === 'hi' ? 'डार्क' : 'Dark',
    bw: language === 'gu' ? 'B&W' : language === 'hi' ? 'B&W' : 'B&W'
  };

  const tooltips = {
    light: language === 'gu' ? 'લાઇટ મોડ' : language === 'hi' ? 'लाइट मोड' : 'Light Mode',
    dark: language === 'gu' ? 'ડાર્ક મોડ' : language === 'hi' ? 'डार्क मोड' : 'Dark Mode',
    bw: language === 'gu' ? 'બ્લેક એન્ડ વ્હાઇટ મોડ' : language === 'hi' ? 'ब्लैक एंड व्हाइट मोड' : 'Black & White Mode'
  };

  if (variant === 'segmented') {
    return (
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: 'var(--bg-surface-alt, #f1f5f9)',
          padding: '3px',
          borderRadius: '24px',
          border: '1px solid var(--border-light, #e2e8f0)',
          gap: '3px',
          width: '100%',
          boxSizing: 'border-box',
          ...style
        }}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => handleSelect('light')}
          title={tooltips.light}
          aria-label={tooltips.light}
          style={{
            padding: '6px 8px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: theme === 'light' ? 'var(--primary-blue, #0c3d6c)' : 'transparent',
            color: theme === 'light' ? '#ffffff' : 'var(--text-medium, #475569)',
            fontSize: '0.78rem',
            fontWeight: theme === 'light' ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: theme === 'light' ? '0 2px 6px rgba(12, 61, 108, 0.25)' : 'none'
          }}
        >
          <Sun size={13} />
          <span>{labels.light}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('dark')}
          title={tooltips.dark}
          aria-label={tooltips.dark}
          style={{
            padding: '6px 8px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: theme === 'dark' ? 'var(--primary-blue, #0284c7)' : 'transparent',
            color: theme === 'dark' ? '#ffffff' : 'var(--text-medium, #475569)',
            fontSize: '0.78rem',
            fontWeight: theme === 'dark' ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: theme === 'dark' ? '0 2px 6px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          <Moon size={13} />
          <span>{labels.dark}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('bw')}
          title={tooltips.bw}
          aria-label={tooltips.bw}
          style={{
            padding: '6px 8px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: theme === 'bw' ? '#09090b' : 'transparent',
            color: theme === 'bw' ? '#ffffff' : 'var(--text-medium, #475569)',
            fontSize: '0.78rem',
            fontWeight: theme === 'bw' ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: theme === 'bw' ? '0 2px 6px rgba(0, 0, 0, 0.4)' : 'none'
          }}
        >
          <Contrast size={13} />
          <span>{labels.bw}</span>
        </button>
      </div>
    );
  }

  // Default compact header control: Sleek 3-mode segmented pill
  return (
    <div 
      className={`theme-mode-pill ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-surface-alt, #f1f5f9)',
        padding: '2px',
        borderRadius: '20px',
        border: '1.5px solid var(--border-light, #e2e8f0)',
        gap: '2px',
        boxSizing: 'border-box',
        ...style
      }}
      role="group"
      aria-label="Theme mode switcher"
    >
      <button
        type="button"
        onClick={() => handleSelect('light')}
        title={tooltips.light}
        aria-label={tooltips.light}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: theme === 'light' ? 'var(--primary-blue, #0c3d6c)' : 'transparent',
          color: theme === 'light' ? '#ffffff' : 'var(--text-medium, #64748b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: theme === 'light' ? '0 2px 5px rgba(12, 61, 108, 0.25)' : 'none'
        }}
      >
        <Sun size={14} strokeWidth={theme === 'light' ? 2.5 : 2} />
      </button>

      <button
        type="button"
        onClick={() => handleSelect('dark')}
        title={tooltips.dark}
        aria-label={tooltips.dark}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: theme === 'dark' ? 'var(--primary-blue, #0284c7)' : 'transparent',
          color: theme === 'dark' ? '#ffffff' : 'var(--text-medium, #64748b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: theme === 'dark' ? '0 2px 5px rgba(2, 132, 199, 0.35)' : 'none'
        }}
      >
        <Moon size={14} strokeWidth={theme === 'dark' ? 2.5 : 2} />
      </button>

      <button
        type="button"
        onClick={() => handleSelect('bw')}
        title={tooltips.bw}
        aria-label={tooltips.bw}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: theme === 'bw' ? '#09090b' : 'transparent',
          color: theme === 'bw' ? '#ffffff' : 'var(--text-medium, #64748b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: theme === 'bw' ? '0 2px 5px rgba(0, 0, 0, 0.4)' : 'none'
        }}
      >
        <Contrast size={14} strokeWidth={theme === 'bw' ? 2.5 : 2} />
      </button>
    </div>
  );
}

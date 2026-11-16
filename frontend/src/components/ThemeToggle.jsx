import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function ThemeToggle({ className = '', variant = 'segmented', showLabel = false }) {
  const { theme, setTheme, isDark } = useTheme();
  const { t } = useLanguage();

  const lightText = t('theme.light', 'Light');
  const darkText = t('theme.dark', 'Dark');
  const lightFull = t('theme.lightMode', 'Light Mode');
  const darkFull = t('theme.darkMode', 'Dark Mode');

  if (variant === 'pill' || variant === 'drawer') {
    return (
      <div 
        className={`theme-segmented-switch full-width ${className}`}
        role="radiogroup" 
        aria-label={t('theme.title', 'Theme')}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDark ? '#162032' : '#f1f5f9',
          border: isDark ? '1px solid #243049' : '1px solid #cbd5e1',
          borderRadius: '24px',
          padding: '3px',
          gap: '3px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <button
          type="button"
          role="radio"
          aria-checked={!isDark}
          onClick={() => setTheme('light')}
          className={`theme-segment-btn ${!isDark ? 'active' : ''}`}
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: !isDark ? '700' : '500',
            cursor: 'pointer',
            backgroundColor: !isDark ? '#ffffff' : 'transparent',
            color: !isDark ? '#0c3d6c' : (isDark ? '#94a3b8' : '#64748b'),
            boxShadow: !isDark ? '0 2px 6px rgba(12, 61, 108, 0.12)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          title={t('theme.switchToLight', 'Switch to Light Mode')}
        >
          <Sun size={15} color={!isDark ? '#f59e0b' : 'currentColor'} strokeWidth={2.4} />
          <span>{lightFull}</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={isDark}
          onClick={() => setTheme('dark')}
          className={`theme-segment-btn ${isDark ? 'active' : ''}`}
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: isDark ? '700' : '500',
            cursor: 'pointer',
            backgroundColor: isDark ? '#243049' : 'transparent',
            color: isDark ? '#38bdf8' : '#64748b',
            boxShadow: isDark ? '0 2px 6px rgba(0, 0, 0, 0.4)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          title={t('theme.switchToDark', 'Switch to Dark Mode')}
        >
          <Moon size={14} color={isDark ? '#38bdf8' : 'currentColor'} strokeWidth={2.4} />
          <span>{darkFull}</span>
        </button>
      </div>
    );
  }

  // Default header segmented control: 2 clearly visible options [ ☀️ Light | 🌙 Dark ]
  return (
    <div 
      className={`theme-segmented-switch header-control ${className}`}
      role="radiogroup" 
      aria-label={t('theme.title', 'Theme')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: isDark ? '#162032' : '#f1f5f9',
        border: isDark ? '1.5px solid #243049' : '1.5px solid #cbd5e1',
        borderRadius: '24px',
        padding: '3px',
        gap: '2px',
        boxSizing: 'border-box',
        transition: 'all 0.25s ease'
      }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => setTheme('light')}
        className={`theme-segment-btn light-segment ${!isDark ? 'active' : ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 11px',
          borderRadius: '18px',
          border: 'none',
          fontSize: '0.82rem',
          fontWeight: !isDark ? '700' : '600',
          cursor: 'pointer',
          backgroundColor: !isDark ? '#ffffff' : 'transparent',
          color: !isDark ? '#0c3d6c' : (isDark ? '#94a3b8' : '#64748b'),
          boxShadow: !isDark ? '0 2px 8px rgba(12, 61, 108, 0.12)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          whiteSpace: 'nowrap'
        }}
        title={t('theme.switchToLight', 'Switch to Light Mode')}
      >
        <Sun size={15} color={!isDark ? '#f59e0b' : 'currentColor'} strokeWidth={2.4} />
        <span className="theme-btn-label">{lightText}</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => setTheme('dark')}
        className={`theme-segment-btn dark-segment ${isDark ? 'active' : ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 11px',
          borderRadius: '18px',
          border: 'none',
          fontSize: '0.82rem',
          fontWeight: isDark ? '700' : '600',
          cursor: 'pointer',
          backgroundColor: isDark ? '#243049' : 'transparent',
          color: isDark ? '#38bdf8' : '#64748b',
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.4)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          whiteSpace: 'nowrap'
        }}
        title={t('theme.switchToDark', 'Switch to Dark Mode')}
      >
        <Moon size={14} color={isDark ? '#38bdf8' : 'currentColor'} strokeWidth={2.4} />
        <span className="theme-btn-label">{darkText}</span>
      </button>
    </div>
  );
}

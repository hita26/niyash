import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', variant = 'icon', showLabel = false }) {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'pill' || showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`theme-toggle-pill ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '24px',
          backgroundColor: isDark ? '#1f1f26' : '#f1f5f9',
          color: isDark ? '#f4f4f5' : '#0f172a',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e2e8f0',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.86rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#fbbf24' : '#0c3d6c',
            color: isDark ? '#18181b' : '#ffffff',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          {isDark ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={14} strokeWidth={2.5} />}
        </div>
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  // Compact circular button for navbar
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`theme-toggle-btn ${className}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: isDark ? '#1a1a22' : '#f1f5f9',
        border: isDark ? '1px solid #2f2f38' : '1px solid #e2e8f0',
        color: isDark ? '#fbbf24' : '#0c3d6c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 0 12px rgba(251, 191, 36, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.05)'
          : '0 2px 8px rgba(12, 61, 108, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
          position: isDark ? 'static' : 'absolute',
          opacity: isDark ? 1 : 0,
        }}
      >
        <Sun size={20} strokeWidth={2.2} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
          transform: !isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          position: !isDark ? 'static' : 'absolute',
          opacity: !isDark ? 1 : 0,
        }}
      >
        <Moon size={19} strokeWidth={2.2} />
      </div>
    </button>
  );
}

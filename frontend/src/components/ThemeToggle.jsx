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
export default function ThemeToggle({ className = '', style = {} }) {
  const { isDark, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsRotating(true);
    toggleTheme();
    setTimeout(() => {
      setIsRotating(false);
    }, 450);
  };

  const tooltipText = isDark
    ? (language === 'gu' ? 'લાઇટ મોડ ચાલુ કરો' : language === 'hi' ? 'लाइट मोड चालू करें' : 'Switch to Light Mode')
    : (language === 'gu' ? 'ડાર્ક મોડ ચાલુ કરો' : language === 'hi' ? 'डार्क मोड चालू करें' : 'Switch to Dark Mode');

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
          <Sun size={20} strokeWidth={2.3} />
        ) : (
          <Moon size={19} strokeWidth={2.3} />
        )}
      </span>
    </button>
  );
}

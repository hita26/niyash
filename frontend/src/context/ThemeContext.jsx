import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme from LocalStorage, falling back to system preference or 'light'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('niyansh_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme to document root and save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('niyansh_theme', theme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      root.classList.remove('dark');
      root.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // Listen to system theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        const saved = localStorage.getItem('niyansh_theme');
        if (!saved) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      }
    } catch {
      // Ignore unsupported browsers
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: false,
    };
  }
  return context;
}

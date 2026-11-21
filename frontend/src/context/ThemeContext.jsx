import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme from LocalStorage: strictly 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('niyansh_theme') || localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      // Normalize any legacy 'bw' or unknown values to dark/light
      if (saved === 'bw') return 'dark';
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
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
    
    if (theme === 'dark') {
      root.classList.add('dark', 'dark-theme');
      root.classList.remove('theme-bw');
      if (document.body) {
        document.body.classList.add('dark', 'dark-theme');
        document.body.classList.remove('theme-bw');
      }
    } else {
      root.classList.remove('dark', 'dark-theme', 'theme-bw');
      if (document.body) {
        document.body.classList.remove('dark', 'dark-theme', 'theme-bw');
      }
    }

    // Update browser status bar meta tag
    try {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b0f19' : '#0c3d6c');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  // Listen to system theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        const saved = localStorage.getItem('niyansh_theme') || localStorage.getItem('theme');
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

  // 1-Click Toggle between Light and Dark mode
  const toggleTheme = () => {
    try {
      const root = document.documentElement;
      root.classList.add('theme-switching');
      if (document.body) document.body.classList.add('theme-switching');
      
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

      setTimeout(() => {
        root.classList.remove('theme-switching');
        if (document.body) document.body.classList.remove('theme-switching');
      }, 350);
    } catch {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, cycleTheme: toggleTheme, toggleBW: toggleTheme, isDark, isBW: false }}>
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
      cycleTheme: () => {},
      toggleBW: () => {},
      isDark: false,
      isBW: false,
    };
  }
  return context;
}

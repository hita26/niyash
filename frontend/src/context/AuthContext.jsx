import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('niyansh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('niyansh_token') || '';
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync state with local storage and custom events across windows / components
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const savedUser = localStorage.getItem('niyansh_user');
        const savedToken = localStorage.getItem('niyansh_token');
        setUser(savedUser ? JSON.parse(savedUser) : null);
        setToken(savedToken || '');
      } catch {
        setUser(null);
        setToken('');
      }
    };

    const handleOpenAuth = () => setIsAuthOpen(true);
    const handleCloseAuth = () => setIsAuthOpen(false);

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('open-auth', handleOpenAuth);
    window.addEventListener('close-auth', handleCloseAuth);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('open-auth', handleOpenAuth);
      window.removeEventListener('close-auth', handleCloseAuth);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    const userToken = userData?.token || '';
    setToken(userToken);
    try {
      localStorage.setItem('niyansh_user', JSON.stringify(userData));
      if (userToken) localStorage.setItem('niyansh_token', userToken);
    } catch (e) {
      console.error('Error saving auth to storage', e);
    }
    window.dispatchEvent(new CustomEvent('auth-change', { detail: userData }));
  };

  const logout = () => {
    setUser(null);
    setToken('');
    try {
      localStorage.removeItem('niyansh_user');
      localStorage.removeItem('niyansh_token');
    } catch (e) {
      console.error('Error clearing auth from storage', e);
    }
    window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
  };

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  const value = {
    user,
    token,
    isLoggedIn: Boolean(user && (token || user.token || user.email)),
    login,
    logout,
    isAuthOpen,
    openAuth,
    closeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Safe fallback if used outside AuthProvider
    try {
      const saved = localStorage.getItem('niyansh_user');
      const savedToken = localStorage.getItem('niyansh_token');
      const u = saved ? JSON.parse(saved) : null;
      return {
        user: u,
        token: savedToken || '',
        isLoggedIn: Boolean(u),
        login: () => {},
        logout: () => {},
        isAuthOpen: false,
        openAuth: () => window.dispatchEvent(new CustomEvent('open-auth')),
        closeAuth: () => window.dispatchEvent(new CustomEvent('close-auth')),
      };
    } catch {
      return {
        user: null,
        token: '',
        isLoggedIn: false,
        login: () => {},
        logout: () => {},
        isAuthOpen: false,
        openAuth: () => window.dispatchEvent(new CustomEvent('open-auth')),
        closeAuth: () => window.dispatchEvent(new CustomEvent('close-auth')),
      };
    }
  }
  return context;
}

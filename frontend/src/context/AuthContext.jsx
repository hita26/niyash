import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
  const userRef = useRef(user);
  const tokenRef = useRef(token);

  useEffect(() => {
    userRef.current = user;
    tokenRef.current = token;
  }, [user, token]);

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
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing auth from storage', e);
    }
    window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));

    // Invalidate protected browser history: if on a protected B2B route, replace location to home
    const protectedPrefixes = ['/dashboard', '/portal', '/retailer-dashboard', '/quick-order', '/order', '/outstanding', '/ledger'];
    if (protectedPrefixes.some(prefix => window.location.pathname.startsWith(prefix))) {
      window.location.replace('/');
    }
  };

  // Real-time instant logout on account deletion or deactivation across all tabs & windows
  useEffect(() => {
    let channel = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('niyansh_session_channel');
        channel.onmessage = (event) => {
          const data = event?.data;
          if (data?.type === 'ACCOUNT_TERMINATED' || data?.type === 'USER_DELETED') {
            const currentUser = userRef.current;
            if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') return;

            const targetEmail = data?.email?.toLowerCase()?.trim();
            const targetId = data?.userId;
            const currentEmail = currentUser?.email?.toLowerCase()?.trim();
            const currentId = currentUser?._id || currentUser?.id;

            if (
              (targetEmail && currentEmail && targetEmail === currentEmail) ||
              (targetId && currentId && String(targetId) === String(currentId))
            ) {
              console.warn('[Session] Real-time termination broadcast received. Auto-logging out.');
              logout();
              alert('Your account has been deactivated or removed by administration. You have been logged out.');
              window.location.replace('/');
            }
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel init notice:', e);
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'niyansh_terminated_user' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const currentUser = userRef.current;
          if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') return;

          const targetEmail = parsed?.email?.toLowerCase()?.trim();
          const targetId = parsed?.userId;
          const currentEmail = currentUser?.email?.toLowerCase()?.trim();
          const currentId = currentUser?._id || currentUser?.id;

          if (
            (targetEmail && currentEmail && targetEmail === currentEmail) ||
            (targetId && currentId && String(targetId) === String(currentId))
          ) {
            console.warn('[Session] Storage termination event received. Auto-logging out.');
            logout();
            alert('Your account has been deactivated or removed by administration. You have been logged out.');
            window.location.replace('/');
          }
        } catch (_) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (channel) {
        try { channel.close(); } catch (_) {}
      }
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Heartbeat session check: automatically validates user session with the server
  useEffect(() => {
    if (!token && !user) return;

    const checkSession = async () => {
      const currentToken = tokenRef.current || localStorage.getItem('niyansh_token');
      const currentUser = userRef.current;
      if (!currentToken || !currentUser) return;

      // SuperAdmin and Admin sessions should never be interrupted by background heartbeat checks
      if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') return;

      try {
        const res = await fetch('/api/users/validate-session', {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'x-silent-request': 'true',
            'x-background-request': 'true'
          }
        });

        if (res.status === 401 || res.status === 403) {
          const data = await res.json().catch(() => ({}));
          // Only pop deactivation notice if backend explicitly signaled termination
          if (data?.isTerminated || data?.user?.isActive === false) {
            console.warn('[Session] Account terminated or deactivated:', data);
            logout();
            alert('Your account has been deactivated or removed by administration. You have been logged out.');
            window.location.replace('/');
            return;
          }
          // Normal token expiration: logout gracefully without alarming alert
          console.warn('[Session] Session expired gracefully');
          logout();
          window.location.replace('/');
          return;
        }

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data?.user?.isActive === false || data?.isTerminated) {
            console.warn('[Session] User is inactive or terminated:', data);
            logout();
            alert('Your account has been deactivated. Please contact administration.');
            window.location.replace('/');
          }
        }
      } catch (e) {
        // Network offline or transient error - do not log out on simple connection blip
      }
    };

    // Run check every 60 seconds (non-aggressive)
    const interval = setInterval(checkSession, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [token, user]);

  // Global fetch response interceptor for 401/403 with isTerminated
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response && (response.status === 401 || response.status === 403)) {
        try {
          const currentUser = userRef.current;
          // Protect admin / superadmin from fetch interceptor auto-kick
          if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
            return response;
          }

          const cloned = response.clone();
          cloned.json().then(data => {
            if (data?.isTerminated && (data?.user?.isActive === false || response.status === 403)) {
              console.warn('[Fetch Interceptor] API returned isTerminated=true. Logging out.');
              logout();
              alert('Your account has been deactivated or removed by administration. You have been logged out.');
              window.location.replace('/');
            }
          }).catch(() => {});
        } catch (_) {}
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

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

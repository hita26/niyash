import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initGlobalHaptics } from './utils/hapticEngine';

// Initialize Global Haptic Touch Engine for PWA & Mobile Web
initGlobalHaptics();

// Cloud API Backend URL for static web hosts (GoDaddy cPanel / Apache)
const CLOUD_API_HOST = import.meta.env.VITE_API_URL || 'https://pharma-bay-two.vercel.app';

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // GoDaddy cPanel only serves static HTML/JS/CSS. Direct API requests to cloud Node.js backend.
  if (!isLocal) {
    if (typeof resource === 'string' && resource.startsWith('/api') && !resource.includes('.php')) {
      resource = `${CLOUD_API_HOST}${resource}`;
    } else if (typeof Request !== 'undefined' && resource instanceof Request && resource.url.startsWith(window.location.origin + '/api') && !resource.url.includes('.php')) {
      const path = resource.url.replace(window.location.origin, '');
      resource = new Request(`${CLOUD_API_HOST}${path}`, resource);
    }
  }
  return originalFetch(resource, config);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

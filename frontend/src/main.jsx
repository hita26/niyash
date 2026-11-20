import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Direct API calls to live Atlas API when hosted on GoDaddy cPanel / static domains
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

  if (!isLocal && !isVercel) {
    if (typeof resource === 'string' && resource.startsWith('/api')) {
      resource = `https://pharma-bay-two.vercel.app${resource}`;
    } else if (typeof Request !== 'undefined' && resource instanceof Request && resource.url.startsWith(window.location.origin + '/api')) {
      const path = resource.url.replace(window.location.origin, '');
      resource = new Request(`https://pharma-bay-two.vercel.app${path}`, resource);
    }
  }
  return originalFetch(resource, config);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

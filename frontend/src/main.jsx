import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initGlobalHaptics } from './utils/hapticEngine';

// Initialize Global Haptic Touch Engine for PWA & Mobile Web
initGlobalHaptics();

// Cloud API Backend URL with automatic multi-origin failover so products never disappear on config/host changes
const FALLBACK_CLOUD_API_HOST = 'https://pharma-bay-two.vercel.app';
const PRIMARY_API_HOST = (import.meta.env.VITE_API_URL || FALLBACK_CLOUD_API_HOST).replace(/\/+$/, '');

const originalFetch = window.fetch.bind(window);

const buildApiTarget = (host, apiPath) => (host ? `${host}${apiPath}` : apiPath);

const shouldFailoverResponse = (res) => {
  if (!res) return true;
  if (res.status === 502 || res.status === 503 || res.status === 504) return true;
  if (!res.ok) {
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    // Apache/cPanel/static-host 403/404 pages return HTML instead of JSON API responses
    if (!contentType.includes('application/json')) return true;
  }
  return false;
};

window.fetch = async (...args) => {
  const [resource, config] = args;
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  let apiPath = null;
  if (typeof resource === 'string' && resource.startsWith('/api') && !resource.includes('.php')) {
    apiPath = resource;
  } else if (
    typeof Request !== 'undefined' &&
    resource instanceof Request &&
    typeof window !== 'undefined' &&
    resource.url.startsWith(window.location.origin + '/api') &&
    !resource.url.includes('.php')
  ) {
    apiPath = resource.url.replace(window.location.origin, '');
  }

  if (isLocal || !apiPath) {
    return originalFetch(resource, config);
  }

  const candidateHosts = [];
  if (PRIMARY_API_HOST) candidateHosts.push(PRIMARY_API_HOST);
  if (!candidateHosts.includes(FALLBACK_CLOUD_API_HOST)) candidateHosts.push(FALLBACK_CLOUD_API_HOST);
  // Also allow same-origin /api as last resort if Passenger is active
  if (!candidateHosts.includes('')) candidateHosts.push('');

  const callHost = (host, reqResource, reqConfig) => {
    const targetUrl = buildApiTarget(host, apiPath);
    if (typeof Request !== 'undefined' && reqResource instanceof Request) {
      return originalFetch(new Request(targetUrl, reqResource));
    }
    return originalFetch(targetUrl, reqConfig);
  };

  let lastResponse = null;
  let lastError = null;

  for (let i = 0; i < candidateHosts.length; i++) {
    const host = candidateHosts[i];
    const hasBackup = i < candidateHosts.length - 1;
    const clonedReq =
      hasBackup && typeof Request !== 'undefined' && resource instanceof Request
        ? resource.clone()
        : resource;

    try {
      const res = await callHost(host, clonedReq, config);
      if (!shouldFailoverResponse(res) || !hasBackup) {
        return res;
      }
      lastResponse = res;
    } catch (err) {
      lastError = err;
      if (!hasBackup) {
        throw err;
      }
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error('API request failed');
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

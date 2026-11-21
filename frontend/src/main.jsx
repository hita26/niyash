import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initGlobalHaptics } from './utils/hapticEngine';

// Initialize Global Haptic Touch Engine for PWA & Mobile Web
initGlobalHaptics();

// Native API routing on primary domain niyanshpharma.com
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

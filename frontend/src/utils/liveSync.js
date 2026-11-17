import { useEffect, useRef } from 'react';

/**
 * Niyansh Pharma Enterprise Multi-Tab Live Sync Utility
 * 
 * Synchronizes catalog mutations, deletions, and updates in real-time across multiple tabs and windows:
 * 1. BroadcastChannel API for near-zero-latency cross-tab communication.
 * 2. localStorage fallback ('storage' event) for compatibility across all modern browsers.
 * 3. window CustomEvent for same-tab / same-window components.
 * 4. Tab focus & visibility revalidation (SWR-style) so background tabs always refresh on switch.
 */

const CHANNEL_NAME = 'niyansh_live_sync_channel';
const STORAGE_KEY = 'niyansh_live_sync_event';

export const SYNC_EVENTS = {
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_BULK_IMPORTED: 'PRODUCT_BULK_IMPORTED',
  COMPANY_MUTATED: 'COMPANY_MUTATED',
  SCHEME_MUTATED: 'SCHEME_MUTATED',
  LEDGER_MUTATED: 'LEDGER_MUTATED',
  ORDER_MUTATED: 'ORDER_MUTATED',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
};

// Singleton channel instance when supported
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel initialization error:', e);
  }
}

/**
 * Broadcast a live mutation event across all tabs, windows, and local subscribers
 * @param {string} eventType - Type of event from SYNC_EVENTS
 * @param {object} payload - Optional payload (e.g. { id, product, timestamp })
 */
export function broadcastLiveEvent(eventType, payload = {}) {
  const eventData = {
    type: eventType,
    payload,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel (cross-tab real-time)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(eventData);
    } catch (e) {
      console.warn('BroadcastChannel postMessage error:', e);
    }
  }

  // 2. LocalStorage (cross-tab fallback triggering 'storage' event in other tabs)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(eventData));
    } catch (e) {
      // Storage quota or private mode protection
    }
  }

  // 3. CustomEvent (same-tab subscribers)
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('niyansh_live_event', { detail: eventData }));
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Subscribe to live sync events and tab focus revalidation
 * @param {Function} onEvent - Callback function receiving eventData { type, payload, timestamp }
 * @param {object} options - Options { enableFocusRevalidate: true, minFocusIntervalMs: 2000 }
 * @returns {Function} cleanup function to unsubscribe
 */
export function subscribeToLiveSync(onEvent, options = {}) {
  if (typeof window === 'undefined') return () => {};

  const { enableFocusRevalidate = true, minFocusIntervalMs = 2500 } = options;
  let lastFocusTime = Date.now();

  // Handler for BroadcastChannel messages
  const handleBroadcastMessage = (event) => {
    if (event.data && typeof onEvent === 'function') {
      onEvent(event.data);
    }
  };

  // Handler for localStorage storage events (fired in other tabs)
  const handleStorageEvent = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed && typeof onEvent === 'function') {
          onEvent(parsed);
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  };

  // Handler for same-tab custom events
  const handleCustomEvent = (event) => {
    if (event.detail && typeof onEvent === 'function') {
      onEvent(event.detail);
    }
  };

  // Handler for tab regaining focus / visibility
  const handleVisibilityOrFocus = () => {
    if (!enableFocusRevalidate) return;
    const now = Date.now();
    if (now - lastFocusTime > minFocusIntervalMs) {
      lastFocusTime = now;
      if (typeof onEvent === 'function') {
        onEvent({ type: 'TAB_FOCUSED_REVALIDATE', timestamp: now });
      }
    }
  };

  // Register listeners
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }
  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener('niyansh_live_event', handleCustomEvent);

  if (enableFocusRevalidate) {
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleVisibilityOrFocus();
      }
    });
  }

  // Return unsubscribe cleanup function
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
    window.removeEventListener('niyansh_live_event', handleCustomEvent);
    if (enableFocusRevalidate) {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    }
  };
}

/**
 * Custom React Hook for live sync across components
 * @param {Function} handler - Callback function receiving eventData
 * @param {Array} deps - Dependency array for the effect
 * @param {object} options - Options for subscribeToLiveSync
 */
export function useLiveSync(handler, deps = [], options = {}) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveSync((event) => {
      if (handlerRef.current) {
        handlerRef.current(event);
      }
    }, options);

    return () => {
      unsubscribe();
    };
  }, deps);
}

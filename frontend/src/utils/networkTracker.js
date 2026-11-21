/**
 * Niyansh Pharma - Global Network & Activity Tracker
 * Automatically monitors in-flight HTTP requests and allows seamless UI progress indication
 * across public pages, chemist B2B portals, and admin management console.
 */

let activeRequests = 0;
let manualLoadingCount = 0;
let doneTimeout = null;
const subscribers = new Set();

const notifySubscribers = () => {
  const isWorking = (activeRequests + manualLoadingCount) > 0;
  const count = activeRequests + manualLoadingCount;
  subscribers.forEach((callback) => {
    try {
      callback({ isWorking, activeCount: count });
    } catch (err) {
      console.error('Error in network subscriber:', err);
    }
  });
};

const incrementRequests = () => {
  if (doneTimeout) {
    clearTimeout(doneTimeout);
    doneTimeout = null;
  }
  activeRequests += 1;
  notifySubscribers();
};

const decrementRequests = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0 && manualLoadingCount === 0) {
    if (doneTimeout) clearTimeout(doneTimeout);
    // Debounce to allow chained requests without flickering
    doneTimeout = setTimeout(() => {
      if (activeRequests === 0 && manualLoadingCount === 0) {
        notifySubscribers();
      }
      doneTimeout = null;
    }, 90);
  } else {
    notifySubscribers();
  }
};

// Safe Global Fetch Interceptor
if (typeof window !== 'undefined' && window.fetch && !window.__NIYANSH_NETWORK_TRACKER_INITIALIZED__) {
  window.__NIYANSH_NETWORK_TRACKER_INITIALIZED__ = true;
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const [resource, config] = args;
    const url = typeof resource === 'string' ? resource : (resource?.url || '');

    // Ignore background telemetry, auto-polling pings, and silent background requests to avoid visual distraction
    const isSilent =
      url.includes('/api/analytics/') ||
      url.includes('/api/sync/') ||
      url.includes('/api/products/meta/filters') ||
      url.includes('/api/settings/') ||
      url.includes('ipify.org') ||
      config?.silent === true ||
      config?.background === true ||
      (config?.headers && (
        config.headers['x-silent-request'] === 'true' ||
        config.headers['x-background-request'] === 'true' ||
        (config.headers instanceof Headers && (
          config.headers.get('x-silent-request') === 'true' ||
          config.headers.get('x-background-request') === 'true'
        ))
      ));

    if (isSilent) {
      return originalFetch.apply(this, args);
    }

    incrementRequests();
    let decremented = false;
    const safeDecrement = () => {
      if (!decremented) {
        decremented = true;
        decrementRequests();
      }
    };

    // Auto-release watchdog: after 2.5 seconds, automatically decrement so network tracker never hangs
    const reqWatchdog = setTimeout(safeDecrement, 2500);

    try {
      return await originalFetch.apply(this, args);
    } finally {
      clearTimeout(reqWatchdog);
      safeDecrement();
    }
  };
}

export const networkTracker = {
  subscribe(callback) {
    subscribers.add(callback);
    // Immediately inform subscriber of initial state
    callback({
      isWorking: (activeRequests + manualLoadingCount) > 0,
      activeCount: activeRequests + manualLoadingCount
    });
    return () => {
      subscribers.delete(callback);
    };
  },

  startManual() {
    if (doneTimeout) {
      clearTimeout(doneTimeout);
      doneTimeout = null;
    }
    manualLoadingCount += 1;
    notifySubscribers();
  },

  doneManual() {
    manualLoadingCount = Math.max(0, manualLoadingCount - 1);
    if (activeRequests === 0 && manualLoadingCount === 0) {
      if (doneTimeout) clearTimeout(doneTimeout);
      doneTimeout = setTimeout(() => {
        if (activeRequests === 0 && manualLoadingCount === 0) {
          notifySubscribers();
        }
        doneTimeout = null;
      }, 90);
    } else {
      notifySubscribers();
    }
  },

  isWorking() {
    return (activeRequests + manualLoadingCount) > 0;
  },

  reset() {
    activeRequests = 0;
    manualLoadingCount = 0;
    if (doneTimeout) {
      clearTimeout(doneTimeout);
      doneTimeout = null;
    }
    notifySubscribers();
  }
};

export default networkTracker;

/**
 * Niyansh Pharma - Global Network & Activity Tracker
 * Deprecated / Neutralized to prevent fetch hijacking and unwanted loader triggering.
 */

export const networkTracker = {
  subscribe(callback) {
    if (typeof callback === 'function') {
      try {
        callback({ isWorking: false, activeCount: 0 });
      } catch (_) {}
    }
    return () => {};
  },
  startManual() {},
  doneManual() {},
  isWorking() {
    return false;
  },
  reset() {}
};

export default networkTracker;

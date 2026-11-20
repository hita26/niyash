/**
 * Niyansh Pharma - Global Native Haptic Touch Engine (PWA & Mobile)
 * Provides authentic tactile feedback across the entire application (buttons, links,
 * tabs, forms, admin controls, cart mutations, and touch navigation).
 * 
 * Works with native Android Vibration API and includes micro-frequency tactile
 * audio synthesis & active spring feedback for Apple iOS devices.
 */

let lastVibrationTime = 0;
const THROTTLE_MS = 45;
let audioContext = null;

/**
 * Play an ultra-short low-frequency physical micro-tick for devices without vibration motor access (e.g., iOS Safari)
 */
function playTactileAudioTick(frequency = 70, durationMs = 8, volume = 0.035) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + (durationMs / 1000));
  } catch (_) {
    // Graceful fallback if audio is restricted
  }
}

/**
 * Trigger tactile haptic feedback
 * @param {'light'|'medium'|'heavy'|'selection'|'success'|'warning'|'error'} type 
 */
export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  if (now - lastVibrationTime < THROTTLE_MS) {
    return; // Prevent motor overheating or rapid stutter
  }
  lastVibrationTime = now;

  let pattern = [12];
  let audioFreq = 80;

  switch (type) {
    case 'selection':
      pattern = [8];
      audioFreq = 95;
      break;
    case 'light':
      pattern = [12];
      audioFreq = 85;
      break;
    case 'medium':
      pattern = [22];
      audioFreq = 70;
      break;
    case 'heavy':
      pattern = [35];
      audioFreq = 60;
      break;
    case 'success':
      pattern = [14, 40, 20];
      audioFreq = 110;
      break;
    case 'warning':
      pattern = [25, 45, 25];
      audioFreq = 65;
      break;
    case 'error':
      pattern = [35, 50, 35, 50, 40];
      audioFreq = 50;
      break;
    default:
      pattern = [12];
  }

  // 1. Native Mobile Vibration (Android, Chrome PWA, WebViews)
  let vibrated = false;
  if ('navigator' in window && typeof window.navigator?.vibrate === 'function') {
    try {
      vibrated = window.navigator.vibrate(pattern);
    } catch (_) {
      vibrated = false;
    }
  }

  // 2. Hardware Taptic Audio synthesis for iOS / devices without direct vibrate access
  if (!vibrated) {
    playTactileAudioTick(audioFreq, Array.isArray(pattern) ? pattern[0] : pattern, 0.03);
  }
}

/**
 * Global Touch & Pointerdown Interceptor
 * Automatically catches any touch on interactive UI elements throughout the app.
 */
export function initGlobalHaptics() {
  if (typeof window === 'undefined') return;
  if (window.__NIYANSH_HAPTIC_ENGINE_INITIALIZED__) return;
  window.__NIYANSH_HAPTIC_ENGINE_INITIALIZED__ = true;

  // Make helper universally available
  window.triggerHaptic = triggerHaptic;

  const interactiveSelector = [
    'button',
    'a[href]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    'input[type="button"]',
    'input[type="submit"]',
    'select',
    '[role="button"]',
    '[role="tab"]',
    '[role="link"]',
    'summary',
    '.btn',
    '.admin-tab-chip',
    '.admin-b2b-kpi-chip',
    '.admin-b2b-btn',
    '.brand-pill-card',
    '.pharma-step-card',
    '.product-card',
    '.clickable',
    '.mobile-bottom-nav a',
    '.mobile-bottom-nav button',
    '[data-haptic]'
  ].join(',');

  const handlePointerDown = (e) => {
    // Only respond to primary touch/mouse clicks
    if (e.isPrimary === false || (e.button !== undefined && e.button !== 0)) return;

    const target = e.target;
    if (!target || !(target instanceof Element)) return;

    // Do not trigger on regular text typing inputs
    const isTextInput = target.matches('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], textarea');
    if (isTextInput && !target.hasAttribute('data-haptic')) {
      return;
    }

    const interactiveEl = target.closest(interactiveSelector);
    if (!interactiveEl) return;

    // Custom haptic type via data attribute
    const customType = interactiveEl.getAttribute('data-haptic');
    if (customType) {
      triggerHaptic(customType);
      return;
    }

    // Determine tactile strength by element type
    if (interactiveEl.classList.contains('btn-primary') || interactiveEl.classList.contains('admin-b2b-btn-primary')) {
      triggerHaptic('medium');
    } else if (interactiveEl.matches('input[type="checkbox"], input[type="radio"], [role="tab"], .admin-tab-chip')) {
      triggerHaptic('selection');
    } else if (interactiveEl.classList.contains('btn-danger') || interactiveEl.getAttribute('title')?.toLowerCase().includes('delete')) {
      triggerHaptic('heavy');
    } else {
      triggerHaptic('light');
    }
  };

  // Passive capture listener ensures zero scroll performance penalty
  window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });
}

export default {
  triggerHaptic,
  initGlobalHaptics
};

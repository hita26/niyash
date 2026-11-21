import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { networkTracker } from '../utils/networkTracker';

/**
 * Bio-Nano Top Progress Bar
 * Enterprise Pharmaceutical Grade, non-intrusive top-loading progress indicator.
 * Dynamically reacts to route changes, API fetch queries, and admin dashboard operations.
 * Features hard watchdog auto-dismiss (max 1.8s) to guarantee it never hangs or freezes.
 */
export default function BioNanoProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const location = useLocation();
  const prevPathRef = useRef(location.pathname + location.search);
  const isNetworkActiveRef = useRef(false);
  const isRouteTransitionRef = useRef(false);
  const isFinishingRef = useRef(false);
  const isVisibleRef = useRef(false);

  const trickleTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const watchdogTimerRef = useRef(null);

  // Clear all pending timers
  const clearTimers = () => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  };

  // Complete progress indicator smoothly
  const finishProgress = () => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }

    setIsFinishing(true);
    isFinishingRef.current = true;
    setProgress(100);

    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      isVisibleRef.current = false;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setProgress(0);
        setIsFinishing(false);
        isFinishingRef.current = false;
      }, 250);
    }, 200);
  };

  // Start progress indicator
  const startProgress = () => {
    // If currently fading out or already actively trickling, do not reset
    if (isFinishingRef.current) return;
    if (isVisibleRef.current && trickleTimerRef.current) return;

    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);

    setIsFinishing(false);
    isFinishingRef.current = false;
    setVisible(true);
    isVisibleRef.current = true;
    setProgress((prev) => (prev > 0 && prev < 85 ? prev : 18));

    // Hard watchdog: Never allow progress bar to stay visible for more than 1.8 seconds under ANY circumstances
    watchdogTimerRef.current = setTimeout(() => {
      finishProgress();
    }, 1800);

    // Smooth bio-nano trickle physics
    trickleTimerRef.current = setInterval(() => {
      setProgress((curr) => {
        if (curr >= 88) return curr;
        if (curr < 35) return curr + Math.random() * 12 + 6;
        if (curr < 65) return curr + Math.random() * 6 + 3;
        if (curr < 85) return curr + Math.random() * 3 + 1;
        return curr + Math.random() * 0.8 + 0.3;
      });
    }, 180);
  };

  // Check overall activity state
  const evaluateActivity = () => {
    if (location.pathname.startsWith('/admin')) {
      clearTimers();
      setVisible(false);
      isVisibleRef.current = false;
      setProgress(0);
      setIsFinishing(false);
      isFinishingRef.current = false;
      return;
    }
    const isBusy = isNetworkActiveRef.current || isRouteTransitionRef.current;
    if (isBusy) {
      startProgress();
    } else {
      finishProgress();
    }
  };

  // 1. Listen to Global Network Requests
  useEffect(() => {
    const unsubscribe = networkTracker.subscribe(({ isWorking }) => {
      isNetworkActiveRef.current = isWorking;
      evaluateActivity();
    });

    return () => {
      unsubscribe();
      clearTimers();
    };
  }, [location.pathname]);

  // 2. Listen to Route Changes across the entire site
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      isRouteTransitionRef.current = true;
      evaluateActivity();

      // Ensure smooth quick completion of route transition
      const routeDoneTimer = setTimeout(() => {
        isRouteTransitionRef.current = false;
        evaluateActivity();
      }, 250);

      return () => clearTimeout(routeDoneTimer);
    }
  }, [location.pathname, location.search]);

  // Disable top progress bar completely on the admin panel to eliminate visual flickering
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      id="bionano-progress-bar"
      role="progressbar"
      aria-label="Loading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin="0"
      aria-valuemax="100"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: 'none'
      }}
    >
      <div
        className={`bionano-progress-fill ${!isFinishing && progress > 0 ? 'active' : ''}`}
        style={{
          width: `${progress}%`
        }}
      >
        {/* Leading edge pharmaceutical glow peg */}
        <div className="bionano-progress-peg" />
      </div>
    </div>
  );
}

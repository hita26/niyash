import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { networkTracker } from '../utils/networkTracker';

/**
 * Bio-Nano Top Progress Bar
 * Enterprise Pharmaceutical Grade, non-intrusive top-loading progress indicator.
 * Dynamically reacts to route changes, API fetch queries, and admin dashboard operations.
 */
export default function BioNanoProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const location = useLocation();
  const prevPathRef = useRef(location.pathname + location.search);
  const isNetworkActiveRef = useRef(false);
  const isRouteTransitionRef = useRef(false);
  const trickleTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Clear all pending timers
  const clearTimers = () => {
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  // Start progress indicator
  const startProgress = () => {
    clearTimers();
    setIsFinishing(false);
    setVisible(true);
    setProgress((prev) => (prev > 0 && prev < 90 ? prev : 16));

    // Bio-nano trickle physics (fast start, gradual clinical creep up to 92%)
    trickleTimerRef.current = setInterval(() => {
      setProgress((curr) => {
        if (curr >= 92) return curr;
        if (curr < 35) return curr + Math.random() * 12 + 6;
        if (curr < 65) return curr + Math.random() * 6 + 3;
        if (curr < 85) return curr + Math.random() * 3 + 1;
        return curr + Math.random() * 0.8 + 0.3;
      });
    }, 220);
  };

  // Complete progress indicator smoothly
  const finishProgress = () => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }

    setIsFinishing(true);
    setProgress(100);

    // Give time for width animation to hit 100%
    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      // Wait for opacity fade-out before resetting width
      hideTimerRef.current = setTimeout(() => {
        setProgress(0);
        setIsFinishing(false);
      }, 300);
    }, 220);
  };

  // Check overall activity state
  const evaluateActivity = () => {
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
  }, []);

  // 2. Listen to Route Changes across the entire site
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      isRouteTransitionRef.current = true;
      evaluateActivity();

      // Ensure smooth completion even if route doesn't fire subsequent fetch requests
      const routeDoneTimer = setTimeout(() => {
        isRouteTransitionRef.current = false;
        evaluateActivity();
      }, 350);

      return () => clearTimeout(routeDoneTimer);
    }
  }, [location.pathname, location.search]);

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

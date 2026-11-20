import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter
 * Smoothly animates numbers up from 0 to the target value when scrolled into view.
 * Respects decimals, prefixes, suffixes, and Indian/international number formatting.
 */
export default function AnimatedCounter({
  end = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  style = {}
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const targetNumber = typeof end === 'number' ? end : parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime = null;

          const easeOutExpo = (x) => {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
          };

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);

            const current = easedProgress * targetNumber;
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(targetNumber);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  const formattedNumber = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString('en-IN');

  return (
    <span ref={containerRef} className={`animated-counter ${className}`} style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}

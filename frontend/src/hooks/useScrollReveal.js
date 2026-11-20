import { useEffect } from 'react';

/**
 * useScrollReveal
 * High-performance, zero-dependency scroll reveal animation hook.
 * Adds .is-revealed class to elements with .pharma-reveal as they scroll into view.
 * Inspired by Moderna and Pfizer scrollytelling UX.
 */
export default function useScrollReveal(dependency) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fallback for older browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.pharma-reveal').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const elements = document.querySelectorAll('.pharma-reveal:not(.is-revealed)');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [dependency]);
}

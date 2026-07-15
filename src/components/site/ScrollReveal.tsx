'use client';

import { useEffect } from 'react';

/**
 * ScrollReveal, a single global provider that fades `[data-reveal]` blocks in as
 * they scroll into view. One IntersectionObserver for the whole page instead of
 * one per Reveal, so the cost is constant regardless of how many blocks a page has.
 *
 * LCP-safe by design: content is visible by default (CSS only hides blocks once
 * `html.reveal-js` is set, which happens here after mount). Blocks already within
 * the first viewport are marked `.reveal-instant` (shown, no motion, no load flash);
 * everything below the fold animates on entry. Respects prefers-reduced-motion via CSS.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    // Anything already in (or just above) the first viewport shows instantly —
    // no fade on initial paint, which would read as a flash of hidden content.
    const foldLine = window.innerHeight * 0.92;
    for (const el of els) {
      if (el.getBoundingClientRect().top < foldLine) {
        el.classList.add('reveal-instant');
      } else {
        io.observe(el);
      }
    }

    // Flip the gate last, so the hide styles only apply once observers are wired.
    root.classList.add('reveal-js');

    return () => {
      io.disconnect();
      root.classList.remove('reveal-js');
    };
  }, []);

  return null;
}

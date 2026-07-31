'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * NumberTicker, animates a number counting up when scrolled into view.
 * Restrained duration (1.4s) and easing to feel like a real live-data update.
 *
 * Seeds `display` with the real value so the SERVER renders the true number and
 * the count-up is purely post-hydration. Initialising to 0 instead put "$0" in
 * the static HTML for every paid pricing tier while the page's own Offer schema
 * declared the real prices — a visible-content-vs-markup mismatch, and non-JS AI
 * crawlers read the 0 as fact. Keep this seeding if you reuse the component.
 */
export function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  duration = 1400,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const [seededValue, setSeededValue] = useState(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  // Re-seed to the true number when `value` changes, during render rather than in
  // an effect — the effect body only drives the count-up animation. This keeps the
  // static/first paint honest (see the note above) without a cascading re-render.
  if (seededValue !== value) {
    setSeededValue(value);
    setDisplay(value);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Nothing to animate: `display` already holds the true value from render.
    if (reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

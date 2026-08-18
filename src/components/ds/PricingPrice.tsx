'use client';

import { useEffect, useRef, useState } from 'react';
import { CURRENCY_SYMBOL, type Currency } from '@/lib/pricing';

/**
 * Renders a tier price. The server output is ALWAYS the real number.
 *
 * `NumberTicker` seeded its display state to 0, so the static HTML for /pricing
 * shipped "$0" for Starter, Standard and Professional while the same page's
 * AggregateOffer schema declared 9/19/39, the visible-content-vs-markup
 * mismatch Google's rich-result policy targets. Google renders JS and would
 * eventually see the truth; GPTBot, ClaudeBot, PerplexityBot and CCBot do not,
 * so they read $0 as the price.
 *
 * Seeding state with the real value makes the count-up pure post-hydration
 * decoration: the first paint and every non-JS fetch already show the price.
 */
export function PricingPrice({
  value,
  currency,
  className,
}: {
  value: number;
  currency: Currency;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const [seededValue, setSeededValue] = useState(value);
  const animated = useRef(false);

  // Re-seed when the tier, period or currency changes. During render, not in an
  // effect, so the new price paints immediately and never cascades a render. Never
  // passes through 0. The count-up below runs only on first mount.
  if (seededValue !== value) {
    setSeededValue(value);
    setDisplay(value);
  }

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;
    if (value <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const DURATION = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={className}>
      {CURRENCY_SYMBOL[currency]}
      {display.toLocaleString()}
    </span>
  );
}

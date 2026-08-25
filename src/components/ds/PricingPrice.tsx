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
  // Prices are either whole rupees/dollars or carry cents (e.g. $7.99); the
  // animation must land on the exact seeded value either way, not a rounded one.
  const decimals = Number.isInteger(value) ? 0 : 2;
  const format = (n: number) =>
    decimals === 0 ? Math.round(n).toLocaleString() : n.toFixed(decimals);

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
      // Clamped at both ends, same reason as NumberTicker: rAF reports the
      // current frame's start time, which can precede the `performance.now()`
      // captured just above, and an unclamped negative `t` drives the easing
      // below negative. On this component that paints a negative PRICE.
      const t = Math.max(0, Math.min(1, (now - start) / DURATION));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(t < 1 ? value * eased : value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={className}>
      {CURRENCY_SYMBOL[currency]}
      {format(display)}
    </span>
  );
}

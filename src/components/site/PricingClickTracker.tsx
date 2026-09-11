'use client';

import { useEffect } from 'react';

import { PRICING_CTA_SELECTOR, trackPricingPlanClick } from '@/lib/analytics';

/**
 * Reports pricing CTA clicks to GTM as `pricing_plan_click`.
 *
 * One delegated listener rather than an `onClick` per button, for the reason
 * `AttributionCapture` gives: the CTAs are server-rendered anchors, and the home
 * page's pricing section is a server component that should stay one. A CTA
 * opts in by carrying `pricingPlanAttributes(...)`.
 *
 * Capture phase, so a handler further down that stops propagation cannot hide a
 * click. `auxclick` covers the middle button, which opens the same signup in a
 * new tab without ever firing `click`.
 */
export default function PricingClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (event.type === 'auxclick' && event.button !== 1) return;
      if (!(event.target instanceof Element)) return;
      const cta = event.target.closest<HTMLElement>(PRICING_CTA_SELECTOR);
      if (cta) trackPricingPlanClick(cta);
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, []);

  return null;
}

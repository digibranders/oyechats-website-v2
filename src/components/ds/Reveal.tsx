'use client';

import type { ReactNode } from 'react';
import { FadeUp } from '@/components/ui/FadeUp';

/**
 * Reveal, fades a block up as it scrolls into view. Thin wrapper over FadeUp
 * (motion/react, whileInView): SSR-safe and bfcache-safe — content is visible
 * by default and only below-the-fold blocks arm the entrance animation, so the
 * hero/LCP text never paints at opacity 0. Respects prefers-reduced-motion.
 *
 * The `delay` prop is in MILLISECONDS (staggering across a grid reads naturally
 * as `delay={i * 60}`); it is converted to the seconds FadeUp expects.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeUp delay={delay / 1000} className={className}>
      {children}
    </FadeUp>
  );
}

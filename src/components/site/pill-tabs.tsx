'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';

/**
 * Keeps the active pill scrolled to the horizontal centre of its overflow
 * container. Matters on mobile, where the pill row scrolls and the active pill
 * can otherwise sit off-screen; it is a no-op when the row fits (desktop).
 *
 * Attach the returned ref to the scroll container, and mark the active pill
 * with `data-active="true"`.
 */
export function useCenteredTabs<T extends HTMLElement>(activeKey: string) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;

    const center = () => {
      const el = scroller.querySelector<HTMLElement>('[data-active="true"]');
      if (!el) return;
      // getBoundingClientRect works regardless of the pill's offsetParent (the
      // scroller isn't necessarily positioned), so this stays correct anywhere.
      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elLeftInContent = scroller.scrollLeft + (elRect.left - scrollerRect.left);
      const target = elLeftInContent - (scroller.clientWidth - elRect.width) / 2;
      scroller.scrollTo({ left: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' });
    };

    center();
    window.addEventListener('resize', center);
    return () => window.removeEventListener('resize', center);
  }, [activeKey, reduce]);

  return ref;
}

/**
 * Sliding "magic-ink" highlight shared across the pills in a tab row. Render it
 * only inside the *active* pill; because every pill in the row uses the same
 * `layoutId`, motion animates the fill from the previously-active pill's
 * position to the new one. Sits behind the pill label (give the label
 * `relative z-10`). Honours reduced-motion by snapping instead of sliding.
 */
export function PillHighlight({ layoutId, className }: { layoutId: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      layoutId={layoutId}
      className={cn('absolute inset-0 z-0 rounded-[var(--r-full)] bg-ink', className)}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 40, mass: 0.7 }}
    />
  );
}

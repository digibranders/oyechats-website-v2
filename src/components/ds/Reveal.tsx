import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Reveal, marks a block for the global ScrollReveal provider to fade in from
 * below as it scrolls into view. Purely presentational — no hooks, no observer.
 * The single provider mounted in the root layout drives every `[data-reveal]`
 * block, so this stays a server component and adds nothing to the JS bundle.
 * Content is visible by default (JS-gated hide); respects prefers-reduced-motion.
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
    <div
      data-reveal
      className={cn(className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

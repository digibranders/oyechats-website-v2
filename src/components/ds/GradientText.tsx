import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

/**
 * GradientText, one word per hero, per DESIGN.md rule R-03.
 * Ink → Volt diagonal gradient. Use inside a headline, not as a full phrase.
 */
export function GradientText({
  children,
  variant = 'ink-volt',
  className,
}: {
  children: ReactNode;
  variant?: 'ink-volt' | 'volt-only';
  className?: string;
}) {
  return (
    <span
      className={cn(
        variant === 'ink-volt' ? 'gradient-volt' : 'gradient-volt-only',
        className
      )}
    >
      {children}
    </span>
  );
}

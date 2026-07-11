import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'mono' | 'soft' | 'outline' | 'signal' | 'alert' | 'danger';

const base = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium leading-none border rounded-[var(--r-1)] whitespace-nowrap';

const variants: Record<Variant, string> = {
  mono: 'font-mono bg-canvas border-line text-muted',
  soft: 'bg-volt-tint border-volt-line text-volt-ink',
  outline: 'bg-transparent border-line-2 text-ink-2',
  signal: 'bg-signal-tint border-transparent text-signal',
  alert: 'bg-alert-tint border-transparent text-alert',
  danger: 'bg-danger-tint border-transparent text-danger',
};

export function Chip({
  variant = 'mono',
  pill,
  className,
  children,
}: {
  variant?: Variant;
  pill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(base, variants[variant], pill && 'rounded-full', className)}
    >
      {variant === 'signal' && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-signal inline-block signal-dot-pulse"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

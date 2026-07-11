import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'border border-line rounded-[var(--r-3)] overflow-hidden bg-canvas overflow-x-auto',
        className
      )}
    >
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function Th({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={cn(
        'bg-paper type-mono-sm text-muted px-4 py-3 border-b border-line font-medium',
        align === 'right' && 'text-right'
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  num,
  className,
}: {
  children: ReactNode;
  num?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        'px-4 py-3.5 text-sm text-ink-2 border-b border-line last:border-b-0',
        num && 'font-mono text-ink text-right tabular-nums',
        className
      )}
    >
      {children}
    </td>
  );
}

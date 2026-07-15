import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'border border-line rounded-[var(--r-3)] overflow-hidden bg-canvas',
        className
      )}
    >
      {/* Inner scroll container: `min-w` on the table forces horizontal scroll
          on narrow viewports instead of crushing columns to min-content.
          The rounded frame (overflow-hidden) is kept on the outer element so
          the two overflow axes don't fight on one node. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">{children}</table>
      </div>
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

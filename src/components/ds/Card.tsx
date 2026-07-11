import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  className,
  children,
  hover = true,
  padding = 'md',
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}) {
  const pad = padding === 'sm' ? 'p-5' : padding === 'lg' ? 'p-8' : 'p-6';
  return (
    <div
      className={cn(
        'bg-canvas border border-line rounded-[var(--r-3)] shadow-[var(--e-1)]',
        hover &&
          'transition-[box-shadow,transform,border-color] duration-300 ease-[var(--ease-inout)] hover:shadow-[0_20px_40px_-16px_rgba(162,28,175,0.14),0_1px_2px_rgba(11,16,32,0.06)] hover:-translate-y-1 hover:border-volt/40',
        pad,
        className
      )}
    >
      {children}
    </div>
  );
}

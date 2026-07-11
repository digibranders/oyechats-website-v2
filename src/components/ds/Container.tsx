import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Size = 'default' | 'prose' | 'narrow' | 'wide';

const sizes: Record<Size, string> = {
  default: 'max-w-[1200px]',
  prose: 'max-w-[680px]',
  narrow: 'max-w-[540px]',
  wide: 'max-w-[1360px]',
};

export function Container({
  size = 'default',
  className,
  children,
}: {
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('mx-auto px-6 md:px-12', sizes[size], className)}>
      {children}
    </div>
  );
}

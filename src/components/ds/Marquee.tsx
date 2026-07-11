import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

/**
 * Marquee ticker, used for the announcement bar of recent releases and stat
 * strips. Content is duplicated so the loop is seamless.
 */
export function Marquee({
  items,
  speed = 40,
  className,
}: {
  items: ReactNode[];
  speed?: number;
  className?: string;
}) {
  return (
    <div className={cn('marquee-mask overflow-hidden', className)}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="type-mono-md text-muted flex items-center gap-3 shrink-0"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-line-2" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

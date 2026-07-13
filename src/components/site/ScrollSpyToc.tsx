'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export type TocItem = { id: string; label: string };

/**
 * Scroll-spy table of contents. Watches the target sections via
 * IntersectionObserver and highlights the entry for the section currently in
 * view. Renders as a vertical TOC ("toc") or a horizontal pill bar ("pills").
 */
export function ScrollSpyToc({
  items,
  variant = 'toc',
  label,
  className,
}: {
  items: TocItem[];
  variant?: 'toc' | 'pills';
  label?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    // Track which sections are inside the "active band" near the top of the
    // viewport; the topmost one (in TOC order) wins.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = items.find((it) => visible.has(it.id));
        if (first) setActiveId(first.id);
      },
      // Band from just below the sticky navbar (~96px) to 60% up from the bottom.
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (variant === 'pills') {
    return (
      <div className={cn('flex gap-2 overflow-x-auto', className)}>
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <Link
              key={it.id}
              href={`#${it.id}`}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'shrink-0 px-3.5 py-1.5 rounded-[var(--r-full)] type-mono-sm border no-underline transition-colors',
                active
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-canvas text-muted border-line hover:border-line-2 hover:text-ink'
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <div className="type-mono-sm text-muted mb-3">{label}</div>}
      <ul className="space-y-1">
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'type-body-sm no-underline block border-l-2 pl-3 py-1 transition-colors',
                  active
                    ? 'border-volt text-volt font-medium'
                    : 'border-transparent text-ink-2 hover:text-ink hover:border-line-2'
                )}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

'use client';

import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { PillHighlight, useCenteredTabs } from './pill-tabs';

export type TocItem = { id: string; label: string; level?: 2 | 3 };

/**
 * Scroll-spy table of contents. Highlights the entry for the section currently
 * under the sticky header, and scrolls to a section on click. Renders as a
 * vertical TOC ("toc") or a horizontal pill bar ("pills").
 *
 * `offsetTop` is the height of whatever is pinned above the content (sticky
 * navbar + any sticky sub-bar). It defines the line a section's top must cross
 * to become active and should roughly match the sections' `scroll-margin-top`.
 */
export function ScrollSpyToc({
  items,
  variant = 'toc',
  label,
  offsetTop = 110,
  className,
}: {
  items: TocItem[];
  variant?: 'toc' | 'pills';
  label?: string;
  offsetTop?: number;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const highlightId = useId();
  const scrollerRef = useCenteredTabs<HTMLDivElement>(activeId);

  useEffect(() => {
    if (!items.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const els = items
        .map((it) => ({ id: it.id, el: document.getElementById(it.id) }))
        .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);
      if (!els.length) return;

      // At the bottom of the page the active line can't reach a short trailing
      // section, so pin the last item once the page is scrolled to the end.
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setActiveId(els[els.length - 1].id);
        return;
      }

      // Active = the last section whose top has crossed the offset line (just
      // below the sticky header); defaults to the first section near page top.
      let current = els[0].id;
      for (const { id, el } of els) {
        if (el.getBoundingClientRect().top <= offsetTop + 8) current = id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [items, offsetTop]);

  if (variant === 'pills') {
    return (
      <div ref={scrollerRef} className={cn('flex gap-2 overflow-x-auto', className)}>
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              data-active={active || undefined}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'relative shrink-0 px-3.5 py-1.5 rounded-[var(--r-full)] type-mono-sm border no-underline transition-colors',
                active
                  ? 'text-paper border-transparent'
                  : 'bg-canvas text-muted border-line hover:border-line-2 hover:text-ink'
              )}
            >
              {active && <PillHighlight layoutId={highlightId} />}
              <span className="relative z-10">{it.label}</span>
            </a>
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
                  'type-body-sm no-underline block border-l-2 py-1 transition-colors',
                  it.level === 3 ? 'pl-6' : 'pl-3',
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

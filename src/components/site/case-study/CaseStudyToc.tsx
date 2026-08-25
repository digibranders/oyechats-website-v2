'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ds';
import { cn } from '@/lib/cn';

export type CaseTocItem = { id: string; label: string };

/**
 * Height of the global header this nav pins beneath. Mirrors the `top-16` on
 * the <nav> below; the two must move together.
 */
const STICKY_TOP = 64;

/**
 * Section navigation for a case study.
 *
 * This replaces a nine-item horizontal pill rail whose content measured 1449px
 * against a 994px track at 1280px and a 327px track at 375px, so 31% of it was
 * unreachable on desktop and 77% on mobile, with a bare scrollbar and a label
 * sliced mid-word. The fix is fewer destinations, not a wider scroller: five
 * anchors fit inline at every desktop width, and below `md` they collapse into
 * a disclosure rather than scrolling sideways.
 *
 * Active state is carried by three signals, never colour alone: `aria-current`,
 * a weight change, and a violet underline.
 */
export function CaseStudyToc({ items }: { items: CaseTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const navRef = useRef<HTMLElement | null>(null);

  // Scrollspy. rAF-coalesced and read-only against layout, so it costs one
  // measurement pass per frame while scrolling and nothing at rest.
  useEffect(() => {
    if (!items.length) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const els = items
        .map((it) => ({ id: it.id, el: document.getElementById(it.id) }))
        .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);
      if (!els.length) return;

      // The offset line is where the pinned chrome ENDS once stuck, which is
      // the header height plus this nav's own height. Reading the nav's live
      // `bottom` instead would be wrong before it sticks: at scroll 0 the nav
      // sits far down the page, giving a ~1249px offset that lit up the second
      // section on load.
      const offset = STICKY_TOP + (navRef.current?.offsetHeight ?? 48) + 8;

      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setActiveId(els[els.length - 1].id);
        return;
      }

      let current = els[0].id;
      for (const { id, el } of els) {
        if (el.getBoundingClientRect().top <= offset) current = id;
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
  }, [items]);

  // Close the disclosure if the viewport grows into the inline layout, so the
  // panel can't be left open behind a nav that no longer has a trigger.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => mq.matches && setOpen(false);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const activeLabel = items.find((it) => it.id === activeId)?.label ?? 'On this page';

  return (
    <nav
      ref={navRef}
      aria-label="Case study sections"
      className="sticky top-16 z-40 border-b border-line bg-paper/90 backdrop-blur-md"
    >
      <Container>
        {/* Desktop: five inline anchors. No pills, no scroller, no CTA. */}
        <ul className="hidden md:flex md:items-center md:gap-1">
          {items.map((it) => {
            const active = it.id === activeId;
            return (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  aria-current={active ? 'location' : undefined}
                  className={cn(
                    'relative flex min-h-11 items-center px-3 text-[13px] no-underline transition-colors',
                    active ? 'font-medium text-volt' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {it.label}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-opacity duration-200',
                      active ? 'bg-volt opacity-100' : 'opacity-0',
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile and tablet: a disclosure, not a sideways scroller. */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-h-11 w-full items-center justify-between gap-3 py-1 text-left"
          >
            <span className="min-w-0">
              <span className="type-mono-sm block text-muted">On this page</span>
              <span className="block truncate text-[14px] font-medium text-ink">
                {activeLabel}
              </span>
            </span>
            <ChevronDown
              size={18}
              aria-hidden
              className={cn(
                'shrink-0 text-muted transition-transform duration-200',
                open && 'rotate-180',
              )}
            />
          </button>

          {open && (
            <ul id={panelId} className="border-t border-line pb-2">
              {items.map((it) => {
                const active = it.id === activeId;
                return (
                  <li key={it.id}>
                    <a
                      href={`#${it.id}`}
                      aria-current={active ? 'location' : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex min-h-11 items-center border-l-2 pl-3 text-[14px] no-underline',
                        active
                          ? 'border-volt font-medium text-volt'
                          : 'border-transparent text-ink-2',
                      )}
                    >
                      {it.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </nav>
  );
}

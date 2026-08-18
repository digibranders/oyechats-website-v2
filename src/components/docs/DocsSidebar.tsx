'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { DOC_GROUPS } from '@/lib/docs';
import { cn } from '@/lib/cn';

/**
 * Docs navigation. One nav tree, rendered twice: a sticky rail on large
 * viewports and a slide-over drawer below `lg`. Both read the same
 * `DOC_GROUPS`, so the two can never list different pages.
 *
 * Client component because it needs the current pathname to mark the active
 * page and to close the drawer on navigation.
 */
function NavTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation">
      <ul className="space-y-6">
        {DOC_GROUPS.map((group) => (
          <li key={group.slug}>
            <p className="type-mono-sm text-muted mb-2 px-2">{group.label}</p>
            <ul className="space-y-px">
              {group.pages.map((page) => {
                const href = `/docs/${group.slug}/${page.slug}`;
                const active = pathname === href;
                return (
                  <li key={page.slug}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block rounded-[var(--r-2)] px-2 py-1.5 text-[13.5px] leading-snug no-underline transition-colors',
                        active
                          ? 'bg-volt-tint text-volt-ink font-semibold'
                          : 'text-ink-2 hover:text-ink hover:bg-paper',
                      )}
                    >
                      {page.navLabel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  /**
   * The drawer's open state is stored as *the path it was opened on*, and
   * `open` is derived from whether that still matches the current path. Any
   * navigation (a link inside the drawer, or the browser back button)
   * therefore closes it during render, with no effect and no cascading
   * setState. Storing a boolean and clearing it in an effect keyed on
   * `pathname` would leave the drawer covering the page for one paint.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  // Close on Escape, and stop the page scrolling behind the open drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedOn(null);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Desktop rail. `top` clears the sticky site navbar; the rail scrolls
          independently once the tree is taller than the viewport. */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 pb-8">
          <NavTree />
        </div>
      </aside>

      {/* Mobile trigger. Sticky so it stays reachable deep in a long page. */}
      <div className="lg:hidden sticky top-16 z-30 -mx-4 mb-6 border-b border-line bg-canvas/95 px-4 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-[var(--r-2)] border border-line px-3 py-1.5 text-[13px] font-medium text-ink"
        >
          <Menu size={15} aria-hidden="true" />
          Browse docs
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close documentation navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto border-r border-line bg-canvas px-4 py-4 shadow-[var(--e-3)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="type-mono-sm text-muted">Documentation</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-[var(--r-2)] p-1 text-muted hover:text-ink"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <NavTree onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

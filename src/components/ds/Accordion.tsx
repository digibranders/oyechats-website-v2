'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

type Item = { q: string; a: string };

/**
 * Uncontrolled by default (tracks its own open row). Pass `activeKey` + `onToggle`
 * to control it externally — e.g. to share a single "open" state across multiple
 * Accordions so only one row is open at a time across all of them. In controlled
 * mode each row is identified by its question text (`item.q`), which must be unique.
 */
export function Accordion({
  items,
  className,
  activeKey,
  onToggle,
}: {
  items: Item[];
  className?: string;
  activeKey?: string | null;
  onToggle?: (key: string) => void;
}) {
  const controlled = onToggle !== undefined;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((it, i) => {
        const isOpen = controlled ? activeKey === it.q : open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => (controlled ? onToggle(it.q) : setOpen(isOpen ? null : i))}
              className="w-full flex items-center justify-between text-left py-5 gap-6"
              aria-expanded={isOpen}
              aria-controls={`${baseId}-panel-${i}`}
            >
              <span className="type-heading-3 text-ink">{it.q}</span>
              <Plus
                size={18}
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-muted transition-transform duration-200',
                  isOpen && 'rotate-45'
                )}
              />
            </button>
            {/* Collapse stays CSS-only (grid-rows 0fr) so every answer remains in
                the DOM: that is what keeps the FAQPage markup visible-content
                compliant and lets AI answer engines extract the text. Switching
                to conditional rendering or display:none would destroy both.
                `inert` + `aria-hidden` hide it from assistive tech only -
                crawlers ignore both attributes. */}
            <div
              id={`${baseId}-panel-${i}`}
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-[var(--ease-inout)]',
                isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden" inert={!isOpen ? true : undefined} aria-hidden={!isOpen}>
                <div className="type-body text-ink-2 max-w-2xl">{it.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

type Item = { q: string; a: string };

export function Accordion({ items, className }: { items: Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between text-left py-5 gap-6"
              aria-expanded={isOpen}
            >
              <span className="type-heading-3 text-ink">{it.q}</span>
              <Plus
                size={18}
                className={cn(
                  'shrink-0 text-muted transition-transform duration-200',
                  isOpen && 'rotate-45'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-[var(--ease-inout)]',
                isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <div className="type-body text-ink-2 max-w-2xl">{it.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

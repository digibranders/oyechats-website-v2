import { ArrowRight } from 'lucide-react';
import type { ComparisonRow } from '@/lib/case-studies';

/**
 * Website reality against what the business needed.
 *
 * Rows are pairs, not two independent lists. Two columns of five would separate
 * on mobile into two stacks a reader has to re-pair by counting; keeping the
 * pair as the unit means the association survives the breakpoint.
 */
export function ChallengeComparison({
  rows,
  realityLabel,
  neededLabel,
}: {
  rows: ComparisonRow[];
  realityLabel: string;
  neededLabel: string;
}) {
  return (
    <div>
      <div className="hidden grid-cols-2 gap-8 border-b border-line pb-3 sm:grid">
        <span className="type-mono-sm text-muted">{realityLabel}</span>
        <span className="type-mono-sm text-muted">{neededLabel}</span>
      </div>

      <ul className="m-0 list-none p-0">
        {rows.map((row) => (
          <li
            key={row.reality}
            className="grid gap-x-8 gap-y-2 border-b border-line py-5 sm:grid-cols-2"
          >
            <span className="type-body text-ink-2">{row.reality}</span>
            <span className="type-body flex items-start gap-2.5 font-medium text-ink">
              <ArrowRight
                size={15}
                aria-hidden
                className="mt-[5px] shrink-0 text-volt sm:hidden"
              />
              {row.needed}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

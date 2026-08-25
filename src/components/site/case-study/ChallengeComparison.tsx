import type { ComparisonRow } from '@/lib/case-studies';

/**
 * Website reality against what the business needed.
 *
 * The change is encoded in the type rather than in a table header: the prior
 * state is set in the mono face and muted, the resolved state in the body face
 * and ink. Raw signal on the left, fact on the right. A reader feels the
 * direction before reading either column, and because each row is one grid
 * item the pairing survives the mobile stack instead of separating into two
 * lists that have to be re-paired by counting.
 *
 * The same grammar closes the page in the business impact section.
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
      <div className="hidden gap-6 border-b border-line pb-3 sm:grid sm:grid-cols-[1fr_auto_1.1fr]">
        <span className="type-mono-sm text-muted">{realityLabel}</span>
        <span aria-hidden />
        <span className="type-mono-sm text-muted">{neededLabel}</span>
      </div>

      <ul className="m-0 list-none p-0">
        {rows.map((row) => (
          <li
            key={row.reality}
            className="grid items-baseline gap-x-6 gap-y-1.5 border-b border-line py-5 sm:grid-cols-[1fr_auto_1.1fr]"
          >
            <span className="font-mono text-[13px] leading-relaxed text-muted">
              {row.reality}
            </span>
            <span className="hidden font-mono text-[12px] text-volt sm:block" aria-hidden>
              &rarr;
            </span>
            <span className="type-body font-medium text-ink">{row.needed}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

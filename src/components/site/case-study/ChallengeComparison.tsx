import type { ComparisonRow } from '@/lib/case-studies';

/**
 * Website reality against what the business needed.
 *
 * The change is encoded in the type rather than in a table header: the prior
 * state is set in the mono face and muted, the resolved state in the body face
 * and ink. Raw signal on the left, fact on the right.
 *
 * The two halves have to sit close enough to read as one pair. An earlier
 * version let the columns fill the container, which put 309px of empty space
 * between the end of the left phrase and the arrow that was supposed to join
 * it to the right one, with the arrow itself only 16px wide. Constraining the
 * measure and running a single rule down the middle does the joining instead:
 * structure once, rather than the same glyph repeated on every row. Direction
 * is carried by the two column labels.
 *
 * Below md each pair stacks with the same short volt hinge the business impact
 * section uses, so the two comparisons on this page share one device.
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
    <div className="max-w-3xl">
      <div className="hidden border-b border-line pb-3 md:grid md:grid-cols-2">
        <span className="type-mono-sm text-muted">{realityLabel}</span>
        <span className="type-mono-sm border-l border-line pl-10 text-muted">
          {neededLabel}
        </span>
      </div>

      <ul className="m-0 list-none p-0">
        {rows.map((row) => (
          <li
            key={row.reality}
            className="border-b border-line py-4 md:grid md:grid-cols-2 md:items-baseline"
          >
            <span className="block font-mono text-[13px] leading-relaxed text-muted">
              {row.reality}
            </span>
            <span className="mb-2.5 mt-2 block h-px w-7 bg-volt md:hidden" aria-hidden />
            <span className="type-body block font-medium text-ink md:border-l md:border-line md:pl-10">
              {row.needed}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

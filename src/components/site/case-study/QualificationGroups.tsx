import type { QualificationGroup } from '@/lib/case-studies';

/**
 * What the chatbot learned, as a progression rather than a grid.
 *
 * The order is the argument: identity, then context, then intent, and the last
 * group only means something because the first two came before it. So the
 * accumulation has to be visible, not just implied by left-to-right order.
 *
 * It is carried by the tick row, not by the copy. An earlier version showed all
 * eleven attributes in every column, greying out the ones not yet captured, to
 * make the record appear to fill up. It did fill up, but it cost 33 lines to
 * convey 11 facts, the three columns read as near-identical lists, and putting
 * them in three bordered cards said "three separate things" while the concept
 * was one record in three states. Eleven small ticks say the same thing in one
 * line, so each attribute is written exactly once, under the step that captured
 * it.
 */
export function QualificationGroups({ groups }: { groups: QualificationGroup[] }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  // Cumulative totals derived up front rather than accumulated inside the map,
  // which would mutate a closure variable during render.
  const capturedBy = groups.reduce<number[]>(
    (acc, g) => [...acc, (acc[acc.length - 1] ?? 0) + g.items.length],
    [],
  );

  return (
    <ol className="m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-10">
      {groups.map((group, gi) => {
        const captured = capturedBy[gi];

        return (
          <li key={group.title} className="border-t border-line pt-5">
            <p className="type-mono-sm text-ink-2">
              <span className="text-volt">{String(gi + 1).padStart(2, '0')}</span>{' '}
              {group.title}
            </p>

            {/* One tick per attribute in the whole record, filled up to what
                this step has captured. Decorative: the count below says it. */}
            <div className="mt-4 flex gap-[3px]" aria-hidden>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-[1px] ${i < captured ? 'bg-volt' : 'bg-line'}`}
                />
              ))}
            </div>
            <p className="type-mono-sm mt-2.5 text-muted tabular-nums">
              {captured} of {total} captured
            </p>

            <ul className="m-0 mt-6 flex list-none flex-col gap-2.5 p-0">
              {group.items.map((item) => (
                <li key={item} className="text-[15px] leading-snug text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

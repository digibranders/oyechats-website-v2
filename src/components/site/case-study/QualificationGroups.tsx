import type { QualificationGroup } from '@/lib/case-studies';

/**
 * What the chatbot learned, as a progression rather than a grid.
 *
 * The previous version was eleven equal cells, which said the attributes were
 * a set. They are a sequence: identity first, then context, then intent, and
 * that order is the reason the last stage means anything.
 */
export function QualificationGroups({ groups }: { groups: QualificationGroup[] }) {
  return (
    <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
      {groups.map((group, i) => (
        <li key={group.title} className="relative">
          {/* The rule runs along the top on desktop and down the left on
              mobile, so the direction of travel matches the reading direction
              at both sizes. */}
          <span
            aria-hidden
            className="absolute left-0 top-0 hidden h-px w-full bg-line md:block"
          />
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px bg-line md:hidden"
          />
          <span
            aria-hidden
            className="absolute left-0 top-0 hidden h-px w-8 bg-volt md:block"
          />
          <span aria-hidden className="absolute left-0 top-0 h-8 w-px bg-volt md:hidden" />

          <div className="pl-6 md:pl-0 md:pt-6">
            <p className="font-mono text-[11px] font-semibold tabular-nums text-volt">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="type-heading-3 mt-2 text-ink">{group.title}</h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="type-body text-ink-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

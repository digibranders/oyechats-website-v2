import { cn } from '@/lib/cn';
import type { QualificationGroup } from '@/lib/case-studies';

/**
 * One record, shown in three states.
 *
 * The mechanism this section describes is accumulation: a single record fills
 * up as the conversation continues. Three columns of bullets *describe* that.
 * Three states of the same record *demonstrate* it, and the ghosted fields
 * carry the part a list cannot show, which is what is still unknown at each
 * step. The reader watches a stranger become a prospect.
 *
 * Every field, and the order they arrive in, comes from the corpus. Nothing is
 * a mocked-up product screen: there is no visitor name, no company, no message
 * text and no score, because the source records none of those.
 */
export function QualificationGroups({ groups }: { groups: QualificationGroup[] }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <ol className="m-0 grid list-none gap-5 p-0 md:grid-cols-3 md:gap-4">
      {groups.map((group, gi) => {
        const held = groups.slice(0, gi).flatMap((g) => g.items);
        const ghost = groups.slice(gi + 1).flatMap((g) => g.items);
        const known = held.length + group.items.length;

        return (
          <li
            key={group.title}
            className="rounded-[var(--r-3)] border border-line bg-paper p-5"
          >
            <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <span className="type-mono-sm text-ink-2">
                {String(gi + 1).padStart(2, '0')} {group.title}
              </span>
              <span className="type-mono-sm text-volt tabular-nums">
                {known} / {total}
              </span>
            </div>

            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {held.map((item) => (
                <Field key={item} label={item} state="held" />
              ))}
              {group.items.map((item) => (
                <Field key={item} label={item} state="fresh" />
              ))}
              {ghost.map((item) => (
                <Field key={item} label={item} state="unknown" />
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * `unknown` fields are `aria-hidden` and repeated as `fresh` in a later column,
 * so a screen reader hears each attribute once, at the step it is captured,
 * rather than three times in three states.
 */
function Field({
  label,
  state,
}: {
  label: string;
  state: 'held' | 'fresh' | 'unknown';
}) {
  return (
    <li
      aria-hidden={state !== 'fresh' || undefined}
      className={cn(
        'flex items-center gap-2.5 text-[13.5px] leading-snug',
        state === 'fresh' && 'font-medium text-ink',
        state === 'held' && 'text-muted',
        state === 'unknown' && 'text-line-2',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-[2px]',
          state === 'unknown' ? 'bg-line' : 'bg-volt',
        )}
      />
      {label}
    </li>
  );
}

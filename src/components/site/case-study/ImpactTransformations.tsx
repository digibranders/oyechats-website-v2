/**
 * Three transformations, not six feature tiles.
 *
 * The previous version was a six-cell grid of one-line claims, which read as a
 * feature list rather than an argument about what changed. Each block here is
 * a named shift with a paragraph behind it, and every clause traces to a
 * statement in the source. No percentages, because the source reports none for
 * these.
 */
export function ImpactTransformations({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ol className="m-0 list-none p-0">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="grid gap-x-10 gap-y-3 border-t border-line py-9 md:grid-cols-12"
        >
          <p className="font-mono text-[11px] font-semibold tabular-nums text-volt md:col-span-1">
            {String(i + 1).padStart(2, '0')}
          </p>
          <h3 className="type-heading-2 text-ink md:col-span-5">{item.title}</h3>
          <p className="type-body text-ink-2 md:col-span-6">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

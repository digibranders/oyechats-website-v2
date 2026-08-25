/**
 * Three transformations, not six feature tiles.
 *
 * Each block reuses the grammar the challenge section opens with: the prior
 * state in the mono face and muted, the outcome in ink. Setting them the same
 * way is what makes the page answer its own opening rather than just stopping.
 * Every clause traces to a statement in the source, and there are no
 * percentages, because the source reports none for these.
 */
export function ImpactTransformations({
  items,
}: {
  items: { was?: string; title: string; body: string }[];
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

          <div className="md:col-span-5">
            {item.was && (
              <p className="font-mono text-[13px] leading-relaxed text-muted">{item.was}</p>
            )}
            <h3 className="type-heading-2 mt-1.5 text-ink">{item.title}</h3>
          </div>

          <p className="type-body text-ink-2 md:col-span-6">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

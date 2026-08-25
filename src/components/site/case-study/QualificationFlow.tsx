import { cn } from '@/lib/cn';

/**
 * Explanatory diagram of how a conversation resolves into a potential lead.
 *
 * Deliberately NOT a product screenshot and not a chat transcript. It carries
 * no visitor name, no company, no message text and no score, because none of
 * that exists in the source and a mocked-up interface on an evidence page would
 * read as customer proof. What it does show is the six signals the source lists
 * as captured, converging on the one outcome the study counts.
 */

/** Every entry appears in the source's captured-attributes list. */
const SIGNALS = [
  'Company identified',
  'Business email',
  'Email validated',
  'Requirement captured',
  'Purchase intent',
  'Sales assistance',
];

export function QualificationFlow({ className }: { className?: string }) {
  return (
    <figure className={cn('m-0', className)}>
      <figcaption className="type-mono-sm mb-4 flex items-center gap-2.5 text-muted">
        <span className="h-px w-6 bg-volt" aria-hidden />
        Qualification flow
      </figcaption>

      <div className="rounded-[var(--r-4)] border border-line bg-canvas p-5 md:p-6">
        <ul className="space-y-0">
          {SIGNALS.map((signal, i) => (
            <li key={signal} className="flex items-stretch gap-3.5">
              {/* The rail is one continuous line per row, so the column reads
                  as a single path rather than six detached ticks. */}
              <span className="relative flex w-3 shrink-0 justify-center" aria-hidden>
                <span
                  className={cn(
                    'w-px bg-line-2',
                    i === 0 ? 'mt-[18px] h-[calc(100%-18px)]' : 'h-full',
                  )}
                />
                <span className="absolute top-[15px] h-1.5 w-1.5 rounded-full bg-volt" />
              </span>
              <span className="type-body-sm py-2 text-ink-2">{signal}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-stretch gap-3.5">
          <span className="flex w-3 shrink-0 justify-center" aria-hidden>
            <span className="h-4 w-px bg-line-2" />
          </span>
        </div>

        <p className="type-mono-sm rounded-[var(--r-2)] border border-volt-line bg-volt-tint px-4 py-3 text-volt-ink">
          Potential B2B lead
        </p>
      </div>
    </figure>
  );
}

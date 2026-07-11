import { cn } from '@/lib/cn';

/** Editorial pull-quote, Fraunces italic. Once per Blog/About page, per DESIGN.md. */
export function PullQuote({
  quote,
  cite,
  className,
}: {
  quote: string;
  cite?: string;
  className?: string;
}) {
  return (
    <blockquote
      className={cn('relative pl-10 pr-4 py-8 max-w-[720px] not-italic', className)}
    >
      <span
        className="absolute left-0 top-0 font-serif text-[6rem] leading-none text-volt select-none pointer-events-none"
        aria-hidden
      >
        &ldquo;
      </span>
      <p className="font-serif italic text-[clamp(1.5rem,2vw+1rem,2.25rem)] leading-[1.2] text-ink">
        {quote}
      </p>
      {cite && (
        <cite className="block mt-5 type-mono-sm text-muted not-italic">{cite}</cite>
      )}
    </blockquote>
  );
}

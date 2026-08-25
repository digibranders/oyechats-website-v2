/**
 * Where the numbers came from. Secondary in weight, but never hidden: it is
 * what lets a reader decide how much the rest of the page is worth.
 */
export function MethodologyNote({ text }: { text: string }) {
  return (
    <p className="type-body-sm measure mt-10 border-l-2 border-line-2 pl-4 text-muted">
      <span className="type-mono-sm text-ink-2">Method. </span>
      {text}
    </p>
  );
}

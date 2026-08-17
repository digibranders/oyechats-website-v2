import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

/**
 * Inline renderer for docs prose. Supports exactly three constructs:
 *
 *   `code`             → <code>
 *   **bold**           → <strong>
 *   [label](/path)     → link
 *
 * Nodes are constructed by hand rather than by injecting HTML, so the corpus
 * cannot introduce XSS no matter what a content file contains.
 *
 * The pattern is a single alternation scanned left to right, which is what
 * keeps the three constructs from interfering: a `[label](...)` whose label
 * contains backticks is matched as a link first, and its label is then scanned
 * for the remaining two constructs.
 */
const TOKEN_RE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;

function codeSpan(text: string, key: number): ReactNode {
  return (
    <code
      key={key}
      className="font-mono text-[0.86em] text-volt-ink bg-volt-tint border border-volt-line rounded-[var(--r-1)] px-1.5 py-[1px] break-words"
    >
      {text}
    </code>
  );
}

/** Render `text` with bold and code spans, but no links (used inside link labels). */
function renderPlain(text: string, keyBase: number): ReactNode {
  if (!text.includes('`') && !text.includes('**')) return text;

  const nodes: ReactNode[] = [];
  let last = 0;
  let key = keyBase;

  for (const match of text.matchAll(/`([^`]+)`|\*\*([^*]+)\*\*/g)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(<Fragment key={key++}>{text.slice(last, start)}</Fragment>);
    if (match[1] !== undefined) nodes.push(codeSpan(match[1], key++));
    else nodes.push(<strong key={key++} className="font-semibold text-ink">{match[2]}</strong>);
    last = start + match[0].length;
  }

  if (last < text.length) nodes.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return nodes;
}

export function DocsInline({ text }: { text: string }): ReactNode {
  if (!text.includes('`') && !text.includes('**') && !text.includes('](')) return text;

  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN_RE)) {
    const [full, code, bold, label, href] = match;
    const start = match.index ?? 0;

    if (start > last) {
      nodes.push(<Fragment key={key++}>{text.slice(last, start)}</Fragment>);
    }

    if (code !== undefined) {
      nodes.push(codeSpan(code, key++));
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-ink">
          {bold}
        </strong>,
      );
    } else if (href.startsWith('/')) {
      nodes.push(
        <Link
          key={key++}
          href={href}
          className="text-volt underline decoration-volt-line underline-offset-2 hover:decoration-volt"
        >
          {renderPlain(label, key * 1000)}
        </Link>,
      );
    } else {
      const external = href.startsWith('http');
      nodes.push(
        <a
          key={key++}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-volt underline decoration-volt-line underline-offset-2 hover:decoration-volt"
        >
          {renderPlain(label, key * 1000)}
        </a>,
      );
    }

    last = start + full.length;
  }

  if (last < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  }

  return nodes;
}

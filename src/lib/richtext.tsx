import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

// Matches inline markdown-style links: [label](/internal) or [label](https://ext)
const LINK_RE = /\[([^\]]+)\]\((\/[^)]+|https?:\/\/[^)]+)\)/g;

/**
 * Renders a blog text string with support for inline `[label](href)` links.
 * Internal hrefs (starting with `/`) use next/link; external hrefs open in a new
 * tab with rel="noopener". Plain strings (no link syntax) pass straight through,
 * so existing posts are unaffected. No HTML is injected — nodes are built by
 * hand, so this is XSS-safe by construction.
 */
export function renderRichText(text: string): ReactNode {
  if (!text.includes('](')) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, href] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, start)}</Fragment>);
    }
    if (href.startsWith('/')) {
      nodes.push(
        <Link key={key++} href={href}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    }
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}

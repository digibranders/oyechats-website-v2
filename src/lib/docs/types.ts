/**
 * Content model for the public documentation at `/docs/*`.
 *
 * Docs pages are data, not JSX, for the same reason `lib/legal.ts` is: the
 * renderer stays one auditable component, every page gets identical spacing and
 * heading semantics, and the whole corpus is greppable when a product fact
 * changes. A page is an ordered list of blocks; the renderer
 * (`components/docs/DocBlocks.tsx`) is the only place that decides how each
 * block looks.
 *
 * Inline formatting inside any `text` field supports exactly two constructs,
 * both handled by `renderDocsInline`:
 *
 *   `code`              → inline code span
 *   [label](/path)      → link (internal via next/link, external opens a tab)
 *
 * No raw HTML is ever injected, so the corpus is XSS-safe by construction.
 */

export type CalloutVariant = 'info' | 'warn' | 'success' | 'danger';

/** Paragraph of prose. */
export type ParagraphBlock = { t: 'p'; text: string };

/** Sub-heading inside a section. Rendered as `<h3>`; not part of the page TOC. */
export type SubheadBlock = { t: 'h3'; text: string };

/** Bulleted (default) or numbered list. */
export type ListBlock = { t: 'list'; items: string[]; ordered?: boolean };

/** Numbered walkthrough where each step has a bold lead-in. */
export type StepsBlock = { t: 'steps'; items: { title: string; text: string }[] };

/** Fenced code sample. `label` is the chip in the block's header bar. */
export type CodeBlock = { t: 'code'; label: string; code: string };

/** Data table. Every row must have the same length as `head`. */
export type TableBlock = { t: 'table'; head: string[]; rows: string[][] };

/** Short aside. Reuses the site's `Callout` so docs asides match the rest of the site. */
export type CalloutBlock = { t: 'callout'; variant?: CalloutVariant; title?: string; text: string };

/** Grid of links out to other docs pages or site routes. */
export type CardsBlock = { t: 'cards'; items: { title: string; text: string; href: string }[] };

/** Definition list — term on the left, meaning on the right. */
export type DefsBlock = { t: 'defs'; items: { term: string; text: string }[] };

/** One REST endpoint row. Rendered as a method badge + path + description. */
export type EndpointsBlock = {
  t: 'endpoints';
  items: { method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'; path: string; text: string }[];
};

export type DocBlock =
  | ParagraphBlock
  | SubheadBlock
  | ListBlock
  | StepsBlock
  | CodeBlock
  | TableBlock
  | CalloutBlock
  | CardsBlock
  | DefsBlock
  | EndpointsBlock;

/** A `<h2>`-level section. `id` is the anchor and the TOC entry key. */
export type DocSection = {
  id: string;
  heading: string;
  blocks: DocBlock[];
};

export type DocPage = {
  /** URL segment within its group, e.g. `install` → `/docs/widget/install`. */
  slug: string;
  /** Sidebar label. Keep it short — the sidebar column is narrow. */
  navLabel: string;
  /** Visible `<h1>`. */
  title: string;
  /** Lede paragraph under the `<h1>`, and the `/docs` card body. */
  summary: string;
  /** `<title>` only. Written for the SERP, so it may differ from `title`. */
  metaTitle: string;
  /** `<meta name="description">` only. */
  metaDescription: string;
  sections: DocSection[];
};

export type DocGroup = {
  /** URL segment, e.g. `widget` → `/docs/widget/*`. */
  slug: string;
  /** Sidebar group heading. */
  label: string;
  /** One line describing the group, shown on the `/docs` index. */
  description: string;
  pages: DocPage[];
};

/** A page plus the group it belongs to and its position in the flat reading order. */
export type ResolvedDocPage = {
  group: DocGroup;
  page: DocPage;
  path: string;
  prev: { title: string; path: string } | null;
  next: { title: string; path: string } | null;
};

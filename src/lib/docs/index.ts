import type { DocGroup, DocPage, ResolvedDocPage } from './types';
import { GETTING_STARTED } from './content/getting-started';
import { CHATBOT } from './content/chatbot';
import { WIDGET } from './content/widget';
import { CONVERSATIONS } from './content/conversations';
import { LEADS } from './content/leads';
import { ANALYTICS } from './content/analytics';
import { INTEGRATIONS } from './content/integrations';
import { API } from './content/api';
import { ACCOUNT } from './content/account';
import { SUPPORT } from './content/support';

export type * from './types';

/**
 * Sidebar order IS reading order. `prev`/`next` on every page are derived from
 * this array flattened, so re-ordering here re-wires the pager and the sitemap
 * with it. There is no second list to keep in sync.
 */
export const DOC_GROUPS: DocGroup[] = [
  GETTING_STARTED,
  CHATBOT,
  WIDGET,
  CONVERSATIONS,
  LEADS,
  ANALYTICS,
  INTEGRATIONS,
  API,
  ACCOUNT,
  SUPPORT,
];

/**
 * Docs content is edited by hand, and two kinds of mistake are silent in a
 * data-driven renderer: a duplicated path (one page becomes unreachable, and
 * `generateStaticParams` emits a duplicate route) and a table row whose length
 * does not match its header (cells shift left and the table lies).
 *
 * Both are caught here, at module load, so they fail the build rather than
 * shipping. This module is imported by the docs route, the docs index and the
 * sitemap, so there is no path into the docs that skips the check.
 */
function assertCorpusIsWellFormed(groups: DocGroup[]): void {
  const seen = new Set<string>();

  for (const group of groups) {
    for (const page of group.pages) {
      const path = `/docs/${group.slug}/${page.slug}`;
      if (seen.has(path)) {
        throw new Error(`Duplicate docs path: ${path}`);
      }
      seen.add(path);

      for (const section of page.sections) {
        for (const block of section.blocks) {
          if (block.t === 'table') {
            const width = block.head.length;
            const bad = block.rows.findIndex((row) => row.length !== width);
            if (bad !== -1) {
              throw new Error(
                `${path}#${section.id}: table row ${bad} has ${block.rows[bad].length} cells, header has ${width}`,
              );
            }
          }
        }
      }
    }
  }
}

assertCorpusIsWellFormed(DOC_GROUPS);

/** Every page in reading order, each carrying its group and resolved path. */
export const DOC_PAGES: { group: DocGroup; page: DocPage; path: string }[] = DOC_GROUPS.flatMap((group) =>
  group.pages.map((page) => ({ group, page, path: `/docs/${group.slug}/${page.slug}` })),
);

/** The first page of the corpus, the "Start reading" target on `/docs`. */
export const DOC_ENTRY_PATH = DOC_PAGES[0].path;

/**
 * Resolve a `/docs/[group]/[page]` route to a page plus its neighbours, or
 * `null` for a path the corpus does not contain (the route turns that into a
 * 404).
 */
export function resolveDocPage(groupSlug: string, pageSlug: string): ResolvedDocPage | null {
  const index = DOC_PAGES.findIndex(
    (entry) => entry.group.slug === groupSlug && entry.page.slug === pageSlug,
  );
  if (index === -1) return null;

  const { group, page, path } = DOC_PAGES[index];
  const before = DOC_PAGES[index - 1];
  const after = DOC_PAGES[index + 1];

  return {
    group,
    page,
    path,
    prev: before ? { title: before.page.title, path: before.path } : null,
    next: after ? { title: after.page.title, path: after.path } : null,
  };
}

/** Static params for every docs page, matching `/docs/[group]/[page]`. */
export function docStaticParams(): { group: string; page: string }[] {
  return DOC_PAGES.map(({ group, page }) => ({ group: group.slug, page: page.slug }));
}

/**
 * Docs `lastModified` for the sitemap. Deliberately a single hand-maintained
 * date rather than `new Date()`: a build-time clock tells crawlers the whole
 * corpus changed on every deploy, which destroys the one freshness signal
 * `lastmod` carries. Update it when docs content changes.
 */
export const DOCS_LAST_UPDATED = '2026-08-17';
export const DOCS_PUBLISHED = '2026-07-14';

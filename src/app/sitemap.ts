import type { MetadataRoute } from 'next';
import { LEGAL_PAGES } from '@/lib/legal';
import { BLOG_POSTS } from '@/lib/blog';
import { CASE_STUDIES } from '@/lib/case-studies';
import { CHANGELOG } from '@/lib/changelog';
import { DOCS_LAST_UPDATED, DOC_PAGES } from '@/lib/docs';
import { COMPETITORS } from '@/lib/compare';

const BASE = 'https://www.oyechats.com';

/**
 * Static routes tiered by how often they genuinely change. Previously all
 * twelve shared one frozen date and `weekly`, which tells crawlers nothing:
 * declaring /legal as volatile as /pricing is noise, and a lastmod that never
 * moves removes the one signal Google actually uses for recrawl scheduling.
 *
 * Deliberately NOT `new Date()`, a build-time clock claims every page changed
 * on every deploy, which is worse than a stale date.
 */
const STATIC_ROUTES: { path: string; lastModified: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
  { path: '', lastModified: '2026-07-23', changeFrequency: 'weekly', priority: 1 },
  { path: '/pricing', lastModified: '2026-07-23', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/features', lastModified: '2026-07-23', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/solutions', lastModified: '2026-07-21', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/integrations', lastModified: '2026-07-18', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/docs', lastModified: DOCS_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/blog', lastModified: '2026-07-16', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/case-studies', lastModified: '2026-08-24', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/compare', lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', lastModified: '2026-07-14', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/about', lastModified: '2026-07-14', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/security', lastModified: '2026-07-14', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/legal', lastModified: '2026-07-07', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: new Date(r.lastModified),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // /changelog's freshness is knowable exactly, so derive it.
  routes.push({
    url: `${BASE}/changelog`,
    lastModified: new Date(CHANGELOG[0].dateISO),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  });

  const legal = LEGAL_PAGES.map((p) => ({
    url: `${BASE}/legal/${p.slug}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }));

  const blog = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Every docs page, derived from the corpus so a new page cannot be added
  // without appearing here. Priority sits just under /docs itself: these are
  // high-intent technical pages, and they change more often than legal but
  // less often than pricing.
  const docs = DOC_PAGES.map(({ path }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(DOCS_LAST_UPDATED),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Case studies are high-intent proof pages, so they sit above blog posts and
  // just under the library that lists them.
  const caseStudies = CASE_STUDIES.map((c) => ({
    url: `${BASE}/case-studies/${c.slug}`,
    lastModified: new Date(c.updatedISO ?? c.dateISO),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // The whole /compare cluster was missing from the sitemap, despite the note
  // at the top of `@/lib/compare` promising an entry here per competitor. These
  // are the highest-commercial-intent pages on the site, so leaving them out
  // was costing exactly the queries they exist to win. Derived from COMPETITORS
  // so a new rival cannot be added without appearing here.
  //
  // Only the public paths are listed: `/in/compare/...` is a currency variant
  // reached by proxy rewrite, canonicalised to its non-/in twin, and must not
  // compete with it in the index — same rule as `/in/pricing`.
  const comparisons = COMPETITORS.map((c) => ({
    url: `${BASE}/compare/${c.slug}`,
    lastModified: new Date('2026-08-30'),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...routes, ...docs, ...legal, ...blog, ...caseStudies, ...comparisons];
}

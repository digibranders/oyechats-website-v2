import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { ID, SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { DOCS_LAST_UPDATED, DOCS_PUBLISHED, docStaticParams, resolveDocPage } from '@/lib/docs';
import { DocBlocks } from '@/components/docs/DocBlocks';
import { DocsInline } from '@/components/docs/inline';
import { ScrollSpyToc } from '@/components/site/ScrollSpyToc';

/** Route params for `/docs/[group]/[page]`. `page` shadows nothing — it is the
 *  page slug, not the Next.js page module. */
type Params = { group: string; page: string };

export function generateStaticParams(): Params[] {
  return docStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { group, page } = await params;
  const resolved = resolveDocPage(group, page);
  if (!resolved) return {};

  return pageMeta({
    title: resolved.page.metaTitle,
    description: resolved.page.metaDescription,
    path: resolved.path,
  });
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { group: groupSlug, page: pageSlug } = await params;
  const resolved = resolveDocPage(groupSlug, pageSlug);
  if (!resolved) notFound();

  const { group, page, path, prev, next } = resolved;

  // TechArticle rather than a bare WebPage: these are procedural technical
  // documents, and the Article family needs an author, a publisher and
  // dateModified to be citable. Dates are hand-maintained in lib/docs — a
  // build-time clock would claim the whole corpus changed on every deploy.
  const graph = buildGraph({
    path,
    name: page.title,
    description: page.metaDescription,
    dateModified: DOCS_LAST_UPDATED,
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Documentation', path: '/docs' },
      { name: group.label, path: `/docs/${group.slug}/${group.pages[0].slug}` },
      { name: page.title },
    ],
    nodes: [
      {
        '@type': 'TechArticle',
        '@id': ID.article(path),
        headline: page.title,
        description: page.metaDescription,
        mainEntityOfPage: { '@id': ID.webPage(path) },
        datePublished: DOCS_PUBLISHED,
        dateModified: DOCS_LAST_UPDATED,
        inLanguage: 'en',
        author: { '@id': ID.organization },
        publisher: { '@id': ID.organization },
        image: `${SITE_URL}/opengraph-image`,
        about: { '@id': ID.software },
        articleSection: group.label,
      },
    ],
  });

  const toc = page.sections.map((section) => ({ id: section.id, label: section.heading }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-12">
        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 type-mono-sm text-muted">
              <li>
                <Link href="/docs" className="no-underline hover:text-ink">
                  Docs
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li className="text-volt">{group.label}</li>
            </ol>
          </nav>

          <h1 className="type-display-3 text-ink">{page.title}</h1>
          <p className="type-body-lg text-ink-2 mt-4 max-w-[68ch]">{page.summary}</p>

          {/* Mobile/tablet TOC: the sticky rail only exists at xl, so without
              this a long page has no in-page navigation on a laptop. */}
          {toc.length > 1 && (
            <div className="xl:hidden mt-8 rounded-[var(--r-3)] border border-line bg-paper p-4">
              <p className="type-mono-sm text-muted mb-2">On this page</p>
              <ul className="space-y-1.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="type-body-sm text-ink-2 no-underline hover:text-volt"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 space-y-14">
            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="type-heading-2 text-ink mb-5">
                  <DocsInline text={section.heading} />
                </h2>
                <DocBlocks blocks={section.blocks} />
              </section>
            ))}
          </div>

          <nav
            aria-label="Previous and next page"
            className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={prev.path}
                className="group rounded-[var(--r-3)] border border-line bg-canvas p-4 no-underline transition-colors hover:border-volt/40"
              >
                <span className="type-mono-sm text-muted flex items-center gap-1.5">
                  <ArrowLeft size={12} aria-hidden="true" /> Previous
                </span>
                <span className="type-body mt-1 block font-semibold text-ink group-hover:text-volt">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.path}
                className="group rounded-[var(--r-3)] border border-line bg-canvas p-4 no-underline transition-colors hover:border-volt/40 sm:text-right"
              >
                <span className="type-mono-sm text-muted flex items-center gap-1.5 sm:justify-end">
                  Next <ArrowRight size={12} aria-hidden="true" />
                </span>
                <span className="type-body mt-1 block font-semibold text-ink group-hover:text-volt">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>

          <div className="mt-10 rounded-[var(--r-3)] border border-line bg-paper px-5 py-4">
            <p className="type-body-sm text-ink-2">
              Something here wrong or missing?{' '}
              <Link href="/contact" className="text-volt underline decoration-volt-line underline-offset-2">
                Tell us
              </Link>{' '}
              and name this page. We will fix it.
            </p>
          </div>
        </article>

        {toc.length > 1 && (
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <ScrollSpyToc label="On this page" items={toc} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

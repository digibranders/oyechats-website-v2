import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package, KeyRound, Brain, Webhook } from 'lucide-react';
import { ID, SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { Button, Callout, GradientText } from '@/components/ds';
import { DOCS_LAST_UPDATED, DOCS_PUBLISHED, DOC_ENTRY_PATH, DOC_GROUPS, DOC_PAGES } from '@/lib/docs';

export const metadata: Metadata = pageMeta({
  title: 'Documentation: Install, Train, Integrate',
  description:
    'Complete OyeChats documentation. Install the chat widget, train it on your content, qualify leads, run live chat, and integrate with webhooks and the REST API.',
  path: '/docs',
});

const graph = buildGraph({
  path: '/docs',
  name: 'OyeChats Documentation',
  description:
    'Complete OyeChats documentation. Install the chat widget, train it on your content, qualify leads, run live chat, and integrate with webhooks and the REST API.',
  dateModified: DOCS_LAST_UPDATED,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Documentation' }],
  nodes: [
    {
      '@type': 'TechArticle',
      '@id': ID.article('/docs'),
      headline: 'OyeChats Documentation',
      description:
        'Complete OyeChats documentation. Install the chat widget, train it on your content, qualify leads, run live chat, and integrate with webhooks and the REST API.',
      mainEntityOfPage: { '@id': ID.webPage('/docs') },
      datePublished: DOCS_PUBLISHED,
      dateModified: DOCS_LAST_UPDATED,
      inLanguage: 'en',
      author: { '@id': ID.organization },
      publisher: { '@id': ID.organization },
      image: `${SITE_URL}/opengraph-image`,
      proficiencyLevel: 'Beginner',
      about: { '@id': ID.software },
    },
    // The whole corpus as one ItemList, so an answer engine can enumerate the
    // documentation set from the hub instead of discovering it link by link.
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/docs#pages`,
      name: 'OyeChats documentation pages',
      itemListOrder: 'ItemListOrderAscending',
      numberOfItems: DOC_PAGES.length,
      itemListElement: DOC_PAGES.map(({ page, path }, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: page.title,
        url: `${SITE_URL}${path}`,
      })),
    },
  ],
});

const QUICK_START = [
  {
    icon: Package,
    step: '1',
    title: 'Install the widget',
    desc: 'One script tag, before the closing body tag, on any platform.',
    href: '/docs/widget/install',
  },
  {
    icon: Brain,
    step: '2',
    title: 'Train it on your content',
    desc: 'Crawl your website or upload PDFs, DOCX, TXT and Markdown.',
    href: '/docs/chatbot/knowledge',
  },
  {
    icon: KeyRound,
    step: '3',
    title: 'Qualify the leads',
    desc: 'BANT, MEDDIC, CHAMP or GPCTBA scoring from the conversation itself.',
    href: '/docs/leads/qualification',
  },
  {
    icon: Webhook,
    step: '4',
    title: 'Push events out',
    desc: 'Signed webhooks into your CRM, or read everything over REST.',
    href: '/docs/integrations/webhooks',
  },
];

export default function DocsIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <header>
        <p className="type-mono-sm text-volt mb-3">Documentation</p>
        <h1 className="type-display-3 text-ink max-w-3xl">
          Everything you need to <GradientText>go live</GradientText>.
        </h1>
        <p className="type-body-lg text-ink-2 mt-4 max-w-[68ch]">
          {DOC_PAGES.length} pages covering setup, training, live chat, lead qualification,
          integrations and the REST API. Start at the beginning, or jump to what you need.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button href={DOC_ENTRY_PATH} variant="volt">
            Start reading →
          </Button>
          <Button href="/docs/getting-started/quickstart" variant="ghost">
            Skip to the quickstart
          </Button>
        </div>
      </header>

      <section aria-labelledby="quick-start" className="mt-14">
        <h2 id="quick-start" className="type-heading-2 text-ink mb-5">
          The four things you will do
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_START.map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="group block rounded-[var(--r-3)] border border-line bg-canvas p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-volt/40"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[var(--r-2)] border border-volt-line bg-volt-tint text-volt">
                  <item.icon size={16} aria-hidden="true" />
                </span>
                <span className="type-mono-sm text-muted">Step {item.step}</span>
              </div>
              <p className="type-heading-3 text-ink mb-1 group-hover:text-volt transition-colors">
                {item.title}
              </p>
              <p className="type-body-sm text-ink-2">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="all-docs" className="mt-16">
        <h2 id="all-docs" className="type-heading-2 text-ink mb-2">
          All documentation
        </h2>
        <p className="type-body-sm text-ink-2 mb-8 max-w-[68ch]">
          Ten sections, in reading order. Every page links to the next.
        </p>

        <div className="space-y-10">
          {DOC_GROUPS.map((group) => (
            <div key={group.slug}>
              <h3 className="type-heading-3 text-ink">{group.label}</h3>
              <p className="type-body-sm text-ink-2 mt-1 max-w-[68ch]">{group.description}</p>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-px sm:grid-cols-2">
                {group.pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/docs/${group.slug}/${page.slug}`}
                      className="group flex items-baseline gap-2 rounded-[var(--r-2)] px-2 py-2 no-underline transition-colors hover:bg-paper"
                    >
                      <ArrowRight
                        size={13}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-muted group-hover:text-volt"
                      />
                      <span className="min-w-0">
                        <span className="type-body block font-medium text-ink group-hover:text-volt transition-colors">
                          {page.navLabel}
                        </span>
                        <span className="type-body-sm block text-muted">{page.summary}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-8">
        <Callout variant="info" title="Building against the API">
          The full customer-facing OpenAPI specification is published at{' '}
          <a
            href="/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-volt underline decoration-volt-line underline-offset-2"
          >
            /openapi.json
          </a>{' '}
         . Import it into Postman, Insomnia or a client generator. Start with{' '}
          <Link href="/docs/api/overview" className="text-volt underline decoration-volt-line underline-offset-2">
            API authentication
          </Link>
          .
        </Callout>
      </section>

      <section className="mt-10">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[var(--r-4)] border border-line bg-paper px-6 py-6 md:flex-row md:items-center">
          <div>
            <p className="type-heading-3 text-ink">Stuck on something?</p>
            <p className="type-body-sm text-ink-2 mt-1">
              Check <Link href="/docs/support/troubleshooting" className="text-volt underline decoration-volt-line underline-offset-2">troubleshooting</Link> first, then talk to us.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/contact" variant="volt">
              Contact support →
            </Button>
            <Button href="/changelog" variant="ghost">
              What&apos;s new
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

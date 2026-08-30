import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Scale } from 'lucide-react';
import { ID, abs, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import {
  Accordion,
  Button,
  Callout,
  Card,
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
} from '@/components/ds';
import { CompareTable } from '@/components/site/CompareTable';
import { COMPETITORS, getCompetitor } from '@/lib/compare';
import { ZOHO_SLUG } from '../oyechats-vs-zoho-salesiq/content';
import { APP_LINKS } from '@/lib/site';

type Params = { slug: string };

/**
 * Zoho SalesIQ is excluded: it has a dedicated route at
 * `/compare/oyechats-vs-zoho-salesiq` that shadows this segment. Generating the
 * path here too would have two routes resolve to one URL, which Next treats as
 * a build error rather than a precedence rule. The competitor entry itself stays
 * in `@/lib/compare` — the hub, the cross-links and the dedicated page's own
 * feature matrix all read from it.
 */
export function generateStaticParams(): Params[] {
  return COMPETITORS.filter((c) => c.slug !== ZOHO_SLUG).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};
  return pageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
    path: `/compare/${c.slug}`,
  });
}

export default async function ComparisonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) notFound();

  const path = `/compare/${c.slug}`;
  const others = COMPETITORS.filter((x) => x.slug !== c.slug).slice(0, 3);

  const graph = buildGraph({
    path,
    name: `OyeChats vs ${c.name}`,
    description: c.metaDescription,
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Compare', path: '/compare' },
      { name: `vs ${c.name}` },
    ],
    nodes: [
      {
        '@type': 'FAQPage',
        '@id': `${abs(path)}#faq`,
        isPartOf: { '@id': ID.webPage(path) },
        mainEntity: c.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(graph) }}
      />

      {/* Hero */}
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-14 md:pt-20 md:pb-16">
          <nav aria-label="Breadcrumb" className="type-mono-sm text-muted mb-6">
            <Link href="/compare" className="hover:text-ink transition-colors">
              Compare
            </Link>
            <span className="mx-2 text-muted-2">/</span>
            <span className="text-ink-2">vs {c.name}</span>
          </nav>

          <div className="max-w-3xl">
            <Chip variant="soft" pill className="mb-5">
              {c.intent}
            </Chip>
            <h1 className="type-display-2 text-ink">
              OyeChats <span className="text-muted">vs</span>{' '}
              <GradientText>{c.name}</GradientText>
            </h1>
            <p className="type-body-lg text-ink-2 mt-6">{c.summary}</p>
            <div className="mt-9 flex gap-3 flex-wrap">
              <Button href={APP_LINKS.register} external variant="volt" size="lg">
                Start free →
              </Button>
              <Button href="/pricing" variant="ghost" size="lg">
                See pricing
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* At a glance: two positioning cards */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card padding="lg" className="h-full border-volt/30">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[var(--r-2)] bg-volt-tint border border-volt-line font-display font-semibold text-volt-ink">
                    O
                  </span>
                  <div className="type-heading-3 text-ink">Where OyeChats wins</div>
                </div>
                <ul className="mt-5 space-y-3">
                  {c.oyeEdge.map((point, i) => (
                    <li key={i} className="flex gap-2.5 type-body text-ink-2">
                      <Check size={17} className="mt-0.5 shrink-0 text-volt" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>

            <Reveal>
              <Card padding="lg" className="h-full">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-[var(--r-2)] bg-paper border border-line font-display font-semibold text-ink"
                  >
                    {c.monogram}
                  </span>
                  <div className="type-heading-3 text-ink">Where {c.name} is strong</div>
                </div>
                <ul className="mt-5 space-y-3">
                  {c.theirStrengths.map((point, i) => (
                    <li key={i} className="flex gap-2.5 type-body text-ink-2">
                      <Check size={17} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Feature-by-feature matrix */}
      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-volt" />
              <span>Feature by feature</span>
            </div>
            <h2 className="type-display-3 text-ink mb-3">
              OyeChats vs {c.name}, in detail
            </h2>
            <p className="type-body text-ink-2">
              Every axis that matters when choosing between an AI-first chatbot and {c.name}. The
              check marks the tool with the edge on each row.
            </p>
          </Reveal>
          <Reveal>
            <CompareTable competitor={c} />
          </Reveal>
          <div className="mt-5">
            <Callout variant="info" title="On pricing">
              {c.name} pricing model: {c.pricingModel} OyeChats uses flat monthly tiers. Always
              check each vendor&rsquo;s current pricing page before deciding, plans change.
            </Callout>
          </div>
        </Container>
      </section>

      {/* Honest: when to choose them */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--r-3)] bg-paper border border-line text-ink">
                <Scale size={18} />
              </span>
              <h2 className="type-display-3 text-ink">When {c.name} is the better choice</h2>
            </div>
            <p className="type-body-lg text-ink-2">{c.whenToChooseThem}</p>
            <p className="type-body text-ink-2 mt-4">
              If instead you want RAG answers grounded in your content and BANT lead scoring that
              hands sales a qualified, ranked lead, with live handoff, analytics and webhooks
              included, that is where OyeChats is built to win.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <h2 className="type-display-3 text-ink">
              OyeChats vs {c.name}: <GradientText>FAQ</GradientText>
            </h2>
          </Reveal>
          <div className="max-w-3xl">
            <Accordion items={c.faqs} />
          </div>
        </Container>
      </section>

      {/* Other comparisons */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="mb-8">
            <h2 className="type-heading-2 text-ink">Compare with other tools</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Reveal key={o.slug}>
                <Link href={`/compare/${o.slug}`} className="group block h-full">
                  <Card padding="md" className="h-full">
                    <div className="type-heading-3 text-ink leading-tight">
                      OyeChats vs {o.name}
                    </div>
                    <div className="type-mono-sm text-muted mt-1">{o.category}</div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-volt-ink">
                      Read
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-paper py-24 border-t border-line">
        <Container>
          <Reveal className="max-w-3xl mx-auto text-center">
            <h2 className="type-display-3 text-ink mb-5">
              Try OyeChats against your own <GradientText>use case</GradientText>
            </h2>
            <p className="type-body-lg text-ink-2 mb-8 max-w-xl mx-auto">
              Add your content, paste one script tag, and see the answers and BANT scores for
              yourself. Every plan starts free.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button href={APP_LINKS.register} external variant="volt" size="lg">
                Start free
              </Button>
              <Button href="/compare" variant="ghost" size="lg">
                All comparisons
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

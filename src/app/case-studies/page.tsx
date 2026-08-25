import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Button, Container, DottedGrid, GradientText, HeroGlow, Section } from '@/components/ds';
import { CaseStudyLibrary } from '@/components/site/CaseStudyLibrary';
import { FinalCTA } from '@/components/site/FinalCTA';
import { getCaseStudies } from '@/lib/case-studies';
import { ID, SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { APP_LINKS } from '@/lib/site';

const TITLE = 'AI chatbot case studies with real numbers';
const DESCRIPTION =
  'Reported results from OyeChats deployments: conversations handled, companies identified, emails validated, potential B2B leads identified and quotations shared.';

export const metadata: Metadata = pageMeta({
  title: TITLE,
  description: DESCRIPTION,
  path: '/case-studies',
});

export default function CaseStudiesPage() {
  const studies = getCaseStudies();
  const featured = studies[0];

  const graph = buildGraph({
    path: '/case-studies',
    name: TITLE,
    description: DESCRIPTION,
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Case studies' },
    ],
    nodes: [
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/case-studies#list`,
        name: TITLE,
        numberOfItems: studies.length,
        itemListElement: studies.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/case-studies/${s.slug}`,
          name: s.title,
        })),
        isPartOf: { '@id': ID.website },
      },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative bg-paper overflow-hidden border-b border-line">
        <HeroGlow />
        <DottedGrid />
        <Container className="relative pt-14 pb-14 md:pt-16 md:pb-16">
          <div className="type-mono-sm text-muted flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-volt" />
            <span>Case studies</span>
          </div>
          <h1 className="type-display-2 text-ink max-w-[15ch]">
            Proof, with the <GradientText>attrition</GradientText> left in
          </h1>
          <p className="type-body-lg text-ink-2 mt-7 max-w-[620px]">
            Every study here reports the whole funnel, including the stages where most people
            dropped out. You get the counts the client reported, the step between each pair of
            counts, and a note saying where the numbers came from.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={APP_LINKS.register} external variant="volt" size="md">
              Start free <ArrowRight size={16} />
            </Button>
            <Button href="/features" variant="ghost" size="md">
              See what it does
            </Button>
          </div>

          {/* The featured study's own outcomes. The count of published
              studies is site metadata, not evidence of customer value, so it
              sits in the line above rather than competing with them at the
              same weight. */}
          {featured && (
            <>
              <p className="type-mono-sm mt-14 text-muted">
                {studies.length === 1 ? '1 published study' : `${studies.length} published studies`}
                <span className="mx-2 text-line-2">&middot;</span>
                Latest: {featured.client.industry}
              </p>
              <dl className="mt-5 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-3">
                {featured.headline.map((m) => (
                  <div key={m.label}>
                    <dd className="font-display text-[clamp(1.875rem,3vw,2.375rem)] font-semibold leading-none tracking-[-0.035em] text-ink tabular-nums">
                      {m.value.toLocaleString()}
                      {m.suffix}
                    </dd>
                    <dt className="type-body-sm mt-3 text-muted">{m.label}</dt>
                  </div>
                ))}
              </dl>
            </>
          )}

        </Container>
      </section>

      {/* ═══════════════════════ LIBRARY ═══════════════════════ */}
      <Section
        tone="paper"
        eyebrow="The library"
        heading="Read the whole story, not the highlight"
        sub="Each study opens with its results and shows the funnel that produced them."
      >
        <CaseStudyLibrary studies={studies} />
      </Section>

      {/* ═══════════════════════ WHAT GOES IN ONE ═══════════════════════ */}
      <Section
        tone="canvas"
        eyebrow="How we write these"
        heading="What every study on this page has to contain"
        sub="A case study is only useful if a reader can check it. These are the rules we hold ourselves to."
      >
        <div className="grid md:grid-cols-3 gap-px bg-line rounded-[var(--r-4)] overflow-hidden border border-line">
          {STANDARDS.map((s, i) => (
            <div key={s.title} className="bg-paper p-7">
              <span className="font-mono text-[11px] font-semibold text-volt tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="type-heading-3 text-ink mt-3 mb-2">{s.title}</h3>
              <p className="type-body-sm text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}

const STANDARDS: { title: string; body: string }[] = [
  {
    title: 'Counts, not percentages alone',
    body: 'A percentage with no denominator can be made to say anything. Every rate on this page is shown next to the two counts it was calculated from.',
  },
  {
    title: 'The drop-offs stay visible',
    body: 'The stages where most visitors left are part of the story. Hiding them would make the funnel look better and the study worth less.',
  },
  {
    title: 'Nothing added to the record',
    body: 'If the reported figures do not explain something, the study says so rather than filling the gap with a plausible sentence.',
  },
];

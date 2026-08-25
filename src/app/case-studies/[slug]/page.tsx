import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Reveal, Section } from '@/components/ds';
import { CaseSectionRenderer } from '@/components/site/CaseStudyBody';
import { CaseStudyCover } from '@/components/site/CaseStudyCover';
import { FinalCTA } from '@/components/site/FinalCTA';
import { CaseStudyHero } from '@/components/site/case-study/CaseStudyHero';
import { CaseStudyOutcomeStrip } from '@/components/site/case-study/CaseStudyOutcomeStrip';
import { CaseStudyToc, type CaseTocItem } from '@/components/site/case-study/CaseStudyToc';
import { CASE_STUDIES, getCaseStudy, getRelatedCaseStudies } from '@/lib/case-studies';
import { ID, SITE_URL, buildGraph, jsonLd } from '@/lib/seo';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const image = `/case-studies/${study.slug}/opengraph-image`;
  const social = `${study.metaTitle} · OyeChats`;
  return {
    title: study.metaTitle,
    description: study.description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: 'article',
      title: social,
      description: study.description,
      url: `/case-studies/${study.slug}`,
      siteName: 'OyeChats',
      publishedTime: study.dateISO,
      tags: study.tags,
      images: [{ url: image, width: 1200, height: 630, alt: social }],
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description: study.description,
      images: [image],
    },
  };
}

/**
 * Section navigation. Five destinations, fixed, because a nav that lists every
 * section is a nav nobody can use: the previous nine-item rail measured 1449px
 * and clipped at every viewport. Entries whose section is absent from a given
 * study are filtered out, so a differently composed study still gets a
 * coherent nav rather than dead anchors.
 */
const TOC_SOURCE: CaseTocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'results', label: 'Results' },
  { id: 'impact', label: 'Impact' },
];

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const related = getRelatedCaseStudies(study.slug, 2);
  const image = `${SITE_URL}/case-studies/${study.slug}/opengraph-image`;

  const sectionIds = new Set(study.sections.map((s) => s.id));
  const toc = TOC_SOURCE.filter((it) => it.id === 'overview' || sectionIds.has(it.id));

  const graph = buildGraph({
    path: `/case-studies/${study.slug}`,
    name: study.title,
    description: study.description,
    dateModified: study.updatedISO ?? study.dateISO,
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Case studies', path: '/case-studies' },
      { name: study.title },
    ],
    nodes: [
      {
        '@type': 'Article',
        '@id': ID.article(`/case-studies/${study.slug}`),
        headline: study.title,
        description: study.description,
        datePublished: study.dateISO,
        dateModified: study.updatedISO ?? study.dateISO,
        image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
        keywords: study.tags.join(', '),
        articleSection: study.category,
        inLanguage: 'en',
        isPartOf: { '@id': ID.website },
        author: { '@id': ID.organization },
        publisher: { '@id': ID.organization },
        mainEntityOfPage: { '@id': ID.webPage(`/case-studies/${study.slug}`) },
        about: { '@id': ID.software },
      },
    ],
  });

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <CaseStudyHero study={study} />
      <CaseStudyOutcomeStrip study={study} />
      <CaseStudyToc items={toc} />

      {study.sections.map((section) => (
        <CaseSectionRenderer key={section.id} section={section} study={study} />
      ))}

      {related.length > 0 && (
        <Section tone="canvas" eyebrow="Keep reading" heading="More case studies">
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 80}>
                <Link
                  href={`/case-studies/${r.slug}`}
                  className="group block overflow-hidden rounded-[var(--r-4)] border border-line bg-paper no-underline transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-volt/40"
                >
                  <CaseStudyCover study={r} variant="banner" className="rounded-none border-0" />
                  <div className="p-6">
                    <h3 className="type-heading-3 text-ink transition-colors group-hover:text-volt-ink">
                      {r.title}
                    </h3>
                    <p className="type-body-sm mt-2 text-ink-2">{r.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* The shared component, not a copy of it. The previous inline clone had
          already drifted: different eyebrow markup, a different secondary CTA
          and no constellation. */}
      <FinalCTA
        eyebrow="Your turn"
        heading="Turn more website conversations into qualified opportunities."
        body="Point OyeChats at your site and it starts answering, identifying and qualifying the visitors who are already reading your pages."
      />
    </article>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Button,
  Chip,
  Container,
  DottedGrid,
  MonoMark,
  PullQuote,
  Section,
} from '@/components/ds';
import { CUSTOMERS } from '@/lib/customers';
import { APP_LINKS } from '@/lib/site';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return CUSTOMERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = CUSTOMERS.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.company} case study`,
    description: c.summary,
    alternates: { canonical: `/customers/${c.slug}` },
  };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const c = CUSTOMERS.find((x) => x.slug === slug);
  if (!c) notFound();

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <DottedGrid />
        <Container className="relative pt-16 pb-16 md:pt-24 md:pb-24">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 type-mono-sm text-muted hover:text-ink no-underline mb-8"
          >
            <ArrowLeft size={13} /> All customers
          </Link>
          <div className="flex gap-2 mb-6">
            <MonoMark>{c.industry}</MonoMark>
            <Chip variant="signal">Live</Chip>
          </div>
          <h1 className="type-display-2 text-ink max-w-3xl">{c.company}</h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl">{c.summary}</p>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {c.metrics.map((m) => (
            <div key={m.label} className="border-l-[3px] border-volt pl-5">
              <div className="font-display font-semibold text-[clamp(2.5rem,3vw+1rem,4rem)] text-ink tabular-nums tracking-[-0.03em] leading-none">
                {m.value}
              </div>
              <div className="type-mono-sm text-muted mt-3 max-w-[220px] leading-tight">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <PullQuote quote={c.quote} cite={c.quoteBy} />

        <div className="prose mt-16">
          <h2>Background</h2>
          <p>
            Before OyeChats, {c.company} used a static contact form and a homepage chatbot that
            answered FAQs but couldn&apos;t score intent. Reps received every submission and burned
            time on unqualified conversations.
          </p>
          <h2>What changed</h2>
          <p>
            They installed OyeChats in an afternoon. The RAG index built from their docs answered
            most product questions on the visitor&apos;s first turn. BANT scoring quietly ran across
            every conversation, and only leads scoring above 65 escalated to a rep in Slack.
          </p>
          <h2>Results</h2>
          <p>
            Rep meetings dropped in volume, rose in quality. Sales cycle time shortened because the
            visitor arrived at the meeting already qualified, and rep conversations opened with
            context, not intro questions.
          </p>
        </div>
      </Section>

      <Section tone="ink-invert">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="type-display-3 text-ink-invert-fg mb-4">
            Want the same result?
          </h2>
          <p className="type-body-lg text-ink-invert-muted mb-8">
            Deploy in 10 minutes. First qualified lead in the same hour.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button href={APP_LINKS.register} external variant="volt" size="lg">
              Start free →
            </Button>
            <Button href="/contact" variant="outline-invert" size="lg">
              Talk to sales
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

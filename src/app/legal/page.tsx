import type { Metadata } from 'next';
import Link from 'next/link';
import { Chip, Container, DottedGrid } from '@/components/ds';
import { LEGAL_PAGES } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Privacy, terms, DPA, sub-processors, and other OyeChats legal documents.',
  alternates: { canonical: '/legal' },
};

export default function LegalIndex() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden border-b border-line">
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-20">
          <h1 className="type-display-2 text-ink max-w-3xl">Legal.</h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl">
            Everything you can send to your legal team. Plain language. No hidden clauses.
          </p>
        </Container>
      </section>

      <div className="bg-canvas py-16 md:py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-4">
            {LEGAL_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/legal/${p.slug}`}
                className="block bg-canvas border border-line rounded-[var(--r-3)] p-6 hover:border-line-2 hover:shadow-[var(--e-2)] hover:-translate-y-0.5 transition-all no-underline"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h2 className="type-heading-2 text-ink">{p.title}</h2>
                  <Chip variant="outline">{p.lastUpdated}</Chip>
                </div>
                <p className="type-body-sm text-ink-2">{p.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

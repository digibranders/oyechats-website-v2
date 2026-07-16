import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
  Section,
} from '@/components/ds';
import { BLOG_POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Ideas from the OyeChats team on RAG, BANT scoring, and building AI-native sales.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Ideas from the <GradientText>team</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Essays on RAG, BANT scoring, AI-native sales, and the engineering behind OyeChats.
          </p>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="block bg-canvas border border-line rounded-[var(--r-4)] p-8 mb-8 hover:border-line-2 hover:shadow-[var(--e-2)] transition-all no-underline"
          >
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 items-center">
              <div className="aspect-[16/10] bg-volt-tint rounded-[var(--r-3)] border border-volt-line flex items-center justify-center">
                <span className="font-mono text-volt text-[13px]">featured post</span>
              </div>
              <div>
                <div className="flex gap-2 mb-4">
                  <Chip variant="mono">{featured.category}</Chip>
                  <Chip variant="outline">{featured.readMinutes} min read</Chip>
                </div>
                <h2 className="type-heading-1 text-ink mb-3">{featured.title}</h2>
                <p className="type-body text-ink-2">{featured.description}</p>
                <div className="type-mono-sm text-muted mt-6">
                  {featured.date} · {featured.author.name}
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
            <Link
              href={`/blog/${p.slug}`}
              className="block bg-canvas border border-line rounded-[var(--r-3)] p-6 hover:border-volt/40 hover:shadow-[0_20px_40px_-16px_rgba(162,28,175,0.14)] hover:-translate-y-1 transition-all duration-300 no-underline h-full"
            >
              <div className="aspect-[16/10] bg-paper rounded-[var(--r-2)] border border-line mb-5 flex items-center justify-center">
                <span className="font-mono text-muted text-[12px]">post preview</span>
              </div>
              <div className="flex gap-2 mb-3">
                <Chip variant="mono">{p.category}</Chip>
              </div>
              <h3 className="type-heading-3 text-ink mb-2">{p.title}</h3>
              <p className="type-body-sm text-ink-2 mb-4">{p.description}</p>
              <div className="type-mono-sm text-muted">
                {p.date} · {p.readMinutes} min
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

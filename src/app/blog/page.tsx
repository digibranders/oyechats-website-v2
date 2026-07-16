import type { Metadata } from 'next';
import { Container, DottedGrid, GradientText, HeroGlow, Section } from '@/components/ds';
import { BlogList, type BlogCardData } from '@/components/site/BlogList';
import { BLOG_POSTS } from '@/lib/blog';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Blog',
  description:
    'Practical guides on AI customer support, conversational lead qualification, and shipping chatbots that actually convert — from the OyeChats team.',
  path: '/blog',
});

export default function BlogPage() {
  // Slim projection: the client list never needs the full post `content`.
  const posts: BlogCardData[] = BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    readMinutes: p.readMinutes,
    accent: p.accent,
    author: { name: p.author.name, initials: p.author.initials },
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-paper">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-14 text-center md:pt-28 md:pb-16">
          <span className="type-mono-sm text-volt">The OyeChats blog</span>
          <h1 className="type-display-2 mx-auto mt-4 max-w-3xl text-ink">
            Ship a chatbot that <GradientText>converts</GradientText>.
          </h1>
          <p className="type-body-lg mx-auto mt-6 max-w-2xl text-ink-2">
            Field notes on AI customer support, conversational lead qualification, and the
            engineering behind grounded, on-brand answers.
          </p>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        <BlogList posts={posts} />
      </Section>
    </>
  );
}

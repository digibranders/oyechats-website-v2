import type { Metadata } from 'next';
import { Container, DottedGrid, GradientText, HeroGlow, Section } from '@/components/ds';
import { BlogList, type BlogCardData } from '@/components/site/BlogList';
import { BLOG_POSTS } from '@/lib/blog';
import { SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Blog — AI Chat, Lead Qualification & RAG',
  description:
    'Practical guides on AI customer support, conversational lead qualification, and shipping chatbots that actually convert — from the OyeChats team.',
  path: '/blog',
});

// CollectionPage previously enumerated nothing — eight posts rendered on the
// page and not one was declared. For an AI crawler that is the difference
// between "OyeChats has a blog" and knowing what it has published.
const graph = buildGraph({
  path: '/blog',
  name: 'OyeChats Blog',
  description:
    'Practical guides on AI customer support, conversational lead qualification, and shipping chatbots that actually convert.',
  type: 'CollectionPage',
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Blog' }],
  nodes: [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/blog#list`,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: BLOG_POSTS.length,
      itemListElement: BLOG_POSTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
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

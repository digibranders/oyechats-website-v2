import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Accordion, Button, Chip, Container, MonoMark, PullQuote } from '@/components/ds';
import { BlogCover } from '@/components/site/BlogCover';
import { ReadingProgress } from '@/components/site/ReadingProgress';
import { ScrollSpyToc } from '@/components/site/ScrollSpyToc';
import {
  BLOG_POSTS,
  computeHeadingIds,
  getRelatedPosts,
  getToc,
} from '@/lib/blog';
import { renderRichText } from '@/lib/richtext';
import { APP_LINKS } from '@/lib/site';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = BLOG_POSTS.find((x) => x.slug === slug);
  if (!p) return {};
  const imageUrl = `/blog/${p.slug}/opengraph-image`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      type: 'article',
      title: p.title,
      description: p.description,
      url: `/blog/${p.slug}`,
      publishedTime: p.dateISO,
      authors: [p.author.name],
      tags: p.tags,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const SITE_URL = 'https://www.oyechats.com';
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  // Use the generated per-post OG image (1200×630, always exists) for structured
  // data. The post.image webp paths are placeholders that aren't rendered/shipped.
  const imageUrl = `${SITE_URL}/blog/${post.slug}/opengraph-image`;

  const headingIds = computeHeadingIds(post.content);
  const toc = getToc(post.content);
  const related = getRelatedPosts(post.slug, 3);

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    image: imageUrl,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content
      .flatMap((b) =>
        b.type === 'ul' || b.type === 'ol' ? (b.items ?? []) : 'text' in b ? [b.text] : [],
      )
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length,
    author: { '@type': 'Organization', name: 'OyeChats' },
    publisher: {
      '@type': 'Organization',
      name: 'OyeChats',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: canonical,
  } as const;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  } as const;

  const faqSchema =
    post.faq && post.faq.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <article className="bg-canvas">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ═══════════ HEADER ═══════════ */}
      <header className="border-b border-line bg-paper pt-14 pb-10 md:pt-16 md:pb-12">
        <Container>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 type-mono-sm text-muted no-underline transition-colors hover:text-ink"
          >
            <ArrowLeft size={13} /> All posts
          </Link>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <MonoMark>{post.category}</MonoMark>
            <Chip variant="outline">{post.readMinutes} min read</Chip>
          </div>
          <h1 className="type-display-3 max-w-3xl text-ink">{post.title}</h1>
          <p className="type-body-lg mt-6 max-w-2xl text-ink-2">{post.description}</p>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-volt-line bg-volt-tint font-mono text-[12px] font-semibold text-volt-ink">
              {post.author.initials}
            </span>
            <div>
              <div className="type-body-sm font-medium text-ink">{post.author.name}</div>
              <div className="type-mono-sm text-muted">
                {post.author.role} · {post.date}
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ═══════════ BODY: TOC + ARTICLE ═══════════ */}
      <Container className="py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          {/* Table of contents */}
          {toc.length > 1 && (
            <aside className="mb-10 lg:mb-0">
              {/* Mobile: horizontal pills */}
              <div className="lg:hidden">
                <div className="mb-3 type-mono-sm text-muted">On this page</div>
                <ScrollSpyToc items={toc} variant="pills" />
              </div>
              {/* Desktop: sticky vertical rail. The sticky element must be a
                  direct child of the full-height <aside> grid cell — nesting it
                  inside a shorter wrapper kills its scroll travel. */}
              <div className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                <ScrollSpyToc items={toc} variant="toc" label="On this page" />
              </div>
            </aside>
          )}

          {/* Article */}
          <div className="min-w-0">
          <div className="prose">
            {post.content.map((block, i) => {
              if (block.type === 'p') return <p key={i}>{renderRichText(block.text)}</p>;
              if (block.type === 'h2')
                return (
                  <h2 key={i} id={headingIds[i]} className="scroll-mt-24">
                    {block.text}
                  </h2>
                );
              if (block.type === 'h3')
                return (
                  <h3 key={i} id={headingIds[i]} className="scroll-mt-24">
                    {block.text}
                  </h3>
                );
              if (block.type === 'ul')
                return (
                  <ul key={i}>
                    {block.items?.map((item, j) => (
                      <li key={j}>{renderRichText(item)}</li>
                    ))}
                  </ul>
                );
              if (block.type === 'ol')
                return (
                  <ol key={i}>
                    {block.items?.map((item, j) => (
                      <li key={j}>{renderRichText(item)}</li>
                    ))}
                  </ol>
                );
              if (block.type === 'code')
                return (
                  <pre
                    key={i}
                    className="not-prose my-6 overflow-x-auto rounded-[var(--r-4)] bg-ink-invert p-5 font-mono text-[13px] leading-[1.7] text-ink-invert-fg"
                  >
                    <code>{block.text}</code>
                  </pre>
                );
              if (block.type === 'quote')
                return (
                  <div key={i} className="not-prose my-10">
                    <PullQuote quote={block.text ?? ''} cite={block.cite} />
                  </div>
                );
              return null;
            })}
          </div>

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <section className="mt-16">
                <div className="type-mono-sm text-volt mb-3">FAQ</div>
                <h2 className="type-heading-1 text-ink">Frequently asked questions</h2>
                <div className="mt-6 rounded-[var(--r-4)] border border-line bg-paper px-6 md:px-7">
                  <Accordion items={post.faq} className="border-y-0" />
                </div>
              </section>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Chip key={t} variant="outline">
                    {t}
                  </Chip>
                ))}
              </div>
            )}

            {/* End CTA */}
            <div className="mt-12 rounded-[var(--r-5)] border border-volt-line bg-volt-tint p-8">
              <h2 className="type-heading-2 text-ink">See it on your own site</h2>
              <p className="type-body mt-3 max-w-xl text-ink-2">
                OyeChats answers every visitor from your own docs, scores their intent as they
                chat, and routes the buyers to your team. Free to start — live in under 10 minutes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={APP_LINKS.register} external variant="volt" size="md">
                  Start free <ArrowUpRight size={16} />
                </Button>
                <Button href="/pricing" variant="primary" size="md">
                  See pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ═══════════ RELATED POSTS ═══════════ */}
      {related.length > 0 && (
        <section className="border-t border-line bg-paper py-14 md:py-16">
          <Container>
            <h2 className="type-heading-1 text-ink">Keep reading</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col rounded-[var(--r-4)] border border-line bg-canvas p-4 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-volt/40 hover:shadow-[var(--e-3)]"
                >
                  <BlogCover
                    slug={p.slug}
                    accent={p.accent}
                    category={p.category}
                    variant="card"
                  />
                  <h3 className="type-heading-3 mt-5 text-ink transition-colors group-hover:text-volt">
                    {p.title}
                  </h3>
                  <p className="type-body-sm mt-2 line-clamp-2 text-ink-2">{p.description}</p>
                  <div className="mt-auto pt-4 type-mono-sm text-muted">
                    {p.date} · {p.readMinutes} min
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

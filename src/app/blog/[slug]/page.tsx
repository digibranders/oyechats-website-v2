import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Chip, Container, MonoMark, PullQuote } from '@/components/ds';
import { BLOG_POSTS } from '@/lib/blog';

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
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const SITE_URL = 'https://www.oyechats.com';
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = /^https?:\/\//.test(post.image) ? post.image : `${SITE_URL}${post.image}`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    image: imageUrl,
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

  return (
    <article className="bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="bg-paper border-b border-line pt-16 pb-16 md:pt-24 md:pb-20">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 type-mono-sm text-muted hover:text-ink no-underline mb-8"
          >
            <ArrowLeft size={13} /> All posts
          </Link>
          <div className="flex gap-2 mb-6">
            <MonoMark>{post.category}</MonoMark>
            <Chip variant="outline">{post.readMinutes} min read</Chip>
          </div>
          <h1 className="type-display-2 text-ink max-w-3xl">{post.title}</h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl">{post.description}</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-volt-tint border border-volt-line flex items-center justify-center font-mono font-semibold text-[12px] text-volt-ink">
              {post.author.initials}
            </div>
            <div>
              <div className="type-body-sm text-ink font-medium">{post.author.name}</div>
              <div className="type-mono-sm text-muted">
                {post.author.role} · {post.date}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <div className="py-16 md:py-24">
        <Container>
          <div className="prose">
            {post.content.map((block, i) => {
              if (block.type === 'p') return <p key={i}>{block.text}</p>;
              if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
              if (block.type === 'h3') return <h3 key={i}>{block.text}</h3>;
              if (block.type === 'ul')
                return (
                  <ul key={i}>
                    {block.items?.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              if (block.type === 'ol')
                return (
                  <ol key={i}>
                    {block.items?.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ol>
                );
              if (block.type === 'code')
                return (
                  <pre
                    key={i}
                    className="not-prose bg-ink-invert text-ink-invert-fg rounded-[var(--r-4)] p-5 overflow-x-auto font-mono text-[13px] leading-[1.7] my-6"
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
        </Container>
      </div>
    </article>
  );
}

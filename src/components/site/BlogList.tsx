'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { BlogAccent } from '@/lib/blog';
import { BlogCover } from './BlogCover';

export type BlogCardData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readMinutes: number;
  accent: BlogAccent;
  author: { name: string; initials: string };
};

const ALL = 'All';

function AuthorMeta({ post }: { post: BlogCardData }) {
  return (
    <div className="mt-5 flex items-center gap-2.5 border-t border-line pt-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-volt-line bg-volt-tint font-mono text-[11px] font-semibold text-volt-ink">
        {post.author.initials}
      </span>
      <span className="type-mono-sm text-muted">
        {post.date} · {post.readMinutes} min
      </span>
    </div>
  );
}

function PostCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-[var(--r-4)] border border-line bg-canvas p-4 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-volt/40 hover:shadow-[var(--e-3)]"
    >
      <BlogCover slug={post.slug} accent={post.accent} category={post.category} variant="card" />
      <h3 className="type-heading-3 mt-5 text-ink transition-colors group-hover:text-volt">
        {post.title}
      </h3>
      <p className="type-body-sm mt-2 line-clamp-3 text-ink-2">{post.description}</p>
      <div className="mt-auto">
        <AuthorMeta post={post} />
      </div>
    </Link>
  );
}

export function BlogList({ posts }: { posts: BlogCardData[] }) {
  const categories = useMemo(() => {
    return [ALL, ...Array.from(new Set(posts.map((p) => p.category)))];
  }, [posts]);

  const [active, setActive] = useState<string>(ALL);

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((p) => p.category === active)),
    [active, posts],
  );

  const showFeatured = active === ALL && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const grid = showFeatured ? filtered.slice(1) : filtered;

  return (
    <div>
      {/* Category filter */}
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter posts by category">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={cn(
                'rounded-[var(--r-full)] border px-3.5 py-1.5 type-mono-sm transition-colors',
                isActive
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-canvas text-muted hover:border-line-2 hover:text-ink',
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Featured post */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-10 block rounded-[var(--r-5)] border border-line bg-canvas p-4 no-underline transition-all duration-300 hover:border-volt/40 hover:shadow-[var(--e-3)] md:p-5"
        >
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
            <BlogCover
              slug={featured.slug}
              accent={featured.accent}
              category={featured.category}
              variant="featured"
            />
            <div className="md:pr-6">
              <span className="type-mono-sm text-volt">Featured</span>
              <h2 className="type-heading-1 mt-3 text-ink transition-colors group-hover:text-volt">
                {featured.title}
              </h2>
              <p className="type-body mt-4 text-ink-2">{featured.description}</p>
              <div className="mt-6 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-volt-line bg-volt-tint font-mono text-[12px] font-semibold text-volt-ink">
                  {featured.author.initials}
                </span>
                <div className="type-mono-sm text-muted">
                  {featured.author.name} · {featured.date} · {featured.readMinutes} min
                </div>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 type-body-sm font-medium text-volt">
                Read post <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      {grid.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {grid.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        !featured && (
          <p className="type-body text-muted">No posts in this category yet.</p>
        )
      )}
    </div>
  );
}

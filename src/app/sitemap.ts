import type { MetadataRoute } from 'next';
import { LEGAL_PAGES } from '@/lib/legal';
import { BLOG_POSTS } from '@/lib/blog';

const BASE = 'https://oyechats.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    '',
    '/about',
    '/features',
    '/solutions',
    '/integrations',
    '/pricing',
    '/docs',
    '/blog',
    '/changelog',
    '/contact',
    '/security',
    '/legal',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const legal = LEGAL_PAGES.map((p) => ({
    url: `${BASE}/legal/${p.slug}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }));

  const blog = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...legal, ...blog];
}

import type { Metadata } from 'next';

/**
 * Builds consistent per-page metadata: document title (the root layout applies
 * the `%s · OyeChats` template), canonical URL, and matching OpenGraph + Twitter
 * tags. Without page-level `openGraph`/`twitter`, Next inherits the root values,
 * so every page would otherwise share the homepage's social title and og:url.
 * og:image is inherited from the root `opengraph-image`. Relative URLs resolve
 * against `metadataBase` (set in the root layout).
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const social = `${title} · OyeChats`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title: social,
      description,
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description,
    },
  };
}

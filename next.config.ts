import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack doesn't mis-infer it from the parent
  // directory (this repo sits alongside sibling projects under OyeChats/).
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // No remotePatterns: every image on the site is local. The previous
    // images.unsplash.com entry was dead (`grep -rn unsplash src/` finds nothing)
    // and an unused remote pattern is a needless open door for the optimizer.
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Files in public/ carry no content hash, so Vercel serves them
      // `max-age=0, must-revalidate` - /openapi.json is 486 KB and revalidates
      // on every visit. Deliberately scoped: a blanket rule over /(.*) would
      // override Vercel's `immutable` policy on /_next/static, which is correct
      // as-is and must not be touched.
      {
        source: '/openapi.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;

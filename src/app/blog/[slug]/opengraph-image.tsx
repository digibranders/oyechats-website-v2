import { ImageResponse } from 'next/og';
import { BLOG_POSTS } from '@/lib/blog';

export const alt = 'OyeChats blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

const PAPER = '#FAFAF7';
const INK = '#1A1A1A';
const SUBTLE = '#4A4A4A';
const MAGENTA = '#7C3AED';

export default async function BlogOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  const category = post?.category ?? 'OyeChats';
  const title = post?.title ?? 'You only talk to buyers.';
  const readMinutes = post?.readMinutes;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: PAPER,
          padding: '90px',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* Eyebrow: brand + category */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 30,
            fontWeight: 600,
            color: INK,
            letterSpacing: '-0.02em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: MAGENTA }}>Oye</span>
            <span>Chats</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              fontWeight: 600,
              color: MAGENTA,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {category}
          </div>
        </div>

        {/* Post title */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 62 : 76,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            maxWidth: 1020,
          }}
        >
          {title}
        </div>

        {/* Footer accent + read time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              height: 10,
              width: 180,
              borderRadius: 9999,
              backgroundColor: MAGENTA,
            }}
          />
          {readMinutes ? (
            <div style={{ display: 'flex', fontSize: 26, color: SUBTLE }}>
              {readMinutes} min read
            </div>
          ) : (
            <div style={{ display: 'flex' }} />
          )}
        </div>
      </div>
    ),
    size,
  );
}

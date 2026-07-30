import { buildLlmsTxt } from '@/lib/llms';

/** Generated from the same typed modules as the sitemap, so it cannot drift
 *  from the product the way the previous hand-written public/llms.txt did. */
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

import { buildLlmsFullTxt } from '@/lib/llms';

/** Full corpus: every article and policy as flat markdown. The highest-ROI GEO
 *  asset available here precisely because the content already exists in a clean
 *  structured form (BlogBlock[] and LEGAL_PAGES.sections). */
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

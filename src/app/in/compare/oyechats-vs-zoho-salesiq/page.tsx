import { ZohoComparisonRoute, zohoCompareMetadata } from '../../../compare/oyechats-vs-zoho-salesiq/shared';

/**
 * The Zoho SalesIQ comparison in INR, served at
 * `/compare/oyechats-vs-zoho-salesiq` via the proxy rewrite in `src/proxy.ts`.
 * Visitors never see this path.
 *
 * Same rules as `/in/pricing`: it carries the non-`/in` path as its canonical
 * (inherited from `zohoCompareMetadata`), it is deliberately absent from
 * `app/sitemap.ts` so it cannot compete in the index, and it is deliberately
 * NOT `noindex` — the rewrite serves this route's markup at the public URL, so
 * a `noindex` here would deindex the real page for any crawler requesting from
 * an Indian IP.
 */

export const metadata = zohoCompareMetadata;

export default function ZohoComparisonIndiaPage(): React.ReactElement {
  return <ZohoComparisonRoute currency="INR" />;
}

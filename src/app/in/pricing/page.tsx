import { PricingRoute, pricingMetadata } from '../../pricing/shared';

/**
 * Indian pricing (INR), served at `/pricing` via the middleware rewrite in
 * `src/middleware.ts`. Visitors never see this path.
 *
 * It carries `/pricing` as its canonical (inherited from `pricingMetadata`) and
 * is deliberately absent from `app/sitemap.ts`, so it cannot compete with
 * `/pricing` in the index.
 *
 * It is deliberately NOT `noindex`. The rewrite serves this route's markup —
 * including its metadata — at the `/pricing` URL, so a `noindex` here would
 * deindex `/pricing` for every crawler requesting from an Indian IP.
 */

export const metadata = pricingMetadata;

export default function PricingIndiaPage(): React.ReactElement {
  return <PricingRoute currency="INR" />;
}

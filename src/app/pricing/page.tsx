import { PricingRoute, pricingMetadata } from './shared';

/**
 * International pricing (USD). Indian traffic never reaches this route: the
 * middleware rewrites it to `/pricing/in` before rendering, so both variants
 * stay statically generated and CDN-cached.
 */

export const metadata = pricingMetadata;

export default function PricingPage(): React.ReactElement {
  return <PricingRoute currency="USD" />;
}

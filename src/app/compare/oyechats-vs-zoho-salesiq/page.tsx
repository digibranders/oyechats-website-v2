import { ZohoComparisonRoute, zohoCompareMetadata } from './shared';

/**
 * The dedicated Zoho SalesIQ comparison, in USD — the version served to every
 * visitor outside India. Indian traffic is rewritten by `src/proxy.ts` to the
 * `/in` twin, which renders the same component with INR.
 *
 * This is a static route shadowing `/compare/[slug]`, so `generateStaticParams`
 * in the dynamic segment filters this slug out.
 */

export const metadata = zohoCompareMetadata;

export default function ZohoComparisonPage(): React.ReactElement {
  return <ZohoComparisonRoute currency="USD" />;
}

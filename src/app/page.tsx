import { HomeContent, homeMetadata } from './HomeContent';

/**
 * International home page (USD). Indian traffic never reaches this route: the
 * middleware rewrites it to `/in` before rendering, so both variants stay
 * statically generated and CDN-cached.
 */

export const metadata = homeMetadata;

export default function HomePage(): React.ReactElement {
  return <HomeContent currency="USD" />;
}

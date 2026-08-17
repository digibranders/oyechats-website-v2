import { HomeContent, homeMetadata } from '../HomeContent';

/**
 * Indian home page (INR), served at `/` via the proxy rewrite in
 * `src/proxy.ts`. Visitors never see this path.
 *
 * Canonical and `og:url` both point at `/` (inherited from `homeMetadata`), and
 * the path is absent from `app/sitemap.ts`, so it cannot compete with `/`.
 *
 * Deliberately NOT `noindex`: the rewrite serves this route's markup — metadata
 * included — at `/`, so a `noindex` here would deindex the home page for any
 * crawler requesting from an Indian IP.
 */

export const metadata = homeMetadata;

export default function HomeIndiaPage(): React.ReactElement {
  return <HomeContent currency="INR" />;
}

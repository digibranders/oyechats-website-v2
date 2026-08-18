import { GTM_ORIGIN } from '@/lib/consent';
import { consentBootstrapScript } from '@/lib/consent-bootstrap';

/**
 * Consent defaults and the GTM container. Rendered inside the root layout's
 * `<head>`.
 *
 * Ordering is the correctness property: the bootstrap resolves consent before
 * it injects GTM, so no tag can set a cookie ahead of the banner. Head
 * placement without that ordering is exactly how sites end up tracking EEA
 * visitors pre-consent.
 *
 * This is a plain inline `<script>`, not `next/script` with
 * `beforeInteractive`. That strategy emitted a raw `<script>` as a direct child
 * of `<html>` (the root layout rendered no explicit `<head>`), which React
 * rejects: every route logged three errors — "Cannot render a sync or defer
 * <script> outside the main document", a hydration error, and a nested-script
 * error — on the very code path that gates consent. An inline script inside
 * `<head>` runs synchronously during parse, which is a *stronger* ordering
 * guarantee than `beforeInteractive`, and satisfies Google's "as high in the
 * <head> as possible" guidance directly. The container snippet the bootstrap
 * injects is `async`, so it never blocks the parser.
 *
 * The preconnect pair warms DNS + TLS for the container origin, typically
 * 100-300ms that would otherwise be spent on a cold connection.
 */
export default function Analytics(): React.ReactElement {
  return (
    <>
      {/* No `crossOrigin`: gtm.js is a classic (non-CORS) script, and a CORS
          preconnect opens a connection the actual request can't reuse -
          Lighthouse flags exactly that as "unused preconnect". */}
      <link rel="preconnect" href={GTM_ORIGIN} />
      <link rel="dns-prefetch" href={GTM_ORIGIN} />
      <script
        id="consent-bootstrap"
        dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }}
      />
    </>
  );
}

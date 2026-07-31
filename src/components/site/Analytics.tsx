import Script from 'next/script';
import { GTM_ORIGIN } from '@/lib/consent';
import { consentBootstrapScript } from '@/lib/consent-bootstrap';

/**
 * Consent defaults and the GTM container, both in `<head>`.
 *
 * `beforeInteractive` puts this in the served HTML ahead of hydration, which is
 * what Google's "as high in the <head> as possible" guidance asks for. The
 * container snippet the bootstrap injects is `async`, so it never blocks the
 * parser.
 *
 * Ordering is the correctness property: the bootstrap resolves consent before
 * it injects GTM, so no tag can set a cookie ahead of the banner. Head
 * placement without that ordering is exactly how sites end up tracking EEA
 * visitors pre-consent.
 *
 * The preconnect pair warms DNS + TLS for the container origin, typically
 * 100-300ms that would otherwise be spent on a cold connection.
 */
export default function Analytics(): React.ReactElement {
  return (
    <>
      <link rel="preconnect" href={GTM_ORIGIN} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={GTM_ORIGIN} />
      {/* This IS the App Router root layout — it replaces pages/_document.js,
          so beforeInteractive is placed correctly. The consent-ordering property
          documented above depends on this strategy; the lint rule only knows about
          the Pages Router. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script
        id="consent-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }}
      />
    </>
  );
}

'use client';

import Script from 'next/script';

/**
 * Loads the official Zoho SalesIQ chat widget alongside the existing OyeChats
 * widget for a live, side-by-side answer-quality comparison (bake-off test).
 *
 * This is Zoho's genuine, in-product install snippet (Settings > Brands >
 * Website > Installation) — NOT the custom OyeChats widget. The two coexist:
 * the OyeChats launcher stays bottom-right (see {@link WidgetLoader}) and the
 * Zoho launcher is configured bottom-left in the SalesIQ brand settings, so
 * they do not overlap.
 *
 * Off-switch (two ways):
 *   1. Set `NEXT_PUBLIC_ENABLE_SALESIQ_TEST=false` in the environment and
 *      redeploy — this component then renders nothing.
 *   2. Remove the `<ZohoSalesIQLoader />` line from `src/app/layout.tsx`.
 * Default is ON (any value other than the string "false", including unset),
 * because the test was requested to run live in production.
 *
 * Loaded via `next/script` with the `afterInteractive` strategy so it never
 * competes with the LCP/critical path, matching how the OyeChats widget is
 * held off the main thread.
 */

// Public widget code from the SalesIQ install snippet. This value is meant to
// be embedded in public HTML (it is domain-scoped by Zoho), so it is safe to
// commit — same pattern as WidgetLoader's public bot key.
const SALESIQ_WIDGET_CODE =
  'siqa283776ca6f8c4c3e7330db6c076bae62706344670f197aa95b4a8c0ad597b2e2c80c2114eef7e3b5faa02e3befc1795';
const SALESIQ_WIDGET_SRC = `https://salesiq.zohopublic.in/widget?wc=${SALESIQ_WIDGET_CODE}`;

const ENABLED = process.env.NEXT_PUBLIC_ENABLE_SALESIQ_TEST !== 'false';

export default function ZohoSalesIQLoader() {
  if (!ENABLED) return null;

  return (
    <>
      <Script id="zsiq-init" strategy="afterInteractive">
        {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
      </Script>
      <Script id="zsiqscript" src={SALESIQ_WIDGET_SRC} strategy="afterInteractive" />
    </>
  );
}

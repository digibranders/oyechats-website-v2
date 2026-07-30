import type { Metadata } from 'next';
import { SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { PRICING_FAQ, type Currency } from '@/lib/pricing';
import PricingClient from './PricingClient';

/**
 * Shared by both pricing routes: `/pricing` (USD) and `/pricing/in` (INR).
 *
 * Metadata and the entity graph are built once, against `/pricing` in both
 * cases. That is deliberate — `/pricing/in` is a rendering variant, not a
 * separate page, so it must declare `/pricing` as its canonical whether it is
 * reached through the middleware rewrite or hit directly.
 */

const title = 'AI Chatbot Pricing — Plans from Free';
const description =
  'Credit-based pricing for OyeChats. Start free, then scale on Starter, Standard, or Professional. Live chat, BANT scoring, and top-up packs included.';

export const pricingMetadata: Metadata = pageMeta({
  title,
  description,
  path: '/pricing',
});

// The Product + AggregateOffer node is gone. It was a THIRD commercial
// description of the same product (alongside SoftwareApplication on / and on
// /features), unlinked to either, and its lowPrice included the free tier so
// AI engines would quote "OyeChats starts at $0". Offers now live once on the
// canonical SoftwareApplication in the site graph, in BOTH currencies with
// UnitPriceSpecification so $9 reads as monthly rather than a one-time charge.
//
// Because both currencies are always declared there, serving INR or USD markup
// can never contradict the structured data.
//
// FAQPage stays: since Google's August 2023 restriction it will not produce a
// rich result for a B2B SaaS, but it remains one of the most reliably parsed
// structures for AI Overviews, ChatGPT search and Perplexity. It is eligible
// because the Accordion keeps every answer in the DOM regardless of open state.
const graph = buildGraph({
  path: '/pricing',
  name: 'OyeChats Pricing',
  description,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Pricing' }],
  nodes: [
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/pricing#faq`,
      mainEntity: PRICING_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
});

export function PricingRoute({ currency }: { currency: Currency }): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <PricingClient currency={currency} />
    </>
  );
}

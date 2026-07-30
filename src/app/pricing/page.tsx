import type { Metadata } from 'next';
import { SITE_URL, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { PRICING_FAQ } from '@/lib/pricing';
import PricingClient from './PricingClient';

const title = 'AI Chatbot Pricing — Plans from Free';
const description =
  'Credit-based pricing for OyeChats. Start free, then scale on Starter, Standard, or Professional. Live chat, BANT scoring, and top-up packs included.';

export const metadata: Metadata = pageMeta({
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

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <PricingClient initialCurrency="USD" />
    </>
  );
}

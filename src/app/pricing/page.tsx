import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { PRICING_FAQ, PRICING_TIERS } from '@/lib/pricing';
import PricingClient from './PricingClient';

const title = 'Pricing';
const description =
  'Simple, credit-based pricing for OyeChats. Start free with a grounded AI bot, then scale on Starter, Standard, or Professional. Live chat, BANT scoring, and top-up packs included.';

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/pricing',
});

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PRICING_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

// Paid tiers with a USD price. Google crawls from the US, so the
// offer schema is expressed in USD to stay consistent with the homepage schema.
const priceableTiers = PRICING_TIERS.filter((tier) => tier.monthly !== null);
const usdPrices = priceableTiers.map((tier) => tier.monthly?.USD ?? 0);

const offerSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'OyeChats',
  description,
  brand: { '@type': 'Brand', name: 'OyeChats' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: String(Math.min(...usdPrices)),
    highPrice: String(Math.max(...usdPrices)),
    offerCount: priceableTiers.length,
    offers: priceableTiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      price: String(tier.monthly?.USD ?? 0),
      priceCurrency: 'USD',
      url: 'https://www.oyechats.com/pricing',
    })),
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />
      <PricingClient initialCurrency="USD" />
    </>
  );
}

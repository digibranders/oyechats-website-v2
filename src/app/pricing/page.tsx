import type { Metadata } from 'next';
import { PRICING_FAQ } from '@/lib/pricing';
import PricingClient from './PricingClient';

const title = 'Pricing';
const description =
  'Simple, credit-based pricing for OyeChats. Start free with 200 credits a month, then scale on Starter, Standard, or Enterprise. Live chat, BANT scoring, and top-up packs included.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/pricing' },
  openGraph: {
    title,
    description,
    url: '/pricing',
  },
};

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

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingClient />
    </>
  );
}

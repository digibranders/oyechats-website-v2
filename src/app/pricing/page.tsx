import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PRICING_FAQ, currencyForCountry } from '@/lib/pricing';
import PricingClient from './PricingClient';

const title = 'Pricing';
const description =
  'Simple, credit-based pricing for OyeChats. Start free with a grounded AI bot, then scale on Starter, Standard, or Professional. Live chat, BANT scoring, and top-up packs included.';

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

// Currency is resolved per-request from the visitor's IP country, so this page
// must never be statically cached (a US visitor must not be served an INR
// render, and vice-versa).
export const dynamic = 'force-dynamic';

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

export default async function PricingPage() {
  // Strict geo-gate: India (IN) is billed in INR; every other country (and any
  // request where the country can't be determined) is billed in USD. Vercel
  // injects `x-vercel-ip-country` on every request at the edge.
  const requestHeaders = await headers();
  const country = requestHeaders.get('x-vercel-ip-country');
  const currency = currencyForCountry(country);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingClient currency={currency} />
    </>
  );
}

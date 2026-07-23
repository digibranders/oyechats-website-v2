import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import ContactClient from './ContactClient';

const title = 'Contact';
const description =
  'Get in touch with OyeChats. Talk to sales about a rollout, request a demo, or reach support. We usually reply within one business day.';

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/contact',
});

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact OyeChats',
  description,
  url: 'https://www.oyechats.com/contact',
  mainEntity: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@oyechats.com',
    url: 'https://www.oyechats.com/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}

import type { Metadata } from 'next';
import ContactClient from './ContactClient';

const title = 'Contact';
const description =
  'Get in touch with OyeChats. Talk to sales about a rollout, request a demo, or reach support. We usually reply within one business day.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title,
    description,
    url: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

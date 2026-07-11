import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/site/LegalDocument';
import { LEGAL_PAGES } from '@/lib/legal';

const SLUG = 'refund';
const page = LEGAL_PAGES.find((p) => p.slug === SLUG)!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `/legal/${SLUG}` },
};

export default function Page() {
  if (!page) notFound();
  return <LegalDocument page={page} />;
}

import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/site/LegalDocument';
import { LEGAL_PAGES } from '@/lib/legal';

const SLUG = 'refund';
const page = LEGAL_PAGES.find((p) => p.slug === SLUG)!;

export const metadata: Metadata = pageMeta({
  title: page.title,
  description: page.description,
  path: `/legal/${SLUG}`,
});

export default function Page() {
  if (!page) notFound();
  return <LegalDocument page={page} />;
}

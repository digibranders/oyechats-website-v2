import type { Metadata, Viewport } from 'next';
import { Inter, Geist, Geist_Mono, Fraunces } from 'next/font/google';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
// Hidden for now, re-enable (import + render below) when there's an announcement or offer.
// import AnnouncementBar from '@/components/site/AnnouncementBar';
import './globals.css';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFAF7',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://oyechats.com'),
  title: {
    default: 'OyeChats. You only talk to buyers.',
    template: '%s · OyeChats',
  },
  description:
    'AI chatbot that qualifies every visitor with BANT scoring before your sales reps see them. RAG-grounded answers, live handoff, webhooks, and analytics.',
  keywords: [
    'AI chatbot',
    'BANT qualification',
    'RAG chatbot',
    'live chat',
    'sales intelligence',
    'lead qualification',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    title: 'OyeChats. You only talk to buyers.',
    description:
      'AI chatbot that qualifies every visitor with BANT scoring before your sales reps see them.',
    siteName: 'OyeChats',
  },
  twitter: { card: 'summary_large_image', title: 'OyeChats. You only talk to buyers.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body>
        {/* <AnnouncementBar />, hidden for now; re-enable for announcements/offers */}
        <Navbar />
        <main>{children}</main>
        <Footer />

        <Script
          src="https://cdn.oyechats.com/oyechats-widget.js"
          data-bot-key="bot-9d52d243038c"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import {
  Lock,
  Shield,
  KeyRound,
  ClipboardList,
  ShieldCheck,
  Globe,
  Server,
  Zap,
  Bug,
  Eye,
  Cloud,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import {
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
  Section,
} from '@/components/ds';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'OyeChats security practices: encryption in transit and at rest, GDPR-aligned data handling, access controls, signed webhooks, and infrastructure details.',
  alternates: { canonical: '/security' },
};

const SECURITY_SECTIONS: { icon: LucideIcon; title: string; items: string[] }[] = [
  {
    icon: Lock,
    title: 'Encryption',
    items: [
      'TLS for all data in transit (HTTPS / WSS)',
      'Data encrypted at rest by our managed cloud storage (AES-256)',
      'Webhook payloads signed with HMAC-SHA256',
      'Passwords hashed with bcrypt, never stored in plain text',
    ],
  },
  {
    icon: Shield,
    title: 'Infrastructure',
    items: [
      'Hosted on managed cloud infrastructure',
      'Automated backups managed by our cloud provider',
      'Rate limiting on API endpoints',
      'Error and uptime monitoring via Sentry',
    ],
  },
  {
    icon: KeyRound,
    title: 'Access Control',
    items: [
      'Role-based access control for operators and admins',
      'Password and Google OAuth sign-in',
      'Signed session tokens with expiry',
      'API keys scoped to the minimum required permissions',
    ],
  },
  {
    icon: ClipboardList,
    title: 'Data and Privacy',
    items: [
      'GDPR-aligned data processing',
      'Email addresses redacted in application logs',
      'Right to erasure, delete visitor data on request',
      'Prompt-injection guards on every AI message',
    ],
  },
];

const SECURITY_HIGHLIGHTS: { badge: LucideIcon; name: string; status: string }[] = [
  { badge: Globe, name: 'GDPR', status: 'Aligned' },
  { badge: Lock, name: 'HTTPS / TLS', status: 'Enforced everywhere' },
  { badge: Cloud, name: 'Encryption at rest', status: 'AES-256, managed cloud' },
  { badge: ShieldCheck, name: 'Signed webhooks', status: 'HMAC-SHA256' },
];

const INFRA_STACK = [
  { icon: Server, name: 'Managed Postgres', role: 'Primary application datastore' },
  { icon: Zap, name: 'Background job queue', role: 'Async tasks via ARQ + Redis' },
  { icon: Bug, name: 'Error monitoring', role: 'Incident alerting via Sentry' },
  { icon: Eye, name: 'AI observability', role: 'Trace logging via Langfuse (Enterprise)' },
  { icon: Cloud, name: 'Cloud object storage', role: 'Documents and media via Cloudflare R2' },
  { icon: Mail, name: 'Transactional email', role: 'Notifications and summaries via Brevo' },
];

export default function SecurityPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-16 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Security, <GradientText>documented</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            No vague assurances. Here is exactly how we protect your data and your customers&apos;
            data, the encryption, access controls, and infrastructure behind every conversation.
          </p>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        {/* What's in place today, practices, not third-party certifications */}
        <Reveal delay={80} className="mb-16">
        <div>
          <div className="max-w-2xl mb-6">
            <h2 className="type-heading-2 text-ink">What&apos;s in place today</h2>
            <p className="type-body-sm text-muted mt-2">
              These controls are live in production. OyeChats does not yet hold formal third-party
              certifications such as SOC&nbsp;2 or ISO&nbsp;27001; our data processing is aligned with
              the GDPR, and we&apos;re happy to walk enterprise teams through our practices in detail.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SECURITY_HIGHLIGHTS.map((item, i) => (
              <Reveal key={item.name} delay={i * 60} className="h-full">
              <div
                className="flex h-full items-center gap-3 bg-canvas rounded-[var(--r-3)] p-4 border border-line"
              >
                <div className="w-9 h-9 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0">
                  <item.badge size={16} />
                </div>
                <div className="min-w-0">
                  <p className="type-body-sm text-ink font-semibold">{item.name}</p>
                  <p className="type-mono-sm text-muted mt-0.5">{item.status}</p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Security sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {SECURITY_SECTIONS.map((section, i) => (
            <Reveal key={section.title} delay={i * 60} className="h-full">
            <div
              className="h-full bg-canvas border border-line rounded-[var(--r-3)] p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center">
                  <section.icon size={20} />
                </div>
                <h3 className="type-heading-3 text-ink">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 type-body-sm text-ink-2">
                    <span className="text-signal font-mono mt-1 leading-none">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            </Reveal>
          ))}
        </div>

        {/* Infrastructure grid */}
        <Reveal>
        <div className="bg-paper border border-line rounded-[var(--r-4)] p-8">
          <h3 className="type-heading-2 text-ink mb-6 text-center">
            Infrastructure at a glance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INFRA_STACK.map((item, i) => (
              <Reveal key={item.name} delay={i * 60} className="h-full">
              <div
                className="flex h-full items-center gap-3 bg-canvas rounded-[var(--r-3)] p-4 border border-line"
              >
                <div className="w-9 h-9 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0">
                  <item.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="type-body-sm text-ink font-semibold">{item.name}</p>
                  <p className="type-mono-sm text-muted mt-0.5">{item.role}</p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Responsible disclosure */}
        <Reveal>
        <div className="mt-12 text-center">
          <p className="type-body text-ink-2 mb-3">
            Found a vulnerability? We have a responsible disclosure program.
          </p>
          <a
            href="mailto:support@oyechats.com"
            className="type-mono-md text-volt hover:underline underline-offset-2 font-medium"
          >
            support@oyechats.com
          </a>
        </div>
        </Reveal>
      </Section>
    </>
  );
}

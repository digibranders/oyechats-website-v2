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
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  MonoMark,
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

const CERTIFICATIONS: { badge: LucideIcon; name: string; status: string; tint: string }[] = [
  { badge: Globe, name: 'GDPR', status: 'Aligned', tint: 'bg-signal-tint text-signal border-signal/30' },
  { badge: Lock, name: 'HTTPS / TLS', status: 'Active', tint: 'bg-signal-tint text-signal border-signal/30' },
  { badge: Cloud, name: 'Encrypted at Rest', status: 'Managed cloud', tint: 'bg-volt-tint text-volt-ink border-volt-line' },
  { badge: ShieldCheck, name: 'Signed Webhooks', status: 'HMAC-SHA256', tint: 'bg-[#FDF4FF] text-[#A21CAF] border-[#F0ABFC]' },
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
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-24 text-center">
          <div className="flex justify-center gap-2 mb-6">
            <MonoMark>~/oyechats · security</MonoMark>
            <Chip variant="signal">All systems operational</Chip>
          </div>
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Enterprise-grade <GradientText>security</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Your data and your customers&apos; data is safe with us. Here&apos;s exactly how we protect it.
          </p>
        </Container>
      </section>

      <Section tone="canvas" containerSize="wide">
        {/* Certifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.name}
              className={`rounded-[var(--r-4)] border p-5 text-center ${cert.tint}`}
            >
              <cert.badge size={28} className="mx-auto mb-2" />
              <p className="type-body-sm font-semibold">{cert.name}</p>
              <p className="text-[11px] opacity-70 mt-1">{cert.status}</p>
            </div>
          ))}
        </div>

        {/* Security sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {SECURITY_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="bg-canvas border border-line rounded-[var(--r-3)] p-6"
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
          ))}
        </div>

        {/* Infrastructure grid */}
        <div className="bg-paper border border-line rounded-[var(--r-4)] p-8">
          <h3 className="type-heading-2 text-ink mb-6 text-center">
            Infrastructure at a glance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INFRA_STACK.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 bg-canvas rounded-[var(--r-3)] p-4 border border-line"
              >
                <div className="w-9 h-9 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0">
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="type-body-sm text-ink font-semibold">{item.name}</p>
                  <p className="type-mono-sm text-muted mt-0.5">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible disclosure */}
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
      </Section>
    </>
  );
}

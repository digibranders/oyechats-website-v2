import Link from 'next/link';
import { Linkedin, Instagram, Twitter, Github } from 'lucide-react';
import { FOOTER_COLUMNS } from '@/lib/site';
import { Chip } from '@/components/ds';
import { Logo } from './Logo';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/oyechats', icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/oyechats', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com/oyechats', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com/digibranders', icon: Github },
];

const CURRENT_VERSION = 'v3.2.0';

export default function Footer() {
  return (
    <footer className="bg-ink-invert text-ink-invert-fg relative overflow-hidden">
      {/* Ambient volt aurora bottom-right */}
      <div
        aria-hidden
        className="absolute pointer-events-none w-[600px] h-[600px] rounded-full opacity-40 blur-[80px]"
        style={{
          background:
            'radial-gradient(circle, rgba(162,28,175,0.18) 0%, transparent 65%)',
          bottom: '-200px',
          right: '-100px',
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.4fr_2fr] gap-10 md:gap-16">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo invert size={32} subtitle="/ voltage-paper" />
            <p className="type-body-sm text-ink-invert-muted mt-4 leading-relaxed">
              The AI chatbot that qualifies inbound leads with BANT scoring so sales reps only talk
              to buyers.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <Chip variant="signal">All systems operational</Chip>
              <Link
                href="/changelog"
                className="type-mono-sm text-ink-invert-muted hover:text-volt-light no-underline inline-flex items-center gap-1.5"
              >
                <span>{CURRENT_VERSION}</span>
                <span>·</span>
                <span>What&apos;s new</span>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-1.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-[var(--r-2)] border border-white/10 bg-white/5 flex items-center justify-center text-ink-invert-fg hover:bg-white/10 hover:border-white/25 hover:text-volt-light transition-colors"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="type-mono-sm text-ink-invert-muted mb-4">{col.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[13px] text-paper no-underline hover:text-volt-light"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-ink-invert-muted">
          <div>© {new Date().getFullYear()} OyeChats, a brand of Digibranders Pvt Ltd. All rights reserved.</div>
          <div className="font-mono">~/oyechats · {CURRENT_VERSION}</div>
        </div>
      </div>

      {/* Giant wordmark ambient */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-16 left-1/2 -translate-x-1/2 font-display font-bold text-white/[0.03] leading-none tracking-[-0.05em]"
        style={{ fontSize: 'clamp(9rem, 20vw, 18rem)' }}
      >
        OyeChats
      </div>
    </footer>
  );
}

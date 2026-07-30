import Link from 'next/link';
import { Linkedin, Instagram, Twitter, Github, type LucideIcon } from 'lucide-react';
import { FOOTER_COLUMNS, SOCIAL_LINKS } from '@/lib/site';
import { CHANGELOG } from '@/lib/changelog';
import { Logo } from './Logo';
import { SystemStatus } from './SystemStatus';
import CookiePreferencesButton from './CookiePreferencesButton';

/** Icon per profile. The URLs themselves live in `site.ts` so the footer and the
 *  Organization `sameAs` schema can never disagree about which profiles exist. */
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  X: Twitter,
  GitHub: Github,
};

const LAST_UPDATED = CHANGELOG[0].date;
const LAST_UPDATED_ISO = CHANGELOG[0].dateISO;

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

      <div className="relative mx-auto max-w-[1360px] px-6 md:px-12 py-16 md:py-16">
        <div className="grid md:grid-cols-[1.4fr_2fr] gap-10 md:gap-16">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo invert size={32} />
            <p className="type-body-sm text-ink-invert-muted mt-4 leading-relaxed">
              The AI chatbot that qualifies inbound leads with BANT scoring so sales reps only talk
              to buyers.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <SystemStatus />
              <Link
                href="/changelog"
                className="type-mono-sm text-ink-invert-muted hover:text-volt-light no-underline inline-flex items-center gap-1.5"
              >
                <span>What&apos;s new</span>
                <span>·</span>
                <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED}</time>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-1.5">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-[var(--r-2)] border border-white/10 bg-white/5 flex items-center justify-center text-ink-invert-fg hover:bg-white/10 hover:border-white/25 hover:text-volt-light transition-colors"
                  >
                    {Icon ? <Icon size={14} aria-hidden="true" /> : null}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns. `h4` here produced an h2 -> h4 skip on every page whose
              deepest heading was an h2 (/solutions, /changelog, /legal/*), so the
              column titles are plain text and the group is a labelled landmark. */}
          <nav aria-label="Footer" className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="type-mono-sm text-ink-invert-muted mb-4">{col.title}</div>
                <ul className="flex flex-col gap-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-block py-1.5 text-[13px] text-paper no-underline hover:text-volt-light"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 text-[12px] text-ink-invert-muted">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} OyeChats</span>
            <CookiePreferencesButton />
          </div>
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

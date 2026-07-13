import type { Metadata } from 'next';
import { Chip, Container, DottedGrid, GradientText, HeroGlow } from '@/components/ds';
import { CHANGELOG, type ChangelogEntry } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'OyeChats product updates and release notes: new features, improvements, and fixes as they ship.',
  alternates: { canonical: '/changelog' },
};

const ACCENT_STYLES: Record<ChangelogEntry['accent'], { pill: string; dot: string }> = {
  blue: { pill: 'bg-[#FDF4FF] border-[#F0ABFC] text-[#A21CAF]', dot: 'bg-[#A21CAF]' },
  violet: { pill: 'bg-volt-tint border-volt-line text-volt-ink', dot: 'bg-volt' },
  emerald: { pill: 'bg-signal-tint border-[#A6E4C1] text-signal', dot: 'bg-signal' },
  amber: { pill: 'bg-alert-tint border-[#F4CD8A] text-alert', dot: 'bg-alert' },
  rose: { pill: 'bg-danger-tint border-[#F4B0B0] text-danger', dot: 'bg-danger' },
};

export default function ChangelogPage() {
  return (
    <>
      <section className="relative bg-paper overflow-hidden border-b border-line">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            What&apos;s <GradientText>new</GradientText> in OyeChats.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Product updates for the OyeChats platform, widget, and dashboard: new features,
            improvements, and fixes as they ship.
          </p>
        </Container>
      </section>

      <div className="bg-canvas py-16 md:py-24">
        <Container>
          <div className="relative mx-auto max-w-3xl">
            <div
              className="absolute left-4 md:left-6 top-2 bottom-2 border-l border-dashed border-line"
              aria-hidden
            />
            <div className="space-y-10">
              {CHANGELOG.map((entry) => {
                const a = ACCENT_STYLES[entry.accent];
                return (
                  <article
                    key={entry.id}
                    id={entry.id}
                    className="relative pl-14 md:pl-20"
                  >
                    <div
                      className={`absolute left-2.5 md:left-4 top-2 w-4 h-4 rounded-full border-2 border-canvas ${a.dot} shadow-[0_0_0_1px_var(--line)]`}
                    />
                    <div className="bg-canvas border border-line rounded-[var(--r-4)] p-6 md:p-8 hover:border-line-2 hover:shadow-[var(--e-2)] transition-all duration-300">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {entry.tags.map((tag, i) => (
                          <Chip
                            key={tag}
                            variant={i === 0 ? 'soft' : 'outline'}
                            className={i === 0 ? a.pill : ''}
                          >
                            {tag}
                          </Chip>
                        ))}
                        <span className="type-mono-sm text-muted ml-auto">{entry.date}</span>
                      </div>
                      <h2 className="type-heading-1 text-ink mb-3">{entry.title}</h2>
                      <p className="type-body text-ink-2 mb-6">{entry.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-line">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-volt-tint border border-volt-line flex items-center justify-center font-mono font-semibold text-[10px] text-volt-ink">
                            {entry.author.initials}
                          </div>
                          <div className="text-xs">
                            <div className="text-ink font-medium">{entry.author.name}</div>
                          </div>
                        </div>
                        <a
                          href={`#${entry.id}`}
                          className="type-mono-sm text-volt hover:underline no-underline"
                        >
                          #{entry.id}
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

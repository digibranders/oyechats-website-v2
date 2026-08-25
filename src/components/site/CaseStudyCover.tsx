import type { CaseStudy, CaseStudyAccent } from '@/lib/case-studies';
import { cn } from '@/lib/cn';

/**
 * Programmatic case study cover. No raster assets to ship, brief or break.
 *
 * Unlike the blog covers, the artwork is not decorative: the silhouette IS the
 * study's own funnel, drawn from its stage values. Every future case study gets
 * a cover that is unique because its data is unique, so the library never fills
 * up with five variations of the same gradient.
 */

type AccentTokens = { c: string; c2: string; c3: string; tint: string };

const ACCENTS: Record<CaseStudyAccent, AccentTokens> = {
  violet: { c: '#7C3AED', c2: '#C084FC', c3: '#E879F9', tint: '#F3ECFE' },
  emerald: { c: '#047857', c2: '#34D399', c3: '#5EEAD4', tint: '#E7F5EE' },
  amber: { c: '#B45309', c2: '#FBBF24', c3: '#FB923C', tint: '#FBF3E6' },
  blue: { c: '#0369A1', c2: '#38BDF8', c3: '#818CF8', tint: '#EAF3FB' },
  rose: { c: '#BE185D', c2: '#FB7185', c3: '#F472B6', tint: '#FCEBF1' },
};

type Variant = 'card' | 'banner';

const ASPECT: Record<Variant, string> = {
  card: 'aspect-[16/10]',
  banner: 'aspect-[16/7] md:aspect-[21/6]',
};

/** Deterministic hash so each study's mesh is stable across builds. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function CaseStudyCover({
  study,
  variant = 'card',
  className,
}: {
  study: CaseStudy;
  variant?: Variant;
  className?: string;
}) {
  const a = ACCENTS[study.accent] ?? ACCENTS.violet;
  const h = hash(study.slug);
  const grainId = `cs-grain-${study.slug}`;
  const fillId = `cs-fill-${study.slug}`;

  const b1x = 8 + (h % 22);
  const b1y = 14 + ((h >> 4) % 20);
  const b2x = 60 + ((h >> 8) % 26);
  const b2y = 28 + ((h >> 12) % 28);

  // The study's own funnel, capped at seven bars so a longer funnel still
  // renders legibly at card size.
  const stages = study.funnel.slice(0, 7);
  const top = stages[0]?.value || 1;
  const barGap = 4;
  const barH = (100 - barGap * (stages.length - 1)) / stages.length;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-[var(--r-4)] border border-line',
        ASPECT[variant],
        className,
      )}
      style={{
        background: [
          `radial-gradient(120% 120% at ${b1x}% ${b1y}%, ${a.c3}40 0%, transparent 45%)`,
          `radial-gradient(120% 120% at ${b2x}% ${b2y}%, ${a.c2}52 0%, transparent 50%)`,
          `radial-gradient(140% 140% at 94% 96%, ${a.c}30 0%, transparent 55%)`,
          `linear-gradient(135deg, ${a.tint} 0%, var(--paper) 72%)`,
        ].join(', '),
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode: 'soft-light', opacity: 0.5 }}
      >
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)' }}
      />

      {/* The funnel silhouette, drawn from the study's real stage values. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-y-[16%] right-[6%]',
          variant === 'banner' ? 'w-[26%] max-w-[220px]' : 'w-[46%]',
        )}
        role="presentation"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={a.c} />
            <stop offset="100%" stopColor={a.c2} />
          </linearGradient>
        </defs>
        {stages.map((s, i) => {
          const w = Math.max((s.value / top) * 100, 4);
          return (
            <rect
              key={s.id}
              x={0}
              y={i * (barH + barGap)}
              width={w}
              height={barH}
              rx={1.4}
              fill={`url(#${fillId})`}
              opacity={0.92 - i * 0.06}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
        <span
          className="type-mono-sm w-fit rounded-[var(--r-full)] border px-3 py-1 backdrop-blur-sm"
          style={{
            color: a.c,
            borderColor: `${a.c}55`,
            background: 'color-mix(in srgb, var(--canvas) 72%, transparent)',
          }}
        >
          {study.category}
        </span>
        {/* `--ink-2`, not `--muted`. The caption sits on a mesh whose light end
            put `--muted` at 4.20:1, under the 4.5:1 floor, and the mesh differs
            per accent so there is no single background to tune against. #3F3F46
            clears AA against every generated variant. */}
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: a.c }} />
          <span className="type-mono-sm text-ink-2">{study.client.market}</span>
          <span className="type-mono-sm text-ink-2">/</span>
          <span className="type-mono-sm text-ink-2">{study.client.period}</span>
        </div>
      </div>
    </div>
  );
}

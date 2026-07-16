import type { BlogAccent } from '@/lib/blog';
import { cn } from '@/lib/cn';

/**
 * Programmatic blog cover art — no raster assets to ship or break. Each post
 * gets an aurora gradient mesh plus a motif drawn from the product's own world,
 * chosen by category (a chat exchange, price tiers, a step flow, a doc stack, a
 * growth pulse). On-brand "Voltage Paper", deterministic per slug, and purely
 * presentational so it renders inside client components too.
 */

type AccentTokens = { c: string; c2: string; c3: string; tint: string };

const ACCENTS: Record<BlogAccent, AccentTokens> = {
  blue: { c: '#0369A1', c2: '#38BDF8', c3: '#818CF8', tint: '#EAF3FB' },
  violet: { c: '#7C3AED', c2: '#C084FC', c3: '#E879F9', tint: '#F3ECFE' },
  emerald: { c: '#047857', c2: '#34D399', c3: '#5EEAD4', tint: '#E7F5EE' },
  amber: { c: '#B45309', c2: '#FBBF24', c3: '#FB923C', tint: '#FBF3E6' },
  rose: { c: '#BE185D', c2: '#FB7185', c3: '#F472B6', tint: '#FCEBF1' },
};

type Motif = 'chat' | 'tiers' | 'steps' | 'stack' | 'pulse';

// Category → motif. Anything unmapped falls back to the on-brand chat motif.
const CATEGORY_MOTIF: Record<string, Motif> = {
  'Buyer Guide': 'tiers',
  'How-to': 'steps',
  'Sales AI': 'chat',
  Growth: 'pulse',
  'AI Engineering': 'stack',
  Search: 'stack',
  Engineering: 'stack',
};

/** Small deterministic hash so each post's mesh is stable but distinct. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Variant = 'card' | 'featured' | 'banner';

const ASPECT: Record<Variant, string> = {
  card: 'aspect-[16/10]',
  featured: 'aspect-[16/11]',
  banner: 'aspect-[16/6] md:aspect-[21/6]',
};

// ── Motifs ──────────────────────────────────────────────────────────────────
// All drawn in a 120×120 viewBox, centred by the parent SVG's preserveAspectRatio.

function ChatMotif({ a }: { a: AccentTokens }) {
  return (
    <g>
      {/* Incoming bubble */}
      <rect x="14" y="26" width="66" height="34" rx="12" fill="#fff" stroke={a.c} strokeWidth="1.6" />
      <path d="M24 60 L24 70 L36 60 Z" fill="#fff" stroke={a.c} strokeWidth="1.6" />
      <rect x="24" y="36" width="42" height="4" rx="2" fill={a.c} opacity="0.35" />
      <rect x="24" y="45" width="30" height="4" rx="2" fill={a.c} opacity="0.35" />
      {/* Reply bubble (accent) */}
      <rect x="46" y="66" width="60" height="30" rx="12" fill={a.c} />
      <path d="M96 96 L96 104 L84 96 Z" fill={a.c} />
      <rect x="56" y="75" width="40" height="4" rx="2" fill="#fff" opacity="0.9" />
      <rect x="56" y="84" width="26" height="4" rx="2" fill="#fff" opacity="0.6" />
      {/* Score dot */}
      <circle cx="100" cy="34" r="9" fill={a.c2} />
      <circle cx="100" cy="34" r="9" fill="none" stroke="#fff" strokeWidth="1.5" />
    </g>
  );
}

function TiersMotif({ a }: { a: AccentTokens }) {
  const bars = [
    { x: 20, h: 34, fill: a.tint, stroke: a.c },
    { x: 48, h: 54, fill: a.tint, stroke: a.c },
    { x: 76, h: 78, fill: a.c, stroke: a.c },
  ];
  return (
    <g>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={104 - b.h}
          width="24"
          height={b.h}
          rx="6"
          fill={b.fill}
          stroke={b.stroke}
          strokeWidth="1.6"
        />
      ))}
      {/* Price tag on the tallest tier */}
      <g transform="translate(78 12) rotate(8)">
        <path d="M0 6 A6 6 0 0 1 6 0 L22 0 L30 8 L14 24 L0 10 Z" fill="#fff" stroke={a.c} strokeWidth="1.6" />
        <circle cx="9" cy="9" r="2.6" fill={a.c} />
      </g>
    </g>
  );
}

function StepsMotif({ a }: { a: AccentTokens }) {
  const nodes = [
    { x: 20, y: 84 },
    { x: 60, y: 52 },
    { x: 100, y: 24 },
  ];
  return (
    <g>
      <path d={`M${nodes[0].x} ${nodes[0].y} L${nodes[1].x} ${nodes[1].y} L${nodes[2].x} ${nodes[2].y}`} fill="none" stroke={a.c} strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x - 15} y={n.y - 15} width="30" height="30" rx="9" fill={i === 2 ? a.c : '#fff'} stroke={a.c} strokeWidth="1.6" />
          {i === 2 ? (
            <path d={`M${n.x - 6} ${n.y} l4 5 l8 -9`} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={a.c} fontFamily="ui-monospace, monospace">
              {i + 1}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

function StackMotif({ a }: { a: AccentTokens }) {
  return (
    <g>
      {[
        { x: 30, y: 44, fill: a.tint },
        { x: 22, y: 34, fill: '#fff' },
        { x: 14, y: 24, fill: '#fff' },
      ].map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="66" height="52" rx="10" fill={c.fill} stroke={a.c} strokeWidth="1.6" />
      ))}
      <rect x="24" y="34" width="34" height="4" rx="2" fill={a.c} opacity="0.45" />
      <rect x="24" y="44" width="46" height="4" rx="2" fill={a.c} opacity="0.28" />
      <rect x="24" y="54" width="26" height="4" rx="2" fill={a.c} opacity="0.28" />
      {/* Spark */}
      <path d="M96 20 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill={a.c2} />
    </g>
  );
}

function PulseMotif({ a }: { a: AccentTokens }) {
  const line = 'M12 88 L34 70 L52 78 L74 44 L96 30 L108 20';
  return (
    <g>
      <path d={`${line} L108 96 L12 96 Z`} fill={a.c} opacity="0.12" />
      <path d={line} fill="none" stroke={a.c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="74" cy="44" r="4.5" fill="#fff" stroke={a.c} strokeWidth="2" />
      <circle cx="108" cy="20" r="5.5" fill={a.c2} stroke="#fff" strokeWidth="1.8" />
      {/* Rising arrow */}
      <path d="M96 30 l14 -12 M110 18 l0 8 M110 18 l-8 0" fill="none" stroke={a.c} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

const MOTIFS: Record<Motif, (p: { a: AccentTokens }) => React.ReactElement> = {
  chat: ChatMotif,
  tiers: TiersMotif,
  steps: StepsMotif,
  stack: StackMotif,
  pulse: PulseMotif,
};

export function BlogCover({
  slug,
  accent,
  category,
  variant = 'card',
  className,
}: {
  slug: string;
  accent: BlogAccent;
  category: string;
  variant?: Variant;
  className?: string;
}) {
  const a = ACCENTS[accent] ?? ACCENTS.violet;
  const h = hash(slug);
  const Motif = MOTIFS[CATEGORY_MOTIF[category] ?? 'chat'];

  // Aurora blob positions vary by slug so no two covers mesh the same way.
  const b1x = 10 + (h % 24);
  const b1y = 12 + ((h >> 4) % 22);
  const b2x = 58 + ((h >> 8) % 28);
  const b2y = 30 + ((h >> 12) % 30);
  const grainId = `bc-grain-${slug}`;

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
          `radial-gradient(120% 120% at ${b1x}% ${b1y}%, ${a.c3}44 0%, transparent 45%)`,
          `radial-gradient(120% 120% at ${b2x}% ${b2y}%, ${a.c2}55 0%, transparent 50%)`,
          `radial-gradient(140% 140% at 92% 96%, ${a.c}33 0%, transparent 55%)`,
          `linear-gradient(135deg, ${a.tint} 0%, var(--paper) 70%)`,
        ].join(', '),
      }}
    >
      {/* Film grain — soft organic texture, not a rigid grid */}
      <svg className="absolute inset-0 h-full w-full" style={{ mixBlendMode: 'soft-light', opacity: 0.5 }}>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      {/* Top-edge sheen */}
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)' }}
      />

      {/* Motif, centred to the right */}
      <svg
        viewBox="0 0 120 120"
        className="absolute right-[6%] top-1/2 -translate-y-1/2"
        style={{ width: variant === 'banner' ? '18%' : '46%', maxWidth: '150px' }}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <Motif a={a} />
      </svg>

      {/* Category label + brand mark */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
        <span
          className="type-mono-sm w-fit rounded-[var(--r-full)] border px-3 py-1 backdrop-blur-sm"
          style={{
            color: a.c,
            borderColor: `${a.c}55`,
            background: 'color-mix(in srgb, var(--canvas) 72%, transparent)',
          }}
        >
          {category}
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: a.c }} />
          <span className="type-mono-sm text-muted">oyechats.com</span>
        </div>
      </div>
    </div>
  );
}

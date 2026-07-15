'use client';

import { useEffect, useRef, useState } from 'react';
import { Zap, Activity, Radio } from 'lucide-react';
import { Button, Container, NumberTicker } from '@/components/ds';
import { APP_LINKS } from '@/lib/site';

type FeedEvent = {
  time: string;
  domain: string;
  score: number;
};

/** Base pool of events; the ticker cycles + shuffles time to feel live. Tier is
 *  derived from the BANT score, exactly like the real dashboard (see tierFor). */
const EVENT_POOL: FeedEvent[] = [
  { time: '00:52', domain: 'acme.com', score: 87 }, // SQL
  { time: '00:48', domain: 'fabrikam.com', score: 63 }, // SAL
  { time: '00:45', domain: 'wayfair.dev', score: 44 }, // MQL
  { time: '00:41', domain: 'quill.dev', score: 19 }, // Unqualified
  { time: '00:38', domain: 'northwind.io', score: 92 }, // SQL
  { time: '00:33', domain: 'contoso.co', score: 55 }, // SAL
  { time: '00:29', domain: 'stratus.io', score: 38 }, // MQL
  { time: '00:24', domain: 'lambda.co', score: 81 }, // SQL
];

type TierStyle = { tier: string; scoreClass: string; dotClass: string; labelClass: string };

/**
 * Maps a BANT score to its lead tier, mirroring the live OyeChats dashboard:
 * Unqualified → MQL → SAL → SQL, with the same score bands (≥75 / ≥50 / ≥25)
 * and colour family (grey → magenta → amber → green) as the product's score gauge.
 */
function tierFor(score: number): TierStyle {
  if (score >= 75)
    return {
      tier: 'SQL',
      scoreClass: 'bg-signal/12 text-signal border border-signal/25',
      dotClass: 'bg-signal',
      labelClass: 'text-signal',
    };
  if (score >= 50)
    return {
      tier: 'SAL',
      scoreClass: 'bg-alert/12 text-alert border border-alert/25',
      dotClass: 'bg-alert',
      labelClass: 'text-alert',
    };
  if (score >= 25)
    return {
      tier: 'MQL',
      scoreClass: 'bg-volt/15 text-volt border border-volt/30',
      dotClass: 'bg-volt',
      labelClass: 'text-volt',
    };
  return {
    tier: 'Unqualified',
    scoreClass: 'bg-white/5 text-white/40 border border-white/10',
    dotClass: 'bg-white/40',
    labelClass: 'text-white/45',
  };
}

/** World-map style constellation of ping nodes; positions are hand-picked. */
const NODES = [
  { x: 12, y: 30, size: 5, delay: 0 },
  { x: 24, y: 55, size: 4, delay: 0.6 },
  { x: 42, y: 20, size: 4, delay: 1.2 },
  { x: 58, y: 45, size: 5, delay: 0.3 },
  { x: 76, y: 30, size: 4, delay: 0.9 },
  { x: 88, y: 60, size: 5, delay: 1.5 },
  { x: 18, y: 75, size: 3, delay: 0.4 },
  { x: 68, y: 78, size: 4, delay: 1.0 },
];

export function FinalCTA() {
  const [events, setEvents] = useState<FeedEvent[]>(EVENT_POOL.slice(0, 5));
  const [clock, setClock] = useState('12:34:52');
  const eventTimer = useRef<number | null>(null);
  const clockTimer = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let cursor = 5;
    eventTimer.current = window.setInterval(() => {
      const next = EVENT_POOL[cursor % EVENT_POOL.length];
      cursor = (cursor + 1) % EVENT_POOL.length;
      const now = Math.floor(Math.random() * 20) + 40;
      const nextWithTime: FeedEvent = { ...next, time: `00:${String(now).padStart(2, '0')}` };
      setEvents((prev) => [nextWithTime, ...prev.slice(0, 4)]);
    }, 2200);

    // Simulated live clock, advances every second, wrapping realistic.
    let h = 12, m = 34, s = 52;
    clockTimer.current = window.setInterval(() => {
      s++;
      if (s >= 60) { s = 0; m++; }
      if (m >= 60) { m = 0; h = (h + 1) % 24; }
      setClock(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }, 1000);

    return () => {
      if (eventTimer.current) clearInterval(eventTimer.current);
      if (clockTimer.current) clearInterval(clockTimer.current);
    };
  }, []);

  return (
    <section className="relative bg-ink-invert text-ink-invert-fg overflow-hidden py-24 md:py-32">
      {/* Background: grid + aurora + constellation */}
      <div className="absolute inset-0 console-grid opacity-70" aria-hidden />
      <div className="console-aurora" aria-hidden />

      {/* World-map style constellation of pings */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {NODES.map((n, i) => (
          <span
            key={i}
            className="absolute rounded-full node-ping"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.size,
              height: n.size,
              background: 'var(--volt)',
              animationDelay: `${n.delay}s`,
              boxShadow: '0 0 12px rgba(162,28,175,0.6)',
            }}
          />
        ))}
      </div>

      <Container className="relative">
        {/* Eyebrow */}
        <div className="text-center type-mono-sm text-ink-invert-muted mb-5 flex items-center gap-2 justify-center">
          <span className="eyebrow-line" />
          <span>Go live in 10 minutes · every minute a lead</span>
        </div>

        {/* Headline */}
        <h2 className="type-display-2 text-ink-invert-fg text-center max-w-4xl mx-auto">
          Every chat.<br />
          Every buyer.<br />
          <span>One </span>
          <span className="gradient-volt-only">pipeline</span>
          <span>.</span>
        </h2>

        <p className="text-center type-body-lg text-ink-invert-muted max-w-[680px] mx-auto mt-6">
          Add OyeChats to your site in under 10 minutes. Your first qualified lead can land the same
          hour, every visitor scored, routed, and reported.
        </p>

        <div className="flex justify-center gap-3 flex-wrap mt-9">
          <Button
            href={APP_LINKS.register}
            external
            variant="volt"
            size="lg"
            className="px-5 py-2.5 min-h-11"
          >
            Start free <Zap size={15} />
          </Button>
          <Button
            href="/contact"
            variant="outline-invert"
            size="lg"
            className="px-5 py-2.5 min-h-11"
          >
            Talk to sales
          </Button>
        </div>

        {/* ═══════════════════════ LIVE CONSOLE ═══════════════════════ */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative rounded-[var(--r-4)] overflow-hidden border border-white/12 bg-white/[0.03] backdrop-blur-xl shadow-[0_32px_80px_-32px_rgba(0,0,0,0.55),0_16px_48px_-24px_rgba(162,28,175,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {/* Console chrome */}
            <div className="h-11 px-5 flex items-center justify-between border-b border-white/8">
              <div className="flex items-center gap-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </span>
                <span className="font-mono text-[11px] text-white/50 tracking-wide">
                  ~/oyechats · sample-feed
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/45 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                  SAMPLE
                </span>
                <span className="font-mono text-[11px] text-white/40 tabular-nums">{clock} UTC</span>
              </div>
            </div>

            {/* Body: left activity, right stats */}
            <div className="grid md:grid-cols-[1.15fr_1fr]">
              {/* ─── Activity feed ─── */}
              <div className="p-4 md:p-6 md:border-r md:border-white/8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-white/50 tracking-wide uppercase">
                    <Activity size={12} className="text-volt" />
                    Recent leads
                  </div>
                  <span className="font-mono text-[10px] text-white/30">illustrative</span>
                </div>
                <ul className="space-y-1.5">
                  {events.map((ev, i) => {
                    const t = tierFor(ev.score);
                    return (
                      <li
                        key={`${ev.domain}-${ev.time}-${i}`}
                        className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-3 py-2.5 rounded-[var(--r-2)] bg-white/[0.02] border border-white/5 hover:border-volt/40 hover:bg-white/[0.05] transition-colors"
                        style={{
                          animation: i === 0 ? 'event-in .5s cubic-bezier(.16,1,.3,1) forwards' : undefined,
                          opacity: i === 0 ? 0 : 1,
                        }}
                      >
                        <span className="font-mono text-[10px] text-white/35 tabular-nums">
                          {ev.time}
                        </span>
                        <span className="font-mono text-[12px] text-white/85 truncate">
                          {ev.domain}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-[var(--r-1)] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${t.scoreClass}`}
                        >
                          {ev.score}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide ${t.labelClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${t.dotClass}`} />
                          {t.tier}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ─── Stat tickers ─── */}
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-white/50 tracking-wide uppercase">
                    <Radio size={12} className="text-volt" />
                    Pipeline · last 60 min
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ConsoleTicker value={128} label="leads" />
                  <ConsoleTicker value={41} label="SQL" />
                  <ConsoleTicker value={73} label="avg BANT" delay={200} />
                  <ConsoleTicker value={87} suffix="%" label="resolution rate" delay={300} />
                </div>

                {/* mini sparkline */}
                <div className="mt-5 pt-5 border-t border-white/8">
                  <div className="flex items-center justify-between font-mono text-[10px] text-white/40 mb-2 uppercase tracking-wide">
                    <span>Volume · today</span>
                    <span className="text-signal flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-signal signal-dot-pulse inline-block" />
                      +18%
                    </span>
                  </div>
                  <Sparkline />
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="border-t border-white/8 px-5 py-3 flex items-center justify-between font-mono text-[10px] text-white/35">
              <span>oyechats.com / api / v1 / qualify</span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/40 inline-block" />
                sample data · not live
              </span>
            </div>
          </div>

          {/* Under-console caption */}
          <div className="mt-6 text-center type-mono-sm text-ink-invert-muted">
            Illustrative sample, not live customer data
          </div>
        </div>
      </Container>
    </section>
  );
}

function ConsoleTicker({
  value,
  suffix,
  prefix,
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}) {
  return (
    <div
      className="rounded-[var(--r-2)] px-4 py-3 bg-white/[0.02] border border-white/8 hover:border-volt/30 transition-colors"
      style={{
        animation: 'fade-up .6s cubic-bezier(.16,1,.3,1) forwards',
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      <div className="font-display font-semibold text-[26px] leading-none text-white tabular-nums tracking-[-0.02em]">
        <NumberTicker value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="font-mono text-[10px] text-white/45 mt-1.5 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function Sparkline() {
  // 24 hour buckets, hand-tuned to look realistic
  const points = [12, 18, 15, 22, 30, 28, 34, 40, 48, 42, 55, 60, 58, 66, 72, 68, 78, 82, 74, 88, 92, 84, 96, 100];
  const max = Math.max(...points);
  const w = 100;
  const h = 24;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - (p / max) * h).toFixed(1)}`)
    .join(' ');
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="var(--volt)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="2"
        fill="var(--volt)"
      >
        <animate attributeName="r" values="2;4;2" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

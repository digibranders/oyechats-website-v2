'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * "Ask OyeChats", a scripted, simulated live demo for the home hero.
 * Auto-plays a realistic exchange when in view, and lets visitors click a
 * suggested question to replay that script. Each script tells the full arc:
 * a question answered from the docs, then intent detected,
 * a BANT score ticking up, and the lead routed. No backend, pure animation.
 * Respects prefers-reduced-motion (renders the final state statically) and
 * pauses while off-screen.
 */

type Script = {
  chip: string;
  q: string;
  a: string;
  context: string;
  score: number;
  routed: string;
};

const SCRIPTS: Script[] = [
  {
    chip: 'Webhooks?',
    q: 'Do you support webhooks?',
    a: 'Yes, five event types (tier transitions, lead captured, handoff, meeting booked, chat closed), all HMAC-signed.',
    context: '“We’d need this for ~40 seats, launching next quarter.”',
    score: 84,
    routed: 'routed to sales',
  },
  {
    chip: 'Grounded RAG?',
    q: 'Is the bot grounded in our docs?',
    a: 'Yes, every answer is retrieved from your content via hybrid semantic and keyword search. Answers come directly from your docs, not the model\'s training data.',
    context: '”Comparing a few tools for our support team.”',
    score: 68,
    routed: 'nurture sequence',
  },
  {
    chip: 'Setup time?',
    q: 'How fast is setup?',
    a: 'One script tag. Upload your docs, embed the snippet, and you’re live in about five minutes.',
    context: '“Shipping a new product page this week.”',
    score: 88,
    routed: 'routed to sales',
  },
  {
    chip: 'Live handoff?',
    q: 'Can it hand off to a human?',
    a: 'When the bot reaches its limit it hands off in the same thread, full transcript and BANT context included.',
    context: '”Need live agents during business hours.”',
    score: 76,
    routed: 'routed to sales',
  },
];

const PHASES = ['q', 'a', 'qualify', 'routed', 'done'] as const;
type Phase = (typeof PHASES)[number];
const reached = (p: Phase, target: Phase) => PHASES.indexOf(p) >= PHASES.indexOf(target);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function Caret() {
  return (
    <span
      aria-hidden
      className="inline-block w-[2px] h-[0.95em] align-[-0.1em] ml-0.5 bg-current animate-pulse"
    />
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(value, 100) / 100);
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: 44, height: 44 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--volt)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.12s linear' }}
        />
      </svg>
      <span className="absolute font-display font-semibold text-[13px] text-ink tabular-nums">{value}</span>
    </span>
  );
}

export function HeroDemo() {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>('q');
  const [typedQ, setTypedQ] = useState('');
  const [typedA, setTypedA] = useState('');
  const [score, setScore] = useState(0);

  const runId = useRef(0);
  const reducedRef = useRef(false);
  const startIndexRef = useRef(0);
  const autoAdvancesRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const showFinal = useCallback((i: number) => {
    runId.current++; // cancel any running animation
    const s = SCRIPTS[i];
    setCurrent(i);
    setTypedQ(s.q);
    setTypedA(s.a);
    setScore(s.score);
    setPhase('done');
  }, []);

  // Holds the latest `play` so the self-scheduling auto-advance can recurse
  // through a stable ref instead of referencing the callback before it exists.
  const playRef = useRef<((i: number) => void) | null>(null);

  const play = useCallback(async (i: number) => {
    const s = SCRIPTS[i];
    const myRun = ++runId.current;
    const alive = () => runId.current === myRun;
    startIndexRef.current = i;

    setCurrent(i);
    setPhase('q');
    setTypedQ('');
    setTypedA('');
    setScore(0);

    for (let c = 1; c <= s.q.length; c++) {
      if (!alive()) return;
      setTypedQ(s.q.slice(0, c));
      await sleep(20);
    }
    await sleep(450);
    if (!alive()) return;

    setPhase('a');
    for (let c = 1; c <= s.a.length; c++) {
      if (!alive()) return;
      setTypedA(s.a.slice(0, c));
      await sleep(15);
    }
    await sleep(350);
    if (!alive()) return;

    setPhase('qualify');
    const steps = 22;
    for (let c = 1; c <= steps; c++) {
      if (!alive()) return;
      setScore(Math.round((s.score * c) / steps));
      await sleep(30);
    }
    setScore(s.score);
    await sleep(500);
    if (!alive()) return;

    setPhase('routed');
    await sleep(3600);
    if (!alive()) return;

    // Auto-advance through the scripts at most once, then stop. When the next
    // step would wrap past the last script, leave it rendered in its final
    // 'routed' state instead of looping back forever (keeps the main thread idle).
    const next = i + 1;
    if (next < SCRIPTS.length && autoAdvancesRef.current < SCRIPTS.length - 1) {
      autoAdvancesRef.current += 1;
      playRef.current?.(next);
    }
  }, []);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedRef.current) {
      showFinal(0);
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play(startIndexRef.current);
          } else {
            runId.current++; // pause when off-screen
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    return () => {
      runId.current++; // cancel on unmount
      io.disconnect();
    };
  }, [play, showFinal]);

  const onChip = (i: number) => {
    startIndexRef.current = i;
    if (reducedRef.current) {
      showFinal(i);
    } else {
      autoAdvancesRef.current = 0; // fresh manual replay may auto-advance again
      play(i);
    }
  };

  const active = SCRIPTS[current];

  return (
    <div ref={rootRef} className="w-full max-w-[480px] ml-auto">
      <div className="rounded-[var(--r-4)] border border-line bg-canvas shadow-[var(--e-3)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-11 border-b border-line bg-paper">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-volt" />
            <span className="type-mono-sm text-ink font-medium">Ask OyeChats</span>
          </div>
          <span className="inline-flex items-center gap-1.5 type-mono-sm text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-signal signal-dot-pulse inline-block" />
            demo
          </span>
        </div>

        {/* Conversation. Fixed height on sm+ so streaming/phase changes never
            shift the page. On mobile the pane grows (min-h) instead of clipping,
            since narrower bubbles wrap to more lines than 360px can hold. */}
        <div className="p-4 flex flex-col gap-3 min-h-[360px] sm:h-[360px] overflow-hidden">
          {/* Visitor question */}
          <div className="flex flex-col items-end max-w-[88%] self-end">
            <span className="type-mono-sm text-muted mb-1">visitor</span>
            <div className="px-3.5 py-2.5 text-[14px] leading-[1.5] bg-paper border border-line rounded-[var(--r-3)] rounded-br-[var(--r-1)] text-ink">
              {typedQ}
              {phase === 'q' && <Caret />}
            </div>
          </div>

          {/* OyeChats answer */}
          {reached(phase, 'a') && (
            <div className="flex flex-col items-start max-w-[92%] self-start">
              <span className="type-mono-sm text-volt mb-1">OyeChats</span>
              <div className="px-3.5 py-2.5 text-[14px] leading-[1.5] bg-volt-tint border border-volt-line rounded-[var(--r-3)] rounded-bl-[var(--r-1)] text-volt-ink">
                {typedA}
                {phase === 'a' && <Caret />}
              </div>
            </div>
          )}

          {/* Qualification arc */}
          {reached(phase, 'qualify') && (
            <div className="mt-1 pt-3 border-t border-line flex flex-col gap-2">
              <div className="type-body-sm text-muted italic">{active.context}</div>
              <div className="flex items-center gap-3">
                <ScoreRing value={score} />
                <div className="flex flex-col gap-0.5">
                  <span className="type-mono-sm text-muted">BANT · intent detected</span>
                  {reached(phase, 'routed') && (
                    <span className="inline-flex items-center gap-1 type-mono-sm text-signal font-medium">
                      <ArrowUpRight size={12} />
                      {active.routed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions */}
        <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 border-t border-line bg-paper/40">
          <span className="w-full type-mono-sm text-muted mb-1 mt-3">Try asking</span>
          {SCRIPTS.map((s, i) => (
            <button
              key={s.chip}
              type="button"
              onClick={() => onChip(i)}
              aria-pressed={current === i}
              className={cn(
                'inline-flex items-center px-3.5 py-2 min-h-11 rounded-[var(--r-full)] type-mono-sm border transition-colors',
                current === i
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-canvas text-muted border-line hover:border-line-2 hover:text-ink'
              )}
            >
              {s.chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

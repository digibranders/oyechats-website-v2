import type { ReactNode } from 'react';
import { ArrowRight, Check, MessageSquare, Minus, User } from 'lucide-react';
import {
  BantScoreRing,
  ChatBubble,
  ChatStack,
  DataFlowLine,
  TerminalCard,
  TermCmt,
  TermS,
} from '@/components/ds';
import { cn } from '@/lib/cn';
import { FEATURE_AXES, type Competitor, type Edge } from '@/lib/compare';

/**
 * The visual half of every deep dive on the Zoho SalesIQ comparison, kept out
 * of `shared.tsx` so the page file stays a layout rather than a wall of markup.
 *
 * Every one of these renders a fact that is already stated in the prose beside
 * it. That is the rule: a visual here illustrates a claim from
 * `oye-chats-platform/docs/competitive/oyechats-vs-zoho-salesiq.md`, it never
 * introduces one. A screenshot-shaped mock that implies a capability we have
 * not shipped is a claim, whatever it looks like.
 *
 * They are all server components. Nothing here needs state, and a comparison
 * page that cannot be read by a crawler with JavaScript off would defeat the
 * point of publishing it.
 */

/**
 * Hero visual: the thesis as a diagram rather than a sentence. Two stacked
 * panels, each labelled with what that product leads with and what it added,
 * so the "live chat that added AI vs AI that added live chat" line is legible
 * before anyone reads a word of body copy.
 */
export function VersusPanel({ tally }: { tally: EdgeTally }) {
  return (
    <div className="relative">
      <div className="bg-canvas border border-line rounded-[var(--r-4)] shadow-[var(--e-2)] overflow-hidden">
        <ProductStrip
          monogram="O"
          name="OyeChats"
          leadsWith="AI agent grounded in your content"
          added="added live chat"
          tone="oye"
        />

        {/* The join. A labelled rule rather than a floating badge, so it reads
            as one comparison object instead of two unrelated cards. */}
        <div className="relative border-y border-line bg-paper py-3">
          <div className="flex items-center gap-3 px-5">
            <span className="h-px flex-1 bg-line" />
            <span className="type-mono-sm text-muted">vs</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>

        <ProductStrip
          monogram="Z"
          name="Zoho SalesIQ"
          leadsWith="Live chat and visitor tracking"
          added="added a bot builder"
          tone="them"
        />

        <div className="border-t border-line bg-paper px-5 py-4">
          <div className="type-mono-sm text-muted mb-3">Where the eight rows land</div>
          <TallyBar tally={tally} />
        </div>
      </div>
    </div>
  );
}

function ProductStrip({
  monogram,
  name,
  leadsWith,
  added,
  tone,
}: {
  monogram: string;
  name: string;
  leadsWith: string;
  added: string;
  tone: 'oye' | 'them';
}) {
  const isOye = tone === 'oye';
  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--r-2)] border font-display font-semibold',
            isOye
              ? 'bg-volt-tint border-volt-line text-volt-ink'
              : 'bg-paper border-line text-ink'
          )}
        >
          {monogram}
        </span>
        <div className="min-w-0">
          <div className="type-body-sm font-semibold text-ink">{name}</div>
          <div className="type-mono-sm text-muted mt-0.5">{added}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2.5">
        <span
          className={cn(
            'h-1.5 w-1.5 shrink-0 rounded-full',
            isOye ? 'bg-volt' : 'bg-muted-2'
          )}
          aria-hidden
        />
        <span className="type-body-sm text-ink-2">Leads with: {leadsWith}</span>
      </div>
    </div>
  );
}

export type EdgeTally = { oye: number; tie: number; them: number; total: number };

/**
 * Counts the matrix rather than restating it. A hand-written "we win 5 of 8"
 * is a number that goes stale the moment someone re-judges a row in
 * `@/lib/compare`; this cannot.
 */
export function tallyEdges(competitor: Competitor | undefined): EdgeTally {
  const counts: EdgeTally = { oye: 0, tie: 0, them: 0, total: FEATURE_AXES.length };
  if (!competitor) return counts;
  for (const axis of FEATURE_AXES) {
    const edge: Edge = competitor.features[axis.key]?.edge ?? 'tie';
    counts[edge] += 1;
  }
  return counts;
}

/** A proportional bar of the eight matrix rows, with the counts spelled out. */
export function TallyBar({ tally }: { tally: EdgeTally }) {
  const segments = [
    { key: 'oye', n: tally.oye, label: 'OyeChats', bar: 'bg-volt', dot: 'bg-volt' },
    { key: 'tie', n: tally.tie, label: 'Even', bar: 'bg-line-2', dot: 'bg-line-2' },
    { key: 'them', n: tally.them, label: 'Zoho SalesIQ', bar: 'bg-ink', dot: 'bg-ink' },
  ].filter((s) => s.n > 0);

  return (
    <div>
      <div className="flex h-2 gap-1 overflow-hidden rounded-full" aria-hidden>
        {segments.map((s) => (
          <span
            key={s.key}
            className={cn('rounded-full', s.bar)}
            style={{ flexGrow: s.n }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2 type-body-sm text-ink-2">
            <span className={cn('h-2 w-2 rounded-full', s.dot)} aria-hidden />
            <span className="font-semibold text-ink tabular-nums">{s.n}</span>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Grounded answers: a crawl of the customer's own site, then an answer drawn
 * from it. The answer is the demo customer's content (acme.com), not a claim
 * about an OyeChats feature, and it shows no "source:" line: the agent is
 * instructed never to expose sources to the visitor, so drawing a citation here
 * would mock a capability the product does not ship.
 */
export function GroundedAnswerVisual() {
  return (
    <div className="flex flex-col gap-4">
      <TerminalCard title="~/oyechats · train" showCursor={false}>
        <TermCmt>{'// point it at your own content'}</TermCmt>
        <div className="mt-2 text-white/70">crawl https://acme.com</div>
        <div className="mt-3 text-white/60">
          indexed <TermS>1,247</TermS> passages · vector + keyword
        </div>
      </TerminalCard>
      <ChatStack className="max-w-none">
        <ChatBubble role="visitor">Do you offer next-day delivery to Mumbai?</ChatBubble>
        <ChatBubble role="agent">
          Yes. Orders to Mumbai placed before 3pm ship same day and arrive next day. Standard
          delivery elsewhere in India is 2 to 4 business days.
        </ChatBubble>
      </ChatStack>
    </div>
  );
}

/** Qualification: the score, then the ladder of tiers it lands on. */
export function QualificationVisual({
  tiers,
}: {
  tiers: { tier: string; at: number }[];
}) {
  const score = 87;
  return (
    <div className="rounded-[var(--r-4)] border border-line bg-canvas p-6 shadow-[var(--e-1)]">
      <div className="flex items-center gap-6">
        <BantScoreRing value={score} size={116} />
        <div className="min-w-0">
          <div className="type-mono-sm text-muted">Composite score</div>
          <p className="type-body-sm text-ink-2 mt-2">
            Read from the conversation in the background, never asked as a form.
          </p>
        </div>
      </div>

      {/* The ladder. The reached tiers fill, the score sits on the one it
          crossed, so the thresholds in the prose are visible as positions. */}
      <ol className="mt-6 space-y-2">
        {tiers.map((t) => {
          const reached = score >= t.at;
          const current = tiers.filter((x) => score >= x.at).at(-1)?.tier === t.tier;
          return (
            <li
              key={t.tier}
              className={cn(
                'flex items-center gap-3 rounded-[var(--r-2)] border px-3 py-2',
                current
                  ? 'border-volt-line bg-volt-tint'
                  : reached
                    ? 'border-line bg-paper'
                    : 'border-line bg-paper opacity-55'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  reached ? 'border-volt bg-volt text-white' : 'border-line-2 text-muted-2'
                )}
                aria-hidden
              >
                {reached ? <Check size={12} strokeWidth={3} /> : <Minus size={12} />}
              </span>
              <span
                className={cn(
                  'type-body-sm font-semibold',
                  current ? 'text-volt-ink' : 'text-ink'
                )}
              >
                {t.tier}
              </span>
              <span className="type-mono-sm text-muted ml-auto tabular-nums">
                at {t.at}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Handoff: the state machine as chips, then what the operator picks up with. */
export function HandoffVisual() {
  const states = ['bot', 'waiting', 'live', 'closed'];
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[var(--r-4)] border border-line bg-canvas p-5 shadow-[var(--e-1)]">
        <div className="type-mono-sm text-muted mb-4">Session state</div>
        <ol className="flex flex-wrap items-center gap-2">
          {states.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full border px-3 py-1 font-mono text-[12px]',
                  s === 'live'
                    ? 'border-volt-line bg-volt-tint text-volt-ink'
                    : 'border-line bg-paper text-ink-2'
                )}
              >
                {s}
              </span>
              {i < states.length - 1 && (
                <ArrowRight size={13} className="text-muted-2" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
      <ChatStack className="max-w-none">
        <ChatBubble role="operator">
          Priya here, taking over. I can see you are on the 40 seat question.
        </ChatBubble>
        <ChatBubble role="visitor">Great, no need to repeat myself then.</ChatBubble>
      </ChatStack>
    </div>
  );
}

const FLOW_NODES = [
  { label: 'chat', icon: '💬' },
  { label: 'score', icon: '◐' },
  { label: 'webhook', icon: '↗' },
  { label: 'your CRM', icon: '▤' },
];

/** Integrations: where a qualified lead goes, and the retry ladder behind it. */
export function WebhookVisual({ retries }: { retries: string[] }) {
  return (
    <div className="rounded-[var(--r-4)] border border-line bg-canvas p-6 shadow-[var(--e-1)]">
      <DataFlowLine className="max-w-none" nodes={FLOW_NODES} />

      {/* DataFlowLine puts each node's label in a `title` attribute only, so on
          its own the row is four glyphs a reader has to guess at. This mirrors
          the component's geometry exactly (a `w-11` node, then a `flex-1`
          connector, and no connector after the last) so each label lands under
          its own node. */}
      <div className="mt-2 flex items-start gap-3 px-6">
        {FLOW_NODES.map((n, i) => (
          <div key={n.label} className="flex items-center gap-3 last:flex-none flex-1">
            <span className="type-mono-sm text-muted w-11 shrink-0 text-center">
              {n.label}
            </span>
            {i < FLOW_NODES.length - 1 && <span className="flex-1" aria-hidden />}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="type-mono-sm text-muted mb-3">If your endpoint is down, we retry</div>
        <ol className="flex flex-wrap items-center gap-2">
          {retries.map((r, i) => (
            <li key={r} className="flex items-center gap-2">
              <span className="rounded-[var(--r-1)] border border-line bg-paper px-2.5 py-1 font-mono text-[12px] text-ink-2">
                {r}
              </span>
              {i < retries.length - 1 && (
                <span className="text-muted-2" aria-hidden>
                  ·
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Setup: the whole install, which is the point. */
export function InstallVisual() {
  return (
    <TerminalCard title="index.html" showCursor={false}>
      <TermCmt>{'// paste once, before the closing body tag'}</TermCmt>
      <div className="mt-2 break-all text-white/80">
        {'<script src="cdn.oyechats.com/oyechats-widget.js" data-bot-key="bot-6a42…"></script>'}
      </div>
      <div className="mt-4 text-white/60">
        loader <TermS>3KB</TermS> gzipped · chat app loads on first open
      </div>
    </TerminalCard>
  );
}

/**
 * Pricing shape. Deliberately not a chart: plotting cost curves would need
 * their numbers, which this page does not publish. It shows what each model
 * bills FOR instead, which is the actual difference and needs no figures.
 *
 * The units are drawn as icons rather than bare filled bars. Four grey
 * rectangles in a row read as a loading skeleton, not as a diagram, and a
 * pricing section is the last place on the page that should look unfinished.
 */
export function PricingShapeVisual() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ShapePanel
        who="Zoho SalesIQ"
        heading="Per operator"
        Icon={User}
        units={[true, true, true, true]}
        unitLabel="Seats billed"
        note="Every teammate who logs in is a billed seat."
        body="Your bill moves when someone joins the team."
        tone="them"
      />
      <ShapePanel
        who="OyeChats"
        heading="Per conversation"
        Icon={MessageSquare}
        units={[true, true, true, false]}
        unitLabel="Credits used this month"
        note="Seats come with the plan. One AI reply is one credit."
        body="Your bill moves when visitors talk to the agent."
        tone="oye"
      />
    </div>
  );
}

function ShapePanel({
  who,
  heading,
  Icon,
  units,
  unitLabel,
  note,
  body,
  tone,
}: {
  who: string;
  heading: string;
  Icon: typeof User;
  units: boolean[];
  unitLabel: string;
  note: string;
  body: string;
  tone: 'oye' | 'them';
}) {
  const isOye = tone === 'oye';
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-[var(--r-3)] border bg-canvas p-5',
        isOye ? 'border-volt/30' : 'border-line'
      )}
    >
      <div className="type-mono-sm text-muted">{who}</div>
      <h3 className="type-heading-3 text-ink mt-1">{heading}</h3>

      <div className="mt-5 flex gap-2" aria-hidden>
        {units.map((filled, i) => (
          <span
            key={i}
            className={cn(
              'flex h-10 flex-1 items-center justify-center rounded-[var(--r-2)] border',
              filled
                ? isOye
                  ? 'border-volt-line bg-volt-tint text-volt-ink'
                  : 'border-line-2 bg-paper text-ink'
                : 'border-dashed border-line bg-paper text-muted-2'
            )}
          >
            <Icon size={16} strokeWidth={filled ? 2 : 1.5} />
          </span>
        ))}
      </div>
      <div className="type-mono-sm text-muted mt-2.5">{unitLabel}</div>

      <p className="type-body-sm text-ink-2 mt-4">{body}</p>
      <p className="type-body-sm text-muted mt-auto pt-3">{note}</p>
    </div>
  );
}

/** A labelled figure wrapper, so every visual carries a caption for context. */
export function Figure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="m-0">
      {children}
      {/* Deliberately `type-body-sm`, not the mono eyebrow style used elsewhere:
          `type-mono-sm` uppercases, and a full sentence set in caps is a wall.
          Eyebrows are two words, captions are not. */}
      <figcaption className="type-body-sm text-muted mt-3">{caption}</figcaption>
    </figure>
  );
}

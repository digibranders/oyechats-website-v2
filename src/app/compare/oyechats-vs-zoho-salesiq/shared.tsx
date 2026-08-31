import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Minus, Scale } from 'lucide-react';
import { ID, abs, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import {
  Accordion,
  Button,
  Callout,
  Card,
  Chip,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Reveal,
  Table,
  Td,
  Th,
} from '@/components/ds';
import { CompareTable } from '@/components/site/CompareTable';
import { ScrollSpyToc } from '@/components/site/ScrollSpyToc';
import { COMPETITORS, getCompetitor } from '@/lib/compare';
import { EXTRA_SEAT_PRICE, PRICING_TIERS, formatPrice, type Currency } from '@/lib/pricing';
import { APP_LINKS } from '@/lib/site';
import { cn } from '@/lib/cn';
import {
  CHOOSE_OYE,
  CHOOSE_ZOHO,
  DEEP_DIVES,
  FAQS,
  FRAMEWORKS,
  META_DESCRIPTION,
  META_TITLE,
  MIGRATION_STEPS,
  RETRY_LADDER,
  SECTIONS,
  THESIS,
  TIERS,
  WHAT_THEY_ARE,
  ZOHO_PATH,
  ZOHO_SLUG,
  type DeepDive,
  type Verdict,
} from './content';
import {
  Figure,
  GroundedAnswerVisual,
  HandoffVisual,
  InstallVisual,
  PricingShapeVisual,
  QualificationVisual,
  TallyBar,
  VersusPanel,
  WebhookVisual,
  tallyEdges,
} from './visuals';

/**
 * The dedicated OyeChats vs Zoho SalesIQ page, the one comparison that gets a
 * bespoke layout instead of the shared `/compare/[slug]` template.
 *
 * Why this one: Zoho is an Indian company with overwhelming mindshare among
 * Indian SMBs, which is our primary ICP. For a large share of our target
 * buyers SalesIQ is not a rival they might evaluate, it is the tool they
 * already pay for. Every other comparison page is a keyword play; this is the
 * actual sales objection, and it earns the depth.
 *
 * On layout: a comparison is long, and a long page of stacked cards reads as a
 * document nobody finishes. So the rhythm alternates deliberately. A hero with
 * the thesis drawn rather than only stated, a scannable verdict, the matrix,
 * then five deep dives in a two-column split that flips side each time, each
 * carrying a figure that shows the claim beside it. The honest section runs
 * full-bleed on the inverted tone, which is the strongest visual beat on the
 * page and is spent on the part where we say where SalesIQ wins. A sticky pill
 * nav keeps a buyer who came for pricing two clicks from it.
 *
 * Every figure lives in `./visuals.tsx` and illustrates a claim already in the
 * prose. None introduces one: a screenshot-shaped mock implying a capability we
 * have not shipped is a claim, whatever it looks like.
 *
 * This route shadows the `[slug]` dynamic segment, which is why
 * `generateStaticParams` there filters this slug out: two routes resolving to
 * one path is a build error, not a silent precedence rule. The competitor entry
 * itself stays in `@/lib/compare` because the hub, the cross-links and the
 * feature matrix on this very page all read from it.
 *
 * It renders prices, so it follows the `/pricing` pattern exactly: this shared
 * component takes a `currency`, `/compare/oyechats-vs-zoho-salesiq` renders USD,
 * `/in/compare/oyechats-vs-zoho-salesiq` renders INR, and `src/proxy.ts` rewrites
 * Indian traffic to the twin. Both declare the canonical path below.
 *
 * All content lives in `./content.ts`, derived from
 * `oye-chats-platform/docs/competitive/oyechats-vs-zoho-salesiq.md`. Read the
 * claim rules at the top of that file before editing any wording here.
 */

export const zohoCompareMetadata: Metadata = pageMeta({
  title: META_TITLE,
  description: META_DESCRIPTION,
  path: ZOHO_PATH,
});

const graph = buildGraph({
  path: ZOHO_PATH,
  name: 'OyeChats vs Zoho SalesIQ',
  description: META_DESCRIPTION,
  crumbs: [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'vs Zoho SalesIQ' },
  ],
  nodes: [
    {
      '@type': 'FAQPage',
      '@id': `${abs(ZOHO_PATH)}#faq`,
      isPartOf: { '@id': ID.webPage(ZOHO_PATH) },
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
});

export function ZohoComparisonRoute({ currency }: { currency: Currency }): React.ReactElement {
  // The matrix and its tally are read from the shared competitor entry rather
  // than copied, so this page and the /compare hub cannot drift apart, and a
  // re-judged row updates the headline count on its own.
  const competitor = getCompetitor(ZOHO_SLUG);
  const tally = tallyEdges(competitor);
  const others = COMPETITORS.filter((c) => c.slug !== ZOHO_SLUG).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-paper">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-14 md:pt-20 md:pb-20">
          <nav aria-label="Breadcrumb" className="type-mono-sm text-muted mb-6">
            <Link href="/compare" className="transition-colors hover:text-ink">
              Compare
            </Link>
            <span className="mx-2 text-muted-2">/</span>
            <span className="text-ink-2">vs Zoho SalesIQ</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Chip variant="soft" pill className="mb-5">
                Zoho SalesIQ alternative
              </Chip>
              <h1 className="type-display-2 text-ink">
                OyeChats <span className="text-muted">vs</span>{' '}
                <GradientText>Zoho SalesIQ</GradientText>
              </h1>
              <p className="type-body-lg text-ink-2 mt-6">{THESIS}</p>
              <p className="type-body text-ink-2 mt-4">
                Both products answer visitor questions and both put a human in the chat. They
                disagree about which of those is the default. Here is where each one genuinely
                leads, including the rows where SalesIQ wins.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={APP_LINKS.register} external variant="volt" size="lg">
                  Start free
                </Button>
                <Button href="#verdict" variant="ghost" size="lg">
                  Skip to the short answer
                  <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </div>
            </div>

            <Reveal delay={120}>
              <VersusPanel tally={tally} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Sticky section nav. Same treatment as /features: the page is long on
          purpose, so nobody should have to scroll to find the pricing. */}
      <div className="sticky top-16 z-30 border-y border-line bg-canvas/90 backdrop-blur-md">
        <Container>
          <ScrollSpyToc variant="pills" className="py-4" offsetTop={140} items={SECTIONS} />
        </Container>
      </div>

      {/* ═══════════════ THE SHORT ANSWER ═══════════════ */}
      <section id="verdict" className="scroll-mt-36 border-t border-line bg-canvas py-16 md:py-20">
        <Container>
          <Reveal className="mb-8 max-w-2xl">
            <Eyebrow>The short answer</Eyebrow>
            <h2 className="type-display-3 text-ink">
              Which one is right for <GradientText>your team</GradientText>
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <VerdictCard verdict={CHOOSE_OYE} tone="oye" monogram="O" />
            </Reveal>
            <Reveal delay={80}>
              <VerdictCard verdict={CHOOSE_ZOHO} tone="them" monogram="Z" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ═══════════════ WHAT EACH ONE IS ═══════════════ */}
      <section className="border-t border-line bg-paper py-16 md:py-20">
        <Container>
          <Reveal className="mb-8 max-w-2xl">
            <h2 className="type-display-3 text-ink mb-3">What each product actually is</h2>
            <p className="type-body text-ink-2">
              Before the feature grid, the category. Most of the differences further down follow
              from these two paragraphs.
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { ...WHAT_THEY_ARE.oye, monogram: 'O', tone: 'oye' as const },
              { ...WHAT_THEY_ARE.zoho, monogram: 'Z', tone: 'them' as const },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <Card padding="lg" className="h-full">
                  <div className="flex items-center gap-3">
                    <Monogram letter={p.monogram} tone={p.tone} />
                    <div>
                      <h3 className="type-heading-3 text-ink">{p.name}</h3>
                      <div className="type-mono-sm text-muted mt-0.5">{p.category}</div>
                    </div>
                  </div>
                  <p className="type-body text-ink-2 mt-5">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ MATRIX ═══════════════ */}
      <section id="matrix" className="scroll-mt-36 border-t border-line bg-canvas py-16 md:py-20">
        <Container>
          <div className="mb-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <Reveal>
              <Eyebrow>Feature by feature</Eyebrow>
              <h2 className="type-display-3 text-ink mb-3">The comparison at a glance</h2>
              <p className="type-body text-ink-2">
                The check marks the tool with the edge on each row. Two of the eight go to
                SalesIQ, and they are two of the rows buyers care most about.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-[var(--r-3)] border border-line bg-paper p-5">
                <div className="type-mono-sm text-muted mb-3">
                  {tally.total} rows, scored honestly
                </div>
                <TallyBar tally={tally} />
              </div>
            </Reveal>
          </div>
          {competitor && (
            <Reveal>
              <CompareTable competitor={competitor} />
            </Reveal>
          )}
        </Container>
      </section>

      {/* ═══════════════ DEEP DIVES ═══════════════ */}
      <section
        id="differences"
        className="scroll-mt-36 border-t border-line bg-paper py-16 md:py-20"
      >
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow>In detail</Eyebrow>
            <h2 className="type-display-3 text-ink mb-3">
              Where the two genuinely <GradientText>differ</GradientText>
            </h2>
            <p className="type-body text-ink-2">
              Five axes. What we do, what SalesIQ does, and the fair reading of the two.
            </p>
          </Reveal>

          <div className="space-y-16 md:space-y-24">
            {DEEP_DIVES.map((dive, i) => (
              <DeepDiveBlock key={dive.id} dive={dive} flipped={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ FRAMEWORKS ═══════════════ */}
      <section
        id="frameworks"
        className="scroll-mt-36 border-t border-line bg-canvas py-16 md:py-20"
      >
        <Container>
          <Reveal className="mb-8 max-w-2xl">
            <Eyebrow>Qualification</Eyebrow>
            <h2 className="type-display-3 text-ink mb-3">Four frameworks, chosen per agent</h2>
            <p className="type-body text-ink-2">
              Dimensions are weighted and normalised into a composite out of 100, so enabling
              fewer of them does not cap the score.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {FRAMEWORKS.map((f, i) => (
              <Reveal key={f.name} delay={i * 60}>
                <Card padding="lg" className="h-full">
                  <h3 className="font-mono text-[15px] font-semibold tracking-tight text-volt-ink">
                    {f.name}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {f.dimensions.split(' · ').map((d) => (
                      <li
                        key={d}
                        className="rounded-[var(--r-1)] border border-line bg-paper px-2.5 py-1 type-body-sm text-ink-2"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-5">
            <Callout variant="info" title="What a tier change triggers">
              Crossing into SQL sends an email to your team and fires a webhook, so a hot lead
              reaches your CRM without anyone watching a dashboard.
            </Callout>
          </Reveal>
        </Container>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="scroll-mt-36 border-t border-line bg-paper py-16 md:py-20">
        <Container>
          <Reveal className="mb-10 max-w-3xl">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="type-display-3 text-ink mb-3">Per operator vs per conversation</h2>
            <p className="type-body text-ink-2">
              Zoho SalesIQ prices per operator, with a free entry tier, a discount for paying
              annually, and its best value inside the wider Zoho suite. On headline price for a
              small team it is frequently the cheaper line item, and if you already buy the suite
              the marginal cost of adding it is small. We are not going to pretend otherwise.
            </p>
            <p className="type-body text-ink-2 mt-4">
              OyeChats prices in credits, where one AI reply is one credit, with operator seats
              included on each plan. The difference is not the number, it is the shape: our bill
              tracks how much your visitors talk to the agent, not how many people on your team
              can log in.
            </p>
          </Reveal>

          <Reveal className="mb-10">
            <PricingShapeVisual />
          </Reveal>

          {/* The table runs full width rather than sharing a grid row with the
              notes. Table carries `min-w-[640px]` inside its scroller, and in a
              narrower track that clipped the Seats column on a 1440px desktop
              with no hint it scrolled. Notes go underneath, where they read as
              footnotes to the numbers anyway. */}
          <div className="min-w-0">
            <Reveal>
              <h3 className="type-heading-2 text-ink mb-4">What OyeChats costs</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Plan</Th>
                    <Th align="right">Per month</Th>
                    <Th align="right">Credits</Th>
                    <Th align="right">Seats</Th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_TIERS.map((t) => (
                    <tr key={t.id}>
                      <Th scope="row">
                        <span className="type-body font-medium normal-case tracking-normal text-ink">
                          {t.name}
                        </span>
                      </Th>
                      {/* `monthly` is nullable on PricingTier so a quote-only tier
                          can be added without a number; render that as Custom
                          rather than assuming every tier is self-serve priced. */}
                      <Td num>
                        {t.monthly === null ? 'Custom' : formatPrice(t.monthly[currency], currency)}
                      </Td>
                      <Td num>{t.credits === null ? 'Custom' : t.credits.toLocaleString()}</Td>
                      <Td num>{t.includedSeats}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Reveal>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <Reveal delay={40}>
              <Callout variant="info" title="Extra seats">
                {formatPrice(EXTRA_SEAT_PRICE[currency], currency)} per operator per month, added
                or removed in one click. Paying annually saves about 20%.
              </Callout>
            </Reveal>
            <Reveal delay={80}>
              <Callout variant="info" title={currency === 'INR' ? 'GST' : 'Tax'}>
                {currency === 'INR'
                  ? 'Prices are exclusive of GST, which is added at checkout. If you are comparing against a quote that already includes tax, compare the post-tax figures.'
                  : 'Sales to customers outside India are an export of services, so no Indian GST is added. The listed price is the full charge.'}
              </Callout>
            </Reveal>
            <Reveal delay={120}>
              <Callout variant="warn" title="Check both, always">
                We do not publish Zoho SalesIQ&rsquo;s prices here, because a rival&rsquo;s figure
                copied onto our site goes stale without warning and then misleads you. Read their
                current pricing page next to ours before you decide.
              </Callout>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ═══════════════ WHEN ZOHO WINS ═══════════════
          The inverted tone is the loudest beat on the page and it is spent
          here, on the section where we say a rival is the better buy. That is
          the point: a comparison a reader trusts is one that visibly does not
          bury its own losses. */}
      <section
        id="when-zoho"
        className="relative scroll-mt-36 overflow-hidden bg-ink-invert py-20 text-ink-invert-fg md:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--r-3)] border border-white/15 bg-white/5">
                  <Scale size={18} />
                </span>
                <div className="type-mono-sm text-ink-invert-muted">The honest bit</div>
              </div>
              <h2 className="type-display-3 text-ink-invert-fg">
                When Zoho SalesIQ is the better choice
              </h2>
              <p className="type-body-lg text-ink-invert-muted mt-6">
                If your CRM is Zoho CRM and your helpdesk is Zoho Desk, SalesIQ plugs into both
                natively in a way no third-party tool can match. Your chats land next to your
                deals with no webhook plumbing, your team is already inside the suite, and the
                marginal cost of adding chat is small.
              </p>
            </Reveal>

            <Reveal delay={100} className="lg:pt-12">
              <ul className="space-y-4">
                {[
                  'You want a mature human live chat product first, and would rather grow into the AI layer than start there.',
                  'You want CRM, helpdesk, books, campaigns and chat on one bill. That is the whole proposition of Zoho One, and we are one focused product, not a suite.',
                  'Your team already lives in Zoho, so the tool nobody has to be trained on is worth more than any feature row above.',
                ].map((point) => (
                  <li
                    key={point}
                    className="type-body flex gap-3 rounded-[var(--r-3)] border border-white/10 bg-white/[0.04] p-5 text-ink-invert-muted"
                  >
                    <Check size={17} className="mt-0.5 shrink-0 text-volt" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="type-body text-ink-invert-muted mt-6">
                Where OyeChats is built to win is the other case: you are not standardised on
                Zoho, you want an agent answering from your own content on day one, and you want
                sales to receive a scored, ranked lead rather than a transcript to read.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ═══════════════ SWITCHING ═══════════════ */}
      <section
        id="switching"
        className="scroll-mt-36 border-t border-line bg-canvas py-16 md:py-20"
      >
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow>Switching</Eyebrow>
            <h2 className="type-display-3 text-ink mb-3">You do not have to cut over</h2>
            <p className="type-body text-ink-2">
              Both products are a script tag, so the honest way to choose is to run them side by
              side for a week and read the transcripts.
            </p>
          </Reveal>

          {/* A rail rather than four loose cards: the steps are sequential and
              the connecting line is what says so without a word of copy. */}
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MIGRATION_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="relative list-none">
                  {/* One connector per step rather than a single rail behind the
                      row: a full-width line runs from the first circle's left
                      edge and overshoots past the last, which reads as a stray
                      rule. This spans circle to circle and stops at the fourth.
                      `-right-6` matches the grid's `gap-6`. */}
                  {i < MIGRATION_STEPS.length - 1 && (
                    <span
                      className="absolute -right-6 left-12 top-5 hidden h-px bg-line lg:block"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[12px] font-semibold text-volt-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="type-heading-3 text-ink mt-5">{step.title}</h3>
                  <p className="type-body-sm text-ink-2 mt-2">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="scroll-mt-36 border-t border-line bg-paper py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-32">
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="type-display-3 text-ink">
                  Questions buyers <GradientText>actually ask</GradientText>
                </h2>
                <p className="type-body text-ink-2 mt-5">
                  Still deciding? Every plan starts free, so the cheapest answer is usually to
                  run it on one page and look at the transcripts.
                </p>
                <Button href={APP_LINKS.register} external variant="ghost" className="mt-6">
                  Start free
                  <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <Accordion items={FAQS} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ═══════════════ OTHER COMPARISONS ═══════════════ */}
      <section className="border-t border-line bg-canvas py-16 md:py-20">
        <Container>
          <Reveal className="mb-8">
            <h2 className="type-heading-2 text-ink">Compare with other tools</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 60}>
                <Link href={`/compare/${o.slug}`} className="group block h-full">
                  <Card padding="md" className="h-full">
                    <h3 className="type-heading-3 leading-tight text-ink">
                      OyeChats vs {o.name}
                    </h3>
                    <div className="type-mono-sm text-muted mt-1">{o.category}</div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-volt-ink">
                      Read
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="border-t border-line bg-paper py-24">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="type-display-3 text-ink mb-5">
              Run it on your own site <GradientText>this week</GradientText>
            </h2>
            <p className="type-body-lg text-ink-2 mx-auto mb-8 max-w-xl">
              Add your content, paste one script tag, and read the transcripts next to the ones
              you already have. The Free plan does not ask for a card.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href={APP_LINKS.register} external variant="volt" size="lg">
                Start free
              </Button>
              <Button href="/compare" variant="ghost" size="lg">
                All comparisons
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

/** Section eyebrow, matching the rule-and-label pattern the DS Section uses. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="type-mono-sm text-muted mb-4 flex items-center gap-2">
      <span className="h-px w-6 bg-volt" />
      <span>{children}</span>
    </div>
  );
}

function Monogram({ letter, tone }: { letter: string; tone: 'oye' | 'them' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--r-2)] border font-display font-semibold',
        tone === 'oye'
          ? 'border-volt-line bg-volt-tint text-volt-ink'
          : 'border-line bg-paper text-ink'
      )}
    >
      {letter}
    </span>
  );
}

/** One side of the up-front decision box. */
function VerdictCard({
  verdict,
  tone,
  monogram,
}: {
  verdict: Verdict;
  tone: 'oye' | 'them';
  monogram: string;
}) {
  const isOye = tone === 'oye';
  return (
    <Card padding="lg" className={cn('h-full', isOye && 'border-volt/30')}>
      <div className="flex items-center gap-3">
        <Monogram letter={monogram} tone={tone} />
        <h3 className="type-heading-3 text-ink">{verdict.heading}</h3>
      </div>
      <p className="type-body text-ink-2 mt-4">{verdict.lead}</p>
      <ul className="mt-5 space-y-3">
        {verdict.points.map((point) => (
          <li key={point} className="type-body flex gap-2.5 text-ink-2">
            <Check
              size={17}
              className={cn('mt-0.5 shrink-0', isOye ? 'text-volt' : 'text-muted')}
              aria-hidden
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const EDGE_LABEL: Record<DeepDive['edge'], string> = {
  oye: 'Edge: OyeChats',
  them: 'Edge: Zoho SalesIQ',
  tie: 'Roughly even',
};

/** Picks the figure for a dive. Keyed rather than passed so `content.ts` stays
 *  free of JSX and can be read as plain content by anyone editing copy. */
function DiveFigure({ dive }: { dive: DeepDive }) {
  switch (dive.visual) {
    case 'answers':
      return <GroundedAnswerVisual />;
    case 'qualification':
      return <QualificationVisual tiers={TIERS} />;
    case 'handoff':
      return <HandoffVisual />;
    case 'webhooks':
      return <WebhookVisual retries={RETRY_LADDER} />;
    case 'install':
      return <InstallVisual />;
  }
}

/**
 * One deep-dive axis. Copy on one side, figure on the other, sides swapping
 * each time down the page so five of these in a row do not read as five
 * identical cards.
 */
function DeepDiveBlock({ dive, flipped }: { dive: DeepDive; flipped: boolean }) {
  return (
    <article id={dive.id} className="scroll-mt-36">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(flipped && 'lg:order-2')}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="type-mono-sm text-volt-ink">{dive.eyebrow}</span>
            <Chip variant={dive.edge === 'oye' ? 'soft' : 'outline'} pill>
              {dive.edge === 'tie' && <Minus size={12} aria-hidden />}
              {EDGE_LABEL[dive.edge]}
            </Chip>
          </div>
          <h3 className="type-heading-1 text-ink mt-3">{dive.heading}</h3>

          <div className="mt-6 space-y-5">
            <div className="border-l-2 border-volt pl-4">
              <div className="type-mono-sm text-volt-ink mb-1.5">OyeChats</div>
              <p className="type-body text-ink-2">{dive.oye}</p>
            </div>
            <div className="border-l-2 border-line-2 pl-4">
              <div className="type-mono-sm text-muted mb-1.5">Zoho SalesIQ</div>
              <p className="type-body text-ink-2">{dive.zoho}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[var(--r-3)] border border-line bg-canvas p-5">
            <div className="type-mono-sm text-muted mb-2">The fair reading</div>
            <p className="type-body text-ink">{dive.verdict}</p>
          </div>
        </Reveal>

        <Reveal delay={100} className={cn(flipped && 'lg:order-1')}>
          <Figure caption={dive.visualCaption}>
            <DiveFigure dive={dive} />
          </Figure>
        </Reveal>
      </div>
    </article>
  );
}

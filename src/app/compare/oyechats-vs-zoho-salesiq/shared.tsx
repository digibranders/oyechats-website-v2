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
import { COMPETITORS, getCompetitor } from '@/lib/compare';
import { EXTRA_SEAT_PRICE, PRICING_TIERS, formatPrice, type Currency } from '@/lib/pricing';
import { APP_LINKS } from '@/lib/site';
import {
  CHOOSE_OYE,
  CHOOSE_ZOHO,
  DEEP_DIVES,
  FAQS,
  FRAMEWORKS,
  META_DESCRIPTION,
  META_TITLE,
  MIGRATION_STEPS,
  THESIS,
  WHAT_THEY_ARE,
  ZOHO_PATH,
  ZOHO_SLUG,
  type DeepDive,
  type Verdict,
} from './content';

/**
 * The dedicated OyeChats vs Zoho SalesIQ page — the one comparison that gets a
 * bespoke layout instead of the shared `/compare/[slug]` template.
 *
 * Why this one: Zoho is an Indian company with overwhelming mindshare among
 * Indian SMBs, which is our primary ICP. For a large share of our target
 * buyers SalesIQ is not a rival they might evaluate, it is the tool they
 * already pay for. Every other comparison page is a keyword play; this is the
 * actual sales objection, and it earns the depth.
 *
 * This route shadows the `[slug]` dynamic segment, which is why
 * `generateStaticParams` there filters this slug out — two routes resolving to
 * one path is a build error, not a silent precedence rule. The competitor entry
 * itself stays in `@/lib/compare` because the hub, the cross-links and the
 * feature matrix on this very page all read from it.
 *
 * It renders prices, so it follows the `/pricing` pattern exactly: this shared
 * component takes a `currency`, `/compare/oyechats-vs-zoho-salesiq` renders USD,
 * `/in/compare/oyechats-vs-zoho-salesiq` renders INR, and `src/proxy.ts` rewrites
 * Indian traffic to the twin. Both declare the canonical path below.
 *
 * All content lives in `./content.ts`, which is derived from
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
  // The matrix is rendered from the shared competitor entry rather than a copy,
  // so this page and the /compare hub can never drift apart on the same facts.
  const competitor = getCompetitor(ZOHO_SLUG);
  const others = COMPETITORS.filter((c) => c.slug !== ZOHO_SLUG).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      {/* Hero */}
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-14 md:pt-20 md:pb-16">
          <nav aria-label="Breadcrumb" className="type-mono-sm text-muted mb-6">
            <Link href="/compare" className="hover:text-ink transition-colors">
              Compare
            </Link>
            <span className="mx-2 text-muted-2">/</span>
            <span className="text-ink-2">vs Zoho SalesIQ</span>
          </nav>

          <div className="max-w-3xl">
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
              disagree about which of those is the default. This page walks through where each
              one genuinely leads, including the rows where SalesIQ wins.
            </p>
            <div className="mt-9 flex gap-3 flex-wrap">
              <Button href={APP_LINKS.register} external variant="volt" size="lg">
                Start free →
              </Button>
              <Button href="#verdict" variant="ghost" size="lg">
                Skip to the short answer
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* The short answer, up front */}
      <section id="verdict" className="py-16 md:py-20 bg-canvas border-t border-line scroll-mt-20">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-volt" />
              <span>The short answer</span>
            </div>
            <h2 className="type-display-3 text-ink">
              Which one is right for <GradientText>your team</GradientText>
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <VerdictCard verdict={CHOOSE_OYE} tone="oye" monogram="O" />
            </Reveal>
            <Reveal>
              <VerdictCard verdict={CHOOSE_ZOHO} tone="them" monogram="Z" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* What each product actually is */}
      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <h2 className="type-display-3 text-ink mb-3">What each product actually is</h2>
            <p className="type-body text-ink-2">
              Before the feature grid, the category. Most of the differences further down follow
              from these two sentences.
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {[WHAT_THEY_ARE.oye, WHAT_THEY_ARE.zoho].map((p) => (
              <Reveal key={p.name}>
                <Card padding="lg" className="h-full">
                  <div className="type-heading-3 text-ink">{p.name}</div>
                  <div className="type-mono-sm text-muted mt-1">{p.category}</div>
                  <p className="type-body text-ink-2 mt-4">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Feature matrix */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-volt" />
              <span>Feature by feature</span>
            </div>
            <h2 className="type-display-3 text-ink mb-3">The comparison at a glance</h2>
            <p className="type-body text-ink-2">
              The check marks the tool with the edge on each row. Two rows go to SalesIQ, and
              they are two of the rows buyers care most about.
            </p>
          </Reveal>
          {competitor && (
            <Reveal>
              <CompareTable competitor={competitor} />
            </Reveal>
          )}
        </Container>
      </section>

      {/* Deep dives */}
      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-10">
            <h2 className="type-display-3 text-ink mb-3">
              Where the two genuinely <GradientText>differ</GradientText>
            </h2>
            <p className="type-body text-ink-2">
              Five axes, each with what we do, what SalesIQ does, and the fair reading of the
              two.
            </p>
          </Reveal>

          <div className="space-y-5">
            {DEEP_DIVES.map((d) => (
              <Reveal key={d.id}>
                <div id={d.id} className="scroll-mt-24">
                  <DeepDiveBlock dive={d} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* The frameworks table belongs to the qualification dive above. */}
          <Reveal className="mt-10">
            <h3 className="type-heading-2 text-ink mb-2">The four qualification frameworks</h3>
            <p className="type-body text-ink-2 mb-5 max-w-2xl">
              Chosen per agent. Scores are weighted per dimension and normalised into a composite
              out of 100, so enabling fewer dimensions does not cap the score.
            </p>
            <Table>
              <thead>
                <tr>
                  <Th>Framework</Th>
                  <Th>Dimensions scored</Th>
                </tr>
              </thead>
              <tbody>
                {FRAMEWORKS.map((f) => (
                  <tr key={f.name}>
                    <Td>
                      <span className="font-medium text-ink whitespace-nowrap">{f.name}</span>
                    </Td>
                    <Td>{f.dimensions}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-5">
              <Callout variant="info" title="Tiers">
                A composite score maps to a tier: MQL at 30, SAL at 55, SQL at 75. Crossing into
                SQL sends an email to your team and fires a webhook, so a hot lead reaches your
                CRM without anyone watching a dashboard.
              </Callout>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Pricing shape */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <div className="type-mono-sm text-muted mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-volt" />
              <span>Pricing</span>
            </div>
            <h2 className="type-display-3 text-ink mb-3">Per operator vs per conversation</h2>
            <p className="type-body text-ink-2">
              Zoho SalesIQ prices per operator, with a free entry tier, a discount for paying
              annually, and its best value inside the wider Zoho suite. On headline price for a
              small team it is frequently the cheaper line item, and if you already buy the suite
              the marginal cost of adding it is small. We are not going to pretend otherwise.
            </p>
            <p className="type-body text-ink-2 mt-4">
              OyeChats prices in credits, where one AI reply is one credit, with operator seats
              included on each plan. The practical difference is not the number, it is the shape:
              our bill tracks how much your visitors talk to the agent, not how many people on
              your team can log in.
            </p>
          </Reveal>

          <Reveal>
            <Table>
              <thead>
                <tr>
                  <Th>OyeChats plan</Th>
                  <Th align="right">Per month</Th>
                  <Th align="right">Credits</Th>
                  <Th align="right">Seats</Th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TIERS.map((t) => (
                  <tr key={t.id}>
                    <Td>
                      <span className="font-medium text-ink">{t.name}</span>
                    </Td>
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

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Callout variant="info" title="Extra seats">
              {formatPrice(EXTRA_SEAT_PRICE[currency], currency)} per operator per month, added or
              removed in one click. Paying annually saves about 20%.
            </Callout>
            <Callout variant="info" title={currency === 'INR' ? 'GST' : 'Tax'}>
              {currency === 'INR'
                ? 'Prices are exclusive of GST, which is added at checkout. If you are comparing against a quote that already includes tax, compare the post-tax figures.'
                : 'Sales to customers outside India are an export of services, so no Indian GST is added. The listed price is the full charge.'}
            </Callout>
          </div>

          <div className="mt-5">
            <Callout variant="warn" title="Check both, always">
              We do not publish Zoho SalesIQ&rsquo;s prices here, because a rival&rsquo;s figure
              copied onto our site goes stale without warning and then misleads you. Read their
              current pricing page next to ours before you decide.
            </Callout>
          </div>
        </Container>
      </section>

      {/* When SalesIQ wins — prominent, not buried */}
      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--r-3)] bg-canvas border border-line text-ink">
                <Scale size={18} />
              </span>
              <h2 className="type-display-3 text-ink">When Zoho SalesIQ is the better choice</h2>
            </div>
            <p className="type-body-lg text-ink-2">
              If your CRM is Zoho CRM and your helpdesk is Zoho Desk, SalesIQ plugs into both
              natively in a way no third-party tool can match. Your chats land next to your deals
              with no webhook plumbing, your team is already inside the suite, and the marginal
              cost of adding chat is small.
            </p>
            <p className="type-body text-ink-2 mt-4">
              It is also the better buy if what you need first is a mature human live chat product
              with deep visitor tracking, and you would rather grow into the AI layer than start
              there. And if you want CRM, helpdesk, books, campaigns and chat on one bill, that is
              Zoho One&rsquo;s whole proposition. We are one focused product, not a suite.
            </p>
            <p className="type-body text-ink-2 mt-4">
              Where OyeChats is built to win is the other case: you are not standardised on Zoho,
              you want an agent answering from your own content on day one, and you want sales to
              receive a scored, ranked lead rather than a transcript to read.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Switching */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <h2 className="type-display-3 text-ink mb-3">What switching actually involves</h2>
            <p className="type-body text-ink-2">
              You do not have to cut over. Both products are a script tag, so the honest way to
              choose is to run them side by side for a week and read the transcripts.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {MIGRATION_STEPS.map((step, i) => (
              <Reveal key={step.title}>
                <Card padding="lg" className="h-full">
                  <div className="type-mono-sm text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="type-heading-3 text-ink mt-2">{step.title}</div>
                  <p className="type-body text-ink-2 mt-3">{step.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-paper border-t border-line">
        <Container>
          <Reveal className="max-w-2xl mb-8">
            <h2 className="type-display-3 text-ink">
              OyeChats vs Zoho SalesIQ: <GradientText>FAQ</GradientText>
            </h2>
          </Reveal>
          <div className="max-w-3xl">
            <Accordion items={FAQS} />
          </div>
        </Container>
      </section>

      {/* Other comparisons */}
      <section className="py-16 md:py-20 bg-canvas border-t border-line">
        <Container>
          <Reveal className="mb-8">
            <h2 className="type-heading-2 text-ink">Compare with other tools</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Reveal key={o.slug}>
                <Link href={`/compare/${o.slug}`} className="group block h-full">
                  <Card padding="md" className="h-full">
                    <div className="type-heading-3 text-ink leading-tight">
                      OyeChats vs {o.name}
                    </div>
                    <div className="type-mono-sm text-muted mt-1">{o.category}</div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-volt-ink">
                      Read
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-paper py-24 border-t border-line">
        <Container>
          <Reveal className="max-w-3xl mx-auto text-center">
            <h2 className="type-display-3 text-ink mb-5">
              Run it on your own site <GradientText>this week</GradientText>
            </h2>
            <p className="type-body-lg text-ink-2 mb-8 max-w-xl mx-auto">
              Add your content, paste one script tag, and read the transcripts next to the ones
              you already have. The Free plan does not ask for a card.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
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
    <Card padding="lg" className={isOye ? 'h-full border-volt/30' : 'h-full'}>
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={
            isOye
              ? 'flex h-9 w-9 items-center justify-center rounded-[var(--r-2)] bg-volt-tint border border-volt-line font-display font-semibold text-volt-ink'
              : 'flex h-9 w-9 items-center justify-center rounded-[var(--r-2)] bg-paper border border-line font-display font-semibold text-ink'
          }
        >
          {monogram}
        </span>
        <div className="type-heading-3 text-ink">{verdict.heading}</div>
      </div>
      <p className="type-body text-ink-2 mt-4">{verdict.lead}</p>
      <ul className="mt-5 space-y-3">
        {verdict.points.map((point) => (
          <li key={point} className="flex gap-2.5 type-body text-ink-2">
            <Check
              size={17}
              className={isOye ? 'mt-0.5 shrink-0 text-volt' : 'mt-0.5 shrink-0 text-muted'}
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

/** One deep-dive axis: our side, their side, and the fair reading. */
function DeepDiveBlock({ dive }: { dive: DeepDive }) {
  return (
    <Card padding="lg" hover={false} className="scroll-mt-20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="type-mono-sm text-muted">{dive.eyebrow}</div>
        <Chip variant={dive.edge === 'oye' ? 'soft' : 'outline'} pill>
          {dive.edge === 'tie' && <Minus size={12} aria-hidden />}
          {EDGE_LABEL[dive.edge]}
        </Chip>
      </div>
      <h3 className="type-heading-2 text-ink mt-2">{dive.heading}</h3>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="type-mono-sm text-volt-ink mb-2">OyeChats</div>
          <p className="type-body text-ink-2">{dive.oye}</p>
        </div>
        <div>
          <div className="type-mono-sm text-muted mb-2">Zoho SalesIQ</div>
          <p className="type-body text-ink-2">{dive.zoho}</p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-line">
        <div className="type-mono-sm text-muted mb-2">The fair reading</div>
        <p className="type-body text-ink">{dive.verdict}</p>
      </div>
    </Card>
  );
}

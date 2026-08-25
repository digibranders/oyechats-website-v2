import { Section } from '@/components/ds';
import { CaseStudyFunnel } from './case-study/CaseStudyFunnel';
import { CaseTakeaway } from './case-study/CaseTakeaway';
import { ChallengeComparison } from './case-study/ChallengeComparison';
import { ImpactTransformations } from './case-study/ImpactTransformations';
import { MethodologyNote } from './case-study/MethodologyNote';
import { QualificationGroups } from './case-study/QualificationGroups';
import { QuotationConversion } from './case-study/QuotationConversion';
import { SalesHandoffSection } from './case-study/SalesHandoffSection';
import type { CaseSection, CaseStudy } from '@/lib/case-studies';

/**
 * Renders one `CaseSection`. Each `kind` owns a composition, so a new case
 * study composes a page out of existing modules instead of shipping bespoke
 * JSX, and a study with a different narrative can reorder or omit sections
 * without touching the route.
 *
 * Section headings are all h2 and any nested title is h3, which is what keeps
 * `verify-html` F-12 (no skipped heading level) green.
 *
 * `scroll-mt-32` (128px) clears the 64px header plus the ~49px section nav.
 */
const SCROLL_MARGIN = 'scroll-mt-32';

export function CaseSectionRenderer({
  section,
  study,
}: {
  section: CaseSection;
  study: CaseStudy;
}) {
  switch (section.kind) {
    case 'prose':
      return (
        <Section
          id={section.id}
          tone="canvas"
          eyebrow={section.eyebrow}
          heading={section.heading}
          className={SCROLL_MARGIN}
        >
          <div className="measure space-y-4">
            {section.body.map((p, i) => (
              <p key={i} className={i === 0 ? 'type-body-lg text-ink' : 'type-body text-ink-2'}>
                {p}
              </p>
            ))}
          </div>
        </Section>
      );

    case 'comparison':
      return (
        <Section
          id={section.id}
          tone="paper"
          eyebrow={section.eyebrow}
          heading={section.heading}
          sub={section.intro}
          className={SCROLL_MARGIN}
        >
          <ChallengeComparison
            rows={section.rows}
            realityLabel={section.realityLabel}
            neededLabel={section.neededLabel}
          />
          {section.close && (
            <p className="type-body-lg measure mt-10 border-l-2 border-volt pl-5 text-ink">
              {section.close}
            </p>
          )}
        </Section>
      );

    case 'qualificationGroups':
      return (
        <Section
          id={section.id}
          tone="canvas"
          eyebrow={section.eyebrow}
          heading={section.heading}
          sub={section.intro}
          className={SCROLL_MARGIN}
        >
          <QualificationGroups groups={section.groups} />
        </Section>
      );

    case 'funnel':
      return (
        <Section
          id={section.id}
          tone="paper"
          eyebrow={section.eyebrow}
          heading={section.heading}
          sub={section.intro}
          className={SCROLL_MARGIN}
        >
          <CaseStudyFunnel stages={study.funnel} />
          {section.close && (
            <p className="type-body measure mt-10 text-ink-2">{section.close}</p>
          )}
          <MethodologyNote text={study.methodology} />
        </Section>
      );

    case 'spotlight':
      return (
        <SalesHandoffSection
          id={section.id}
          eyebrow={section.eyebrow}
          heading={section.heading}
          stat={section.stat}
          body={section.body}
          itemsLabel={section.itemsLabel}
          items={section.items}
          ofTotal={study.funnel[0]?.value}
        />
      );

    case 'conversion':
      return (
        <QuotationConversion
          id={section.id}
          eyebrow={section.eyebrow}
          heading={section.heading}
          from={section.from}
          to={section.to}
          rate={section.rate}
          rateCaption={section.rateCaption}
          body={section.body}
        />
      );

    case 'impact':
      return (
        <Section
          id={section.id}
          tone="canvas"
          eyebrow={section.eyebrow}
          heading={section.heading}
          sub={section.intro}
          className={SCROLL_MARGIN}
        >
          <ImpactTransformations items={section.items} />
        </Section>
      );

    case 'takeaway':
      return (
        <CaseTakeaway
          id={section.id}
          eyebrow={section.eyebrow}
          heading={section.heading}
          conclusion={section.conclusion}
          body={section.body}
          closing={section.closing}
          endToEnd={
            study.funnel.length > 1
              ? {
                  first: study.funnel[0].value,
                  last: study.funnel[study.funnel.length - 1].value,
                }
              : undefined
          }
        />
      );
  }
}

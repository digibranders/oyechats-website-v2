import { ImageResponse } from 'next/og';
import { CASE_STUDIES, getCaseStudy } from '@/lib/case-studies';

export const alt = 'OyeChats case study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams(): { slug: string }[] {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

const PAPER = '#FAFAF7';
const INK = '#1A1A1A';
const SUBTLE = '#4A4A4A';
const VOLT = '#7C3AED';
const VOLT_LIGHT = '#A78BFA';
const LINE = '#E7E5DE';

/**
 * Social card for a case study. The card leads with the three headline metrics
 * rather than the title, so the proof survives being reshared as an image, and
 * carries a miniature of the study's own funnel down the right edge.
 */
export default async function CaseStudyOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  const category = study?.category ?? 'Case study';
  const title = study?.title ?? 'Proof, with the attrition left in';
  const metrics = study?.headline ?? [];
  const stages = study?.funnel.slice(0, 6) ?? [];
  const top = stages[0]?.value || 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: PAPER,
          padding: '76px 90px',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* Funnel miniature, pinned to the right edge */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 150,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            opacity: 0.9,
          }}
        >
          {stages.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                height: 26,
                width: Math.max((s.value / top) * 260, 16),
                borderRadius: '4px 0 0 4px',
                backgroundColor: VOLT,
                opacity: 0.18 + (s.value / top) * 0.72,
              }}
            />
          ))}
        </div>

        {/* Brand + category */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 30,
            fontWeight: 600,
            color: INK,
            letterSpacing: '-0.02em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: VOLT }}>Oye</span>
            <span>Chats</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 600,
              color: VOLT,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Case study / {category}
          </div>
        </div>

        {/* Headline metrics */}
        <div style={{ display: 'flex', gap: 64, marginTop: 8 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 78,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1,
                  letterSpacing: '-0.045em',
                }}
              >
                {m.value.toLocaleString()}
                {m.suffix ?? ''}
              </div>
              <div style={{ display: 'flex', fontSize: 22, color: SUBTLE, marginTop: 14 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 40 : 46,
            fontWeight: 600,
            color: INK,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            maxWidth: 820,
          }}
        >
          {title}
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `2px solid ${LINE}`,
            paddingTop: 26,
          }}
        >
          <div
            style={{
              display: 'flex',
              height: 10,
              width: 180,
              borderRadius: 9999,
              backgroundColor: VOLT_LIGHT,
            }}
          />
          <div style={{ display: 'flex', fontSize: 24, color: SUBTLE }}>
            {study ? `${study.client.market} / ${study.client.period}` : 'oyechats.com'}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

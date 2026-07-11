import Link from 'next/link';
import { ReactNode } from 'react';
import { Chip, Container, MonoMark } from '@/components/ds';
import { LEGAL_PAGES } from '@/lib/legal';
import type { LegalPage } from '@/lib/legal';

/** Convert a section body into paragraphs plus contiguous "- " lines rendered as <ul>. */
function renderBody(body: string[]): ReactNode {
  const nodes: ReactNode[] = [];
  let bullets: string[] = [];

  const flush = () => {
    if (bullets.length) {
      nodes.push(
        <ul key={`ul-${nodes.length}`}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };

  body.forEach((line, i) => {
    if (line.startsWith('- ')) {
      bullets.push(line.slice(2));
    } else {
      flush();
      nodes.push(<p key={`p-${i}`}>{line}</p>);
    }
  });
  flush();
  return nodes;
}

export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <>
      <section className="bg-paper border-b border-line pt-16 pb-12 md:pt-24 md:pb-16">
        <Container>
          <MonoMark>~/oyechats · legal / {page.slug}</MonoMark>
          <h1 className="type-display-3 text-ink mt-6 max-w-3xl">{page.title}</h1>
          <p className="type-body-lg text-ink-2 mt-4 max-w-2xl">{page.description}</p>
          <div className="mt-6 flex gap-2 flex-wrap">
            <Chip variant="outline">Last updated · {page.lastUpdated}</Chip>
            <Chip variant="mono">v1.0</Chip>
          </div>
        </Container>
      </section>

      <div className="bg-canvas py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-[1fr_240px] gap-16">
            <div className="prose">
              {page.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2>{s.heading}</h2>
                  {renderBody(s.body)}
                </section>
              ))}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="type-mono-sm text-muted mb-3">On this page</div>
                <ul className="space-y-1.5">
                  {page.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="type-body-sm text-ink-2 hover:text-ink no-underline block"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-line">
                  <div className="type-mono-sm text-muted mb-3">Other policies</div>
                  <ul className="space-y-1.5">
                    {LEGAL_PAGES.filter((p) => p.slug !== page.slug).map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/legal/${p.slug}`}
                          className="type-body-sm text-ink-2 hover:text-ink no-underline block"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}

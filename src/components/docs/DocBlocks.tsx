import type { ReactElement } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Callout, Table, Th, Td } from '@/components/ds';
import type { DocBlock } from '@/lib/docs';
import { DocsInline } from './inline';

const METHOD_STYLE: Record<string, string> = {
  GET: 'bg-signal-tint text-signal border-signal/40',
  POST: 'bg-volt-tint text-volt-ink border-volt-line',
  PUT: 'bg-alert-tint text-alert border-alert/40',
  PATCH: 'bg-alert-tint text-alert border-alert/40',
  DELETE: 'bg-danger-tint text-danger border-danger/40',
};

function CodeSample({ label, code }: { label: string; code: string }): ReactElement {
  return (
    <div className="rounded-[var(--r-4)] border border-white/8 overflow-hidden bg-ink-invert">
      <div className="border-b border-white/8 px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-white/45">{label}</span>
      </div>
      {/* The pre owns the horizontal scroll so a long line can never widen the page. */}
      <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed font-mono text-white/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Block({ block }: { block: DocBlock }): ReactElement | null {
  switch (block.t) {
    case 'p':
      return (
        <p className="type-body text-ink-2 max-w-[68ch]">
          <DocsInline text={block.text} />
        </p>
      );

    case 'h3':
      return (
        <h3 className="type-heading-3 text-ink pt-2">
          <DocsInline text={block.text} />
        </h3>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={`max-w-[68ch] space-y-2 ${
            block.ordered ? 'list-decimal' : 'list-disc'
          } pl-5 marker:text-muted`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="type-body text-ink-2 pl-1">
              <DocsInline text={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case 'steps':
      return (
        <ol className="max-w-[72ch] space-y-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4">
              <span
                aria-hidden="true"
                className="shrink-0 w-7 h-7 rounded-full border border-volt-line bg-volt-tint text-volt-ink font-mono text-[12px] flex items-center justify-center mt-0.5"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="type-body text-ink font-semibold">
                  <DocsInline text={item.title} />
                </p>
                <p className="type-body-sm text-ink-2 mt-1">
                  <DocsInline text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case 'code':
      return <CodeSample label={block.label} code={block.code} />;

    case 'table':
      return (
        <Table>
          <thead>
            <tr>
              {block.head.map((cell, i) => (
                <Th key={i}>
                  <DocsInline text={cell} />
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <Td key={c}>
                    <DocsInline text={cell} />
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      );

    case 'callout':
      return (
        <div className="border-l-2 border-line pl-4 py-1">
          <Callout variant={block.variant ?? 'info'} title={block.title}>
            <DocsInline text={block.text} />
          </Callout>
        </div>
      );

    case 'defs':
      return (
        <dl className="max-w-[72ch] divide-y divide-line border-t border-b border-line">
          {block.items.map((item, i) => (
            <div key={i} className="py-4 sm:grid sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-6">
              <dt className="type-body text-ink font-semibold">
                <DocsInline text={item.term} />
              </dt>
              <dd className="type-body-sm text-ink-2 mt-1 sm:mt-0 min-w-0">
                <DocsInline text={item.text} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'endpoints':
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="bg-canvas border border-line rounded-[var(--r-3)] px-4 py-3 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="flex items-baseline gap-2.5 shrink-0">
                <span
                  className={`inline-block font-mono text-[10px] font-semibold tracking-wide border px-1.5 py-0.5 rounded-[var(--r-1)] ${
                    METHOD_STYLE[item.method]
                  }`}
                >
                  {item.method}
                </span>
                <code className="font-mono text-[12.5px] text-ink break-all">{item.path}</code>
              </span>
              <span className="type-body-sm text-ink-2 min-w-0">
                <DocsInline text={item.text} />
              </span>
            </li>
          ))}
        </ul>
      );

    case 'cards':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {block.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-canvas border border-line rounded-[var(--r-3)] p-4 no-underline transition-all hover:border-volt/40 hover:-translate-y-0.5"
            >
              <p className="type-body text-ink font-semibold flex items-center gap-1.5 group-hover:text-volt transition-colors">
                {item.title}
                <ArrowRight size={14} aria-hidden="true" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <p className="type-body-sm text-ink-2 mt-1">{item.text}</p>
            </Link>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export function DocBlocks({ blocks }: { blocks: DocBlock[] }): ReactElement {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

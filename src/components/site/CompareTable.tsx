import { Check, Minus } from 'lucide-react';
import { Table, Th, Td } from '@/components/ds';
import { cn } from '@/lib/cn';
import { FEATURE_AXES, type Competitor, type Edge } from '@/lib/compare';

/**
 * The full feature-by-feature matrix for one competitor: OyeChats' constant
 * value against the rival's, with a per-row "edge" marker judged from OyeChats'
 * side but honest about `them`/`tie`. Rendered server-side, with no
 * interactivity, so the table content is fully crawlable and extractable by
 * AI answer engines.
 */
export function CompareTable({ competitor }: { competitor: Competitor }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Capability</Th>
          <Th>OyeChats</Th>
          <Th>{competitor.name}</Th>
        </tr>
      </thead>
      <tbody>
        {FEATURE_AXES.map((axis) => {
          const feat = competitor.features[axis.key];
          const edge: Edge = feat?.edge ?? 'tie';
          return (
            <tr key={axis.key}>
              <Td>
                <span className="font-medium text-ink">{axis.label}</span>
              </Td>
              <Td className={cn(edge === 'oye' && 'bg-volt-tint/50')}>
                <span className="flex items-start gap-2">
                  <EdgeMark active={edge === 'oye'} tone="oye" />
                  <span className={cn(edge === 'oye' && 'text-ink')}>{axis.oye}</span>
                </span>
              </Td>
              <Td className={cn(edge === 'them' && 'bg-canvas')}>
                <span className="flex items-start gap-2">
                  <EdgeMark active={edge === 'them'} tone="them" />
                  <span>{feat?.text ?? '-'}</span>
                </span>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

/** A small check for the winning cell; a muted dash where the row is even. */
function EdgeMark({ active, tone }: { active: boolean; tone: 'oye' | 'them' }) {
  if (!active) {
    return <Minus size={15} className="mt-0.5 shrink-0 text-muted-2" aria-hidden />;
  }
  return (
    <Check
      size={15}
      className={cn('mt-0.5 shrink-0', tone === 'oye' ? 'text-volt' : 'text-ink')}
      aria-label="Advantage"
    />
  );
}

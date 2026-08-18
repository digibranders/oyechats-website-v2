import type { DocBlock } from './types';
import matrix from './plan-matrix.generated.json';

/**
 * Typed access to the generated plan matrix, plus the two table builders the
 * Plans page renders.
 *
 * The JSON is produced by `platform/api/scripts/export_plan_matrix.py` from
 * BOTH sources of truth — `seed_plans._PLANS` for per-tier limits and feature
 * flags, and the slug sets in `plan_entitlements_service` / `plan_service` for
 * the capabilities gated outside that column. Restating either in prose is what
 * drifted before: the docs twice described gating that the platform did not
 * implement, and twice it was a capability (delta re-crawl, visitor
 * intelligence) that is not in `Plan.features` at all.
 *
 * Nothing here is hand-maintained. To change what the docs say, change the
 * platform and re-run the exporter.
 */

type PlanRow = {
  slug: string;
  name: string;
  tagline: string | null;
  trial_days: number;
  included_operator_seats: number;
  limits: Record<string, number | null>;
};

type Capability = {
  key: string;
  label: string;
  /** Where the gate is enforced, for anyone verifying a claim at source. */
  source: string;
  /** Plan slugs that have it. */
  slugs: string[];
};

const PLANS: PlanRow[] = matrix.plans;
const LIMIT_LABELS: { key: string; label: string }[] = matrix.limit_labels;
const CAPABILITIES: Capability[] = matrix.capabilities;

/** `-1` is the platform's "unlimited" sentinel throughout the plan matrix. */
const UNLIMITED = -1;

/**
 * The JSON is a build artifact from another repo, so a truncated or half-written
 * file would otherwise render as empty or all-dashes tables that look
 * deliberate. Fail the build instead. The generator has its own tests
 * (`api/tests/test_export_plan_matrix.py`) for drift against the platform
 * constants; this only guards the artifact's shape at the consuming end.
 */
if (PLANS.length === 0 || LIMIT_LABELS.length === 0 || CAPABILITIES.length === 0) {
  throw new Error('plan-matrix.generated.json is empty. Re-run scripts/export_plan_matrix.py');
}
{
  const slugs = new Set(PLANS.map((p) => p.slug));
  for (const cap of CAPABILITIES) {
    if (cap.slugs.length === 0) {
      throw new Error(`plan-matrix: capability "${cap.key}" is gated to no plan`);
    }
    const unknown = cap.slugs.filter((s) => !slugs.has(s));
    if (unknown.length > 0) {
      throw new Error(`plan-matrix: capability "${cap.key}" references unknown plans: ${unknown.join(', ')}`);
    }
  }
}

function formatLimit(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'No';
  if (value === UNLIMITED) return 'Unlimited';
  return value.toLocaleString('en-US');
}

/** Plan display names, in seeded order — the column headers for both tables. */
export const PLAN_NAMES: string[] = PLANS.map((p) => p.name);

/** The tier that carries a trial, if any — used for the trial paragraph. */
export const TRIAL_PLAN: { name: string; days: number } | null = (() => {
  const withTrial = PLANS.find((p) => p.trial_days > 0);
  return withTrial ? { name: withTrial.name, days: withTrial.trial_days } : null;
})();

/** Limits table: one row per limit, one column per plan. */
export function limitsTable(): DocBlock {
  return {
    t: 'table',
    head: ['Limit', ...PLAN_NAMES],
    rows: LIMIT_LABELS.map(({ key, label }) => [
      label,
      ...PLANS.map((p) => formatLimit(p.limits[key])),
    ]),
  };
}

/** Capability table: one row per gated capability, ✓ / — per plan. */
export function capabilitiesTable(): DocBlock {
  return {
    t: 'table',
    head: ['Capability', ...PLAN_NAMES],
    rows: CAPABILITIES.map((cap) => [
      cap.label,
      ...PLANS.map((p) => (cap.slugs.includes(p.slug) ? 'Yes' : 'No')),
    ]),
  };
}

/** Included operator seats, as a sentence fragment per plan. */
export function seatsTable(): DocBlock {
  return {
    t: 'table',
    head: ['Plan', 'Included operator seats'],
    rows: PLANS.map((p) => [p.name, formatLimit(p.included_operator_seats)]),
  };
}

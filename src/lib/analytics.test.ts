import { describe, expect, it } from 'vitest';
import {
  pricingPlanAttributes,
  pricingPlanClickFromDataset,
  pushDataLayerEvent,
  trackPricingPlanClick,
  withBillingPeriod,
  type DataLayerHost,
  type PricingCtaElement,
} from './analytics';
import { PRICING_TIERS, type PricingTier, type TierId } from './pricing';

function tier(id: TierId): PricingTier {
  const found = PRICING_TIERS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`No pricing tier "${id}"`);
  return found;
}

/** What a browser exposes as `element.dataset` for a set of `data-*` attributes. */
function toDataset(attributes: Partial<Record<string, string>>): DOMStringMap {
  const dataset: DOMStringMap = {};
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined) continue;
    const key = name
      .replace(/^data-/, '')
      .replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase());
    dataset[key] = value;
  }
  return dataset;
}

function fakeAnchor(
  href: string,
  attributes: Partial<Record<string, string>>,
): PricingCtaElement & { href: string } {
  const anchor = {
    href,
    dataset: toDataset(attributes),
    getAttribute: (name: string) => (name === 'href' ? anchor.href : null),
    setAttribute: (name: string, value: string) => {
      if (name === 'href') anchor.href = value;
    },
  };
  return anchor;
}

describe('pricing plan click event', () => {
  it('reports the monthly price a visitor saw on the card', () => {
    const standard = tier('standard');
    const attributes = pricingPlanAttributes({
      tier: standard,
      currency: 'INR',
      billingPeriod: 'monthly',
      location: 'pricing_page',
    });

    expect(pricingPlanClickFromDataset(toDataset(attributes))).toEqual({
      event: 'pricing_plan_click',
      plan_id: 'standard',
      plan_name: 'Standard',
      plan_price: standard.monthly?.INR,
      plan_currency: 'INR',
      billing_period: 'monthly',
      cta_location: 'pricing_page',
    });
  });

  it('reports the per-month annual price while the annual toggle is on', () => {
    const professional = tier('professional');
    const attributes = pricingPlanAttributes({
      tier: professional,
      currency: 'USD',
      billingPeriod: 'annual',
      location: 'pricing_page',
    });

    expect(pricingPlanClickFromDataset(toDataset(attributes))).toMatchObject({
      plan_id: 'professional',
      plan_price: professional.annualMonthly?.USD,
      plan_currency: 'USD',
      billing_period: 'annual',
    });
  });

  it('reports the Free plan at a price of zero rather than leaving the price out', () => {
    const attributes = pricingPlanAttributes({
      tier: tier('free'),
      currency: 'USD',
      billingPeriod: 'monthly',
      location: 'home_pricing',
    });

    expect(pricingPlanClickFromDataset(toDataset(attributes))).toMatchObject({
      plan_id: 'free',
      plan_price: 0,
      cta_location: 'home_pricing',
    });
  });

  it('ignores an element that is not a pricing CTA', () => {
    expect(pricingPlanClickFromDataset(toDataset({}))).toBeNull();
  });

  it('refuses tampered attributes rather than forwarding them to Google', () => {
    const valid = pricingPlanAttributes({
      tier: tier('starter'),
      currency: 'INR',
      billingPeriod: 'monthly',
      location: 'pricing_page',
    });

    for (const [name, value] of [
      ['data-pricing-plan-id', '<script>'],
      ['data-pricing-plan-price', 'free'],
      ['data-pricing-plan-currency', 'EUR'],
      ['data-pricing-billing-period', 'weekly'],
      ['data-pricing-cta-location', 'footer'],
    ] as const) {
      expect(pricingPlanClickFromDataset(toDataset({ ...valid, [name]: value }))).toBeNull();
    }
  });
});

describe('withBillingPeriod', () => {
  it('tells the app which billing period a plan signup was chosen with', () => {
    const url = new URL(withBillingPeriod('https://app.oyechats.com/register?plan=starter', 'annual'));

    expect(url.searchParams.get('plan')).toBe('starter');
    expect(url.searchParams.get('billing')).toBe('annual');
  });

  it('keeps the affiliate codes AttributionCapture already added', () => {
    const url = new URL(
      withBillingPeriod('https://app.oyechats.com/register?plan=starter&ref=PARTNER&code=LAUNCH', 'monthly'),
    );

    expect(url.searchParams.get('ref')).toBe('PARTNER');
    expect(url.searchParams.get('code')).toBe('LAUNCH');
    expect(url.searchParams.get('billing')).toBe('monthly');
  });

  it('replaces a billing period from an earlier click', () => {
    const url = new URL(
      withBillingPeriod('https://app.oyechats.com/register?plan=starter&billing=monthly', 'annual'),
    );

    expect(url.searchParams.getAll('billing')).toEqual(['annual']);
  });

  it('leaves a link without a plan untouched', () => {
    expect(withBillingPeriod('https://app.oyechats.com/register', 'annual')).toBe(
      'https://app.oyechats.com/register',
    );
    expect(withBillingPeriod('/contact', 'annual')).toBe('/contact');
  });
});

describe('pushDataLayerEvent', () => {
  it('creates the queue when GTM has not been armed', () => {
    const host: DataLayerHost = {};

    pushDataLayerEvent({ event: 'pricing_plan_click', plan_id: 'free' }, host);

    expect(host.dataLayer).toEqual([{ event: 'pricing_plan_click', plan_id: 'free' }]);
  });

  it('appends to the existing queue rather than replacing it', () => {
    // GTM wraps `push` on the array it found at load; a new array would be
    // invisible to the container.
    const queue: unknown[] = [{ event: 'gtm.js' }];
    const host: DataLayerHost = { dataLayer: queue };

    pushDataLayerEvent({ event: 'pricing_plan_click', plan_id: 'free' }, host);

    expect(host.dataLayer).toBe(queue);
    expect(queue).toHaveLength(2);
  });

  it('never throws when an extension has replaced the queue', () => {
    const host = { dataLayer: {} as unknown as unknown[] };

    expect(() => pushDataLayerEvent({ event: 'pricing_plan_click' }, host)).not.toThrow();
  });
});

describe('trackPricingPlanClick', () => {
  it('reports the click and carries the billing period on the link being opened', () => {
    const host: DataLayerHost = {};
    const anchor = fakeAnchor(
      'https://app.oyechats.com/register?plan=standard',
      pricingPlanAttributes({
        tier: tier('standard'),
        currency: 'USD',
        billingPeriod: 'annual',
        location: 'pricing_page',
      }),
    );

    trackPricingPlanClick(anchor, host);

    expect(host.dataLayer).toEqual([
      expect.objectContaining({ event: 'pricing_plan_click', plan_id: 'standard', billing_period: 'annual' }),
    ]);
    expect(new URL(anchor.href).searchParams.get('billing')).toBe('annual');
  });

  it('does nothing for a link that carries no plan data', () => {
    const host: DataLayerHost = {};
    const anchor = fakeAnchor('https://app.oyechats.com/register', {});

    trackPricingPlanClick(anchor, host);

    expect(host.dataLayer).toBeUndefined();
    expect(anchor.href).toBe('https://app.oyechats.com/register');
  });
});

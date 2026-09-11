import type { Currency, PricingTier } from '@/lib/pricing';

/**
 * Google Tag Manager events raised by the marketing site.
 *
 * `consent-bootstrap.ts` creates `window.dataLayer` in `<head>` and injects the
 * container on the visitor's first interaction. A push made before then waits
 * in the queue and is processed when the container arrives, and a click is
 * itself an interaction, so a CTA click always brings the container with it.
 * What may reach Google is decided inside the container by Consent Mode.
 *
 * Free of React, so every rule here runs in node under test.
 */

export type BillingPeriod = 'monthly' | 'annual';

/** Which surface a pricing CTA sits on, so GA4 can compare them. */
export type PricingCtaLocation = 'pricing_page' | 'home_pricing';

export type DataLayerValue = string | number | boolean;

export type DataLayerEvent = { event: string } & Partial<Record<string, DataLayerValue>>;

export interface DataLayerHost {
  dataLayer?: unknown[];
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export type PricingPlanClickEvent = {
  event: 'pricing_plan_click';
  plan_id: string;
  plan_name: string;
  /** The per-month figure on the card: the monthly price, or the annual per-month price. */
  plan_price?: number;
  plan_currency: Currency;
  billing_period: BillingPeriod;
  cta_location: PricingCtaLocation;
};

/**
 * The attributes a pricing CTA carries. `PricingClickTracker` reads them back
 * at click time, which keeps the CTAs plain server-rendered anchors.
 */
export type PricingPlanAttributes = {
  'data-pricing-plan-id': string;
  'data-pricing-plan-name': string;
  'data-pricing-plan-price'?: string;
  'data-pricing-plan-currency': Currency;
  'data-pricing-billing-period': BillingPeriod;
  'data-pricing-cta-location': PricingCtaLocation;
};

export const PRICING_CTA_SELECTOR = '[data-pricing-plan-id]';

export type PricingCtaElement = Pick<HTMLElement, 'dataset' | 'getAttribute' | 'setAttribute'>;

/** The site's tier ids. Anything else in the attribute was not put there by us. */
const PLAN_ID_PATTERN = /^[a-z][a-z0-9_-]{0,31}$/;
/** GA4 truncates parameter values at 100 characters. */
const MAX_PLAN_NAME_LENGTH = 100;
const CURRENCIES: readonly Currency[] = ['INR', 'USD'];
const BILLING_PERIODS: readonly BillingPeriod[] = ['monthly', 'annual'];
const CTA_LOCATIONS: readonly PricingCtaLocation[] = ['pricing_page', 'home_pricing'];

function oneOf<T extends string>(allowed: readonly T[], value: string | undefined): T | null {
  return value !== undefined && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

export function pricingPlanAttributes({
  tier,
  currency,
  billingPeriod,
  location,
}: {
  tier: Pick<PricingTier, 'id' | 'name' | 'monthly' | 'annualMonthly'>;
  currency: Currency;
  billingPeriod: BillingPeriod;
  location: PricingCtaLocation;
}): PricingPlanAttributes {
  const money = billingPeriod === 'annual' ? tier.annualMonthly : tier.monthly;
  return {
    'data-pricing-plan-id': tier.id,
    'data-pricing-plan-name': tier.name,
    ...(money ? { 'data-pricing-plan-price': String(money[currency]) } : {}),
    'data-pricing-plan-currency': currency,
    'data-pricing-billing-period': billingPeriod,
    'data-pricing-cta-location': location,
  };
}

/**
 * Rebuild the event from an element's dataset, or `null` when the element is
 * not a pricing CTA. Attributes are editable by anyone with devtools and by any
 * script on the page, so every value is checked before it is sent.
 */
export function pricingPlanClickFromDataset(dataset: DOMStringMap): PricingPlanClickEvent | null {
  const planId = dataset.pricingPlanId;
  const planName = dataset.pricingPlanName;
  const currency = oneOf(CURRENCIES, dataset.pricingPlanCurrency);
  const billingPeriod = oneOf(BILLING_PERIODS, dataset.pricingBillingPeriod);
  const location = oneOf(CTA_LOCATIONS, dataset.pricingCtaLocation);
  if (!planId || !PLAN_ID_PATTERN.test(planId)) return null;
  if (!planName || planName.length > MAX_PLAN_NAME_LENGTH) return null;
  if (!currency || !billingPeriod || !location) return null;

  const event: PricingPlanClickEvent = {
    event: 'pricing_plan_click',
    plan_id: planId,
    plan_name: planName,
    plan_currency: currency,
    billing_period: billingPeriod,
    cta_location: location,
  };

  const rawPrice = dataset.pricingPlanPrice;
  if (rawPrice !== undefined) {
    const price = Number(rawPrice);
    if (rawPrice.trim() === '' || !Number.isFinite(price) || price < 0) return null;
    event.plan_price = price;
  }
  return event;
}

/**
 * Add `billing=<period>` to a plan signup link, so the app can attach it to the
 * registration event. Only links that already carry `?plan=` are changed.
 */
export function withBillingPeriod(href: string, billingPeriod: BillingPeriod): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    // A relative link such as `/contact` never leads to signup.
    return href;
  }
  if (!url.searchParams.has('plan')) return href;
  url.searchParams.set('billing', billingPeriod);
  return url.toString();
}

export function pushDataLayerEvent(payload: DataLayerEvent, host: DataLayerHost = window): void {
  try {
    // Append, never assign a fresh array: GTM wraps `push` on the array it
    // found when it loaded, and a replacement would be invisible to it.
    host.dataLayer = host.dataLayer || [];
    host.dataLayer.push(payload);
  } catch {
    // A blocker replaced the queue with something that is not an array. The
    // event is lost; the navigation the visitor asked for is not.
  }
}

/**
 * Report a pricing CTA click, then add the billing period to the link the
 * browser is about to open.
 *
 * The href is rewritten at click time instead of being rendered with the
 * period in it: `AttributionCapture` appends `ref`/`code` to these anchors in
 * the DOM, and a React re-render of `href` on every annual toggle would throw
 * that decoration away.
 */
export function trackPricingPlanClick(element: PricingCtaElement, host: DataLayerHost = window): void {
  const event = pricingPlanClickFromDataset(element.dataset);
  if (!event) return;

  pushDataLayerEvent(event, host);

  const href = element.getAttribute('href');
  if (!href) return;
  const withPeriod = withBillingPeriod(href, event.billing_period);
  if (withPeriod !== href) element.setAttribute('href', withPeriod);
}

import { NextResponse, type NextRequest } from 'next/server';
import { currencyForCountry } from '@/lib/pricing';

/**
 * Geo-gates every page that shows a price, without giving up static rendering.
 *
 * Each priced route has an INR twin under `/in`, and both are statically
 * generated and CDN-cached. This rewrites Indian traffic to the twin, so the
 * correct currency is already in the HTML the visitor receives — no
 * client-side detection, no currency flip after hydration, no per-request
 * render, and no chance of the home page and the pricing page disagreeing.
 *
 *   /         ->  /in
 *   /pricing  ->  /in/pricing
 *
 * `x-vercel-ip-country` is set by Vercel's edge. It is absent locally and on
 * any non-Vercel host, where `currencyForCountry` resolves to USD and the
 * request falls through unchanged.
 *
 * The matcher lists the priced routes explicitly: middleware bills per
 * invocation and adds latency, so it must not run on assets or on the many
 * routes that show no price. Adding a price to another page means adding it
 * here AND creating its `/in` twin — miss either and that page silently shows
 * the wrong currency to Indian visitors, which is the bug this replaced.
 */
export function middleware(request: NextRequest): NextResponse {
  const country = request.headers.get('x-vercel-ip-country');

  if (currencyForCountry(country) === 'INR') {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname === '/' ? '/in' : `/in${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/pricing'],
};

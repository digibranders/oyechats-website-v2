import { NextResponse, type NextRequest } from 'next/server';
import { currencyForCountry } from '@/lib/pricing';

/**
 * Geo-gates pricing without giving up static rendering.
 *
 * `/pricing` and `/pricing/in` are both statically generated and CDN-cached.
 * This rewrites Indian traffic to the INR variant, so the correct price is in
 * the HTML the visitor receives — no client-side detection, no currency flip
 * after hydration, and no per-request render.
 *
 * `x-vercel-ip-country` is set by Vercel's edge. It is absent locally and on
 * any non-Vercel host, where `currencyForCountry` resolves to USD and the
 * request falls through to `/pricing` unchanged.
 *
 * The matcher is scoped to the single path on purpose: middleware bills per
 * invocation and adds latency, so it must not run on assets or other routes.
 */
export function middleware(request: NextRequest): NextResponse {
  const country = request.headers.get('x-vercel-ip-country');

  if (currencyForCountry(country) === 'INR') {
    const url = request.nextUrl.clone();
    url.pathname = '/pricing/in';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/pricing',
};

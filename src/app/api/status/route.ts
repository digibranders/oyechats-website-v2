import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/site';

/**
 * Same-origin proxy for the platform health check.
 *
 * The browser polls THIS route (same-origin, no CORS dependency) instead of
 * calling api.oyechats.com/health directly. The upstream `/health` does a real
 * DB `SELECT 1` + Redis ping on every hit, so we cache the result at the CDN
 * (s-maxage) and in the fetch data cache, all visitors in a 30s window share a
 * single upstream call rather than each browser touching the database.
 *
 * Health contract (platform api/app/main.py):
 *   200 + { status: "healthy" }   → operational
 *   200 + { status: "degraded" }  → up but a subsystem (worker/LLM) is impaired
 *   503 / { status: "unhealthy" } → DB or Redis down
 * Anything we can't reach or parse → "unknown". We NEVER report operational
 * unless the platform actually said so.
 */

export type SystemStatusValue = 'operational' | 'degraded' | 'down' | 'unknown';

const HEALTH_URL = `${API_URL}/health`;
const TIMEOUT_MS = 4000;

export async function GET() {
  let status: SystemStatusValue = 'unknown';

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(HEALTH_URL, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
      // Shared 30s data cache so we don't hit the DB-touching endpoint per visitor.
      next: { revalidate: 30 },
    }).finally(() => clearTimeout(timer));

    if (res.status === 503) {
      status = 'down';
    } else if (res.ok) {
      const data = (await res.json().catch(() => null)) as { status?: string } | null;
      status =
        data?.status === 'healthy'
          ? 'operational'
          : data?.status === 'degraded'
            ? 'degraded'
            : data?.status === 'unhealthy'
              ? 'down'
              : 'operational'; // 200 with an unrecognized body → the API answered, treat as up
    }
  } catch {
    // Timeout / network error / abort → we genuinely don't know. Never claim "operational".
    status = 'unknown';
  }

  return NextResponse.json(
    { status, checkedAt: new Date().toISOString() },
    {
      headers: {
        // CDN caches the answer for 30s (one upstream check globally per window),
        // and may serve a slightly stale value for up to 5 min while revalidating.
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
      },
    },
  );
}

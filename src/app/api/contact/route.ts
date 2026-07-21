import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// ── Design tokens (matches platform email_service.py) ──────────────────────
const FONT_STACK = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const BRAND_PRIMARY = '#7C3AED';
const INK_900 = '#0f0f1a';
const INK_700 = '#1f2937';
const INK_400 = '#6b7280';
const INK_300 = '#9ca3af';
const SURFACE_PAGE = '#f3f4fb';
const SURFACE_CARD = '#ffffff';
const SURFACE_FOOTER = '#f8f8fc';
const RULE = '#e8eaf0';

const INTENT_LABELS: Record<string, string> = {
  demo: 'Book a product demo',
  enterprise: 'Enterprise inquiry',
  support: 'Technical support',
  partnership: 'Partnership / integration',
  careers: 'Careers inquiry',
  other: 'Something else',
};

function esc(v: string | null | undefined): string {
  if (!v) return '-';
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px 10px 0;font-family:${FONT_STACK};font-size:11px;
      font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${INK_400};
      white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
    <td style="padding:10px 0;font-family:${FONT_STACK};font-size:14px;
      font-weight:500;color:${INK_900};vertical-align:top;line-height:1.5;">${value}</td>
  </tr>`;
}

function buildEmailHtml(params: {
  name: string;
  email: string;
  company: string;
  intent: string;
  message: string;
}): string {
  const intentLabel = INTENT_LABELS[params.intent] ?? params.intent;
  const preheader = `New contact form submission from ${esc(params.name)}. ${intentLabel}`;

  const detailsTable = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background-color:#FDF4FF;border:1px solid #DDD6FE;border-radius:14px;margin-bottom:20px;">
      <tr><td style="padding:10px 20px 6px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${infoRow('Name', esc(params.name))}
          ${infoRow('Email', `<a href="mailto:${esc(params.email)}" style="color:${BRAND_PRIMARY};text-decoration:none;">${esc(params.email)}</a>`)}
          ${params.company ? infoRow('Company', esc(params.company)) : ''}
          ${infoRow('Topic', esc(intentLabel))}
        </table>
      </td></tr>
    </table>`;

  const messageBox = `
    <p style="margin:0 0 8px 0;font-family:${FONT_STACK};font-size:10px;font-weight:700;
      text-transform:uppercase;letter-spacing:0.14em;color:${INK_400};">Message</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background-color:#f8f9fc;border:1px solid ${RULE};border-radius:14px;margin-bottom:20px;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0;font-family:${FONT_STACK};font-size:14px;color:${INK_700};
          line-height:1.7;white-space:pre-wrap;word-break:break-word;">${esc(params.message)}</p>
      </td></tr>
    </table>`;

  const replyBtn = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:4px;">
      <tr>
        <td align="center" style="border-radius:100px;background-color:${BRAND_PRIMARY};">
          <a href="mailto:${esc(params.email)}"
            style="display:block;background-color:${BRAND_PRIMARY};color:#ffffff;
            font-family:${FONT_STACK};font-size:15px;font-weight:700;text-decoration:none;
            text-align:center;padding:16px 32px;border-radius:100px;letter-spacing:0.02em;line-height:1;">
            Reply to ${esc(params.name.split(' ')[0])} &#8594;
          </a>
        </td>
      </tr>
    </table>`;

  const bodyInner = `
    <!-- Accent stripe -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="height:5px;background-color:${BRAND_PRIMARY};font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:32px 40px 0 40px;">
        <!-- Category label -->
        <p style="margin:0 0 6px 0;font-family:${FONT_STACK};font-size:10px;font-weight:700;
          letter-spacing:0.16em;text-transform:uppercase;color:${BRAND_PRIMARY};">
          Contact Form Submission
        </p>
        <!-- Heading -->
        <h1 style="margin:0 0 20px 0;font-family:${FONT_STACK};font-size:24px;font-weight:800;
          color:${INK_900};line-height:1.25;letter-spacing:-0.4px;">
          New message from ${esc(params.name)}
        </h1>
        ${detailsTable}
        ${messageBox}
        ${replyBtn}
      </td></tr>
    </table>`;

  const footerRow = `
    <tr>
      <td style="background-color:${SURFACE_FOOTER};border-top:1px solid ${RULE};
        border-radius:0 0 20px 20px;padding:26px 40px;text-align:center;">
        <p style="margin:0 0 10px 0;font-family:${FONT_STACK};font-size:12px;color:${INK_400};line-height:1.5;">
          <a href="https://oyechats.com" style="color:${INK_400};text-decoration:none;font-weight:600;">OyeChats</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:support@oyechats.com" style="color:${INK_400};text-decoration:none;font-weight:600;">support@oyechats.com</a>
        </p>
        <p style="margin:0;font-family:${FONT_STACK};font-size:11px;color:${INK_300};line-height:1.5;">
          This email was generated by the oyechats.com contact form.
        </p>
      </td>
    </tr>`;

  const headerRow = `
    <tr>
      <td style="background-color:${SURFACE_CARD};border-radius:20px 20px 0 0;
        padding:28px 40px 24px 40px;text-align:center;">
        <a href="https://oyechats.com" style="text-decoration:none;display:inline-block;line-height:1;">
          <span style="font-family:${FONT_STACK};font-size:22px;font-weight:800;
            letter-spacing:-0.5px;line-height:1;color:${INK_900};">
            Oye<span style="color:${BRAND_PRIMARY};">Chats</span>
          </span>
        </a>
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <title>New Contact Submission. OyeChats</title>
</head>
<body style="margin:0;padding:0;background-color:${SURFACE_PAGE};-webkit-text-size-adjust:100%;">
  <span style="display:none;font-size:1px;color:${SURFACE_PAGE};max-height:0;overflow:hidden;mso-hide:all;">
    ${preheader}&zwnj;
  </span>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background-color:${SURFACE_PAGE};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="600" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:${SURFACE_CARD};border-radius:20px;border:1px solid ${RULE};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${headerRow}
                <tr>
                  <td style="background-color:${SURFACE_CARD};padding:0 0 36px 0;">
                    ${bodyInner}
                  </td>
                </tr>
                ${footerRow}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Abuse controls (audit F12) ───────────────────────────────────────────────
// The contact form fires a live Brevo send on every valid POST, so an
// unthrottled endpoint lets an attacker exhaust the Brevo quota and bomb the
// support inbox. These are best-effort (serverless instances are ephemeral and
// horizontally scaled, so the in-memory limiter is per-instance, not a hard
// global cap), pair with a WAF / Turnstile for a strict guarantee. The
// honeypot + length caps are deterministic and catch the common bot floods.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_LEN = { name: 200, email: 320, company: 200, message: 5000 } as const;
const _hits = new Map<string, number[]>();

function _clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0].trim() : 'unknown';
}

function _isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (_hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  _hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded across cold-start lifetime.
  if (_hits.size > 5000) {
    for (const [k, v] of _hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) _hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const brevoKey = process.env.BREVO_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS ?? 'noreply@oyechats.com';
  const fromName = process.env.EMAIL_FROM_NAME ?? 'OyeChats';
  const recipient = process.env.CONTACT_RECIPIENT ?? 'support@oyechats.com';

  if (!brevoKey) {
    return NextResponse.json(
      { error: 'We can’t send messages right now. Please email us at support@oyechats.com.' },
      { status: 503 }
    );
  }

  // Per-IP rate limit before doing any work (audit F12).
  if (_isRateLimited(_clientIp(req))) {
    return NextResponse.json(
      { error: 'You’ve sent a few messages already. Please wait a few minutes and try again.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 400 });
  }

  const { name, email, company, intent, message } = body as Record<string, string>;

  // Honeypot: a hidden field real users never fill. Bots that fill every field
  // get a fake success and no email is sent (audit F12).
  const honeypot = (body as Record<string, unknown>).website;
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'Please add your name, email, and a short message.' },
      { status: 422 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'That email address doesn’t look right. Please check it and try again.' },
      { status: 422 }
    );
  }

  // Length caps so a single request can't ship a huge payload / abuse the send.
  if (
    name.length > MAX_LEN.name ||
    email.length > MAX_LEN.email ||
    (company?.length ?? 0) > MAX_LEN.company ||
    message.length > MAX_LEN.message
  ) {
    return NextResponse.json(
      { error: 'One of your fields is a bit too long. Please shorten it and try again.' },
      { status: 422 }
    );
  }

  const intentLabel = INTENT_LABELS[intent] ?? 'General inquiry';
  const subject = `[Contact] ${intentLabel} · ${name.trim()}`;
  const html = buildEmailHtml({ name: name.trim(), email: email.trim(), company: company?.trim() ?? '', intent, message: message.trim() });

  const payload = JSON.stringify({
    sender: { name: fromName, email: fromAddress },
    to: [{ email: recipient }],
    replyTo: { email: email.trim(), name: name.trim() },
    subject,
    htmlContent: html,
  });

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoKey,
      },
      body: payload,
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Brevo error ${res.status}: ${errBody}`);
      return NextResponse.json(
        { error: 'We couldn’t send your message just now. Please try again in a moment, or email support@oyechats.com.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Brevo fetch failed:', err);
    return NextResponse.json(
      { error: 'We couldn’t send your message just now. Please try again in a moment, or email support@oyechats.com.' },
      { status: 502 }
    );
  }
}

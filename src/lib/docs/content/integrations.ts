import type { DocGroup } from '../types';

export const INTEGRATIONS: DocGroup = {
  slug: 'integrations',
  label: 'Integrations',
  description: 'Push events to your own systems, connect a CRM, book meetings in-chat, and route notifications.',
  pages: [
    {
      slug: 'webhooks',
      navLabel: 'Webhooks',
      title: 'Webhooks',
      summary:
        'OyeChats POSTs a signed JSON payload to your endpoint when something happens. This page covers setup, signature verification and retry behaviour.',
      metaTitle: 'OyeChats Webhooks: Setup, Signatures and Retries',
      metaDescription:
        'Configure OyeChats webhooks, verify the HMAC-SHA256 signature, and understand the retry schedule and delivery log.',
      sections: [
        {
          id: 'setup',
          heading: 'Setting one up',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Create the endpoint on your side',
                  text: 'It must accept `POST` with a JSON body on a publicly resolvable host, and return a 2xx status quickly. Private, internal and loopback addresses are rejected at registration. Use an `https://` URL: deliveries carry lead names, emails and phone numbers, and a plain `http://` endpoint sends those in clear text.',
                },
                {
                  title: 'Register it',
                  text: 'Go to **Workspace → Integrations → Webhook endpoints**, pick the chatbot, paste the URL, and select which events it should receive.',
                },
                {
                  title: 'Store the signing secret',
                  text: 'A secret is generated when you create the endpoint and shown once in full. Copy it then. Afterwards it is masked.',
                },
                {
                  title: 'Send a test',
                  text: 'Use the Test button and check the delivery log. Then verify the signature in your handler before you rely on the data.',
                },
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Endpoints are per chatbot',
              text: 'Each endpoint belongs to one chatbot, so a workspace with several chatbots can send each one\'s events to a different destination. Webhooks are included from Standard upwards, and only owners and admins can create or re-point them.',
            },
          ],
        },
        {
          id: 'envelope',
          heading: 'The payload envelope',
          blocks: [
            {
              t: 'p',
              text: 'Every delivery has the same four top-level fields. Only `data` varies by event.',
            },
            {
              t: 'code',
              label: 'JSON',
              code: `{
  "event": "tier_transition",
  "bot_id": 42,
  "timestamp": "2026-08-17T14:23:05.412000+00:00",
  "data": { }
}`,
            },
            {
              t: 'table',
              head: ['Field', 'Type', 'Meaning'],
              rows: [
                ['`event`', 'string', 'Which event fired. See [Webhook events](/docs/integrations/webhook-events).'],
                ['`bot_id`', 'integer', 'The chatbot the event belongs to.'],
                ['`timestamp`', 'string', 'ISO 8601, UTC, when the delivery was built.'],
                ['`data`', 'object', 'The event-specific body.'],
              ],
            },
          ],
        },
        {
          id: 'signature',
          heading: 'Verifying the signature',
          blocks: [
            {
              t: 'p',
              text: 'Every request carries an `X-OyeChats-Signature` header: the string `sha256=` followed by the hex HMAC-SHA256 of the **raw request body**, keyed with your endpoint\'s secret.',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Hash the raw bytes',
              text: 'Compute the HMAC over the body exactly as received, before any JSON parse or re-serialise. Re-serialising changes whitespace and key order, and the signature will not match.',
            },
            {
              t: 'code',
              label: 'Python. FastAPI',
              code: `import hashlib
import hmac

from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()
SECRET = "your_endpoint_secret"


@app.post("/oyechats/webhook")
async def receive(request: Request, x_oyechats_signature: str = Header(default="")):
    raw = await request.body()
    expected = "sha256=" + hmac.new(
        SECRET.encode(), raw, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, x_oyechats_signature):
        raise HTTPException(status_code=401, detail="bad signature")

    payload = await request.json()
    handle(payload)          # your logic
    return {"ok": True}      # 2xx, fast`,
            },
            {
              t: 'code',
              label: 'Node.js. Express',
              code: `import crypto from 'node:crypto';
import express from 'express';

const app = express();
const SECRET = process.env.OYECHATS_WEBHOOK_SECRET;

// express.raw keeps the body as bytes so the HMAC matches.
app.post(
  '/oyechats/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const expected =
      'sha256=' +
      crypto.createHmac('sha256', SECRET).update(req.body).digest('hex');
    const received = req.get('X-OyeChats-Signature') ?? '';

    const a = Buffer.from(expected);
    const b = Buffer.from(received);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).send('bad signature');
    }

    const payload = JSON.parse(req.body.toString('utf8'));
    handle(payload);
    res.json({ ok: true });
  },
);`,
            },
            {
              t: 'list',
              items: [
                'Always use a constant-time comparison. A plain `===` leaks timing information.',
                'Never skip verification because the payload "looks right". The URL is not a secret.',
                'Treat deliveries as at-least-once and make your handler idempotent. Key on the `session_id` in `data`.',
              ],
            },
          ],
        },
        {
          id: 'retries',
          heading: 'Retries and delivery log',
          blocks: [
            {
              t: 'p',
              text: 'A delivery succeeds on any 2xx. Anything else (a 4xx, a 5xx, a timeout, a connection error) is retried.',
            },
            {
              t: 'table',
              head: ['Behaviour', 'Value'],
              rows: [
                ['Attempts', 'Up to 5, including the first'],
                ['Backoff between attempts', '30 seconds, 2 minutes, 10 minutes, 1 hour'],
                ['Request timeout', '10 seconds'],
                ['After the last failed attempt', 'The delivery is marked permanently failed and stops'],
              ],
            },
            {
              t: 'p',
              text: 'Every attempt is logged with its status code and response body, viewable per endpoint in the dashboard. Failed deliveries can be replayed manually once your endpoint is healthy again.',
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'Return 2xx fast, work afterwards',
              text: 'Do the slow part of your handler after responding. Enqueue a job, then reply. A handler that takes longer than 10 seconds is a failed delivery even if it eventually succeeds.',
            },
          ],
        },
      ],
    },

    {
      slug: 'webhook-events',
      navLabel: 'Webhook events',
      title: 'Webhook event reference',
      summary:
        'The five events OyeChats sends, and the exact contents of each one\'s `data` object.',
      metaTitle: 'OyeChats Webhook Event Reference and Payloads',
      metaDescription:
        'Reference for all OyeChats webhook events. Tier_transition, lead_captured, handoff_requested, meeting_booked and chat_closed, with example payloads.',
      sections: [
        {
          id: 'list',
          heading: 'The five events',
          blocks: [
            {
              t: 'table',
              head: ['Event', 'Dashboard label', 'Fires when'],
              rows: [
                ['`tier_transition`', 'Lead qualified', 'A conversation crosses a qualification tier boundary.'],
                ['`lead_captured`', 'Lead captured', 'A visitor submits contact details.'],
                ['`handoff_requested`', 'Handoff requested', 'A visitor asks to speak to a human.'],
                ['`meeting_booked`', 'Meeting booked', 'A visitor books a meeting through the widget.'],
                ['`chat_closed`', 'Conversation closed', 'An operator closes or resolves a live conversation.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Subscribe narrowly',
              text: 'Select only the events you handle. An endpoint subscribed to everything gets retried on payloads it ignores, which makes your delivery log harder to read when something real breaks.',
            },
          ],
        },
        {
          id: 'tier-transition',
          heading: 'tier_transition',
          blocks: [
            {
              t: 'p',
              text: 'The event most integrations are built on. `new_tier` is one of `unqualified`, `mql`, `sal`, `sql`.',
            },
            {
              t: 'code',
              label: 'JSON',
              code: `{
  "event": "tier_transition",
  "bot_id": 42,
  "timestamp": "2026-08-17T14:23:05.412000+00:00",
  "data": {
    "session_id": "session_8f3a2b1c",
    "old_tier": "mql",
    "new_tier": "sql",
    "score": 80,
    "behavioral_score": 15
  }
}`,
            },
            {
              t: 'callout',
              variant: 'warn',
              title: 'No contact details in this payload',
              text: 'This event carries scores and tiers only. To get the contact for the same conversation, either handle `lead_captured` as well or call `GET /leads/{session_id}` with the `session_id` from this payload.',
            },
          ],
        },
        {
          id: 'lead-captured',
          heading: 'lead_captured',
          blocks: [
            {
              t: 'code',
              label: 'JSON',
              code: `{
  "event": "lead_captured",
  "bot_id": 42,
  "timestamp": "2026-08-17T14:19:44.108000+00:00",
  "data": {
    "session_id": "session_8f3a2b1c",
    "name": "Sarah Chen",
    "email": "sarah@acme.com",
    "phone": "+91 98765 43210",
    "company": "Acme"
  }
}`,
            },
            {
              t: 'p',
              text: 'Fields the visitor did not supply arrive as `null`. Only `session_id` is guaranteed non-null.',
            },
          ],
        },
        {
          id: 'handoff-requested',
          heading: 'handoff_requested',
          blocks: [
            {
              t: 'code',
              label: 'JSON',
              code: `{
  "event": "handoff_requested",
  "bot_id": 42,
  "timestamp": "2026-08-17T14:21:02.771000+00:00",
  "data": {
    "session_id": "session_8f3a2b1c",
    "reason": "Wants to discuss enterprise pricing",
    "department_id": 3,
    "contact": {
      "name": "Sarah Chen",
      "email": "sarah@acme.com",
      "phone": "+91 98765 43210"
    }
  }
}`,
            },
            {
              t: 'p',
              text: '`contact` is present only if the conversation had already captured details. `department_id` is `null` when the visitor was not asked to choose a department.',
            },
          ],
        },
        {
          id: 'meeting-booked',
          heading: 'meeting_booked',
          blocks: [
            {
              t: 'code',
              label: 'JSON',
              code: `{
  "event": "meeting_booked",
  "bot_id": 42,
  "timestamp": "2026-08-17T14:31:19.004000+00:00",
  "data": {
    "session_id": "session_8f3a2b1c",
    "booking_url": "https://calendly.com/acme/intro/2026-08-20T10:00:00Z",
    "meeting_time": "2026-08-20T10:00:00+00:00",
    "attendee_email": "sarah@acme.com"
  }
}`,
            },
          ],
        },
        {
          id: 'chat-closed',
          heading: 'chat_closed',
          blocks: [
            {
              t: 'code',
              label: 'JSON',
              code: `{
  "event": "chat_closed",
  "bot_id": 42,
  "timestamp": "2026-08-17T14:40:55.220000+00:00",
  "data": {
    "session_id": "session_8f3a2b1c",
    "operator_id": 7,
    "resolution": "resolved"
  }
}`,
            },
            {
              t: 'p',
              text: '`resolution` is present with the value `resolved` when the operator ended the conversation outright, and absent when they closed it back to the chatbot. That difference is how you distinguish a finished conversation from one the visitor may continue.',
            },
          ],
        },
      ],
    },

    {
      slug: 'crm',
      navLabel: 'CRM & automation',
      title: 'Connecting a CRM',
      summary:
        'There is no per-CRM connector. There is one webhook and an automation platform, which reaches every CRM including yours.',
      metaTitle: 'Connect OyeChats to HubSpot, Salesforce or Any CRM',
      metaDescription:
        'Push qualified OyeChats leads into HubSpot, Salesforce or any CRM using webhooks with Zapier or Make, including field mapping guidance.',
      sections: [
        {
          id: 'approach',
          heading: 'How it works',
          blocks: [
            {
              t: 'p',
              text: 'OyeChats sends signed webhooks. Zapier, Make, n8n and every other automation platform can catch a webhook and write to a CRM. That composition covers HubSpot, Salesforce, Pipedrive, Zoho and anything else with an automation connector, and your own backend, if you would rather skip the middle layer.',
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Set expectations honestly',
              text: 'There are no native, one-click CRM connectors today. The dashboard ships setup guides for the Zapier and Make routes; anything described as a "HubSpot integration" is that pattern.',
            },
          ],
        },
        {
          id: 'zapier',
          heading: 'HubSpot via Zapier',
          blocks: [
            {
              t: 'steps',
              items: [
                { title: 'Create a Zap', text: 'Trigger: **Webhooks by Zapier → Catch Hook**.' },
                { title: 'Copy the Zapier webhook URL', text: 'Zapier shows it once the trigger is created.' },
                {
                  title: 'Register it in OyeChats',
                  text: 'Workspace → Integrations → Webhook endpoints. Subscribe it to `tier_transition`, and to `lead_captured` if you want every contact rather than only qualified ones.',
                },
                { title: 'Add the action', text: '**HubSpot → Create or update contact**.' },
                {
                  title: 'Map the fields',
                  text: 'Email from `data.contact.email` on `lead_captured`; tier and score from `data.new_tier` and `data.score` on `tier_transition`.',
                },
                { title: 'Send a test and turn it on', text: 'Use the Test button in OyeChats and confirm the record lands.' },
              ],
            },
          ],
        },
        {
          id: 'make',
          heading: 'Salesforce via Make',
          blocks: [
            {
              t: 'steps',
              items: [
                { title: 'Create a scenario', text: 'Trigger: **Webhooks → Custom webhook**.' },
                { title: 'Copy the Make webhook URL', text: 'And register it in OyeChats against your chosen events.' },
                { title: 'Add the Salesforce module', text: '**Create a record → Lead**.' },
                { title: 'Map the payload', text: 'Email, name, company from the payload, plus score and tier into custom fields.' },
              ],
            },
          ],
        },
        {
          id: 'patterns',
          heading: 'Patterns that work well',
          blocks: [
            {
              t: 'defs',
              items: [
                {
                  term: 'Only route qualified leads',
                  text: 'Subscribe to `tier_transition` and filter on `new_tier == "sql"` in your automation. Your sales team gets the leads worth calling and nothing else.',
                },
                {
                  term: 'Two events, one record',
                  text: '`lead_captured` creates or updates the contact; `tier_transition` enriches it with the score. Key both on `session_id`.',
                },
                {
                  term: 'Backfill the rest with the API',
                  text: 'When you need the transcript or the dimension breakdown, call `GET /leads/{session_id}` from your automation using the `session_id` in the payload.',
                },
                {
                  term: 'Alert instead of writing',
                  text: 'The same webhook can post to Slack or Teams. The fastest useful integration for a small team is often a channel message, not a CRM record.',
                },
              ],
            },
          ],
        },
      ],
    },

    {
      slug: 'meetings',
      navLabel: 'Meeting booking',
      title: 'Meeting booking',
      summary:
        'Let visitors book a call inside the chat instead of being sent away to a scheduling page they may never open.',
      metaTitle: 'In-Chat Meeting Booking With Calendly, Zcal or Cal.com',
      metaDescription:
        'Connect Calendly, Zcal or Cal.com so OyeChats visitors can book a meeting inside the chat widget, and receive a meeting_booked webhook when they do.',
      sections: [
        {
          id: 'setup',
          heading: 'Setting it up',
          blocks: [
            {
              t: 'steps',
              items: [
                {
                  title: 'Pick a provider',
                  text: 'Calendly, Zcal or Cal.com. One per chatbot.',
                },
                {
                  title: 'Paste your scheduling link',
                  text: 'Under **Workspace → Integrations → Meetings**, or from the chatbot\'s Channels tab.',
                },
                {
                  title: 'Test it in the widget',
                  text: 'Ask the chatbot to book a call and confirm the scheduler opens and a booking completes.',
                },
              ],
            },
          ],
        },
        {
          id: 'behaviour',
          heading: 'What visitors see',
          blocks: [
            {
              t: 'p',
              text: 'When booking is enabled, the chatbot offers a meeting where it is a sensible next step, and the scheduler opens inside the conversation. Once a booking is confirmed, the chatbot does not also push a live-chat handoff in the same turn. The visitor has already got what they came for.',
            },
            {
              t: 'p',
              text: 'Confirmed bookings appear against the conversation in your dashboard and fire the [`meeting_booked` webhook](/docs/integrations/webhook-events).',
            },
          ],
        },
        {
          id: 'embedding',
          heading: 'If the scheduler will not load',
          blocks: [
            {
              t: 'callout',
              variant: 'warn',
              title: 'Usually a content-security header',
              text: 'The scheduler renders in a frame inside the widget. If your own site sends a `Content-Security-Policy` with a `frame-src` that excludes your scheduling provider, the frame is blocked by your site, not by OyeChats. The widget detects this and falls back to opening the scheduler in a new tab, but the fix is to allow your provider\'s domain in `frame-src`.',
            },
          ],
        },
      ],
    },

    {
      slug: 'notifications',
      navLabel: 'Notifications',
      title: 'Notifications',
      summary:
        'Who gets told what, on which channel, when something happens in a conversation.',
      metaTitle: 'Notifications: Email and Browser Push',
      metaDescription:
        'Configure OyeChats notifications. Qualified lead emails, handoff alerts, offline message notifications, and browser push for operators.',
      sections: [
        {
          id: 'email',
          heading: 'Email notifications',
          blocks: [
            {
              t: 'p',
              text: 'Set per chatbot, with multiple recipients supported.',
            },
            {
              t: 'table',
              head: ['Notification', 'Default', 'Sent when'],
              rows: [
                ['Qualified lead', 'On', 'A conversation crosses into a higher qualification tier.'],
                ['Handoff requested', 'On', 'A visitor asks for a human.'],
                ['Offline message', 'On', 'Someone submits the offline form.'],
                ['Visitor confirmation', 'On', 'Acknowledges the visitor\'s offline message to them.'],
              ],
            },
            {
              t: 'callout',
              variant: 'info',
              title: 'Set a Reply-To',
              text: 'Notification emails come from an OyeChats sender so they authenticate correctly. Setting a Reply-To address per chatbot means a reply lands in your inbox, not in a no-reply void.',
            },
          ],
        },
        {
          id: 'operator',
          heading: 'Operator alerts',
          blocks: [
            {
              t: 'list',
              items: [
                'In-dashboard toast and sound while the tab is open.',
                'Browser push when the dashboard is closed. Requires the operator to grant permission once, and is skipped while their dashboard is demonstrably being watched so they are not alerted twice.',
                'Email as a backstop for conversations nobody picked up, debounced to one message per minute per waiting visitor.',
              ],
            },
            {
              t: 'p',
              text: 'Each operator sets their own preferences in Settings. In-app notifications also collect in a notification centre with unread counts.',
            },
          ],
        },
        {
          id: 'programmatic',
          heading: 'Sending them somewhere else',
          blocks: [
            {
              t: 'p',
              text: 'For Slack, Teams, PagerDuty or an internal service, use a [webhook](/docs/integrations/webhooks) rather than email forwarding. It is faster, structured, and gives you a delivery log.',
            },
          ],
        },
      ],
    },
  ],
};

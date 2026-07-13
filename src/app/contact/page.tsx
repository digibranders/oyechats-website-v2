'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Phone,
  FileText,
  ChevronDown,
} from 'lucide-react';
import {
  Button,
  Callout,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Input,
  Label,
  Textarea,
} from '@/components/ds';

const INTENT_OPTIONS = [
  { value: 'enterprise', label: 'Enterprise inquiry' },
  { value: 'support', label: 'Technical support' },
  { value: 'partnership', label: 'Partnership / integration' },
  { value: 'careers', label: 'Careers inquiry' },
  { value: 'other', label: 'Something else' },
];

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'support@oyechats.com', href: 'mailto:support@oyechats.com' },
  { icon: Phone, label: 'Phone', value: '+91 789 789 6607', href: 'tel:+917897896607' },
  {
    icon: MapPin,
    label: 'Office',
    value: (
      <>
        Office No. 2617, 26th Floor, Solus Building,<br />
        Hiranandani Estate, Ghodbunder Road,<br />
        Thane West, Maharashtra 400607
      </>
    ),
  },
  { icon: FileText, label: 'GST No.', value: '27AAICD9268J1Z0' },
  { icon: MessageSquare, label: 'Live chat', value: 'Available on this page' },
  { icon: Clock, label: 'Response time', value: 'Within 1 business day' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', intent: 'enterprise' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intentOpen, setIntentOpen] = useState(false);
  const intentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (intentRef.current && !intentRef.current.contains(e.target as Node)) {
        setIntentOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const currentIntent = INTENT_OPTIONS.find((o) => o.value === form.intent);

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Let&apos;s <GradientText>talk</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Have an enterprise question, need support, or just want to say hi? We usually reply within one business day.
          </p>
        </Container>
      </section>

      <div className="bg-canvas py-16 md:py-24 border-t border-line">
        <Container>
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-12">
            {/* Contact info column */}
            <aside className="space-y-3">
              {CONTACT_INFO.map((c) => (
                <div
                  key={c.label}
                  className="bg-canvas border border-line rounded-[var(--r-3)] p-4 flex items-start gap-3 hover:border-line-2 transition-colors"
                >
                  <div className="w-9 h-9 rounded-[var(--r-2)] bg-volt-tint text-volt flex items-center justify-center shrink-0">
                    <c.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="type-mono-sm text-muted">{c.label}</div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="type-body-sm text-ink font-medium no-underline hover:text-volt break-words"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <div className="type-body-sm text-ink font-medium break-words">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </aside>

            {/* Form column */}
            <div>
              {submitted ? (
                <div className="bg-canvas border border-signal/30 rounded-[var(--r-4)] p-12 flex flex-col items-center text-center min-h-[420px] justify-center">
                  <div className="w-14 h-14 rounded-full bg-signal-tint text-signal flex items-center justify-center mb-5">
                    <CheckCircle2 size={28} />
                  </div>
                  <h2 className="type-heading-1 text-ink mb-2">Message sent</h2>
                  <p className="type-body text-ink-2 max-w-sm">
                    Thanks, we&apos;ll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-canvas border border-line rounded-[var(--r-4)] p-6 md:p-8 flex flex-col gap-5 shadow-[var(--e-1)]"
                >
                  {/* Honeypot: real users never fill this. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                    onChange={() => {}}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        maxLength={200}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Work email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        maxLength={320}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      maxLength={200}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div ref={intentRef} className="relative">
                    <Label>I&apos;m reaching out about</Label>
                    <button
                      type="button"
                      onClick={() => setIntentOpen((v) => !v)}
                      className="w-full bg-canvas border border-line rounded-[var(--r-2)] px-3.5 py-2.5 text-sm text-ink text-left flex items-center justify-between focus:outline-none focus:border-volt focus:shadow-[var(--e-focus)] transition-all"
                      aria-haspopup="listbox"
                      aria-expanded={intentOpen}
                    >
                      <span>{currentIntent?.label}</span>
                      <ChevronDown
                        size={16}
                        className="text-muted shrink-0 transition-transform"
                        style={{ transform: intentOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                    {intentOpen && (
                      <ul
                        role="listbox"
                        className="absolute z-50 mt-1.5 w-full bg-canvas border border-line rounded-[var(--r-2)] overflow-hidden shadow-[var(--e-3)]"
                      >
                        {INTENT_OPTIONS.map((o) => (
                          <li
                            key={o.value}
                            role="option"
                            aria-selected={form.intent === o.value}
                            onClick={() => {
                              setForm({ ...form, intent: o.value });
                              setIntentOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2 transition-colors ${
                              form.intent === o.value
                                ? 'text-volt-ink bg-volt-tint'
                                : 'text-ink-2 hover:text-ink hover:bg-paper'
                            }`}
                          >
                            {form.intent === o.value && (
                              <span className="h-1.5 w-1.5 rounded-full bg-volt shrink-0" />
                            )}
                            <span className={form.intent === o.value ? '' : 'ml-3.5'}>{o.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      maxLength={5000}
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you're looking to achieve..."
                    />
                  </div>

                  {error && (
                    <Callout variant="danger" title="Couldn't send">
                      {error}
                    </Callout>
                  )}

                  <Button variant="volt" size="lg" className="w-full">
                    {loading ? 'Sending…' : 'Send message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

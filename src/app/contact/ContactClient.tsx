'use client';

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import {
  Button,
  Callout,
  Container,
  DottedGrid,
  GradientText,
  HeroGlow,
  Input,
  Label,
  Reveal,
  Textarea,
} from '@/components/ds';

const INTENT_OPTIONS = [
  { value: 'sales', label: 'Sales inquiry' },
  { value: 'support', label: 'Technical support' },
  { value: 'partnership', label: 'Partnership / integration' },
  { value: 'careers', label: 'Careers inquiry' },
  { value: 'other', label: 'Something else' },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', intent: 'sales' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intentOpen, setIntentOpen] = useState(false);
  const [activeIntent, setActiveIntent] = useState(0);
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

  const selectIntent = (index: number) => {
    const option = INTENT_OPTIONS[index];
    if (!option) return;
    setForm((prev) => ({ ...prev, intent: option.value }));
    setActiveIntent(index);
    setIntentOpen(false);
  };

  /** Full listbox keyboard contract: the markup claimed one and implemented none. */
  const onIntentKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = INTENT_OPTIONS.length - 1;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!intentOpen) {
          setIntentOpen(true);
          return;
        }
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        setActiveIntent((i) => Math.min(last, Math.max(0, i + delta)));
        return;
      }
      case 'Home':
        if (intentOpen) {
          e.preventDefault();
          setActiveIntent(0);
        }
        return;
      case 'End':
        if (intentOpen) {
          e.preventDefault();
          setActiveIntent(last);
        }
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (intentOpen) selectIntent(activeIntent);
        else setIntentOpen(true);
        return;
      case 'Escape':
        if (intentOpen) {
          e.preventDefault();
          setIntentOpen(false);
        }
        return;
      case 'Tab':
        setIntentOpen(false);
        return;
      default:
        return;
    }
  };

  return (
    <>
      <section className="relative bg-paper overflow-hidden">
        <HeroGlow size="sm" />
        <DottedGrid />
        <Container className="relative pt-24 pb-16 md:pt-20 md:pb-20 text-center">
          <h1 className="type-display-2 text-ink max-w-3xl mx-auto">
            Let&apos;s <GradientText>talk</GradientText>.
          </h1>
          <p className="type-body-lg text-ink-2 mt-6 max-w-2xl mx-auto">
            Have a sales question, need support, or just want to say hi? We usually reply within one business day.
          </p>
        </Container>
      </section>

      <div className="bg-canvas py-16 md:py-16 border-t border-line">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Form */}
            <Reveal delay={80}>
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
                        autoComplete="name"
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
                        autoComplete="email"
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
                      autoComplete="organization"
                      maxLength={200}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>

                  {/* Keyboard support. Previously the options were <li role="option">
                      with onClick only (no keydown handling anywhere) so a
                      keyboard user could open the menu and never choose a value
                      (WCAG 2.1.1 Level A), and it silently blocked lead capture.
                      Kept as a custom listbox rather than a native <select> so the
                      control looks exactly as it does today; the fix is the
                      missing ARIA wiring and key handlers, not a redesign. */}
                  <div ref={intentRef} className="relative">
                    <Label id="intent-label">I&apos;m reaching out about</Label>
                    <button
                      type="button"
                      id="intent-trigger"
                      role="combobox"
                      onClick={() => setIntentOpen((v) => !v)}
                      onKeyDown={onIntentKeyDown}
                      className="w-full bg-canvas border border-line rounded-[var(--r-2)] px-3.5 py-3 min-h-11 text-sm text-ink text-left flex items-center justify-between focus:outline-none focus:border-volt focus:shadow-[var(--e-focus)] transition-all"
                      aria-haspopup="listbox"
                      aria-expanded={intentOpen}
                      aria-controls="intent-listbox"
                      aria-labelledby="intent-label intent-trigger"
                      aria-activedescendant={intentOpen ? `intent-opt-${activeIntent}` : undefined}
                    >
                      <span>{currentIntent?.label}</span>
                      <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className="text-muted shrink-0 transition-transform"
                        style={{ transform: intentOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                    {intentOpen && (
                      <ul
                        id="intent-listbox"
                        role="listbox"
                        aria-labelledby="intent-label"
                        className="absolute z-50 mt-1.5 w-full bg-canvas border border-line rounded-[var(--r-2)] overflow-hidden shadow-[var(--e-3)]"
                      >
                        {INTENT_OPTIONS.map((o, oi) => (
                          <li
                            key={o.value}
                            id={`intent-opt-${oi}`}
                            role="option"
                            aria-selected={form.intent === o.value}
                            onMouseEnter={() => setActiveIntent(oi)}
                            onClick={() => selectIntent(oi)}
                            className={`px-4 py-3 min-h-11 text-sm cursor-pointer flex items-center gap-2 transition-colors ${
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

                  {/* role="alert" so the failure is announced; previously the
                      message appeared silently for screen-reader users. */}
                  {error && (
                    <div role="alert">
                      <Callout variant="danger" title="Couldn't send">
                        {error}
                      </Callout>
                    </div>
                  )}

                  {/* The button was never disabled, so a double-click posted
                      twice to /api/contact and sent two emails. */}
                  <Button
                    type="submit"
                    variant="volt"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? 'Sending…' : 'Send message'}
                  </Button>
                </form>
              )}
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}

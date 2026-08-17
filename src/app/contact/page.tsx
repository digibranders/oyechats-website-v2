import type { Metadata } from 'next';
import { ID, buildGraph, jsonLd, pageMeta } from '@/lib/seo';
import { Container } from '@/components/ds';
import { ENTITY, REGISTERED_ADDRESS_LINES } from '@/lib/entity';
import ContactClient from './ContactClient';

const title = 'Contact Sales & Support';
const description =
  'Get in touch with OyeChats. Talk to sales about a rollout, request a demo, or reach support. We usually reply within one business day.';

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/contact',
});

// `mainEntity` points at the Organization, not a ContactPoint. A ContactPoint is
// a property OF an organization, not a thing a page can be "about" — and the
// contact details now live on the single Organization node in the site graph.
const graph = buildGraph({
  path: '/contact',
  name: 'Contact OyeChats',
  description,
  type: 'ContactPage',
  about: ID.organization,
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Contact' }],
});

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <ContactClient />

      {/* Consumer Protection (E-Commerce) Rules 2020: r.4(2) requires the legal
          name, principal geographic address and customer-care contact to be
          displayed; r.4(3) requires the grievance officer's name, designation
          and contact. Rendered on the server so it is in the served HTML rather
          than behind the contact form's client bundle. */}
      <section className="bg-canvas border-t border-line py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
            <div>
              <h2 className="type-mono-sm text-muted mb-4">Registered office</h2>
              <address className="type-body-sm text-ink-2 not-italic leading-relaxed">
                {REGISTERED_ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <dl className="type-body-sm text-ink-2 mt-4 leading-relaxed">
                <div className="flex gap-2">
                  <dt className="text-muted">CIN</dt>
                  <dd>{ENTITY.cin}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Phone</dt>
                  <dd>
                    <a href={`tel:${ENTITY.phone.replace(/\s/g, '')}`}>{ENTITY.phone}</a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${ENTITY.supportEmail}`}>{ENTITY.supportEmail}</a>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="type-mono-sm text-muted mb-4">Grievance officer</h2>
              <p className="type-body-sm text-ink-2 leading-relaxed">
                For complaints about our service, your order, or how we handle your data, you can
                escalate directly to {ENTITY.grievanceOfficer.name},{' '}
                {ENTITY.grievanceOfficer.title}.
              </p>
              <dl className="type-body-sm text-ink-2 mt-4 leading-relaxed">
                <div className="flex gap-2">
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${ENTITY.grievanceOfficer.email}`}>
                      {ENTITY.grievanceOfficer.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Phone</dt>
                  <dd>
                    <a href={`tel:${ENTITY.grievanceOfficer.phone.replace(/\s/g, '')}`}>
                      {ENTITY.grievanceOfficer.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Post</dt>
                  <dd>At the registered office address</dd>
                </div>
              </dl>
              <p className="type-body-sm text-ink-2 mt-4 leading-relaxed">
                We acknowledge every grievance within 48 hours and aim to resolve it within one
                month.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

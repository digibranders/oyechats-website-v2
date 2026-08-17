/**
 * Statutory identity of the company behind OyeChats.
 *
 * Consumed by the footer, the contact page, and every document in `legal.ts`.
 * It lives in its own module so the footer does not have to import the entire
 * legal corpus to print one line.
 *
 * Every value here is a statutory identifier, a registered address, or a named
 * natural person. None of it is cosmetic: each field is displayed because a
 * specific rule requires it, and the rule is cited at the field. Verified against
 * the production seller profile and confirmed by the company on 2026-08-17 —
 * don't "tidy" a value without checking the certificate it came from.
 *
 *   Grievance officer — named 2026-08-17. Consumer Protection (E-Commerce) Rules
 *     r.4(5) wants name, contact details AND designation, and binds whoever is
 *     named to the 48-hour acknowledgement / one-month resolution clock
 *     published on /contact. The direct mobile below is a personal number on a
 *     public page and will be scraped; swap it for a landline or a desk line if
 *     that becomes a nuisance — the rule asks for a contact, not a mobile.
 *
 * SELLER OF RECORD — RESOLVED
 *   Digibranders Private Limited is the contracting entity and the only one of
 *   the two candidate names that holds a GST registration. Oyechats Pvt Ltd does
 *   not, so it cannot be the seller of record on a tax invoice.
 *
 *   Confirmed against the production seller profile (`pricing_config` row
 *   `billing.seller_profile`, read 2026-08-17): legal_name "Digibranders Pvt
 *   Ltd", GSTIN 27AAICD9268J1Z0, and the same address lines as below. The
 *   `27AAPFU0939F1ZV` that appears beside "Digibranders Pvt Ltd" across the test
 *   suite is fixture data — its PAN `AAPFU0939F` has `F` (partnership firm) as
 *   its 4th character, where a private limited company carries `C`.
 *
 * NOTE ON THE NAME
 *   The registered name is "Digibranders Private Limited" in full (confirmed
 *   2026-08-17), which is what this module uses. The production seller profile
 *   still holds the abbreviated "Digibranders Pvt Ltd", so tax invoices issued
 *   until that is corrected carry the short form. Invoices snapshot the seller at
 *   issue time (`invoice_service._seller_snapshot`), so fixing the profile
 *   changes future documents only — already-issued invoices keep the old string
 *   by design.
 *
 * GSTIN is deliberately absent from this module. Rule 18 CGST Rules requires it
 * on the name board at the premises and Rule 46 on the tax invoice, where the
 * billing engine already puts it. Nothing requires it on a website.
 */
export const ENTITY = {
  /** Registered name, exactly as on the certificate of incorporation. */
  legalName: 'Digibranders Private Limited',
  tradeName: 'OyeChats',
  /**
   * Companies Act 2013 s.12(3)(c) — required on official publications.
   * Verified against the production seller profile
   * (`pricing_config` row `billing.seller_profile`, read 2026-08-17), which is
   * what the billing engine already prints on every tax invoice. Format checks
   * out: MH = Maharashtra, PTC = private limited company, 72900 = IT services.
   */
  cin: 'U72900MH2021PTC372344',
  /**
   * Consumer Protection (E-Commerce) Rules 2020 r.4(2) — principal geographic
   * address. This is the operating office. Companies Act s.12 concerns the
   * REGISTERED office as filed with the MCA; if the two ever differ, the
   * Companies Act line in the footer needs the registered one.
   */
  registeredOffice: {
    lines: [
      'Office No. 2617, 26th Floor, Solus Building',
      'Hiranandani Estate, Ghodbunder Road',
    ],
    city: 'Thane West',
    state: 'Maharashtra',
    pin: '400607',
    country: 'India',
  },
  /** Customer-care telephone. Same rule as the address. */
  phone: '+91 789 789 6607',
  supportEmail: 'support@oyechats.com',
  /** Courts named in the Terms forum clause. Aligned to the registered office. */
  jurisdiction: 'Thane, Maharashtra, India',
  /**
   * Consumer Protection (E-Commerce) Rules 2020 r.4(3) requires the NAME,
   * designation and contact of a grievance officer to be displayed. A shared
   * alias does not satisfy it — the rule asks for a person. The email reuses the
   * monitored support@ mailbox rather than minting a grievance@ nobody reads.
   */
  grievanceOfficer: {
    name: 'Siddique Ahmed',
    title: 'Grievance Officer and Data Protection Contact',
    email: 'support@oyechats.com',
    phone: '+91 93206 16160',
  },
} as const;

/** Registered office as one line, for prose inside the legal documents. */
export const REGISTERED_ADDRESS = [
  ...ENTITY.registeredOffice.lines,
  ENTITY.registeredOffice.city,
  `${ENTITY.registeredOffice.state} ${ENTITY.registeredOffice.pin}`,
  ENTITY.registeredOffice.country,
].join(', ');

/** Registered office as display lines, for the address block on /contact. */
export const REGISTERED_ADDRESS_LINES: readonly string[] = [
  ENTITY.legalName,
  ...ENTITY.registeredOffice.lines,
  `${ENTITY.registeredOffice.city}, ${ENTITY.registeredOffice.state} ${ENTITY.registeredOffice.pin}`,
  ENTITY.registeredOffice.country,
];

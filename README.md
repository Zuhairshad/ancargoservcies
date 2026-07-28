# AN Cargo Services

Custom-coded replacement for the WordPress site at [ancargoservices.com](https://ancargoservices.com), built to
carry the things WordPress could not: live shipment tracking, a rate calculator, an online booking flow, and
invoices plus QR carton labels generated from the booking.

Layout and spacing follow the [Transo](https://transo-template.framer.website/) template, measured off the
rendered page rather than eyeballed: Inter throughout, 6px radii, 54px buttons, −0.04em tracking on display
sizes, a 1376px content frame, and the same scroll-reveal (fade + 30px rise). The palette is ANCS navy
`#033B5E` and red `#CC000F`.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- Plain CSS — one design-system stylesheet, `src/app/globals.css`. No CSS framework.
- Inter self-hosted from `public/fonts` (no Google Fonts request, so no consent-banner question in the UK)
- JSON-LD structured data, Open Graph share image, sitemap and robots — no analytics or third-party scripts
- `qrcode` for the carton-label QR codes
- **PostgreSQL** via `pg`, behind a store interface — see [Database](#database)
- **SMTP** via `nodemailer`, behind a mailer interface — see [Email](#email)

## Running it

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD and DATABASE_URL
npm run db:migrate           # create the tables
npm run db:seed              # optional: three sample shipments
npm run dev                  # http://localhost:3000
```

Without `DATABASE_URL` the app still runs, on an in-memory store — useful for
front-end work, but bookings vanish on restart and the staff area says so.

```bash
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit
```

### Environment

| Variable               | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `ADMIN_PASSWORD`       | Gate for `/admin`. Staff area returns to the login page without it.     |
| `NEXT_PUBLIC_SITE_URL` | Base URL encoded into carton QR codes. Defaults to the production domain. |
| `DATABASE_URL`         | Postgres connection string. Falls back to an in-memory store when unset.  |
| `SMTP_HOST`            | Mail server. Without it, messages are logged instead of sent.              |
| `SMTP_PORT`            | 587 (STARTTLS) or 465 (implicit TLS). Defaults to 587.                     |
| `SMTP_USER` / `SMTP_PASSWORD` | Mailbox credentials. Omit both for an unauthenticated relay.        |
| `SMTP_FROM`            | From header. Defaults to `AN Cargo Services <info@ancargoservices.com>`.   |
| `OFFICE_INBOX`         | Where enquiries and internal notifications go.                            |

## Pages

| Route                    | What it is                                                                 |
| ------------------------ | -------------------------------------------------------------------------- |
| `/`                      | Home — hero with tracking box, coverage, stats, services, mission, CTA      |
| `/services`              | All seven services                                                         |
| `/services/[slug]`       | Service detail, sticky sidebar nav, long-form copy                         |
| `/rates`                 | Quote calculator, published lane table, the three ways customers buy        |
| `/book`                  | Four-step booking form                                                     |
| `/book/confirmed/[ref]`  | Booking receipt with the new reference                                     |
| `/track`                 | Reference lookup                                                           |
| `/track/[ref]`           | Public tracking timeline — **what the carton QR opens**                     |
| `/offices`               | Six offices, hours, per-branch WhatsApp                                    |
| `/about-us`              | Company background                                                         |
| `/why-choose-us`         | Six reasons                                                                |
| `/faq`                   | Two-column accordion                                                       |
| `/contact`               | Office details and enquiry form                                            |
| `/gallery`               | Grid with a keyboard-navigable lightbox                                    |
| `/blog`, `/blog/[slug]`  | Three articles                                                             |
| `/terms`, `/privacy`     | **Draft** terms of service and privacy policy — need legal review          |
| `/admin`                 | Staff: shipment list                                                       |
| `/admin/shipments/[ref]` | Staff: confirm freight, add status updates, send WhatsApp update            |
| `/admin/label/[ref]`     | **4×6in carton labels with QR**, one per piece, print-ready                |
| `/admin/invoice/[ref]`   | Print-ready invoice                                                        |

Old WordPress URLs (`/our-services`, `/pricing-plan`, `/about`, `/contact-us`, `/track-your-shipment`,
`/projects`) are 301-redirected in `next.config.ts`.

## The shipment record

One type drives the booking form, the invoice, the label, the tracking page and the WhatsApp messages
(`src/lib/shipments.ts`). Everything else is a view of it.

References are `ANCS-YYMM-NNNN` — readable over the phone, unique, and they sort by month.

**Booking → label → tracking:**

1. Customer books at `/book`; the store issues a reference.
2. Staff sign in, weigh the consignment, confirm the freight charge at `/admin/shipments/[ref]`.
3. `/admin/label/[ref]` renders one 4×6 label per piece. The QR encodes the plain tracking URL
   (`/track/ANCS-…`) so any phone camera opens it — no app, nothing to look up. The reference is also printed
   large, because labels get scuffed and wet in transit and a handler has to be able to read and type it.
4. Staff add status updates; each one appears on the public timeline immediately.
5. "Send update" opens WhatsApp with the status and tracking link pre-typed.

## Database

Schema in `db/001_init.sql` — three tables:

- **`shipments`** — one row per consignment. Sender and receiver are stored as
  columns rather than JSON so staff can search by name, phone or city when the
  admin list grows a search box. Money and weight are `numeric`, not float.
- **`shipment_events`** — the status history behind the public tracking timeline.
  Cascades on delete.
- **`ref_counters`** — one row per `YYMM` period holding the last sequence
  issued. `create()` runs inside a transaction and upserts this row, which locks
  it, so two simultaneous bookings can never be handed the same
  `ANCS-YYMM-NNNN`. That is tested with twelve parallel `create()` calls.

```bash
npm run db:migrate   # apply db/*.sql in order (safe to re-run)
npm run db:seed      # insert the three sample shipments, skipping any that exist
npm run db:reset     # drop, migrate, seed — destructive
npm run db:status    # table and row counts
```

`src/lib/store.ts` exposes a `ShipmentStore` interface with two implementations:
`PostgresStore` (used when `DATABASE_URL` is set) and `MemoryStore` (the
fallback). Pages and components only ever see the interface.

### Testing

```bash
DATABASE_URL=postgres://…/scratch_db npm run test:db
```

31 integration checks against a real database — no mocks. Covers read mapping
(`numeric` → number, `null` → `undefined`, dates to `YYYY-MM-DD`, event
ordering), every write path, missing-reference handling, the concurrency
guarantee above, and the schema's own constraints. **Destructive: it resets the
schema first, so point it at a scratch database.**

## Email

`src/lib/mail.ts` exposes a `Mailer` interface with an SMTP implementation
(`nodemailer`) and a logging fallback used when `SMTP_HOST` is unset. Bodies live
in `src/lib/emails.ts` — plain text is the canonical version, with a light HTML
wrapper. No images, no tracking pixels.

| Trigger | Goes to | Contents |
| --- | --- | --- |
| Booking submitted | Customer, bcc office | Reference, summary, estimate, tracking link, "nothing is charged yet" |
| Booking submitted with no email | Office only | Name and phone, so staff know to call |
| Staff confirm freight | Customer | Final freight charge, note about destination duties |
| Status reaches a milestone | Customer | New status, location, note, link to full history |
| Contact form | Office, `Reply-To` the customer | Name, email, phone, message |
| Newsletter sign-up | Office | The address, also stored in `subscribers` |

Milestones that email are collected, departed, customs, out-for-delivery and
delivered. `booked` and `at-hub` stay quiet — the receipt already covered the
first, and the second is internal.

Two deliberate behaviours:

- **A failed send never breaks the action that triggered it.** `send()` catches,
  logs and returns `{ delivered: false }`, so a dead mail server loses a
  notification rather than a customer's booking.
- **Public forms carry a honeypot** — a hidden `company` field. Bots fill it,
  people do not; a filled field returns the success page without sending
  anything.

### Testing

```bash
npm run test:mail
```

32 checks against a real SMTP server started by the test itself — nothing leaves
the machine. Asserts on the messages that actually arrive: recipients, `Reply-To`,
that bcc stays out of the headers, multipart text + HTML, body contents, which
statuses stay quiet, and that a dead server degrades instead of throwing.

## Frontend details

Things worth knowing before editing:

- **Scroll reveal** is one `IntersectionObserver` in `src/components/Reveal.tsx` watching every
  `[data-reveal]`. Stagger with `style={{ '--reveal-delay': '.06s' }}`. Anything already on screen at first
  paint reveals immediately rather than animating in late.
- **Structured data** lives in `src/lib/schema.ts` — `MovingCompany` with the six branches and opening hours
  sitewide, plus `Service`, `FAQPage`, `BlogPosting` and `BreadcrumbList` where they apply. This is what puts
  the phone number and hours into a Google result rather than just a blue link.
- **Share image** is `public/og.jpg`, referenced from Open Graph and Twitter metadata. Regenerate it if the
  headline changes — it matters because these links get pasted into WhatsApp constantly.
- **Accessibility**: skip link as the first tab stop, visible focus rings everywhere, `aria-current` on the
  active nav item, labelled form fields, and the lightbox is a real `role="dialog"` with Escape and arrow keys.
- **The lightbox portals to `document.body`** so no ancestor stacking context can trap it behind the header.
- **`error.tsx`** catches runtime failures with a route back; `loading.tsx` on `/track/[ref]` shows a skeleton,
  since a QR scan often opens that page on a slow phone connection.
- **Honeypot** field named `company` on both public forms. Bots fill it, people do not.

### Testing the frontend

`scripts/` covers the backend; the frontend was verified by driving a real browser: the lightbox (open, keyboard
navigation, scroll lock, Escape), the skip link as first tab stop, the mobile menu open/navigate/close, footer
subscribe feedback, breadcrumb markup, and **no horizontal overflow on any of the 15 public pages at 390px**.
A link crawler confirmed 24 pages with no broken internal links.

## Known gaps

Honest list of what is scaffolded but not finished:

- **Email needs SMTP credentials.** The wiring is done and tested; it needs the real host, user and password for
  the `info@ancargoservices.com` mailbox. Add SPF and DKIM records for the domain too, or receipts will land in
  spam. Deliverability is a DNS job, not a code one.
- **No unsubscribe link yet.** The `subscribers` table has an `unsubscribed` flag but nothing sets it. Needed
  before any bulk send.
- **Terms and privacy are drafts.** Both pages carry a visible notice saying so. The privacy policy matters most:
  ANCS delivers in the UK and EU, so UK GDPR duties likely apply and the named data controller needs confirming.
- **Auth is a single shared password.** Fine for two or three people; replace with per-user accounts before more.
- **Invoices are not sequentially numbered** and carry no NTN or GST registration. Both are needed before these
  go to customers — see the note at the bottom of the invoice template.
- **Rate table is one published lane.** `src/data/rates.ts` has PKR 550/kg for UK sea freight — the only rate
  published on the current site. Every other lane returns "quote on request" rather than inventing a number.
  Fill in the real figures and the calculator starts pricing them.
- **Testimonials section is empty on purpose.** The block is built and marked as awaiting real quotes. The old
  site shipped the WordPress theme's demo names (John Peterson, Emily Carter, …); we are not repeating that.
- **Stats are the six defensible ones** (15+ years, 6 offices, 4 modes, 200+ destinations, 4 courier partners,
  24/7 support). The old About page rendered its counters as literal `00`. No invented figures here.
- **Photography is placeholder.** Images come from the Transo template plus a few from the current ANCS site.
  **Confirm licensing before launch**, or replace with ANCS's own photography — this design leans on large
  images and it will show.
- **WhatsApp is deep-link only.** Every button opens WhatsApp with the message pre-typed, which works today and
  costs nothing. Automatic sending needs the WhatsApp Business API, a Meta Business account and approved
  templates.
- **No courier API integration.** Statuses are staff-entered. If the DHL/FedEx/UPS/Aramex accounts include
  tracking APIs, their status can be pulled onto the same timeline.

## Content

All copy lives in `src/data`, not in components: `site.ts` (company details, offices, nav, stats),
`services.ts`, `rates.ts`, `faq.ts`, `posts.ts`. Editing a rate or a phone number is a one-line change in one
file.

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
- `qrcode` for the carton-label QR codes
- No database yet — see [Data layer](#data-layer)

## Running it

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit
```

### Environment

| Variable               | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `ADMIN_PASSWORD`       | Gate for `/admin`. Staff area returns to the login page without it.     |
| `NEXT_PUBLIC_SITE_URL` | Base URL encoded into carton QR codes. Defaults to the production domain. |

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
| `/gallery`, `/blog`      | Gallery grid; three articles                                               |
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

## Data layer

`src/lib/store.ts` defines a `ShipmentStore` interface with a `MemoryStore` implementation seeded with three
sample shipments (`ANCS-2607-0148`, `-0149`, `-0150`).

**Bookings work end to end, but nothing survives a server restart and nothing is shared between instances.**
That is deliberate for this phase — it let the booking flow, admin screens, labels and tracking be built and
demonstrated before the database exists. Swapping in Postgres means writing one more implementation of that
interface; no page or component changes.

## Known gaps

Honest list of what is scaffolded but not finished:

- **No database.** As above.
- **`/api/enquiry` and `/api/subscribe` log to the console** instead of sending mail. Point them at the
  `info@ancargoservices.com` mailbox over SMTP, or a transactional provider.
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

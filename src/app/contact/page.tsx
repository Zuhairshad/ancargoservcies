import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { offices, site, whatsappLink } from '@/data/site'
import { mailConfigured } from '@/lib/mail'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact AN Cargo Services in Faisalabad, Lahore, Karachi, Manchester, Dubai or Saudi Arabia.',
}

type Props = { searchParams: Promise<{ sent?: string }> }

const feedback: Record<string, { tone: 'ok' | 'bad'; text: string }> = {
  ok: { tone: 'ok', text: 'Thank you — your message is with our team. We usually reply the same working day.' },
  queued: {
    tone: 'ok',
    text: 'Thank you — your message was received. If you need an answer urgently, WhatsApp is faster.',
  },
  invalid: { tone: 'bad', text: 'Please add your name, a valid email address and a message, then send again.' },
}

export default async function ContactPage({ searchParams }: Props) {
  const { sent } = await searchParams
  const status = sent ? feedback[sent] : undefined
  const head = offices.find((o) => o.head)!

  return (
    <>
      <PageHero
        title="Contact us."
        intro="Tell us what you are sending and where it needs to go. We will come back with a rate and a collection date."
        banner={{ src: '/images/contact-banner.webp', alt: 'AN Cargo Services warehouse operations' }}
      />

      <section className="band">
        <div className="frame card-grid--two card-grid" style={{ gridTemplateColumns: undefined }}>
          <div className="stack" data-reveal>
            <p className="eyebrow">Get in touch</p>
            <h2 className="h-section">
              <span className="muted">At {site.name}, </span>
              we are here to make your shipment straightforward.
            </h2>
            <p className="lead">
              Whether you have a question about a service, need help with a shipment in transit, or want a rate for
              something unusual, our team in Faisalabad will answer.
            </p>

            <div className="summary-grid">
              <div>
                <span>Head office</span>
                <span>{head.address}</span>
              </div>
              <div>
                <span>Phone</span>
                <b>
                  <a href={`tel:${site.phoneHref}`} style={{ textDecoration: 'none' }}>
                    {site.phone}
                  </a>
                </b>
              </div>
              <div>
                <span>WhatsApp</span>
                <b>
                  <a href={whatsappLink(`Hello ${site.shortName}, I have an enquiry.`)} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                    {site.mobile}
                  </a>
                </b>
              </div>
              <div>
                <span>Email</span>
                <b>
                  <a href={`mailto:${site.email}`} style={{ textDecoration: 'none' }}>
                    {site.email}
                  </a>
                </b>
              </div>
            </div>
          </div>

          <form className="form-card" data-reveal style={{ ['--reveal-delay' as string]: '.08s' }} action="/api/enquiry" method="post">
            {status && (
              <p
                className="form-note"
                role="status"
                style={{ color: status.tone === 'ok' ? 'var(--ok)' : 'var(--accent)', fontWeight: 600 }}
              >
                {status.text}
              </p>
            )}

            {/* Honeypot: hidden from people, filled in by most form bots. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <label htmlFor="company">Company</label>
              <input id="company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="c-first">First name *</label>
                <input id="c-first" name="firstName" required />
              </div>
              <div className="field">
                <label htmlFor="c-last">Last name</label>
                <input id="c-last" name="lastName" />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="c-email">Email *</label>
                <input id="c-email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="c-phone">Phone</label>
                <input id="c-phone" name="phone" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="c-message">Your message *</label>
              <textarea id="c-message" name="message" required placeholder="What are you sending, and where to?" />
            </div>
            <button className="btn" type="submit">
              Submit
            </button>
            {!mailConfigured && (
              <p className="form-note">
                Note for the site owner: <code>SMTP_HOST</code> is not set, so messages are written to the server log
                rather than emailed. See the README.
              </p>
            )}
          </form>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

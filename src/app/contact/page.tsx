import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { offices, site, whatsappLink } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact AN Cargo Services in Faisalabad, Lahore, Karachi, Manchester, Dubai or Saudi Arabia.',
}

export default function ContactPage() {
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
            <p className="form-note">
              This form posts to <code>/api/enquiry</code>, which is scaffolded but not yet wired to a mailbox — see the
              README for what to connect.
            </p>
          </form>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

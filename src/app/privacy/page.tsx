import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What personal information AN Cargo Services collects, why, and how long it is kept.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy." intro="What we collect, why we collect it, and how long we keep it." />
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame" style={{ maxWidth: '46rem' }}>
          <div className="prose" data-reveal>
            <div className="notice" style={{ marginBottom: '2rem' }}>
              <span>
                <b>Draft for review.</b> Because {site.shortName} delivers in the United Kingdom and the EU, UK GDPR
                obligations are likely to apply to those shipments. Have this checked before publishing, and confirm who
                the named data controller is.
              </span>
            </div>

            <h2>What we collect</h2>
            <ul className="bullets">
              <li>
                <b>Booking details</b> — sender and recipient names, addresses, phone numbers and email addresses, plus a
                description of the consignment and its declared value.
              </li>
              <li>
                <b>Enquiries</b> — the name, email, phone number and message you submit through the contact form.
              </li>
              <li>
                <b>Newsletter</b> — your email address, if you choose to give it.
              </li>
            </ul>

            <h2>Why we collect it</h2>
            <p>
              To carry out the shipment you asked us to carry out. We cannot collect a parcel without an address, clear
              customs without a declaration, or tell you where your cargo is without a way to contact you. For the
              newsletter, the basis is your consent, which you may withdraw at any time.
            </p>

            <h2>Who we share it with</h2>
            <p>
              Only those who need it to move your consignment: our own offices, the airline or shipping line, our courier
              partners ({site.couriers.join(', ')}), and customs authorities at origin and destination. We do not sell
              personal information and we do not share it for advertising.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Shipment records are kept for as long as tax and customs rules require, which in practice means several
              years after delivery. Enquiries are kept while we deal with them and for a reasonable period afterwards.
              Newsletter addresses are kept until you unsubscribe.
            </p>

            <h2>Tracking and cookies</h2>
            <p>
              This site sets no advertising or analytics cookies. It loads no third-party scripts and no tracking pixels.
              Fonts are served from our own domain rather than a font network. The only data leaving your browser is what
              you type into a form.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask what we hold about you, ask us to correct it, and ask us to delete it where no legal obligation
              requires us to keep it. Write to <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond
              within a month.
            </p>

            <h2>Contact</h2>
            <p>
              {site.name}, {site.address.line1}, {site.address.line2}, {site.address.region}, Pakistan.{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone}
            </p>

            <p className="muted">Last updated 28 July 2026.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}

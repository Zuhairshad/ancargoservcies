import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import BookingForm from '@/components/BookingForm'
import CtaBand from '@/components/CtaBand'
import { site, whatsappLink } from '@/data/site'

export const metadata: Metadata = {
  title: 'Book A Shipment',
  description: 'Book a collection with AN Cargo Services. Tell us the sender, the receiver and what is in the box.',
}

export default function BookPage() {
  return (
    <>
      <PageHero
        title="Book a shipment."
        intro="Four short steps. We collect, weigh, confirm the freight charge and send your invoice with a tracking reference."
      />

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame card-grid card-grid--two">
          <BookingForm />

          <div className="stack" data-reveal style={{ ['--reveal-delay' as string]: '.08s' }}>
            <h2 className="h-sub">What happens next</h2>
            <ol className="timeline">
              <li data-done="true">
                <div>
                  <b>You submit this form</b>
                  <span>You get a reference in the format ANCS-YYMM-NNNN straight away.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>We call to confirm collection</b>
                  <span>Usually the same working day, on the number you give us.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>We collect, pack and weigh</b>
                  <span>The freight charge is set on the weighed figure, not the estimate.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>Invoice and carton label issued</b>
                  <span>The label carries a QR code that opens your tracking page when scanned.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>Track it to the door</b>
                  <span>Status updates at every milestone until it is delivered.</span>
                </div>
              </li>
            </ol>

            <div className="notice">
              <span>
                <b>Prefer to do this by message?</b> Send the same details on WhatsApp and we will book it for you.
              </span>
              <a
                className="btn btn--sm btn--wa"
                href={whatsappLink(`Hello ${site.shortName}, I would like to book a shipment.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

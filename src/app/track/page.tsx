import type { Metadata } from 'next'
import TrackForm from '@/components/TrackForm'
import CtaBand from '@/components/CtaBand'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description: 'Enter your ANCS reference to see where your shipment is, or scan the QR code on your carton label.',
}

export default function TrackPage() {
  return (
    <>
      <section className="track-hero">
        <div className="frame track-hero__in">
          <h1 className="h-title" data-reveal>
            Track your shipment.
          </h1>
          <p className="lead lead--onDark" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
            Enter the reference from your receipt or carton label. It looks like ANCS-2607-0148. You can also scan the QR
            code on the label with any phone camera.
          </p>
          <div data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
            <TrackForm autoFocus />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="frame stack">
          <h2 className="h-section" data-reveal>
            Lost your reference?
          </h2>
          <p className="lead measure" data-reveal>
            Call the office that booked the shipment, or message us on WhatsApp with the sender name and the collection
            date and we will find it. Our team is on {site.phone} during office hours.
          </p>
          <div className="notice" data-reveal>
            <span>
              <b>Sample references for testing this scaffold:</b> ANCS-2607-0148 (in transit), ANCS-2607-0149
              (delivered), ANCS-2607-0150 (booked, awaiting collection).
            </span>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

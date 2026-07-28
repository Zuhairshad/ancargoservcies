import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CtaBand from '@/components/CtaBand'
import { store } from '@/lib/store'
import { modeLabels } from '@/data/rates'
import { formatPkr } from '@/lib/quote'
import { site, whatsappLink } from '@/data/site'
import { WhatsApp } from '@/components/Icons'

type Params = { params: Promise<{ ref: string }> }

export const metadata: Metadata = { title: 'Booking received', robots: { index: false } }

export default async function BookingConfirmedPage({ params }: Params) {
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  return (
    <>
      <section className="track-hero">
        <div className="frame track-hero__in">
          <p className="eyebrow eyebrow--onDark">Booking received</p>
          <h1 className="h-title">Your reference is {shipment.ref}.</h1>
          <p className="lead lead--onDark">
            Save it — you will need it to track the shipment, and our team will refer to it when they call you to arrange
            collection.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="frame stack--lg" style={{ display: 'grid' }}>
          <div className="summary-grid" data-reveal>
            <div>
              <span>Collection from</span>
              <b>
                {shipment.sender.city}, {shipment.sender.country}
              </b>
            </div>
            <div>
              <span>Delivery to</span>
              <b>
                {shipment.receiver.city}, {shipment.receiver.country}
              </b>
            </div>
            <div>
              <span>Service</span>
              <b>{modeLabels[shipment.mode]}</b>
            </div>
            <div>
              <span>Pieces / weight</span>
              <b>
                {shipment.pieces} / {shipment.weightKg} kg
              </b>
            </div>
            <div>
              <span>Estimate</span>
              <b>{shipment.estimatePkr === null ? 'On confirmation' : formatPkr(shipment.estimatePkr)}</b>
            </div>
            <div>
              <span>Preferred collection</span>
              <b>{shipment.pickupDate ?? 'To be arranged'}</b>
            </div>
          </div>

          <div className="notice" data-reveal>
            <span>
              <b>Nothing is charged yet.</b> We weigh the consignment at collection and confirm the freight figure before
              it moves. The estimate above is based on the weight you entered.
            </span>
          </div>

          <div className="row" data-reveal>
            <Link className="btn" href={`/track/${shipment.ref}`}>
              Track this shipment
            </Link>
            <a
              className="btn btn--wa"
              href={whatsappLink(`Hello ${site.shortName}, I have just booked shipment ${shipment.ref}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              Message us about it
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

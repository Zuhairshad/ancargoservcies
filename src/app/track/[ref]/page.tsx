import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import TrackForm from '@/components/TrackForm'
import CtaBand from '@/components/CtaBand'
import { store } from '@/lib/store'
import { statusLabels, statuses, statusIndex, normaliseRef } from '@/lib/shipments'
import { modeLabels } from '@/data/rates'
import { formatDateTime } from '@/lib/dates'
import { site, whatsappLink } from '@/data/site'
import { WhatsApp } from '@/components/Icons'

type Params = { params: Promise<{ ref: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { ref } = await params
  return { title: `Tracking ${normaliseRef(decodeURIComponent(ref))}`, robots: { index: false } }
}

export default async function TrackRefPage({ params }: Params) {
  const { ref } = await params
  const reference = normaliseRef(decodeURIComponent(ref))
  const shipment = await store.get(reference)

  if (!shipment) {
    return (
      <section className="band">
        <div className="frame stack">
          <h1 className="h-title">We cannot find {reference}.</h1>
          <p className="lead measure">
            Check the reference against your receipt — it looks like AN00001. If it still does not work, message us and we will trace it by sender name.
          </p>
          <TrackForm autoFocus />
          <div className="row">
            <a
              className="btn btn--wa"
              href={whatsappLink(`Hello ${site.shortName}, I cannot find shipment ${reference}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    )
  }

  const currentIndex = statusIndex(shipment.status)
  const tone = shipment.status === 'delivered' ? 'done' : shipment.confirmed ? 'active' : 'pending'
  const lastEvent = shipment.events[shipment.events.length - 1]

  return (
    <>
      <section className="track-hero">
        <div className="frame track-hero__in">
          <p className="eyebrow eyebrow--onDark">Shipment</p>
          <div className="shipment-head">
            <span className="shipment-ref">{shipment.ref}</span>
            <span className="status-pill" data-tone={tone}>
              <i />
              {statusLabels[shipment.status]}
            </span>
          </div>
          <p className="lead lead--onDark">
            {shipment.sender.city} → {shipment.receiver.city}, {shipment.receiver.country} ·{' '}
            {modeLabels[shipment.mode]}
            {lastEvent.location ? ` · last seen ${lastEvent.location}` : ''}
          </p>
        </div>
      </section>

      <section className="band">
        <div className="frame stack--xl" style={{ display: 'grid' }}>
          <div className="summary-grid">
            <div>
              <span>Pieces</span>
              <b>{shipment.pieces}</b>
            </div>
            <div>
              <span>Weight</span>
              <b>{shipment.weightKg} kg</b>
            </div>
            <div>
              <span>Service</span>
              <b>{modeLabels[shipment.mode]}</b>
            </div>
            <div>
              <span>Booked</span>
              <b>{formatDateTime(shipment.createdAt)}</b>
            </div>
            <div>
              <span>Receiver</span>
              <b>{shipment.receiver.name}</b>
            </div>
            <div>
              <span>Destination</span>
              <b>
                {shipment.receiver.city}, {shipment.receiver.country}
              </b>
            </div>
          </div>

          <div className="stack">
            <h2 className="h-section">Progress</h2>
            <ol className="timeline">
              {statuses.map((status) => {
                const event = shipment.events.find((e) => e.status === status)
                const done = statusIndex(status) <= currentIndex
                return (
                  <li key={status} data-done={done ? 'true' : 'false'}>
                    <div>
                      <b>{statusLabels[status]}</b>
                      {event ? (
                        <span>
                          {formatDateTime(event.at)}
                          {event.location ? ` · ${event.location}` : ''}
                          {event.note ? ` · ${event.note}` : ''}
                        </span>
                      ) : !done ? (
                        <span className="muted">Not yet</span>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="row">
            <a
              className="btn btn--wa"
              href={whatsappLink(`Hello ${site.shortName}, I am asking about shipment ${shipment.ref}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              Ask about this shipment
            </a>
            <Link className="btn btn--outline" href="/track">
              Track another
            </Link>
          </div>

          {!shipment.confirmed && (
            <div className="notice">
              <span>
                <b>This booking is not confirmed yet.</b> Our team weighs the consignment and confirms the freight charge
                before it moves. You will receive the invoice once it is confirmed.
              </span>
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Need this shipment expedited?" body="Message the office handling it and we will tell you what is possible." />
    </>
  )
}

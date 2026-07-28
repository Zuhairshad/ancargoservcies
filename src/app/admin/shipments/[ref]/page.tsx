import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import { store } from '@/lib/store'
import { statuses, statusLabels, trackingUrl } from '@/lib/shipments'
import { modeLabels } from '@/data/rates'
import { formatDateTime } from '@/lib/dates'
import { formatPkr } from '@/lib/quote'
import { site, whatsappLink } from '@/data/site'
import { confirmShipment, isStaff, updateStatus } from '../../actions'

type Params = { params: Promise<{ ref: string }> }

export const metadata: Metadata = { title: 'Shipment', robots: { index: false } }

export const dynamic = 'force-dynamic'

export default async function AdminShipmentPage({ params }: Params) {
  if (!(await isStaff())) redirect('/admin/login')
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  const waMessage = `${site.shortName} update for ${shipment.ref}: status is now ${statusLabels[shipment.status]}. Track it here: ${trackingUrl(shipment.ref)}`

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame stack--lg" style={{ display: 'grid' }}>
          <div className="shipment-head">
            <div>
              <span className="stat-label">Reference</span>
              <div className="shipment-ref">{shipment.ref}</div>
            </div>
            <span className="admin-actions">
              <Link className="btn btn--sm btn--outline" href={`/admin/label/${shipment.ref}`}>
                Print label
              </Link>
              <Link className="btn btn--sm btn--outline" href={`/admin/invoice/${shipment.ref}`}>
                Print invoice
              </Link>
              <Link className="btn btn--sm btn--outline" href={`/track/${shipment.ref}`}>
                Public view
              </Link>
              <a className="btn btn--sm btn--wa" href={whatsappLink(waMessage, shipment.sender.phone.replace(/\D/g, ''))} target="_blank" rel="noopener noreferrer">
                Send update
              </a>
            </span>
          </div>

          <div className="summary-grid">
            <div>
              <span>Sender</span>
              <b>{shipment.sender.name}</b>
              <span>
                {shipment.sender.address}, {shipment.sender.city}
              </span>
              <span>{shipment.sender.phone}</span>
            </div>
            <div>
              <span>Receiver</span>
              <b>{shipment.receiver.name}</b>
              <span>
                {shipment.receiver.address}, {shipment.receiver.city}
              </span>
              <span>{shipment.receiver.phone}</span>
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
              <span>Contents</span>
              <b>{shipment.contents}</b>
            </div>
            <div>
              <span>Declared value</span>
              <b>{formatPkr(shipment.declaredValuePkr)}</b>
            </div>
            <div>
              <span>Estimate given</span>
              <b>{shipment.estimatePkr === null ? '—' : formatPkr(shipment.estimatePkr)}</b>
            </div>
            <div>
              <span>Freight charged</span>
              <b>{shipment.freightPkr === null ? 'Not set' : formatPkr(shipment.freightPkr)}</b>
            </div>
          </div>

          {!shipment.confirmed && (
            <form className="form-card status-form" action={confirmShipment}>
              <input type="hidden" name="ref" value={shipment.ref} />
              <div className="field">
                <label htmlFor="freightPkr">Confirm freight charge (PKR)</label>
                <input id="freightPkr" name="freightPkr" type="number" min="0" required defaultValue={shipment.estimatePkr ?? undefined} />
              </div>
              <button className="btn" type="submit">
                Confirm booking
              </button>
              <p className="form-note">Set after weighing. Confirming makes the invoice printable.</p>
            </form>
          )}

          <form className="form-card status-form" action={updateStatus}>
            <input type="hidden" name="ref" value={shipment.ref} />
            <div className="field">
              <label htmlFor="status">New status</label>
              <select id="status" name="status" defaultValue={shipment.status}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" placeholder="Port Qasim, Karachi" />
            </div>
            <div className="field">
              <label htmlFor="note">Note</label>
              <input id="note" name="note" placeholder="ETA Felixstowe 12 Aug" />
            </div>
            <button className="btn" type="submit">
              Add update
            </button>
          </form>

          <div className="stack">
            <h2 className="h-sub">History</h2>
            <ol className="timeline">
              {shipment.events
                .slice()
                .reverse()
                .map((event, i) => (
                  <li key={`${event.status}-${i}`} data-done="true">
                    <div>
                      <b>{statusLabels[event.status]}</b>
                      <span>
                        {formatDateTime(event.at)}
                        {event.location ? ` · ${event.location}` : ''}
                        {event.note ? ` · ${event.note}` : ''}
                      </span>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import PrintButton from '@/components/PrintButton'
import { store } from '@/lib/store'
import { trackingUrl } from '@/lib/shipments'
import { qrDataUrl } from '@/lib/qr'
import { modeLabels } from '@/data/rates'
import { formatLabelDate } from '@/lib/dates'
import { site } from '@/data/site'
import { isStaff } from '../../actions'

type Params = { params: Promise<{ ref: string }> }

export const metadata: Metadata = { title: 'Carton label', robots: { index: false } }

export const dynamic = 'force-dynamic'

/**
 * 4×6in thermal label. The QR encodes the public tracking URL as plain text, so
 * any phone camera opens it — no app, nothing to look up. The reference is also
 * printed large, because labels get scuffed and wet in transit and a handler has
 * to be able to read and type it.
 */
export default async function LabelPage({ params }: Params) {
  if (!(await isStaff())) redirect('/admin/login')
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  const url = trackingUrl(shipment.ref)
  const qr = await qrDataUrl(url)

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame">
          <div className="print-toolbar">
            <PrintButton label="Print labels" />
            <span className="stat-label">
              {shipment.pieces} label{shipment.pieces === 1 ? '' : 's'} · 4×6in · QR opens {url}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {Array.from({ length: shipment.pieces }, (_, i) => (
              <div className="label-sheet" key={i}>
                <div className="label-sheet__top">
                  <img src="/images/logo.webp" alt={site.name} />
                  <div>
                    {modeLabels[shipment.mode]}
                    <br />
                    {formatLabelDate(shipment.createdAt)}
                  </div>
                </div>

                <div className="label-sheet__body">
                  <dl>
                    <div>
                      <dt>Reference</dt>
                      <dd className="label-sheet__ref">{shipment.ref}</dd>
                    </div>
                    <div>
                      <dt>To</dt>
                      <dd>
                        {shipment.receiver.name}
                        <br />
                        {shipment.receiver.address}
                        <br />
                        {shipment.receiver.city}
                        <br />
                        {shipment.receiver.country}
                        <br />
                        {shipment.receiver.phone}
                      </dd>
                    </div>
                    <div>
                      <dt>Piece</dt>
                      <dd>
                        {i + 1} of {shipment.pieces} · {shipment.weightKg} kg total
                      </dd>
                    </div>
                    <div>
                      <dt>From</dt>
                      <dd>
                        {shipment.sender.name}, {shipment.sender.city}
                      </dd>
                    </div>
                  </dl>
                  <img className="label-sheet__qr" src={qr} alt={`QR code linking to ${url}`} />
                </div>

                <div className="label-sheet__bars" aria-hidden="true" />
                <div className="label-sheet__foot">
                  <span>Scan to track</span>
                  <span>{site.mobile}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

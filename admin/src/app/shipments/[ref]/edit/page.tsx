import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import AdminBar from '@/components/AdminBar'
import GoodsTable from '@/components/GoodsTable'
import { isStaff, updateShipment } from '@/actions'
import { store } from '@/lib/store'
import { modeLabels, destinations } from '@/data/rates'

export const metadata: Metadata = { title: 'Edit Booking' }
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ ref: string }> }

const modes = Object.keys(modeLabels) as (keyof typeof modeLabels)[]

export default async function EditBookingPage({ params }: Params) {
  if (!(await isStaff())) redirect('/login')
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  const s = shipment

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame stack--lg" style={{ maxWidth: '54rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <h1 className="h-section">Edit Booking</h1>
            <span className="stat-label">{s.ref}</span>
            <Link className="btn btn--sm btn--outline" href={`/shipments/${s.ref}`} style={{ marginLeft: 'auto' }}>
              Cancel
            </Link>
          </div>

          <form className="form-card stack--lg" action={updateShipment}>
            <input type="hidden" name="ref" value={s.ref} />

            <p className="form-section-label">Sender (Shipper)</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="senderName">Name *</label>
                <input id="senderName" name="senderName" required defaultValue={s.sender.name} />
              </div>
              <div className="field">
                <label htmlFor="senderPhone">Phone / WhatsApp *</label>
                <input id="senderPhone" name="senderPhone" required defaultValue={s.sender.phone} />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="senderEmail">Email</label>
                <input id="senderEmail" name="senderEmail" type="email" defaultValue={s.sender.email ?? ''} />
              </div>
              <div className="field">
                <label htmlFor="senderCity">City *</label>
                <input id="senderCity" name="senderCity" required defaultValue={s.sender.city} />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="senderAddress">Collection address *</label>
                <input id="senderAddress" name="senderAddress" required defaultValue={s.sender.address} />
              </div>
              <div className="field">
                <label htmlFor="senderCountry">Country</label>
                <input id="senderCountry" name="senderCountry" defaultValue={s.sender.country} />
              </div>
            </div>

            <p className="form-section-label">Receiver (Consignee)</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="receiverName">Name *</label>
                <input id="receiverName" name="receiverName" required defaultValue={s.receiver.name} />
              </div>
              <div className="field">
                <label htmlFor="receiverPhone">Phone *</label>
                <input id="receiverPhone" name="receiverPhone" required defaultValue={s.receiver.phone} />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="receiverEmail">Email</label>
                <input id="receiverEmail" name="receiverEmail" type="email" defaultValue={s.receiver.email ?? ''} />
              </div>
              <div className="field">
                <label htmlFor="receiverCity">City / Postcode *</label>
                <input id="receiverCity" name="receiverCity" required defaultValue={s.receiver.city} />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="receiverAddress">Delivery address *</label>
                <input id="receiverAddress" name="receiverAddress" required defaultValue={s.receiver.address} />
              </div>
              <div className="field">
                <label htmlFor="receiverCountry">Destination *</label>
                <select id="receiverCountry" name="receiverCountry" required defaultValue={s.receiver.country}>
                  {destinations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  {!destinations.includes(s.receiver.country as typeof destinations[number]) && (
                    <option value={s.receiver.country}>{s.receiver.country}</option>
                  )}
                </select>
              </div>
            </div>

            <p className="form-section-label">Shipment</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="pieces">No. of pieces *</label>
                <input id="pieces" name="pieces" type="number" min="1" required defaultValue={s.pieces} />
              </div>
              <div className="field">
                <label htmlFor="weightKg">Total weight (kg) *</label>
                <input id="weightKg" name="weightKg" type="number" min="0.1" step="0.1" required defaultValue={s.weightKg} />
              </div>
            </div>

            <div className="field">
              <label>Description of Goods</label>
              <GoodsTable initialData={s.goods ?? undefined} initialRows={s.goods ? s.goods.length : 3} />
            </div>

            <div className="field" style={{ maxWidth: '16rem' }}>
              <label htmlFor="declaredValuePkr">Declared value (PKR)</label>
              <input id="declaredValuePkr" name="declaredValuePkr" type="number" min="0" defaultValue={s.declaredValuePkr || ''} />
            </div>

            <p className="form-section-label">Service</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="mode">Service type *</label>
                <select id="mode" name="mode" required defaultValue={s.mode}>
                  {modes.map((m) => (
                    <option key={m} value={m}>{modeLabels[m]}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="pickupDate">Collection date</label>
                <input id="pickupDate" name="pickupDate" type="date" defaultValue={s.pickupDate ?? ''} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="btn" type="submit">Save changes</button>
              <Link className="btn btn--outline" href={`/shipments/${s.ref}`}>Cancel</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

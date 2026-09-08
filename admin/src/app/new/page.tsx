import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import { isStaff, createManualBooking } from '@/actions'
import { modeLabels, destinations } from '@/data/rates'

export const metadata: Metadata = { title: 'New Booking' }

const modes = Object.keys(modeLabels) as (keyof typeof modeLabels)[]

export default async function NewBookingPage() {
  if (!(await isStaff())) redirect('/login')

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame stack--lg" style={{ maxWidth: '54rem' }}>
          <h1 className="h-section">New Booking</h1>

          <form className="form-card stack--lg" action={createManualBooking}>
            <p className="form-section-label">Sender (Shipper)</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="senderName">Name *</label>
                <input id="senderName" name="senderName" required />
              </div>
              <div className="field">
                <label htmlFor="senderPhone">Phone / WhatsApp *</label>
                <input id="senderPhone" name="senderPhone" required placeholder="+92 300 1234567" />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="senderEmail">Email</label>
                <input id="senderEmail" name="senderEmail" type="email" />
              </div>
              <div className="field">
                <label htmlFor="senderCity">City *</label>
                <input id="senderCity" name="senderCity" required placeholder="Faisalabad" />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="senderAddress">Collection address *</label>
                <input id="senderAddress" name="senderAddress" required />
              </div>
              <div className="field">
                <label htmlFor="senderCountry">Country</label>
                <input id="senderCountry" name="senderCountry" defaultValue="Pakistan" />
              </div>
            </div>

            <p className="form-section-label">Receiver (Consignee)</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="receiverName">Name *</label>
                <input id="receiverName" name="receiverName" required />
              </div>
              <div className="field">
                <label htmlFor="receiverPhone">Phone *</label>
                <input id="receiverPhone" name="receiverPhone" required />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="receiverEmail">Email</label>
                <input id="receiverEmail" name="receiverEmail" type="email" />
              </div>
              <div className="field">
                <label htmlFor="receiverCity">City / Postcode *</label>
                <input id="receiverCity" name="receiverCity" required placeholder="Manchester M14 5TQ" />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="receiverAddress">Delivery address *</label>
                <input id="receiverAddress" name="receiverAddress" required />
              </div>
              <div className="field">
                <label htmlFor="receiverCountry">Destination *</label>
                <select id="receiverCountry" name="receiverCountry" required defaultValue={destinations[0]}>
                  {destinations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="form-section-label">Shipment</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="pieces">No. of pieces *</label>
                <input id="pieces" name="pieces" type="number" min="1" defaultValue="1" required />
              </div>
              <div className="field">
                <label htmlFor="weightKg">Total weight (kg) *</label>
                <input id="weightKg" name="weightKg" type="number" min="0.1" step="0.1" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="contents">Description of goods *</label>
              <textarea id="contents" name="contents" required rows={3}
                placeholder="Be specific — this goes on the customs invoice." />
            </div>

            <div className="field" style={{ maxWidth: '16rem' }}>
              <label htmlFor="declaredValuePkr">Declared value (PKR)</label>
              <input id="declaredValuePkr" name="declaredValuePkr" type="number" min="0" />
            </div>

            <p className="form-section-label">Service</p>

            <div className="form-row">
              <div className="field">
                <label htmlFor="mode">Service type *</label>
                <select id="mode" name="mode" required defaultValue="door-to-door">
                  {modes.map((m) => (
                    <option key={m} value={m}>{modeLabels[m]}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="pickupDate">Collection date</label>
                <input id="pickupDate" name="pickupDate" type="date" />
              </div>
            </div>

            <div>
              <button className="btn" type="submit">Create booking</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import PrintButton from '@/components/PrintButton'
import { store } from '@/lib/store'
import { modeLabels } from '@/data/rates'
import { formatDate } from '@/lib/dates'
import { formatPkr } from '@/lib/quote'
import { site } from '@/data/site'
import { isStaff } from '../../actions'

type Params = { params: Promise<{ ref: string }> }

export const metadata: Metadata = { title: 'Invoice', robots: { index: false } }

export const dynamic = 'force-dynamic'

export default async function InvoicePage({ params }: Params) {
  if (!(await isStaff())) redirect('/admin/login')
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  const freight = shipment.freightPkr

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame">
          <div className="print-toolbar">
            <PrintButton label="Print invoice" />
            {freight === null && (
              <span className="stat-label">
                Freight not confirmed yet — confirm the charge on the shipment page before issuing this.
              </span>
            )}
          </div>

          <div className="invoice-sheet">
            <div className="invoice-sheet__top">
              <div>
                <img src="/images/logo.webp" alt={site.name} />
                <p className="invoice-sheet__terms" style={{ marginTop: '0.75rem' }}>
                  {site.address.line1}
                  <br />
                  {site.address.line2}, {site.address.region}
                  <br />
                  {site.phone} · {site.email}
                </p>
              </div>
              <div className="invoice-sheet__meta">
                <b>Invoice</b>
                <span>Reference {shipment.ref}</span>
                <span>Issued {formatDate(new Date().toISOString())}</span>
                <span>Booked {formatDate(shipment.createdAt)}</span>
              </div>
            </div>

            <div className="invoice-sheet__parties">
              <div>
                <h3>Billed to</h3>
                <p>
                  {shipment.sender.name}
                  <br />
                  {shipment.sender.address}
                  <br />
                  {shipment.sender.city}, {shipment.sender.country}
                  <br />
                  {shipment.sender.phone}
                </p>
              </div>
              <div>
                <h3>Consigned to</h3>
                <p>
                  {shipment.receiver.name}
                  <br />
                  {shipment.receiver.address}
                  <br />
                  {shipment.receiver.city}, {shipment.receiver.country}
                  <br />
                  {shipment.receiver.phone}
                </p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Pieces</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {modeLabels[shipment.mode]} — {shipment.sender.city} to {shipment.receiver.city},{' '}
                      {shipment.receiver.country}
                      <br />
                      <span className="muted">{shipment.contents}</span>
                    </td>
                    <td className="num">{shipment.pieces}</td>
                    <td className="num">{shipment.weightKg} kg</td>
                    <td className="num">{freight === null ? '—' : formatPkr(freight)}</td>
                  </tr>
                  <tr>
                    <td>Packing and handling</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num">Included</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="invoice-sheet__total">
              <span className="stat-label">Total due</span>
              <b>{freight === null ? 'Pending confirmation' : formatPkr(freight)}</b>
            </div>

            <p className="invoice-sheet__terms">
              Declared value of goods: {formatPkr(shipment.declaredValuePkr)}. Freight is charged on chargeable weight,
              the greater of actual and volumetric weight. Duties, taxes and any charges levied at the destination are
              payable by the consignee and are not included above. Claims for loss or damage must be raised within 48
              hours of delivery.
              <br />
              <br />
              <b>Before issuing these to customers:</b> add your NTN and any GST registration, and switch invoice
              numbering to a sequential series if your tax filing requires it — see the README.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

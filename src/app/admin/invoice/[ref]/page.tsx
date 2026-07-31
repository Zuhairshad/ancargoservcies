import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import PrintButton from '@/components/PrintButton'
import { store } from '@/lib/store'
import { modeLabels } from '@/data/rates'
import { formatDate } from '@/lib/dates'
import { formatPkr, pkr } from '@/lib/quote'
import { site } from '@/data/site'
import { isStaff } from '../../actions'

type Params = { params: Promise<{ ref: string }> }

export const metadata: Metadata = { title: 'Invoice', robots: { index: false } }
export const dynamic = 'force-dynamic'

function amountInWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function below1000(n: number): string {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + below1000(n % 100) : '')
  }

  const n = Math.round(amount)
  if (n === 0) return 'Zero'
  const crore = Math.floor(n / 10_000_000)
  const lakh = Math.floor((n % 10_000_000) / 100_000)
  const thousand = Math.floor((n % 100_000) / 1_000)
  const rest = n % 1_000

  const parts: string[] = []
  if (crore) parts.push(below1000(crore) + ' Crore')
  if (lakh) parts.push(below1000(lakh) + ' Lakh')
  if (thousand) parts.push(below1000(thousand) + ' Thousand')
  if (rest) parts.push(below1000(rest))
  return parts.join(' ')
}

// Breakdown of standard charges included in every sea shipment invoice
const charges = [
  { label: 'Token Charges', key: 'token' },
  { label: 'Port Labour Handling', key: 'labour' },
  { label: 'Custom Clearance', key: 'custom' },
  { label: 'ANF & DC Charges', key: 'anf' },
  { label: 'Warfage', key: 'warfage' },
  { label: 'Agency Fees', key: 'agency' },
]

export default async function InvoicePage({ params }: Params) {
  if (!(await isStaff())) redirect('/admin/login')
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  const freight = shipment.freightPkr
  const today = formatDate(new Date().toISOString())
  const modeLabel = modeLabels[shipment.mode]
  const isSeaMode = shipment.mode === 'sea-lcl' || shipment.mode === 'sea-fcl'

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

            {/* ── Title ── */}
            <div className="invoice-sheet__title">INVOICE</div>

            {/* ── Top: Shipper (left) + Invoice meta (right) ── */}
            <div className="invoice-sheet__top">
              <div className="invoice-sheet__shipper">
                <div className="invoice-sheet__shipper-label">SHIPPER</div>
                <div className="invoice-sheet__shipper-name">{shipment.sender.name}</div>
                <div className="invoice-sheet__shipper-addr">
                  {shipment.sender.address}<br />
                  {shipment.sender.city}, {shipment.sender.country}
                  {shipment.sender.phone && <><br />{shipment.sender.phone}</>}
                </div>
              </div>

              <div className="invoice-sheet__meta">
                <table className="invoice-sheet__meta-table">
                  <tbody>
                    <tr><th>INVOICE #</th><td>{shipment.ref}</td></tr>
                    <tr><th>YOUR REFERENCE NO.</th><td>{shipment.ref}</td></tr>
                    <tr><th>MAWB #</th><td>—</td></tr>
                    <tr><th>INV. DATE</th><td>{today}</td></tr>
                    <tr><th>COUNTER NO.</th><td>—</td></tr>
                    <tr><th>CBM</th><td>—</td></tr>
                    <tr><th>MOD</th><td>{modeLabel.toUpperCase()}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Shipment details grid ── */}
            <div className="invoice-sheet__details">
              <table className="invoice-sheet__details-table">
                <tbody>
                  <tr>
                    <th>ORIGIN</th>
                    <td>{shipment.sender.city.toUpperCase()}-PK</td>
                    <th>DESTINATION</th>
                    <td>{shipment.receiver.city.toUpperCase()}, {shipment.receiver.country.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <th>CARTONS / PKGS</th>
                    <td>{shipment.pieces} {shipment.pieces === 1 ? 'CARTON' : 'CARTONS'}</td>
                    <th>WEIGHT</th>
                    <td>{shipment.weightKg} KG</td>
                  </tr>
                  <tr>
                    <th>GD NO.</th>
                    <td>—</td>
                    <th>SERVICE</th>
                    <td>{isSeaMode ? 'BY SEA CUSTOM' : modeLabel.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Commodity row ── */}
            <div className="invoice-sheet__commodity">
              <table className="invoice-sheet__commodity-table">
                <tbody>
                  <tr>
                    <th>COMMODITY</th>
                    <td>{shipment.contents}</td>
                    <th>EXCHANGE RATE</th>
                    <th>TOTAL AMOUNT IN US$</th>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="muted">USD: —</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="muted">GBP: —</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Charges table ── */}
            <div className="table-wrap">
              <table className="data invoice-sheet__charges">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '60%' }}>PARTICULARS / DETAIL</th>
                    <th scope="col">CHARGES DETAIL</th>
                    <th scope="col" style={{ textAlign: 'right' }}>CHARGES (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {freight !== null ? (
                    <tr>
                      <td>
                        {modeLabel} — {shipment.sender.city} to {shipment.receiver.city}, {shipment.receiver.country}
                        <br />
                        <span className="muted">{shipment.contents} · {shipment.pieces} pcs · {shipment.weightKg} kg</span>
                      </td>
                      <td>Freight &amp; Handling</td>
                      <td className="num" style={{ textAlign: 'right' }}>{pkr.format(freight)}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={3} className="muted" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        Freight not confirmed yet
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Packing &amp; Labelling</td>
                    <td>Included</td>
                    <td className="num" style={{ textAlign: 'right' }}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Total row ── */}
            <div className="invoice-sheet__total-row">
              <div className="invoice-sheet__words">
                {freight !== null
                  ? <>Rupees <strong>{amountInWords(freight).toUpperCase()} ONLY/-</strong></>
                  : <span className="muted">Amount pending confirmation</span>
                }
              </div>
              <div className="invoice-sheet__total-amt">
                <span className="stat-label">TOTAL DUE</span>
                <b>{freight === null ? '—' : `Rs. ${pkr.format(freight)}`}</b>
              </div>
            </div>

            {/* ── Footer notes ── */}
            <div className="invoice-sheet__notes">
              <p>Thank you for choosing <strong>{site.name}</strong> for your shipment handling.</p>
              <p>Note: All cheques / Pay Orders should be crossed in favour of <strong>AN CARGO SERVICES</strong>.</p>
              <p>If you have any objection, please intimate us within Three (3) days from the date of issue,
                otherwise invoice will be considered as final.</p>
              <p className="muted" style={{ marginTop: '0.25rem' }}>
                Declared value of goods: {formatPkr(shipment.declaredValuePkr)}. Duties, taxes and charges levied at
                destination are payable by the consignee.
              </p>
            </div>

            {/* ── Company footer ── */}
            <div className="invoice-sheet__footer">
              <div className="invoice-sheet__footer-logo">
                <img src="/images/logo.webp" alt={site.name} />
              </div>
              <div className="invoice-sheet__footer-addr">
                <div>{site.address.line1}</div>
                <div>{site.address.line2}, {site.address.region}</div>
                <div>Pakistan</div>
              </div>
              <div className="invoice-sheet__footer-contact">
                <div><span>TEL:</span> {site.phone}</div>
                <div><span>CELL:</span> {site.mobile}</div>
                <div><span>EMAIL:</span> {site.email}</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

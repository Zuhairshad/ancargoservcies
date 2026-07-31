import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import PrintButton from '@/components/PrintButton'
import { store } from '@/lib/store'
import { modeLabels } from '@/data/rates'
import { formatDate } from '@/lib/dates'
import { pkr } from '@/lib/quote'
import { site } from '@/data/site'
import { isStaff } from '../../actions'

type Params = { params: Promise<{ ref: string }> }

export const metadata: Metadata = { title: 'Invoice', robots: { index: false } }
export const dynamic = 'force-dynamic'

function amountInWords(n: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  function b1000(x: number): string {
    if (x === 0) return ''
    if (x < 20) return ones[x]
    if (x < 100) return tens[Math.floor(x / 10)] + (x % 10 ? ' ' + ones[x % 10] : '')
    return ones[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' + b1000(x % 100) : '')
  }
  n = Math.round(n)
  if (n === 0) return 'Zero'
  const parts: string[] = []
  const crore = Math.floor(n / 10_000_000); if (crore) parts.push(b1000(crore) + ' Crore')
  const lakh = Math.floor((n % 10_000_000) / 100_000); if (lakh) parts.push(b1000(lakh) + ' Lakh')
  const thou = Math.floor((n % 100_000) / 1_000); if (thou) parts.push(b1000(thou) + ' Thousand')
  const rest = n % 1_000; if (rest) parts.push(b1000(rest))
  return parts.join(' ')
}

export default async function InvoicePage({ params }: Params) {
  if (!(await isStaff())) redirect('/admin/login')
  const { ref } = await params
  const shipment = await store.get(decodeURIComponent(ref))
  if (!shipment) notFound()

  const freight = shipment.freightPkr
  const isSeaMode = shipment.mode === 'sea-lcl' || shipment.mode === 'sea-fcl'
  const modeLabel = isSeaMode ? 'BY SEA CUSTOM' : modeLabels[shipment.mode].toUpperCase()

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame">
          <div className="print-toolbar">
            <PrintButton label="Print invoice" />
            {freight === null && (
              <span className="stat-label">Freight not confirmed — set it on the shipment page first.</span>
            )}
          </div>

          <div className="inv">

            {/* ── Logo ── */}
            <div className="inv__logo">
              <img src="/images/logo.webp" alt={site.name} />
            </div>

            {/* ── INVOICE title ── */}
            <div className="inv__title">INVOICE</div>

            {/* ── SHIPPER ── */}
            <div className="inv__shipper">
              <div className="inv__label">SHIPPER</div>
              <div className="inv__shipper-name">{shipment.sender.name}</div>
              <div>{shipment.sender.address}</div>
              <div>{shipment.sender.city}, {shipment.sender.country}{shipment.sender.phone ? `   PH#: ${shipment.sender.phone}` : ''}</div>
            </div>

            {/* ── Shipment grid (left) + Invoice meta (right) ── */}
            <div className="inv__mid">
              <table className="inv__grid">
                <tbody>
                  <tr>
                    <th>ORIGIN</th>
                    <td>{shipment.sender.city.toUpperCase()}-PK</td>
                  </tr>
                  <tr>
                    <th>CARTONS/BALES/PKGS</th>
                    <td>{shipment.pieces} — {shipment.pieces === 1 ? 'CARTON' : 'CARTONS'}</td>
                  </tr>
                  <tr>
                    <th>DESTINATION</th>
                    <td>{shipment.receiver.city.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <th>WEIGHT</th>
                    <td>{shipment.weightKg} KG</td>
                  </tr>
                  <tr>
                    <th>GD NO</th>
                    <td>—</td>
                  </tr>
                  <tr>
                    <th>CBM</th>
                    <td>{isSeaMode ? 'LCL' : '—'}</td>
                  </tr>
                </tbody>
              </table>

              <table className="inv__meta">
                <tbody>
                  <tr>
                    <th>INVOICE #</th>
                    <td>{shipment.ref}</td>
                  </tr>
                  <tr>
                    <th>YOUR REFERENCE NO.</th>
                    <td>{shipment.ref}</td>
                  </tr>
                  <tr>
                    <th>MAWB#</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>INV. DATE</th>
                    <td>{formatDate(new Date().toISOString())}</td>
                  </tr>
                  <tr>
                    <th>COUNTER NO;</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>CBM</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>MOD</th>
                    <td>{modeLabel}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Commodity row ── */}
            <table className="inv__commodity">
              <thead>
                <tr>
                  <th></th>
                  <th>COMMODITY</th>
                  <th>EXCHANGE RATE</th>
                  <th>TOTAL AMOUNT IN US$</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td rowSpan={2} className="inv__commodity-val">{shipment.contents.toUpperCase()}</td>
                  <td>USD:</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>GBP:</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            {/* ── Charges table ── */}
            <table className="inv__charges">
              <thead>
                <tr>
                  <th>PARTICULARS / DETAIL</th>
                  <th>Charges Detail</th>
                  <th></th>
                  <th>CHARGES</th>
                  <th>Rs.</th>
                </tr>
              </thead>
              <tbody>
                {freight !== null ? (
                  <tr>
                    <td>
                      {modeLabels[shipment.mode]} — {shipment.sender.city} to {shipment.receiver.city}, {shipment.receiver.country}
                      <br /><span style={{ color: 'var(--body-2)' }}>{shipment.contents} · {shipment.pieces} pcs · {shipment.weightKg} kg</span>
                    </td>
                    <td>Freight &amp; Handling</td>
                    <td></td>
                    <td></td>
                    <td className="inv__amt">{pkr.format(freight)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--body-2)' }}>
                      Freight not confirmed yet
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Packing &amp; Labelling</td>
                  <td>Included</td>
                  <td></td>
                  <td></td>
                  <td className="inv__amt">—</td>
                </tr>
              </tbody>
            </table>

            {/* ── Total row ── */}
            <div className="inv__total">
              <div className="inv__words">
                {freight !== null
                  ? `Rupees ${amountInWords(freight).toUpperCase()} ONLY/-`
                  : 'Amount pending confirmation'}
              </div>
              <div className="inv__total-amt">
                {freight !== null ? pkr.format(freight) : '—'}
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="inv__notes">
              <p>Thank for choosing AN CARGO for your shipment handling with carrier</p>
              <p>Note: all cheques/Pay Orders should be crossed in favor of &nbsp;&nbsp;<strong>AN CARGO SERVICES</strong></p>
              <p>If you have any objection, Please intimate us within Three (3) days from the date of issue,</p>
              <p>Other wise Invoice will be considered as final.</p>
            </div>

            {/* ── Company footer ── */}
            <div className="inv__footer">
              <div className="inv__footer-addr">
                <div>4-Z 14/A, CHENAB MARKET</div>
                <div>MADINA TOWN, FAISALABAD</div>
                <div>PAKISTAN</div>
              </div>
              <div className="inv__footer-contact">
                <div><span>TEL:-</span> +92-41-873 7799</div>
                <div><span>CELL:-</span> 92-307-6998742</div>
                <div><span>EMAIL:-</span> ancargoservices@gmail.com</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import { store } from '@/lib/store'
import { statusLabels } from '@/lib/shipments'
import { modeLabels } from '@/data/rates'
import { formatDate } from '@/lib/dates'
import { formatPkr } from '@/lib/quote'
import { isStaff } from './actions'

export const metadata: Metadata = { title: 'Shipments', robots: { index: false } }

/** Reads cookies and live shipment state — never prerender this at build time. */
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isStaff())) redirect('/admin/login')
  const shipments = await store.list()

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame stack--lg" style={{ display: 'grid' }}>
          <div className="shipment-head">
            <h1 className="h-section">Shipments</h1>
            <span className="stat-label">{shipments.length} on file</span>
          </div>

          <div className="notice notice--dev">
            <span>
              <b>Shipments are held in memory in this scaffold.</b> Bookings work and persist while the server runs, but
              they are cleared on restart. Phase 3 swaps <code>MemoryStore</code> for Postgres behind the same interface —
              no page or component changes needed.
            </span>
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Booked</th>
                  <th scope="col">Route</th>
                  <th scope="col">Service</th>
                  <th scope="col">Pieces / kg</th>
                  <th scope="col">Freight</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.ref}>
                    <td className="num">
                      <Link href={`/admin/shipments/${s.ref}`}>
                        <b>{s.ref}</b>
                      </Link>
                    </td>
                    <td className="num">{formatDate(s.createdAt)}</td>
                    <td>
                      {s.sender.city} → {s.receiver.city}
                    </td>
                    <td>{modeLabels[s.mode]}</td>
                    <td className="num">
                      {s.pieces} / {s.weightKg}
                    </td>
                    <td className="num">
                      {s.freightPkr === null ? <span className="muted">Not set</span> : formatPkr(s.freightPkr)}
                    </td>
                    <td>{statusLabels[s.status]}</td>
                    <td>
                      <span className="admin-actions">
                        <Link className="btn btn--sm btn--outline" href={`/admin/label/${s.ref}`}>
                          Label
                        </Link>
                        <Link className="btn btn--sm btn--outline" href={`/admin/invoice/${s.ref}`}>
                          Invoice
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

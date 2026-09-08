import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminBar from '@/components/AdminBar'
import { isPersistent, store } from '@/lib/store'
import { statusLabels } from '@/lib/shipments'
import { modeLabels } from '@/data/rates'
import { formatDate } from '@/lib/dates'
import { formatPkr } from '@/lib/quote'
import { isStaff } from '@/actions'

export const metadata: Metadata = { title: 'Shipments' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  if (!(await isStaff())) redirect('/login')
  const shipments = await store.list()

  return (
    <>
      <AdminBar />
      <section className="band">
        <div className="frame stack--lg" style={{ display: 'grid' }}>
          <div className="shipment-head">
            <h1 className="h-section">Shipments</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="stat-label">{shipments.length} on file</span>
              <Link className="btn btn--sm" href="/new">+ New booking</Link>
            </div>
          </div>

          {!isPersistent && (
            <div className="notice notice--dev">
              <b>No database connected — shipments are in memory only.</b> Set <code>DATABASE_URL</code> to persist them.
            </div>
          )}

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
                      <Link href={`/shipments/${s.ref}`}>
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
                        <Link className="btn btn--sm btn--outline" href={`/shipments/${s.ref}/label`}>
                          Label
                        </Link>
                        <Link className="btn btn--sm btn--outline" href={`/shipments/${s.ref}/invoice`}>
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

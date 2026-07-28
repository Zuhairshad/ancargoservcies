import Link from 'next/link'
import { logout } from '@/app/admin/actions'

export default function AdminBar() {
  return (
    <div className="admin-bar no-print">
      <div className="frame admin-bar__in">
        <b>Staff area</b>
        <Link href="/admin">Shipments</Link>
        <Link href="/">View site</Link>
        <form action={logout}>
          <button className="btn btn--sm btn--outline" type="submit" style={{ color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.3)' }}>
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

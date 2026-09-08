import Link from 'next/link'
import { logout } from '@/actions'

export default function AdminBar() {
  return (
    <div className="admin-bar no-print">
      <div className="frame admin-bar__in">
        <b>AN Cargo Admin</b>
        <Link href="/">Shipments</Link>
        <Link href="/new">New booking</Link>
        <a href={process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ancargoservices.com'} target="_blank" rel="noopener noreferrer">
          View site
        </a>
        <form action={logout}>
          <button
            className="btn btn--sm btn--outline"
            type="submit"
            style={{ color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.3)' }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

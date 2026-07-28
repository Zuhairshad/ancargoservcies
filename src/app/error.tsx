'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app] unhandled error:', error)
  }, [error])

  return (
    <section className="page-hero">
      <div className="frame page-hero__in">
        <h1 className="h-title">Something went wrong.</h1>
        <p className="lead">
          Sorry — that page failed to load. Try again, and if it keeps happening, call us on the number below and we will
          sort it out directly.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn" type="button" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn--outline" href="/">
            Back to home
          </Link>
          <Link className="btn btn--outline" href="/contact">
            Contact us
          </Link>
        </div>
        {error.digest && <p className="form-note">Reference for our team: {error.digest}</p>}
      </div>
    </section>
  )
}

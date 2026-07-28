import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <div className="frame page-hero__in">
          <h1 className="h-title">Page not found.</h1>
          <p className="lead">
            The page you were looking for has moved or never existed. If you were tracking a shipment, the reference may
            have been mistyped.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link className="btn" href="/track">
              Track a shipment
            </Link>
            <Link className="btn btn--outline" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

import Link from 'next/link'

export default function GiftsBand() {
  return (
    <section className="band centered">
      <div className="frame centered__in">
        <div className="avatars" aria-hidden="true" data-reveal>
          <img src="/images/avatar-1.webp" alt="" width={42} height={42} />
          <img src="/images/avatar-2.webp" alt="" width={42} height={42} />
          <img src="/images/avatar-3.webp" alt="" width={42} height={42} />
        </div>
        <h2 className="h-section" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
          Send gifts, parcels and documents home.
        </h2>
        <p className="lead" data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
          Gifts, letters, important documents, money orders and household items to your loved ones — packed safely and
          shipped at special discounted freight rates.
        </p>
        <Link className="btn" href="/book" data-reveal style={{ ['--reveal-delay' as string]: '.18s' }}>
          Send A Parcel
        </Link>
      </div>
    </section>
  )
}

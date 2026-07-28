import Link from 'next/link'
import { stats } from '@/data/site'
import Photo from '@/components/Photo'

export default function StatsSplit() {
  return (
    <section className="stats-split">
      <Photo
        src="/images/supervisor.webp"
        alt="Driver checking a delivery manifest beside a cargo truck"
        sizes="(max-width: 1080px) 100vw, 45vw"
      />
      <div className="stats-split__panel">
        <h2 className="h-section" data-reveal>
          We move parcels, gifts, documents and commercial freight — by air, sea, road and rail.
        </h2>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} data-reveal style={{ ['--reveal-delay' as string]: `${0.06 * (i + 1)}s` }}>
              <span className="stat">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <Link className="btn" href="/about-us" data-reveal style={{ ['--reveal-delay' as string]: '.42s' }}>
          About Company
        </Link>
      </div>
    </section>
  )
}

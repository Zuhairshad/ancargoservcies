import Link from 'next/link'
import { stats } from '@/data/site'

export default function StatsSplit() {
  return (
    <section className="stats-split">
      <img src="/images/supervisor.webp" alt="Warehouse supervisor checking stock" width={760} height={790} />
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

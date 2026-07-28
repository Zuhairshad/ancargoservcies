import { offices, site } from '@/data/site'
import Photo from '@/components/Photo'

/**
 * Transo puts a dotted US map here. ANCS ships out of Pakistan, so the same
 * treatment carries a route map of the six real offices instead — the geography
 * is content, and a US map would be wrong.
 */
export default function Coverage() {
  return (
    <section className="band">
      <div className="frame coverage">
        <div className="coverage__col">
          <div
            className="coverage__map"
            role="img"
            aria-label={`Route map showing ${site.shortName} offices in ${offices.map((o) => o.city).join(', ')}`}
            data-reveal
          >
            <svg viewBox="0 0 450 285" aria-hidden="true" preserveAspectRatio="none">
              <g fill="none" stroke="#d7dee1" strokeWidth="1.2" strokeDasharray="4 5">
                <path d="M310 128 Q235 52 132 74" />
                <path d="M310 128 Q272 150 238 178" />
                <path d="M310 128 Q274 132 200 148" />
                <path d="M310 128 Q305 175 288 200" />
              </g>
            </svg>
            {offices.map((office) => (
              <span
                key={office.city}
                className="coverage__pin"
                data-flip={office.map.flip ? 'true' : 'false'}
                style={{ left: `${office.map.x}%`, top: `${office.map.y}%` }}
              >
                <i />
                <span>{office.city}</span>
              </span>
            ))}
          </div>

          <p className="lead" data-reveal style={{ ['--reveal-delay' as string]: '.08s' }}>
            {site.name} is positioned across three countries, letting us serve clients on a global scale.
          </p>

          <div className="coverage__num" data-reveal style={{ ['--reveal-delay' as string]: '.14s' }}>
            <span className="stat-xl">{site.destinations}</span>
            <span className="stat-label">Destinations</span>
          </div>
        </div>

        <div className="coverage__card" data-reveal style={{ ['--reveal-delay' as string]: '.1s' }}>
          <Photo
            src="/images/warehouse.webp"
            alt="Warehouse and consolidation facility"
            sizes="(max-width: 1080px) 100vw, 52vw"
          />
          <div className="coverage__offices">
            <b>Our offices</b>
            {offices.map((office) => (
              <span key={office.city}>
                {office.city}
                {office.head ? ' — head office' : `, ${office.country}`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

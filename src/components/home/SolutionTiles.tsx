import Link from 'next/link'
import { featuredServices } from '@/data/services'
import { ArrowCircle } from '@/components/PageHero'

export default function SolutionTiles() {
  const tiles = featuredServices
  const delays = ['0s', '.08s', '.04s', '.12s']

  return (
    <section className="band">
      <div className="frame">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            Our solutions
          </p>
          <h2 className="h-section" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
            Efficient cargo, global reach.
          </h2>
        </div>

        <div className="tiles">
          {tiles.map((service, i) => (
            <Link
              key={service.slug}
              className="tile"
              href={`/services/${service.slug}`}
              data-reveal
              style={{ ['--reveal-delay' as string]: delays[i] }}
            >
              <img src={service.card} alt="" width={900} height={400} />
              <b>{service.name}</b>
              <ArrowCircle />
            </Link>
          ))}
        </div>

        <div className="center-cta">
          <Link className="btn" href="/rates" data-reveal>
            Get A Quote
          </Link>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { featuredServices } from '@/data/services'
import { ArrowCircle } from '@/components/PageHero'
import Photo from '@/components/Photo'

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
              <Photo
                src={service.card}
                alt=""
                sizes="(max-width: 860px) 100vw, 50vw"
              />
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

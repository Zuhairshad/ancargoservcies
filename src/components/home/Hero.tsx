import Link from 'next/link'
import { featuredServices } from '@/data/services'
import { serviceIcons } from '@/components/Icons'
import TrackForm from '@/components/TrackForm'

export default function Hero() {
  const railServices = featuredServices

  return (
    <section className="hero">
      <div className="hero__main">
        <img src="/images/hero-highway.webp" alt="Freight moving along an open highway" width={1600} height={1060} />
        <Link className="hero__badge" href="/rates" data-reveal style={{ ['--reveal-delay' as string]: '.05s' }}>
          Send gifts home at discounted freight rates <b>See Rates</b>
        </Link>
        <h1 className="h-hero" data-reveal style={{ ['--reveal-delay' as string]: '.15s' }}>
          Door to door, anywhere in the world.
        </h1>
        <div data-reveal style={{ ['--reveal-delay' as string]: '.25s' }}>
          <TrackForm />
        </div>
      </div>

      <aside className="hero__rail">
        <img
          src="/images/hero-rail.webp"
          alt="Driver checking a delivery manifest beside a cargo truck"
          width={560}
          height={510}
        />
        <div className="hero__rail-body">
          <div className="hero__services">
            {railServices.map((service, i) => {
              const Icon = serviceIcons[service.slug]
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  data-reveal
                  style={{ ['--reveal-delay' as string]: `${0.3 + i * 0.06}s` }}
                >
                  {Icon && <Icon />}
                  {service.name}
                </Link>
              )
            })}
          </div>
          <p data-reveal style={{ ['--reveal-delay' as string]: '.54s' }}>
            AN Cargo Services delivers safe packing, transparent pricing and right-time delivery for parcels, gifts,
            documents and commercial freight worldwide.
          </p>
        </div>
      </aside>
    </section>
  )
}

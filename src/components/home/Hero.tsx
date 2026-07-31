import Link from 'next/link'
import { featuredServices } from '@/data/services'
import { serviceIcons } from '@/components/Icons'
import TrackForm from '@/components/TrackForm'
import Photo from '@/components/Photo'

export default function Hero() {
  const railServices = featuredServices

  return (
    <section className="hero">
      <div className="hero__main">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-highway-1280.webp"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero-720.mp4" type="video/mp4" />
        </video>
        <Link className="hero__badge" href="/rates" data-rise style={{ ['--reveal-delay' as string]: '.05s' }}>
          {/* Two lengths of the same line: the long one will not fit on one row
              of a phone, and wrapping it turns the pill into a three-line blob. */}
          <span className="hero__badge-wide">Send gifts home at discounted freight rates</span>
          <span className="hero__badge-narrow">Discounted rates on gifts</span>
          <b>See Rates</b>
        </Link>
        <h1 className="h-hero" data-rise style={{ ['--reveal-delay' as string]: '.15s' }}>
          Door to door, anywhere in the world.
        </h1>
        <div data-rise style={{ ['--reveal-delay' as string]: '.25s' }}>
          <TrackForm />
        </div>
      </div>

      <aside className="hero__rail">
        <Photo
          src="/images/hero-rail.webp"
          alt="Warehouse supervisor checking a consignment"
          sizes="(max-width: 860px) 100vw, 27vw"
          eager
        />
        <div className="hero__rail-body">
          <div className="hero__services">
            {railServices.map((service, i) => {
              const Icon = serviceIcons[service.slug]
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  data-rise
                  style={{ ['--reveal-delay' as string]: `${0.3 + i * 0.06}s` }}
                >
                  {Icon && <Icon />}
                  {service.name}
                </Link>
              )
            })}
          </div>
          <p data-rise style={{ ['--reveal-delay' as string]: '.54s' }}>
            AN Cargo Services delivers safe packing, transparent pricing and right-time delivery for parcels, gifts,
            documents and commercial freight worldwide.
          </p>
        </div>
      </aside>
    </section>
  )
}

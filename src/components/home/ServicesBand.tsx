import Link from 'next/link'
import { secondaryServices } from '@/data/services'
import { site } from '@/data/site'
import { ArrowCircle } from '@/components/PageHero'
import { ArrowRight } from '@/components/Icons'
import Photo from '@/components/Photo'

export default function ServicesBand() {
  const cards = secondaryServices

  return (
    <section className="band band--navy">
      <div className="frame">
        <div className="split-head">
          <p className="eyebrow eyebrow--onDark" data-reveal>
            Our services
          </p>
          <div className="split-head__body">
            <h2 className="h-section" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
              End-to-end cargo from Pakistan to the world, at rates below market average.
            </h2>
            <p className="lead lead--onDark measure" data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
              From door-to-door collection to sea and air consolidation, port-to-port and postal, {site.name} provides
              safe, cost-effective shipping tailored to what you are sending.
            </p>
            <Link
              className="btn btn--white"
              href="/services"
              data-reveal
              style={{ ['--reveal-delay' as string]: '.18s' }}
            >
              All Services
            </Link>
          </div>
        </div>

        <div className="svc-cards">
          {cards.map((service, i) => (
            <Link
              key={service.slug}
              className="svc-card"
              href={`/services/${service.slug}`}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 0.08}s` }}
            >
              <div className="svc-card__top">
                <em>{String(i + 1).padStart(2, '0')}</em>
                <b>{service.name}</b>
                <ArrowCircle />
              </div>
              <div className="svc-card__img">
                <Photo
                  src={service.card}
                  alt=""
                  sizes="(max-width: 860px) 100vw, 33vw"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="quotes">
          <p className="eyebrow eyebrow--onDark" data-reveal>
            1–6
          </p>
          <div>
            <div className="quotes__head">
              <h3 className="h-sub" data-reveal>
                Hear what our clients say.
              </h3>
              <Link className="text-link" href="/why-choose-us" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
                Why They Choose Us
                <ArrowRight />
              </Link>
            </div>
            <div className="quotes__body">
              <span className="pending" data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
                Awaiting real client quotes
              </span>
              <blockquote data-reveal style={{ ['--reveal-delay' as string]: '.18s' }}>
                “Your client’s words go here — the section is built and ready, it just needs quotes from customers who
                agree to be named.”
              </blockquote>
              <div className="byline" data-reveal style={{ ['--reveal-delay' as string]: '.24s' }}>
                <span className="byline__avatar" aria-hidden="true" />
                <div>
                  <b>Client name</b>
                  <span>Company, city</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="partners" data-reveal>
          <div>{site.shortName} Network</div>
          {site.couriers.map((c) => (
            <div key={c}>{c}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

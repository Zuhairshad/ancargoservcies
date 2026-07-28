import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero, { ArrowCircle } from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { services } from '@/data/services'
import Photo from '@/components/Photo'
import { stats } from '@/data/site'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Door-to-door, air cargo and courier, sea freight FCL and LCL, port-to-port, road and rail, and postal services from Pakistan worldwide.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Services."
        intro="Six ways to move your cargo, supporting local and global shipping operations efficiently and reliably worldwide."
        badge={{ label: 'Send gifts home at discounted rates', cta: 'See Rates', href: '/rates' }}
      />

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame">
          <div className="card-grid">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                className="card"
                href={`/services/${service.slug}`}
                data-reveal
                style={{ ['--reveal-delay' as string]: `${(i % 3) * 0.07}s` }}
              >
                <div className="card__img">
                  <Photo
                    src={service.card}
                    alt=""
                    sizes="(max-width: 860px) 100vw, (max-width: 1080px) 50vw, 33vw"
                  />
                </div>
                <div className="card__body">
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  <b>{service.name}</b>
                  <p>{service.short}</p>
                </div>
                <div className="card__foot">
                  <span className="stat-label">Read more</span>
                  <ArrowCircle />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="frame stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} data-reveal style={{ ['--reveal-delay' as string]: `${i * 0.05}s` }}>
              <span className="stat">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}

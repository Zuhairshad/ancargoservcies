import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowCircle } from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import { serviceIcons } from '@/components/Icons'
import { serviceSchema } from '@/lib/schema'
import { getService, services } from '@/data/services'
import Photo from '@/components/Photo'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.name, description: service.summary, images: [{ url: '/og.jpg' }] },
  }
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 2)

  return (
    <>
      <section className="detail-hero">
        <Photo src={service.banner} alt=""  sizes="100vw" priority />
        <div className="detail-hero__in">
          <Link className="hero__badge" href="/services">
            {service.name} <b>All Services</b>
          </Link>
          <h1 className="h-title">{service.name}</h1>
          <p className="lead">{service.summary}</p>
        </div>
      </section>

      <section className="band">
        <div className="frame" style={{ paddingBottom: '1.5rem' }}>
          <Breadcrumbs
            trail={[
              { name: 'Home', href: '/' },
              { name: 'Services', href: '/services' },
              { name: service.name, href: `/services/${service.slug}` },
            ]}
          />
        </div>
        <div className="frame detail-grid">
          <aside className="detail-aside">
            <nav className="detail-aside__nav" aria-label="Services">
              {services.map((s) => {
                const Icon = serviceIcons[s.slug]
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    aria-current={s.slug === service.slug ? 'page' : undefined}
                  >
                    {Icon && <Icon />}
                    {s.name}
                  </Link>
                )
              })}
            </nav>
            <Photo src="/images/sidebar-service.webp" alt="" sizes="(max-width: 1080px) 100vw, 23vw" />
          </aside>

          <div className="prose" data-reveal>
            <h2>{service.name} — how it works</h2>
            {service.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}

            <h3>What is included</h3>
            <ul className="bullets">
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3>Why choose AN Cargo Services for this?</h3>
            <ul className="bullets">
              {service.why.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p>{service.closing}</p>

            <div className="row" style={{ marginTop: '1.5rem' }}>
              <Link className="btn" href="/book">
                Book this service
              </Link>
              <Link className="btn btn--outline" href="/rates">
                See rates
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="frame">
          <div className="section-head">
            <p className="eyebrow" data-reveal>
              Similar solutions
            </p>
            <h2 className="h-section" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
              Efficient cargo, global reach.
            </h2>
          </div>
          <div className="tiles">
            {others.map((s, i) => (
              <Link
                key={s.slug}
                className="tile"
                href={`/services/${s.slug}`}
                data-reveal
                style={{ ['--reveal-delay' as string]: `${i * 0.08}s` }}
              >
                <Photo src={s.card} alt=""  sizes="(max-width: 860px) 100vw, 50vw" />
                <b>{s.name}</b>
                <ArrowCircle />
              </Link>
            ))}
          </div>
          <div className="center-cta">
            <Link className="btn" href="/services">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={serviceSchema(service)} />
    </>
  )
}

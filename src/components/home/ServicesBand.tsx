'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { secondaryServices } from '@/data/services'
import { site } from '@/data/site'
import { ArrowCircle } from '@/components/PageHero'
import { ArrowRight } from '@/components/Icons'
import Photo from '@/components/Photo'

const testimonials = [
  {
    quote: "We ship textiles to the UK every month. ANCS gave us better rates than our old agent and nothing has been delayed or damaged. Very reliable team.",
    name: "Ahmed Raza",
    role: "Textile Exporter, Lahore",
    avatar: "/images/avatar-1.webp",
  },
  {
    quote: "I needed to send a big parcel to my family in Canada. They picked it up from my house and it arrived in 10 days. Simple process, no stress.",
    name: "Sara Malik",
    role: "Personal Shipment, Karachi",
    avatar: "/images/avatar-2.webp",
  },
  {
    quote: "Our company imports goods regularly from China. ANCS handles all the customs paperwork and we have never had a single clearance problem in three years.",
    name: "Omar Sheikh",
    role: "Import-Export Business, Islamabad",
    avatar: "/images/avatar-3.webp",
  },
]

export default function ServicesBand() {
  const cards = secondaryServices
  const [index, setIndex] = useState(0)
  const t = testimonials[index]

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
            {index + 1}&ndash;{testimonials.length}
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
              <blockquote data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="byline" data-reveal style={{ ['--reveal-delay' as string]: '.18s' }}>
                <Image
                  className="byline__avatar"
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                />
                <div>
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </div>
              </div>
              <div className="quotes__nav" data-reveal style={{ ['--reveal-delay' as string]: '.24s' }}>
                <button
                  aria-label="Previous review"
                  onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <span className="quotes__counter">{index + 1} / {testimonials.length}</span>
                <button
                  aria-label="Next review"
                  onClick={() => setIndex((index + 1) % testimonials.length)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 2.5L10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="partners" data-reveal>
          <div><img src="/images/logo.webp" alt="ANCS Network" className="partner-logo" /></div>
          <div><img src="/images/logos/dhl.svg" alt="DHL" className="partner-logo" /></div>
          <div><img src="/images/logos/fedex.svg" alt="FedEx" className="partner-logo" /></div>
          <div><img src="/images/logos/ups.svg" alt="UPS" className="partner-logo" /></div>
          <div><img src="/images/logos/aramex.svg" alt="Aramex" className="partner-logo" /></div>
        </div>
      </div>
    </section>
  )
}

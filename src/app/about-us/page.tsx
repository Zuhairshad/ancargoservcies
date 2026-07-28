import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { offices, site, stats } from '@/data/site'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'AN Cargo Services has moved parcels, gifts, documents and commercial freight out of Faisalabad for fifteen years, with offices in three countries.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About us."
        intro="Fifteen years of getting other people’s most important boxes where they need to be, on time."
        banner={{ src: '/images/contact-banner.webp', alt: 'Consolidation and packing operations' }}
      />

      <section className="band">
        <div className="frame detail-grid">
          <aside className="detail-aside">
            <div className="detail-aside__nav">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label} style={{ padding: '0.75rem' }}>
                  <span className="stat" style={{ fontSize: '1.75rem' }}>
                    {s.value}
                  </span>
                  <span className="stat-label" style={{ display: 'block' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="prose" data-reveal>
            <h2>A logistics company built around one promise</h2>
            <p>
              {site.name} started in Faisalabad and grew the way freight companies should: one satisfied customer telling
              another. Fifteen years later we run offices in three countries and move cargo by air, sea, road and rail —
              but the business is still built around the same promise. Safe packing, transparent pricing, and the box
              arrives when we said it would.
            </p>
            <p>
              Most of what we carry matters more than its declared value. Gifts for a wedding. Documents someone needs
              for a visa. Household goods going ahead of a family that is moving. We treat all of it as though somebody
              is waiting for it, because somebody is.
            </p>

            <h3>What we do</h3>
            <ul className="bullets">
              <li>Door-to-door collection and delivery worldwide</li>
              <li>Air cargo and courier through DHL, FedEx, UPS and Aramex</li>
              <li>Sea freight, both full containers and shared groupage</li>
              <li>Port-to-port for shippers with their own agents</li>
              <li>Road and rail movements within Pakistan and across the region</li>
              <li>Postal services for letters, documents and money orders</li>
            </ul>

            <h3>Where we are</h3>
            <p>
              Our head office is in Chenab Market, Madina Town, Faisalabad, with further offices in{' '}
              {offices
                .filter((o) => !o.head)
                .map((o) => o.city)
                .join(', ')}
              . Having our own people at both ends is why our door-to-door service works the way it does — the delivery
              end is not subcontracted to a stranger.
            </p>

            <h3>How we price</h3>
            <p>
              Freight is charged on chargeable weight, which is the greater of actual and volumetric weight. We publish
              what we can — UK sea freight starts at PKR 550 per kilo — and quote the rest per shipment, because a fair
              rate depends on the lane, the volume and the season. We would rather give you a real number than a
              headline one.
            </p>

            <div className="row" style={{ marginTop: '1.5rem' }}>
              <Link className="btn" href="/rates">
                See our rates
              </Link>
              <Link className="btn btn--outline" href="/offices">
                Find an office
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

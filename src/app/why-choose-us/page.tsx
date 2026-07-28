import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Why Choose Us',
  description:
    'Safe packing, transparent pricing, right-time delivery and fifteen years of experience — why customers ship with AN Cargo Services.',
}

const reasons = [
  {
    title: 'Safe packing, included',
    body: 'We pack for the journey the cargo is actually taking. A carton crossing an ocean sits in a container for a month and gets handled a dozen times — it needs more than tape and hope. Packing is part of the service, not an extra line on the invoice.',
  },
  {
    title: 'Transparent pricing',
    body: 'You get the chargeable weight, the rate per kilo and the total before you commit. Where we publish a rate, that is the rate. Where we quote per shipment, we tell you why. Duties charged at the destination are always called out separately so nothing arrives as a surprise.',
  },
  {
    title: 'Right-time delivery',
    body: 'Fast where fast matters and economical where it does not. We will tell you when air is worth the premium and when it is not, even though sea earns us less on the same box.',
  },
  {
    title: 'Our own people at both ends',
    body: 'Offices in Manchester, Dubai and Saudi Arabia mean the delivery end of a door-to-door shipment is handled by our staff, not an agent we have never met. That is the difference customers notice.',
  },
  {
    title: 'Four courier networks behind us',
    body: `${site.couriers.join(', ')} — so we can pick the carrier that actually suits the destination and the deadline, instead of forcing every parcel down one route.`,
  },
  {
    title: 'Fifteen years on the same lanes',
    body: 'We have cleared consignments through the same ports and customs posts for fifteen years. Paperwork prepared correctly the first time is the cheapest thing in freight, and experience is what gets it right.',
  },
]

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHero
        title="Why choose us."
        intro="Six reasons customers keep sending their cargo with us, and keep recommending us to family."
      />

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame card-grid">
          {reasons.map((reason, i) => (
            <div
              className="card"
              key={reason.title}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 3) * 0.07}s` }}
            >
              <div className="card__body" style={{ padding: '1.75rem' }}>
                <em>{String(i + 1).padStart(2, '0')}</em>
                <b style={{ fontSize: '1.25rem' }}>{reason.title}</b>
                <p>{reason.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}

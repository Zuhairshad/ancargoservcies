import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import QuoteCalculator from '@/components/QuoteCalculator'
import { lanes, modeLabels, plans } from '@/data/rates'
import { formatPkr } from '@/lib/quote'

export const metadata: Metadata = {
  title: 'Rates & Quote Calculator',
  description:
    'Freight rates from Pakistan by sea, air, courier and door-to-door, with an instant estimate calculator. UK sea freight from PKR 550 per kg.',
}

export default function RatesPage() {
  return (
    <>
      <PageHero
        title="Rates."
        intro="Transparent pricing by weight, destination and service. Get an instant estimate, then we confirm the exact figure after weighing."
      />

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame stack--lg" style={{ display: 'grid' }}>
          <div data-reveal>
            <QuoteCalculator />
          </div>

          <div className="stack">
            <h2 className="h-section" data-reveal>
              Published lane rates
            </h2>
            <div className="table-wrap" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Service</th>
                    <th scope="col">Per kg</th>
                    <th scope="col">Min</th>
                    <th scope="col">Transit</th>
                  </tr>
                </thead>
                <tbody>
                  {lanes.map((lane, i) => (
                    <tr key={`${lane.to}-${lane.mode}-${i}`}>
                      <td>{lane.from}</td>
                      <td>{lane.to}</td>
                      <td>{modeLabels[lane.mode]}</td>
                      <td className="num">{lane.perKg === null ? <span className="muted">On request</span> : formatPkr(lane.perKg)}</td>
                      <td className="num">{lane.minKg} kg</td>
                      <td className="num">{lane.transit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="lead" data-reveal>
              Rates marked “on request” are quoted per shipment — ask us and we will give you a firm figure. Freight is
              charged on chargeable weight, which is the greater of actual weight and volumetric weight.
            </p>
          </div>

          <div className="stack">
            <h2 className="h-section" data-reveal>
              How our customers usually buy
            </h2>
            <div className="plans" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
              {plans.map((plan) => (
                <div className="plan" key={plan.name} data-featured={plan.featured ? 'true' : 'false'}>
                  <span className="plan__name">{plan.name}</span>
                  <p className="plan__blurb">{plan.blurb}</p>
                  <div className="plan__price">
                    {plan.price}
                    {plan.unit && <span>{plan.unit}</span>}
                  </div>
                  <Link className="btn btn--block" href="/book">
                    Book now
                  </Link>
                  <ul className="bullets">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Not sure which service fits?" body="Send us the destination, the weight and what is in the box. We will quote air and sea side by side so you can compare." />
    </>
  )
}

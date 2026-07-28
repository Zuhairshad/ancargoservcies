import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms on which AN Cargo Services accepts and carries consignments.',
}

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of service." intro="The terms on which we accept and carry your consignment." />
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame" style={{ maxWidth: '46rem' }}>
          <div className="prose" data-reveal>
            <div className="notice" style={{ marginBottom: '2rem' }}>
              <span>
                <b>Draft for review.</b> These terms are a reasonable starting point for a freight forwarder, but they
                have not been checked by a lawyer. Have them reviewed against Pakistani carriage law and the rules of any
                trade association {site.shortName} belongs to before relying on them.
              </span>
            </div>

            <h2>1. Who we are</h2>
            <p>
              {site.name} (&ldquo;{site.shortName}&rdquo;, &ldquo;we&rdquo;) is a freight forwarder and courier operating
              from {site.address.line1}, {site.address.line2}, {site.address.region}, Pakistan, with offices in the United
              Kingdom, the United Arab Emirates and Saudi Arabia.
            </p>

            <h2>2. Accepting a consignment</h2>
            <p>
              A booking is an offer. We accept it when we collect the consignment and issue a reference. We may decline
              any consignment, and may open and inspect anything tendered to us where law, a carrier or a customs
              authority requires it.
            </p>

            <h2>3. What we will not carry</h2>
            <ul className="bullets">
              <li>Currency, bullion, negotiable instruments and precious stones</li>
              <li>Firearms, ammunition, explosives and any weapon or part of one</li>
              <li>Narcotics and any substance prohibited at origin, transit or destination</li>
              <li>Live animals and human remains</li>
              <li>Perishable goods, unless agreed in writing in advance</li>
              <li>Anything the sender has misdeclared</li>
            </ul>

            <h2>4. Declarations and documents</h2>
            <p>
              You are responsible for the accuracy of what you tell us: contents, weight, declared value and the
              recipient&rsquo;s details. Customs authorities read your declaration. An inaccurate one is the most common
              cause of delay, and any storage, fine or return cost arising from it is payable by you.
            </p>

            <h2>5. Charges</h2>
            <p>
              Freight is charged on chargeable weight, which is the greater of actual weight and volumetric weight.
              Estimates given by the calculator on this site are estimates: the figure we confirm after weighing is the
              charge. Duties, taxes and any fees levied at the destination are payable by the consignee unless agreed
              otherwise in writing.
            </p>

            <h2>6. Transit times</h2>
            <p>
              Transit times we quote are typical, not guaranteed. Sailing schedules, flight capacity, customs inspection
              and weather are outside our control. We do not accept liability for consequential loss arising from delay.
            </p>

            <h2>7. Liability</h2>
            <p>
              Our liability for loss of or damage to a consignment is limited to the lower of its declared value and the
              limits set by the applicable carriage convention. We are not liable for loss caused by inadequate packing
              where you packed the consignment yourself, by inherent defect in the goods, or by seizure under law.
            </p>

            <h2>8. Insurance</h2>
            <p>
              Insurance is available and is priced on declared value. It is optional and is not included by default. If
              you do not take it, the limits in clause 7 apply.
            </p>

            <h2>9. Claims</h2>
            <p>
              Notify us of visible damage within 48 hours of delivery, and of loss within 30 days of the expected
              delivery date. Photograph the packaging before opening it fully. Claims must quote the ANCS reference.
            </p>

            <h2>10. Contact</h2>
            <p>
              Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a> or {site.phone}.
            </p>

            <p className="muted">Last updated 28 July 2026.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}

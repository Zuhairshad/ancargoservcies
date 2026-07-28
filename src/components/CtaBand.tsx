import { site, whatsappLink } from '@/data/site'
import { WhatsApp } from './Icons'

type Props = { title?: string; body?: string }

export default function CtaBand({
  title = 'Get your cargo moving today.',
  body = 'Talk to our team in Faisalabad about your shipment, or send us the details on WhatsApp and we will come back with a rate.',
}: Props) {
  return (
    <section className="band band--navy cta">
      <img className="cta__mark" src="/images/mark.svg" alt="" aria-hidden="true" />
      <div className="frame cta__in">
        <h2 className="h-title" data-reveal>
          {title}
        </h2>
        <p className="lead lead--onDark" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
          {body}
        </p>
        <div className="cta__row" data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
          <a
            className="btn btn--wa"
            href={whatsappLink(`Hello ${site.shortName}, I would like a quote for a shipment.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsApp />
            WhatsApp Us
          </a>
          <a className="cta__phone" href={`tel:${site.mobile.replace(/\s/g, '')}`}>
            {site.mobile}
          </a>
        </div>
      </div>
    </section>
  )
}

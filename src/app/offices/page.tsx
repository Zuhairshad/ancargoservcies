import type { Metadata } from 'next'
import CtaBand from '@/components/CtaBand'
import PageHero from '@/components/PageHero'
import { offices, site, whatsappLink } from '@/data/site'

export const metadata: Metadata = {
  title: 'Our Offices',
  description: 'AN Cargo Services offices in Faisalabad, Lahore, Karachi, Manchester, Dubai and Saudi Arabia.',
}

export default function OfficesPage() {
  return (
    <>
      <PageHero
        title="Our offices."
        intro="Six offices across three countries, so someone local handles both ends of your shipment."
      />

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame card-grid">
          {offices.map((office, i) => (
            <div
              className="card"
              key={office.city}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 3) * 0.07}s` }}
            >
              <div className="card__body" style={{ padding: '1.5rem' }}>
                <em>{office.head ? 'Head office' : office.country}</em>
                <b style={{ fontSize: '1.375rem' }}>{office.city}</b>
                <p>{office.address}</p>
                {office.phone && (
                  <p>
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`}>{office.phone}</a>
                  </p>
                )}
                {office.whatsapp && (
                  <p>
                    <a
                      href={whatsappLink(`Hello ${site.shortName} ${office.city}, I have a shipping enquiry.`, office.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp this office
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="band band--paper">
        <div className="frame stack">
          <h2 className="h-section" data-reveal>
            Opening hours
          </h2>
          <div className="table-wrap" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
            <table className="data">
              <tbody>
                {site.hours.map((h) => (
                  <tr key={h.days}>
                    <td>{h.days}</td>
                    <td className="num">{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

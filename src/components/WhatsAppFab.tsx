import { site, whatsappLink } from '@/data/site'
import { WhatsApp } from './Icons'

export default function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={whatsappLink(`Hello ${site.shortName}, I would like a shipping quote.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message AN Cargo Services on WhatsApp"
    >
      <WhatsApp />
    </a>
  )
}

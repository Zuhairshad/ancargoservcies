import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Accordion from '@/components/Accordion'
import JsonLd from '@/components/JsonLd'
import { faqSchema } from '@/lib/schema'
import { faqs } from '@/data/faq'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about shipping with AN Cargo Services — quotes, transit times, tracking, customs, insurance and claims.',
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently asked questions."
        intro="The questions we are asked most, answered plainly. If yours is not here, message us on WhatsApp."
      />
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame">
          <Accordion items={faqs} />
        </div>
      </section>
      <CtaBand />
      <JsonLd data={faqSchema()} />
    </>
  )
}

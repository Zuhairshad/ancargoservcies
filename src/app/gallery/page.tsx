import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Lightbox from '@/components/Lightbox'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photographs of AN Cargo Services operations — packing, consolidation, fleet and delivery.',
}

const captions = [
  'Loading a parcel for collection',
  'Packing a consignment at our facility',
  'Delivering to the recipient',
  'Part of our road fleet',
  'Consolidated cargo heading for the port',
  'An ANCS delivery vehicle',
  'Tracking a shipment in transit',
  'Working with our courier partners',
]

const images = captions.map((alt, i) => ({ src: `/images/gallery-${i + 1}.webp`, alt }))

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Gallery." intro="Packing, consolidation, our fleet and deliveries — the day-to-day of moving cargo." />
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame">
          <Lightbox items={images} />
        </div>
      </section>
      <CtaBand />
    </>
  )
}

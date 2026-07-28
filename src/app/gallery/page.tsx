import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photographs of AN Cargo Services operations — packing, consolidation, fleet and delivery.',
}

const images = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/gallery-${i + 1}.webp`,
  alt: 'AN Cargo Services operations',
}))

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Gallery." intro="Packing, consolidation, our fleet and deliveries — the day-to-day of moving cargo." />
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame gallery">
          {images.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={640}
              height={480}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 4) * 0.06}s` }}
            />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  )
}

import { site } from '@/data/site'
import Photo from '@/components/Photo'

export default function Mission() {
  return (
    <section className="mission">
      <div className="mission__panel">
        <span className="mission__mark" aria-hidden="true" data-reveal>
          ″
        </span>
        <blockquote data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
          Fifteen years of getting other people’s most important boxes where they need to be, on time.
        </blockquote>
        <div className="mission__by" data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
          <b>{site.name}</b>
          <span>
            {site.address.line1}, {site.address.line2}
          </span>
        </div>
      </div>
      <div className="mission__img">
        <Photo
          src="/images/trucks-sunset.webp"
          alt="Warehouse team handling a packed consignment"
          sizes="(max-width: 1080px) 100vw, 50vw"
        />
      </div>
    </section>
  )
}

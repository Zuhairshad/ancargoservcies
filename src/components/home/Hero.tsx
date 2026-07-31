import Link from 'next/link'
import TrackForm from '@/components/TrackForm'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__main">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-highway-1280.webp"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero-720.mp4" type="video/mp4" />
        </video>
        <Link className="hero__badge" href="/rates" data-rise style={{ ['--reveal-delay' as string]: '.05s' }}>
          <span className="hero__badge-wide">Send gifts home at discounted freight rates</span>
          <span className="hero__badge-narrow">Discounted rates on gifts</span>
          <b>See Rates</b>
        </Link>
        <h1 className="h-hero" data-rise style={{ ['--reveal-delay' as string]: '.15s' }}>
          Door to door, anywhere in the world.
        </h1>
        <div data-rise style={{ ['--reveal-delay' as string]: '.25s' }}>
          <TrackForm />
        </div>
      </div>
    </section>
  )
}

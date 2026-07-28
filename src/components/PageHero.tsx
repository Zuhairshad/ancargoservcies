import { ArrowRight } from './Icons'
import Link from 'next/link'
import Photo from './Photo'

type Props = {
  title: string
  intro?: string
  badge?: { label: string; cta: string; href: string }
  banner?: { src: string; alt: string }
}

/** Transo's interior-page header: centred title on a light band, optional wide banner under it. */
export default function PageHero({ title, intro, badge, banner }: Props) {
  return (
    <>
      <section className="page-hero">
        <div className="frame page-hero__in">
          {badge && (
            <Link className="hero__badge" href={badge.href} data-reveal>
              {badge.label} <b>{badge.cta}</b>
            </Link>
          )}
          <h1 className="h-title" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
            {title}
          </h1>
          {intro && (
            <p className="lead" data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
              {intro}
            </p>
          )}
        </div>
      </section>
      {banner && (
        <div className="page-hero__banner" data-reveal>
          <Photo src={banner.src} alt={banner.alt}  sizes="100vw" />
        </div>
      )}
    </>
  )
}

export function ArrowCircle() {
  return (
    <span className="arrow-btn" aria-hidden="true">
      <ArrowRight />
    </span>
  )
}

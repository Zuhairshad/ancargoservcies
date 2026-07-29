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
          {/* data-rise, not data-reveal: this block is the top of the page on
              every route that uses it, so it animates from CSS at first paint
              rather than waiting on an observer. */}
          {badge && (
            <Link className="hero__badge" href={badge.href} data-rise>
              {badge.label} <b>{badge.cta}</b>
            </Link>
          )}
          <h1 className="h-title" data-rise style={{ ['--reveal-delay' as string]: '.06s' }}>
            {title}
          </h1>
          {intro && (
            <p className="lead" data-rise style={{ ['--reveal-delay' as string]: '.12s' }}>
              {intro}
            </p>
          )}
        </div>
      </section>
      {banner && (
        <div className="page-hero__banner" data-rise>
          {/* The banner is capped at --frame less its gutters, so 100vw would
              overstate it and pull a larger candidate than the slot can show.
              Where one exists it is also the page's largest above-fold image. */}
          <Photo
            src={banner.src}
            alt={banner.alt}
            sizes="(min-width: 1376px) 1312px, calc(100vw - 2rem)"
            priority
          />
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

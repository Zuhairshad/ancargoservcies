'use client'

import { useEffect } from 'react'

/**
 * Mounted once in the root layout. Observes every [data-reveal] element and
 * adds .is-visible when it scrolls into view — the same effect Transo uses
 * (opacity 0 → 1, translateY(30px) → 0), done with one observer instead of a
 * client component per element.
 */
export default function Reveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    items.forEach((el) => {
      // The inline script has already revealed what was in the viewport at load.
      if (el.classList.contains('is-visible')) return
      // Anything on screen by the time this runs reveals immediately too.
      const top = el.getBoundingClientRect().top
      if (top < window.innerHeight * 0.92) el.classList.add('is-visible')
      else io.observe(el)
    })

    return () => io.disconnect()
  }, [])

  return null
}

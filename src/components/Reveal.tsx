'use client'

import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

// Runs synchronously before paint on the client so above-fold elements are
// revealed without a flash, and without conflicting with SSR hydration.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function Reveal() {
  const pathname = usePathname()

  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add('js')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // On every route change, re-scan the DOM for [data-reveal] elements that
    // belong to the newly rendered page and haven't been revealed yet.
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))

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
      const top = el.getBoundingClientRect().top
      if (top < window.innerHeight * 0.92) el.classList.add('is-visible')
      else io.observe(el)
    })

    return () => io.disconnect()
  }, [pathname])

  return null
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Item = { src: string; alt: string }

/** Gallery grid where each image opens full size. Escape and arrow keys work. */
export default function Lightbox({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, step])

  return (
    <>
      <div className="gallery">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className="gallery__item"
            onClick={() => setOpen(i)}
            aria-label={`Open image ${i + 1} of ${items.length}`}
            data-reveal
            style={{ ['--reveal-delay' as string]: `${(i % 4) * 0.06}s` }}
          >
            <img src={item.src} alt={item.alt} width={688} height={516} loading="lazy" />
          </button>
        ))}
      </div>

      {/* Rendered into body so no ancestor's stacking context can trap the overlay. */}
      {open !== null && mounted && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" onClick={() => setOpen(null)}>
          <button className="lightbox__close" type="button" onClick={() => setOpen(null)} aria-label="Close">
            ✕
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1) }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <img src={items[open].src} alt={items[open].alt} onClick={(e) => e.stopPropagation()} />
          <button
            className="lightbox__nav lightbox__nav--next"
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1) }}
            aria-label="Next image"
          >
            ›
          </button>
          <span className="lightbox__count">
            {open + 1} / {items.length}
          </span>
        </div>,
        document.body,
      )}
    </>
  )
}

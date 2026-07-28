'use client'

import { useState } from 'react'
import { ChevronDown } from './Icons'

type Item = { q: string; a: string }

export default function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div className="accordion__item" key={item.q} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 4) * 0.05}s` }}>
            <button
              className="accordion__btn"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-btn-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <ChevronDown />
            </button>
            {isOpen && (
              <div className="accordion__panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
                {item.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

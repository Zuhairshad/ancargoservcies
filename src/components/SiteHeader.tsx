'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { nav, site } from '@/data/site'
import { Burger, ChevronDown } from './Icons'

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current = (href: string) => (pathname === href ? 'page' : undefined)

  return (
    <header className="site-header">
      <div className="frame site-header__in">
        <nav className="site-header__nav" aria-label="Primary">
          {nav.primary.map((item) => (
            <Link key={item.href} href={item.href} aria-current={current(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="site-header__logo" href="/">
          <img src="/images/logo.webp" alt={`${site.name} — ${site.tagline}`} width={520} height={375} />
        </Link>

        <div className="site-header__right">
          <nav className="site-header__nav" aria-label="Secondary">
            {nav.secondary.map((item) => (
              <Link key={item.href} href={item.href} aria-current={current(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__nav site-header__more">
            <span tabIndex={0} role="button" aria-haspopup="true">
              All Pages
              <ChevronDown />
            </span>
            <div className="site-header__dropdown">
              {nav.more.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link className="btn" href="/track">
            Track Shipment
          </Link>

          <button
            className="site-header__burger"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Burger />
          </button>
        </div>
      </div>

      <div className={`site-header__mobile${open ? ' is-open' : ''}`} id="mobile-nav">
        {[...nav.primary, ...nav.secondary, ...nav.more].map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link className="btn" href="/track" onClick={() => setOpen(false)}>
          Track Shipment
        </Link>
      </div>
    </header>
  )
}

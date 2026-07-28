import Link from 'next/link'
import { nav, site } from '@/data/site'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame">
        <div className="site-footer__top">
          <div className="site-footer__logo" data-reveal>
            <img src="/images/logo.webp" alt={site.name} width={520} height={375} />
          </div>

          <div className="site-footer__contact">
            <div data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
              <small>Phone</small>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </div>
            <div data-reveal style={{ ['--reveal-delay' as string]: '.12s' }}>
              <small>Email</small>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div data-reveal style={{ ['--reveal-delay' as string]: '.18s' }}>
              <small>Head office</small>
              <p>
                {site.address.line1}, {site.address.line2}, {site.address.region}
              </p>
            </div>
            <div data-reveal style={{ ['--reveal-delay' as string]: '.24s' }}>
              <small>Hours</small>
              <p className="site-footer__hours">
                {site.hours.map((h) => (
                  <span key={h.days}>
                    {h.days} {h.time}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            <div className="site-footer__sub" data-reveal style={{ ['--reveal-delay' as string]: '.3s' }}>
              <b>Get rates and shipping news straight to your inbox.</b>
              <form className="inline-field inline-field--onDark" action="/api/subscribe" method="post">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input id="footer-email" name="email" type="email" placeholder="your@email.com" required />
                <button className="btn" type="submit">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {nav.footer.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__meta">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <div className="site-footer__social" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.4c2.1 0 2.4 0 3.2.1.8 0 1.2.2 1.5.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.3.7.3 1.5.1.8.1 1.1.1 3.2s0 2.4-.1 3.2c0 .8-.2 1.2-.3 1.5-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.7.3-1.5.3-.8.1-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.2-.2-1.5-.3a2.8 2.8 0 0 1-1-.7 2.8 2.8 0 0 1-.7-1c-.1-.3-.3-.7-.3-1.5C1.4 10.4 1.4 10.1 1.4 8s0-2.4.1-3.2c0-.8.2-1.2.3-1.5.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.7-.3 1.5-.3C5.6 1.4 5.9 1.4 8 1.4zm0 3.2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zm4.3-5.7a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0z" /></svg>
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M9.2 14V8.6h1.9l.3-2.2H9.2V5c0-.6.2-1.1 1.1-1.1h1.2V1.9c-.2 0-.9-.1-1.8-.1-1.7 0-2.9 1.1-2.9 3v1.6H4.9v2.2h1.9V14h2.4z" /></svg>
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.3 1.8h2.3l-5 5.7 5.9 7.8h-4.6l-3.6-4.7-4.1 4.7H.9l5.4-6.1L.6 1.8h4.7l3.4 4.5 3.6-4.5zm-.8 12.1h1.3L4.6 3.1H3.2l8.3 10.8z" /></svg>
          </div>
        </div>
      </div>
    </footer>
  )
}

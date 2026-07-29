import type { Metadata } from 'next'
import { preload } from 'react-dom'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Reveal from '@/components/Reveal'
import WhatsAppFab from '@/components/WhatsAppFab'
import JsonLd from '@/components/JsonLd'
import { organisationSchema } from '@/lib/schema'
import { site } from '@/data/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Cargo & Courier from Pakistan Worldwide`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: 'en_GB',
    url: site.url,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ['/og.jpg'],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#033b5e',
  width: 'device-width',
  initialScale: 1,
}

// Minimum styles needed to paint the header and hero correctly before the
// full stylesheet arrives. Keeps first paint from flashing a blank white page.
// Variables + resets + header + hero type — everything else waits for globals.css.
const criticalCss = `*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:#fff;color:#06202f;font-family:'Inter',ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;font-weight:500;line-height:1.55;letter-spacing:-.01em;-webkit-font-smoothing:antialiased;overflow-x:hidden}img,svg,video{display:block;max-width:100%}img{height:auto}picture{display:contents}a{color:inherit}button{font:inherit}:root{--white:#fff;--paper:#f8f8f8;--line:#e6e6e6;--ink:#06202f;--body:#4f5a5b;--navy:#033b5e;--navy-deep:#02293f;--accent:#cc000f;--accent-ink:#fff;--frame:1376px;--gutter:clamp(1rem,2.2vw,2rem);--band:clamp(3.5rem,6.7vw,6rem);--radius:6px;--ease:cubic-bezier(.16,1,.3,1);--t-hero:clamp(2.125rem,4.86vw,4.375rem);--t-title:clamp(1.875rem,3.47vw,3.25rem);--t-section:clamp(1.5rem,2.64vw,2.375rem);--t-body:.9375rem;--t-small:.8125rem}.skip-link{position:absolute;left:-9999px}.skip-link:focus{left:0;top:0}.frame{max-width:var(--frame);margin-inline:auto;padding-inline:var(--gutter)}.site-header{background:#fff;border-bottom:1px solid #e6e6e6;position:relative;z-index:30}.site-header__in{display:flex;align-items:center;gap:1.5rem;height:96px}.site-header__logo{margin-inline:auto;display:flex;align-items:center;text-decoration:none}.site-header__logo img{height:62px;width:auto}.h-hero,.h-title,.h-section,.h-sub{margin:0;font-weight:600;letter-spacing:-.04em;text-wrap:balance}.h-hero{font-size:var(--t-hero);line-height:1.1}.h-title{font-size:var(--t-title);line-height:1.15}.lead{margin:0;font-size:var(--t-body);line-height:1.6;color:#4f5a5b}.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:54px;padding:18px 24px;border:0;border-radius:6px;background:#cc000f;color:#fff;font-size:.9375rem;font-weight:600;text-decoration:none;white-space:nowrap;cursor:pointer}.page-hero{background:#f8f8f8;padding-block:clamp(3rem,6vw,5.5rem) clamp(2.5rem,4vw,3.5rem);text-align:center}.page-hero__in{display:grid;gap:1rem;justify-items:center;max-width:62ch;margin-inline:auto}.hero{display:grid;grid-template-columns:1fr 27.1%;min-height:730px}.hero__main{position:relative;padding:var(--gutter);display:flex;flex-direction:column;justify-content:flex-end;gap:1.75rem;color:#fff;overflow:hidden}`

// Reveals elements already in the viewport, then marks the document as
// scripted. Order matters: reveal first so above-fold content is never hidden,
// even if the script runs after the stylesheet and html.js would otherwise
// conceal elements before the observer fires.
const revealAboveFold = `(function(){function r(){try{var v=window.innerHeight||0,n=document.querySelectorAll('[data-reveal]'),i=0;for(;i<n.length;i++){if(n[i].getBoundingClientRect().top<v*0.92)n[i].classList.add('is-visible')}document.documentElement.classList.add('js')}catch(e){}}if(!document.body){document.addEventListener('DOMContentLoaded',r)}else{r()}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only the two weights used above the fold. 700 is used by a decorative mark
  // and the print stylesheet — preloading it would warn about an unused preload.
  preload('/fonts/inter-latin-500-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  preload('/fonts/inter-latin-600-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
        <Reveal />
        <JsonLd data={organisationSchema()} />
        <script dangerouslySetInnerHTML={{ __html: revealAboveFold }} />
      </body>
    </html>
  )
}

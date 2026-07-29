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

/**
 * Reveals everything already in the viewport, then marks the document as
 * scripted so the stylesheet may hide what is left. Running in this order means
 * above-the-fold content is never hidden, and if hydration is slow or never
 * happens the page still reads normally. Falls back to DOMContentLoaded in case
 * the script is hoisted above <body>.
 */
const revealAboveFold = `(function(){function r(){try{var v=window.innerHeight||0,n=document.querySelectorAll('[data-reveal]'),i=0;for(;i<n.length;i++){if(n[i].getBoundingClientRect().top<v*0.92)n[i].classList.add('is-visible')}document.documentElement.classList.add('js')}catch(e){}}if(!document.body){document.addEventListener('DOMContentLoaded',r)}else{r()}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only the two weights used above the fold: 500 for body text, 600 for
  // headings. 700 is used by a decorative mark and the print stylesheet, so
  // preloading it would warn about a preload that goes unused. Called rather
  // than rendered as <link>, which React emits twice.
  preload('/fonts/inter-latin-500-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  preload('/fonts/inter-latin-600-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  return (
    <html lang="en">
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

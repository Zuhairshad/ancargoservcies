import type { Metadata } from 'next'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      </body>
    </html>
  )
}

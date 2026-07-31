import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // pg is a native-ish server package; leave it out of the bundle.
  serverExternalPackages: ['pg'],
  async headers() {
    // Anything under public/ is served with `max-age=0` by default, because the
    // filenames are not content-hashed. For these two directories that default
    // is wrong: every navigation was re-validating a megabyte of imagery.
    return [
      {
        // Fonts are versioned by their filename and will never change contents.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
    ]
  },
  async redirects() {
    // 301s from the WordPress URLs so 15 years of links and search ranking survive the move.
    return [
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/pricing-plan', destination: '/rates', permanent: true },
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/track-your-shipment', destination: '/track', permanent: true },
      { source: '/projects', destination: '/gallery', permanent: true },
    ]
  },
}

export default config

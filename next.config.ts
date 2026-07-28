import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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

import { offices, site } from '@/data/site'
import type { Service } from '@/data/services'
import type { Post } from '@/data/posts'
import { faqs } from '@/data/faq'

/**
 * JSON-LD. Worth the effort for a business like this: it is what puts the phone
 * number, opening hours and branch list into a Google result for "cargo service
 * Faisalabad" rather than just a blue link.
 */

const url = (path = '') => `${site.url}${path}`

const dayMap: Record<string, string[]> = {
  'Monday – Friday': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  Saturday: ['Saturday'],
  'Sunday & holidays': ['Sunday'],
}

export function organisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    '@id': url('#organisation'),
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: url(),
    logo: url('/images/logo.webp'),
    image: url('/og.jpg'),
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    priceRange: 'PKR 550/kg and up',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: 'Faisalabad',
      addressRegion: site.address.region,
      addressCountry: 'PK',
    },
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[h.days] ?? [h.days],
      ...(h.time === '24/7'
        ? { opens: '00:00', closes: '23:59' }
        : { opens: h.time.split('–')[0].trim(), closes: h.time.split('–')[1]?.trim() ?? '17:00' }),
    })),
    areaServed: [...new Set(offices.map((o) => o.country))].map((name) => ({ '@type': 'Country', name })),
    location: offices.map((o) => ({
      '@type': 'Place',
      name: `${site.shortName} ${o.city}`,
      address: { '@type': 'PostalAddress', addressLocality: o.city, addressCountry: o.country },
    })),
    sameAs: [site.social.facebook, site.social.instagram, site.social.x],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.mobile,
      contactType: 'customer service',
      availableLanguage: ['en', 'ur'],
    },
  }
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    url: url(`/services/${service.slug}`),
    serviceType: service.name,
    provider: { '@id': url('#organisation') },
    areaServed: [...new Set(offices.map((o) => o.country))].map((name) => ({ '@type': 'Country', name })),
  }
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function postSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: url(post.image),
    url: url(`/blog/${post.slug}`),
    author: { '@id': url('#organisation') },
    publisher: { '@id': url('#organisation') },
  }
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: url(item.href),
    })),
  }
}

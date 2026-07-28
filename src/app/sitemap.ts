import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
import { services } from '@/data/services'
import { posts } from '@/data/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '', '/about-us', '/services', '/rates', '/book', '/track', '/offices',
    '/why-choose-us', '/gallery', '/blog', '/faq', '/contact', '/terms', '/privacy',
  ]
  const now = new Date()

  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      priority: path === '' ? 1 : path === '/terms' || path === '/privacy' ? 0.3 : 0.7,
    })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.5 })),
  ]
}

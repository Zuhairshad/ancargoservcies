import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CtaBand from '@/components/CtaBand'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import { postSchema } from '@/lib/schema'
import { getPost, posts } from '@/data/posts'
import { formatDate } from '@/lib/dates'
import Photo from '@/components/Photo'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <>
      <section className="page-hero">
        <div className="frame page-hero__in">
          <p className="post-meta" data-reveal>
            <span>{formatDate(post.date)}</span>
            <span>{post.readingTime}</span>
          </p>
          <h1 className="h-title" data-reveal style={{ ['--reveal-delay' as string]: '.06s' }}>
            {post.title}
          </h1>
        </div>
      </section>

      <div className="page-hero__banner" data-reveal>
        <Photo src={post.image} alt=""  sizes="100vw" priority />
      </div>

      <section className="band">
        <div className="frame" style={{ maxWidth: '46rem' }}>
          <Breadcrumbs
            trail={[
              { name: 'Home', href: '/' },
              { name: 'Blog', href: '/blog' },
              { name: post.title, href: `/blog/${post.slug}` },
            ]}
          />
          <div className="prose" data-reveal style={{ marginTop: '1.5rem' }}>
            {post.body.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="row" style={{ marginTop: '2rem' }}>
            <Link className="btn btn--outline" href="/blog">
              All articles
            </Link>
            <Link className="btn" href="/rates">
              Get a quote
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={postSchema(post)} />
    </>
  )
}

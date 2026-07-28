import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero, { ArrowCircle } from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { posts } from '@/data/posts'
import { formatDate } from '@/lib/dates'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Practical shipping advice from AN Cargo Services — packing, choosing between air and sea, and customs paperwork.',
}

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog." intro="Practical advice from fifteen years of moving other people’s cargo." />
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="frame card-grid">
          {posts.map((post, i) => (
            <Link
              className="card"
              href={`/blog/${post.slug}`}
              key={post.slug}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 3) * 0.07}s` }}
            >
              <div className="card__img">
                <img src={post.image} alt="" width={640} height={480} />
              </div>
              <div className="card__body">
                <em>{formatDate(post.date)}</em>
                <b>{post.title}</b>
                <p>{post.excerpt}</p>
              </div>
              <div className="card__foot">
                <span className="stat-label">{post.readingTime}</span>
                <ArrowCircle />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  )
}

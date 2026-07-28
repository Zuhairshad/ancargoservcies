import manifest from '@/data/image-manifest.json'

type Entry = { w: number; h: number; sm?: { w: number; h: number } }
const images = manifest as Record<string, Entry>

type Props = {
  /** Path under /images. Dimensions come from the generated manifest. */
  src: string
  alt: string
  /** Viewport-relative rendered width, so the browser can pick a candidate. */
  sizes: string
  className?: string
  priority?: boolean
}

/**
 * An <img> whose srcset descriptors are read from src/data/image-manifest.json,
 * written by the image build. Several files are capped at their source
 * resolution, so hardcoding widths here would lie to the browser and make it
 * choose the wrong candidate.
 */
export default function Photo({ src, alt, sizes, className, priority }: Props) {
  const entry = images[src]

  if (!entry) {
    // Unlisted image: serve it plainly rather than guessing a size.
    return <img className={className} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} />
  }

  const small = src.replace(/\.webp$/, '-sm.webp')
  const srcSet = entry.sm ? `${small} ${entry.sm.w}w, ${src} ${entry.w}w` : undefined

  return (
    <img
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={entry.w}
      height={entry.h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
    />
  )
}

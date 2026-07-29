import manifest from '@/data/image-manifest.json'

type Ladder = { w: number; h: number; widths: number[] }
/** `m` is an art-directed portrait crop, used below 860px where one exists. */
type Entry = Ladder & { m?: Ladder }
const images = manifest as Record<string, Entry>

type Props = {
  /** Path under /images. Dimensions and encoded widths come from the manifest. */
  src: string
  alt: string
  /** Viewport-relative rendered width, so the browser can pick a candidate. */
  sizes: string
  className?: string
  /** The page's LCP image. At most one per page: it alone gets fetchPriority high. */
  priority?: boolean
  /** Above the fold but not the LCP — load immediately, without competing for bandwidth. */
  eager?: boolean
}

/**
 * One image slot, served from a ladder of encoded widths so a phone downloads a
 * phone-sized file instead of a desktop one.
 *
 * Descriptors are read from src/data/image-manifest.json rather than written by
 * hand: several slots are capped at the resolution of their source photograph,
 * and a descriptor that overstates a file's width makes the browser choose the
 * wrong candidate.
 *
 * Everything is WebP. AVIF was measured and rejected — matching WebP q88's
 * high-frequency detail took AVIF q82-q90, which produced larger files.
 */
export default function Photo({ src, alt, sizes, className, priority, eager }: Props) {
  const entry = images[src]
  const loading = priority || eager ? 'eager' : 'lazy'

  if (!entry) {
    // Unlisted image: serve it plainly rather than guessing a size.
    return <img className={className} src={src} alt={alt} loading={loading} />
  }

  const base = src.replace(/\.webp$/, '')
  // A lone candidate carries no descriptor, and so needs no `sizes` hint either.
  const single = entry.widths.length === 1
  const srcSet = (prefix: string, widths: number[]) =>
    widths.length === 1 ? `${prefix}-${widths[0]}.webp` : widths.map((w) => `${prefix}-${w}.webp ${w}w`).join(', ')

  // The wrapper is always present, so every slot has the same shape for the
  // stylesheet to target, whether or not it has an art-directed crop.
  return (
    <picture>
      {entry.m && (
        <source media="(max-width: 860px)" srcSet={srcSet(`${base}-m`, entry.m.widths)} sizes={sizes} />
      )}
      <img
        className={className}
        src={src}
        srcSet={srcSet(base, entry.widths)}
        sizes={single ? undefined : sizes}
        alt={alt}
        width={entry.w}
        height={entry.h}
        loading={loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  )
}

/** The encoded ladder for a slot, for callers that need to preload it. */
export function ladder(src: string) {
  const entry = images[src]
  if (!entry) return null
  const base = src.replace(/\.webp$/, '')
  return entry.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
}

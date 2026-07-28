/** Shown while a tracking lookup is in flight — the QR often opens this on a slow phone connection. */
export default function Loading() {
  return (
    <section className="track-hero">
      <div className="frame track-hero__in">
        <p className="eyebrow eyebrow--onDark">Shipment</p>
        <span className="skeleton skeleton--title" />
        <span className="skeleton skeleton--line" />
      </div>
    </section>
  )
}

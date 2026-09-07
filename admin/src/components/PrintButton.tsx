'use client'

export default function PrintButton({ label = 'Print' }: { label?: string }) {
  return (
    <button className="btn btn--sm" type="button" onClick={() => window.print()}>
      {label}
    </button>
  )
}

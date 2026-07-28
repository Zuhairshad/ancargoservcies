'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { normaliseRef } from '@/lib/shipments'

export default function TrackForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter()
  const [value, setValue] = useState('')

  return (
    <form
      className="inline-field"
      onSubmit={(e) => {
        e.preventDefault()
        const ref = normaliseRef(value)
        if (ref.length > 5) router.push(`/track/${encodeURIComponent(ref)}`)
      }}
    >
      <label className="sr-only" htmlFor="tracking-ref">
        Tracking number
      </label>
      <input
        id="tracking-ref"
        name="ref"
        type="text"
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Tracking number, e.g. ANCS-2607-0148"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="btn" type="submit">
        Track
      </button>
    </form>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { quickStatuses, statusLabels } from '@/lib/shipments'
import { updateStatus } from '@/actions'

function localNow() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function StatusForm({ ref_ }: { ref_: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [at, setAt] = useState(localNow)
  const [selected, setSelected] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')

  const effectiveStatus = customText.trim() ? 'custom' : selected
  const canSubmit = Boolean(effectiveStatus) && !pending

  function submit() {
    if (!effectiveStatus) return
    const fd = new FormData()
    fd.set('ref', ref_)
    fd.set('status', effectiveStatus)
    fd.set('at', new Date(at).toISOString())
    if (location.trim()) fd.set('location', location.trim())
    if (effectiveStatus === 'custom') {
      fd.set('note', customText.trim())
    } else if (note.trim()) {
      fd.set('note', note.trim())
    }

    startTransition(async () => {
      await updateStatus(fd)
      setSelected(null)
      setCustomText('')
      setLocation('')
      setNote('')
      setAt(localNow())
      router.refresh()
    })
  }

  return (
    <div className="form-card status-form-v2">
      {/* Date & time */}
      <div className="field">
        <label>Date &amp; time</label>
        <input
          type="datetime-local"
          value={at}
          onChange={e => setAt(e.target.value)}
        />
      </div>

      {/* Quick-add chips */}
      <div className="field">
        <label>Quick add</label>
        <div className="status-chips">
          {quickStatuses.map(s => (
            <button
              key={s}
              type="button"
              className={`chip${selected === s && !customText ? ' chip--active' : ''}`}
              onClick={() => { setSelected(s); setCustomText('') }}
              disabled={pending}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Manual status text */}
      <div className="status-divider"><span>or enter status manually</span></div>
      <div className="field">
        <label>Custom status text</label>
        <input
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="e.g. Package arrived at Dubai hub"
          disabled={pending}
        />
      </div>

      {/* Location + Note (note hidden when custom, since note IS the custom text) */}
      <div className="form-row">
        <div className="field">
          <label>Location</label>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Port Qasim, Karachi"
            disabled={pending}
          />
        </div>
        {effectiveStatus !== 'custom' && (
          <div className="field">
            <label>Note</label>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="ETA Felixstowe 12 Aug"
              disabled={pending}
            />
          </div>
        )}
      </div>

      <button
        className="btn"
        type="button"
        disabled={!canSubmit}
        onClick={submit}
      >
        {pending ? 'Saving…' : 'Add update'}
      </button>
    </div>
  )
}

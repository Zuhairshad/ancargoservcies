'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { quickStatuses, statusLabels, type ShipmentEvent, type Status } from '@/lib/shipments'
import { editEvent, deleteEvent } from '@/actions'
import { formatDateTime } from '@/lib/dates'

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function EventRow({ event, ref_ }: { event: ShipmentEvent; ref_: string }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()
  const [at, setAt] = useState(() => toDatetimeLocal(event.at))
  const [selected, setSelected] = useState<Status>(event.status === 'custom' ? 'custom' : event.status)
  const [customText, setCustomText] = useState(event.status === 'custom' ? (event.note ?? '') : '')
  const [location, setLocation] = useState(event.location ?? '')
  const [note, setNote] = useState(event.status !== 'custom' ? (event.note ?? '') : '')

  const effectiveStatus: Status = customText.trim() ? 'custom' : selected

  const isCustom = event.status === 'custom'
  const label = isCustom ? event.note : statusLabels[event.status]

  function saveEdit() {
    const fd = new FormData()
    fd.set('ref', ref_)
    fd.set('eventId', String(event.id))
    fd.set('status', effectiveStatus)
    fd.set('at', new Date(at).toISOString())
    if (location.trim()) fd.set('location', location.trim())
    if (effectiveStatus === 'custom') {
      fd.set('note', customText.trim())
    } else if (note.trim()) {
      fd.set('note', note.trim())
    }
    startTransition(async () => {
      await editEvent(fd)
      setEditing(false)
      router.refresh()
    })
  }

  function doDelete() {
    if (!confirm('Delete this status update?')) return
    const fd = new FormData()
    fd.set('ref', ref_)
    fd.set('eventId', String(event.id))
    startTransition(async () => {
      await deleteEvent(fd)
      router.refresh()
    })
  }

  return (
    <li data-done="true">
      {!editing ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div>
              <b>{label}</b>
              <span>
                {formatDateTime(event.at)}
                {event.location ? ` · ${event.location}` : ''}
                {!isCustom && event.note ? ` · ${event.note}` : ''}
              </span>
            </div>
            <span style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
              <button
                type="button"
                className="event-action"
                onClick={() => setEditing(true)}
                disabled={pending}
                title="Edit"
              >
                Edit
              </button>
              <button
                type="button"
                className="event-action event-action--del"
                onClick={doDelete}
                disabled={pending}
                title="Delete"
              >
                ✕
              </button>
            </span>
          </div>
        </div>
      ) : (
        <div className="event-edit">
          {/* Date */}
          <div className="field">
            <label>Date &amp; time</label>
            <input type="datetime-local" value={at} onChange={e => setAt(e.target.value)} />
          </div>

          {/* Quick chips */}
          <div className="field">
            <label>Status</label>
            <div className="status-chips">
              {quickStatuses.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`chip${selected === s && !customText ? ' chip--active' : ''}`}
                  onClick={() => { setSelected(s); setCustomText('') }}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Manual text */}
          <div className="field">
            <label>Custom status text</label>
            <input
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="e.g. Package arrived at Dubai hub"
            />
          </div>

          {/* Location + Note */}
          <div className="form-row">
            <div className="field">
              <label>Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Port Qasim, Karachi" />
            </div>
            {effectiveStatus !== 'custom' && (
              <div className="field">
                <label>Note</label>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="ETA Felixstowe 12 Aug" />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn--sm" type="button" onClick={saveEdit} disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn--sm btn--outline" type="button" onClick={() => setEditing(false)} disabled={pending}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default function Timeline({ events, ref_ }: { events: ShipmentEvent[]; ref_: string }) {
  return (
    <ol className="timeline">
      {events
        .slice()
        .reverse()
        .map((event) => (
          <EventRow key={event.id ?? `${event.status}-${event.at}`} event={event} ref_={ref_} />
        ))}
    </ol>
  )
}

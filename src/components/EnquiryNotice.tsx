'use client'

import { useSearchParams } from 'next/navigation'

const feedback: Record<string, { tone: 'ok' | 'bad'; text: string }> = {
  ok: { tone: 'ok', text: 'Thank you — your message is with our team. We usually reply the same working day.' },
  queued: {
    tone: 'ok',
    text: 'Thank you — your message was received. If you need an answer urgently, WhatsApp is faster.',
  },
  invalid: { tone: 'bad', text: 'Please add your name, a valid email address and a message, then send again.' },
}

/**
 * Feedback for the contact form, which posts and redirects back with ?sent=.
 * Reading the query here rather than in the page keeps /contact static: a server
 * component that touches searchParams is rendered on demand for every visitor.
 */
export default function EnquiryNotice() {
  const state = useSearchParams().get('sent')
  if (!state) return null
  const status = feedback[state]
  if (!status) return null

  return (
    <p
      className="form-note"
      role="status"
      style={{ color: status.tone === 'ok' ? 'var(--ok)' : 'var(--accent)', fontWeight: 600 }}
    >
      {status.text}
    </p>
  )
}

'use client'

import { useSearchParams } from 'next/navigation'

const messages: Record<string, string> = {
  ok: 'Thank you — you are on the list. We send rates and shipping news, nothing else.',
  already: 'That address is already on our list.',
  invalid: 'That does not look like a valid email address.',
}

/** Feedback for the footer newsletter form, which posts and redirects back. */
export default function SubscribeNotice() {
  const state = useSearchParams().get('subscribe')
  if (!state) return null
  const message = messages[state]
  if (!message) return null

  return (
    <p className="site-footer__notice" role="status">
      {message}
    </p>
  )
}

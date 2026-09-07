'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, type LoginState } from '@/actions'

export default function LoginPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})

  useEffect(() => {
    if (state.ok) router.replace('/')
  }, [state.ok, router])

  return (
    <section className="band">
      <div className="frame" style={{ maxWidth: '26rem' }}>
        <form className="form-card" action={action}>
          <h1 className="h-sub">Staff sign in</h1>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="info@ancargoservices.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state.error && (
            <p className="form-note" role="alert" style={{ color: 'var(--accent)' }}>
              {state.error}
            </p>
          )}
          <button className="btn" type="submit" disabled={pending}>
            {pending ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  )
}

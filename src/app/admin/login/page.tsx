'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, type LoginState } from '../actions'

export default function LoginPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})

  useEffect(() => {
    if (state.ok) router.replace('/admin')
  }, [state.ok, router])

  return (
    <section className="band">
      <div className="frame" style={{ maxWidth: '26rem' }}>
        <form className="form-card" action={action}>
          <h1 className="h-sub">Staff sign in</h1>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoFocus autoComplete="current-password" />
          </div>
          {state.error && (
            <p className="form-note" role="alert" style={{ color: 'var(--accent)' }}>
              {state.error}
            </p>
          )}
          <button className="btn" type="submit" disabled={pending}>
            {pending ? 'Checking…' : 'Sign in'}
          </button>
          <p className="form-note">
            Set <code>ADMIN_PASSWORD</code> in the server environment. This is a scaffold-level gate — replace it with
            per-user accounts before more than a couple of people need access.
          </p>
        </form>
      </div>
    </section>
  )
}

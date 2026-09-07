'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcryptjs from 'bcryptjs'
import { store } from '@/lib/store'
import { mailer } from '@/lib/mail'
import { bookingConfirmed, statusChanged } from '@/lib/emails'
import type { Status } from '@/lib/shipments'
import { AUTH_COOKIE } from '@/lib/auth'
import { createPool } from '@/lib/postgres-store'

export type LoginState = { error?: string; ok?: boolean }

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get('email')).trim().toLowerCase()
  const password = String(form.get('password'))

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) return { error: 'Database not configured.' }

  const pool = createPool(dbUrl)
  const { rows } = await pool.query<{ password_hash: string }>(
    'select password_hash from staff_users where email = $1',
    [email],
  )

  if (rows.length === 0 || !(await bcryptjs.compare(password, rows[0].password_hash))) {
    return { error: 'Invalid email or password.' }
  }

  const jar = await cookies()
  jar.set(AUTH_COOKIE, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return { ok: true }
}

export async function logout() {
  const jar = await cookies()
  jar.delete(AUTH_COOKIE)
  redirect('/login')
}

export async function isStaff() {
  const jar = await cookies()
  return Boolean(jar.get(AUTH_COOKIE)?.value)
}

export async function updateStatus(form: FormData) {
  const ref = String(form.get('ref'))
  const status = String(form.get('status')) as Status
  const location = String(form.get('location') ?? '').trim() || undefined
  const note = String(form.get('note') ?? '').trim() || undefined
  const shipment = await store.addEvent(ref, status, location, note)

  if (shipment) {
    const message = statusChanged(shipment)
    if (message) await mailer.send(message)
  }

  revalidatePath(`/shipments/${ref}`)
}

export async function confirmShipment(form: FormData) {
  const ref = String(form.get('ref'))
  const freight = Number(form.get('freightPkr'))
  if (Number.isFinite(freight) && freight >= 0) {
    const shipment = await store.confirm(ref, freight)
    if (shipment) {
      const message = bookingConfirmed(shipment)
      if (message) await mailer.send(message)
    }
  }
  revalidatePath(`/shipments/${ref}`)
}

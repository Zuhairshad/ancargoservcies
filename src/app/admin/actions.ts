'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { store } from '@/lib/store'
import { mailer } from '@/lib/mail'
import { bookingConfirmed, statusChanged } from '@/lib/emails'
import type { Status } from '@/lib/shipments'
import { AUTH_COOKIE } from '@/lib/auth'

export type LoginState = { error?: string; ok?: boolean }

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return { error: 'ADMIN_PASSWORD is not set on the server. Add it to your environment — see .env.example.' }
  }
  if (String(form.get('password')) !== expected) {
    return { error: 'That password is not right.' }
  }
  const jar = await cookies()
  jar.set(AUTH_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  // The caller navigates once this returns: setting a cookie and redirecting in
  // the same action response breaks the round trip.
  return { ok: true }
}

export async function logout() {
  const jar = await cookies()
  jar.delete(AUTH_COOKIE)
  redirect('/admin/login')
}

export async function isStaff() {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const jar = await cookies()
  return jar.get(AUTH_COOKIE)?.value === expected
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

  revalidatePath(`/admin/shipments/${ref}`)
  revalidatePath(`/track/${ref}`)
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
  revalidatePath(`/admin/shipments/${ref}`)
  revalidatePath(`/track/${ref}`)
}

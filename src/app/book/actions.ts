'use server'

import { redirect } from 'next/navigation'
import { store } from '@/lib/store'
import { getQuote } from '@/lib/quote'
import type { ServiceMode } from '@/data/rates'

export type BookingState = { error?: string }

function text(form: FormData, key: string) {
  return String(form.get(key) ?? '').trim()
}

export async function createBooking(_prev: BookingState, form: FormData): Promise<BookingState> {
  const required = [
    'senderName',
    'senderPhone',
    'senderAddress',
    'senderCity',
    'receiverName',
    'receiverPhone',
    'receiverAddress',
    'receiverCity',
    'receiverCountry',
    'contents',
  ]

  for (const key of required) {
    if (!text(form, key)) return { error: 'Please fill in every required field before submitting.' }
  }

  const weightKg = Number(form.get('weightKg'))
  const pieces = Number(form.get('pieces'))
  if (!Number.isFinite(weightKg) || weightKg <= 0) return { error: 'Enter the total weight in kilograms.' }
  if (!Number.isFinite(pieces) || pieces < 1) return { error: 'Enter how many pieces are in the shipment.' }

  const mode = text(form, 'mode') as ServiceMode
  const receiverCountry = text(form, 'receiverCountry')
  const quote = getQuote({ to: receiverCountry, mode, weightKg })

  const shipment = await store.create({
    sender: {
      name: text(form, 'senderName'),
      phone: text(form, 'senderPhone'),
      email: text(form, 'senderEmail') || undefined,
      address: text(form, 'senderAddress'),
      city: text(form, 'senderCity'),
      country: 'Pakistan',
    },
    receiver: {
      name: text(form, 'receiverName'),
      phone: text(form, 'receiverPhone'),
      email: text(form, 'receiverEmail') || undefined,
      address: text(form, 'receiverAddress'),
      city: text(form, 'receiverCity'),
      country: receiverCountry,
    },
    mode,
    pieces,
    weightKg,
    contents: text(form, 'contents'),
    declaredValuePkr: Number(form.get('declaredValuePkr')) || 0,
    estimatePkr: quote.kind === 'priced' ? quote.totalPkr : null,
    pickupDate: text(form, 'pickupDate') || undefined,
  })

  redirect(`/book/confirmed/${shipment.ref}`)
}

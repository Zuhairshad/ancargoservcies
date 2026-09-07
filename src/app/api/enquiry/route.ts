import { NextResponse } from 'next/server'
import { mailer, officeInbox } from '@/lib/mail'
import { enquiryReceived } from '@/lib/emails'

export async function POST(request: Request) {
  const form = await request.formData()

  // Honeypot: a field hidden from people but filled in by most form bots.
  if (String(form.get('b0t_check') ?? '').trim() !== '') {
    return NextResponse.redirect(new URL('/contact?sent=ok', request.url), 303)
  }

  const payload = {
    firstName: String(form.get('firstName') ?? '').trim(),
    lastName: String(form.get('lastName') ?? '').trim() || undefined,
    email: String(form.get('email') ?? '').trim(),
    phone: String(form.get('phone') ?? '').trim() || undefined,
    message: String(form.get('message') ?? '').trim(),
  }

  if (!payload.firstName || !payload.email.includes('@') || payload.message.length < 5) {
    return NextResponse.redirect(new URL('/contact?sent=invalid', request.url), 303)
  }

  const message = enquiryReceived(payload)
  const { delivered } = await mailer.send({ ...message, to: officeInbox })

  return NextResponse.redirect(new URL(`/contact?sent=${delivered ? 'ok' : 'queued'}`, request.url), 303)
}

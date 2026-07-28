import { NextResponse } from 'next/server'

/**
 * Contact form. Scaffolded, not yet connected: wire this to the info@ mailbox
 * over SMTP, or to a transactional provider, then remove this note.
 */
export async function POST(request: Request) {
  const form = await request.formData()
  const payload = {
    firstName: String(form.get('firstName') ?? '').trim(),
    lastName: String(form.get('lastName') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    phone: String(form.get('phone') ?? '').trim(),
    message: String(form.get('message') ?? '').trim(),
  }

  if (!payload.firstName || !payload.email.includes('@') || !payload.message) {
    return NextResponse.redirect(new URL('/contact?sent=invalid', request.url), 303)
  }

  console.info('[enquiry] pending integration:', payload)
  return NextResponse.redirect(new URL('/contact?sent=ok', request.url), 303)
}

import { NextResponse } from 'next/server'

/**
 * Newsletter sign-up. Scaffolded, not yet connected: point this at whatever ANCS
 * actually uses (Mailchimp, Brevo, or an SMTP send to info@) once that is decided.
 */
export async function POST(request: Request) {
  const form = await request.formData()
  const email = String(form.get('email') ?? '').trim()
  if (!email.includes('@')) {
    return NextResponse.redirect(new URL('/?subscribe=invalid', request.url), 303)
  }
  console.info('[subscribe] pending integration:', email)
  return NextResponse.redirect(new URL('/?subscribe=ok', request.url), 303)
}

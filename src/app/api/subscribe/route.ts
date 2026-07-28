import { NextResponse } from 'next/server'
import { mailer, officeInbox } from '@/lib/mail'
import { subscriberAdded } from '@/lib/emails'
import { subscribers } from '@/lib/subscribers'

export async function POST(request: Request) {
  const form = await request.formData()
  const email = String(form.get('email') ?? '').trim()
  const back = new URL(request.headers.get('referer') ?? '/', request.url)

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    back.searchParams.set('subscribe', 'invalid')
    return NextResponse.redirect(back, 303)
  }

  const { added } = await subscribers.add(email)
  if (added) await mailer.send({ ...subscriberAdded(email), to: officeInbox })

  back.searchParams.set('subscribe', added ? 'ok' : 'already')
  return NextResponse.redirect(back, 303)
}

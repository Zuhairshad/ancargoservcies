#!/usr/bin/env node
/**
 * Integration test for outbound mail. Starts a real SMTP server, points the app's
 * mailer at it, and asserts on the messages that actually arrive — headers,
 * recipients and body.
 *
 *   npm run test:mail
 *
 * Needs no database and sends nothing outside this machine.
 */

import { SMTPServer } from 'smtp-server'

const PORT = 2526

// Configure the mailer before importing it — selectMailer() reads env at module load.
process.env.SMTP_HOST = '127.0.0.1'
process.env.SMTP_PORT = String(PORT)
process.env.SMTP_FROM = 'AN Cargo Services <info@ancargoservices.com>'
process.env.OFFICE_INBOX = 'office@ancargoservices.com'
process.env.NEXT_PUBLIC_SITE_URL = 'https://ancargoservices.com'
delete process.env.SMTP_USER
delete process.env.SMTP_PASSWORD

const { mailer, officeInbox, mailConfigured } = await import('../src/lib/mail.ts')
const { bookingReceived, bookingConfirmed, statusChanged, enquiryReceived, subscriberAdded } = await import(
  '../src/lib/emails.ts'
)

const inbox = []

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ['STARTTLS'],
  onData(stream, session, callback) {
    let raw = ''
    stream.on('data', (chunk) => (raw += chunk))
    stream.on('end', () => {
      inbox.push({ raw, envelopeTo: session.envelope.rcptTo.map((r) => r.address), from: session.envelope.mailFrom.address })
      callback()
    })
  },
})

await new Promise((resolve, reject) => {
  server.listen(PORT, '127.0.0.1', resolve)
  server.on('error', reject)
})

let passed = 0
const failures = []
const check = (name, ok, detail = '') => {
  if (ok) {
    passed += 1
    console.log(`  ok    ${name}`)
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/** Decode quoted-printable soft line breaks so assertions can match plain text. */
const body = (raw) => raw.replace(/=\r?\n/g, '').replace(/=3D/g, '=').replace(/\r\n/g, '\n')

/** Decode one RFC 2047 encoded-word (=?UTF-8?Q?…?= or =?UTF-8?B?…?=). */
function decodeWord(charset, encoding, text) {
  if (encoding.toUpperCase() === 'B') return Buffer.from(text, 'base64').toString(charset)
  const bytes = text
    .replace(/_/g, ' ')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  return Buffer.from(bytes, 'binary').toString(charset)
}

/**
 * Read a header value: unfold continuation lines first (headers wrap at ~76
 * chars), then decode any encoded-words. Subjects here contain an em dash, so
 * nodemailer MIME-encodes them and a naive regex sees mangled base64/QP.
 */
const header = (raw, name) => {
  const unfolded = raw.replace(/\r\n/g, '\n').replace(/\n[ \t]+/g, ' ')
  const match = unfolded.match(new RegExp(`^${name}:[ \\t]*(.*)$`, 'im'))
  if (!match) return ''
  return match[1]
    .replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=(\s*)(?==\?)/g, (_, cs, enc, text) => decodeWord(cs, enc, text))
    .replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g, (_, cs, enc, text) => decodeWord(cs, enc, text))
    .trim()
}

const shipment = {
  ref: 'ANCS-2607-0148',
  createdAt: '2026-07-17T09:00:00.000Z',
  status: 'booked',
  confirmed: false,
  sender: { name: 'Bilal Ahmed', phone: '+92 300 1234567', email: 'bilal@example.com', address: '112 Susan Road', city: 'Faisalabad', country: 'Pakistan' },
  receiver: { name: 'M. Rashid', phone: '+44 7700 900123', address: '14 Wilmslow Road', city: 'Manchester M14 5TQ', country: 'United Kingdom' },
  mode: 'sea-lcl',
  pieces: 3,
  weightKg: 24,
  contents: 'Household items, clothing, gifts',
  declaredValuePkr: 85000,
  estimatePkr: 13200,
  freightPkr: null,
  events: [{ status: 'booked', at: '2026-07-17T09:00:00.000Z', location: 'Faisalabad', note: 'Booking received' }],
}

try {
  console.log('configuration')
  check('mailConfigured is true when SMTP_HOST is set', mailConfigured === true)
  check('officeInbox honours OFFICE_INBOX', officeInbox === 'office@ancargoservices.com', officeInbox)

  console.log('\nbooking receipt to the customer')
  const receipt = bookingReceived(shipment)
  const sent = await mailer.send({ ...receipt, bcc: officeInbox })
  check('send() reports delivery', sent.delivered === true, sent.reason ?? '')
  check('one message arrived', inbox.length === 1, String(inbox.length))

  const mail = inbox[0]
  check('addressed to the customer', header(mail.raw, 'To') === 'bilal@example.com', header(mail.raw, 'To'))
  check('bcc goes to the office in the envelope only', mail.envelopeTo.includes('office@ancargoservices.com'))
  check('bcc is not exposed in the headers', !/^bcc:/im.test(mail.raw))
  check('from is the ANCS mailbox', mail.from === 'info@ancargoservices.com', mail.from)
  check('subject carries the reference', header(mail.raw, 'Subject').includes('ANCS-2607-0148'), header(mail.raw, 'Subject'))
  check('body states the reference', body(mail.raw).includes('ANCS-2607-0148'))
  check('body includes the tracking URL', body(mail.raw).includes('https://ancargoservices.com/track/ANCS-2607-0148'))
  check('body includes the estimate', body(mail.raw).includes('PKR 13,200'))
  check('body says nothing is charged yet', /nothing is charged/i.test(body(mail.raw)))
  check('has both text and html parts', /Content-Type: text\/plain/i.test(mail.raw) && /Content-Type: text\/html/i.test(mail.raw))

  console.log('\nno customer email means no customer mail')
  const anonymous = bookingReceived({ ...shipment, sender: { ...shipment.sender, email: undefined } })
  check('bookingReceived() returns null without an address', anonymous === null)

  console.log('\nconfirmation after weighing')
  inbox.length = 0
  const confirmedMsg = bookingConfirmed({ ...shipment, confirmed: true, freightPkr: 13200 })
  await mailer.send(confirmedMsg)
  check('confirmation arrived', inbox.length === 1)
  check('subject shows the final freight', header(inbox[0].raw, 'Subject').includes('PKR 13,200'), header(inbox[0].raw, 'Subject'))
  check('body flags destination duties', /duties or taxes/i.test(body(inbox[0].raw)))
  check('unconfirmed shipments produce no confirmation', bookingConfirmed(shipment) === null)

  console.log('\nstatus updates')
  inbox.length = 0
  const milestone = statusChanged({
    ...shipment,
    status: 'out-for-delivery',
    events: [...shipment.events, { status: 'out-for-delivery', at: '2026-07-28T06:00:00.000Z', location: 'Manchester', note: 'With the driver' }],
  })
  await mailer.send(milestone)
  check('milestone update arrived', inbox.length === 1)
  check('subject names the status', /out for delivery/i.test(header(inbox[0].raw, 'Subject')), header(inbox[0].raw, 'Subject'))
  check('body carries the location and note', body(inbox[0].raw).includes('Manchester') && body(inbox[0].raw).includes('With the driver'))
  check('quiet statuses send nothing', statusChanged({ ...shipment, status: 'at-hub' }) === null)
  check('booked sends nothing (the receipt already covered it)', statusChanged({ ...shipment, status: 'booked' }) === null)

  console.log('\nenquiry from the contact form')
  inbox.length = 0
  const enquiry = enquiryReceived({ firstName: 'Ayesha', lastName: 'Malik', email: 'ayesha@example.com', phone: '+92 321 7654321', message: 'What does 30 kg to Dubai cost by air?' })
  await mailer.send({ ...enquiry, to: officeInbox })
  check('enquiry reached the office', inbox.length === 1 && header(inbox[0].raw, 'To') === 'office@ancargoservices.com')
  check('reply-to is the customer, so staff can just hit reply', header(inbox[0].raw, 'Reply-To') === 'ayesha@example.com', header(inbox[0].raw, 'Reply-To'))
  check('subject names the sender', header(inbox[0].raw, 'Subject').includes('Ayesha Malik'))
  check('the question is in the body', body(inbox[0].raw).includes('30 kg to Dubai'))

  console.log('\nsubscriber notification')
  inbox.length = 0
  await mailer.send({ ...subscriberAdded('newcustomer@example.com'), to: officeInbox })
  check('notification reached the office', inbox.length === 1)
  check('address is in the subject', header(inbox[0].raw, 'Subject').includes('newcustomer@example.com'))

  console.log('\nfailure handling — a dead mail server must not break a booking')
  await new Promise((resolve) => server.close(resolve))
  const afterClose = await mailer.send({ to: 'someone@example.com', subject: 'Should fail', text: 'x' })
  check('send() resolves rather than throwing', afterClose.delivered === false, JSON.stringify(afterClose))
  check('reason explains the failure', afterClose.reason === 'send-failed', String(afterClose.reason))
} finally {
  try {
    await new Promise((resolve) => server.close(resolve))
  } catch {}
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length) {
  console.log('\nfailures:')
  failures.forEach((f) => console.log(`  - ${f}`))
  process.exitCode = 1
}
process.exit(failures.length ? 1 : 0)

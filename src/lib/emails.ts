import type { Message } from './mail'
import type { Shipment } from './shipments'
import { statusLabels, trackingUrl } from './shipments'
import { modeLabels } from '@/data/rates'
import { formatPkr } from './quote'
import { site } from '@/data/site'

/**
 * Email bodies. Plain text is the canonical version — it is what most recipients
 * on a phone in Faisalabad or Manchester will actually see well — with a light
 * HTML wrapper for clients that prefer it. No images, no tracking pixels.
 */

const signature = `${site.name}
${site.address.line1}, ${site.address.line2}, ${site.address.region}
${site.phone} · WhatsApp ${site.mobile}
${site.email}`

function wrap(title: string, paragraphs: string[]) {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#06202f;max-width:560px">
<h1 style="font-size:20px;letter-spacing:-0.02em;margin:0 0 16px">${title}</h1>
${body}
<hr style="border:0;border-top:1px solid #e6e6e6;margin:24px 0 12px">
<p style="margin:0;font-size:12px;color:#6f7376;line-height:1.6">${signature.replace(/\n/g, '<br>')}</p>
</div>`
}

function summaryLines(shipment: Shipment) {
  return [
    `Reference:   ${shipment.ref}`,
    `From:        ${shipment.sender.city}, ${shipment.sender.country}`,
    `To:          ${shipment.receiver.city}, ${shipment.receiver.country}`,
    `Service:     ${modeLabels[shipment.mode]}`,
    `Pieces:      ${shipment.pieces}`,
    `Weight:      ${shipment.weightKg} kg`,
    `Contents:    ${shipment.contents}`,
  ].join('\n')
}

/** Sent to the customer the moment a booking is submitted. */
export function bookingReceived(shipment: Shipment): Message | null {
  if (!shipment.sender.email) return null
  const url = trackingUrl(shipment.ref)
  const estimate =
    shipment.estimatePkr === null
      ? 'We will confirm the freight charge once the consignment has been weighed.'
      : `Estimated freight is ${formatPkr(shipment.estimatePkr)}, based on the weight you entered. The final figure is set after weighing.`

  const paragraphs = [
    `Thank you — we have your booking. Your reference is <b>${shipment.ref}</b>.`,
    'Our team will call you to arrange collection, usually the same working day.',
    estimate,
    `You can follow it here: <a href="${url}">${url}</a>`,
    'Nothing is charged at this stage.',
  ]

  return {
    to: shipment.sender.email,
    subject: `${shipment.ref} — booking received`,
    text: `Thank you — we have your booking.

Your reference is ${shipment.ref}.

${summaryLines(shipment)}

Our team will call you to arrange collection, usually the same working day.
${estimate.replace(/<[^>]+>/g, '')}

Track it here: ${url}

Nothing is charged at this stage.

${signature}`,
    html: wrap('Booking received', paragraphs),
  }
}

/** Sent when staff confirm the freight charge after weighing. */
export function bookingConfirmed(shipment: Shipment): Message | null {
  if (!shipment.sender.email || shipment.freightPkr === null) return null
  const url = trackingUrl(shipment.ref)

  return {
    to: shipment.sender.email,
    subject: `${shipment.ref} — confirmed, freight ${formatPkr(shipment.freightPkr)}`,
    text: `Your shipment is confirmed.

${summaryLines(shipment)}
Freight:     ${formatPkr(shipment.freightPkr)}

This is the final freight charge, set after weighing. Duties or taxes charged at
the destination are payable by the recipient and are not included.

Track it here: ${url}

${signature}`,
    html: wrap('Shipment confirmed', [
      `Your shipment <b>${shipment.ref}</b> is confirmed.`,
      `Freight charge: <b>${formatPkr(shipment.freightPkr)}</b> — the final figure, set after weighing.`,
      'Duties or taxes charged at the destination are payable by the recipient and are not included.',
      `Track it here: <a href="${url}">${url}</a>`,
    ]),
  }
}

/** Sent to the customer when a shipment reaches a milestone worth an inbox. */
export function statusChanged(shipment: Shipment): Message | null {
  if (!shipment.sender.email) return null
  const notify = ['collected', 'departed', 'customs', 'out-for-delivery', 'delivered']
  if (!notify.includes(shipment.status)) return null

  const url = trackingUrl(shipment.ref)
  const last = shipment.events[shipment.events.length - 1]
  const where = last?.location ? ` (${last.location})` : ''
  const label = statusLabels[shipment.status]

  return {
    to: shipment.sender.email,
    subject: `${shipment.ref} — ${label.toLowerCase()}`,
    text: `Update on shipment ${shipment.ref}.

Status: ${label}${where}
${last?.note ? `Note: ${last.note}\n` : ''}
Full history: ${url}

${signature}`,
    html: wrap(`${label}${where}`, [
      `Shipment <b>${shipment.ref}</b> is now <b>${label.toLowerCase()}</b>.`,
      last?.note ? last.note : '',
      `Full history: <a href="${url}">${url}</a>`,
    ].filter(Boolean)),
  }
}

/** Enquiry from the contact form, sent to the office with the customer as reply-to. */
export function enquiryReceived(input: {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  message: string
}): Message {
  const name = [input.firstName, input.lastName].filter(Boolean).join(' ')
  return {
    to: '', // filled in by the caller with the office inbox
    replyTo: input.email,
    subject: `Website enquiry from ${name}`,
    text: `New enquiry from the website.

Name:  ${name}
Email: ${input.email}
Phone: ${input.phone || '—'}

${input.message}

Reply directly to this message to answer ${input.firstName}.`,
    html: wrap('Website enquiry', [
      `<b>${name}</b> — ${input.email}${input.phone ? ` · ${input.phone}` : ''}`,
      input.message,
      `Reply directly to this message to answer ${input.firstName}.`,
    ]),
  }
}

/** Notification that someone signed up for rates and shipping news. */
export function subscriberAdded(email: string): Message {
  return {
    to: '',
    subject: `New newsletter subscriber: ${email}`,
    text: `${email} signed up for rates and shipping news on the website.\n\n${signature}`,
    html: wrap('New subscriber', [`<b>${email}</b> signed up for rates and shipping news on the website.`]),
  }
}

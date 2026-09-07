import type { Message } from './mail'
import type { Shipment } from './shipments'
import { statusLabels, trackingUrl } from './shipments'
import { modeLabels } from '@/data/rates'
import { formatPkr } from './quote'

const site = {
  name: 'AN Cargo Services',
  phone: '+92 41 8737799',
  mobile: '+92 307 6998 742',
  email: 'info@ancargoservices.com',
  address: '4-Z, 14/A Chenab Market, Madina Town, Faisalabad',
}

const signature = `${site.name}
${site.address}
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

export function bookingConfirmed(shipment: Shipment): Message | null {
  if (!shipment.sender.email || shipment.freightPkr === null) return null
  const url = trackingUrl(shipment.ref)

  return {
    to: shipment.sender.email,
    subject: `${shipment.ref} — confirmed, freight ${formatPkr(shipment.freightPkr)}`,
    text: `Your shipment is confirmed.

${summaryLines(shipment)}
Freight:     ${formatPkr(shipment.freightPkr)}

Track it here: ${url}

${signature}`,
    html: wrap('Shipment confirmed', [
      `Your shipment <b>${shipment.ref}</b> is confirmed.`,
      `Freight charge: <b>${formatPkr(shipment.freightPkr)}</b> — the final figure, set after weighing.`,
      `Track it here: <a href="${url}">${url}</a>`,
    ]),
  }
}

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

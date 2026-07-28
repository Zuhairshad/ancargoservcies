import nodemailer, { type Transporter } from 'nodemailer'
import { site } from '@/data/site'

/**
 * Outbound mail, behind an interface for the same reason the shipment store is:
 * SMTP through the info@ mailbox works today, and moving to a transactional
 * provider later means one more implementation, not edits across the app.
 *
 * With SMTP_HOST unset, LogMailer writes messages to the server log instead of
 * sending. Nothing throws and no page breaks — useful in development, and it
 * means a misconfigured production deploy loses notifications rather than
 * failing a customer's booking.
 */

export type Message = {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  /** Copy to the office. Set on customer-facing mail so staff see what went out. */
  bcc?: string
}

export interface Mailer {
  send(message: Message): Promise<{ delivered: boolean; reason?: string }>
}

class LogMailer implements Mailer {
  async send(message: Message) {
    console.info(
      `[mail] SMTP not configured — would have sent to ${message.to}: "${message.subject}"\n${message.text}`,
    )
    return { delivered: false, reason: 'smtp-not-configured' }
  }
}

class SmtpMailer implements Mailer {
  private transport: Transporter
  private from: string

  constructor(transport: Transporter, from: string) {
    this.transport = transport
    this.from = from
  }

  async send(message: Message) {
    try {
      await this.transport.sendMail({
        from: this.from,
        to: message.to,
        bcc: message.bcc,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      })
      return { delivered: true }
    } catch (error) {
      // A failed notification must never take down the booking that triggered it.
      console.error(`[mail] send to ${message.to} failed:`, error instanceof Error ? error.message : error)
      return { delivered: false, reason: 'send-failed' }
    }
  }
}

const globalForMail = globalThis as unknown as { ancsMailer?: Mailer }

function selectMailer(): Mailer {
  const host = process.env.SMTP_HOST
  if (!host) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[mail] SMTP_HOST is not set — enquiries and booking confirmations will only be logged.')
    }
    return new LogMailer()
  }

  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  const transport = nodemailer.createTransport({
    host,
    port,
    // 465 is implicit TLS; 587 and 25 start plaintext and upgrade with STARTTLS.
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
    requireTLS: port === 587,
  })

  return new SmtpMailer(transport, process.env.SMTP_FROM ?? `${site.name} <${site.email}>`)
}

export const mailer: Mailer = globalForMail.ancsMailer ?? selectMailer()

if (process.env.NODE_ENV !== 'production') globalForMail.ancsMailer = mailer

/** True when mail actually leaves the building. Drives the notice on the contact form. */
export const mailConfigured = Boolean(process.env.SMTP_HOST)

/** Where enquiries and internal notifications go. */
export const officeInbox = process.env.OFFICE_INBOX ?? site.email

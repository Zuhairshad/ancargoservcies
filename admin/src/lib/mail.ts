import nodemailer, { type Transporter } from 'nodemailer'

export type Message = {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  bcc?: string
}

export interface Mailer {
  send(message: Message): Promise<{ delivered: boolean; reason?: string }>
}

class LogMailer implements Mailer {
  async send(message: Message) {
    console.info(`[mail] SMTP not configured — would have sent to ${message.to}: "${message.subject}"`)
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
      console.error(`[mail] send to ${message.to} failed:`, error instanceof Error ? error.message : error)
      return { delivered: false, reason: 'send-failed' }
    }
  }
}

const globalForMail = globalThis as unknown as { ancsAdminMailer?: Mailer }

function selectMailer(): Mailer {
  const host = process.env.SMTP_HOST
  if (!host) return new LogMailer()

  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
    requireTLS: port === 587,
  })

  const from = process.env.SMTP_FROM ?? 'AN Cargo Services <info@ancargoservices.com>'
  return new SmtpMailer(transport, from)
}

export const mailer: Mailer = globalForMail.ancsAdminMailer ?? selectMailer()

if (process.env.NODE_ENV !== 'production') globalForMail.ancsAdminMailer = mailer

export const officeInbox = process.env.OFFICE_INBOX ?? 'info@ancargoservices.com'

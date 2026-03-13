import * as nodemailer from 'nodemailer'

import { decrypt, isEncrypted } from 'src/lib/crypto'
import { getSetting } from 'src/lib/settingsCache'

interface Options {
  to: string | string[]
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text }: Options) {
  const smtpHost: string = getSetting('smtp_host') || ''
  const smtpUser: string = getSetting('smtp_user') || ''
  const rawPass: string = getSetting('smtp_pass') || ''
  const smtpPass: string =
    rawPass && isEncrypted(rawPass) ? decrypt(rawPass) : rawPass
  const smtpSecure: boolean = getSetting('smtp_secure') || false

  const [host, portStr] = smtpHost.split(':')
  const port = portStr ? parseInt(portStr, 10) : 1025

  if (!host || ['test', 'development'].includes(process.env.NODE_ENV)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn({ to, subject, text })
    }
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: `"Memoryhole Legal Support Database" <${smtpUser}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
    })
    return info
  } catch (err) {
    console.error(err)
    throw err
  }
}

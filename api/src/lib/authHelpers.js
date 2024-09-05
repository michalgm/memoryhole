import crypto from 'crypto'

import md5 from 'md5'
import { v4 as uuidv4 } from 'uuid'

import { hashPassword, hashToken } from '@redwoodjs/auth-dbauth-api'

import { sendEmail } from 'src/lib/email'

export const tokenExpireHours = 24

export const sanitize = (user) => {
  const sanitized = JSON.parse(JSON.stringify(user))
  delete sanitized['hashedPassword']
  delete sanitized['salt']
  return sanitized
}

export const sendReset = async (user, resetToken, newUser = false) => {
  const reason = newUser
    ? `A new account was created on the Memoryhole Legal Support Database for the email address (${user.email})`
    : `The Memoryhole Legal Support Database received a request to reset the password associated with this email address (${user.email}) `
  const text = `Hello ${user.name},
${reason}
Please follow the link below to reset your password:
${process.env.PUBLIC_URL}/reset-password?resetToken=${resetToken}

This password reset link will expire in ${tokenExpireHours} hours. If you do not complete the process before then, you will need to start the password reset process again:
${process.env.PUBLIC_URL}/forgot-password

Please do not reply to this email as it is sent from an unmonitored mailbox.`

  await sendEmail({
    to: user.email,
    subject: 'Memoryhole Database Password Reset',
    text,
  })
  return user
}

export const initUser = (input) => {
  const tokenExpires = new Date()
  tokenExpires.setSeconds(
    tokenExpires.getSeconds() + 60 * 60 * tokenExpireHours
  )
  let token = md5(uuidv4())
  const buffer = Buffer.from(token)
  token = buffer.toString('base64').replace('=', '').substring(0, 16)

  const tokenHash = hashToken(token)

  const [hashedPassword, salt] = hashPassword(
    crypto.randomBytes(20).toString('hex')
  )

  const data = {
    ...input,
    hashedPassword,
    salt,
    resetToken: tokenHash,
    resetTokenExpiresAt: tokenExpires,
  }

  return { data, token }
}

export const onboardUser = (user, token) => {
  // user.resetToken = token
  // call user-defined handler in their functions/auth.js
  return sendReset(sanitize(user), token, true)
}

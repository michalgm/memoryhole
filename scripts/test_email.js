import { sendEmail } from '../api/src/lib/email.ts'

export default async ({ args }) => {
  const [to] = args._
  await sendEmail({
    to,
    subject: 'Memoryhole Email Test',
    text: 'Test',
  })
}

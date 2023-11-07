import * as nodemailer from 'nodemailer'

interface Options {
  to: string | string[]
  subject: string
  text: string
  html: string
}

export async function sendEmail({ to, subject, text, html }: Options) {
  console.log('Sending email to:', to)
  console.log({
    auth: {
      user: process.env.PROTONMAIL_EMAIL,
      pass: process.env.PROTONMAIL_PW,
    },
  })

  // create reusable transporter object using SendInBlue for SMTP
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.PROTONMAIL_LOGIN,
      pass: process.env.PROTONMAIL_PW,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Memoryhole Legal Support Database" ${process.env.PROTONMAIL_EMAIL}>`,
      to: Array.isArray(to) ? to : [to], // list of receivers
      subject, // Subject line
      text, // plain text body
      // html, // html body
    })
    return info
  } catch (err) {
    console.error(err)
    throw err
  }
}

// async function main() {
//   let transporter = nodemailer.createTransport({
//     host: '127.0.0.1',
//     port: 1025,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'johnnycash@protonmail.com',
//       pass: '$cHI4cyrtfUM',
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   })

//   let info = await transporter.sendMail({
//     from: '"Me" <johnnycash@protonmail.com>',
//     to: 'someonecool@email.com',
//     subject: 'Hello!',
//     text: 'Hello world?',
//     html: '<b>Hello world?</b>',
//   })

//   // console.log("Message sent: %s", info.messageId);
// }

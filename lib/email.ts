import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (process.env.NODE_ENV === 'development') {
    // In development, log the email instead of sending it
    console.log('=== Development Email ===')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML:', html)
    console.log('=======================')
    return { success: true }
  }

  // In production, actually send the email
  return await resend.emails.send({
    from: 'Your Company <noreply@yourcompany.com>',
    to,
    subject,
    html,
  })
}

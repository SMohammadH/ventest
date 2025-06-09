import { Redis } from '@upstash/redis'
import { sendEmail } from '@/lib/email'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

async function processInvitations() {
  console.log('Email worker started...')
  console.log('Redis URL:', process.env.UPSTASH_REDIS_REST_URL)
  console.log('Environment:', process.env.NODE_ENV)

  while (true) {
    try {
      console.log('Checking for new invitations...')
      // Get the latest invitation from the queue
      const invitation = await redis.rpop('expert-invitations')

      if (!invitation) {
        console.log('No invitations in queue, waiting...')
        await new Promise((resolve) => setTimeout(resolve, 5000))
        continue
      }

      console.log('Found invitation:', invitation)
      const { expertId, email, firstName } = JSON.parse(invitation)

      console.log('Sending email to:', email)
      // Send invitation email
      const result = await sendEmail({
        to: email,
        subject: 'Welcome to Our Expert Network',
        html: `
          <h1>Welcome ${firstName}!</h1>
          <p>We're excited to have you join our expert network.</p>
          <p>Please click the link below to set up your account:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/expert/setup/${expertId}">
            Set Up Your Account
          </a>
        `,
      })

      console.log('Email send result:', result)
    } catch (error) {
      console.error('Error processing invitation:', error)
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
}

// Start the worker
console.log('Starting email worker...')
processInvitations().catch((error) => {
  console.error('Worker crashed:', error)
  process.exit(1)
})

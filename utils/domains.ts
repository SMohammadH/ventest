export const NEXT_PUBLIC_APP_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://ventest.vercel.com'

export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password.normalize())
  const saltBuffer = encoder.encode(salt)

  // Combine password and salt
  const combinedBuffer = new Uint8Array(
    passwordBuffer.length + saltBuffer.length
  )
  combinedBuffer.set(passwordBuffer)
  combinedBuffer.set(saltBuffer, passwordBuffer.length)

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function comparePasswords({
  password,
  salt,
  hashedPassword,
}: {
  password: string
  salt: string
  hashedPassword: string
}) {
  const inputHashedPassword = await hashPassword(password, salt)
  return inputHashedPassword === hashedPassword
}

export function generateSalt(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

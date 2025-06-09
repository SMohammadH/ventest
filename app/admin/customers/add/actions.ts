'use server'

import { db } from '@/drizzle/db'
import { CustomerTable } from '@/drizzle/schema'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/auth/next/currentUser'
import { eq } from 'drizzle-orm'
import { UserTable } from '@/drizzle/schema'

type CustomerInput = {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
}

export async function addCustomer(data: CustomerInput) {
  try {
    const user = await getCurrentUser({ withFullUser: true })

    if (!user) {
      throw new Error('User must be authenticated to add a customer')
    }

    // Verify user exists in database
    const dbUser = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, user.id),
    })

    if (!dbUser) {
      throw new Error('User not found in database. Please sign in again.')
    }

    console.log('Current user data:', {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    await db.insert(CustomerTable).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber || null,
      address: data.address || null,
      createdBy: user.id,
    })

    revalidatePath('/admin/customers')
  } catch (error) {
    console.error('Error adding customer:', error)
    throw new Error('Failed to add customer')
  }
}

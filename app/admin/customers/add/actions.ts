'use server'

import { db } from '@/drizzle/db'
import { CustomerTable } from '@/drizzle/schema'
import { revalidatePath } from 'next/cache'

type CustomerInput = {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
}

export async function addCustomer(data: CustomerInput) {
  try {
    await db.insert(CustomerTable).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber || null,
      address: data.address || null,
    })

    revalidatePath('/admin/customers')
  } catch (error) {
    console.error('Error adding customer:', error)
    throw new Error('Failed to add customer')
  }
}

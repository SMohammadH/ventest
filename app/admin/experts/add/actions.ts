'use server'

import { db } from '@/drizzle/db'
import { ExpertTable } from '@/drizzle/schema'
import { revalidatePath } from 'next/cache'

type ExpertInput = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export async function addExpert(data: ExpertInput) {
  try {
    await db.insert(ExpertTable).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      status: 'pending',
    })

    revalidatePath('/admin/experts')
  } catch (error) {
    console.error('Error adding expert:', error)
    throw new Error('Failed to add expert')
  }
}

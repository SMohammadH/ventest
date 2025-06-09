'use server'

import { db } from '@/drizzle/db'
import { ProjectTable } from '@/drizzle/schema'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/auth/next/currentUser'

type ProjectInput = {
  name: string
  address: string
  customerId: string
  expertId: string
}

export async function createProject(data: ProjectInput) {
  try {
    const currentUser = await getCurrentUser({ withFullUser: true })
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    await db.insert(ProjectTable).values({
      name: data.name,
      address: data.address,
      customerId: data.customerId,
      expertId: data.expertId,
      createdBy: currentUser.id,
    })

    revalidatePath('/admin/projects')
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

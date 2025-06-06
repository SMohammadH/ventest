'use server'

import { db } from '@/drizzle/db'
import { BuildingTable } from '@/drizzle/schema'
import { revalidatePath } from 'next/cache'

type BuildingInput = {
  name: string
  constructionType: string
  numberOfFloors: number
  numberOfUnits: number
  projectId: string
}

export async function addBuilding(data: BuildingInput) {
  try {
    await db.insert(BuildingTable).values({
      name: data.name,
      constructionType: data.constructionType,
      numberOfFloors: data.numberOfFloors,
      numberOfUnits: data.numberOfUnits,
      projectId: data.projectId,
    })

    revalidatePath(`/admin/projects/${data.projectId}/buildings`)
  } catch (error) {
    console.error('Error adding building:', error)
    throw new Error('Failed to add building')
  }
}

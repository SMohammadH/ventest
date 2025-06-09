'use server'

import { db } from '@/drizzle/db'
import { EeeTable } from '@/drizzle/schema'

interface AddEeeInput {
  name: string
  type: string
  floor: number
  unit: string
  buildingId: string
}

export async function addEee(input: AddEeeInput) {
  try {
    await db.insert(EeeTable).values({
      name: input.name,
      type: input.type,
      floor: input.floor,
      unit: input.unit,
      buildingId: input.buildingId,
    })
  } catch (error) {
    console.error('Failed to add EEE:', error)
    throw new Error('Failed to add EEE')
  }
}

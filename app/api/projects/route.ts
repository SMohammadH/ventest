import { NextResponse } from 'next/server'
import { db } from '@/drizzle/db'
import { ProjectTable } from '@/drizzle/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, address, customerId, expertId } = body

    const project = await db
      .insert(ProjectTable)
      .values({
        name,
        address,
        customerId,
        expertId,
      })
      .returning()

    return NextResponse.json(project[0], { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

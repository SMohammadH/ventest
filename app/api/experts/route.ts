import { NextResponse } from 'next/server'
import { db } from '@/drizzle/db'
import { ExpertTable } from '@/drizzle/schema'

export async function GET() {
  try {
    const experts = await db.select().from(ExpertTable)

    return NextResponse.json(
      {
        message: 'Experts retrieved successfully',
        data: experts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching experts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

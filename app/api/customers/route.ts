import { NextResponse } from 'next/server'
import { db } from '@/drizzle/db'
import { CustomerTable } from '@/drizzle/schema'

export async function GET() {
  try {
    const customers = await db.select().from(CustomerTable)

    return NextResponse.json(
      {
        message: 'Customers retrieved successfully',
        data: customers,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { db } from '@/drizzle/db'
import { BuildingTable } from '@/drizzle/schema'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { EeeForm } from './eee-form'

async function getBuilding(id: string) {
  const building = await db
    .select()
    .from(BuildingTable)
    .where(eq(BuildingTable.id, id))
    .limit(1)

  return building[0]
}

export default async function AddEeePage({
  params,
}: {
  params: Promise<{ id: string; buildingId: string }>
}) {
  const { id, buildingId } = await params

  const building = await getBuilding(buildingId)
  if (!building) notFound()

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Add EEE - {building.name}</h1>
        <Button
          variant='outline'
          asChild
        >
          <Link href={`/admin/projects/${id}/buildings/${buildingId}/eees`}>
            Back to EEEs
          </Link>
        </Button>
      </div>
      <EeeForm
        projectId={id}
        buildingId={buildingId}
        numberOfFloors={building.numberOfFloors}
      />
    </div>
  )
}

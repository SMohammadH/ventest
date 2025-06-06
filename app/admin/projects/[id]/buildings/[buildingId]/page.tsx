import { db } from '@/drizzle/db'
import { BuildingTable } from '@/drizzle/schema'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

async function getBuilding(id: string) {
  const building = await db
    .select()
    .from(BuildingTable)
    .where(eq(BuildingTable.id, id))
    .limit(1)

  return building[0]
}

export default async function BuildingPage({
  params,
}: {
  params: { id: string; buildingId: string }
}) {
  const building = await getBuilding(params.buildingId)
  if (!building) notFound()

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>{building.name}</h1>
        <div className='flex gap-4'>
          <Button
            variant='outline'
            asChild
          >
            <Link href={`/admin/projects/${params.id}/buildings`}>
              Back to Buildings
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`/admin/projects/${params.id}/buildings/${params.buildingId}/eees`}
            >
              View EEEs
            </Link>
          </Button>
        </div>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <h2 className='text-xl font-semibold'>Building Details</h2>
          <div className='grid gap-1'>
            <p>
              <span className='font-medium'>Construction Type:</span>{' '}
              {building.constructionType}
            </p>
            <p>
              <span className='font-medium'>Number of Floors:</span>{' '}
              {building.numberOfFloors}
            </p>
            <p>
              <span className='font-medium'>Number of Units:</span>{' '}
              {building.numberOfUnits}
            </p>
            <p>
              <span className='font-medium'>Created At:</span>{' '}
              {new Date(building.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

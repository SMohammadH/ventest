import { db } from '@/drizzle/db'
import { EeeTable, BuildingTable } from '@/drizzle/schema'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { EeeRow } from './eee-row'

async function getBuilding(id: string) {
  const building = await db
    .select()
    .from(BuildingTable)
    .where(eq(BuildingTable.id, id))
    .limit(1)

  return building[0]
}

async function getEees(buildingId: string) {
  const eees = await db
    .select()
    .from(EeeTable)
    .where(eq(EeeTable.buildingId, buildingId))

  return eees
}

export default async function EeesPage({
  params,
}: {
  params: { id: string; buildingId: string }
}) {
  const building = await getBuilding(params.buildingId)
  if (!building) notFound()

  const eees = await getEees(params.buildingId)

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>
          Exterior Elevated Elements - {building.name}
        </h1>
        <Button asChild>
          <Link
            href={`/admin/projects/${params.id}/buildings/${params.buildingId}/eees/add`}
          >
            Add EEE
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eees.map((eee) => (
            <EeeRow
              key={eee.id}
              eee={eee}
              projectId={params.id}
              buildingId={params.buildingId}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

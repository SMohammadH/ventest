import { db } from '@/drizzle/db'
import { BuildingTable } from '@/drizzle/schema'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { BuildingRow } from './building-row'
import { eq } from 'drizzle-orm'

async function getBuildings(projectId: string) {
  const buildings = await db
    .select()
    .from(BuildingTable)
    .where(eq(BuildingTable.projectId, projectId))

  return buildings
}

export default async function BuildingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const buildings = await getBuildings(id)

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Buildings</h1>
        <Button asChild>
          <Link href={`/admin/projects/${id}/buildings/add`}>Add Building</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Construction Type</TableHead>
            <TableHead>Number of Floors</TableHead>
            <TableHead>Number of Units</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => (
            <BuildingRow
              key={building.id}
              building={building}
              projectId={id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

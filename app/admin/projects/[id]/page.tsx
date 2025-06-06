import { db } from '@/drizzle/db'
import {
  ProjectTable,
  CustomerTable,
  ExpertTable,
  BuildingTable,
} from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Plus, List } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

async function getProject(id: string) {
  const project = await db
    .select({
      id: ProjectTable.id,
      name: ProjectTable.name,
      address: ProjectTable.address,
      customer: {
        firstName: CustomerTable.firstName,
        lastName: CustomerTable.lastName,
      },
      expert: {
        firstName: ExpertTable.firstName,
        lastName: ExpertTable.lastName,
      },
      buildings: {
        id: BuildingTable.id,
        name: BuildingTable.name,
      },
      createdAt: ProjectTable.createdAt,
    })
    .from(ProjectTable)
    .leftJoin(CustomerTable, eq(CustomerTable.id, ProjectTable.customerId))
    .leftJoin(ExpertTable, eq(ExpertTable.id, ProjectTable.expertId))
    .leftJoin(BuildingTable, eq(BuildingTable.projectId, ProjectTable.id))
    .where(eq(ProjectTable.id, id))

  if (!project.length) {
    notFound()
  }

  // Group buildings
  const buildings = project
    .filter((p) => p.buildings && p.buildings.id)
    .map((p) => ({
      id: p.buildings!.id,
      name: p.buildings!.name,
    }))

  return {
    ...project[0],
    buildings,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProject(id)

  return (
    <div className='container mx-auto space-y-8 py-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>{project.name}</h1>
          <p className='text-muted-foreground mt-1'>{project.address}</p>
        </div>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            asChild
          >
            <Link href='/admin/projects'>Back to Projects</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Customer
              </h3>
              <p>
                {project.customer
                  ? `${project.customer.firstName} ${project.customer.lastName}`
                  : 'Not assigned'}
              </p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Expert
              </h3>
              <p>
                {project.expert
                  ? `${project.expert.firstName} ${project.expert.lastName}`
                  : 'Not assigned'}
              </p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Created At
              </h3>
              <p>{format(project.createdAt, 'PPP')}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Status
              </h3>
              <Badge
                variant={project.buildings.length > 0 ? 'default' : 'outline'}
              >
                {project.buildings.length > 0 ? 'Active' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <CardTitle>Buildings</CardTitle>
              <div className='flex items-center gap-2'>
                <Button asChild>
                  <Link
                    href={`/admin/projects/${project.id}/buildings`}
                    className='flex items-center gap-2'
                  >
                    <List className='h-4 w-4' />
                    View All Buildings
                  </Link>
                </Button>
                <Button
                  size='sm'
                  asChild
                >
                  <Link
                    href={`/admin/projects/${project.id}/buildings/add`}
                    className='flex items-center gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    Add Building
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {project.buildings.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {project.buildings.map((building) => (
                <div
                  key={building.id}
                  className='flex flex-col rounded-lg border p-4'
                >
                  <div className='flex items-center gap-3 mb-2'>
                    <Building2 className='h-5 w-5 text-muted-foreground' />
                    <h3 className='font-medium'>{building.name}</h3>
                  </div>
                  <div className='flex items-center gap-2 mt-auto'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      asChild
                    >
                      <Link
                        href={`/admin/projects/${project.id}/buildings/${building.id}`}
                      >
                        View Details
                      </Link>
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      asChild
                    >
                      <Link
                        href={`/admin/projects/${project.id}/buildings/${building.id}/edit`}
                      >
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Building2 className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='font-medium'>No buildings added yet</h3>
              <p className='text-sm text-muted-foreground mt-1'>
                Add your first building to get started
              </p>
              <Button
                className='mt-4'
                asChild
              >
                <Link
                  href={`/admin/projects/${project.id}/buildings/add`}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Building
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

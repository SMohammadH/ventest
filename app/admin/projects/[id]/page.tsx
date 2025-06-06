import { db } from '@/drizzle/db'
import { ProjectTable, CustomerTable, ExpertTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2 } from 'lucide-react'
import Link from 'next/link'

async function getProject(id: string) {
  const project = await db
    .select({
      id: ProjectTable.id,
      name: ProjectTable.name,
      address: ProjectTable.address,
      createdAt: ProjectTable.createdAt,
      updatedAt: ProjectTable.updatedAt,
      customer: {
        id: CustomerTable.id,
        firstName: CustomerTable.firstName,
        lastName: CustomerTable.lastName,
        email: CustomerTable.email,
        phoneNumber: CustomerTable.phoneNumber,
      },
      expert: {
        id: ExpertTable.id,
        firstName: ExpertTable.firstName,
        lastName: ExpertTable.lastName,
        email: ExpertTable.email,
        phoneNumber: ExpertTable.phoneNumber,
      },
    })
    .from(ProjectTable)
    .leftJoin(CustomerTable, eq(CustomerTable.id, ProjectTable.customerId))
    .leftJoin(ExpertTable, eq(ExpertTable.id, ProjectTable.expertId))
    .where(eq(ProjectTable.id, id))
    .limit(1)

  return project[0]
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='outline'
          size='icon'
          asChild
        >
          <Link href='/admin/projects'>
            <ArrowLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-2xl font-bold'>{project.name}</h1>
        <Button asChild>
          <Link
            href={`/admin/projects/${params.id}/buildings`}
            className='flex items-center gap-2'
          >
            <Building2 className='h-4 w-4' />
            Buildings
          </Link>
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className='grid grid-cols-2 gap-4'>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>
                  Name
                </dt>
                <dd className='text-lg'>{project.name}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>
                  Address
                </dt>
                <dd className='text-lg'>{project.address}</dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>
                  Created At
                </dt>
                <dd className='text-lg'>
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-muted-foreground'>
                  Last Updated
                </dt>
                <dd className='text-lg'>
                  {new Date(project.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {project.customer && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className='grid grid-cols-2 gap-4'>
                <div>
                  <dt className='text-sm font-medium text-muted-foreground'>
                    Name
                  </dt>
                  <dd className='text-lg'>
                    {project.customer.firstName} {project.customer.lastName}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-muted-foreground'>
                    Email
                  </dt>
                  <dd className='text-lg'>{project.customer.email}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-muted-foreground'>
                    Phone
                  </dt>
                  <dd className='text-lg'>
                    {project.customer.phoneNumber || '-'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}

        {project.expert && (
          <Card>
            <CardHeader>
              <CardTitle>Expert Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className='grid grid-cols-2 gap-4'>
                <div>
                  <dt className='text-sm font-medium text-muted-foreground'>
                    Name
                  </dt>
                  <dd className='text-lg'>
                    {project.expert.firstName} {project.expert.lastName}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-muted-foreground'>
                    Email
                  </dt>
                  <dd className='text-lg'>{project.expert.email}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-muted-foreground'>
                    Phone
                  </dt>
                  <dd className='text-lg'>
                    {project.expert.phoneNumber || '-'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

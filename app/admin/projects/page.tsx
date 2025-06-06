import { db } from '@/drizzle/db'
import { ProjectTable, CustomerTable, ExpertTable } from '@/drizzle/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getProjects() {
  const projects = await db
    .select({
      id: ProjectTable.id,
      name: ProjectTable.name,
      address: ProjectTable.address,
      createdAt: ProjectTable.createdAt,
      customer: {
        firstName: CustomerTable.firstName,
        lastName: CustomerTable.lastName,
      },
      expert: {
        firstName: ExpertTable.firstName,
        lastName: ExpertTable.lastName,
      },
    })
    .from(ProjectTable)
    .leftJoin(CustomerTable, eq(CustomerTable.id, ProjectTable.customerId))
    .leftJoin(ExpertTable, eq(ExpertTable.id, ProjectTable.expertId))

  return projects
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Projects</h1>
        <Button asChild>
          <Link
            href='/admin/projects/add'
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add New Project
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className='cursor-pointer hover:bg-muted/50'
            >
              <Link
                href={`/admin/projects/${project.id}`}
                className='contents'
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.address}</TableCell>
                <TableCell>
                  {project.customer?.firstName} {project.customer?.lastName}
                </TableCell>
                <TableCell>
                  {project.expert?.firstName} {project.expert?.lastName}
                </TableCell>
                <TableCell>
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
              </Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

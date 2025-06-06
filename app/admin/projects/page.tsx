import { db } from '@/drizzle/db'
import {
  ProjectTable,
  CustomerTable,
  ExpertTable,
  BuildingTable,
} from '@/drizzle/schema'
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
import { ProjectTableRow } from './project-table-row'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProjectWithRelations = {
  id: string
  name: string
  address: string
  customer: {
    firstName: string
    lastName: string
  } | null
  expert: {
    firstName: string
    lastName: string
  } | null
  buildings: {
    id: string
    name: string
  }[]
  createdAt: Date
}

async function getProjects() {
  const projects = await db
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

  // Group buildings by project
  const projectsWithBuildings = projects.reduce<ProjectWithRelations[]>(
    (acc, project) => {
      const existingProject = acc.find((p) => p.id === project.id)
      if (existingProject) {
        if (project.buildings?.id) {
          existingProject.buildings.push({
            id: project.buildings.id,
            name: project.buildings.name,
          })
        }
        return acc
      }
      return [
        ...acc,
        {
          ...project,
          buildings: project.buildings?.id
            ? [
                {
                  id: project.buildings.id,
                  name: project.buildings.name,
                },
              ]
            : [],
        },
      ]
    },
    []
  )

  return projectsWithBuildings
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className='container mx-auto space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button asChild>
          <Link href='/admin/projects/add'>Add Project</Link>
        </Button>
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search projects...'
            className='pl-8'
          />
        </div>
        <Select defaultValue='all'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Projects</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Expert</TableHead>
              <TableHead>Buildings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <ProjectTableRow
                key={project.id}
                project={project}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Showing {projects.length} projects
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

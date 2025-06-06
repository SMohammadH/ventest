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
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button asChild>
          <Link href='/admin/projects/add'>Add Project</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Buildings</TableHead>
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
  )
}

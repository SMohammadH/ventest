import { NextResponse } from 'next/server'
import { db } from '@/drizzle/db'
import {
  ProjectTable,
  CustomerTable,
  ExpertTable,
  BuildingTable,
} from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/auth/next/currentUser'

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

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, customerId, expertId } = body

    const project = await db
      .insert(ProjectTable)
      .values({
        name,
        address,
        customerId,
        expertId,
        createdBy: currentUser.id,
      })
      .returning()

    return NextResponse.json(project[0], { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      console.error('No current user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching projects for user:', currentUser.id)

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
      .where(eq(ProjectTable.createdBy, currentUser.id))

    console.log('Found projects:', projects.length)

    // Group buildings for each project
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

    return NextResponse.json({ data: projectsWithBuildings })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
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
import { headers } from 'next/headers'

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
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const url = `${protocol}://${host}/api/projects`

    console.log('Fetching projects from:', url)

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Cookie: headersList.get('cookie') || '',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(
        `Failed to fetch projects: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data.data as ProjectWithRelations[]
  } catch (error) {
    console.error('Error in getProjects:', error)
    throw error
  }
}

export default async function ProjectsPage() {
  try {
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
              {projects.length === 0 ? (
                <TableRow>
                  <td
                    colSpan={7}
                    className='text-center py-4'
                  >
                    No projects found
                  </td>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <ProjectTableRow
                    key={project.id}
                    project={project}
                  />
                ))
              )}
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
  } catch (error) {
    console.error('Error in ProjectsPage:', error)
    return (
      <div className='container mx-auto py-10'>
        <div className='text-red-500'>
          Error loading projects:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    )
  }
}

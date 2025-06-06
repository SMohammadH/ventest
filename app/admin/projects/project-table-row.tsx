'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

type ProjectStatus = 'active' | 'completed' | 'pending'

interface ProjectTableRowProps {
  project: {
    id: string
    name: string
    address: string
    customer?: {
      firstName: string
      lastName: string
    } | null
    expert?: {
      firstName: string
      lastName: string
    } | null
    buildings: {
      id: string
      name: string
    }[]
    createdAt: Date
  }
}

export function ProjectTableRow({ project }: ProjectTableRowProps) {
  const router = useRouter()

  // Mock status for now - in a real app this would come from the database
  const status: ProjectStatus =
    project.buildings.length > 0 ? 'active' : 'pending'

  const getBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'pending':
        return 'outline'
    }
  }

  return (
    <TableRow
      className='cursor-pointer hover:bg-muted/50'
      onClick={() => router.push(`/admin/projects/${project.id}`)}
    >
      <TableCell className='font-medium'>{project.name}</TableCell>
      <TableCell>{project.address}</TableCell>
      <TableCell>
        {project.customer
          ? `${project.customer.firstName} ${project.customer.lastName}`
          : '-'}
      </TableCell>
      <TableCell>
        {project.expert
          ? `${project.expert.firstName} ${project.expert.lastName}`
          : '-'}
      </TableCell>
      <TableCell>
        {project.buildings.length > 0
          ? `${project.buildings.length} building${
              project.buildings.length === 1 ? '' : 's'
            }`
          : 'No buildings'}
      </TableCell>
      <TableCell>
        <Badge variant={getBadgeVariant(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>{format(project.createdAt, 'MMM d, yyyy')}</TableCell>
    </TableRow>
  )
}

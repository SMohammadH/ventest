'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

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

  return (
    <TableRow
      className='cursor-pointer hover:bg-muted/50'
      onClick={() => router.push(`/admin/projects/${project.id}`)}
    >
      <TableCell>{project.name}</TableCell>
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
      <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
    </TableRow>
  )
}

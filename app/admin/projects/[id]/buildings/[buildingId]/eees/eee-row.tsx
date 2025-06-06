'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface EeeRowProps {
  eee: {
    id: string
    name: string
    type: string
    floor: number
    unit: string
    createdAt: Date
  }
  projectId: string
  buildingId: string
}

export function EeeRow({ eee, projectId, buildingId }: EeeRowProps) {
  const router = useRouter()

  return (
    <TableRow
      className='cursor-pointer hover:bg-muted/50'
      onClick={() =>
        router.push(
          `/admin/projects/${projectId}/buildings/${buildingId}/eees/${eee.id}`
        )
      }
    >
      <TableCell>{eee.name}</TableCell>
      <TableCell>{eee.type}</TableCell>
      <TableCell>{eee.floor}</TableCell>
      <TableCell>{eee.unit}</TableCell>
      <TableCell>{new Date(eee.createdAt).toLocaleDateString()}</TableCell>
    </TableRow>
  )
}

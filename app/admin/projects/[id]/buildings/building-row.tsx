'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface BuildingRowProps {
  building: {
    id: string
    name: string
    constructionType: string
    numberOfFloors: number
    numberOfUnits: number
    createdAt: Date
  }
  projectId: string
}

export function BuildingRow({ building, projectId }: BuildingRowProps) {
  const router = useRouter()

  return (
    <TableRow
      className='cursor-pointer hover:bg-muted/50'
      onClick={() =>
        router.push(`/admin/projects/${projectId}/buildings/${building.id}`)
      }
    >
      <TableCell>{building.name}</TableCell>
      <TableCell>{building.constructionType}</TableCell>
      <TableCell>{building.numberOfFloors}</TableCell>
      <TableCell>{building.numberOfUnits}</TableCell>
      <TableCell>{new Date(building.createdAt).toLocaleDateString()}</TableCell>
    </TableRow>
  )
}

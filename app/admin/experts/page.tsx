import { db } from '@/drizzle/db'
import { ExpertTable } from '@/drizzle/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getExperts() {
  const experts = await db.select().from(ExpertTable)
  return experts
}

export default async function ExpertsPage() {
  const experts = await getExperts()

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Experts</h1>
        <Button asChild>
          <Link
            href='/admin/experts/add'
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add New Expert
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experts.map((expert) => (
            <TableRow key={expert.id}>
              <TableCell>{expert.firstName}</TableCell>
              <TableCell>{expert.lastName}</TableCell>
              <TableCell>{expert.email}</TableCell>
              <TableCell>{expert.phoneNumber || '-'}</TableCell>
              <TableCell>
                {new Date(expert.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

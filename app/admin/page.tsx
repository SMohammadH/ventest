import { db } from '@/drizzle/db'
import { ProjectTable, CustomerTable, ExpertTable } from '@/drizzle/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, UserCog } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [projectsCount, customersCount, expertsCount] = await Promise.all([
    db
      .select({ count: ProjectTable.id })
      .from(ProjectTable)
      .then((res) => res.length),
    db
      .select({ count: CustomerTable.id })
      .from(CustomerTable)
      .then((res) => res.length),
    db
      .select({ count: ExpertTable.id })
      .from(ExpertTable)
      .then((res) => res.length),
  ])

  return {
    projectsCount,
    customersCount,
    expertsCount,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Projects',
      value: stats.projectsCount,
      icon: Building2,
      href: '/admin/projects',
      color: 'bg-blue-500',
    },
    {
      title: 'Customers',
      value: stats.customersCount,
      icon: Users,
      href: '/admin/customers',
      color: 'bg-green-500',
    },
    {
      title: 'Experts',
      value: stats.expertsCount,
      icon: UserCog,
      href: '/admin/experts',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
          >
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {card.title}
                </CardTitle>
                <card.icon
                  className={`h-4 w-4 ${card.color} text-white p-1 rounded`}
                />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{card.value}</div>
                <p className='text-xs text-muted-foreground'>
                  Click to view all {card.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Link href='/admin/add-project'>
            <Card className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <Building2 className='h-6 w-6 text-blue-500' />
                  <div>
                    <h3 className='font-medium'>Add New Project</h3>
                    <p className='text-sm text-muted-foreground'>
                      Create a new project with customer and expert assignments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

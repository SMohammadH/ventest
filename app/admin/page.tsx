import { db } from '@/drizzle/db'
import {
  BuildingTable,
  CustomerTable,
  ExpertTable,
  ProjectTable,
} from '@/drizzle/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Building2,
  Users,
  Briefcase,
  ClipboardList,
  Activity,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
} from 'lucide-react'
import { sql, desc } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

async function getStats() {
  const [
    totalProjects,
    totalCustomers,
    totalExperts,
    totalBuildings,
    recentProjects,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(ProjectTable),
    db.select({ count: sql<number>`count(*)` }).from(CustomerTable),
    db.select({ count: sql<number>`count(*)` }).from(ExpertTable),
    db.select({ count: sql<number>`count(*)` }).from(BuildingTable),
    db
      .select({
        id: ProjectTable.id,
        name: ProjectTable.name,
        createdAt: ProjectTable.createdAt,
        customerName: sql<string>`concat(${CustomerTable.firstName}, ' ', ${CustomerTable.lastName})`,
      })
      .from(ProjectTable)
      .leftJoin(CustomerTable, eq(ProjectTable.customerId, CustomerTable.id))
      .orderBy(desc(ProjectTable.createdAt))
      .limit(5),
  ])

  return {
    totalProjects: totalProjects[0].count,
    totalCustomers: totalCustomers[0].count,
    totalExperts: totalExperts[0].count,
    totalBuildings: totalBuildings[0].count,
    recentProjects,
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Welcome to your admin dashboard
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search...'
              className='pl-8'
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
              >
                <Bell className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New project created</DropdownMenuItem>
              <DropdownMenuItem>New customer registered</DropdownMenuItem>
              <DropdownMenuItem>Project status updated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
              >
                <Settings className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Projects
            </CardTitle>
            <Briefcase className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalProjects}</div>
            <Progress
              value={75}
              className='mt-2'
            />
            <p className='text-xs text-muted-foreground mt-2'>
              Active construction projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Customers
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalCustomers}</div>
            <Progress
              value={60}
              className='mt-2'
            />
            <p className='text-xs text-muted-foreground mt-2'>
              Registered customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Experts</CardTitle>
            <ClipboardList className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalExperts}</div>
            <Progress
              value={45}
              className='mt-2'
            />
            <p className='text-xs text-muted-foreground mt-2'>
              Qualified experts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Buildings
            </CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalBuildings}</div>
            <Progress
              value={90}
              className='mt-2'
            />
            <p className='text-xs text-muted-foreground mt-2'>
              Buildings under management
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-7'>
        {/* Recent Activity */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='h-5 w-5' />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className='font-medium'>
                      {project.name}
                    </TableCell>
                    <TableCell>{project.customerName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>Active</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Button
                className='w-full justify-start'
                asChild
              >
                <Link href='/admin/projects/new'>
                  <Briefcase className='mr-2 h-4 w-4' />
                  New Project
                </Link>
              </Button>
              <Button
                className='w-full justify-start'
                variant='outline'
                asChild
              >
                <Link href='/admin/customers/new'>
                  <Users className='mr-2 h-4 w-4' />
                  Add Customer
                </Link>
              </Button>
              <Button
                className='w-full justify-start'
                variant='outline'
                asChild
              >
                <Link href='/admin/experts/new'>
                  <ClipboardList className='mr-2 h-4 w-4' />
                  Add Expert
                </Link>
              </Button>
              <Button
                className='w-full justify-start'
                variant='outline'
                asChild
              >
                <Link href='/admin/reports'>
                  <FileText className='mr-2 h-4 w-4' />
                  Generate Report
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-7 mt-8'>
        {/* Team Members */}
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src='https://github.com/shadcn.png' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>John Doe</p>
                  <p className='text-sm text-muted-foreground'>
                    Project Manager
                  </p>
                </div>
                <Badge className='ml-auto'>Active</Badge>
              </div>
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src='https://github.com/shadcn.png' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>Jane Smith</p>
                  <p className='text-sm text-muted-foreground'>Architect</p>
                </div>
                <Badge className='ml-auto'>Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                  <Calendar className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='font-medium'>Project Review Meeting</p>
                  <p className='text-sm text-muted-foreground'>
                    Tomorrow at 10:00 AM
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                  <Calendar className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='font-medium'>Client Presentation</p>
                  <p className='text-sm text-muted-foreground'>
                    Friday at 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

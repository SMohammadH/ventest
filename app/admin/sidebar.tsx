'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  FileText,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    label: 'Projects',
    icon: Briefcase,
    href: '/admin/projects',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/admin/customers',
  },
  {
    label: 'Experts',
    icon: ClipboardList,
    href: '/admin/experts',
  },
  {
    label: 'Reports',
    icon: FileText,
    href: '/admin/reports',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className='flex flex-col gap-2 p-4'>
      {routes.map((route) => {
        const isActive =
          route.href === '/admin'
            ? pathname === route.href
            : pathname.startsWith(route.href)

        return (
          <Button
            key={route.href}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
            )}
          >
            <Link href={route.href}>
              <route.icon className='mr-2 h-4 w-4' />
              {route.label}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}

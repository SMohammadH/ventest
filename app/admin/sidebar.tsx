'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  Users,
  ClipboardList,
  LayoutDashboard,
  Settings,
  FileText,
} from 'lucide-react'

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
    <div className='space-y-4 py-4 flex flex-col h-full bg-background text-primary'>
      <div className='px-3 py-2 flex-1'>
        <div className='space-y-1'>
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                pathname === route.href
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className='mr-2 h-4 w-4' />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

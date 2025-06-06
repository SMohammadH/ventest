import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

type BreadcrumbItem = {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className='flex items-center space-x-1 text-sm text-muted-foreground mb-6'>
      <Link
        href='/admin'
        className='flex items-center hover:text-foreground transition-colors'
      >
        <Home className='h-4 w-4' />
      </Link>
      {items.map((item, index) => (
        <div
          key={item.label}
          className='flex items-center'
        >
          <ChevronRight className='h-4 w-4 mx-1' />
          {item.href ? (
            <Link
              href={item.href}
              className='hover:text-foreground transition-colors'
            >
              {item.label}
            </Link>
          ) : (
            <span className='text-foreground'>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

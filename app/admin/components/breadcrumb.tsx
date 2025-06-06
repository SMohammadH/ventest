import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumb() {
  const pathname = usePathname()

  // Remove /admin from the path and split into segments
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean)

  // Build breadcrumb items
  const items = segments.map((segment, index) => {
    const href = `/admin/${segments.slice(0, index + 1).join('/')}`
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return {
      label,
      href: index === segments.length - 1 ? undefined : href,
    }
  })

  return (
    <nav className='flex items-center space-x-1 text-sm text-muted-foreground mb-6'>
      <Link
        href='/admin'
        className='flex items-center hover:text-foreground transition-colors'
      >
        <Home className='h-4 w-4' />
      </Link>
      {items.map((item) => (
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

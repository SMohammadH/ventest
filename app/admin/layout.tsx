'use client'

import { Breadcrumb } from './components/breadcrumb'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto py-10'>
        <Breadcrumb />
        {children}
      </div>
    </div>
  )
}

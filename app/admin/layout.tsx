'use client'

import { Breadcrumb } from './components/breadcrumb'
import { Sidebar } from './sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen'>
      <div className='hidden md:flex h-full w-72 flex-col fixed inset-y-0'>
        <div className='flex h-full flex-col border-r bg-background'>
          <div className='p-6'>
            <h1 className='text-3xl font-semibold'>Ventures</h1>
          </div>
          <Sidebar />
        </div>
      </div>
      <main className='flex-1 md:pl-72'>
        <div className='h-full p-8'>
          <div className='mb-8'>
            <Breadcrumb />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}

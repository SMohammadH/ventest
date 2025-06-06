'use client'

import { Breadcrumb } from './components/breadcrumb'
import { Sidebar } from './sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-full relative'>
      <div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background'>
        <div className='flex flex-col h-full'>
          <div className='pl-6 pt-8'>
            <h1 className='text-3xl font-bold'>Venture</h1>
          </div>
          <Sidebar />
        </div>
      </div>
      <main className='md:pl-72'>
        <div className='container mx-auto py-10'>
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  )
}

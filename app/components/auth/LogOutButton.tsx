'use client'

import { logOut } from '@/auth/next/actions'

export function LogOutButton() {
  return (
    <div
      className='cursor-pointer'
      onClick={async () => await logOut()}
    >
      Log Out
    </div>
  )
}

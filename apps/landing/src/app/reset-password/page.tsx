import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPassword from '../../views/ResetPassword'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your I Love DR Realty account.',
}

export default function Page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  )
}

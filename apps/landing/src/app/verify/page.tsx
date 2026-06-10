import type { Metadata } from 'next'
import { Suspense } from 'react'
import Verify from '../../views/Verify'

export const metadata: Metadata = {
  title: 'Verify your email',
  description: 'Enter the 6-digit code we sent to your email to activate your I Love DR Realty account.',
}

export default function Page() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  )
}

import type { Metadata } from 'next'
import ForgotPassword from '../../views/ForgotPassword'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your I Love DR Realty account password.',
}

export default function Page() {
  return <ForgotPassword />
}

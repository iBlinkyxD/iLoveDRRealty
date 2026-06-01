import type { Metadata } from 'next'
import Login from '../../views/Login'

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Sign in to your I Love DR Realty account to access your saved listings, inquiries, and dashboard.',
}

export default function Page() {
  return <Login />
}

import type { Metadata } from 'next'
import Signup from '../../views/Signup'

export const metadata: Metadata = {
  title: 'Create an Account',
  description: 'Join 12,000+ buyers, investors, owners, and realtors on I Love DR Realty. Free to join — verified listings and a bilingual team.',
}

export default function Page() {
  return <Signup />
}

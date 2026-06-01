import type { Metadata } from 'next'
import Landing from '../views/Landing'

export const metadata: Metadata = {
  title: 'Find Your Dream Property in the Dominican Republic',
  description: 'Browse verified DR real estate listings, use our ROI calculator, and connect with a bilingual team that lives where you\'re buying.',
  openGraph: {
    title: 'Find Your Dream Property in the Dominican Republic',
    description: 'Browse verified DR real estate listings, use our ROI calculator, and connect with a bilingual team that lives where you\'re buying.',
  },
}

export default function Page() {
  return <Landing />
}

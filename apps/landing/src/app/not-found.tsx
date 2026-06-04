import type { Metadata } from 'next'
import NotFound from '../views/NotFound'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This page could not be found. Return to I Love DR Realty to browse Dominican Republic real estate.',
}

export default function NotFoundPage() {
  return <NotFound />
}

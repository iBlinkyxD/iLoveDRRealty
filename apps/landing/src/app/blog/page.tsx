import type { Metadata } from 'next'
import Blog from '../../views/Blog'

export const metadata: Metadata = {
  title: 'DR Real Estate Resources & Guides',
  description: 'In-depth guides, market insights, and step-by-step articles for buying, investing, and living in the Dominican Republic.',
  openGraph: {
    title: 'DR Real Estate Resources & Guides',
    description: 'In-depth guides, market insights, and step-by-step articles for buying, investing, and living in the Dominican Republic.',
  },
}

export default function Page() {
  return <Blog />
}

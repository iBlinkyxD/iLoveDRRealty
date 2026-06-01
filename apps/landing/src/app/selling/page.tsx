import type { Metadata } from 'next'
import Selling from '../../views/Selling'

export const metadata: Metadata = {
  title: 'Sell Your Dominican Republic Property',
  description: 'List your DR property with a team that knows the market, handles the paperwork, and connects you with qualified buyers worldwide.',
  openGraph: {
    title: 'Sell Your Dominican Republic Property',
    description: 'List your DR property with a team that knows the market, handles the paperwork, and connects you with qualified buyers worldwide.',
  },
}

export default function Page() {
  return <Selling />
}

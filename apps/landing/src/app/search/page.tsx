import type { Metadata } from 'next'
import Search from '../../views/Search'

export const metadata: Metadata = {
  title: 'Search DR Real Estate Listings',
  description: 'Browse verified properties for sale and rent across Punta Cana, Santo Domingo, Cabarete, and more. Filter by region, type, price, and purpose.',
  openGraph: {
    title: 'Search DR Real Estate Listings',
    description: 'Browse verified properties for sale and rent across Punta Cana, Santo Domingo, Cabarete, and more.',
  },
}

export default function Page() {
  return <Search />
}

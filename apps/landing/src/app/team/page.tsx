import type { Metadata } from 'next'
import Team from '../../views/Team'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the bilingual agents and advisors behind I Love DR Realty — locals and expats who have lived the DR buying process firsthand.',
  openGraph: {
    title: 'Our Team | I Love DR Realty',
    description: 'Meet the bilingual agents and advisors behind I Love DR Realty — locals and expats who have lived the DR buying process firsthand.',
  },
}

export default function Page() {
  return <Team />
}

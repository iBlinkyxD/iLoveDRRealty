import type { Metadata } from 'next'
import Buying from '../../views/Buying'

export const metadata: Metadata = {
  title: 'Buying Property in the Dominican Republic',
  description: 'Everything you need to know about buying real estate in the DR — the process, legal steps, and why local expertise is the whole difference.',
  openGraph: {
    title: 'Buying Property in the Dominican Republic',
    description: 'Everything you need to know about buying real estate in the DR — the process, legal steps, and why local expertise is the whole difference.',
  },
}

export default function Page() {
  return <Buying />
}

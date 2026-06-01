import type { Metadata } from 'next'
import Calculator from '../../views/Calculator'

export const metadata: Metadata = {
  title: 'DR Real Estate ROI Calculator',
  description: 'Model your Dominican Republic investment returns across three scenarios — conservative, moderate, and optimistic — with live 5-year projections.',
  openGraph: {
    title: 'DR Real Estate ROI Calculator',
    description: 'Model your Dominican Republic investment returns across three scenarios with live 5-year projections.',
  },
}

export default function Page() {
  return <Calculator />
}

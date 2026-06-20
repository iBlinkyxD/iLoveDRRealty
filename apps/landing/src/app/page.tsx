import type { Metadata } from 'next'
import Landing from '../views/Landing'

export const metadata: Metadata = {
  title: 'Find Your Dream Property in the Dominican Republic',
  description: 'Browse verified DR real estate listings, use our ROI calculator, and connect with a bilingual team that lives where you\'re buying.',
  openGraph: {
    title: 'Find Your Dream Property in the Dominican Republic',
    description: 'Browse verified DR real estate listings, use our ROI calculator, and connect with a bilingual team that lives where you\'re buying.',
    images: [{ url: 'https://ilovedrrealty.com/iLoveDRRealty_Dark.png', width: 1200, height: 630, alt: 'I Love DR Realty' }],
  },
}

const agentSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'I Love DR Realty',
  url: 'https://ilovedrrealty.com',
  logo: 'https://ilovedrrealty.com/iLoveDRRealty_Icon.png',
  description: "The Dominican Republic's real estate marketplace — verified listings, ROI tools, and a bilingual team that's lived the process.",
  areaServed: { '@type': 'Country', name: 'Dominican Republic' },
  knowsLanguage: ['en', 'es'],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(agentSchema)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026'),
        }}
      />
      <Landing />
    </>
  )
}

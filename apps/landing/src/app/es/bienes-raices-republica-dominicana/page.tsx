import type { Metadata } from 'next'
import SpanishLandingPage from '../../../views/SpanishLandingPage'
import EsLangSync from '../../../components/EsLangSync'

export const metadata: Metadata = {
  title: 'Bienes Raíces en República Dominicana | I Love DR Realty',
  description: 'Compra, vende o invierte en bienes raíces en República Dominicana con orientación clara desde Cabarete–Puerto Plata. Habla con I Love DR Realty.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/es/bienes-raices-republica-dominicana/',
    languages: {
      'es-DO': '/es/bienes-raices-republica-dominicana/',
      en: '/buying/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Bienes Raíces en República Dominicana | I Love DR Realty',
    description: 'Compra, vende o invierte en bienes raíces en República Dominicana con orientación clara desde Cabarete–Puerto Plata.',
    type: 'website',
    locale: 'es_DO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bienes Raíces en República Dominicana | I Love DR Realty',
    description: 'Compra, vende o invierte en bienes raíces en República Dominicana con orientación clara desde Cabarete–Puerto Plata.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'I Love DR Realty',
  image: 'https://ilovedrrealty.com/iLoveDRRealty_Dark.png',
  telephone: '+18096108094',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hotel Kaoba',
    addressLocality: 'Cabarete',
    addressRegion: 'Puerto Plata',
    addressCountry: 'DO',
  },
  areaServed: 'Dominican Republic',
  url: 'https://ilovedrrealty.com/es/bienes-raices-republica-dominicana/',
  inLanguage: 'es-DO',
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EsLangSync />
      <SpanishLandingPage />
    </>
  )
}

import type { Metadata } from 'next'
import Contact from '../../views/Contact'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach the I Love DR Realty team via WhatsApp, email, or phone. We respond within 24 hours and speak English and Spanish.',
  openGraph: {
    title: 'Contact I Love DR Realty',
    description: 'Reach the I Love DR Realty team via WhatsApp, email, or phone. We respond within 24 hours and speak English and Spanish.',
  },
}

export default function Page() {
  return <Contact />
}

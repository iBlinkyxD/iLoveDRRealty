import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'
import GoogleAuthProvider from '../components/GoogleAuthProvider'

export const metadata: Metadata = {
  title: {
    default: 'I Love DR Realty — Dominican Republic Real Estate',
    template: '%s | I Love DR Realty',
  },
  description: "The Dominican Republic's real estate marketplace — verified listings, ROI tools, and a bilingual team that's lived the process.",
  metadataBase: new URL('https://ilovedrrealty.com'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    siteName: 'I Love DR Realty',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ilovedrrealty',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleAuthProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: { fontFamily: 'inherit', fontSize: '14px', borderRadius: '12px' },
            }}
          />
        </GoogleAuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import PropertyDetail from '../../../views/PropertyDetail'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

interface RawListing {
  id: string
  title: string
  description: string | null
  type: string
  transaction: string
  price: number
  location: string
  images: string[]
}

async function getListing(id: string): Promise<RawListing | null> {
  try {
    const res = await fetch(`${API_URL}/listings/${id}`)
    if (!res.ok) return null
    return res.json() as Promise<RawListing>
  } catch {
    return null
  }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const res = await fetch(`${API_URL}/listings`)
    if (!res.ok) return []
    const data = (await res.json()) as { id: string }[]
    return data.map(l => ({ id: l.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) return { title: 'Property Listing | I Love DR Realty' }

  const priceStr =
    listing.transaction === 'rent'
      ? `$${Number(listing.price).toLocaleString()}/mo`
      : `$${Number(listing.price).toLocaleString()}`

  const rawDesc = listing.description ?? ''
  const plainDesc = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const description = plainDesc
    ? `${plainDesc.slice(0, 150)}${plainDesc.length > 150 ? '…' : ''}`
    : `${listing.type} in ${listing.location} — ${priceStr}.`

  const image =
    listing.images?.[0] ?? 'https://ilovedrrealty.com/iLoveDRRealty_Dark.png'

  return {
    title: listing.title,
    description,
    alternates: {
      canonical: `https://ilovedrrealty.com/listing/${id}/`,
    },
    openGraph: {
      title: listing.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: listing.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description,
      images: [image],
    },
  }
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListing(id)

  const jsonLd = listing
    ? {
        '@context': 'https://schema.org',
        '@type': listing.transaction === 'rent' ? 'Accommodation' : 'Product',
        name: listing.title,
        description: (listing.description ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        image: listing.images ?? [],
        url: `https://ilovedrrealty.com/listing/${id}/`,
        offers: {
          '@type': 'Offer',
          price: listing.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: listing.location,
          addressCountry: 'DO',
        },
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
              .replace(/</g, '\\u003c')
              .replace(/>/g, '\\u003e')
              .replace(/&/g, '\\u0026'),
          }}
        />
      )}
      <PropertyDetail id={id} />
    </>
  )
}

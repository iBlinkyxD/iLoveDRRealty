import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = 'https://ilovedrrealty.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/search/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/buying/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/selling/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/calculator/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/team/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/blog/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  let listingPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/listings`)
    if (res.ok) {
      const data = (await res.json()) as { id: string; created_at: string | null }[]
      listingPages = data.map(l => ({
        url: `${BASE}/listing/${l.id}/`,
        lastModified: l.created_at ? new Date(l.created_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    // If API is unavailable at build time, only static pages are included
  }

  return [...staticPages, ...listingPages]
}

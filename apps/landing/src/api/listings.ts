import client from './axios'
import type { Listing } from '../data/listings'

interface ApiListing {
  id: string
  title: string
  type: string
  transaction: string
  price: number
  location: string
  bedrooms: number | null
  bathrooms: number | null
  area_sqft: number | null
  roi: number | null
  tag: string | null
  images: string[]
}

export interface ApiListingDetail {
  id: string
  title: string
  description: string | null
  type: string
  transaction: string
  price: number
  location: string
  bedrooms: number | null
  bathrooms: number | null
  area_sqft: number | null
  lot_size_sqft: number | null
  roi: number | null
  seller_financing: boolean
  hoa: boolean
  hoa_fee: number | null
  tax_exempt: boolean
  gated_community: boolean
  construction_status: string | null
  year_built: number | null
  features: string[]
  maps_url: string | null
  tag: string | null
  images: string[]
  status: string
  submitted_by_name: string | null
  submitted_by_email: string | null
}

const TAG_TONES: Record<string, [string, string]> = {
  Luxury:     ['Luxury',     'gold'],
  Investment: ['Investment', 'coral'],
  'For Rent': ['For Rent',   'green'],
  Commercial: ['Commercial', 'sea'],
  New:        ['New',        'sea'],
}

function toTags(tag: string | null): [string, string][] {
  if (!tag) return []
  return [TAG_TONES[tag] ?? [tag, 'sand']]
}

export async function fetchListingById(id: string): Promise<ApiListingDetail> {
  const res = await client.get<ApiListingDetail>(`/listings/${id}`)
  return res.data
}

export async function fetchListings(): Promise<Listing[]> {
  const res = await client.get<ApiListing[]>('/listings')
  return res.data.map(l => ({
    id: l.id,
    title: l.title,
    region: l.location,
    price: Number(l.price),
    bd: l.bedrooms ?? 0,
    ba: l.bathrooms ?? 0,
    m2: l.area_sqft ? Math.round(l.area_sqft / 10.764) : 0,
    roi: Number(l.roi ?? 0),
    tags: toTags(l.tag),
    type: l.type.charAt(0).toUpperCase() + l.type.slice(1),
    purpose: l.transaction === 'rent' ? 'rent' : 'sale',
    v: 0,
    img: l.images?.[0] ?? '',
  }))
}

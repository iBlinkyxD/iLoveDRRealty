import client from './axios'
import type { Listing } from '../data/listings'

export interface ApiDealListing {
  id: string
  title: string
  description: string | null
  location: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  area_sqft: number | null
  features: string[]
  images: string[]
  is_deal: boolean
  deal_discount_value: number | null
  deal_discount_type: string
  roi: number | null
}

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
  features: string[]
  images: string[]
  latitude: number | null
  longitude: number | null
  is_deal: boolean
  deal_discount_value: number | null
  deal_discount_type: string
  created_at: string | null
}

export interface ApiListingDetail {
  id: string
  title: string
  description: string | null
  description_es: string | null
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
  latitude: number | null
  longitude: number | null
  tag: string | null
  tags: string[]
  video_links: string[]
  tour_3d_url: string | null
  utilities: string | null
  included_utilities: string[]
  association_fee: number | null
  deposit_policy: string | null
  images: string[]
  status: string
  submitted_by_name: string | null
  submitted_by_email: string | null
  is_deal: boolean
  deal_discount_value: number | null
  deal_discount_type: string
  price_per_day: number | null
  price_per_month: number | null
  co_listing_agreement_url: string | null
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

export async function fetchDealListings(): Promise<ApiDealListing[]> {
  try {
    const res = await client.get<ApiDealListing[]>('/listings/deal')
    return res.data
  } catch {
    return []
  }
}

export async function fetchListingById(id: string): Promise<ApiListingDetail> {
  const res = await client.get<ApiListingDetail>(`/listings/${id}`)
  return res.data
}

export async function recordListingView(id: string): Promise<void> {
  await client.post(`/listings/${id}/view`)
}

function mapApiListing(l: ApiListing): Listing {
  return {
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
    features: l.features ?? [],
    v: 0,
    img: l.images?.[0] ?? '',
    latitude: l.latitude,
    longitude: l.longitude,
    is_deal: l.is_deal,
    deal_discount_value: l.deal_discount_value,
    deal_discount_type: l.deal_discount_type,
    created_at: l.created_at,
  }
}

export interface ListingsQuery {
  page?: number
  pageSize?: number
  purpose?: 'rent' | 'investment'
  type?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  minRoi?: number
  features?: string[]
  sort?: 'new' | 'low' | 'high' | 'roi'
  excludeIds?: string[]
  includeAggregates?: boolean
}

export interface ListingsPage {
  items: Listing[]
  total: number
  page: number
  pageSize: number
  medianPrice: number | null
  avgRoi: number | null
}

interface ApiListingPage {
  items: ApiListing[]
  total: number
  page: number
  page_size: number
  median_price: number | null
  avg_roi: number | null
}

export async function fetchListings(q: ListingsQuery = {}): Promise<ListingsPage> {
  const res = await client.get<ApiListingPage>('/listings', {
    params: {
      page: q.page,
      page_size: q.pageSize,
      purpose: q.purpose,
      type: q.type,
      region: q.region,
      min_price: q.minPrice,
      max_price: q.maxPrice,
      beds: q.beds,
      min_roi: q.minRoi,
      features: q.features,
      sort: q.sort,
      exclude_ids: q.excludeIds,
      include_aggregates: q.includeAggregates,
    },
  })
  return {
    items: res.data.items.map(mapApiListing),
    total: res.data.total,
    page: res.data.page,
    pageSize: res.data.page_size,
    medianPrice: res.data.median_price,
    avgRoi: res.data.avg_roi,
  }
}

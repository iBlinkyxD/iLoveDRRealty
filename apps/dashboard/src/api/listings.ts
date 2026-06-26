import client from './axios'

export interface Listing {
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
  rejection_reason: string | null
  is_deal: boolean
  deal_discount_value: number | null
  deal_discount_type: string
  view_count: number
  leads_count: number
  has_pending_deal_request: boolean
  has_pending_edit: boolean
  updated_at: string | null
  submitted_by: string
  submitted_by_name?: string | null
  owner_id: string | null
  co_listing_enabled: boolean
  co_listing_brokerage: string | null
  co_listing_agent_name: string | null
  co_listing_agent_contact: string | null
  co_listing_commission_split: number | null
  co_listing_notes: string | null
  co_listing_status: string | null
}

export interface ListingUpdate {
  title?: string
  description?: string
  type?: string
  transaction?: string
  price?: number
  location?: string
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  lot_size_sqft?: number
  roi?: number
  seller_financing?: boolean
  hoa?: boolean
  hoa_fee?: number
  tax_exempt?: boolean
  gated_community?: boolean
  construction_status?: string
  year_built?: number
  features?: string[]
  maps_url?: string
  latitude?: number
  longitude?: number
  tag?: string
  tags?: string[]
  video_links?: string[]
  tour_3d_url?: string
  utilities?: string
  included_utilities?: string[]
  association_fee?: number
  deposit_policy?: string
  images?: string[]
  co_listing_enabled?: boolean
  co_listing_brokerage?: string
  co_listing_agent_name?: string
  co_listing_agent_contact?: string
  co_listing_commission_split?: number
  co_listing_notes?: string
  co_listing_status?: string
}

export interface ListingCreate {
  title: string
  description?: string
  type: string
  transaction: string
  price: number
  location: string
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  lot_size_sqft?: number
  roi?: number
  seller_financing?: boolean
  hoa?: boolean
  hoa_fee?: number
  tax_exempt?: boolean
  gated_community?: boolean
  construction_status?: string
  year_built?: number
  features?: string[]
  maps_url?: string
  latitude?: number
  longitude?: number
  tag?: string
  tags?: string[]
  video_links?: string[]
  tour_3d_url?: string
  utilities?: string
  included_utilities?: string[]
  association_fee?: number
  deposit_policy?: string
  images?: string[]
  co_listing_enabled?: boolean
  co_listing_brokerage?: string
  co_listing_agent_name?: string
  co_listing_agent_contact?: string
  co_listing_commission_split?: number
  co_listing_notes?: string
  co_listing_status?: string
}

export async function uploadListingImages(files: File[]): Promise<string[]> {
  const fd = new FormData()
  files.forEach(f => fd.append('files', f))
  const res = await client.post<{ urls: string[] }>('/listings/upload-images', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.urls
}

export async function submitListing(data: ListingCreate): Promise<Listing> {
  const res = await client.post<Listing>('/listings', data)
  return res.data
}

export async function getMyListings(): Promise<Listing[]> {
  const res = await client.get<Listing[]>('/listings/mine')
  return res.data
}

export async function updateListing(id: string, data: ListingUpdate): Promise<Listing> {
  const res = await client.put<Listing>(`/listings/${id}`, data)
  return res.data
}

export async function submitDealRequest(
  listingId: string,
  data: { discount_value: number; discount_type: string; message?: string },
): Promise<void> {
  await client.post(`/listings/${listingId}/deal-request`, data)
}

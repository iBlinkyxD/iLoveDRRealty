import client from './axios'

export interface AdminUpgradeRequest {
  id: string
  user_id: string
  user_email: string
  user_display_name: string
  requested_role: 'owner' | 'realtor'
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: string
}

export async function getAdminUpgradeRequests(status?: string): Promise<AdminUpgradeRequest[]> {
  const res = await client.get<AdminUpgradeRequest[]>('/admin/upgrade-requests', {
    params: status ? { status } : undefined,
  })
  return res.data
}

export async function approveUpgradeRequest(id: string): Promise<void> {
  await client.post(`/admin/upgrade-requests/${id}/approve`)
}

export async function rejectUpgradeRequest(id: string, reason: string): Promise<void> {
  await client.post(`/admin/upgrade-requests/${id}/reject`, { reason })
}

export interface AdminListing {
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
  images: string[]
  status: string
  submitted_by: string
  submitted_by_name: string | null
  submitted_by_email: string | null
  owner_id: string | null
  reviewed_by_name: string | null
  reviewed_by_email: string | null
  reviewed_at: string | null
  view_count: number
  updated_at: string | null
}

export async function getAdminListings(status?: string): Promise<AdminListing[]> {
  const res = await client.get<AdminListing[]>('/admin/listings', {
    params: status ? { status } : undefined,
  })
  return res.data
}

export async function approveAdminListing(id: string): Promise<void> {
  await client.post(`/admin/listings/${id}/approve`)
}

export async function rejectAdminListing(id: string, reason: string): Promise<void> {
  await client.post(`/admin/listings/${id}/reject`, { reason })
}

export async function archiveAdminListing(id: string): Promise<void> {
  await client.post(`/admin/listings/${id}/archive`)
}

export interface AdminListingEdit {
  id: string
  listing_id: string
  listing_title: string
  listing_location: string
  listing_thumbnail: string | null
  submitted_by_name: string | null
  submitted_by_email: string | null
  submitted_at: string
  status: string
  current_data: Record<string, unknown>
  proposed_data: Record<string, unknown>
  rejection_reason: string | null
}

export async function getAdminListingEdits(): Promise<AdminListingEdit[]> {
  const res = await client.get<AdminListingEdit[]>('/admin/listing-edits')
  return res.data
}

export async function approveListingEdit(id: string): Promise<void> {
  await client.post(`/admin/listing-edits/${id}/approve`)
}

export async function rejectListingEdit(id: string, reason: string): Promise<void> {
  await client.post(`/admin/listing-edits/${id}/reject`, { reason })
}

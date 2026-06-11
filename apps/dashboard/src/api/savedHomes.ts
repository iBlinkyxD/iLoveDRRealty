import client from './axios'

export interface SavedHome {
  id: string
  listing_id: string
  listing_title: string
  listing_location: string
  listing_price: number
  listing_transaction: string
  listing_images: string[]
  listing_bedrooms: number | null
  listing_bathrooms: number | null
  saved_at: string
}

export async function getMySavedHomes(): Promise<SavedHome[]> {
  const res = await client.get<SavedHome[]>('/saved-homes/mine')
  return res.data
}

export async function saveHome(listingId: string): Promise<void> {
  await client.post(`/saved-homes/${listingId}`)
}

export async function unsaveHome(listingId: string): Promise<void> {
  await client.delete(`/saved-homes/${listingId}`)
}

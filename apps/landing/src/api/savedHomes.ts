import client from './axios'

export async function getMySavedIds(): Promise<string[]> {
  const res = await client.get<{ listing_id: string }[]>('/saved-homes/mine')
  return res.data.map(h => h.listing_id)
}

export async function saveHome(listingId: string): Promise<void> {
  await client.post(`/saved-homes/${listingId}`)
}

export async function unsaveHome(listingId: string): Promise<void> {
  await client.delete(`/saved-homes/${listingId}`)
}

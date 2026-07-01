import client from './axios'

export interface BookingCreate {
  listing_id: string
  check_in: string
  check_out: string
  guests?: number
  notes?: string
  name?: string
  email?: string
  phone?: string
}

export async function createBooking(data: BookingCreate): Promise<void> {
  await client.post('/bookings', data)
}

export interface BookedRange {
  check_in: string
  check_out: string
}

export async function getUnavailableDates(listingId: string): Promise<BookedRange[]> {
  const res = await client.get<BookedRange[]>(`/bookings/unavailable/${listingId}`)
  return res.data
}

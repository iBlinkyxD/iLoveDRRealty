import client from './axios'

export interface Booking {
  id: string
  listing_id: string
  listing_title: string | null
  listing_location: string | null
  listing_images: string[]
  check_in: string
  check_out: string
  guests: number
  total_price: number | null
  notes: string | null
  status: string
  created_at: string
}

export interface BookingCreate {
  listing_id: string
  check_in: string
  check_out: string
  guests?: number
  notes?: string
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await client.get<Booking[]>('/bookings/mine')
  return res.data
}

export async function createBooking(data: BookingCreate): Promise<Booking> {
  const res = await client.post<Booking>('/bookings', data)
  return res.data
}

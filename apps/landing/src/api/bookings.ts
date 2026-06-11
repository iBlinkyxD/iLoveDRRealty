import client from './axios'

export interface BookingCreate {
  listing_id: string
  check_in: string
  check_out: string
  guests?: number
  notes?: string
}

export async function createBooking(data: BookingCreate): Promise<void> {
  await client.post('/bookings', data)
}

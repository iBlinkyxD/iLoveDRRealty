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
  paypal_order_id?: string
}

export async function createBooking(data: BookingCreate): Promise<void> {
  await client.post('/bookings', data)
}

export interface PaymentAuthRequest {
  listing_id: string
  check_in: string
  check_out: string
}

export interface PaymentAuthResponse {
  paypal_order_id: string
  amount_usd: number
}

export async function createPaymentAuth(data: PaymentAuthRequest): Promise<PaymentAuthResponse> {
  const res = await client.post<PaymentAuthResponse>('/bookings/create-payment-auth', data)
  return res.data
}

export interface BookedRange {
  check_in: string
  check_out: string
}

export async function getUnavailableDates(listingId: string): Promise<BookedRange[]> {
  const res = await client.get<BookedRange[]>(`/bookings/unavailable/${listingId}`)
  return res.data
}

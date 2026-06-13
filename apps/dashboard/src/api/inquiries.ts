import client from './axios'

export interface Inquiry {
  id: string
  listing_id: string | null
  listing_title: string | null
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export interface InquiryCreate {
  listing_id?: string
  name: string
  email: string
  phone?: string
  message: string
}

export async function submitInquiry(data: InquiryCreate): Promise<Inquiry> {
  const res = await client.post<Inquiry>('/inquiries', data)
  return res.data
}

export async function getMyInquiries(): Promise<Inquiry[]> {
  const res = await client.get<Inquiry[]>('/inquiries/mine')
  return res.data
}

export async function getOwnerInquiries(): Promise<Inquiry[]> {
  const res = await client.get<Inquiry[]>('/inquiries/for-owner')
  return res.data
}

export async function getRealtorInquiries(): Promise<Inquiry[]> {
  const res = await client.get<Inquiry[]>('/inquiries/for-realtor')
  return res.data
}

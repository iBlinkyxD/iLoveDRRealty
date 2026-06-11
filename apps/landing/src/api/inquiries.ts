import client from './axios'

export interface InquiryCreate {
  listing_id?: string
  name: string
  email: string
  phone?: string
  message: string
}

export async function submitInquiry(data: InquiryCreate): Promise<void> {
  await client.post('/inquiries', data)
}

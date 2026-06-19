import client from './axios'

export interface LeadCreate {
  type?: string
  listing_id?: string
  name: string
  email: string
  phone?: string
  message?: string
}

export async function submitInquiry(data: LeadCreate): Promise<void> {
  await client.post('/leads', {
    type: 'property_inquiry',
    property_id: data.listing_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  })
}

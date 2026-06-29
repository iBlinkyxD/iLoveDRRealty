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

export async function submitContactLead(data: {
  name: string
  email: string
  phone?: string
  interest: string
  message?: string
}): Promise<void> {
  const type = data.interest === 'Listing my property' ? 'seller_interest' : 'buyer_interest'
  const parts = [`Interest: ${data.interest}`, data.message].filter(Boolean)
  await client.post('/leads', {
    type,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    message: parts.join('\n\n').slice(0, 2000),
  })
}

import { c } from '../design'

export type Role = 'Buyer' | 'Investor' | 'Owner' | 'Realtor'

export const ROLES: { key: Role; icon: string; desc: string; tone: string }[] = [
  { key: 'Buyer',    icon: '🔍', desc: 'Browse and save listings',    tone: c.coral },
  { key: 'Investor', icon: '📈', desc: 'ROI tools & deal analysis',    tone: c.sea   },
  { key: 'Owner',    icon: '🏡', desc: 'List and manage your property', tone: c.gold  },
  { key: 'Realtor',  icon: '🏘️', desc: 'List on behalf of clients',    tone: c.green },
]

export const BENEFITS: Record<Role, string[]> = {
  Buyer:    ['Browse all verified listings', 'Save favorites & alerts', 'Direct inquiry to sellers', 'Book short-term rentals'],
  Investor: ['Full ROI calculator access', 'Break-even & yield modeling', 'Post "Looking For" requests', 'Regional yield data reports'],
  Owner:    ['List your property for free', 'Manage bookings & inquiries', 'Track leads in your dashboard', 'Set short or long-term rental terms'],
  Realtor:  ['List on behalf of clients', 'Pipeline & CRM dashboard', 'Co-listing & referral tracking', 'Social share kit + open house tools'],
}

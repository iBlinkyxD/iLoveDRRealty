import { c } from '../design'

export const DEMO_ROLES = [
  { role: 'Buyer',    tone: c.coral,  email: 'buyer@demo.do',    icon: '🔍', can: ['Browse & filter all listings', 'Save favorites & searches', 'Submit inquiries to sellers', 'Book short-term rentals'] },
  { role: 'Investor', tone: c.sea,    email: 'investor@demo.do', icon: '📈', can: ['Everything a Buyer can do', 'Run the ROI deal calculator', 'Post buyer requests ("Looking For")', 'View regional yield data'] },
  { role: 'Owner',    tone: c.gold,   email: 'owner@demo.do',    icon: '🔑', can: ['List & manage own properties', 'Manage rental calendar & pricing', 'Confirm or decline bookings', 'Track leads on own listings'] },
  { role: 'Realtor',  tone: c.green,  email: 'realtor@demo.do',  icon: '🏘️', can: ['List on behalf of clients', 'Lead & pipeline manager', 'Co-listing & referral tracking', 'Social share kit + CRM sync'] },
]

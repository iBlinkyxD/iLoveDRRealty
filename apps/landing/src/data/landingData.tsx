import React from 'react'
import { Search, TrendingUp, Layers } from 'lucide-react'
import { c } from '../design'

export const STATS = [
  { value: '4,800+', key: 'active_listings' },
  { value: '$2.4B',  key: 'properties_listed' },
  { value: '320+',   key: 'verified_realtors' },
  { value: '12K+',   key: 'registered_buyers' },
]

// Text (mistake / lesson) lives in locales/*/landing.json — indexed by position
export const MISTAKES = [
  { icon: '📝', color: c.coral },
  { icon: '🔍', color: c.sea },
  { icon: '💼', color: c.gold },
  { icon: '🏝️', color: c.green },
  { icon: '💸', color: c.coral },
  { icon: '🤝', color: c.sea },
]

export const SAMPLE_PROPERTIES = [
  { id: 1, title: 'Oceanfront Villa with Infinity Pool',  region: 'Cap Cana, La Altagracia',    price: 2450000, bd: 6, ba: 7, m2: 640, roi: 8.4, tag: 'Luxury', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&auto=format&fit=crop' },
  { id: 2, title: 'Penthouse Condo — Piantini',           region: 'Piantini, Santo Domingo',    price: 389000,  bd: 3, ba: 3, m2: 185, roi: 6.8, tag: 'New',    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80&auto=format&fit=crop' },
  { id: 3, title: 'Tropical Golf Community Villa',        region: 'Punta Cana, La Altagracia',  price: 780000,  bd: 4, ba: 4, m2: 320, roi: 7.2, tag: 'Golf',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop' },
  { id: 4, title: 'Modern Beachfront Residence',          region: 'Las Terrenas, Samaná',       price: 560000,  bd: 3, ba: 3, m2: 220, roi: 9.1, tag: 'Beach',  img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80&auto=format&fit=crop' },
]

const BuyerIcon    = () => <Search size={25} />
const InvestorIcon = () => <TrendingUp size={25} />
const RealtorIcon  = () => <Layers size={25} />

// Text (label / sub / perks) lives in locales/*/landing.json — keyed by role.key
export const ROLES = [
  { key: 'buyer',    tone: c.coral, variant: 3, Icon: BuyerIcon,    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop' },
  { key: 'investor', tone: c.sea,   variant: 2, Icon: InvestorIcon, img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&auto=format&fit=crop' },
  { key: 'realtor',  tone: c.green, variant: 1, Icon: RealtorIcon,  img: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80&auto=format&fit=crop' },
]

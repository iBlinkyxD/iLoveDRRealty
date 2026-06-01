import React from 'react'
import { Search, TrendingUp, Layers } from 'lucide-react'
import { c } from '../design'
import { CARD_GRADIENTS } from './gradients'

export const STATS = [
  { value: '4,800+', label: 'Active listings' },
  { value: '$2.4B',  label: 'Properties listed' },
  { value: '320+',   label: 'Verified realtors' },
  { value: '12K+',   label: 'Registered buyers' },
]

export const MISTAKES = [
  { icon: '📝', color: c.coral, mistake: 'We trusted a single-language contract.',
    lesson: "Every contract is now reviewed in both English and Spanish — and we flag the clauses Americans typically miss." },
  { icon: '🔍', color: c.sea, mistake: 'We put down a deposit before the title search.',
    lesson: "We never let a client place earnest money until the Conservaduría record comes back clean." },
  { icon: '💼', color: c.gold, mistake: 'We hired the cheapest attorney we could find.',
    lesson: "Our network of vetted DR attorneys has handled hundreds of foreign-buyer closings — we'll introduce you to two or three." },
  { icon: '🏝️', color: c.green, mistake: 'We assumed CONFOTUR savings were automatic.',
    lesson: "It isn't. We verify CONFOTUR eligibility before you buy and walk you through the paperwork after." },
  { icon: '💸', color: c.coral, mistake: "We didn't budget for the closing costs nobody mentioned.",
    lesson: "Our ROI calculator includes the 3% transfer tax, 1% IPI, notary fees, and every line item we got surprised by." },
  { icon: '🤝', color: c.sea, mistake: "We took recommendations from people who'd never bought property.",
    lesson: "Every team member here owns property in the DR or has helped a family member buy. No exceptions." },
]

export const SAMPLE_PROPERTIES = [
  { id: 1, title: 'Oceanfront Villa with Infinity Pool',  region: 'Cap Cana, La Altagracia',    price: 2450000, bd: 6, ba: 7, m2: 640, roi: 8.4, tag: 'Luxury', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&auto=format&fit=crop' },
  { id: 2, title: 'Penthouse Condo — Piantini',           region: 'Piantini, Santo Domingo',    price: 389000,  bd: 3, ba: 3, m2: 185, roi: 6.8, tag: 'New',    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80&auto=format&fit=crop' },
  { id: 3, title: 'Tropical Golf Community Villa',        region: 'Punta Cana, La Altagracia',  price: 780000,  bd: 4, ba: 4, m2: 320, roi: 7.2, tag: 'Golf',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop' },
  { id: 4, title: 'Modern Beachfront Residence',          region: 'Las Terrenas, Samaná',       price: 560000,  bd: 3, ba: 3, m2: 220, roi: 9.1, tag: 'Beach',  img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80&auto=format&fit=crop' },
]

const BuyerIcon = () => <Search size={25} />
const InvestorIcon = () => <TrendingUp size={25} />
const RealtorIcon = () => <Layers size={25} />

export const ROLES = [
  {
    key: 'buyer',
    tone: c.coral,
    variant: 3,
    label: 'Buyers & Renters',
    sub: "Immersive browsing, smart filters, and a seamless inquiry flow to find your place in paradise — every listing admin-verified.",
    perks: ['Advanced filter search', 'Wishlist & saved homes', 'Rental booking calendar', 'AI concierge guidance'],
    Icon: BuyerIcon,
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop',
  },
  {
    key: 'investor',
    tone: c.sea,
    variant: 2,
    label: 'Investors',
    sub: "ROI-focused discovery with professional deal analysis and live market intelligence built into every property.",
    perks: ['Deal profit estimator', 'Break-even modeling', 'Buyer request marketplace', 'Regional yield data'],
    Icon: InvestorIcon,
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&auto=format&fit=crop',
  },
  {
    key: 'realtor',
    tone: c.green,
    variant: 1,
    label: 'Realtors & Owners',
    sub: "List once, reach international buyers, and manage leads, calendars, and commissions from one professional portal.",
    perks: ['Listing & lead manager', 'Pipeline & CRM sync', 'Co-listing & referrals', 'Social share kit'],
    Icon: RealtorIcon,
    img: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80&auto=format&fit=crop',
  },
]

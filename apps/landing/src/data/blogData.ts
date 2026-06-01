import { c } from '../design'

export const CATS = [
  { key: 'All',       label: 'All Guides',     icon: '📚', a: c.ink,      b: '#2a3a5e' },
  { key: 'Moving',    label: 'Moving Here',     icon: '🌴', a: c.green,    b: '#1a5128' },
  { key: 'Investing', label: 'Investing',       icon: '📈', a: c.sea,      b: '#075480' },
  { key: 'Buying',    label: 'Buying Process',  icon: '🏠', a: c.coral,    b: c.coralDeep },
  { key: 'Lifestyle', label: 'Lifestyle',       icon: '☀️', a: c.gold,     b: '#c98700' },
  { key: 'Legal',     label: 'Legal & Tax',     icon: '⚖️', a: '#7c3aed',  b: '#5b21b6' },
] as const

export type CatKey = typeof CATS[number]['key']

export function catInfo(key: string) {
  return CATS.find(c => c.key === key) ?? CATS[0]
}

export const STATS: [string, string][] = [
  ['400K+', 'Expats in DR'],
  ['$0',    'Income tax (first 20yr)'],
  ['12%',   'YoY property growth'],
  ['45 min','To 12+ countries'],
  ['$1,400','Avg monthly cost'],
]

export const STAT_COLORS = [c.gold, c.coral, c.sea, c.green, c.gold]

export const FEATURED = {
  tag: 'MOVING GUIDE · 2026',
  title: 'The complete guide to moving to the Dominican Republic',
  desc: 'Everything from visa pathways and residency to opening a bank account, finding your first home, and joining the expat community. Updated for 2026, used by 12,000+ families.',
  author: 'Maria Cruz',
  role: 'Relocation Editor',
  read: '18 min read',
  initials: 'MC',
  img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop',
}

export const EDITOR_PICKS = [
  {
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80&auto=format&fit=crop',
    cat: 'Investing', icon: '📈',
    title: 'Why investors are choosing the DR over Miami',
    desc: "ROI comparisons, tax advantages, and why the Caribbean's fastest-growing market is capturing global attention.",
    author: 'Carlos Reyes', read: '12 min',
  },
  {
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80&auto=format&fit=crop',
    cat: 'Buying', icon: '🏠',
    title: 'Punta Cana vs Las Terrenas vs Santo Domingo',
    desc: "A detailed comparison of the DR's top markets for buyers and investors in 2026.",
    author: 'Ana Peña', read: '9 min',
  },
]

export const GUIDES = [
  { cat: 'Legal',     icon: '🛂', title: 'How to get Dominican residency in 2026',       desc: 'Step-by-step breakdown of the residency process, documents, timelines, and costs.',                                       read: '8 min',  img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80&auto=format&fit=crop' },
  { cat: 'Legal',     icon: '⚖️', title: 'Understanding Dominican property law',         desc: 'Title certificates, Título de Propiedad, due diligence, and protecting your investment.',                                   read: '14 min', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80&auto=format&fit=crop' },
  { cat: 'Investing', icon: '💰', title: 'Tax benefits: Law 171-07 explained',           desc: "How the DR's special residency exempts you from income, capital gains, and import taxes for 20 years.",                  read: '10 min', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80&auto=format&fit=crop' },
  { cat: 'Lifestyle', icon: '🛒', title: 'Real cost of living in the DR',                desc: 'Groceries, utilities, dining, healthcare, and private schooling — honest numbers from real expats.',                      read: '7 min',  img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80&auto=format&fit=crop' },
  { cat: 'Lifestyle', icon: '🎓', title: 'Best international schools for expat families', desc: 'IB programmes, American curricula, tuition ranges, and the best neighborhoods for families.',                           read: '11 min', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80&auto=format&fit=crop' },
  { cat: 'Lifestyle', icon: '🏥', title: 'Healthcare in the DR',                         desc: 'Top hospitals, international insurance, and why medical tourism is booming in Punta Cana.',                                read: '9 min',  img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80&auto=format&fit=crop' },
]

export const STEPS: [string, string, string, string][] = [
  ['01', '🔍', 'Search & discover',   'Define your goals, budget, and regions.'],
  ['02', '🤝', 'Make an offer',        'Letter of Intent, negotiation, agreed terms.'],
  ['03', '📋', 'Due diligence',        'Title search, surveys, ~30 days.'],
  ['04', '✍️', 'Promise of sale',      'Promesa de venta, 10–30% in escrow.'],
  ['05', '🏦', 'Financing',            'Local bank, international, or all-cash.'],
  ['06', '🔑', 'Closing & transfer',  'Notary, 3% transfer tax, registered title.'],
]

export const STEP_COLORS = [c.gold, c.coral, c.sea, '#7c3aed', c.green, c.gold]

export const FAQS: [string, string][] = [
  ['Can foreigners own property in the Dominican Republic?', 'Yes. Foreigners have the same property rights as Dominican citizens and can own land and real estate outright in their own name — no residency required.'],
  ['What taxes do I pay when buying property?', 'A one-time 3% transfer tax (Impuesto de Transferencia) at closing, plus an annual 1% property tax (IPI) on value above the exemption threshold. CONFOTUR-approved projects can waive these.'],
  ['How long does the buying process take?', 'Typically 30–60 days from accepted offer to title transfer, with due diligence being the longest phase at roughly 30 days.'],
  ['Do I need a Dominican attorney?', 'Strongly recommended. A local real estate attorney handles title searches, due diligence, and the closing — protecting you from boundary disputes and title defects.'],
  ['What is residency and do I need it to buy property?', 'You do NOT need residency to buy. Residency (including the Law 171-07 investor/retiree route) offers tax benefits and the right to live in the DR long-term, but ownership is open to all foreigners.'],
  ["Can I rent out my property when I'm not using it?", "Yes. Short- and long-term rentals are common, and I♥DR Realty's booking tools let owners manage availability and payments directly."],
]

export const FAQ_COLORS = [c.coral, c.sea, c.green, c.gold, '#7c3aed', c.coral]

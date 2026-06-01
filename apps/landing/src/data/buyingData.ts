import { c } from '../design'

export const I = {
  shield: ["M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z", "M9 12l2 2 4-4"],
  globe:  ["M12 21a9 9 0 100-18 9 9 0 000 18z", "M3 12h18", "M12 3a14 14 0 000 18 14 14 0 000-18z"],
  chart:  ["M4 19V5", "M4 19h16", "M8 16l3-4 3 2 4-6"],
  bolt:   "M13 2L4 14h6l-1 8 9-12h-6z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  msg:    "M21 12a8 8 0 01-11.6 7.1L4 20l1-4.5A8 8 0 1121 12z",
  layers: ["M12 3l9 5-9 5-9-5z", "M3 13l9 5 9-5"],
  doc:    ["M7 3h7l5 5v13H7z", "M14 3v5h5", "M10 13h6", "M10 17h6"],
  user:   ["M12 12a4 4 0 100-8 4 4 0 000 8z", "M5 20a7 7 0 0114 0"],
  key:    ["M14 8a4 4 0 11-5.6 5.6L4 18l-1 3 3-1 1.5-1.5", "M14.5 9.5l4-4", "M17 8l2 2"],
}

export const PILLARS = [
  { icon: I.shield, title: 'Verified listings only',         desc: "Every property is reviewed by our team before it goes live — photos, price, ownership, the works. No phantom listings, no bait-and-switch.", tone: c.coral },
  { icon: I.globe,  title: 'Built for international buyers', desc: "Bilingual ES/EN throughout, USD/DOP toggle, foreign-ownership notes on every listing, and a team that's used to closing deals across time zones.", tone: c.sea },
  { icon: I.chart,  title: 'Numbers, not vibes',             desc: "ROI calculator, regional yield data, and transparent fees built into every deal page. Decide with the math in front of you, not after.", tone: c.green },
  { icon: I.bolt,   title: 'Fast, transparent process',      desc: "From first inquiry to title transfer, every step is laid out — what happens, who does it, what it costs. No surprises.", tone: c.gold },
]

export const SERVICES = [
  { icon: I.search, title: 'Property matchmaker',    desc: "We learn what you're looking for — beach, mountain, rental yield, second home — and only show you properties that fit." },
  { icon: I.msg,    title: 'Skilled negotiator',      desc: "Local pricing knowledge, comparable sales, and seller relationships that get you a fair number — without leaving money on the table." },
  { icon: I.layers, title: 'Market specialist',       desc: "Deep familiarity with Punta Cana, Cap Cana, Las Terrenas, Santo Domingo, and the rising areas most foreign buyers haven't heard of yet." },
  { icon: I.doc,    title: 'Transaction coordinator', desc: "Title search, lawyer coordination, escrow, CONFOTUR paperwork, IPI registration — handled, tracked, and explained at every step." },
  { icon: I.user,   title: 'Trusted advisor',         desc: "We'll tell you when not to buy. Honest feedback is the entire point of having a local in your corner." },
  { icon: I.key,    title: 'Long-term support',       desc: "After closing: property managers, contractors, banking, residency referrals — the connections you actually need to live or invest here." },
]

export const STEPS: [string, string, string][] = [
  ['01', 'Discovery call',      "Tell us what you're looking for, your timeline, and how you'd use the property. 30 minutes, no pressure, in English or Spanish."],
  ['02', 'Curated shortlist',   'We send you 5–10 properties that actually match — with full data, ROI numbers, and our honest take on each one.'],
  ['03', 'Property tour',       "On the island or via live video. We walk through neighborhoods, point out what photos don't show, and answer everything."],
  ['04', 'Offer & negotiation', 'We help you write a competitive offer and negotiate on your behalf. Most deals close 4–8% under asking.'],
  ['05', 'Due diligence',       'Title search, survey, building inspection, HOA history — coordinated with a Dominican attorney we trust.'],
  ['06', 'Closing & handover',  "Sign at the notary, register at the title office, take the keys. We're with you in the room or on the call."],
]

export const TRUST_ITEMS = [
  'Every listing reviewed and verified before going live',
  'Bilingual team — English, Spanish, and growing',
  'Real ROI numbers on every investment property',
  'Personalized search based on goals, not just budget',
  "Agents who actually live in the markets you're buying in",
  'Connections to attorneys, banks, property managers, contractors',
  "Honest pushback when a deal doesn't make sense",
]

export const HERO_BG = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80&auto=format&fit=crop'

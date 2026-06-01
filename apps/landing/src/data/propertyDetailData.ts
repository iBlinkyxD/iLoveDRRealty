export const TONE_MAP: Record<string, string> = {
  gold:  'bg-gold text-[#3d2800] border-gold',
  sea:   'bg-sea text-white border-sea',
  coral: 'bg-coral text-white border-coral',
  green: 'bg-brand text-white border-brand',
  sand:  'bg-ink/80 text-white border-white/20',
}

export const GALLERY_EXTRAS = [
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&auto=format&fit=crop',
]

export const HIGHLIGHTS: [string, string, string][] = [
  ['🏖️', 'Private beach access', '80m exclusive frontage'],
  ['⚡', 'Solar + generator',     'Energy independent'],
  ['🛡️', 'Gated community',       '24/7 security'],
  ['🌿', '1.2 acres',             'Landscaped gardens'],
]

export const THINGS_TO_KNOW: [string, string[]][] = [
  ['Check-in / out',    ['Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Self check-in with smart lock']],
  ['Safety & property', ['Gated community, 24/7 security', 'Smoke & CO alarms', 'Security cameras on exterior']],
  ['Cancellation',      ['Free cancellation for 48 hrs', '50% refund up to 7 days before', 'Service fee non-refundable']],
]

export interface Review {
  name:     string
  ini:      string
  colClass: string
  text:     string
}

export const REVIEWS: Review[] = [
  { name: 'James C.', ini: 'JC', colClass: 'bg-sea',   text: 'Absolutely stunning villa — the infinity pool overlooking the ocean was unreal. The team handled everything from airport pickup to a private chef. Will be back.' },
  { name: 'Sofia R.', ini: 'SR', colClass: 'bg-coral',  text: 'Exceeded every expectation. Spotless, beautifully designed, and the location is perfect. Communication was instant over WhatsApp.' },
  { name: 'Marc D.',  ini: 'MD', colClass: 'bg-brand',  text: 'Booked for a family reunion of 10 and there was room for everyone. The gated community felt very safe with kids around. Highly recommend.' },
  { name: 'Elena V.', ini: 'EV', colClass: 'bg-gold',   text: "A true luxury experience. Photos don't do it justice. The solar setup meant zero interruptions, and the concierge arranged golf at Punta Espada." },
]

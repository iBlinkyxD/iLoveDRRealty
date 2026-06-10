import {
  Heart, MessageCircle, CalendarDays, Star, MapPin, Search,
  BookOpen, Scale, Globe, Banknote, type LucideIcon,
} from 'lucide-react'
import { Card, CardLink, StatusPill, SceneThumb, fmtPrice } from './shared'

function KpiCard({ Icon, label, value, delta, color, spark }: {
  Icon: LucideIcon; label: string; value: string; delta: string; color: string; spark: string
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line p-5 relative overflow-hidden">
      <div className="mb-2.5" style={{ color }}><Icon size={20} /></div>
      <div className="text-[11px] font-bold uppercase tracking-[.08em] text-dim mb-1">{label}</div>
      <div className="font-sans text-[28px] font-bold text-ink leading-none">{value}</div>
      <div className="text-xs font-semibold mt-1.5 text-green-600">{delta}</div>
      <svg viewBox="0 0 80 40" className="absolute right-0 bottom-0 w-25 h-12.5 opacity-[.18]">
        <polyline points={spark} stroke={color} strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

export const BUYER_KPIS: { Icon: LucideIcon; label: string; value: string; delta: string; color: string; spark: string }[] = [
  { Icon: Heart,         label: 'Saved Homes',    value: '6',  delta: '↑ 2 this week',    color: '#e10f1f', spark: '0,38 15,32 25,34 35,24 50,20 60,12 80,8'  },
  { Icon: MessageCircle, label: 'Inquiries Sent', value: '3',  delta: '2 awaiting reply',  color: '#0b63ab', spark: '0,30 15,32 25,18 35,22 50,12 60,16 80,8'  },
  { Icon: CalendarDays,  label: 'Upcoming Trips', value: '1',  delta: 'Jun 12 · Cap Cana', color: '#f0a800', spark: '0,38 15,35 25,28 35,30 50,18 60,14 80,10' },
  { Icon: Star,          label: 'Wishlist Match',  value: '12', delta: '↑ new today',       color: '#1f7a3d', spark: '0,38 15,28 25,32 35,18 50,16 60,8 80,6'  },
]

export const BUYER_LISTINGS = [
  { id: 1, title: 'Oceanfront Villa with Infinity Pool', region: 'Cap Cana, La Altagracia',  price: 2450000, bd: 6, ba: 7, v: 0 },
  { id: 2, title: 'Penthouse Condo — Piantini',          region: 'Piantini, Santo Domingo',   price: 389000,  bd: 3, ba: 3, v: 1 },
  { id: 3, title: 'Tropical Golf Community Villa',        region: 'Punta Cana, La Altagracia', price: 875000,  bd: 5, ba: 5, v: 2 },
  { id: 4, title: 'Modern Beachfront Residence',          region: 'Las Terrenas, Samaná',      price: 1200000, bd: 4, ba: 4, v: 3 },
  { id: 7, title: 'Cliffside Designer Villa',             region: 'Sosúa, Puerto Plata',       price: 1650000, bd: 5, ba: 6, v: 0 },
  { id: 8, title: 'Garden Condo near Marina',             region: 'Cabarete, Puerto Plata',    price: 245000,  bd: 2, ba: 2, v: 3 },
]

export const BUYER_RESOURCES: { Icon: LucideIcon; title: string; time: string }[] = [
  { Icon: BookOpen, title: 'The Complete DR Buying Guide',  time: '12 min read' },
  { Icon: Scale,    title: 'Understanding DR Property Law', time: '8 min read'  },
  { Icon: Globe,    title: 'Residency & Visa Options 2026', time: '6 min read'  },
  { Icon: Banknote, title: 'Cost of Living Comparison',     time: '5 min read'  },
]

export function BuyerHome({ go }: { go: (v: string) => void }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {BUYER_KPIS.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          <Card title={<><Heart size={14} />Saved Homes</>} action={<CardLink onClick={() => go('saved')}>View all →</CardLink>} padded={false}>
            <div className="px-3 sm:px-5">
              {BUYER_LISTINGS.slice(0, 5).map((l, i) => (
                <div key={l.id} className={`flex items-center gap-3 py-3 ${i < 4 ? 'border-b border-line' : ''}`}>
                  <SceneThumb v={l.v} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-ink truncate">{l.title}</div>
                    <div className="text-[11px] text-dim mt-0.5 flex items-center gap-1"><MapPin size={10} className="shrink-0" />{l.region}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-[13px] font-bold text-ink">{fmtPrice(l.price)}</div>
                    <StatusPill label="Saved" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={<><Search size={14} />Saved Searches</>} action={<CardLink onClick={() => go('searches')}>+ New search</CardLink>}>
            {[
              ['Punta Cana · 2BR+ · under $300K', 'Daily', '3 new'],
              ['Beachfront condos · Las Terrenas', 'Weekly', '1 new'],
            ].map(([s, freq, n], i) => (
              <div key={i} className={`flex items-center gap-3 py-3 ${i === 0 ? 'border-b border-line' : ''}`}>
                <div className="w-9 h-9 rounded-full shrink-0 grid place-items-center text-white" style={{ background: 'linear-gradient(135deg,#e10f1f,#a50f28)' }}>
                  <Search size={14} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-ink">{s}</div>
                  <div className="text-[11px] text-dim">Alerts: {freq}</div>
                </div>
                <StatusPill label={n} tone="#0b63ab" />
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title={<><MessageCircle size={14} />My Inquiries</>} action={<CardLink onClick={() => go('inquiries')}>All →</CardLink>} padded={false}>
            <div className="px-5">
              {[['Oceanfront Villa', 'Awaiting reply 2d', 'Pending'], ['Penthouse — Piantini', 'Replied · Tour Jun 2', 'Replied'], ['Golf Community Villa', 'Replied · 5d', 'Replied']].map(([name, note, st], i) => (
                <div key={i} className={`flex items-center gap-3 py-3 ${i < 2 ? 'border-b border-line' : ''}`}>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-ink">{name}</div>
                    <div className="text-[11px] text-dim">{note}</div>
                  </div>
                  <StatusPill label={st} />
                </div>
              ))}
            </div>
          </Card>

          <Card title={<><CalendarDays size={14} />Upcoming Trip</>}>
            <div className="flex flex-col gap-2">
              <div className="font-sans text-xl font-bold text-ink">Villa Paraíso — Cap Cana</div>
              <div className="text-xs text-dim">Jun 12–18, 2026 · 6 nights · 2 guests</div>
              <div className="h-2 bg-line rounded-full overflow-hidden mt-2">
                <div className="h-full w-full rounded-full" style={{ background: 'linear-gradient(90deg,#0b63ab,#f0a800)' }} />
              </div>
              <div className="flex justify-between text-xs text-dim mt-1">
                <span>Paid in full</span><span className="font-bold text-ink">$8,676</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

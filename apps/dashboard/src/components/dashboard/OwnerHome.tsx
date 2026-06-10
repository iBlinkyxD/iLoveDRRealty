import { Home, Calendar, DollarSign, Bell, MessageCircle, type LucideIcon } from 'lucide-react'
import { Card, StatusPill, RoleKpiCard } from './shared'

export const OWNER_KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Home,          label: 'Active Listings',    value: '2',      sub: '1 draft'                      },
  { Icon: Calendar,      label: 'Upcoming Bookings',  value: '5',      sub: 'Next: Jun 6'                  },
  { Icon: MessageCircle, label: 'Open Leads',         value: '19',     sub: '4 new today'                  },
  { Icon: DollarSign,    label: 'Revenue This Month', value: '$8,400', sub: '+12% vs last month', hl: true },
]

export const OWNER_LISTINGS = [
  { id: 1, name: 'Villa Palma — Sosúa',     status: 'Active', inquiries: 12, bookings: 3, price: '$3,200/mo', views: 847 },
  { id: 2, name: 'Condo 4B — Puerto Plata', status: 'Active', inquiries: 7,  bookings: 1, price: '$1,800/mo', views: 423 },
  { id: 3, name: 'Studio Apt — Cabarete',   status: 'Draft',  inquiries: 0,  bookings: 0, price: '$950/mo',   views: 0   },
]

export const OWNER_BOOKINGS = [
  { guest: 'James & Sara Wilson', property: 'Villa Palma — Sosúa',     dates: 'Jun 6–13',  nights: 7,  total: '$3,200', status: 'Confirmed' },
  { guest: 'Famille Lecomte',     property: 'Villa Palma — Sosúa',     dates: 'Jun 18–25', nights: 7,  total: '$3,200', status: 'Pending'   },
  { guest: 'Marco Ferretti',      property: 'Villa Palma — Sosúa',     dates: 'Jul 1–8',   nights: 7,  total: '$3,200', status: 'Confirmed' },
  { guest: 'Ana Gómez',           property: 'Condo 4B — Puerto Plata', dates: 'Jul 10–14', nights: 4,  total: '$1,800', status: 'Confirmed' },
  { guest: 'Thomas Müller',       property: 'Villa Palma — Sosúa',     dates: 'Aug 2–16',  nights: 14, total: '$6,400', status: 'Confirmed' },
]

export const OWNER_LEADS = [
  { name: 'Carlos Méndez',  query: 'Interested in long-term lease', property: 'Villa Palma', time: '2h ago',    tone: '#e10f1f' },
  { name: 'Emily Thompson', query: 'Asking about pet policy',        property: 'Condo 4B',    time: '5h ago',    tone: '#0b63ab' },
  { name: 'Rui Barbosa',    query: 'Requesting video walkthrough',   property: 'Villa Palma', time: 'Yesterday', tone: '#f0a800' },
  { name: 'Marta Quispe',   query: 'Price negotiation inquiry',      property: 'Condo 4B',    time: '2d ago',    tone: '#7884a0' },
  { name: 'Jean-Pierre M.', query: 'Available for 3-month stay?',    property: 'Villa Palma', time: '3d ago',    tone: '#0b63ab' },
  { name: 'Sofia Andrade',  query: 'Asking about WiFi & amenities',  property: 'Studio Apt',  time: '4d ago',    tone: '#1f7a3d' },
]

export const OWNER_REVENUE_BAR = [
  { month: 'Jan', rev: 4200 }, { month: 'Feb', rev: 5100 }, { month: 'Mar', rev: 6800 },
  { month: 'Apr', rev: 7200 }, { month: 'May', rev: 7600 }, { month: 'Jun', rev: 8400 },
]
export const OWNER_MAX_REV = Math.max(...OWNER_REVENUE_BAR.map(d => d.rev))

export const OWNER_CAL_EVENTS = [
  { date: 'Jun 6–13',  guest: 'Wilson',   property: 'Villa Palma', tone: '#1f7a3d' },
  { date: 'Jun 18–25', guest: 'Lecomte',  property: 'Villa Palma', tone: '#f0a800' },
  { date: 'Jul 1–8',   guest: 'Ferretti', property: 'Villa Palma', tone: '#1f7a3d' },
  { date: 'Jul 10–14', guest: 'Gómez',    property: 'Condo 4B',    tone: '#1f7a3d' },
  { date: 'Aug 2–16',  guest: 'Müller',   property: 'Villa Palma', tone: '#1f7a3d' },
]

export function OwnerHome({ go, tone }: { go: (v: string) => void; tone: string }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
        {OWNER_KPIS.map((k, i) => <RoleKpiCard key={i} {...k} tone={tone} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Card title={<><Home size={14} /> Active Listings</>} padded={false}
            action={<button onClick={() => go('listings')} className="text-xs font-bold bg-transparent border-none cursor-pointer" style={{ color: tone }}>Manage →</button>}>
            <div>
              {OWNER_LISTINGS.map((l, i) => (
                <div key={l.id} className={`flex items-center gap-3.5 py-3 px-5.5 ${i < OWNER_LISTINGS.length - 1 ? 'border-b border-line' : ''}`}>
                  <div className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${tone}25` }}>
                    <Home size={18} style={{ color: tone }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[13.5px] font-semibold text-ink truncate">{l.name}</div>
                    <div className="text-[11.5px] text-dim mt-0.5">{l.price} · {l.views.toLocaleString()} views · {l.inquiries} leads</div>
                  </div>
                  <StatusPill label={l.status} />
                </div>
              ))}
              <div className="py-3 px-5.5">
                <button className="text-[12.5px] font-bold bg-transparent border-none cursor-pointer p-0" style={{ color: tone }}>+ Add listing</button>
              </div>
            </div>
          </Card>

          <Card title={<><DollarSign size={14} /> Revenue</>} sub="Last 6 months">
            <div className="flex items-end gap-2 h-27.5">
              {OWNER_REVENUE_BAR.map((d, i) => {
                const h = (d.rev / OWNER_MAX_REV) * 80
                const isLast = i === OWNER_REVENUE_BAR.length - 1
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`text-[10px] ${isLast ? 'text-ink font-bold' : 'text-dim'}`}>${(d.rev / 1000).toFixed(1)}K</div>
                    <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? tone : `${tone}50` }} />
                    <div className="text-[10px] text-dim">{d.month}</div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => go('earnings')} className="mt-3 text-[12.5px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: tone }}>
              View full breakdown →
            </button>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title={<><Bell size={14} /> Bookings</>} sub="Upcoming"
            action={<button onClick={() => go('bookings')} className="text-xs font-bold bg-transparent border-none cursor-pointer" style={{ color: tone }}>All →</button>}>
            <div className="flex flex-col gap-2.5">
              {OWNER_BOOKINGS.slice(0, 3).map((b, i) => (
                <div key={i} className="py-3 px-3.5 rounded-[10px] bg-[#F8F9FC] border border-line">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-[13px] font-bold text-ink">{b.guest}</div>
                    <StatusPill label={b.status} />
                  </div>
                  <div className="text-[11.5px] text-dim">{b.dates} · {b.nights}n · {b.total}</div>
                  {b.status === 'Pending' && (
                    <div className="flex gap-2 mt-2">
                      <button className="text-xs font-bold py-1.25 px-3 rounded-lg border-none bg-brand text-white cursor-pointer">Accept</button>
                      <button className="text-xs font-bold py-1.25 px-3 rounded-lg border border-line bg-white text-ink2 cursor-pointer">Decline</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title={<><MessageCircle size={14} /> Recent Leads</>}
            action={<span className="text-[11.5px] font-bold text-coral px-2.5 py-0.75 rounded-full" style={{ background: '#e10f1f15' }}>4 new</span>}>
            <div className="flex flex-col gap-2.5">
              {OWNER_LEADS.slice(0, 4).map((l, i) => (
                <div key={i} className={`flex items-start gap-2.5 pb-2.5 ${i < 3 ? 'border-b border-line' : ''}`}>
                  <div className="w-8.5 h-8.5 rounded-full shrink-0 grid place-items-center font-bold text-[13px] text-white" style={{ background: l.tone }}>{l.name[0]}</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-ink">{l.name}</div>
                    <div className="text-xs text-ink2 leading-[1.35] mt-0.5 mb-0.75">{l.query}</div>
                    <div className="text-[11px] text-dim">{l.time}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => go('leads')} className="text-[12.5px] font-semibold bg-transparent border-none cursor-pointer p-0 text-left" style={{ color: tone }}>
                View all {OWNER_LEADS.length} leads →
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

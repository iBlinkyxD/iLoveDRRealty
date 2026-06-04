import type { ReactNode } from 'react'
import {
  Home, Calendar, MessageCircle, DollarSign, Bell,
  ClipboardList, User,
  type LucideIcon,
} from 'lucide-react'

const TONE = '#f0a800'

const KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Home,          label: 'Active Listings',    value: '2',      sub: '1 draft'                        },
  { Icon: Calendar,      label: 'Upcoming Bookings',  value: '5',      sub: 'Next: Jun 6'                    },
  { Icon: MessageCircle, label: 'Open Leads',         value: '19',     sub: '4 new today'                    },
  { Icon: DollarSign,    label: 'Revenue This Month', value: '$8,400', sub: '+12% vs last month', hl: true   },
]

const LISTINGS = [
  { id: 1, name: 'Villa Palma — Sosúa',     status: 'Active', inquiries: 12, bookings: 3, price: '$3,200/mo', views: 847 },
  { id: 2, name: 'Condo 4B — Puerto Plata', status: 'Active', inquiries: 7,  bookings: 1, price: '$1,800/mo', views: 423 },
  { id: 3, name: 'Studio Apt — Cabarete',   status: 'Draft',  inquiries: 0,  bookings: 0, price: '$950/mo',   views: 0   },
]

const BOOKINGS = [
  { guest: 'James & Sara Wilson', property: 'Villa Palma — Sosúa',     dates: 'Jun 6–13',  nights: 7,  total: '$3,200', status: 'Confirmed' },
  { guest: 'Famille Lecomte',     property: 'Villa Palma — Sosúa',     dates: 'Jun 18–25', nights: 7,  total: '$3,200', status: 'Pending'   },
  { guest: 'Marco Ferretti',      property: 'Villa Palma — Sosúa',     dates: 'Jul 1–8',   nights: 7,  total: '$3,200', status: 'Confirmed' },
  { guest: 'Ana Gómez',           property: 'Condo 4B — Puerto Plata', dates: 'Jul 10–14', nights: 4,  total: '$1,800', status: 'Confirmed' },
  { guest: 'Thomas Müller',       property: 'Villa Palma — Sosúa',     dates: 'Aug 2–16',  nights: 14, total: '$6,400', status: 'Confirmed' },
]

const LEADS = [
  { name: 'Carlos Méndez',  query: 'Interested in long-term lease', property: 'Villa Palma', time: '2h ago',    tone: '#e10f1f' },
  { name: 'Emily Thompson', query: 'Asking about pet policy',        property: 'Condo 4B',    time: '5h ago',    tone: '#0b63ab' },
  { name: 'Rui Barbosa',    query: 'Requesting video walkthrough',   property: 'Villa Palma', time: 'Yesterday', tone: '#f0a800' },
  { name: 'Marta Quispe',   query: 'Price negotiation inquiry',      property: 'Condo 4B',    time: '2d ago',    tone: '#7884a0' },
  { name: 'Jean-Pierre M.', query: 'Available for 3-month stay?',    property: 'Villa Palma', time: '3d ago',    tone: '#0b63ab' },
  { name: 'Sofia Andrade',  query: 'Asking about WiFi & amenities',  property: 'Studio Apt',  time: '4d ago',    tone: '#1f7a3d' },
]

const REVENUE_BAR = [
  { month: 'Jan', rev: 4200 },
  { month: 'Feb', rev: 5100 },
  { month: 'Mar', rev: 6800 },
  { month: 'Apr', rev: 7200 },
  { month: 'May', rev: 7600 },
  { month: 'Jun', rev: 8400 },
]
const MAX_REV = Math.max(...REVENUE_BAR.map(d => d.rev))

const CAL_EVENTS = [
  { date: 'Jun 6–13',  guest: 'Wilson',   property: 'Villa Palma', tone: '#1f7a3d' },
  { date: 'Jun 18–25', guest: 'Lecomte',  property: 'Villa Palma', tone: '#f0a800' },
  { date: 'Jul 1–8',   guest: 'Ferretti', property: 'Villa Palma', tone: '#1f7a3d' },
  { date: 'Jul 10–14', guest: 'Gómez',    property: 'Condo 4B',    tone: '#1f7a3d' },
  { date: 'Aug 2–16',  guest: 'Müller',   property: 'Villa Palma', tone: '#1f7a3d' },
]

const PAGE_TITLES: Record<string, string> = {
  home:     'Owner overview',
  listings: 'My listings',
  calendar: 'Booking calendar',
  bookings: 'Bookings',
  leads:    'Leads',
  earnings: 'Earnings',
  profile:  'My profile',
}

function Card({ title, sub, action, children, padded = true }: {
  title: ReactNode; sub?: string; action?: ReactNode; children: ReactNode; padded?: boolean
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line overflow-hidden">
      <div className="flex justify-between items-center px-5.5 py-4.5 border-b border-line">
        <div>
          <div className="font-serif text-base font-bold text-ink flex items-center gap-1.5">{title}</div>
          {sub && <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>}
        </div>
        {action}
      </div>
      <div className={padded ? 'p-5.5' : ''}>{children}</div>
    </div>
  )
}

function StatusPill({ label }: { label: string }) {
  const tone =
    label === 'Active' || label === 'Confirmed' ? '#1f7a3d' :
    label === 'Pending' ? '#f0a800' : '#7884a0'
  return (
    <span
      className="text-[11px] font-bold px-2.5 py-0.75 rounded-full shrink-0"
      style={{ color: tone, background: `${tone}18` }}
    >
      {label}
    </span>
  )
}

export default function OwnerDash({ go, view = 'home' }: { go: (v: string) => void; view?: string }) {

  const sections: Record<string, ReactNode> = {

    home: (
      <>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
          {KPIS.map((k, i) => (
            <div
              key={i}
              className={k.hl ? 'rounded-xl py-4.5 px-5' : 'bg-paper border border-line rounded-xl py-4.5 px-5'}
              style={k.hl ? { background: 'linear-gradient(135deg, #1f7a3d 0%, #155c2e 100%)' } : undefined}
            >
              <k.Icon size={20} className={`mb-2 ${k.hl ? 'text-white/70' : 'text-dim'}`} />
              <div className={`font-serif text-2xl font-bold leading-none ${k.hl ? 'text-white' : 'text-ink'}`}>{k.value}</div>
              <div className={`text-[12.5px] font-semibold mt-1.25 ${k.hl ? 'text-white/80' : 'text-ink2'}`}>{k.label}</div>
              <div className={`text-[11px] mt-0.75 ${k.hl ? 'text-white/55' : 'text-dim'}`}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">

          {/* Left col */}
          <div className="flex flex-col gap-5">

            {/* Active listings */}
            <Card
              title={<><Home size={14} /> Active Listings</>}
              padded={false}
              action={
                <button onClick={() => go('listings')} className="text-xs font-bold text-gold bg-transparent border-none cursor-pointer">Manage →</button>
              }
            >
              <div>
                {LISTINGS.map((l, i) => (
                  <div key={l.id} className={`flex items-center gap-3.5 py-3 px-5.5 ${i < LISTINGS.length - 1 ? 'border-b border-line-soft' : ''}`}>
                    <div className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${TONE}25` }}>
                      <Home size={18} style={{ color: TONE }} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[13.5px] font-semibold text-ink truncate">{l.name}</div>
                      <div className="text-[11.5px] text-dim mt-0.5">{l.price} · {l.views.toLocaleString()} views · {l.inquiries} leads</div>
                    </div>
                    <StatusPill label={l.status} />
                  </div>
                ))}
                <div className="py-3 px-5.5">
                  <button className="text-[12.5px] font-bold bg-transparent border-none cursor-pointer p-0" style={{ color: TONE }}>+ Add listing</button>
                </div>
              </div>
            </Card>

            {/* Revenue bar chart */}
            <Card title={<><DollarSign size={14} /> Revenue</>} sub="Last 6 months">
              <div className="flex items-end gap-2 h-27.5">
                {REVENUE_BAR.map((d, i) => {
                  const h = (d.rev / MAX_REV) * 80
                  const isLast = i === REVENUE_BAR.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`text-[10px] ${isLast ? 'text-ink font-bold' : 'text-dim'}`}>
                        ${(d.rev / 1000).toFixed(1)}K
                      </div>
                      <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? TONE : `${TONE}50` }} />
                      <div className="text-[10px] text-dim">{d.month}</div>
                    </div>
                  )
                })}
              </div>
              <button onClick={() => go('earnings')} className="mt-3 text-[12.5px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: TONE }}>
                View full breakdown →
              </button>
            </Card>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-5">

            {/* Bookings */}
            <Card
              title={<><Bell size={14} /> Bookings</>}
              sub="Upcoming"
              action={
                <button onClick={() => go('bookings')} className="text-xs font-bold text-gold bg-transparent border-none cursor-pointer">All →</button>
              }
            >
              <div className="flex flex-col gap-2.5">
                {BOOKINGS.slice(0, 3).map((b, i) => (
                  <div key={i} className="py-3 px-3.5 rounded-[10px] bg-[#F8F9FC] border border-line-soft">
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

            {/* Recent leads */}
            <Card
              title={<><MessageCircle size={14} /> Recent Leads</>}
              action={
                <span className="text-[11.5px] font-bold text-coral px-2.5 py-0.75 rounded-full" style={{ background: '#e10f1f15' }}>4 new</span>
              }
            >
              <div className="flex flex-col gap-2.5">
                {LEADS.slice(0, 4).map((l, i) => (
                  <div key={i} className={`flex items-start gap-2.5 pb-2.5 ${i < 3 ? 'border-b border-line-soft' : ''}`}>
                    <div
                      className="w-8.5 h-8.5 rounded-full shrink-0 grid place-items-center font-bold text-[13px] text-white"
                      style={{ background: l.tone }}
                    >
                      {l.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-ink">{l.name}</div>
                      <div className="text-xs text-ink2 leading-[1.35] mt-0.5 mb-0.75">{l.query}</div>
                      <div className="text-[11px] text-dim">{l.time}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => go('leads')} className="text-[12.5px] font-semibold bg-transparent border-none cursor-pointer p-0 text-left" style={{ color: TONE }}>
                  View all {LEADS.length} leads →
                </button>
              </div>
            </Card>
          </div>
        </div>
      </>
    ),

    listings: (
      <Card title={<><Home size={14} /> My Listings ({LISTINGS.length})</>}>
        <div className="flex flex-col gap-3.5">
          {LISTINGS.map(l => (
            <div key={l.id} className="flex items-center gap-3.5 py-3.5 px-4 rounded-xl bg-[#F8F9FC] border border-line-soft">
              <div className="w-11 h-11 rounded-[10px] shrink-0 flex items-center justify-center" style={{ background: `${TONE}25` }}>
                <Home size={20} style={{ color: TONE }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="text-sm font-bold text-ink truncate">{l.name}</div>
                  <StatusPill label={l.status} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: 'Price', v: l.price }, { label: 'Views', v: l.views.toLocaleString() },
                      { label: 'Leads', v: l.inquiries }, { label: 'Bookings', v: l.bookings },
                    ].map((m, j) => (
                      <div key={j}>
                        <div className="text-[12.5px] font-bold text-ink">{m.v}</div>
                        <div className="text-[10.5px] text-dim">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="text-xs font-bold py-1.5 px-3 rounded-lg border bg-transparent cursor-pointer" style={{ borderColor: TONE, color: TONE }}>Edit</button>
                    <button className="text-xs font-bold py-1.5 px-3 rounded-lg border border-line bg-white text-ink2 cursor-pointer">View</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-2.75 rounded-full border-2 bg-transparent font-sans text-[13px] font-bold cursor-pointer" style={{ borderColor: TONE, color: TONE }}>
            + Add new listing
          </button>
        </div>
      </Card>
    ),

    calendar: (
      <Card title={<><Calendar size={14} /> Booking Calendar</>} sub="June – August 2026">
        <div className="flex flex-col gap-3">
          {CAL_EVENTS.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 py-3.5 px-4 rounded-[10px] bg-[#F8F9FC] border border-line-soft border-l-4"
              style={{ borderLeftColor: e.tone }}
            >
              <div className="flex-1">
                <div className="text-[13.5px] font-bold text-ink">{e.guest}</div>
                <div className="text-xs text-dim mt-0.5">{e.property} · {e.date}</div>
              </div>
              <StatusPill label="Confirmed" />
            </div>
          ))}
          <div
            className="p-4 rounded-[10px] text-center text-[13px] font-semibold border border-dashed"
            style={{ background: `${TONE}10`, borderColor: TONE, color: TONE }}
          >
            + Block dates / Add availability
          </div>
        </div>
      </Card>
    ),

    bookings: (
      <Card title={<><Bell size={14} /> All Bookings ({BOOKINGS.length})</>}>
        <div className="flex flex-col gap-3">
          {BOOKINGS.map((b, i) => (
            <div key={i} className="py-3.5 px-4 rounded-[10px] bg-[#F8F9FC] border border-line-soft">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[13.5px] font-bold text-ink">{b.guest}</div>
                  <div className="text-xs text-dim mt-0.5">{b.property} · {b.dates} · {b.nights} nights</div>
                </div>
                <StatusPill label={b.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand">{b.total}</span>
                {b.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button className="text-xs font-bold py-1.5 px-3.5 rounded-lg border-none bg-brand text-white cursor-pointer">Accept</button>
                    <button className="text-xs font-bold py-1.5 px-3.5 rounded-lg border border-line bg-white text-ink2 cursor-pointer">Decline</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),

    leads: (
      <Card
        title={<><MessageCircle size={14} /> All Leads ({LEADS.length})</>}
        action={
          <span className="text-[11.5px] font-bold text-coral px-2.5 py-0.75 rounded-full" style={{ background: '#e10f1f15' }}>4 new</span>
        }
        padded={false}
      >
        <div>
          {LEADS.map((l, i) => (
            <div key={i} className={`flex items-start gap-3 py-3.5 px-4 sm:px-5.5 ${i < LEADS.length - 1 ? 'border-b border-line-soft' : ''}`}>
              <div
                className="w-9.5 h-9.5 rounded-full shrink-0 grid place-items-center font-bold text-sm text-white"
                style={{ background: l.tone }}
              >
                {l.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13.5px] font-bold text-ink">{l.name}</div>
                    <div className="text-[12.5px] text-ink2 leading-[1.35] my-0.75">{l.query}</div>
                    <div className="text-[11.5px] text-dim">{l.property} · {l.time}</div>
                  </div>
                  <button className="text-xs font-bold py-1.5 px-3.5 rounded-lg border-none text-white cursor-pointer shrink-0 ml-3" style={{ background: TONE }}>Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),

    earnings: (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            { Icon: DollarSign, label: 'Total This Year', value: '$44,100', sub: 'Jan–Jun 2026' },
            { Icon: Calendar,   label: 'This Month',      value: '$8,400',  sub: '+12% vs May'  },
            { Icon: Home,       label: 'Per Property',    value: '$4,200',  sub: 'Avg/mo'       },
          ].map((k, i) => (
            <div
              key={i}
              className={i === 0 ? 'rounded-xl p-5' : 'bg-paper border border-line rounded-xl p-5'}
              style={i === 0 ? { background: 'linear-gradient(135deg, #1f7a3d 0%, #155c2e 100%)' } : undefined}
            >
              <k.Icon size={22} className={`mb-2 ${i === 0 ? 'text-white/70' : 'text-dim'}`} />
              <div className={`font-serif text-[26px] font-bold ${i === 0 ? 'text-white' : 'text-ink'}`}>{k.value}</div>
              <div className={`text-[12.5px] font-semibold mt-1.25 ${i === 0 ? 'text-white/80' : 'text-ink2'}`}>{k.label}</div>
              <div className={`text-[11px] mt-0.75 ${i === 0 ? 'text-white/55' : 'text-dim'}`}>{k.sub}</div>
            </div>
          ))}
        </div>

        <Card title={<><DollarSign size={14} /> Monthly Revenue</>} sub="Jan – Jun 2026">
          <div className="flex items-end gap-2.5 h-32.5">
            {REVENUE_BAR.map((d, i) => {
              const h = (d.rev / MAX_REV) * 100
              const isLast = i === REVENUE_BAR.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.75">
                  <div className={`text-[11px] ${isLast ? 'text-ink font-bold' : 'text-dim'}`}>
                    ${(d.rev / 1000).toFixed(1)}K
                  </div>
                  <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? TONE : `${TONE}50` }} />
                  <div className="text-[11px] text-dim">{d.month}</div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card title={<><ClipboardList size={14} /> Revenue by Listing</>} padded={false}>

          {/* Mobile card rows */}
          <div className="sm:hidden divide-y divide-line">
            {[
              { name: 'Villa Palma — Sosúa',    bookings: 4, nights: 35, rev: '$11,200' },
              { name: 'Condo 4B — Puerto Plata', bookings: 1, nights: 4,  rev: '$1,800'  },
            ].map((r, i) => (
              <div key={i} className="px-4 py-3.5 flex items-center justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-ink truncate">{r.name}</div>
                <div className="flex items-center gap-3 shrink-0 text-[12.5px]">
                  <span className="text-dim">{r.bookings} bk · {r.nights}n</span>
                  <span className="font-bold text-brand">{r.rev}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block p-5">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 pt-2 pb-2.5 border-b border-line mb-1">
              {['Listing', 'Bookings', 'Nights', 'Revenue'].map((h, i) => (
                <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
              ))}
            </div>
            {[
              { name: 'Villa Palma — Sosúa',    bookings: 4, nights: 35, rev: '$11,200' },
              { name: 'Condo 4B — Puerto Plata', bookings: 1, nights: 4,  rev: '$1,800'  },
            ].map((r, i) => (
              <div key={i} className={`grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 py-3 items-center ${i < 1 ? 'border-b border-line-soft' : ''}`}>
                <div className="text-[13.5px] font-semibold text-ink">{r.name}</div>
                <div className="text-[13px] text-ink2">{r.bookings}</div>
                <div className="text-[13px] text-ink2">{r.nights}</div>
                <div className="text-[13px] font-bold text-brand">{r.rev}</div>
              </div>
            ))}
          </div>

        </Card>
      </div>
    ),

    profile: (
      <Card title={<><User size={14} /> Owner Profile</>}>
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-line-soft">
          <div
            className="w-14 h-14 rounded-full shrink-0 grid place-items-center text-white font-extrabold text-[22px]"
            style={{ background: TONE }}
          >
            M
          </div>
          <div>
            <div className="font-serif text-xl font-bold text-ink">María Rodríguez</div>
            <div className="text-[13px] text-dim">owner@demo.do</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Member since',      value: 'January 2025' },
            { label: 'Properties listed', value: '3 (2 active)' },
            { label: 'Total bookings',    value: '18'           },
            { label: 'Avg rating',        value: '4.8 ★'        },
          ].map((row, i) => (
            <div key={i} className="py-3 px-3.5 rounded-[10px] bg-[#F8F9FC] border border-line-soft">
              <div className="text-[11.5px] text-dim mb-0.75">{row.label}</div>
              <div className="text-sm font-bold text-ink">{row.value}</div>
            </div>
          ))}
        </div>
      </Card>
    ),
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-gold mb-1.5">
          Owner Portal · María Rodríguez
        </div>
        <h1 className="font-serif text-[22px] sm:text-[28px] font-extrabold text-ink tracking-[-0.02em]">
          {PAGE_TITLES[view] ?? PAGE_TITLES.home}
        </h1>
      </div>
      {sections[view] ?? sections.home}
    </div>
  )
}

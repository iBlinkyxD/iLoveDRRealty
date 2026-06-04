import React from 'react'
import {
  Heart, MessageCircle, CalendarDays, Star, MapPin, Search, Calculator,
  BookOpen, Scale, Globe, Banknote, User, type LucideIcon,
} from 'lucide-react'

const KPIS: { Icon: LucideIcon; label: string; value: string; delta: string; color: string; spark: string }[] = [
  { Icon: Heart,         label: 'Saved Homes',    value: '6',  delta: '↑ 2 this week',    color: '#e10f1f', spark: '0,38 15,32 25,34 35,24 50,20 60,12 80,8'  },
  { Icon: MessageCircle, label: 'Inquiries Sent', value: '3',  delta: '2 awaiting reply',  color: '#0b63ab', spark: '0,30 15,32 25,18 35,22 50,12 60,16 80,8'  },
  { Icon: CalendarDays,  label: 'Upcoming Trips', value: '1',  delta: 'Jun 12 · Cap Cana', color: '#f0a800', spark: '0,38 15,35 25,28 35,30 50,18 60,14 80,10' },
  { Icon: Star,          label: 'Wishlist Match',  value: '12', delta: '↑ new today',       color: '#1f7a3d', spark: '0,38 15,28 25,32 35,18 50,16 60,8 80,6'  },
]

const LISTINGS = [
  { id: 1, title: 'Oceanfront Villa with Infinity Pool', region: 'Cap Cana, La Altagracia',  price: 2450000, bd: 6, ba: 7, v: 0 },
  { id: 2, title: 'Penthouse Condo — Piantini',          region: 'Piantini, Santo Domingo',   price: 389000,  bd: 3, ba: 3, v: 1 },
  { id: 3, title: 'Tropical Golf Community Villa',        region: 'Punta Cana, La Altagracia', price: 875000,  bd: 5, ba: 5, v: 2 },
  { id: 4, title: 'Modern Beachfront Residence',          region: 'Las Terrenas, Samaná',      price: 1200000, bd: 4, ba: 4, v: 3 },
  { id: 7, title: 'Cliffside Designer Villa',             region: 'Sosúa, Puerto Plata',       price: 1650000, bd: 5, ba: 6, v: 0 },
  { id: 8, title: 'Garden Condo near Marina',             region: 'Cabarete, Puerto Plata',    price: 245000,  bd: 2, ba: 2, v: 3 },
]

const RESOURCES: { Icon: LucideIcon; title: string; time: string }[] = [
  { Icon: BookOpen, title: 'The Complete DR Buying Guide',  time: '12 min read' },
  { Icon: Scale,    title: 'Understanding DR Property Law', time: '8 min read'  },
  { Icon: Globe,    title: 'Residency & Visa Options 2026', time: '6 min read'  },
  { Icon: Banknote, title: 'Cost of Living Comparison',     time: '5 min read'  },
]

const GRADS = [
  'linear-gradient(135deg,#87ceeb,#0099cc 60%,#006994 100%)',
  'linear-gradient(135deg,#a8e6cf,#3cb371 60%,#2e8b57 100%)',
  'linear-gradient(135deg,#ffd700,#ff8c00 50%,#ff4500 100%)',
  'linear-gradient(135deg,#b8e4f9,#0099cc 60%,#004e89 100%)',
]

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`

const PILL: Record<string, string> = {
  active:  'bg-green-100 text-green-700',
  pending: 'bg-yellow-50 text-yellow-800',
  review:  'bg-sky-100 text-sky-700',
  sold:    'bg-gray-100 text-gray-500',
}

function SceneThumb({ v }: { v: number }) {
  return <div className="w-13 h-10 rounded-lg shrink-0" style={{ background: GRADS[v % GRADS.length] }} />
}

function StatusPill({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-[.06em] px-2 py-0.5 rounded-full whitespace-nowrap ${PILL[kind] ?? 'bg-gray-100 text-gray-500'}`}>
      {children}
    </span>
  )
}

function Card({ title, action, children, padded = true }: {
  title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; padded?: boolean
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-5 py-4.5 border-b border-line">
          <div className="text-sm font-bold text-ink flex items-center gap-1.5">{title}</div>
          {action}
        </div>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </div>
  )
}

function CardLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-xs font-semibold text-sea bg-transparent border-0 cursor-pointer">
      {children}
    </button>
  )
}

function KpiCard({ Icon, label, value, delta, color, spark }: {
  Icon: LucideIcon; label: string; value: string; delta: string; color: string; spark: string
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line p-5 relative overflow-hidden">
      <div className="mb-2.5" style={{ color }}>
        <Icon size={20} />
      </div>
      <div className="text-[11px] font-bold uppercase tracking-[.08em] text-dim mb-1">{label}</div>
      <div className="font-serif text-[28px] font-bold text-ink leading-none">{value}</div>
      <div className="text-xs font-semibold mt-1.5 text-green-600">{delta}</div>
      <svg viewBox="0 0 80 40" className="absolute right-0 bottom-0 w-25 h-12.5 opacity-[.18]">
        <polyline points={spark} stroke={color} strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

function ListingRow({ v, name, meta, price, status, last }: {
  v: number; name: string; meta: string; price: string; status: [string, string]; last?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 py-3 ${last ? '' : 'border-b border-line'}`}>
      <SceneThumb v={v} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink truncate">{name}</div>
        <div className="text-[11px] text-dim mt-0.5 flex items-center gap-1">
          <MapPin size={10} className="shrink-0" />{meta}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="text-[13px] font-bold text-ink whitespace-nowrap">{price}</div>
        <StatusPill kind={status[0]}>{status[1]}</StatusPill>
      </div>
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={i} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.07em] text-dim text-left border-b border-line">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={`px-5 py-3 text-[13px] text-ink ${i < rows.length - 1 ? 'border-b border-line' : ''}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const PAGE_TITLES: Record<string, string> = {
  home:       'Your search dashboard',
  saved:      'Saved Homes',
  searches:   'Saved Searches',
  inquiries:  'My Inquiries',
  bookings:   'Bookings',
  calculator: 'ROI Calculator',
  resources:  'Resources',
  profile:    'Profile',
}

export default function BuyerDash({ go, view = 'home' }: { go: (v: string) => void; view?: string }) {
  const section = view === 'home' ? 'home' : view

  const sections: Record<string, React.ReactNode> = {

    home: (
      <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {KPIS.map((k, i) => <KpiCard key={i} {...k} />)}
        </div>

        <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-[1fr_340px]">

          {/* Left column */}
          <div className="flex flex-col gap-5">

            <Card title={<><Heart size={14} />Saved Homes</>} action={<CardLink onClick={() => go('saved')}>View all →</CardLink>} padded={false}>
              <div className="px-3 sm:px-5">
                {LISTINGS.slice(0, 5).map((l, i) => (
                  <ListingRow key={l.id} v={l.v} name={l.title} meta={l.region} price={fmt(l.price)} status={['active', 'Saved']} last={i === 4} />
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
                  <StatusPill kind="review">{n}</StatusPill>
                </div>
              ))}
            </Card>

          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">

            <Card title={<><MessageCircle size={14} />My Inquiries</>} action={<CardLink onClick={() => go('inquiries')}>All inquiries →</CardLink>} padded={false}>
              <div className="px-5">
                {[
                  ['Oceanfront Villa', 'Awaiting reply 2d', 'pending'],
                  ['Penthouse — Piantini', 'Replied · Tour Jun 2', 'active'],
                  ['Golf Community Villa', 'Replied · 5d', 'active'],
                ].map(([name, note, st], i) => (
                  <div key={i} className={`flex items-center gap-3 py-3 ${i < 2 ? 'border-b border-line' : ''}`}>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-ink">{name}</div>
                      <div className="text-[11px] text-dim">{note}</div>
                    </div>
                    <StatusPill kind={st}>{st === 'pending' ? 'Pending' : 'Replied'}</StatusPill>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={<><CalendarDays size={14} />Upcoming Trip</>}>
              <div className="flex flex-col gap-2">
                <div className="font-serif text-xl font-bold text-ink">Villa Paraíso — Cap Cana</div>
                <div className="text-xs text-dim">Jun 12–18, 2026 · 6 nights · 2 guests</div>
                <div className="h-2 bg-line rounded-full overflow-hidden mt-2">
                  <div className="h-full w-full rounded-full" style={{ background: 'linear-gradient(90deg,#0b63ab,#f0a800)' }} />
                </div>
                <div className="flex justify-between text-xs text-dim mt-1">
                  <span>Paid in full</span>
                  <span className="font-bold text-ink">$8,676</span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </>
    ),

    saved: (
      <Card title={<><Heart size={14} />Saved Homes (6)</>} action={<CardLink>Browse more →</CardLink>} padded={false}>
        <div className="px-3 sm:px-5">
          {LISTINGS.map((l, i) => (
            <ListingRow key={l.id} v={l.v} name={l.title} meta={`${l.region} · ${l.bd}bd · ${l.ba}ba`} price={fmt(l.price)} status={['active', 'Saved']} last={i === LISTINGS.length - 1} />
          ))}
        </div>
      </Card>
    ),

    searches: (
      <Card title={<><Search size={14} />Saved Searches</>} action={<CardLink>+ New search</CardLink>}>
        {[
          ['Punta Cana · 2BR+ · under $300K', 'Daily email', '3 new'],
          ['Beachfront condos · Las Terrenas', 'Weekly', '1 new'],
          ['Commercial · Santo Domingo', 'Paused', '—'],
        ].map(([s, freq, n], i) => (
          <div key={i} className={`flex items-center gap-3 py-3.5 ${i < 2 ? 'border-b border-line' : ''}`}>
            <div className="w-9 h-9 rounded-full shrink-0 grid place-items-center text-white" style={{ background: 'linear-gradient(135deg,#e10f1f,#a50f28)' }}>
              <Search size={14} />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-ink">{s}</div>
              <div className="text-[11.5px] text-dim">Alerts: {freq}</div>
            </div>
            {n !== '—' ? <StatusPill kind="review">{n}</StatusPill> : <StatusPill kind="sold">Paused</StatusPill>}
          </div>
        ))}
      </Card>
    ),

    inquiries: (
      <Card title={<><MessageCircle size={14} />My Inquiries</>} padded={false}>
        <div className="overflow-x-auto">
          <Table
            head={['Property', 'Sent', 'Status']}
            rows={[
              ['Oceanfront Villa with Infinity Pool', '2d ago', <StatusPill kind="pending">Awaiting reply</StatusPill>],
              ['Penthouse Condo — Piantini',           '5d ago', <StatusPill kind="active">Replied</StatusPill>],
              ['Tropical Golf Community Villa',        '1w ago', <StatusPill kind="active">Replied</StatusPill>],
            ]}
          />
        </div>
      </Card>
    ),

    bookings: (
      <Card title={<><CalendarDays size={14} />Bookings</>}>
        <div className="flex items-center gap-3.5 py-2 border-b border-line">
          <SceneThumb v={0} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-ink">Villa Paraíso — Beachfront Estate</div>
            <div className="text-[11.5px] text-dim">Jun 12–18, 2026 · 6 nights · 2 guests</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="font-serif font-bold text-ink">$8,676</div>
            <StatusPill kind="active">Confirmed</StatusPill>
          </div>
        </div>
        <div className="py-4 text-[13px] text-dim text-center">
          No other upcoming trips.{' '}
          <button className="bg-transparent border-0 text-sea font-bold cursor-pointer">
            Find a rental →
          </button>
        </div>
      </Card>
    ),

    calculator: (
      <Card title={<><Calculator size={14} />ROI Calculator</>}>
        <div className="py-6 text-center">
          <div className="flex justify-center mb-3 text-coral">
            <Calculator size={40} />
          </div>
          <p className="text-sm text-ink2 mb-4">Use the full ROI Calculator on the main site to model any listing.</p>
          <a
            href="https://ilovedrrealty.com/calculator"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-[13.5px] font-bold text-white bg-coral rounded-full px-6 py-2.5 no-underline"
          >
            Open ROI Calculator →
          </a>
        </div>
      </Card>
    ),

    resources: (
      <Card title={<><BookOpen size={14} />Resources</>}>
        {RESOURCES.map(({ Icon, title, time }, i) => (
          <div key={i} className={`flex items-center gap-3.5 py-3.5 ${i < RESOURCES.length - 1 ? 'border-b border-line' : ''}`}>
            <div className="text-ink2 shrink-0">
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-ink">{title}</div>
              <div className="text-[11.5px] text-dim">{time}</div>
            </div>
            <CardLink>Read →</CardLink>
          </div>
        ))}
      </Card>
    ),

    profile: (
      <Card title={<><User size={14} />Profile</>}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full grid place-items-center text-white text-xl font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg,#e10f1f,#a50f28)' }}
          >
            DF
          </div>
          <div>
            <div className="font-serif text-[18px] font-bold text-ink">Daniela Fernández</div>
            <div className="text-[12.5px] text-dim">Buyer · Punta Cana area</div>
          </div>
        </div>
        {[
          ['Full name',          'Daniela Fernández'],
          ['Email',              'daniela@demo.do'],
          ['Phone',              '+1 (829) 555-0101'],
          ['Region of interest', 'Punta Cana, Cap Cana'],
        ].map(([label, val], i) => (
          <div key={i} className="flex justify-between py-3 border-b border-line text-[13px]">
            <span className="text-dim font-semibold">{label}</span>
            <span className="text-ink font-medium">{val}</span>
          </div>
        ))}
      </Card>
    ),
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-coral mb-1.5">
          Buyer Portal · Daniela Fernández
        </div>
        <h1 className="font-serif text-[22px] sm:text-[26px] font-extrabold text-ink tracking-[-0.02em]">
          {PAGE_TITLES[section] ?? 'Dashboard'}
        </h1>
      </div>
      {sections[section] ?? sections.home}
    </div>
  )
}

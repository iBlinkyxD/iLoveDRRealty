import React, { useState } from 'react'
import {
  Clock, Users, Home, DollarSign,
  CheckCircle2, UserPlus, XCircle, MessageCircle, Bell,
  AlertTriangle, MapPin, TrendingUp, Eye, Mail,
  UserCheck, UserX, Globe, Settings, Shield,
  Search, ToggleLeft, ToggleRight, Save,
  type LucideIcon,
} from 'lucide-react'

const TONE = '#0d9488'

const APPROVALS: { type: 'Listing' | 'User'; title: string; submittedBy: string; time: string; flag?: string }[] = [
  { type: 'Listing', title: 'Luxury Beachfront Villa — Las Terrenas',    submittedBy: 'Maria Cruz (Owner)',       time: '1h ago'    },
  { type: 'User',    title: 'New Realtor: Carlos Reyes',                 submittedBy: 'carlos@reyes.do',          time: '3h ago',   flag: 'License pending' },
  { type: 'Listing', title: 'Commercial Space — Zona Colonial',          submittedBy: 'Juan Peña (Realtor)',      time: '5h ago'    },
  { type: 'User',    title: 'New Owner: Isabelle Fontaine',              submittedBy: 'i.fontaine@email.com',     time: 'Yesterday' },
  { type: 'Listing', title: 'Penthouse — Naco, Santo Domingo',           submittedBy: 'DRLuxury Group (Realtor)', time: '2d ago'    },
  { type: 'Listing', title: 'Studio Suite — Cabarete Beach',             submittedBy: 'Pedro Alonso (Owner)',     time: '2d ago'    },
  { type: 'User',    title: 'New Realtor: Sofia Martínez',               submittedBy: 's.martinez@realty.do',     time: '3d ago',   flag: 'Duplicate email' },
  { type: 'Listing', title: 'Hillside Villa — Jarabacoa',                submittedBy: 'Carlos Reyes (Realtor)',   time: '3d ago'    },
]

const KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Clock,      label: 'Pending Approvals', value: '8',     sub: '5 listings · 3 users',  hl: true },
  { Icon: Users,      label: 'New Users Today',   value: '34',    sub: '+18% vs yesterday'               },
  { Icon: Home,       label: 'Active Listings',   value: '4,847', sub: '124 added this week'             },
  { Icon: DollarSign, label: 'Platform Revenue',  value: '$124K', sub: 'May 2026 · +9% MoM'             },
]

const ACTIVITY: { Icon: LucideIcon; text: string; time: string; tone: string }[] = [
  { Icon: CheckCircle2,  text: 'Listing approved: Golf Villa — Punta Cana',  time: '12m ago', tone: '#1f7a3d' },
  { Icon: UserPlus,      text: 'New user registered: tom.b@example.com',      time: '34m ago', tone: '#0b63ab' },
  { Icon: XCircle,       text: 'Listing rejected: Incomplete floor plan',      time: '1h ago',  tone: '#e10f1f' },
  { Icon: MessageCircle, text: 'Contact form: Inquiry from buyer in Miami',   time: '2h ago',  tone: '#f0a800' },
  { Icon: CheckCircle2,  text: 'Realtor verified: Ana Peña',                  time: '3h ago',  tone: '#1f7a3d' },
  { Icon: Bell,          text: 'Flag resolved: Duplicate listing removed',    time: '5h ago',  tone: '#7884a0' },
]

const BAR_DATA = [
  { month: 'Dec', users: 640  },
  { month: 'Jan', users: 820  },
  { month: 'Feb', users: 970  },
  { month: 'Mar', users: 1140 },
  { month: 'Apr', users: 1380 },
  { month: 'May', users: 1620 },
]
const MAX_BAR = Math.max(...BAR_DATA.map(d => d.users))

const USERS: { name: string; email: string; role: string; joined: string; status: 'active' | 'pending' | 'suspended' }[] = [
  { name: 'Carlos Reyes',      email: 'carlos@reyes.do',      role: 'Realtor',  joined: 'May 28', status: 'pending'   },
  { name: 'Isabelle Fontaine', email: 'i.fontaine@email.com', role: 'Owner',    joined: 'May 27', status: 'pending'   },
  { name: 'Ana Peña',          email: 'ana.p@broker.do',      role: 'Realtor',  joined: 'May 20', status: 'active'    },
  { name: 'Tom Burrell',       email: 'tom.b@example.com',    role: 'Buyer',    joined: 'May 19', status: 'active'    },
  { name: 'Maria Cruz',        email: 'maria@owner.do',       role: 'Owner',    joined: 'May 15', status: 'active'    },
  { name: 'Luis Guerrero',     email: 'luis.g@invest.do',     role: 'Investor', joined: 'May 10', status: 'active'    },
  { name: 'Sandra Vega',       email: 's.vega@realty.do',     role: 'Realtor',  joined: 'May 8',  status: 'suspended' },
  { name: 'Pedro Alonso',      email: 'p.alonso@owner.do',    role: 'Owner',    joined: 'May 3',  status: 'active'    },
]

const ALL_LISTINGS: { title: string; region: string; price: number; type: string; owner: string; status: 'pending' | 'active' | 'rejected' }[] = [
  { title: 'Luxury Beachfront Villa — Las Terrenas', region: 'Las Terrenas, Samaná',       price: 1850000, type: 'Villa',      owner: 'Maria Cruz',    status: 'pending'  },
  { title: 'Commercial Space — Zona Colonial',       region: 'Santo Domingo, D.N.',         price: 420000,  type: 'Commercial', owner: 'Juan Peña',     status: 'pending'  },
  { title: 'Penthouse — Naco, Santo Domingo',        region: 'Naco, Santo Domingo',         price: 780000,  type: 'Condo',      owner: 'DRLuxury Grp',  status: 'pending'  },
  { title: 'Golf Villa — Punta Cana',                region: 'Punta Cana, La Altagracia',   price: 975000,  type: 'Villa',      owner: 'Ana Peña',      status: 'active'   },
  { title: 'Oceanfront Estate — Cap Cana',           region: 'Cap Cana, La Altagracia',     price: 2450000, type: 'Villa',      owner: 'Luis Guerrero', status: 'active'   },
  { title: 'Hillside Villa — Jarabacoa',             region: 'Jarabacoa, La Vega',          price: 340000,  type: 'Villa',      owner: 'Pedro Alonso',  status: 'active'   },
  { title: 'Studio Suite — Cabarete',                region: 'Cabarete, Puerto Plata',      price: 145000,  type: 'Apartment',  owner: 'Sandra Vega',   status: 'rejected' },
]

const REVENUE_DATA = [
  { month: 'Dec', rev: 68 }, { month: 'Jan', rev: 79 }, { month: 'Feb', rev: 88 },
  { month: 'Mar', rev: 102 }, { month: 'Apr', rev: 115 }, { month: 'May', rev: 124 },
]
const MAX_REV = Math.max(...REVENUE_DATA.map(d => d.rev))

const REGIONS = [
  { name: 'Punta Cana',    count: 1842, pct: 38 },
  { name: 'Santo Domingo', count: 1214, pct: 25 },
  { name: 'Las Terrenas',  count: 728,  pct: 15 },
  { name: 'Cap Cana',      count: 534,  pct: 11 },
  { name: 'Puerto Plata',  count: 338,  pct: 7  },
  { name: 'Other',         count: 191,  pct: 4  },
]

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`

const ROLE_COLOR: Record<string, string> = {
  Buyer: '#e10f1f', Investor: '#0b63ab', Owner: '#f0a800', Realtor: '#1f7a3d', Admin: '#0d9488',
}
const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: '#1f7a3d18', color: '#1f7a3d', label: 'Active'    },
  pending:   { bg: '#f0a80018', color: '#c07800', label: 'Pending'   },
  rejected:  { bg: '#e10f1f18', color: '#e10f1f', label: 'Rejected'  },
  suspended: { bg: '#7884a018', color: '#556070', label: 'Suspended' },
}

const PAGE_TITLES: Record<string, string> = {
  home:      'Platform overview',
  approvals: 'Approval queue',
  users:     'User management',
  listings:  'Listings',
  analytics: 'Analytics',
  settings:  'Settings',
}
const PAGE_SUBS: Record<string, string> = {
  home:      '8 items pending approval · Last sync 4m ago',
  approvals: '8 items pending review',
  users:     '1,284 total users · 2 pending verification',
  listings:  '4,847 active listings · 3 pending review',
  analytics: 'Platform metrics · May 2026',
  settings:  'Platform configuration',
}

function FilterPills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5">
      {options.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer capitalize"
          style={{
            border: `1px solid ${value === f ? TONE : '#e4ddcf'}`,
            background: value === f ? TONE : 'transparent',
            color: value === f ? '#fff' : '#33425f',
          }}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function ApprovalRow({ item, last }: { item: typeof APPROVALS[0]; last?: boolean }) {
  return (
    <div className={`px-4 sm:px-5.5 py-3.5${last ? '' : ' border-b border-line-soft'}`}>
      <div className="flex items-start gap-3">
        <span
          className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full shrink-0 mt-0.5"
          style={{
            color: item.type === 'Listing' ? '#0b63ab' : '#f0a800',
            background: `${item.type === 'Listing' ? '#0b63ab' : '#f0a800'}18`,
          }}
        >
          {item.type}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-ink leading-snug">{item.title}</div>
          <div className="text-xs text-dim mt-0.5">{item.submittedBy} · {item.time}</div>
          {item.flag && (
            <div className="flex items-center gap-1 text-[11.5px] mt-1" style={{ color: '#f0a800' }}>
              <AlertTriangle size={11} />
              {item.flag}
            </div>
          )}
          <div className="flex gap-2 mt-2.5 sm:hidden">
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer" style={{ background: '#1f7a3d', color: '#fff' }}>Approve</button>
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer bg-paper border border-line text-ink2">Review</button>
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer" style={{ background: '#e10f1f18', color: '#e10f1f' }}>Reject</button>
          </div>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer" style={{ background: '#1f7a3d', color: '#fff' }}>Approve</button>
          <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer bg-paper border border-line text-ink2">Review</button>
          <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer" style={{ background: '#e10f1f18', color: '#e10f1f' }}>Reject</button>
        </div>
      </div>
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="border-0 bg-transparent cursor-pointer p-0 flex items-center" style={{ color: on ? TONE : '#c0b9ac' }}>
      {on ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  )
}

export default function AdminDash({ go, view = 'home' }: { go: (v: string) => void; view?: string }) {
  const [filter, setFilter] = useState<'All' | 'Listing' | 'User'>('All')
  const filtered = APPROVALS.filter(a => filter === 'All' || a.type === filter)

  const [listingFilter, setListingFilter] = useState<'All' | 'pending' | 'active' | 'rejected'>('All')
  const filteredListings = ALL_LISTINGS.filter(l => listingFilter === 'All' || l.status === listingFilter)

  const [userSearch, setUserSearch] = useState('')
  const filteredUsers = USERS.filter(u =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const [settings, setSettings] = useState({
    newRegistrations: true,
    autoApprove: false,
    maintenanceMode: false,
    approvalAlerts: true,
    dailyDigest: true,
    require2FA: false,
    publicListings: true,
  })
  const toggleSetting = (k: keyof typeof settings) => setSettings(s => ({ ...s, [k]: !s[k] }))

  const sections: Record<string, React.ReactNode> = {

    home: (
      <>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-7">
          {KPIS.map(({ Icon, label, value, sub, hl }, i) => (
            <div
              key={i}
              className={hl ? 'rounded-xl py-4.5 px-5' : 'bg-paper border border-line rounded-xl py-4.5 px-5'}
              style={hl ? { background: 'linear-gradient(135deg, #e10f1f 0%, #b80a17 100%)' } : undefined}
            >
              <Icon size={20} className="mb-2" color={hl ? 'rgba(255,255,255,.7)' : '#7884a0'} />
              <div className={`font-serif text-2xl font-bold leading-none ${hl ? 'text-white' : 'text-ink'}`}>{value}</div>
              <div className={`text-[12.5px] font-semibold mt-1.5 ${hl ? 'text-white/80' : 'text-ink2'}`}>{label}</div>
              <div className={`text-[11px] mt-0.5 ${hl ? 'text-white/55' : 'text-dim'}`}>{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">

          {/* Approval queue */}
          <div className="bg-paper border border-line rounded-2xl overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-4 border-b border-line">
              <div className="font-serif text-[17px] font-bold text-ink">Approval queue</div>
              <div className="flex items-center gap-3">
                <FilterPills options={['All', 'Listing', 'User']} value={filter} onChange={v => setFilter(v as typeof filter)} />
                <button onClick={() => go('approvals')} className="text-xs font-semibold bg-transparent border-0 cursor-pointer" style={{ color: TONE }}>
                  View all →
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              {filtered.slice(0, 5).map((item, i) => (
                <ApprovalRow key={i} item={item} last={i === Math.min(4, filtered.length - 1)} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">

            {/* User growth chart */}
            <div className="bg-paper border border-line rounded-2xl p-5.5">
              <div className="font-serif text-[17px] font-bold text-ink mb-1">User growth</div>
              <div className="text-xs text-dim mb-4">New registrations per month</div>
              <div className="flex items-end gap-2 h-25">
                {BAR_DATA.map((d, i) => {
                  const h = (d.users / MAX_BAR) * 80
                  const isLast = i === BAR_DATA.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`text-[10px] ${isLast ? 'font-bold text-ink' : 'text-dim'}`}>
                        {d.users >= 1000 ? (d.users / 1000).toFixed(1) + 'K' : d.users}
                      </div>
                      <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? '#e10f1f' : '#0b63ab60' }} />
                      <div className="text-[10px] text-dim">{d.month}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-paper border border-line rounded-2xl p-5.5 flex-1">
              <div className="font-serif text-[17px] font-bold text-ink mb-4">Recent activity</div>
              <div className="flex flex-col gap-2.5">
                {ACTIVITY.map(({ Icon, text, time, tone }, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Icon size={15} className="shrink-0 mt-0.5" color={tone} />
                    <div className="flex-1">
                      <div className="text-[12.5px] text-ink leading-snug">{text}</div>
                      <div className="text-[11px] text-dim mt-0.5">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </>
    ),

    approvals: (
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-line">
          {[
            { label: 'Total pending', value: '8', color: '#c07800' },
            { label: 'Listings',      value: '5', color: '#0b63ab' },
            { label: 'Users',         value: '3', color: '#f0a800' },
            { label: 'Flagged',       value: '2', color: '#e10f1f' },
          ].map(({ label, value, color }, i) => (
            <div key={i} className={`px-4 sm:px-5.5 py-4 border-line ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''} ${i === 1 || i === 2 ? 'sm:border-r' : ''}`}>
              <div className="font-serif text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-[11.5px] text-dim mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter + actions bar */}
        <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-3.5 border-b border-line bg-line-soft">
          <FilterPills options={['All', 'Listing', 'User']} value={filter} onChange={v => setFilter(v as typeof filter)} />
          <div className="flex gap-2">
            <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer" style={{ background: '#1f7a3d', color: '#fff' }}>
              Approve all
            </button>
            <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer bg-paper border border-line text-ink2">
              Export
            </button>
          </div>
        </div>

        {/* All rows */}
        <div className="flex flex-col">
          {filtered.map((item, i) => (
            <ApprovalRow key={i} item={item} last={i === filtered.length - 1} />
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-dim">No {filter.toLowerCase()} items pending.</div>
          )}
        </div>
      </div>
    ),

    users: (
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-4 border-b border-line">
          <div className="font-serif text-[17px] font-bold text-ink">All users</div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-white">
              <Search size={13} className="text-dim" />
              <input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search name or email…"
                className="text-xs border-0 outline-none bg-transparent text-ink placeholder:text-dim w-36 sm:w-44"
              />
            </div>
            <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer text-white" style={{ background: TONE }}>
              + Invite user
            </button>
          </div>
        </div>

        {/* Mobile card rows */}
        <div className="sm:hidden divide-y divide-line">
          {filteredUsers.map((u, i) => {
            const st = STATUS_STYLE[u.status]
            const rc = ROLE_COLOR[u.role] ?? '#7884a0'
            return (
              <div key={i} className="px-4 py-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: rc }}>
                      {u.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink">{u.name}</div>
                      <div className="text-[11px] text-dim truncate">{u.email}</div>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full shrink-0" style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: rc, background: `${rc}18` }}>
                    {u.role}
                  </span>
                  <div className="flex gap-2">
                    {u.status === 'pending' && (
                      <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer flex items-center gap-1" style={{ background: '#1f7a3d', color: '#fff' }}>
                        <UserCheck size={11} /> Verify
                      </button>
                    )}
                    {u.status === 'suspended' ? (
                      <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                        <UserCheck size={11} /> Restore
                      </button>
                    ) : (
                      <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                        <Eye size={11} /> View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr] px-5.5 py-2.5 border-b border-line bg-line-soft">
            {['User', 'Role', 'Joined', 'Status', 'Actions'].map((h, i) => (
              <div key={i} className="text-[11px] font-bold uppercase tracking-[.07em] text-dim">{h}</div>
            ))}
          </div>
          {filteredUsers.map((u, i) => {
            const st = STATUS_STYLE[u.status]
            const rc = ROLE_COLOR[u.role] ?? '#7884a0'
            return (
              <div key={i} className={`grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr] items-center px-5.5 py-3.5 ${i < filteredUsers.length - 1 ? 'border-b border-line-soft' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: rc }}>
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-ink">{u.name}</div>
                    <div className="text-[11px] text-dim flex items-center gap-1"><Mail size={9} />{u.email}</div>
                  </div>
                </div>
                <div>
                  <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: rc, background: `${rc}18` }}>
                    {u.role}
                  </span>
                </div>
                <div className="text-[12.5px] text-ink2">{u.joined}</div>
                <div>
                  <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
                </div>
                <div className="flex gap-2">
                  {u.status === 'pending' && (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer flex items-center gap-1" style={{ background: '#1f7a3d', color: '#fff' }}>
                      <UserCheck size={11} /> Verify
                    </button>
                  )}
                  {u.status === 'suspended' ? (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                      <UserCheck size={11} /> Restore
                    </button>
                  ) : (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                      <Eye size={11} /> View
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-10 text-center text-sm text-dim">No users match your search.</div>
        )}
      </div>
    ),

    listings: (
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-4 border-b border-line">
          <div className="font-serif text-[17px] font-bold text-ink">All listings</div>
          <FilterPills
            options={['All', 'pending', 'active', 'rejected']}
            value={listingFilter}
            onChange={v => setListingFilter(v as typeof listingFilter)}
          />
        </div>

        {/* Mobile card rows */}
        <div className="sm:hidden divide-y divide-line">
          {filteredListings.map((l, i) => {
            const st = STATUS_STYLE[l.status]
            return (
              <div key={i} className="px-4 py-3.5 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink leading-snug">{l.title}</div>
                    <div className="text-[11px] text-dim mt-0.5">{l.owner}</div>
                  </div>
                  <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full shrink-0" style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
                </div>
                <div className="text-xs text-dim flex items-center gap-1">
                  <MapPin size={10} className="shrink-0" />{l.region.split(',')[0]} · {l.type} · {fmt(l.price)}
                </div>
                <div className="flex gap-2 mt-0.5">
                  {l.status === 'pending' && (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer" style={{ background: '#1f7a3d', color: '#fff' }}>Approve</button>
                  )}
                  <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                    <Eye size={11} /> View
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr_1fr] px-5.5 py-2.5 border-b border-line bg-line-soft">
            {['Listing', 'Region', 'Type', 'Price', 'Status', 'Actions'].map((h, i) => (
              <div key={i} className="text-[11px] font-bold uppercase tracking-[.07em] text-dim">{h}</div>
            ))}
          </div>
          {filteredListings.map((l, i) => {
            const st = STATUS_STYLE[l.status]
            return (
              <div key={i} className={`grid grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr_1fr] items-center px-5.5 py-3.5 ${i < filteredListings.length - 1 ? 'border-b border-line-soft' : ''}`}>
                <div>
                  <div className="text-[13.5px] font-semibold text-ink leading-snug">{l.title}</div>
                  <div className="text-[11px] text-dim mt-0.5">{l.owner}</div>
                </div>
                <div className="text-xs text-ink2 flex items-center gap-1"><MapPin size={10} className="shrink-0 text-dim" />{l.region.split(',')[0]}</div>
                <div className="text-xs text-ink2">{l.type}</div>
                <div className="text-[13px] font-bold text-ink">{fmt(l.price)}</div>
                <div>
                  <span className="text-[11.5px] font-bold px-2.5 py-0.75 rounded-full" style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {l.status === 'pending' && (
                    <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer" style={{ background: '#1f7a3d', color: '#fff' }}>
                      Approve
                    </button>
                  )}
                  <button className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-line cursor-pointer flex items-center gap-1 text-ink2">
                    <Eye size={11} /> View
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="py-10 text-center text-sm text-dim">No listings match this filter.</div>
        )}
      </div>
    ),

    analytics: (
      <>
        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
          {[
            { Icon: Users,      label: 'Total Users',       value: '1,284', delta: '+34 today',     color: '#0b63ab' },
            { Icon: Home,       label: 'Active Listings',   value: '4,847', delta: '+124 this week', color: '#1f7a3d' },
            { Icon: DollarSign, label: 'Monthly Revenue',   value: '$124K', delta: '+9% vs Apr',     color: TONE      },
            { Icon: TrendingUp, label: 'Avg Days on Market', value: '42',   delta: '−3 vs Apr',      color: '#f0a800' },
          ].map(({ Icon, label, value, delta, color }, i) => (
            <div key={i} className="bg-paper border border-line rounded-xl py-4.5 px-5">
              <Icon size={18} className="mb-2" color={color} />
              <div className="font-serif text-2xl font-bold text-ink leading-none">{value}</div>
              <div className="text-[12.5px] font-semibold mt-1.5 text-ink2">{label}</div>
              <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color }}>{delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">

          {/* Left: user growth + revenue */}
          <div className="flex flex-col gap-5">

            <div className="bg-paper border border-line rounded-2xl p-5.5">
              <div className="font-serif text-[17px] font-bold text-ink mb-0.5">User growth</div>
              <div className="text-xs text-dim mb-4">New registrations per month</div>
              <div className="flex items-end gap-2 h-28">
                {BAR_DATA.map((d, i) => {
                  const h = (d.users / MAX_BAR) * 96
                  const isLast = i === BAR_DATA.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`text-[10px] ${isLast ? 'font-bold text-ink' : 'text-dim'}`}>
                        {d.users >= 1000 ? (d.users / 1000).toFixed(1) + 'K' : d.users}
                      </div>
                      <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? TONE : `${TONE}50` }} />
                      <div className="text-[10px] text-dim">{d.month}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-paper border border-line rounded-2xl p-5.5">
              <div className="font-serif text-[17px] font-bold text-ink mb-0.5">Revenue trend</div>
              <div className="text-xs text-dim mb-4">Monthly platform revenue (USD thousands)</div>
              <div className="relative h-28">
                <svg viewBox="0 0 300 96" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TONE} stopOpacity=".2" />
                      <stop offset="100%" stopColor={TONE} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <polyline
                    points={REVENUE_DATA.map((d, i) => {
                      const x = (i / (REVENUE_DATA.length - 1)) * 280 + 10
                      const y = 86 - (d.rev / MAX_REV) * 76
                      return `${x},${y}`
                    }).join(' ') + ` 290,86 10,86`}
                    fill="url(#revGrad)"
                    stroke="none"
                  />
                  {/* Line */}
                  <polyline
                    points={REVENUE_DATA.map((d, i) => {
                      const x = (i / (REVENUE_DATA.length - 1)) * 280 + 10
                      const y = 86 - (d.rev / MAX_REV) * 76
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke={TONE}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {REVENUE_DATA.map((d, i) => {
                    const x = (i / (REVENUE_DATA.length - 1)) * 280 + 10
                    const y = 86 - (d.rev / MAX_REV) * 76
                    const isLast = i === REVENUE_DATA.length - 1
                    return <circle key={i} cx={x} cy={y} r={isLast ? 4 : 2.5} fill={isLast ? TONE : '#fff'} stroke={TONE} strokeWidth="1.5" />
                  })}
                </svg>
                {/* Month labels */}
                <div className="flex justify-between mt-1 px-2.5">
                  {REVENUE_DATA.map(d => (
                    <div key={d.month} className="text-[10px] text-dim">{d.month}</div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right: listings by region */}
          <div className="bg-paper border border-line rounded-2xl p-5.5">
            <div className="font-serif text-[17px] font-bold text-ink mb-0.5">Listings by region</div>
            <div className="text-xs text-dim mb-5">Active listings distribution</div>
            <div className="flex flex-col gap-3.5">
              {REGIONS.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[12.5px] mb-1.5">
                    <span className="font-semibold text-ink flex items-center gap-1.5"><Globe size={11} className="text-dim" />{r.name}</span>
                    <span className="text-dim font-medium">{r.count.toLocaleString()} · {r.pct}%</span>
                  </div>
                  <div className="h-2 bg-line rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.pct}%`, background: i === 0 ? TONE : `${TONE}${Math.round(80 - i * 12).toString(16)}` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="mt-5 pt-4 border-t border-line grid grid-cols-2 gap-3">
              {[
                { label: 'Avg price',  value: '$487K' },
                { label: 'For rent',   value: '38%'   },
                { label: 'For sale',   value: '62%'   },
                { label: 'New (7d)',   value: '+124'  },
              ].map(({ label, value }, i) => (
                <div key={i} className="text-center py-2 bg-line-soft rounded-lg">
                  <div className="font-serif text-[18px] font-bold text-ink">{value}</div>
                  <div className="text-[11px] text-dim">{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </>
    ),

    settings: (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Platform */}
        <div className="bg-paper border border-line rounded-2xl overflow-hidden">
          <div className="px-5.5 py-4 border-b border-line flex items-center gap-2">
            <Settings size={15} className="text-ink2" />
            <div className="font-serif text-[16px] font-bold text-ink">Platform</div>
          </div>
          <div className="flex flex-col">
            {[
              { key: 'newRegistrations' as const, label: 'Allow new registrations',    sub: 'New users can sign up on the platform'      },
              { key: 'autoApprove'      as const, label: 'Auto-approve listings',       sub: 'Skip manual review for verified realtors'   },
              { key: 'maintenanceMode'  as const, label: 'Maintenance mode',            sub: 'Disable public access for all visitors'     },
              { key: 'publicListings'   as const, label: 'Public listing visibility',   sub: 'Listings visible without login'             },
            ].map(({ key, label, sub }, i) => (
              <div key={i} className={`flex items-center justify-between px-5.5 py-4 ${i < 3 ? 'border-b border-line-soft' : ''}`}>
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{label}</div>
                  <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>
                </div>
                <Toggle on={settings[key]} onToggle={() => toggleSetting(key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-paper border border-line rounded-2xl overflow-hidden">
          <div className="px-5.5 py-4 border-b border-line flex items-center gap-2">
            <Bell size={15} className="text-ink2" />
            <div className="font-serif text-[16px] font-bold text-ink">Notifications</div>
          </div>
          <div className="flex flex-col">
            {[
              { key: 'approvalAlerts' as const, label: 'Approval alerts',   sub: 'Email when new items need review'     },
              { key: 'dailyDigest'    as const, label: 'Daily digest',       sub: 'Summary email each morning at 8am'   },
            ].map(({ key, label, sub }, i) => (
              <div key={i} className={`flex items-center justify-between px-5.5 py-4 ${i === 0 ? 'border-b border-line-soft' : ''}`}>
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{label}</div>
                  <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>
                </div>
                <Toggle on={settings[key]} onToggle={() => toggleSetting(key)} />
              </div>
            ))}
          </div>

          {/* Security section in same column */}
          <div className="px-5.5 py-4 border-t border-b border-line flex items-center gap-2 mt-2">
            <Shield size={15} className="text-ink2" />
            <div className="font-serif text-[16px] font-bold text-ink">Security</div>
          </div>
          <div className="flex flex-col">
            {[
              { key: 'require2FA' as const, label: 'Require 2FA for admins', sub: 'Enforce two-factor for all admin accounts' },
            ].map(({ key, label, sub }, i) => (
              <div key={i} className="flex items-center justify-between px-5.5 py-4">
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{label}</div>
                  <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>
                </div>
                <Toggle on={settings[key]} onToggle={() => toggleSetting(key)} />
              </div>
            ))}
          </div>

          {/* Admin account info */}
          <div className="px-5.5 py-4 border-t border-line">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full grid place-items-center text-white text-sm font-bold shrink-0" style={{ background: TONE }}>A</div>
              <div>
                <div className="text-[13.5px] font-semibold text-ink">Demo Admin</div>
                <div className="text-[11.5px] text-dim">admin@demo.do</div>
              </div>
            </div>
            <button className="w-full py-2 rounded-lg border-0 cursor-pointer text-[13px] font-bold text-white flex items-center justify-center gap-2" style={{ background: TONE }}>
              <Save size={13} /> Save changes
            </button>
          </div>
        </div>

      </div>
    ),

  }

  return (
    <div>
      <div className="mb-7">
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-coral mb-1.5">Admin</div>
        <h1 className="font-serif text-[22px] sm:text-[28px] font-extrabold text-ink tracking-[-0.02em] mb-1">
          {PAGE_TITLES[view] ?? 'Platform overview'}
        </h1>
        <p className="text-sm text-ink2">{PAGE_SUBS[view] ?? ''}</p>
      </div>
      {sections[view] ?? sections.home}
    </div>
  )
}

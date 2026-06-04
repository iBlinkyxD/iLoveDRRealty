import { useState, type ReactNode } from 'react'
import {
  Users, Building2, CheckCircle2, ClipboardList, Home,
  Shuffle, Calendar, Banknote, User,
  type LucideIcon,
} from 'lucide-react'

const TONE = '#1f7a3d'

const KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Users,         label: 'Active Clients',   value: '18', sub: '+4 this month'        },
  { Icon: Building2,     label: 'Active Listings',  value: '24', sub: '4 pending review',    hl: true },
  { Icon: CheckCircle2,  label: 'Pending Closings', value: '3',  sub: 'Est. $4.1M total'     },
  { Icon: ClipboardList, label: 'Leads This Month', value: '47', sub: '+22% vs prior month'  },
]

const LISTINGS = [
  { name: 'Oceanfront Villa — Cap Cana',   status: 'Active', leads: 8, views: 1420, price: '$2.45M' },
  { name: 'Golf Villa — Punta Cana',       status: 'Active', leads: 5, views: 892,  price: '$875K'  },
  { name: 'Garden Condo — Cabarete',       status: 'Active', leads: 3, views: 554,  price: '$245K'  },
  { name: 'Beachfront Residence — Samaná', status: 'Review', leads: 0, views: 0,    price: '$1.2M'  },
  { name: 'Penthouse — Piantini',          status: 'Active', leads: 6, views: 710,  price: '$389K'  },
  { name: 'Hillside Villa — Jarabacoa',    status: 'Active', leads: 2, views: 320,  price: '$320K'  },
]

const LEADS = [
  { name: 'James Wilson',   region: 'Cap Cana',     budget: '$2-3M',     type: 'Villa', status: 'Hot',  time: '1h ago'    },
  { name: 'Marie Dubois',   region: 'Las Terrenas', budget: '$600-900K', type: 'Condo', status: 'Warm', time: '4h ago'    },
  { name: 'David Park',     region: 'Punta Cana',   budget: '$800K-1M',  type: 'Villa', status: 'Hot',  time: 'Yesterday' },
  { name: 'Lucia Ferreira', region: 'Sto. Domingo', budget: '$300-500K', type: 'Apt',   status: 'Cold', time: '2d ago'    },
  { name: 'Tom Bradley',    region: 'Cabarete',     budget: '$200-300K', type: 'Condo', status: 'Warm', time: '3d ago'    },
  { name: 'Ana González',   region: 'Sto. Domingo', budget: '$500-700K', type: 'Comm.', status: 'Cold', time: '4d ago'    },
]

const PIPELINE: { name: string; property: string; value: string; stage: 'Prospect' | 'Showing' | 'Offer' }[] = [
  { name: 'James Wilson',   property: 'Oceanfront Villa — Cap Cana',    value: '$2.45M', stage: 'Offer'    },
  { name: 'Lucia Ferreira', property: 'Penthouse — Piantini',            value: '$389K',  stage: 'Showing'  },
  { name: 'David Park',     property: 'Golf Villa — Punta Cana',         value: '$875K',  stage: 'Showing'  },
  { name: 'Marie Dubois',   property: 'Cliffside Villa — Sosúa',         value: '$1.65M', stage: 'Prospect' },
  { name: 'Tom Bradley',    property: 'Garden Condo — Cabarete',         value: '$245K',  stage: 'Prospect' },
  { name: 'Ana González',   property: 'Commercial Building — Sto. Dgo.', value: '$540K',  stage: 'Prospect' },
]

const CALENDAR_EVENTS = [
  { type: 'Showing', client: 'James Wilson', property: 'Cap Cana Villa',     date: 'Jun 5, 10:00am' },
  { type: 'Call',    client: 'Marie Dubois', property: 'Las Terrenas Condo', date: 'Jun 5, 2:00pm'  },
  { type: 'Showing', client: 'David Park',   property: 'Golf Villa',         date: 'Jun 6, 11:00am' },
  { type: 'Offer',   client: 'James Wilson', property: 'Oceanfront Villa',   date: 'Jun 7, 3:00pm'  },
  { type: 'Meeting', client: 'New buyer',    property: 'Office',             date: 'Jun 8, 9:00am'  },
]

const STAGE_TONE: Record<string, string> = { Prospect: '#7884a0', Showing: '#f0a800', Offer: '#e10f1f' }
const STAGES = ['Prospect', 'Showing', 'Offer'] as const
const LEAD_STATUS_TONE: Record<string, string> = { Hot: '#e10f1f', Warm: '#f0a800', Cold: '#7884a0' }
const EVENT_TONE: Record<string, string> = { Showing: '#0b63ab', Call: '#f0a800', Offer: '#e10f1f', Meeting: '#1f7a3d' }

const PAGE_TITLES: Record<string, string> = {
  home:     'Realtor overview',
  listings: 'My listings',
  leads:    'Leads',
  pipeline: 'Sales pipeline',
  calendar: 'Calendar',
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
          {sub && <div className="text-xs text-dim mt-0.5">{sub}</div>}
        </div>
        {action}
      </div>
      <div className={padded ? 'p-5.5' : ''}>{children}</div>
    </div>
  )
}

export default function RealtorDash({ go, view = 'home' }: { go: (v: string) => void; view?: string }) {
  const [listingFilter, setListingFilter] = useState<'All' | 'Active' | 'Review'>('All')
  const filteredListings = LISTINGS.filter(l => listingFilter === 'All' || l.status === listingFilter)

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

            {/* Active listings preview */}
            <Card
              title={<><Building2 size={14} /> Active Listings</>}
              padded={false}
              action={
                <button onClick={() => go('listings')} className="text-xs font-bold text-brand bg-transparent border-none cursor-pointer">Manage →</button>
              }
            >
              <div>
                {LISTINGS.slice(0, 4).map((l, i) => (
                  <div key={i} className={`flex items-center gap-3 py-3 px-5.5 ${i < 3 ? 'border-b border-line-soft' : ''}`}>
                    <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${TONE}20` }}>
                      <Home size={16} style={{ color: TONE }} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[13px] font-semibold text-ink truncate">{l.name}</div>
                      <div className="text-[11.5px] text-dim mt-0.5">{l.price} · {l.views.toLocaleString()} views · {l.leads} leads</div>
                    </div>
                    <span
                      className="text-[11px] font-bold py-0.75 px-2 rounded-full shrink-0"
                      style={{ color: l.status === 'Active' ? '#1f7a3d' : '#f0a800', background: `${l.status === 'Active' ? '#1f7a3d' : '#f0a800'}18` }}
                    >
                      {l.status}
                    </span>
                  </div>
                ))}
                <div className="py-3 px-5.5">
                  <button onClick={() => go('listings')} className="text-[12.5px] font-semibold text-brand bg-transparent border-none cursor-pointer p-0">
                    View all {LISTINGS.length} →
                  </button>
                </div>
              </div>
            </Card>

            {/* Pipeline preview */}
            <Card
              title={<><Shuffle size={14} /> Pipeline</>}
              sub="Active deals by stage"
              action={
                <button onClick={() => go('pipeline')} className="text-xs font-bold text-brand bg-transparent border-none cursor-pointer">Full view →</button>
              }
            >
              <div className="overflow-x-auto -mx-5.5 px-5.5">
              <div className="grid grid-cols-3 gap-3 min-w-80">
                {STAGES.map(stage => {
                  const items = PIPELINE.filter(p => p.stage === stage)
                  const tone = STAGE_TONE[stage]
                  return (
                    <div key={stage}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tone }}>{stage}</div>
                        <span className="text-[11px] font-bold py-0.5 px-1.75 rounded-full" style={{ color: tone, background: `${tone}18` }}>{items.length}</span>
                      </div>
                      <div className="flex flex-col gap-1.75">
                        {items.map((item, j) => (
                          <div key={j} className="bg-[#F8F9FC] border border-line-soft rounded-lg py-2 px-2.5 border-l-[3px]" style={{ borderLeftColor: tone }}>
                            <div className="text-xs font-bold text-ink mb-0.75">{item.name}</div>
                            <div className="text-[11px] text-dim leading-[1.3] mb-1">{item.property}</div>
                            <div className="text-[11.5px] font-bold text-brand">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              </div>
            </Card>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-5">

            {/* Hot leads */}
            <Card
              title={<><ClipboardList size={14} /> Hot Leads</>}
              action={
                <button onClick={() => go('leads')} className="text-xs font-bold text-brand bg-transparent border-none cursor-pointer">All →</button>
              }
            >
              <div className="flex flex-col gap-2.5">
                {LEADS.filter(l => l.status !== 'Cold').map((l, i) => (
                  <div key={i} className="py-2.5 px-3 rounded-[10px] bg-[#F8F9FC] border border-line-soft">
                    <div className="flex justify-between items-center mb-0.75">
                      <div className="text-[13px] font-bold text-ink">{l.name}</div>
                      <span
                        className="text-[11px] font-bold py-0.5 px-1.75 rounded-full"
                        style={{ color: LEAD_STATUS_TONE[l.status], background: `${LEAD_STATUS_TONE[l.status]}18` }}
                      >
                        {l.status}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-dim">{l.region} · {l.type} · {l.budget}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Commissions */}
            <Card title={<><Banknote size={14} /> Commissions</>}>
              {[
                { label: 'Earned YTD',     value: '$62,400', tone: '#1f7a3d' },
                { label: 'Pending',        value: '$18,700', tone: '#f0a800' },
                { label: 'Referral share', value: '$4,200',  tone: '#0b63ab' },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-center pb-3 mb-3 ${i < 2 ? 'border-b border-line-soft' : ''}`}>
                  <span className="text-[13.5px] text-ink2">{row.label}</span>
                  <span className="font-serif text-base font-extrabold" style={{ color: row.tone }}>{row.value}</span>
                </div>
              ))}
            </Card>

            {/* Quick actions */}
            <div className="rounded-2xl p-5.5" style={{ background: 'linear-gradient(135deg, #00102e 0%, #1a3a6e 100%)' }}>
              <div className="font-serif text-[15px] font-bold text-white mb-3">Quick actions</div>
              <div className="flex flex-col gap-2">
                {['+ Add new listing', '+ Add client', 'Share social kit', 'Request co-listing'].map((label, i) => (
                  <button
                    key={i}
                    className="py-2.25 px-3.5 rounded-[9px] text-[12.5px] font-semibold cursor-pointer text-left text-white/80"
                    style={{ border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    ),

    listings: (
      <Card
        title={<><Building2 size={14} /> My Listings ({LISTINGS.length})</>}
        padded={false}
        action={
          <div className="flex gap-1.5">
            {(['All', 'Active', 'Review'] as const).map(f => (
              <button
                key={f}
                onClick={() => setListingFilter(f)}
                className="py-1.25 px-3 rounded-full text-xs font-semibold cursor-pointer"
                style={{
                  border: `1px solid ${listingFilter === f ? TONE : '#e4ddcf'}`,
                  background: listingFilter === f ? TONE : 'transparent',
                  color: listingFilter === f ? '#fff' : '#33425f',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div>
          {filteredListings.map((l, i) => (
            <div key={i} className={`flex items-center gap-3 py-3.5 px-4 sm:px-5.5 ${i < filteredListings.length - 1 ? 'border-b border-line-soft' : ''}`}>
              <div className="w-12 h-12 rounded-[10px] shrink-0 flex items-center justify-center" style={{ background: `${TONE}20` }}>
                <Home size={20} style={{ color: TONE }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[13.5px] font-semibold text-ink truncate">{l.name}</div>
                  <span
                    className="text-[11px] font-bold py-0.75 px-2 rounded-full shrink-0"
                    style={{ color: l.status === 'Active' ? '#1f7a3d' : '#f0a800', background: `${l.status === 'Active' ? '#1f7a3d' : '#f0a800'}18` }}
                  >
                    {l.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-dim truncate">{l.price} · {l.views.toLocaleString()} views · {l.leads} leads</div>
                  <button className="text-xs font-bold py-1.5 px-3 rounded-lg border border-brand bg-transparent text-brand cursor-pointer shrink-0">Edit</button>
                </div>
              </div>
            </div>
          ))}
          <div className="py-3.5 px-4 sm:px-5.5">
            <button className="w-full py-2.5 rounded-full border-2 border-brand bg-transparent text-brand text-[13px] font-bold cursor-pointer">
              + Add new listing
            </button>
          </div>
        </div>
      </Card>
    ),

    leads: (
      <Card title={<><ClipboardList size={14} /> All Leads ({LEADS.length})</>} padded={false}>

        {/* Mobile card rows */}
        <div className="sm:hidden divide-y divide-line">
          {LEADS.map((l, i) => (
            <div key={i} className="px-4 py-3.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-ink">{l.name}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[11px] font-bold py-0.75 px-2 rounded-full"
                    style={{ color: LEAD_STATUS_TONE[l.status], background: `${LEAD_STATUS_TONE[l.status]}18` }}
                  >
                    {l.status}
                  </span>
                  <span className="text-[11px] text-dim">{l.time}</span>
                </div>
              </div>
              <div className="text-[12px] text-dim">{l.region} · {l.type} · {l.budget}</div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px_80px] gap-3 py-2.5 px-5.5 border-b border-line">
            {['Name', 'Region', 'Budget', 'Type', 'Status', 'Time'].map((h, i) => (
              <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
            ))}
          </div>
          {LEADS.map((l, i) => (
            <div key={i} className={`grid grid-cols-[1fr_1fr_1fr_1fr_80px_80px] gap-3 py-3 px-5.5 items-center ${i < LEADS.length - 1 ? 'border-b border-line-soft' : ''}`}>
              <div className="text-[13.5px] font-semibold text-ink">{l.name}</div>
              <div className="text-[13px] text-ink2">{l.region}</div>
              <div className="text-[13px] text-ink2">{l.budget}</div>
              <div className="text-[13px] text-ink2">{l.type}</div>
              <span
                className="text-[11px] font-bold py-0.75 px-2 rounded-full justify-self-start"
                style={{ color: LEAD_STATUS_TONE[l.status], background: `${LEAD_STATUS_TONE[l.status]}18` }}
              >
                {l.status}
              </span>
              <div className="text-xs text-dim">{l.time}</div>
            </div>
          ))}
        </div>

      </Card>
    ),

    pipeline: (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {STAGES.map(stage => {
          const items = PIPELINE.filter(p => p.stage === stage)
          const tone = STAGE_TONE[stage]
          const total = items.reduce((s, p) => s + parseFloat(p.value.replace(/[^0-9.]/g, '')) * (p.value.includes('M') ? 1_000_000 : p.value.includes('K') ? 1_000 : 1), 0)
          return (
            <div key={stage} className="bg-paper border border-line rounded-2xl overflow-hidden">
              <div className="py-3.5 px-4.5 border-b border-line" style={{ background: `${tone}10` }}>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-[13px] uppercase tracking-widest" style={{ color: tone }}>{stage}</div>
                  <span className="text-xs font-bold py-0.75 px-2.25 rounded-full" style={{ color: tone, background: `${tone}20` }}>{items.length}</span>
                </div>
                <div className="text-xs text-dim mt-0.75">
                  ${total >= 1_000_000 ? (total / 1_000_000).toFixed(2) + 'M' : (total / 1_000).toFixed(0) + 'K'} total
                </div>
              </div>
              <div className="p-3.5 flex flex-col gap-2.5">
                {items.map((item, j) => (
                  <div key={j} className="bg-[#F8F9FC] border border-line-soft rounded-[10px] py-3 px-3.5 border-l-[3px]" style={{ borderLeftColor: tone }}>
                    <div className="text-[13px] font-bold text-ink mb-1">{item.name}</div>
                    <div className="text-[11.5px] text-dim leading-[1.35] mb-1.5">{item.property}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-brand">{item.value}</span>
                      <button className="text-[11.5px] font-semibold py-1 px-2.5 rounded-lg border border-line bg-white text-ink2 cursor-pointer">View</button>
                    </div>
                  </div>
                ))}
                <button
                  className="w-full py-2.25 rounded-lg text-[12.5px] font-semibold cursor-pointer border border-dashed bg-transparent"
                  style={{ borderColor: tone, color: tone }}
                >
                  + Add deal
                </button>
              </div>
            </div>
          )
        })}
      </div>
    ),

    calendar: (
      <Card title={<><Calendar size={14} /> Upcoming Schedule</>} sub="Showings, calls & meetings">
        <div className="flex flex-col gap-3">
          {CALENDAR_EVENTS.map((e, i) => {
            const tone = EVENT_TONE[e.type] ?? '#7884a0'
            return (
              <div
                key={i}
                className="flex items-center gap-3.5 py-3.5 px-4 rounded-[10px] bg-[#F8F9FC] border border-line-soft border-l-4"
                style={{ borderLeftColor: tone }}
              >
                <div className="flex-1">
                  <div className="text-[13.5px] font-bold text-ink mb-0.75">{e.client}</div>
                  <div className="text-xs text-dim">{e.property} · {e.date}</div>
                </div>
                <span className="text-[11px] font-bold py-0.75 px-2.25 rounded-full shrink-0" style={{ color: tone, background: `${tone}18` }}>{e.type}</span>
              </div>
            )
          })}
          <button className="w-full py-2.75 rounded-full border-2 border-brand bg-transparent text-brand text-[13px] font-bold cursor-pointer">
            + Schedule showing
          </button>
        </div>
      </Card>
    ),

    profile: (
      <Card title={<><User size={14} /> Realtor Profile</>}>
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-line-soft">
          <div className="w-14 h-14 rounded-full shrink-0 grid place-items-center text-white font-extrabold text-[22px]" style={{ background: TONE }}>S</div>
          <div>
            <div className="font-serif text-xl font-bold text-ink">Sofia Herrera</div>
            <div className="text-[13px] text-dim">realtor@demo.do · License #RD-2021-4489</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Member since',     value: 'April 2021'  },
            { label: 'Active clients',   value: '18'          },
            { label: 'Listings',         value: '24 (active)' },
            { label: 'Closed this year', value: '11 deals'    },
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
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-brand mb-1.5">
          Realtor Portal · Sofia Herrera
        </div>
        <h1 className="font-serif text-[22px] sm:text-[28px] font-extrabold text-ink tracking-[-0.02em]">
          {PAGE_TITLES[view] ?? PAGE_TITLES.home}
        </h1>
      </div>
      {sections[view] ?? sections.home}
    </div>
  )
}

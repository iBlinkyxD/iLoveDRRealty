import {
  Building2, ClipboardList, Users, CheckCircle2, Shuffle, Home, Banknote, type LucideIcon,
} from 'lucide-react'
import { Card, StatusPill, RoleKpiCard } from './shared'

export const REALTOR_KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Users,         label: 'Active Clients',   value: '18', sub: '+4 this month'       },
  { Icon: Building2,     label: 'Active Listings',  value: '24', sub: '4 pending review',   hl: true },
  { Icon: CheckCircle2,  label: 'Pending Closings', value: '3',  sub: 'Est. $4.1M total'    },
  { Icon: ClipboardList, label: 'Leads This Month', value: '47', sub: '+22% vs prior month' },
]

export const REALTOR_LISTINGS = [
  { name: 'Oceanfront Villa — Cap Cana',   status: 'Active', leads: 8, views: 1420, price: '$2.45M' },
  { name: 'Golf Villa — Punta Cana',       status: 'Active', leads: 5, views: 892,  price: '$875K'  },
  { name: 'Garden Condo — Cabarete',       status: 'Active', leads: 3, views: 554,  price: '$245K'  },
  { name: 'Beachfront Residence — Samaná', status: 'Review', leads: 0, views: 0,    price: '$1.2M'  },
  { name: 'Penthouse — Piantini',          status: 'Active', leads: 6, views: 710,  price: '$389K'  },
  { name: 'Hillside Villa — Jarabacoa',    status: 'Active', leads: 2, views: 320,  price: '$320K'  },
]

export const REALTOR_LEADS = [
  { name: 'James Wilson',   region: 'Cap Cana',     budget: '$2-3M',     type: 'Villa', status: 'Hot',  time: '1h ago'    },
  { name: 'Marie Dubois',   region: 'Las Terrenas', budget: '$600-900K', type: 'Condo', status: 'Warm', time: '4h ago'    },
  { name: 'David Park',     region: 'Punta Cana',   budget: '$800K-1M',  type: 'Villa', status: 'Hot',  time: 'Yesterday' },
  { name: 'Lucia Ferreira', region: 'Sto. Domingo', budget: '$300-500K', type: 'Apt',   status: 'Cold', time: '2d ago'    },
  { name: 'Tom Bradley',    region: 'Cabarete',     budget: '$200-300K', type: 'Condo', status: 'Warm', time: '3d ago'    },
  { name: 'Ana González',   region: 'Sto. Domingo', budget: '$500-700K', type: 'Comm.', status: 'Cold', time: '4d ago'    },
]

export const REALTOR_PIPELINE: { name: string; property: string; value: string; stage: 'Prospect' | 'Showing' | 'Offer' }[] = [
  { name: 'James Wilson',   property: 'Oceanfront Villa — Cap Cana',    value: '$2.45M', stage: 'Offer'    },
  { name: 'Lucia Ferreira', property: 'Penthouse — Piantini',            value: '$389K',  stage: 'Showing'  },
  { name: 'David Park',     property: 'Golf Villa — Punta Cana',         value: '$875K',  stage: 'Showing'  },
  { name: 'Marie Dubois',   property: 'Cliffside Villa — Sosúa',         value: '$1.65M', stage: 'Prospect' },
  { name: 'Tom Bradley',    property: 'Garden Condo — Cabarete',         value: '$245K',  stage: 'Prospect' },
  { name: 'Ana González',   property: 'Commercial Building — Sto. Dgo.', value: '$540K',  stage: 'Prospect' },
]

export const REALTOR_CAL_EVENTS = [
  { type: 'Showing', client: 'James Wilson', property: 'Cap Cana Villa',     date: 'Jun 5, 10:00am' },
  { type: 'Call',    client: 'Marie Dubois', property: 'Las Terrenas Condo', date: 'Jun 5, 2:00pm'  },
  { type: 'Showing', client: 'David Park',   property: 'Golf Villa',         date: 'Jun 6, 11:00am' },
  { type: 'Offer',   client: 'James Wilson', property: 'Oceanfront Villa',   date: 'Jun 7, 3:00pm'  },
  { type: 'Meeting', client: 'New buyer',    property: 'Office',             date: 'Jun 8, 9:00am'  },
]

export const STAGE_TONE: Record<string, string> = { Prospect: '#7884a0', Showing: '#f0a800', Offer: '#e10f1f' }
export const STAGES = ['Prospect', 'Showing', 'Offer'] as const
export const LEAD_STATUS_TONE: Record<string, string> = { Hot: '#e10f1f', Warm: '#f0a800', Cold: '#7884a0' }
export const REALTOR_EVENT_TONE: Record<string, string> = { Showing: '#0b63ab', Call: '#f0a800', Offer: '#e10f1f', Meeting: '#1f7a3d' }

export function RealtorHome({ go, tone }: { go: (v: string) => void; tone: string }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
        {REALTOR_KPIS.map((k, i) => <RoleKpiCard key={i} {...k} tone={tone} />)}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Card title={<><Building2 size={14} /> Active Listings</>} padded={false}
            action={<button onClick={() => go('listings')} className="text-xs font-bold text-brand bg-transparent border-none cursor-pointer">Manage →</button>}>
            <div>
              {REALTOR_LISTINGS.slice(0, 4).map((l, i) => (
                <div key={i} className={`flex items-center gap-3 py-3 px-5.5 ${i < 3 ? 'border-b border-line' : ''}`}>
                  <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${tone}20` }}>
                    <Home size={16} style={{ color: tone }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[13px] font-semibold text-ink truncate">{l.name}</div>
                    <div className="text-[11.5px] text-dim mt-0.5">{l.price} · {l.views.toLocaleString()} views · {l.leads} leads</div>
                  </div>
                  <StatusPill label={l.status} tone={l.status === 'Active' ? '#1f7a3d' : '#f0a800'} />
                </div>
              ))}
              <div className="py-3 px-5.5">
                <button onClick={() => go('listings')} className="text-[12.5px] font-semibold text-brand bg-transparent border-none cursor-pointer p-0">
                  View all {REALTOR_LISTINGS.length} →
                </button>
              </div>
            </div>
          </Card>

          <Card title={<><Shuffle size={14} /> Pipeline</>} sub="Active deals by stage"
            action={<button onClick={() => go('pipeline')} className="text-xs font-bold text-brand bg-transparent border-none cursor-pointer">Full view →</button>}>
            <div className="overflow-x-auto -mx-5.5 px-5.5">
              <div className="grid grid-cols-3 gap-3 min-w-80">
                {STAGES.map(stage => {
                  const items = REALTOR_PIPELINE.filter(p => p.stage === stage)
                  const st = STAGE_TONE[stage]
                  return (
                    <div key={stage}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: st }}>{stage}</div>
                        <span className="text-[11px] font-bold py-0.5 px-1.75 rounded-full" style={{ color: st, background: `${st}18` }}>{items.length}</span>
                      </div>
                      <div className="flex flex-col gap-1.75">
                        {items.map((item, j) => (
                          <div key={j} className="bg-[#F8F9FC] border border-line rounded-lg py-2 px-2.5 border-l-[3px]" style={{ borderLeftColor: st }}>
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

        <div className="flex flex-col gap-5">
          <Card title={<><ClipboardList size={14} /> Hot Leads</>}
            action={<button onClick={() => go('leads')} className="text-xs font-bold text-brand bg-transparent border-none cursor-pointer">All →</button>}>
            <div className="flex flex-col gap-2.5">
              {REALTOR_LEADS.filter(l => l.status !== 'Cold').map((l, i) => (
                <div key={i} className="py-2.5 px-3 rounded-[10px] bg-[#F8F9FC] border border-line">
                  <div className="flex justify-between items-center mb-0.75">
                    <div className="text-[13px] font-bold text-ink">{l.name}</div>
                    <StatusPill label={l.status} tone={LEAD_STATUS_TONE[l.status]} />
                  </div>
                  <div className="text-[11.5px] text-dim">{l.region} · {l.type} · {l.budget}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={<><Banknote size={14} /> Commissions</>}>
            {[{ label: 'Earned YTD', value: '$62,400', t: '#1f7a3d' }, { label: 'Pending', value: '$18,700', t: '#f0a800' }, { label: 'Referral share', value: '$4,200', t: '#0b63ab' }].map((row, i) => (
              <div key={i} className={`flex justify-between items-center pb-3 mb-3 ${i < 2 ? 'border-b border-line' : ''}`}>
                <span className="text-[13.5px] text-ink2">{row.label}</span>
                <span className="font-sans text-base font-extrabold" style={{ color: row.t }}>{row.value}</span>
              </div>
            ))}
          </Card>

          <div className="rounded-2xl p-5.5" style={{ background: 'linear-gradient(135deg, #00102e 0%, #1a3a6e 100%)' }}>
            <div className="font-sans text-[15px] font-bold text-white mb-3">Quick actions</div>
            <div className="flex flex-col gap-2">
              {['+ Add new listing', '+ Add client', 'Share social kit', 'Request co-listing'].map((label, i) => (
                <button key={i} className="py-2.25 px-3.5 rounded-[9px] text-[12.5px] font-semibold cursor-pointer text-left text-white/80"
                  style={{ border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

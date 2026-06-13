import {
  Clock, Users, Home, DollarSign,
  CheckCircle2, UserPlus, XCircle, MessageCircle, Bell,
  AlertTriangle, ToggleLeft, ToggleRight, ChevronRight,
  type LucideIcon,
} from 'lucide-react'

export const TONE = '#0d9488'

export const APPROVALS: { type: 'Listing' | 'User'; title: string; submittedBy: string; time: string; flag?: string }[] = [
  { type: 'Listing', title: 'Luxury Beachfront Villa — Las Terrenas',    submittedBy: 'Maria Cruz (Owner)',       time: '1h ago'    },
  { type: 'User',    title: 'New Realtor: Carlos Reyes',                 submittedBy: 'carlos@reyes.do',          time: '3h ago',   flag: 'License pending' },
  { type: 'Listing', title: 'Commercial Space — Zona Colonial',          submittedBy: 'Juan Peña (Realtor)',      time: '5h ago'    },
  { type: 'User',    title: 'New Owner: Isabelle Fontaine',              submittedBy: 'i.fontaine@email.com',     time: 'Yesterday' },
  { type: 'Listing', title: 'Penthouse — Naco, Santo Domingo',           submittedBy: 'DRLuxury Group (Realtor)', time: '2d ago'    },
  { type: 'Listing', title: 'Studio Suite — Cabarete Beach',             submittedBy: 'Pedro Alonso (Owner)',     time: '2d ago'    },
  { type: 'User',    title: 'New Realtor: Sofia Martínez',               submittedBy: 's.martinez@realty.do',     time: '3d ago',   flag: 'Duplicate email' },
  { type: 'Listing', title: 'Hillside Villa — Jarabacoa',                submittedBy: 'Carlos Reyes (Realtor)',   time: '3d ago'    },
]

export const KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Clock,      label: 'Pending Approvals', value: '8',     sub: '5 listings · 3 users',  hl: true },
  { Icon: Users,      label: 'New Users Today',   value: '34',    sub: '+18% vs yesterday'               },
  { Icon: Home,       label: 'Active Listings',   value: '4,847', sub: '124 added this week'             },
  { Icon: DollarSign, label: 'Platform Revenue',  value: '$124K', sub: 'May 2026 · +9% MoM'             },
]

export const ACTIVITY: { Icon: LucideIcon; text: string; time: string; tone: string }[] = [
  { Icon: CheckCircle2,  text: 'Listing approved: Golf Villa — Punta Cana',  time: '12m ago', tone: '#1f7a3d' },
  { Icon: UserPlus,      text: 'New user registered: tom.b@example.com',      time: '34m ago', tone: '#0b63ab' },
  { Icon: XCircle,       text: 'Listing rejected: Incomplete floor plan',      time: '1h ago',  tone: '#e10f1f' },
  { Icon: MessageCircle, text: 'Contact form: Inquiry from buyer in Miami',   time: '2h ago',  tone: '#f0a800' },
  { Icon: CheckCircle2,  text: 'Realtor verified: Ana Peña',                  time: '3h ago',  tone: '#1f7a3d' },
  { Icon: Bell,          text: 'Flag resolved: Duplicate listing removed',    time: '5h ago',  tone: '#7884a0' },
]

export const BAR_DATA = [
  { month: 'Dec', users: 640  },
  { month: 'Jan', users: 820  },
  { month: 'Feb', users: 970  },
  { month: 'Mar', users: 1140 },
  { month: 'Apr', users: 1380 },
  { month: 'May', users: 1620 },
]
export const MAX_BAR = Math.max(...BAR_DATA.map(d => d.users))

export const USERS: { name: string; email: string; role: string; joined: string; status: 'active' | 'pending' | 'suspended' }[] = [
  { name: 'Carlos Reyes',      email: 'carlos@reyes.do',      role: 'Realtor',  joined: 'May 28', status: 'pending'   },
  { name: 'Isabelle Fontaine', email: 'i.fontaine@email.com', role: 'Owner',    joined: 'May 27', status: 'pending'   },
  { name: 'Ana Peña',          email: 'ana.p@broker.do',      role: 'Realtor',  joined: 'May 20', status: 'active'    },
  { name: 'Tom Burrell',       email: 'tom.b@example.com',    role: 'Buyer',    joined: 'May 19', status: 'active'    },
  { name: 'Maria Cruz',        email: 'maria@owner.do',       role: 'Owner',    joined: 'May 15', status: 'active'    },
  { name: 'Luis Guerrero',     email: 'luis.g@invest.do',     role: 'Investor', joined: 'May 10', status: 'active'    },
  { name: 'Sandra Vega',       email: 's.vega@realty.do',     role: 'Realtor',  joined: 'May 8',  status: 'suspended' },
  { name: 'Pedro Alonso',      email: 'p.alonso@owner.do',    role: 'Owner',    joined: 'May 3',  status: 'active'    },
]

export const ALL_LISTINGS: { title: string; region: string; price: number; type: string; owner: string; status: 'pending' | 'active' | 'rejected' }[] = [
  { title: 'Luxury Beachfront Villa — Las Terrenas', region: 'Las Terrenas, Samaná',       price: 1850000, type: 'Villa',      owner: 'Maria Cruz',    status: 'pending'  },
  { title: 'Commercial Space — Zona Colonial',       region: 'Santo Domingo, D.N.',         price: 420000,  type: 'Commercial', owner: 'Juan Peña',     status: 'pending'  },
  { title: 'Penthouse — Naco, Santo Domingo',        region: 'Naco, Santo Domingo',         price: 780000,  type: 'Condo',      owner: 'DRLuxury Grp',  status: 'pending'  },
  { title: 'Golf Villa — Punta Cana',                region: 'Punta Cana, La Altagracia',   price: 975000,  type: 'Villa',      owner: 'Ana Peña',      status: 'active'   },
  { title: 'Oceanfront Estate — Cap Cana',           region: 'Cap Cana, La Altagracia',     price: 2450000, type: 'Villa',      owner: 'Luis Guerrero', status: 'active'   },
  { title: 'Hillside Villa — Jarabacoa',             region: 'Jarabacoa, La Vega',          price: 340000,  type: 'Villa',      owner: 'Pedro Alonso',  status: 'active'   },
  { title: 'Studio Suite — Cabarete',                region: 'Cabarete, Puerto Plata',      price: 145000,  type: 'Apartment',  owner: 'Sandra Vega',   status: 'rejected' },
]

export const REVENUE_DATA = [
  { month: 'Dec', rev: 68 }, { month: 'Jan', rev: 79 }, { month: 'Feb', rev: 88 },
  { month: 'Mar', rev: 102 }, { month: 'Apr', rev: 115 }, { month: 'May', rev: 124 },
]
export const MAX_REV = Math.max(...REVENUE_DATA.map(d => d.rev))

export const REGIONS = [
  { name: 'Punta Cana',    count: 1842, pct: 38 },
  { name: 'Santo Domingo', count: 1214, pct: 25 },
  { name: 'Las Terrenas',  count: 728,  pct: 15 },
  { name: 'Cap Cana',      count: 534,  pct: 11 },
  { name: 'Puerto Plata',  count: 338,  pct: 7  },
  { name: 'Other',         count: 191,  pct: 4  },
]

export const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`

export const ROLE_COLOR: Record<string, string> = {
  Buyer: '#e10f1f', Investor: '#0b63ab', Owner: '#f0a800', Realtor: '#1f7a3d', Admin: '#0d9488',
}

export const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: '#1f7a3d18', color: '#1f7a3d', label: 'Active'    },
  pending:   { bg: '#f0a80018', color: '#c07800', label: 'Pending'   },
  rejected:  { bg: '#e10f1f18', color: '#e10f1f', label: 'Rejected'  },
  suspended: { bg: '#7884a018', color: '#556070', label: 'Suspended' },
}

export function FilterPills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
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

export function ApprovalRow({
  item, last, onClick,
}: {
  item: { type: 'Listing' | 'User'; title: string; submittedBy: string; time: string; flag?: string }
  last?: boolean
  onClick?: () => void
}) {
  return (
    <div
      className={`px-4 sm:px-5.5 py-3.5 flex items-start gap-3${last ? '' : ' border-b border-line-soft'}${onClick ? ' cursor-pointer hover:bg-line-soft/40 transition-colors' : ''}`}
      onClick={onClick}
    >
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
      </div>
      {onClick && <ChevronRight size={15} className="text-dim shrink-0 self-center" />}
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="border-0 bg-transparent cursor-pointer p-0 flex items-center" style={{ color: on ? TONE : '#c0b9ac' }}>
      {on ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  )
}

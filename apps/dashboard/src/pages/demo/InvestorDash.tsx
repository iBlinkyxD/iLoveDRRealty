import type { ReactNode } from 'react'
import {
  Building2, TrendingUp, DollarSign, BarChart2, Heart, Globe,
  ClipboardList, Calculator, Clock, Users, Home, User,
  type LucideIcon,
} from 'lucide-react'

const TONE = '#0b63ab'

function fmt(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K'
  return '$' + n.toLocaleString()
}

const KPIS: { Icon: LucideIcon; label: string; value: string; sub: string; hl?: boolean }[] = [
  { Icon: Building2,  label: 'Portfolio Value',   value: '$2.09M', sub: '2 properties',    hl: true },
  { Icon: TrendingUp, label: 'Unrealised Gain',   value: '+$193K', sub: '+10.2% total'              },
  { Icon: DollarSign, label: 'Monthly Cash Flow', value: '+$1.8K', sub: 'After expenses'            },
  { Icon: BarChart2,  label: 'Avg Gross Yield',   value: '8.1%',   sub: 'Across portfolio'          },
]

const SNAPSHOT: { Icon: LucideIcon; label: string; value: string }[] = [
  { Icon: Home,       label: 'Active Listings',   value: '4,847' },
  { Icon: DollarSign, label: 'Median Price',       value: '$620K' },
  { Icon: Clock,      label: 'Avg Days to Sell',   value: '42d'   },
  { Icon: Users,      label: 'Foreign Buyers',     value: '61%'   },
  { Icon: Building2,  label: 'New Developments',   value: '38'    },
  { Icon: TrendingUp, label: 'YoY Price Growth',   value: '+9.1%' },
]

const WATCHLIST = [
  { id: 1, name: 'Oceanfront Villa — Cap Cana',   price: 2_450_000, roi: 9.8, region: 'Cap Cana',     tag: 'Hot' as string | null },
  { id: 2, name: 'Penthouse — Piantini',          price:   389_000, roi: 6.8, region: 'Sto. Domingo', tag: null                   },
  { id: 3, name: 'Beach Condo — Las Terrenas',    price:   620_000, roi: 7.6, region: 'Las Terrenas', tag: 'New'                  },
  { id: 4, name: 'Golf Villa — Punta Cana',       price:   875_000, roi: 8.4, region: 'Punta Cana',   tag: null                   },
  { id: 5, name: 'Cliffside Eco-Lodge — Samaná', price: 1_100_000, roi: 8.1, region: 'Samaná',       tag: 'New'                  },
  { id: 6, name: 'Commercial Strip — Cabarete',   price:   540_000, roi: 7.9, region: 'Cabarete',     tag: null                   },
  { id: 7, name: 'Hillside Villa — Jarabacoa',    price:   320_000, roi: 7.2, region: 'Jarabacoa',    tag: null                   },
  { id: 8, name: 'Marina Condo — La Romana',      price:   780_000, roi: 8.8, region: 'La Romana',    tag: 'Hot'                  },
  { id: 9, name: 'City Apt — Naco, Sto. Dgo.',   price:   245_000, roi: 6.5, region: 'Sto. Domingo', tag: null                   },
]

const PORTFOLIO = [
  { name: 'Cliffside Villa — Sosúa',  price: 1_650_000, value: 1_820_000, rent: 14_200, roi: 8.9, occ: 82 },
  { name: 'Garden Condo — Cabarete', price:   245_000, value:   268_000, rent:  1_750, roi: 7.2, occ: 75 },
]

const REGIONS = [
  { name: 'Cap Cana',      yield: 9.8, price: '$1.8M avg', growth: '+12.3%', trend: '↑' },
  { name: 'Punta Cana',   yield: 8.4, price: '$875K avg',  growth: '+9.1%',  trend: '↑' },
  { name: 'Puerto Plata', yield: 8.9, price: '$640K avg',  growth: '+8.5%',  trend: '↑' },
  { name: 'Las Terrenas', yield: 7.6, price: '$920K avg',  growth: '+7.8%',  trend: '→' },
  { name: 'Sto. Domingo', yield: 6.8, price: '$389K avg',  growth: '+5.2%',  trend: '→' },
]

const DEALS = [
  { name: 'Cap Cana Villa Deal',      price: '$2.45M', roi: '9.8%', irr: '14.2%', saved: '3d ago',  score: 'A+' },
  { name: 'Cabarete Condo Portfolio', price: '$490K',  roi: '7.2%', irr: '11.1%', saved: '1w ago',  score: 'B+' },
  { name: 'Samaná Eco-Lodge',         price: '$1.1M',  roi: '8.1%', irr: '12.4%', saved: '2w ago',  score: 'A'  },
  { name: 'Piantini Penthouse',       price: '$389K',  roi: '6.8%', irr: '9.9%',  saved: '1mo ago', score: 'B'  },
]

const REQUESTS = [
  { buyer: 'James Wilson',   region: 'Cap Cana',      budget: '$2-3M',     type: 'Villa', time: '1h ago'    },
  { buyer: 'Marie Dubois',   region: 'Las Terrenas',  budget: '$600-900K', type: 'Condo', time: '4h ago'    },
  { buyer: 'David Park',     region: 'Punta Cana',    budget: '$800K-1M',  type: 'Villa', time: 'Yesterday' },
  { buyer: 'Lucia Ferreira', region: 'Santo Domingo', budget: '$300-500K', type: 'Apt',   time: '2d ago'    },
]

const SCORE_TONE: Record<string, string> = { 'A+': '#1f7a3d', 'A': '#0b63ab', 'B+': '#f0a800', 'B': '#7884a0' }

const PAGE_TITLES: Record<string, string> = {
  home:      'Investment overview',
  watchlist: 'Watchlist',
  deals:     'Deal analyses',
  requests:  'Buyer requests',
  market:    'Market data',
  profile:   'My profile',
}

function Card({ title, sub, children, padded = true }: {
  title: ReactNode; sub?: string; children: ReactNode; padded?: boolean
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line overflow-hidden">
      <div className="px-5 py-4.5 border-b border-line">
        <div className="text-sm font-bold text-ink flex items-center gap-1.5">{title}</div>
        {sub && <div className="text-[11.5px] text-dim mt-0.5">{sub}</div>}
      </div>
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </div>
  )
}

function StatusPill({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className="text-[11px] font-bold px-2.5 py-0.75 rounded-full shrink-0"
      style={{ color: tone, background: `${tone}18` }}
    >
      {label}
    </span>
  )
}

export default function InvestorDash({ go, view = 'home' }: { go: (v: string) => void; view?: string }) {
  const totalInvested = PORTFOLIO.reduce((s, p) => s + p.price, 0)
  const totalValue    = PORTFOLIO.reduce((s, p) => s + p.value, 0)
  const gain          = totalValue - totalInvested

  const sections: Record<string, ReactNode> = {

    home: (
      <>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
          {KPIS.map((k, i) => (
            <div
              key={i}
              className={k.hl ? 'rounded-xl p-5' : 'bg-paper border border-line rounded-xl p-5'}
              style={k.hl ? { background: 'linear-gradient(135deg, #00102e 0%, #1a3a6e 100%)' } : undefined}
            >
              <div className="mb-2">
                <k.Icon size={18} style={{ color: k.hl ? 'rgba(255,255,255,.65)' : TONE }} />
              </div>
              <div className={`font-serif text-2xl font-bold leading-none ${k.hl ? 'text-white' : 'text-ink'}`}>{k.value}</div>
              <div className={`text-[12.5px] font-semibold mt-1.5 ${k.hl ? 'text-white/70' : 'text-ink2'}`}>{k.label}</div>
              <div className={`text-[11px] mt-0.75 ${k.hl ? 'text-white/45' : 'text-dim'}`}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">

          {/* Left col */}
          <div className="flex flex-col gap-5">

            {/* Portfolio */}
            <Card
              title={<><Building2 size={13} className="shrink-0" /> My Portfolio</>}
              sub={`${fmt(totalInvested)} invested · +${fmt(gain)} gain`}
            >
              <div className="flex flex-col gap-3.5">
                {PORTFOLIO.map((p, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F8F9FC] border border-line-soft">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="text-[13.5px] font-bold text-ink">{p.name}</div>
                      <span className="text-[12.5px] font-bold text-brand">+{p.roi}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2.5">
                      {[{ label: 'Purchase', v: fmt(p.price) }, { label: 'Value', v: fmt(p.value) }, { label: 'Rent/mo', v: fmt(p.rent) }].map((m, j) => (
                        <div key={j} className="text-center py-1.75 bg-paper rounded-lg">
                          <div className="font-serif text-sm font-bold text-ink">{m.v}</div>
                          <div className="text-[10.5px] text-dim mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-dim mb-1">
                        <span>Occupancy</span><span>{p.occ}%</span>
                      </div>
                      <div className="h-1.25 rounded-full bg-line-soft">
                        <div
                          className="h-1.25 rounded-full"
                          style={{ width: `${p.occ}%`, background: 'linear-gradient(90deg, #0b63ab, #1f7a3d)' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => go('watchlist')}
                  className="w-full py-2.5 rounded-full border-[1.5px] border-sea bg-transparent text-sea font-sans text-[13px] font-bold cursor-pointer"
                >
                  + Add property to portfolio
                </button>
              </div>
            </Card>

            {/* Watchlist preview */}
            <Card title={<><Heart size={13} className="shrink-0" /> Watchlist</>} sub="Top picks" padded={false}>
              <div>
                {WATCHLIST.slice(0, 4).map((w, i) => (
                  <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < 3 ? 'border-b border-line-soft' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-ink truncate">{w.name}</div>
                      <div className="text-[11.5px] text-dim mt-0.5">{w.region} · {fmt(w.price)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {w.tag && <StatusPill label={w.tag} tone={w.tag === 'Hot' ? '#e10f1f' : '#0b63ab'} />}
                      <span className="text-[12.5px] font-bold text-brand">{w.roi}%</span>
                    </div>
                  </div>
                ))}
                <div className="px-5 py-3">
                  <button
                    onClick={() => go('watchlist')}
                    className="text-[12.5px] font-semibold text-sea bg-transparent border-none cursor-pointer p-0"
                  >
                    View all {WATCHLIST.length} →
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-5">

            {/* Regional yields */}
            <Card title={<><Globe size={13} className="shrink-0" /> Regional Yields</>}>
              <div className="flex flex-col gap-2.5">
                {REGIONS.map((r, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className={`text-[11.5px] font-bold w-3.5 shrink-0 ${r.trend === '↑' ? 'text-brand' : 'text-dim'}`}>{r.trend}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-[12.5px] mb-1">
                        <span className="font-semibold text-ink">{r.name}</span>
                        <span className="font-bold text-brand">{r.yield}%</span>
                      </div>
                      <div className="h-1.25 rounded-full bg-line-soft">
                        <div className="h-1.25 rounded-full bg-sea" style={{ width: `${r.yield / 10 * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Buyer requests */}
            <Card
              title={<><ClipboardList size={13} className="shrink-0" /> Buyer Requests</>}
              sub={`${REQUESTS.length} active`}
            >
              <div className="flex flex-col gap-2.5">
                {REQUESTS.map((r, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#F8F9FC] border border-line-soft">
                    <div className="text-[13px] font-bold text-ink mb-0.75">{r.buyer}</div>
                    <div className="text-[11.5px] text-dim">{r.region} · {r.type} · {r.budget}</div>
                    <div className="text-[11px] text-dim mt-0.75">{r.time}</div>
                  </div>
                ))}
                <button
                  onClick={() => go('requests')}
                  className="text-[12.5px] font-semibold text-sea bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  View all →
                </button>
              </div>
            </Card>

            {/* ROI Calculator CTA */}
            <div className="rounded-2xl p-5.5" style={{ background: 'linear-gradient(135deg, #0b63ab 0%, #003a73 100%)' }}>
              <div className="mb-2 text-white/65">
                <Calculator size={22} />
              </div>
              <div className="font-serif text-base font-bold text-white mb-1.5">ROI Calculator</div>
              <p className="text-[12.5px] text-white/65 leading-relaxed mb-3.5">
                Model a new deal — scenario analysis, break-even, 10-year projections.
              </p>
              <a
                href="https://ilovedrrealty.com/calculator"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[12.5px] font-bold py-2.25 px-4.5 rounded-full bg-paper no-underline"
                style={{ color: TONE }}
              >
                Open calculator →
              </a>
            </div>

          </div>
        </div>
      </>
    ),

    watchlist: (
      <Card title={<><Heart size={13} className="shrink-0" /> Watchlist ({WATCHLIST.length})</>} sub="Properties you're tracking" padded={false}>

        {/* Mobile card rows */}
        <div className="sm:hidden divide-y divide-line">
          {WATCHLIST.map((w, i) => (
            <div key={i} className="px-4 py-3.5 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-ink leading-snug">{w.name}</div>
                {w.tag && <StatusPill label={w.tag} tone={w.tag === 'Hot' ? '#e10f1f' : '#0b63ab'} />}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[12px] text-dim">{w.region} · {fmt(w.price)}</div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[13px] font-bold text-brand">{w.roi}%</span>
                  <button className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-sea bg-transparent text-sea cursor-pointer">
                    Analyse
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block p-5">
          <div className="grid grid-cols-[2fr_1fr_1fr_80px_80px] gap-3 pb-2.5 border-b border-line mb-1">
            {['Property', 'Region', 'Price', 'Yield', ''].map((h, i) => (
              <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
            ))}
          </div>
          {WATCHLIST.map((w, i) => (
            <div
              key={i}
              className={`grid grid-cols-[2fr_1fr_1fr_80px_80px] gap-3 py-3 items-center ${i < WATCHLIST.length - 1 ? 'border-b border-line-soft' : ''}`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-[13.5px] font-semibold text-ink">{w.name}</div>
                {w.tag && <StatusPill label={w.tag} tone={w.tag === 'Hot' ? '#e10f1f' : '#0b63ab'} />}
              </div>
              <div className="text-[13px] text-ink2">{w.region}</div>
              <div className="text-[13px] font-semibold text-ink">{fmt(w.price)}</div>
              <div className="text-[13px] font-bold text-brand">{w.roi}%</div>
              <button className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-sea bg-transparent text-sea cursor-pointer">
                Analyse
              </button>
            </div>
          ))}
        </div>

      </Card>
    ),

    deals: (
      <Card title={<><TrendingUp size={13} className="shrink-0" /> Deal Analyses ({DEALS.length})</>} sub="Saved ROI calculations">
        <div className="flex flex-col gap-3">
          {DEALS.map((d, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8F9FC] border border-line-soft">
              <div
                className="w-10 h-10 rounded-xl grid place-items-center font-extrabold text-[13px] shrink-0"
                style={{ color: SCORE_TONE[d.score], background: `${SCORE_TONE[d.score]}20` }}
              >
                {d.score}
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold text-ink mb-0.75">{d.name}</div>
                <div className="text-[12px] text-dim">Yield {d.roi} · IRR {d.irr} · {d.price} · Saved {d.saved}</div>
              </div>
              <button className="text-[12px] font-bold px-3.5 py-1.75 rounded-lg border-none bg-sea text-white cursor-pointer shrink-0">
                Open
              </button>
            </div>
          ))}
          <button className="w-full py-2.75 rounded-full border-[1.5px] border-sea bg-transparent text-sea font-sans text-[13px] font-bold cursor-pointer">
            + New deal analysis
          </button>
        </div>
      </Card>
    ),

    requests: (
      <Card title={<><ClipboardList size={13} className="shrink-0" /> Buyer Requests</>} sub="Investors seeking co-investment or off-market deals" padded={false}>

        {/* Mobile card rows */}
        <div className="sm:hidden divide-y divide-line">
          {REQUESTS.map((r, i) => (
            <div key={i} className="px-4 py-3.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-ink">{r.buyer}</div>
                <div className="text-[11px] text-dim">{r.time}</div>
              </div>
              <div className="text-[12px] text-dim">{r.region} · {r.type} · {r.budget}</div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block p-5">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_100px] gap-3 pb-2.5 border-b border-line mb-1">
            {['Buyer', 'Region', 'Budget', 'Type', 'Time'].map((h, i) => (
              <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
            ))}
          </div>
          {REQUESTS.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr_1fr_1fr_100px] gap-3 py-3 items-center ${i < REQUESTS.length - 1 ? 'border-b border-line-soft' : ''}`}
            >
              <div className="text-[13.5px] font-semibold text-ink">{r.buyer}</div>
              <div className="text-[13px] text-ink2">{r.region}</div>
              <div className="text-[13px] text-ink2">{r.budget}</div>
              <div className="text-[13px] text-ink2">{r.type}</div>
              <div className="text-[12px] text-dim">{r.time}</div>
            </div>
          ))}
        </div>

      </Card>
    ),

    market: (
      <div className="flex flex-col gap-5">

        {/* Regional yields */}
        <Card title={<><Globe size={13} className="shrink-0" /> Regional Yields & Growth</>} padded={false}>

          {/* Mobile card rows */}
          <div className="sm:hidden divide-y divide-line">
            {REGIONS.map((r, i) => (
              <div key={i} className="px-4 py-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[13.5px] font-semibold text-ink">{r.name}</div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[13px] font-bold text-brand">{r.yield}%</span>
                    <span className={`text-[12px] font-semibold ${r.trend === '↑' ? 'text-brand' : 'text-dim'}`}>{r.growth}</span>
                    <span className="text-[12px] text-dim">{r.price}</span>
                  </div>
                </div>
                <div className="h-1 rounded-full bg-line-soft">
                  <div className="h-1 rounded-full bg-sea" style={{ width: `${r.yield / 10 * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block p-5">
            <div className="grid grid-cols-[1fr_80px_100px_100px] gap-3 pb-2.5 border-b border-line mb-1">
              {['Region', 'Yield', 'Avg Price', 'Growth'].map((h, i) => (
                <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
              ))}
            </div>
            {REGIONS.map((r, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_80px_100px_100px] gap-3 py-3 items-center ${i < REGIONS.length - 1 ? 'border-b border-line-soft' : ''}`}
              >
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{r.name}</div>
                  <div className="h-1 rounded-full bg-line-soft mt-1.5 w-30">
                    <div className="h-1 rounded-full bg-sea" style={{ width: `${r.yield / 10 * 100}%` }} />
                  </div>
                </div>
                <div className="text-sm font-bold text-brand">{r.yield}%</div>
                <div className="text-[13px] text-ink2">{r.price}</div>
                <div className={`text-[13px] font-semibold ${r.trend === '↑' ? 'text-brand' : 'text-dim'}`}>{r.growth}</div>
              </div>
            ))}
          </div>

        </Card>

        {/* Market snapshot */}
        <Card title={<><BarChart2 size={13} className="shrink-0" /> Market Snapshot</>} sub="Dominican Republic · Q2 2026">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {SNAPSHOT.map((m, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#F8F9FC] border border-line-soft text-center">
                <div className="mb-1.5 flex justify-center text-sea">
                  <m.Icon size={20} />
                </div>
                <div className="font-serif text-[20px] font-bold text-ink">{m.value}</div>
                <div className="text-[11.5px] text-dim mt-0.75">{m.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),

    profile: (
      <Card title={<><User size={13} className="shrink-0" /> Investor Profile</>}>
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-line-soft">
          <div className="w-14 h-14 rounded-full bg-sea grid place-items-center text-white font-extrabold text-[22px] shrink-0">A</div>
          <div>
            <div className="font-serif text-xl font-bold text-ink">Alejandro Vega</div>
            <div className="text-[13px] text-dim">investor@demo.do</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Member since',   value: 'March 2025'   },
            { label: 'Portfolio size', value: '2 properties' },
            { label: 'Total invested', value: '$1.895M'      },
            { label: 'Deals analysed', value: '4'            },
          ].map((row, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#F8F9FC] border border-line-soft">
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
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-sea mb-1.5">
          Investor Portal · Alejandro Vega
        </div>
        <h1 className="font-serif text-[22px] sm:text-[26px] font-extrabold text-ink tracking-[-0.02em]">
          {PAGE_TITLES[view] ?? PAGE_TITLES.home}
        </h1>
      </div>
      {sections[view] ?? sections.home}
    </div>
  )
}

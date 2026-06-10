import { Users, Home, DollarSign, TrendingUp, Globe } from 'lucide-react'
import { TONE, BAR_DATA, MAX_BAR, REVENUE_DATA, MAX_REV, REGIONS } from './shared'

export function Analytics() {
  return (
    <>
      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4 lg:gap-4 lg:mb-6">
        {[
          { Icon: Users,      label: 'Total Users',        value: '1,284', delta: '+34 today',     color: '#0b63ab' },
          { Icon: Home,       label: 'Active Listings',    value: '4,847', delta: '+124 this week', color: '#1f7a3d' },
          { Icon: DollarSign, label: 'Monthly Revenue',    value: '$124K', delta: '+9% vs Apr',     color: TONE      },
          { Icon: TrendingUp, label: 'Avg Days on Market', value: '42',    delta: '−3 vs Apr',      color: '#f0a800' },
        ].map(({ Icon, label, value, delta, color }, i) => (
          <div key={i} className="bg-paper border border-line rounded-xl py-4.5 px-5">
            <Icon size={18} className="mb-2" color={color} />
            <div className="font-sans text-2xl font-bold text-ink leading-none">{value}</div>
            <div className="text-[12.5px] font-semibold mt-1.5 text-ink2">{label}</div>
            <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color }}>{delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">

        {/* Left: user growth + revenue */}
        <div className="flex flex-col gap-5">

          <div className="bg-paper border border-line rounded-2xl p-5.5">
            <div className="font-sans text-[17px] font-bold text-ink mb-0.5">User growth</div>
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
            <div className="font-sans text-[17px] font-bold text-ink mb-0.5">Revenue trend</div>
            <div className="text-xs text-dim mb-4">Monthly platform revenue (USD thousands)</div>
            <div className="relative h-28">
              <svg viewBox="0 0 300 96" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TONE} stopOpacity=".2" />
                    <stop offset="100%" stopColor={TONE} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points={REVENUE_DATA.map((d, i) => {
                    const x = (i / (REVENUE_DATA.length - 1)) * 280 + 10
                    const y = 86 - (d.rev / MAX_REV) * 76
                    return `${x},${y}`
                  }).join(' ') + ` 290,86 10,86`}
                  fill="url(#revGrad)"
                  stroke="none"
                />
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
                {REVENUE_DATA.map((d, i) => {
                  const x = (i / (REVENUE_DATA.length - 1)) * 280 + 10
                  const y = 86 - (d.rev / MAX_REV) * 76
                  const isLast = i === REVENUE_DATA.length - 1
                  return <circle key={i} cx={x} cy={y} r={isLast ? 4 : 2.5} fill={isLast ? TONE : '#fff'} stroke={TONE} strokeWidth="1.5" />
                })}
              </svg>
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
          <div className="font-sans text-[17px] font-bold text-ink mb-0.5">Listings by region</div>
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

          <div className="mt-5 pt-4 border-t border-line grid grid-cols-2 gap-3">
            {[
              { label: 'Avg price', value: '$487K' },
              { label: 'For rent',  value: '38%'   },
              { label: 'For sale',  value: '62%'   },
              { label: 'New (7d)',  value: '+124'   },
            ].map(({ label, value }, i) => (
              <div key={i} className="text-center py-2 bg-line-soft rounded-lg">
                <div className="font-sans text-[18px] font-bold text-ink">{value}</div>
                <div className="text-[11px] text-dim">{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

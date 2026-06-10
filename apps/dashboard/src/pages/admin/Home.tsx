import { useState } from 'react'
import { TONE, APPROVALS, KPIS, ACTIVITY, BAR_DATA, MAX_BAR, FilterPills, ApprovalRow } from './shared'

export function AdminHome({ go }: { go: (v: string) => void }) {
  const [filter, setFilter] = useState<'All' | 'Listing' | 'User'>('All')
  const filtered = APPROVALS.filter(a => filter === 'All' || a.type === filter)

  return (
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
            <div className={`font-sans text-2xl font-bold leading-none ${hl ? 'text-white' : 'text-ink'}`}>{value}</div>
            <div className={`text-[12.5px] font-semibold mt-1.5 ${hl ? 'text-white/80' : 'text-ink2'}`}>{label}</div>
            <div className={`text-[11px] mt-0.5 ${hl ? 'text-white/55' : 'text-dim'}`}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">

        {/* Approval queue preview */}
        <div className="bg-paper border border-line rounded-2xl overflow-hidden">
          <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-5.5 py-4 border-b border-line">
            <div className="font-sans text-[17px] font-bold text-ink">Approval queue</div>
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
            <div className="font-sans text-[17px] font-bold text-ink mb-1">User growth</div>
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
            <div className="font-sans text-[17px] font-bold text-ink mb-4">Recent activity</div>
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
  )
}

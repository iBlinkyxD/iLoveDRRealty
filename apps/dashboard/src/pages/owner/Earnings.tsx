import { DollarSign, Calendar, Home } from 'lucide-react'
import { Card, RoleKpiCard } from '../../components/dashboard/shared'
import { OWNER_REVENUE_BAR, OWNER_MAX_REV } from '../../components/dashboard/OwnerHome'

export function Earnings({ tone }: { tone: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          { Icon: DollarSign, label: 'Total This Year', value: '$44,100', sub: 'Jan–Jun 2026', hl: true },
          { Icon: Calendar,   label: 'This Month',      value: '$8,400',  sub: '+12% vs May'           },
          { Icon: Home,       label: 'Per Property',    value: '$4,200',  sub: 'Avg/mo'                },
        ].map((k, i) => <RoleKpiCard key={i} {...k} tone={tone} />)}
      </div>
      <Card title={<><DollarSign size={14} /> Monthly Revenue</>} sub="Jan – Jun 2026">
        <div className="flex items-end gap-2.5 h-32.5">
          {OWNER_REVENUE_BAR.map((d, i) => {
            const h = (d.rev / OWNER_MAX_REV) * 100
            const isLast = i === OWNER_REVENUE_BAR.length - 1
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.75">
                <div className={`text-[11px] ${isLast ? 'text-ink font-bold' : 'text-dim'}`}>${(d.rev / 1000).toFixed(1)}K</div>
                <div className="w-full rounded-t-lg" style={{ height: h, background: isLast ? tone : `${tone}50` }} />
                <div className="text-[11px] text-dim">{d.month}</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

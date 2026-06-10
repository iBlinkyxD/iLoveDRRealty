import { BookOpen } from 'lucide-react'
import { Card, CardLink } from '../../components/dashboard/shared'
import { BUYER_RESOURCES } from '../../components/dashboard/BuyerHome'

export function Resources() {
  return (
    <Card title={<><BookOpen size={14} />Resources</>}>
      {BUYER_RESOURCES.map(({ Icon, title, time }, i) => (
        <div key={i} className={`flex items-center gap-3.5 py-3.5 ${i < BUYER_RESOURCES.length - 1 ? 'border-b border-line' : ''}`}>
          <div className="text-ink2 shrink-0"><Icon size={20} /></div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-ink">{title}</div>
            <div className="text-[11.5px] text-dim">{time}</div>
          </div>
          <CardLink>Read →</CardLink>
        </div>
      ))}
    </Card>
  )
}

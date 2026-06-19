import { Calendar } from 'lucide-react'
import { Card } from '../../components/dashboard/shared'

export function OwnerCalendar({ tone }: { tone: string }) {
  return (
    <Card title={<><Calendar size={14} /> Booking Calendar</>} sub="Coming soon">
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${tone}15` }}>
          <Calendar size={26} style={{ color: tone }} />
        </div>
        <div className="text-center">
          <div className="text-[15px] font-bold text-ink mb-1">Booking Calendar</div>
          <p className="text-[13px] text-dim leading-[1.6] max-w-65">
            Track guest bookings, block dates, and manage availability — coming soon.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl text-[12px] font-semibold" style={{ background: `${tone}15`, color: tone }}>
          Coming Soon
        </div>
      </div>
    </Card>
  )
}

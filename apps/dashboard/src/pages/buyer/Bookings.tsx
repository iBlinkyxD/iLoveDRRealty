import { CalendarDays } from 'lucide-react'
import { Card, StatusPill, SceneThumb } from '../../components/dashboard/shared'

export function BuyerBookings() {
  return (
    <Card title={<><CalendarDays size={14} />Bookings</>}>
      <div className="flex items-center gap-3.5 py-2 border-b border-line">
        <SceneThumb v={0} />
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">Villa Paraíso — Beachfront Estate</div>
          <div className="text-[11.5px] text-dim">Jun 12–18, 2026 · 6 nights · 2 guests</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="font-sans font-bold text-ink">$8,676</div>
          <StatusPill label="Confirmed" />
        </div>
      </div>
      <div className="py-4 text-[13px] text-dim text-center">
        No other upcoming trips.{' '}
        <button className="bg-transparent border-0 text-sea font-bold cursor-pointer">Find a rental →</button>
      </div>
    </Card>
  )
}

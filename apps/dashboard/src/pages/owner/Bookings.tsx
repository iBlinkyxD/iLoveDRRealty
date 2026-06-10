import { Bell } from 'lucide-react'
import { Card, StatusPill } from '../../components/dashboard/shared'
import { OWNER_BOOKINGS } from '../../components/dashboard/OwnerHome'

export function OwnerBookings() {
  return (
    <Card title={<><Bell size={14} /> All Bookings ({OWNER_BOOKINGS.length})</>}>
      <div className="flex flex-col gap-3">
        {OWNER_BOOKINGS.map((b, i) => (
          <div key={i} className="py-3.5 px-4 rounded-[10px] bg-[#F8F9FC] border border-line">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-[13.5px] font-bold text-ink">{b.guest}</div>
                <div className="text-xs text-dim mt-0.5">{b.property} · {b.dates} · {b.nights} nights</div>
              </div>
              <StatusPill label={b.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-brand">{b.total}</span>
              {b.status === 'Pending' && (
                <div className="flex gap-2">
                  <button className="text-xs font-bold py-1.5 px-3.5 rounded-lg border-none bg-brand text-white cursor-pointer">Accept</button>
                  <button className="text-xs font-bold py-1.5 px-3.5 rounded-lg border border-line bg-white text-ink2 cursor-pointer">Decline</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

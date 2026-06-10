import { Calendar } from 'lucide-react'
import { Card, StatusPill } from '../../components/dashboard/shared'
import { OWNER_CAL_EVENTS } from '../../components/dashboard/OwnerHome'

export function OwnerCalendar({ tone }: { tone: string }) {
  return (
    <Card title={<><Calendar size={14} /> Booking Calendar</>} sub="June – August 2026">
      <div className="flex flex-col gap-3">
        {OWNER_CAL_EVENTS.map((e, i) => (
          <div key={i} className="flex items-center gap-3.5 py-3.5 px-4 rounded-[10px] bg-[#F8F9FC] border border-line border-l-4" style={{ borderLeftColor: e.tone }}>
            <div className="flex-1">
              <div className="text-[13.5px] font-bold text-ink">{e.guest}</div>
              <div className="text-xs text-dim mt-0.5">{e.property} · {e.date}</div>
            </div>
            <StatusPill label="Confirmed" />
          </div>
        ))}
        <div className="p-4 rounded-[10px] text-center text-[13px] font-semibold border border-dashed" style={{ background: `${tone}10`, borderColor: tone, color: tone }}>
          + Block dates / Add availability
        </div>
      </div>
    </Card>
  )
}

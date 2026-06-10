import { Calendar } from 'lucide-react'
import { Card } from '../../components/dashboard/shared'
import { REALTOR_CAL_EVENTS, REALTOR_EVENT_TONE } from '../../components/dashboard/RealtorHome'

export function RealtorCalendar() {
  return (
    <Card title={<><Calendar size={14} /> Upcoming Schedule</>} sub="Showings, calls & meetings">
      <div className="flex flex-col gap-3">
        {REALTOR_CAL_EVENTS.map((e, i) => {
          const evTone = REALTOR_EVENT_TONE[e.type] ?? '#7884a0'
          return (
            <div key={i} className="flex items-center gap-3.5 py-3.5 px-4 rounded-[10px] bg-[#F8F9FC] border border-line border-l-4" style={{ borderLeftColor: evTone }}>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold text-ink mb-0.75">{e.client}</div>
                <div className="text-xs text-dim">{e.property} · {e.date}</div>
              </div>
              <span className="text-[11px] font-bold py-0.75 px-2.25 rounded-full shrink-0" style={{ color: evTone, background: `${evTone}18` }}>
                {e.type}
              </span>
            </div>
          )
        })}
        <button className="w-full py-2.75 rounded-full border-2 border-brand bg-transparent text-brand text-[13px] font-bold cursor-pointer">
          + Schedule showing
        </button>
      </div>
    </Card>
  )
}

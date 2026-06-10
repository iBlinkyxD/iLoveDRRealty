import { ClipboardList } from 'lucide-react'
import { Card, StatusPill } from '../../components/dashboard/shared'
import { REALTOR_LEADS, LEAD_STATUS_TONE } from '../../components/dashboard/RealtorHome'

export function RealtorLeads() {
  return (
    <Card title={<><ClipboardList size={14} /> All Leads ({REALTOR_LEADS.length})</>} padded={false}>
      <div className="hidden sm:block">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px_80px] gap-3 py-2.5 px-5.5 border-b border-line">
          {['Name', 'Region', 'Budget', 'Type', 'Status', 'Time'].map((h, i) => (
            <div key={i} className="text-[11.5px] font-bold text-dim uppercase tracking-[.06em]">{h}</div>
          ))}
        </div>
        {REALTOR_LEADS.map((l, i) => (
          <div key={i} className={`grid grid-cols-[1fr_1fr_1fr_1fr_80px_80px] gap-3 py-3 px-5.5 items-center ${i < REALTOR_LEADS.length - 1 ? 'border-b border-line' : ''}`}>
            <div className="text-[13.5px] font-semibold text-ink">{l.name}</div>
            <div className="text-[13px] text-ink2">{l.region}</div>
            <div className="text-[13px] text-ink2">{l.budget}</div>
            <div className="text-[13px] text-ink2">{l.type}</div>
            <StatusPill label={l.status} tone={LEAD_STATUS_TONE[l.status]} />
            <div className="text-xs text-dim">{l.time}</div>
          </div>
        ))}
      </div>
      <div className="sm:hidden divide-y divide-line">
        {REALTOR_LEADS.map((l, i) => (
          <div key={i} className="px-4 py-3.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13.5px] font-semibold text-ink">{l.name}</div>
              <StatusPill label={l.status} tone={LEAD_STATUS_TONE[l.status]} />
            </div>
            <div className="text-[12px] text-dim">{l.region} · {l.type} · {l.budget} · {l.time}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

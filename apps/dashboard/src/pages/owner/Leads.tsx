import { MessageCircle } from 'lucide-react'
import { Card } from '../../components/dashboard/shared'
import { OWNER_LEADS } from '../../components/dashboard/OwnerHome'

export function OwnerLeads({ tone }: { tone: string }) {
  return (
    <Card
      title={<><MessageCircle size={14} /> All Leads ({OWNER_LEADS.length})</>}
      action={<span className="text-[11.5px] font-bold text-coral px-2.5 py-0.75 rounded-full" style={{ background: '#e10f1f15' }}>4 new</span>}
      padded={false}
    >
      <div>
        {OWNER_LEADS.map((l, i) => (
          <div key={i} className={`flex items-start gap-3 py-3.5 px-5.5 ${i < OWNER_LEADS.length - 1 ? 'border-b border-line' : ''}`}>
            <div className="w-9.5 h-9.5 rounded-full shrink-0 grid place-items-center font-bold text-sm text-white" style={{ background: l.tone }}>
              {l.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[13.5px] font-bold text-ink">{l.name}</div>
                  <div className="text-[12.5px] text-ink2 leading-[1.35] my-0.75">{l.query}</div>
                  <div className="text-[11.5px] text-dim">{l.property} · {l.time}</div>
                </div>
                <button className="text-xs font-bold py-1.5 px-3.5 rounded-lg border-none text-white cursor-pointer shrink-0 ml-3" style={{ background: tone }}>
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

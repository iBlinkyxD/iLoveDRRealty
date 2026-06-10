import { Home } from 'lucide-react'
import { Card, StatusPill } from '../../components/dashboard/shared'
import { OWNER_LISTINGS } from '../../components/dashboard/OwnerHome'

export function OwnerListings({ tone }: { tone: string }) {
  return (
    <Card title={<><Home size={14} /> My Listings ({OWNER_LISTINGS.length})</>}>
      <div className="flex flex-col gap-3.5">
        {OWNER_LISTINGS.map(l => (
          <div key={l.id} className="flex items-center gap-3.5 py-3.5 px-4 rounded-xl bg-[#F8F9FC] border border-line">
            <div className="w-11 h-11 rounded-[10px] shrink-0 flex items-center justify-center" style={{ background: `${tone}25` }}>
              <Home size={20} style={{ color: tone }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="text-sm font-bold text-ink truncate">{l.name}</div>
                <StatusPill label={l.status} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-3 flex-wrap">
                  {[{ label: 'Price', v: l.price }, { label: 'Views', v: l.views.toLocaleString() }, { label: 'Leads', v: l.inquiries }, { label: 'Bookings', v: l.bookings }].map((m, j) => (
                    <div key={j}>
                      <div className="text-[12.5px] font-bold text-ink">{m.v}</div>
                      <div className="text-[10.5px] text-dim">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="text-xs font-bold py-1.5 px-3 rounded-lg border bg-transparent cursor-pointer" style={{ borderColor: tone, color: tone }}>Edit</button>
                  <button className="text-xs font-bold py-1.5 px-3 rounded-lg border border-line bg-white text-ink2 cursor-pointer">View</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="w-full py-2.75 rounded-full border-2 bg-transparent font-sans text-[13px] font-bold cursor-pointer" style={{ borderColor: tone, color: tone }}>
          + Add new listing
        </button>
      </div>
    </Card>
  )
}

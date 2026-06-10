import { Heart, MapPin } from 'lucide-react'
import { Card, CardLink, StatusPill, SceneThumb, fmtPrice } from '../../components/dashboard/shared'
import { BUYER_LISTINGS } from '../../components/dashboard/BuyerHome'

export function SavedHomes() {
  return (
    <Card title={<><Heart size={14} />Saved Homes ({BUYER_LISTINGS.length})</>} action={<CardLink>Browse more →</CardLink>} padded={false}>
      <div className="px-3 sm:px-5">
        {BUYER_LISTINGS.map((l, i) => (
          <div key={l.id} className={`flex items-center gap-3 py-3 ${i < BUYER_LISTINGS.length - 1 ? 'border-b border-line' : ''}`}>
            <SceneThumb v={l.v} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink truncate">{l.title}</div>
              <div className="text-[11px] text-dim mt-0.5 flex items-center gap-1"><MapPin size={10} className="shrink-0" />{l.region} · {l.bd}bd · {l.ba}ba</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="text-[13px] font-bold text-ink">{fmtPrice(l.price)}</div>
              <StatusPill label="Saved" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
